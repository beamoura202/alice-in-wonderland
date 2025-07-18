document.addEventListener('DOMContentLoaded', function() {
    const mushrooms = [
        document.getElementById('cap5cena1detalhes1-img'),
        document.getElementById('cap5cena1detalhes2-img'),
        document.getElementById('cap5cena1detalhes3-img')
    ];

    function toggleMushroom(mushroom) {
        const isVisible = !mushroom.classList.contains('popup-appear');
        
        if (isVisible) {
            mushroom.classList.remove('popup-disappear');
            mushroom.classList.add('popup-appear');
        } else {
            mushroom.classList.remove('popup-appear');
            mushroom.classList.add('popup-disappear');
        }
    }

    function randomToggle() {
        const randomMushroom = mushrooms[Math.floor(Math.random() * mushrooms.length)];
        toggleMushroom(randomMushroom);
        
        // Set next random interval between 1 and 3 seconds
        const nextInterval = Math.random() * 2000 + 1000;
        setTimeout(randomToggle, nextInterval);
    }

    // Start the random toggling
    randomToggle();

    const sectionFolhas = document.getElementById('sectionfolhas');
    const lagarta = document.getElementById('cap5cena1lagarta2-img');
    let animationTriggered = false;

    window.addEventListener('scroll', function() {
        const folhasRect = sectionFolhas.getBoundingClientRect();
        const sectionTop = folhasRect.top;
        const sectionHeight = sectionFolhas.offsetHeight;
        const viewportHeight = window.innerHeight;
        
        // Método mais preciso: calcula baseado na posição da seção em relação à viewport
        // scrollProgress = 0 quando a seção está completamente acima da viewport
        // scrollProgress = 1 quando a seção está completamente abaixo da viewport
        let scrollProgress = 0;
        
        if (sectionTop <= 0 && sectionTop >= -(sectionHeight - viewportHeight)) {
            // A seção está parcialmente visível
            const visibleProgress = Math.abs(sectionTop) / (sectionHeight - viewportHeight);
            scrollProgress = Math.min(1, Math.max(0, visibleProgress));
        } else if (sectionTop < -(sectionHeight - viewportHeight)) {
            // A seção passou completamente
            scrollProgress = 1;
        }
        
        // Debug: descomente para ver os valores
        console.log('Progress:', (scrollProgress * 100).toFixed(1) + '%', 'sectionTop:', sectionTop.toFixed(0));

        if (scrollProgress >= 0.80 && !animationTriggered) {
            animationTriggered = true;

            requestAnimationFrame(() => {
                // 1. Hide caterpillar with animation
                lagarta.classList.remove('show-caterpillar');
                lagarta.classList.add('hide-caterpillar');

                // 2. Show butterfly after delay
                setTimeout(() => {
                    const butterfly = document.getElementById('cap5cena2bor-img');
                    butterfly.classList.remove('butterfly-returning', 'butterfly-reset');
                    butterfly.classList.add('butterfly-flying');
                }, 6000);
            });
        } else if (scrollProgress < 0.80 && animationTriggered) {
            animationTriggered = false;

            requestAnimationFrame(() => {
                // 1. Show caterpillar with return animation
                lagarta.classList.remove('hide-caterpillar');
                lagarta.classList.add('show-caterpillar');

                // 2. Return butterfly with reverse animation
                const butterfly = document.getElementById('cap5cena2bor-img');
                butterfly.classList.remove('butterfly-flying');
                butterfly.classList.add('butterfly-returning');
                
                // Reset butterfly to initial position after return animation
                setTimeout(() => {
                    butterfly.classList.remove('butterfly-returning');
                    butterfly.classList.add('butterfly-reset');
                }, 6000);
            });
        }
    });

    
});

