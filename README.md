# SoloDigital Calc

![Logo](Codigo/logo.png)

**Uma calculadora web para converter a condutividade elétrica (EC) medida em campo para o valor real disponível para as plantas.**

link: https://solodigitalcalc.netlify.app/

---

## 📖 Sobre o Projeto

O **SoloDigital Calc** é um protótipo de aplicativo web desenvolvido para funcionar em conjunto com o equipamento SoloDigital da IrriGate.

O objetivo principal é auxiliar produtores rurais a transformar, de forma simples e precisa, a leitura da condutividade elétrica (EC) da água, fornecida pelo equipamento, no valor real do EC disponível para as plantas. A ferramenta leva em consideração as variáveis do solo ou substrato, auxiliando na tomada de decisões sobre irrigação e adubação com mais segurança e eficiência.

## ✨ Funcionalidades Principais

* **Cálculo de Condutividade Elétrica:** Converte a leitura bruta do equipamento para o EC real do solo.
* **Ajuste por Temperatura:** Utiliza a temperatura como variável para corrigir o cálculo.
* **Entrada de Epsilon:** Permite a inserção do valor de Epsilon (permitividade dielétrica) lido pelo equipamento.
* **Seleção de Unidade:** Oferece a opção de inserir a condutividade em µS/cm ou mS/cm.
* **Interface Responsiva:** O layout se adapta a diferentes tamanhos de tela, de desktops a celulares.
* **Progressive Web App (PWA):** Pode ser "instalado" em dispositivos móveis para acesso rápido e funcionamento offline.

## 🛠️ Tecnologias Utilizadas

* HTML5
* CSS3
* JavaScript (Vanilla)

## 🚀 Como Usar

Para utilizar a calculadora, siga os passos:

1.  Acesse a aplicação através do seu navegador.
2.  No campo **Condutividade Elétrica (EC)**, insira o valor medido e selecione a unidade correta (µS/cm ou mS/cm).
3.  Insira a **Temperatura** em graus Celsius (°C).
4.  Insira o valor de **Epsilon** medido pelo equipamento.
5.  Clique no botão **"Calcular"**.
6.  O resultado será exibido na seção **"Resultado"**.

### Como Instalar o PWA

Para uma experiência mais integrada, você pode adicionar o aplicativo à sua tela inicial:

* **No Android:** Abra o site no Chrome, toque no menu (três pontinhos) e selecione "Instalar aplicativo" ou "Adicionar à tela inicial".
* **No iOS:** Abra o site no Safari, toque no ícone de compartilhamento e selecione "Adicionar à Tela de Início".

## 🤝 Contribuição

Contribuições são o que tornam a comunidade de código aberto um lugar incrível para aprender, inspirar e criar. Qualquer contribuição que você fizer será **muito apreciada**.

1.  Faça um *Fork* do projeto
2.  Crie uma *Branch* para sua feature (`git checkout -b feature/AmazingFeature`)
3.  Faça o *Commit* de suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4.  Faça o *Push* para a Branch (`git push origin feature/AmazingFeature`)
5.  Abra um *Pull Request*

## 📝 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.
