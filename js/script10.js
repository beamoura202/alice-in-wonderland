window.addEventListener('scroll', function() {
    const scrollTop = window.scrollY || window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.min(scrollTop / docHeight, 1);

    const divPedra = document.querySelector('.divpedra');
    const personagem = document.querySelector('#personagem1cena1');
    const danca = document.querySelector('.danca');

    // Move .danca proporcional ao scroll de -100vw até 0
    if (danca) {
        const left = (-100 + 100 * scrollPercent) + 'vw';
        danca.style.left = left;
    }

    if (scrollPercent >= 0.2) {
        if (divPedra) divPedra.classList.add('move-right');
        if (personagem) personagem.classList.add('move-left');
    } else {
        if (divPedra) divPedra.classList.remove('move-right');
        if (personagem) personagem.classList.remove('move-left');
    }
});

function animarDanca() {
    const p1 = document.getElementById('personagem1cena2');
    const p2 = document.getElementById('personagem2cena2');
    const p3 = document.getElementById('personagem3cena2');
    const p4 = document.getElementById('personagem4cena2');

    // 1. Gira 2 vezes no lugar
    [p1, p2, p3, p4].forEach(img => {
        img.classList.add('girar');
    });

    setTimeout(() => {
        [p1, p2, p3, p4].forEach(img => {
            img.classList.remove('girar');
        });

        // 2. Translada para o lugar do par
        const rect1 = p1.getBoundingClientRect();
        const rect2 = p2.getBoundingClientRect();
        const rect3 = p3.getBoundingClientRect();
        const rect4 = p4.getBoundingClientRect();

        const dx12 = rect2.left - rect1.left;
        const dx34 = rect4.left - rect3.left;

        p1.style.transition = 'transform 0.8s cubic-bezier(0.4,0,0.2,1)';
        p2.style.transition = 'transform 0.8s cubic-bezier(0.4,0,0.2,1)';
        p3.style.transition = 'transform 0.8s cubic-bezier(0.4,0,0.2,1)';
        p4.style.transition = 'transform 0.8s cubic-bezier(0.4,0,0.2,1)';

        p1.style.transform = `translateX(${dx12}px)`;
        p2.style.transform = `translateX(${-dx12}px)`;
        p3.style.transform = `translateX(${dx34}px)`;
        p4.style.transform = `translateX(${-dx34}px)`;

        // 3. Volta para o lugar original
        setTimeout(() => {
            p1.style.transform = '';
            p2.style.transform = '';
            p3.style.transform = '';
            p4.style.transform = '';

            // 4. Espera e repete
            setTimeout(animarDanca, 1000);
        }, 900);

    }, 1200); // tempo da rotação
}

// Inicia a animação ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('personagem1cena2').style.order = 1;
    document.getElementById('personagem2cena2').style.order = 2;
    document.getElementById('personagem3cena2').style.order = 3;
    document.getElementById('personagem4cena2').style.order = 4;
    animarDanca();
});