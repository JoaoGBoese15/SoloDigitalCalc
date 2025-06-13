let unidadeSelecionada = 'microS';

function selecionarUnidade(unidade) {
    document.querySelectorAll('.unit-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.querySelector(`[data-unit="${unidade}"]`).classList.add('active');
    
    unidadeSelecionada = unidade;
}

function Calcular() {
    const condutividadeBruta = parseFloat(document.getElementById('condutividade').value);
    const temperatura = parseFloat(document.getElementById('temperatura').value);
    const epsilon = parseFloat(document.getElementById('epsilon').value);
    
    if (isNaN(condutividadeBruta) || isNaN(temperatura) || isNaN(epsilon)) {
        document.getElementById('resultado').innerHTML = 'Por favor, preencha todos os campos com valores válidos.';
        return;
    }

    const button = document.querySelector('.action-button');
    const originalText = button.textContent;
    
    button.textContent = 'Calculando...';
    button.style.background = 'linear-gradient(135deg, #cbd5e0 0%, #a0aec0 100%)';
    button.disabled = true;
    
    setTimeout(() => {
        // Converter a condutividade para mS/cm, se necessário
        let B = condutividadeBruta;
        if (unidadeSelecionada === 'microS') {
            B = condutividadeBruta / 1000;
        }

        // Calcular EP com base na Temperatura
        const EP = 80.3 - 0.37 * (temperatura - 20);

        // Calcular o resultado final
        const C = EP * B / (epsilon - 2);

        // Exibir o resultado formatado
        const resultadoHTML = `
            <div style="text-align: center;">
                <span style="font-size: 1.2em; color: #122344;">EC Corrigido (C)</span><br>
                <strong style="font-size: 2.2em; color: #3ca95e; font-weight: 700;">${C.toFixed(2)}</strong>
                <span style="font-size: 1.2em; color: #122344;">mS/cm</span>
                <hr style="margin: 15px 0; border-top: 1px solid #ddd;">
                <small style="color: #4a5568;">
                    <em>Detalhes do Cálculo:</em><br>
                    EC Bruto (B) usado: ${B.toFixed(4)} mS/cm<br>
                    Valor de EP calculado: ${EP.toFixed(2)}
                </small>
            </div>
        `;
        
        document.getElementById('resultado').innerHTML = resultadoHTML;
        
        // Restaura o botão ao estado original
        button.textContent = originalText;
        button.style.background = 'linear-gradient(135deg, #3ca95e 0%, #3ca95e 100%)';
        button.disabled = false;
    }, 1000);
}

// Adicionar efeito de hover nos cards
document.querySelectorAll('.input-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Registra o Service Worker para PWA Standalone
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            console.log('Iniciando registro do Service Worker...');
            
            // Registra o service worker
            const registration = await navigator.serviceWorker.register('./service-worker.js', {
                scope: './',
                updateViaCache: 'none' // Não usa cache para o service worker
            });
            
            console.log('Service Worker registrado:', registration.scope);
            
            // Força atualização se necessário
            if (registration.waiting) {
                registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            }
            
            // Escuta por atualizações
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                console.log('Nova versão do Service Worker encontrada');
                
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed') {
                        if (navigator.serviceWorker.controller) {
                            console.log('Atualização disponível');
                            newWorker.postMessage({ type: 'SKIP_WAITING' });
                        } else {
                            console.log('Service Worker instalado pela primeira vez');
                        }
                    }
                    
                    if (newWorker.state === 'activated') {
                        console.log('Service Worker ativado');
                        window.location.reload();
                    }
                });
            });
            
            // Verifica status do cache após 2 segundos
            setTimeout(() => {
                if (registration.active) {
                    const messageChannel = new MessageChannel();
                    messageChannel.port1.onmessage = (event) => {
                        console.log('Status do cache:', event.data);
                    };
                    
                    registration.active.postMessage(
                        { type: 'GET_CACHE_STATUS' }, 
                        [messageChannel.port2]
                    );
                }
            }, 2000);
            
        } catch (error) {
            console.error('Erro ao registrar Service Worker:', error);
        }
    });
    
    // Escuta mensagens do service worker
    navigator.serviceWorker.addEventListener('message', event => {
        console.log('Mensagem do Service Worker:', event.data);
        
        if (event.data.type === 'CACHE_STATUS') {
            console.log(`Cache contém ${event.data.cacheSize} arquivos`);
        }
    });
    
    // Detecta se está sendo executado como PWA instalada
    window.addEventListener('DOMContentLoaded', () => {
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                           window.navigator.standalone || 
                           document.referrer.includes('android-app://');
        
        if (isStandalone) {
            console.log('Executando como PWA instalada');
            document.body.classList.add('pwa-standalone');
        }
    });
}