document.addEventListener('DOMContentLoaded', function() {
    const stickyContainer = document.getElementById('sticky-container');
    const floresImg = document.getElementById('flores');
    const carta1 = document.getElementById('carta1');
    const carta23 = document.getElementById('carta23');
    const rainha1 = document.getElementById('rainha1'); // Adicione esta linha

    let cartasTimeout;

    if (!stickyContainer || !floresImg) return;

    function updateFloresOpacity() {
        const rect = stickyContainer.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const totalHeight = stickyContainer.offsetHeight;
        const scrolled = Math.min(Math.max(windowHeight - rect.top, 0), totalHeight);
        const percent = scrolled / totalHeight;

        if (percent < 0.2) {
            floresImg.style.opacity = 1;
        } else if (percent >= 0.2 && percent <= 0.3) {
            floresImg.style.opacity = 1 - ((percent - 0.2) / 0.1);
        } else if (percent > 0.3) {
            floresImg.style.opacity = 0;
        }
    }

    function updateCartas() {
        const rect = stickyContainer.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const totalHeight = stickyContainer.offsetHeight;
        const scrolled = Math.min(Math.max(windowHeight - rect.top, 0), totalHeight);
        const percent = scrolled / totalHeight;

        if (percent >= 0.5) {
            [carta1, carta23].forEach(img => {
                img.style.transition = 'bottom 0.6s';
                img.style.position = 'absolute';
                img.style.bottom = '-50vh';
            });
            if (rainha1) {
                rainha1.style.transition = 'bottom 0.6s';
                rainha1.style.position = 'absolute';
                rainha1.style.bottom = '0';
            }
            if (cartasTimeout) clearTimeout(cartasTimeout);
            cartasTimeout = setTimeout(() => {
                [carta1, carta23].forEach(img => {
                    img.style.transition = 'opacity 0.2s';
                    img.style.opacity = '0';
                });
            }, 600);
        } else {
            if (cartasTimeout) clearTimeout(cartasTimeout);
            [carta1, carta23].forEach(img => {
                img.style.transition = 'opacity 0.2s, bottom 0.6s';
                img.style.opacity = '1';
                img.style.position = '';
                img.style.bottom = '';
            });
            if (rainha1) {
                rainha1.style.transition = 'bottom 0.6s';
                rainha1.style.position = '';
                rainha1.style.bottom = '';
            }
        }
    }

    // Efeito espelho infinito para cartascena3 com aumento percentual (maior em cima)
    const cena3Container = document.querySelector('#cena3 .scene-container');
    const baseCarta = document.getElementById('cartascena3');
    const numCopies = 10; // Quantas imagens sobrepostas
    const baseHeight = 15; // em vh (altura da menor carta)
    const percentIncrease = 1.4; // 30% maior que a anterior

    // Guarda os tamanhos base das cartas do espelho
    let cartaBaseHeights = [];
    if (cena3Container && baseCarta) {
        baseCarta.remove();
        let currentHeight = baseHeight;
        for (let i = 0; i < numCopies; i++) {
            const img = document.createElement('img');
            img.src = 'imgcap8/cartascena3.png';
            img.id = i === numCopies - 1 ? 'cartascena3' : '';
            img.style.position = 'absolute';
            img.style.top = '50%';
            img.style.left = '50%';
            img.style.transform = 'translate(-50%, -50%)';
            img.style.height = currentHeight + 'vh';
            img.style.width = 'auto';
            img.style.zIndex = 4 + i;
            img.style.pointerEvents = 'none';
            img.style.opacity = 1;
            cena3Container.appendChild(img);
            cartaBaseHeights.push(currentHeight); // Guarda o tamanho base
            currentHeight = currentHeight * percentIncrease;
        }
    }

    // --- Efeito de crescimento com scroll para cartas e Alice ---
    function updateCartasCena3Scale() {
        const sticky2 = document.getElementById('sticky-container2');
        const cena3 = document.getElementById('cena3');
        const alice = document.getElementById('alicecena3');
        const cartas = Array.from(document.querySelectorAll('#cena3 .scene-container img[src*="cartascena3.png"]'));
        if (!sticky2 || !cena3 || !alice || cartas.length === 0) return;

        const rect = sticky2.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const totalHeight = sticky2.offsetHeight;

        // Calcula o quanto já foi feito scroll dentro do sticky-container2
        let scrolled = Math.min(Math.max(windowHeight - rect.top, 0), totalHeight);
        let percent = scrolled / totalHeight;

        // Só começa o efeito a partir de 10%
        if (percent < 0.1) percent = 0;
        else percent = (percent - 0.1) / 0.9; // Normaliza para [0,1] a partir dos 10%

        percent = Math.max(0, Math.min(1, percent));

        // Defina os tamanhos base e máximo
        const aliceBase = 10; // vh
        const aliceMax = 30;  // vh

        // Atualiza Alice
        alice.style.height = (aliceBase + (aliceMax - aliceBase) * percent) + 'vh';

        // Atualiza cada carta com o seu base individual
        cartas.forEach((img, i) => {
            const base = cartaBaseHeights[i];
            const max = base * 3; // ou outro multiplicador se quiseres
            const newH = base + (max - base) * percent;
            img.style.height = newH + 'vh';
        });
    }

    window.addEventListener('scroll', updateFloresOpacity);
    window.addEventListener('resize', updateFloresOpacity);
    window.addEventListener('scroll', updateCartas);
    window.addEventListener('resize', updateCartas);
    window.addEventListener('scroll', updateCartasCena3Scale);
    window.addEventListener('resize', updateCartasCena3Scale);
    // Também chama ao carregar
    updateFloresOpacity();
    updateCartas();
    updateCartasCena3Scale();
});