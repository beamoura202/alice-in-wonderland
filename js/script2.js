document.addEventListener('DOMContentLoaded', function() {
    const container1 = document.getElementById('sticky-container');
    const container2 = document.getElementById('sticky-container-2');
    const container3 = document.getElementById('sticky-container-3');
    const aliceImage = document.getElementById('cap2cena1alice-img');
    const frase1 = document.getElementById('cap2cena1frase1');
    const frase2 = document.getElementById('cap2cena1frase2');
    const detalhes2 = document.getElementById('cena2detalhes');
    const detalhes3 = document.getElementById('cena3detalhes');
    const fundo2 = document.getElementById('fundo-img2');
    const bottle = document.getElementById('cena3detalhes');
    const rato = document.getElementById('cap2cena3rato-img');
    
    const markers = document.querySelectorAll('.scroll-height-marker');
    const initialScale = 0.5;

    let scrollTimeout;
    let lastScrollTop = 0;
    let direction = 1;
    let returnAnimationFrame;
    let currentAngle = 0;
    let velocity = 0;
    let lastScrollTime = Date.now();
    let isScrolling = false;
    let oscillationAngle = 0;
    let scrollCount = 0;
    let animationFrame;
    let oscillationTime = 0;
    const OSCILLATION_SPEED = 0.1; // Velocidade da oscilação
    
    let ratWalkingAnimation;
    let ratPosition = 50; // Start from middle (50%)
    
    function animateRatWalking() {
        if (!rato) return;
        
        ratPosition += 0.05; // Slower speed of movement
        const walkingOffset = Math.sin(Date.now() * 0.01) * 10;
        const walkingRotation = Math.sin(Date.now() * 0.01) * 5;
        
        rato.style.visibility = 'visible';
        rato.style.right = '40%'; // Center horizontally
        rato.style.transform = `translate(-50%, 0) translateX(${ratPosition}vw) translateY(${walkingOffset}px) rotate(${walkingRotation}deg)`;
        
        // Reset position when rat goes off screen
        if (ratPosition > 100) { // Use viewport width units
            ratPosition = -20; // Start slightly off-screen to the left
        }
        
        ratWalkingAnimation = requestAnimationFrame(animateRatWalking);
    }
    
    // Start rat animation immediately
    animateRatWalking();

    // Clean up animation when page is hidden
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(ratWalkingAnimation);
        } else {
            animateRatWalking();
        }
    });
    
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        
        // First container animations
        if (scrollPosition < markers[0].offsetTop) {
            const progress = scrollPosition / (markers[0].offsetTop - windowHeight);
            const scale = initialScale + (progress * 2);
            
            aliceImage.style.transform = `translateX(-50%) scale(${scale})`;
            
            // Text animations
            if (progress > 0.3) {
                frase1.style.opacity = '1';
            } else {
                frase1.style.opacity = '0';
            }
            
            if (progress > 0.6) {
                frase2.style.opacity = '1';
                frase1.style.opacity = '0';
            } else if (progress <= 0.6) {
                frase2.style.opacity = '0';
            }
        }
        
        // Handle container transitions
        markers.forEach((marker, index) => {
            if (scrollPosition > marker.offsetTop - windowHeight) {
                if (index === 0) {
                    container1.classList.add('unstick');
                } else if (index === 1) {
                    container2.classList.add('unstick');
                }
            }
        });

        // Scene 2 animations
        const container2Top = container2.getBoundingClientRect().top;
        const container2Height = container2.offsetHeight;
        
        if (container2Top <= windowHeight && container2Top > -container2Height) {
            // Calculate progress within container2 (0 to 1)
            const scrollProgress = Math.abs(container2Top) / (container2Height - windowHeight);
            
            // Animate between 20% and 60% of scroll
            if (scrollProgress > 0.2 && scrollProgress < 0.6) {
                const moveProgress = (scrollProgress - 0.2) / 0.4; // Convert to 0-1 range
                const translateY = 100 - (moveProgress * 100); // Move from 100% to 0%
                detalhes2.style.transform = `translate(-50%, ${translateY}%)`;
            } else if (scrollProgress >= 0.6) {
                detalhes2.style.transform = 'translate(-50%, 0%)'; // Fully visible
            } else {
                detalhes2.style.transform = 'translate(-50%, 100%)'; // Hidden below
            }
        }

        // Scene 3 entrance animation
        const cena3 = document.getElementById('cap2cena3');
        const container3Top = container3.getBoundingClientRect().top;
        const container3Height = container3.offsetHeight;

        if (container3Top <= windowHeight + 100) { // Added offset to start earlier
            const scrollProgress = Math.abs(container3Top) / (container3Height - windowHeight);
            
            if (scrollProgress < 0.9) { // Reduced from 0.9 to make it stick sooner
                // Initial slide up animation
                const slideProgress = scrollProgress / 0.9;
                const translateY = Math.max(0, 100 - (slideProgress * 100)); // Prevent negative values
                cena3.style.transform = `translateY(${translateY}%)`;
                cena3.style.position = 'sticky';
                cena3.style.bottom = '0';
            } else {
                // Keep at bottom position
                cena3.style.transform = 'translateY(0)';
                cena3.style.position = 'sticky';
                cena3.style.bottom = '0';
            }
        } else {
            // Keep below viewport until ready
            cena3.style.transform = 'translateY(100%)';
        }

        // Scene 3 animations
        const scrollInContainer3 = window.scrollY - container3Top;
        
        if (scrollInContainer3 >= 0) {
            // Bottle animation
            isScrolling = true;
            cancelAnimationFrame(returnAnimationFrame);
            if (!animationFrame) {
                animateBottle();
            }
            
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                isScrolling = false;
                cancelAnimationFrame(animationFrame);
                animationFrame = null;
                returnToCenter();
            }, 150);

            // Mouse animation - movimento mais suave
            const scrollProgress = scrollInContainer3 / (container3.offsetHeight);
            const maxMove = 300; // Increased back to 300
            const smoothProgress = Math.min(scrollProgress * 1.5, 1);
            const moveAmount = smoothProgress * maxMove;
            
            if (rato) {
                // Add walking animation when moving
                const walkingOffset = Math.sin(Date.now() * 0.01) * 10; // Creates bobbing motion
                const walkingRotation = Math.sin(Date.now() * 0.01) * 5; // Slight rotation
                
                rato.style.visibility = 'visible';
                rato.style.transform = `translateX(${moveAmount}%) translateY(${walkingOffset}px) rotate(${walkingRotation}deg)`;
                rato.style.transition = 'transform 0.3s ease-out';
            }
        }
    });

    function animateBottle() {
        if (isScrolling) {
            oscillationTime += OSCILLATION_SPEED;
            currentAngle = Math.sin(oscillationTime) * 20;
            bottle.style.transform = `translateX(-50%) rotate(${currentAngle}deg)`;
            animationFrame = requestAnimationFrame(animateBottle);
        }
    }

    function startOscillation() {
        let oscillations = 0;
        const maxOscillations = 4;
        
        function oscillate() {
            if (isScrolling || oscillations >= maxOscillations) return;
            
            oscillationAngle = 20 * oscillationDirection;
            oscillationDirection *= -1;
            oscillations++;
            
            bottle.style.transform = `translateX(-50%) rotate(${oscillationAngle}deg)`;
            
            if (oscillations < maxOscillations) {
                setTimeout(oscillate, 300);
            } else {
                returnToCenter();
            }
        }
        
        oscillate();
    }

    function returnToCenter() {
        const springStrength = 0.2;
        const damping = 0.1;
        const tolerance = 0.1;

        function animate() {
            const displacement = currentAngle - 0;
            const acceleration = -springStrength * displacement;
            
            velocity += acceleration;
            velocity *= damping;
            currentAngle += velocity;
            
            bottle.style.transform = `translateX(-50%) rotate(${currentAngle}deg)`;
            
            if (Math.abs(velocity) > tolerance || Math.abs(displacement) > tolerance) {
                returnAnimationFrame = requestAnimationFrame(animate);
            }
        }
        
        returnAnimationFrame = requestAnimationFrame(animate);
    }
    
    // Set initial state
    aliceImage.style.transform = `translateX(-50%) scale(${initialScale})`;
});


