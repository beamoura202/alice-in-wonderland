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
        const scrollProgress = Math.abs(sectionTop) / (sectionHeight - viewportHeight);

        if (scrollProgress >= 0.90 && !animationTriggered) {
            animationTriggered = true;

            requestAnimationFrame(() => {
                // 1. Hide caterpillar
                lagarta.classList.add('hide-caterpillar');

                // 2. Show butterfly after delay
                setTimeout(() => {
                    const butterfly = document.getElementById('cap5cena2bor-img');
                    butterfly.classList.add('butterfly-flying');
                }, 6000);
            });
        } else if (scrollProgress < 0.90 && animationTriggered) {
            animationTriggered = false;

            // 1. Show caterpillar
            lagarta.classList.remove('hide-caterpillar');

            // 2. Hide butterfly
            const butterfly = document.getElementById('cap5cena2bor-img');
            butterfly.classList.remove('butterfly-flying');
        }
    });

    
});

