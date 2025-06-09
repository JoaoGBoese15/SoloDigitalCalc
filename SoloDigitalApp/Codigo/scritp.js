// Variável para armazenar a unidade selecionada
let unidadeSelecionada = 'microS';

function selecionarUnidade(unidade) {
    // Remove a classe active de todos os botões
    document.querySelectorAll('.unit-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Adiciona a classe active ao botão clicado
    document.querySelector(`[data-unit="${unidade}"]`).classList.add('active');
    
    // Atualiza a variável global
    unidadeSelecionada = unidade;
}

function Calcular() {
    const condutividadeBruta = parseFloat(document.getElementById('condutividade').value); // Valor B
    const temperatura = parseFloat(document.getElementById('temperatura').value); // Valor T
    const epsilon = parseFloat(document.getElementById('epsilon').value); // Valor E
    
    // Validação básica
    if (isNaN(condutividadeBruta) || isNaN(temperatura) || isNaN(epsilon)) {
        document.getElementById('resultado').innerHTML = 'Por favor, preencha todos os campos com valores válidos.';
        return;
    }

    const button = document.querySelector('.action-button');
    const originalText = button.textContent;
    
    button.textContent = 'Calculando...';
    button.style.background = 'linear-gradient(135deg, #cbd5e0 0%, #a0aec0 100%)';
    button.disabled = true;
    
    // Simula um pequeno tempo de processamento para melhor experiência do usuário
    setTimeout(() => {
        // --- INÍCIO DA LÓGICA DE CÁLCULO ---

        // 1. Converter a condutividade (B) para mS/cm, se necessário.
        // A fórmula final exige que B esteja em mS/cm.
        let B = condutividadeBruta;
        if (unidadeSelecionada === 'microS') {
            B = condutividadeBruta / 1000; // Converte de µS/cm para mS/cm
        }

        // 2. Calcular EP com base na Temperatura (T).
        // Fórmula: EP = 80,3 - 0,37 * (T - 20)
        const EP = 80.3 - 0.37 * (temperatura - 20);

        // 3. Calcular o resultado final (C).
        // Fórmula: C = EP * B / E - 2
        const C = EP * B / (epsilon - 2);

        // --- FIM DA LÓGICA DE CÁLCULO ---

        // 4. Exibir o resultado formatado.
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
    }, 1000); // 1 segundo de "processamento"
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
