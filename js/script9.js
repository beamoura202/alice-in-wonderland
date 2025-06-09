// Coloque este script após o carregamento do DOM
window.addEventListener('scroll', function() {
    const container = document.getElementById('sticky-container2');
    const personagem = document.getElementById('personagem1cena2');
    if (!container || !personagem) return;

    const rect = container.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Calcula o quanto do container já foi rolado (0 = topo visível, 1 = base visível)
    const scrollProgress = Math.min(Math.max((windowHeight - rect.top) / rect.height, 0), 1);

    // Animação linear: 0 até 40% do scroll
    if (scrollProgress < 0.4) {
        // Normaliza para 0~1 dentro do intervalo de animação
        const t = scrollProgress / 0.4;
        const left = -50 + t * (15 + 50); // de -50 até 5
        personagem.style.left = `${left}vw`;
    } else {
        personagem.style.left = '15vw';
    }
});