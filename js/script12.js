document.addEventListener('DOMContentLoaded', function() {

    window.addEventListener('scroll', function () {
        const sticky = document.getElementById('sticky-container1');
        const alice = document.getElementById('alicecena1');
        if (!sticky || !alice) return;

        const rect = sticky.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const stickyHeight = sticky.offsetHeight;

        // Quanto do sticky-container1 já foi rolado (0 a 1)
        const scrollTop = Math.max(0, windowHeight - rect.top);
        const progress = Math.min(1, scrollTop / stickyHeight);

        // Entrada entre 5% e 15%
        if (progress < 0.05) {
            alice.style.left = '-100vw';
        } else if (progress >= 0.05 && progress < 0.15) {
            const moveIn = (progress - 0.05) / 0.1;
            alice.style.left = `calc(${(-100 + 100 * moveIn)}vw)`;
        }
        // Fica no centro entre 15% e 50%
        else if (progress >= 0.15 && progress < 0.5) {
            alice.style.left = '0vw';
        }
        // Saída entre 50% e 60%
        else if (progress >= 0.5 && progress < 0.6) {
            const moveOut = (progress - 0.5) / 0.1;
            alice.style.left = `calc(${-100 * moveOut}vw)`;
        }
        // Após 60%, já saiu
        else if (progress >= 0.6) {
            alice.style.left = '-100vw';
        }

        // Rainha animação ao scroll de 70% a 80%
        const rainha = document.getElementById('rainhacena2');
        if (rainha && sticky) {
            const rect = sticky.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const stickyHeight = sticky.offsetHeight;
            const scrollTop = Math.max(0, windowHeight - rect.top);
            const progress = Math.min(1, scrollTop / stickyHeight);

            if (progress < 0.7) {
                rainha.style.bottom = '-100vh';
                rainha.style.transform = 'translateX(-50%) scale(0.5)';
            } else if (progress >= 0.7 && progress < 0.8) {
                const moveIn = (progress - 0.7) / 0.1;
                rainha.style.bottom = `calc(${-100 + 100 * moveIn}vh)`;
                const scale = 0.5 + 0.5 * moveIn;
                rainha.style.transform = `translateX(-50%) scale(${scale})`;
            } else {
                rainha.style.bottom = '0';
                rainha.style.transform = 'translateX(-50%) scale(1)';
            }
        }
    });
});