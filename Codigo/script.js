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
                <span style="font-size: 1.2em; color: #122344;">EC do Solo</span><br>
                <strong style="font-size: 2.2em; color: #3ca95e; font-weight: 700;">${C.toFixed(2)}</strong>
                <span style="font-size: 1.2em; color: #122344;">mS/cm</span>
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

// Registra o Service Worker para PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            console.log('Iniciando registro do Service Worker...');
            
            const registration = await navigator.serviceWorker.register('./service-worker.js', {
                scope: './'
            });
            
            console.log('Service Worker registrado:', registration.scope);
            
        } catch (error) {
            console.error('Erro ao registrar Service Worker:', error);
        }
    });
}

// Controla a animação da tela de splash
window.addEventListener('load', () => {
    const splash = document.querySelector('.splash-screen');
    
    // Adiciona um pequeno atraso para que a splash screen seja visível
    setTimeout(() => {
        if (splash) {
            splash.classList.add('hidden');
        }
    }, 500); // 500ms = meio segundo
});