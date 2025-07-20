// Global variables for hand animation
let handTimeout = null;
let treesAreVisible = false;

document.addEventListener('DOMContentLoaded', function() {
    console.log('[DEBUG] DOM Content Loaded - Starting initialization');
    
    // Get references to the elements
    const cap4cena1 = document.getElementById('cap4cena1');
    const backgroundImage = document.querySelector('#cap4cena1 .background-image');
    const stickyContainer = document.getElementById('sticky-container');
    
    // Create a canvas element that will be used for the fisheye effect
    const canvas = document.createElement('canvas');
    canvas.className = 'fisheye-canvas';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '1';
    canvas.style.backgroundColor = 'white'; // Add white background
    
    // Add the canvas to the scene
    cap4cena1.appendChild(canvas);
    
    // Create color distortion controls
    createDistortionControls();
    
    // Initialize the fisheye effect when the background image is loaded
    backgroundImage.onload = function() {
        initFisheyeEffect(backgroundImage, canvas);
    };
    
    // If the image is already loaded, initialize immediately
    if (backgroundImage.complete) {
        initFisheyeEffect(backgroundImage, canvas);
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.fisheyeInstance) {
            updateCanvasSize(canvas);
            window.fisheyeInstance.setViewport(canvas.width, canvas.height);
            window.fisheyeInstance.draw(backgroundImage);
        }
    });
    
    // Handle scroll events to change distortion based on scroll position
    window.addEventListener('scroll', function() {
        if (window.fisheyeInstance) {
            // Calculate scroll progress for the sticky container
            const containerRect = stickyContainer.getBoundingClientRect();
            const containerHeight = stickyContainer.offsetHeight - window.innerHeight;
            const scrollProgress = Math.abs(containerRect.top) / containerHeight;
            
            // Get current distortion values from sliders
            const redDistortion = parseFloat(document.getElementById('red-distortion').value);
            const greenDistortion = parseFloat(document.getElementById('green-distortion').value);
            const blueDistortion = parseFloat(document.getElementById('blue-distortion').value);
            
            // Only apply distortion after 25% scroll
            if (scrollProgress > 0.25) {
                // Map 0.5-1.0 to 0-1 range for distortion
                const distortionProgress = (scrollProgress - 0.25) * 2;
                
                // Apply individual color distortion based on sliders and scroll progress
                const r = redDistortion * distortionProgress;
                const g = greenDistortion * distortionProgress;
                const b = blueDistortion * distortionProgress;
                
                // Update the distortion display
                document.getElementById('distortion-value').textContent = 
                    `R: ${r.toFixed(2)}, G: ${g.toFixed(2)}, B: ${b.toFixed(2)}`;
                
                // Apply the distortion
                window.fisheyeInstance.setDistortion(r, g, b);
                window.fisheyeInstance.draw(backgroundImage);
            } else {
                // No distortion before 50% scroll
                document.getElementById('distortion-value').textContent = 'R: 0.00, G: 0.00, B: 0.00';
                window.fisheyeInstance.setDistortion(0, 0, 0);
                window.fisheyeInstance.draw(backgroundImage);
            }
            
            // Show curiouser text animation based on scroll
            const curiouserText = document.querySelector('.curiouser-text');
            if (curiouserText && scrollProgress > 0.3 && scrollProgress < 0.7) {
                curiouserText.style.animationPlayState = 'running';
                curiouserText.style.opacity = '1';
            } else if (curiouserText) {
                curiouserText.style.animationPlayState = 'paused';
                if (scrollProgress <= 0.3) {
                    curiouserText.style.opacity = '0';
                }
            }
        }
    });

    window.addEventListener('scroll', () => {
        const container = document.getElementById('sticky-container');
        const details1 = document.getElementById('cap4cena1detalhes1-img');
        const details2 = document.getElementById('cap4cena1detalhes2-img');
        const alice = document.getElementById('cap4alice-img');
        
        if (container && details1 && details2 && alice) {
            const containerRect = container.getBoundingClientRect();
            const containerHeight = container.offsetHeight - window.innerHeight;
            const scrollProgress = Math.abs(containerRect.top) / containerHeight;
            
            if (scrollProgress > 0.5) {
                // Calculate scale factor (1.0 to 0.5 as scroll goes from 50% to 100%)
                const scaleProgress = (scrollProgress - 0.5) * 2; // Convert 0.5-1.0 to 0-1
                const scale = 1 - (scaleProgress * 0.5); // Will go from 1.0 to 0.5
                
                details1.style.transform = `scale(${scale})`;
                details2.style.transform = `scale(${scale})`;
                
                // Move Alice upward as the details shrink
                // Calculate the upward movement: 0 to -15vh as scale goes from 1.0 to 0.5
                const moveUpAmount = scaleProgress * 15; // 0 to 15vh upward movement
                alice.style.transform = `translateY(-${moveUpAmount}vh)`;
            } else {
                // Reset scale and position
                details1.style.transform = 'scale(1)';
                details2.style.transform = 'scale(1)';
                alice.style.transform = 'translateY(0)';
            }
        }
    });
    
    // Trigger scroll event initially to set the initial state
    window.dispatchEvent(new Event('scroll'));

    // Replace the existing scroll event listener for trees
    window.addEventListener('scroll', () => {
        const stickyContainer = document.getElementById('sticky-container');
        const stickyContainer2 = document.getElementById('sticky-container2');
        
        // Calculate total page scroll progress (0 to 1)
        const totalPageHeight = document.documentElement.scrollHeight - window.innerHeight;
        const currentScrollPosition = window.pageYOffset;
        const totalScrollProgress = currentScrollPosition / totalPageHeight;
        
        if (stickyContainer && stickyContainer2) {
            // Calculate scroll progress for sticky-container (for showing trees)
            const containerRect = stickyContainer.getBoundingClientRect();
            const containerHeight = stickyContainer.offsetHeight - window.innerHeight;
            const scrollProgress = Math.abs(containerRect.top) / containerHeight;
            
            // Calculate scroll progress for sticky-container2 (for hiding trees)
            const container2Rect = stickyContainer2.getBoundingClientRect();
            const container2Height = stickyContainer2.offsetHeight - window.innerHeight;
            const scrollProgress2 = Math.abs(container2Rect.top) / container2Height;
            
            const leftTree = document.querySelector('.slide-left');
            const rightTree = document.querySelector('.slide-right');
            const house = document.getElementById('cap4cena2casa-img');

            const handImg = document.getElementById('cap4cena2mao-img');
            const sectionArvore = document.getElementById('sectionarvore');
            const sectionCoelho = document.getElementById('sectioncoelho');
            
            // Hide sections when reaching 90% of total page scroll
            if (totalScrollProgress >= 0.9) {
                if (sectionArvore) {
                    sectionArvore.style.visibility = 'hidden';
                }
                if (sectionCoelho) {
                    sectionCoelho.style.visibility = 'hidden';
                }
            } else {
                // Restore visibility when below 90% of total page scroll
                if (sectionArvore) {
                    sectionArvore.style.visibility = 'visible';
                }
                if (sectionCoelho) {
                    sectionCoelho.style.visibility = 'visible';
                }
            }
            
            if (leftTree && rightTree && house) {
                // Show trees when sticky-container reaches 90%
                if (scrollProgress >= 0.9 && scrollProgress2 < 0.5) {
                    leftTree.classList.add('show');
                    rightTree.classList.add('show');
                    leftTree.classList.remove('hide');
                    rightTree.classList.remove('hide');
                    

                    treesAreVisible = true;
                    
                    // If hand was forced to exit but rabbit is still active, bring hand back
                    if (handImg && handImg.classList.contains('hand-reverse')) {
                        const rabbitImg = document.getElementById('cap4cena2coelho-img');
                        if (rabbitImg && rabbitImg.classList.contains('rabbit-jumping')) {
                            handImg.classList.remove('hand-reverse');
                            handImg.classList.add('hand-forward');
                        }
                    }
                }
                
                // Scale up house only when sticky-container2 is almost finishing (after 80% of container2)
                if (scrollProgress2 >= 0.8 && scrollProgress2 < 2.0) {
                    house.classList.add('scale-up');
                }
                
                // Hide trees when sticky-container2 reaches 50% OR sticky-container is below 50%
                else if (scrollProgress2 >= 0.5 || scrollProgress <= 0.5) {
                    leftTree.classList.remove('show');
                    rightTree.classList.remove('show');
                    leftTree.classList.add('hide');
                    rightTree.classList.add('hide');
                    // Remove scale-up when trees exit
                    house.classList.remove('scale-up');
                    treesAreVisible = false;
                    
                    // Make hand exit when trees exit - only if hand is currently visible
                    if (handImg && handImg.classList.contains('hand-forward')) {
                        handImg.classList.remove('hand-forward');
                        handImg.classList.add('hand-reverse');
                    }
                    
                    // Clear any pending hand timeout since trees are exiting
                    if (handTimeout) {
                        clearTimeout(handTimeout);
                        handTimeout = null;
                    }
                }



                
            }
        }
    });

    // Lagarto animation logic
    const lizardImg = document.getElementById('cap4cena3lagarto-img');
    const lizardContainer = document.querySelector('#lizard-container');
    let lizardAnimationState = 'idle'; // 'idle', 'first-animation', 'waiting', 'second-animation', 'completed'
    let lizardTimeout = null;

    console.log('[LIZARD DEBUG] Elements found:', {
        lizardImg: !!lizardImg,
        lizardContainer: !!lizardContainer,
        lizardImgSrc: lizardImg ? lizardImg.src : 'N/A',
        lizardImgId: lizardImg ? lizardImg.id : 'N/A'
    });

    // Force lizard to be invisible initially
    if (lizardContainer) {
        lizardContainer.style.opacity = '0';
        console.log('[LIZARD DEBUG] Initial opacity set to 0');
        console.log('[LIZARD DEBUG] Container computed style:', {
            opacity: window.getComputedStyle(lizardContainer).opacity,
            display: window.getComputedStyle(lizardContainer).display,
            visibility: window.getComputedStyle(lizardContainer).visibility,
            position: window.getComputedStyle(lizardContainer).position
        });
    }

    function handleLizardAnimation() {
        const container = document.querySelector('#sticky-container2');
        
        if (lizardImg && container) {
            const containerRect = container.getBoundingClientRect();
            const containerHeight = container.offsetHeight - window.innerHeight;
            const scrollProgress = Math.abs(containerRect.top) / containerHeight;

           
            console.log('[LIZARD DEBUG] Scroll progress:', scrollProgress.toFixed(3), 'State:', lizardAnimationState);

            // Keep lizard invisible until exactly 80% scroll
            if (scrollProgress < 0.8) {
                const existingContainer = document.querySelector('#lizard-container');
                if (existingContainer && existingContainer.style.opacity !== '0') {
                    existingContainer.style.opacity = '0';
                    console.log('[LIZARD DEBUG] Set opacity to 0 (before 80%)');
                }
                if (lizardAnimationState !== 'idle') {
                    if (lizardTimeout) {
                        clearTimeout(lizardTimeout);
                        lizardTimeout = null;
                    }
                    lizardAnimationState = 'idle';
                    lizardImg.classList.remove('lizard-s-up', 'lizard-s-down');
                    console.log('[LIZARD DEBUG] Reset animation state to idle');
                }
                return; // Exit early if not at 80%
            }

            // Trigger first animation at exactly 80% of container2 scroll
            if (scrollProgress >= 0.8 && lizardAnimationState === 'idle') {
                console.log('[LIZARD DEBUG] Triggering animation at 80%!');
                
                // Make lizard visible
                const currentContainer = document.querySelector('#lizard-container');
                if (currentContainer) {
                    currentContainer.style.opacity = '1';
                    console.log('[LIZARD DEBUG] Set opacity to 1 (animation start)');
                }
                
                lizardAnimationState = 'first-animation';
                lizardImg.classList.add('lizard-s-up');
                console.log('[LIZARD DEBUG] Started first animation (lizard-s-up)');
                
                // Schedule second animation after delay when first completes
                lizardTimeout = setTimeout(() => {
                    if (lizardAnimationState === 'first-animation') {
                        lizardAnimationState = 'second-animation';
                        lizardImg.classList.remove('lizard-s-up');
                        lizardImg.classList.add('lizard-s-down');
                        console.log('[LIZARD DEBUG] Started second animation (lizard-s-down)');
                        
                        // Mark as completed after second animation
                        setTimeout(() => {
                            lizardAnimationState = 'completed';
                            const containerToHide = document.querySelector('#lizard-container');
                            if (containerToHide) {
                                containerToHide.style.opacity = '0';
                                console.log('[LIZARD DEBUG] Animation completed, set opacity to 0');
                            }
                        }, 1000); // Duration of second animation (1s)
                    }
                }, 1300); // 1s animation + 0.3s delay
            }
        } else {
            console.log('[LIZARD DEBUG] Missing elements:', {
                lizardImg: !!lizardImg,
                container: !!container
            });
        }
    }

    // Add scroll event listener
    window.addEventListener('scroll', handleLizardAnimation);

    // Call once on page load to check initial position
    handleLizardAnimation();
    
    console.log('[LIZARD DEBUG] Event listeners added and initial check completed');
});

function initFisheyeEffect(image, canvas) {
    // Set canvas size
    updateCanvasSize(canvas);
    
    // Create fisheye instance
    window.fisheyeInstance = new Fisheye(canvas);
    window.fisheyeInstance.setViewport(canvas.width, canvas.height);
    
    // Set initial distortion to 0
    window.fisheyeInstance.setDistortion(0, 0, 0);
    
    // Draw the image with fisheye effect
    window.fisheyeInstance.draw(image);
}

function updateCanvasSize(canvas) {
    // Get device pixel ratio
    const dpr = window.devicePixelRatio || 1;
    
    // Get CSS size
    const rect = canvas.getBoundingClientRect();
    
    // Set canvas size in pixels
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
}

function createDistortionControls() {
    const controlPanel = document.createElement('div');
    controlPanel.className = 'distortion-controls';
    controlPanel.innerHTML = `
        <div class="control-row">
            <label for="red-distortion">Red:</label>
            <input type="range" id="red-distortion" min="0" max="2" step="0.1" value="0">
            <span id="red-value">0</span>
        </div>
        <div class="control-row">
            <label for="green-distortion">Green:</label>
            <input type="range" id="green-distortion" min="0" max="2" step="0.1" value="0.8">
            <span id="green-value">0.8</span>
        </div>
        <div class="control-row">
            <label for="blue-distortion">Blue:</label>
            <input type="range" id="blue-distortion" min="0" max="2" step="0.1" value="0">
            <span id="blue-value">0</span>
        </div>
    `;
    
    document.body.appendChild(controlPanel);

    // Set initial distortion values
    if (window.fisheyeInstance) {
        window.fisheyeInstance.setDistortion(0, 0.8, 0);
    }

    // Add event listeners for updates
    const redSlider = document.getElementById('red-distortion');
    const greenSlider = document.getElementById('green-distortion');
    const blueSlider = document.getElementById('blue-distortion');

    redSlider.addEventListener('input', updateDistortion);
    greenSlider.addEventListener('input', updateDistortion);
    blueSlider.addEventListener('input', updateDistortion);
}

function updateDistortion() {
    const redValue = parseFloat(document.getElementById('red-distortion').value);
    const greenValue = parseFloat(document.getElementById('green-distortion').value);
    const blueValue = parseFloat(document.getElementById('blue-distortion').value);

    document.getElementById('red-value').textContent = redValue.toFixed(1);
    document.getElementById('green-value').textContent = greenValue.toFixed(1);
    document.getElementById('blue-value').textContent = blueValue.toFixed(1);

    if (window.fisheyeInstance) {
        window.fisheyeInstance.setDistortion(redValue, greenValue, blueValue);
    }
}

document.addEventListener('scroll', function() {
    const sectionArvore = document.getElementById('sectionarvore');
    const coelho = document.getElementById('cap4cena2coelho-img');
    const arvoreRect = sectionArvore.getBoundingClientRect();
    const triggerPoint = window.innerHeight * 0.7; // 70vh

    if (arvoreRect.top <= triggerPoint && !coelho.classList.contains('jump')) {
        coelho.classList.add('jump');
        
        // Remove the class after animation completes to allow it to replay
        coelho.addEventListener('animationend', function() {
            coelho.classList.remove('jump');
        });
    }
});

let animationTriggered = false;

function checkScroll() {
    if (animationTriggered) return;

    const sectionArvore = document.getElementById('sectionarvore');
    const coelho = document.getElementById('cap4cena2coelho-img');
    const arvoreRect = sectionArvore.getBoundingClientRect();
    const triggerPoint = window.innerHeight * 0.7;

    if (arvoreRect.top <= triggerPoint) {
        animationTriggered = true;
        coelho.classList.add('slide-in');
        
        // Stop jumping after 5 seconds
        setTimeout(() => {
            coelho.classList.remove('slide-in');
            coelho.classList.add('stop-jumping');
        }, 7000); // 2s for slide + 5s of jumping
    }
}

window.addEventListener('scroll', checkScroll);
document.addEventListener('DOMContentLoaded', checkScroll);

document.addEventListener('DOMContentLoaded', function() {
    const stickyContainer2 = document.getElementById('sticky-container2');
    const sectionCoelho = document.getElementById('sectioncoelho');
    const rabbitImg = document.getElementById('cap4cena2coelho-img');
    const handImg = document.getElementById('cap4cena2mao-img');
    let isAnimating = false;
    let hasReachedTarget = false;
    let isReversing = false;
    
    window.addEventListener('scroll', function() {
        const container2Height = stickyContainer2.offsetHeight;
        const scrollPosition = window.pageYOffset;
        const startTrigger = container2Height * 0.8; // 80% of container
        const reverseTrigger = container2Height*2; // 200% of container
        const scrollPercentage = (scrollPosition / container2Height) * 100;
        
        // Forward animation at 80%
        if (scrollPosition >= startTrigger && !hasReachedTarget && !isReversing) {
            sectionCoelho.style.opacity = '1';
            sectionCoelho.style.pointerEvents = 'auto';
            
            if (!isAnimating) {
                rabbitImg.classList.add('rabbit-jumping');
                isAnimating = true;
                
                // Add hand animation with delay (1 second after rabbit starts)
                // But only if trees are not yet visible or if trees are visible
                if (handTimeout) {
                    clearTimeout(handTimeout);
                }
                handTimeout = setTimeout(() => {
                    // Only show hand if trees haven't exited yet
                    if (treesAreVisible || !handImg.classList.contains('hand-reverse')) {
                        handImg.classList.add('hand-forward');
                        handImg.classList.remove('hand-reverse');
                    }
                }, 1000);
            }

            const rabbitRect = rabbitImg.getBoundingClientRect();
            if (rabbitRect.left >= window.innerWidth * 0.3) {
                hasReachedTarget = true;
                // Keep the rabbit at 30vw position
                rabbitImg.style.left = '20vw';
            }
        }
        
        // Only trigger reverse animation when reaching 200% of container
        if (scrollPercentage >= 200 && hasReachedTarget && !isReversing) {
            rabbitImg.style.left = ''; // Remove fixed position before animation
            rabbitImg.classList.remove('rabbit-jumping');
            rabbitImg.classList.add('rabbit-jumping-reverse');
            isReversing = true;
        }
        
        // Reset when scrolling back up
        if (scrollPosition < startTrigger) {
            sectionCoelho.style.opacity = '0';
            sectionCoelho.style.pointerEvents = 'none';
            isAnimating = false;
            hasReachedTarget = false;
            isReversing = false;
            
            // Clear timeout if scrolling back up before hand animation triggers
            if (handTimeout) {
                clearTimeout(handTimeout);
                handTimeout = null;
            }
            
            rabbitImg.classList.remove('rabbit-jumping', 'rabbit-jumping-reverse');
            // Only reset hand if trees are not visible (let trees control hand exit)
            if (!treesAreVisible) {
                handImg.classList.remove('hand-forward', 'hand-reverse');
            }
            rabbitImg.style.left = '-20%'; // Reset to initial position
        }
    });
});

function handleCanvasResize() {
    const canvas = document.querySelector('.fisheye-canvas');
    const details1 = document.getElementById('cap4cena1detalhes1-img');
    const details2 = document.getElementById('cap4cena1detalhes2-img');
    const stickyContainer = document.getElementById('sticky-container');
    
    if (!canvas || !details1 || !details2 || !stickyContainer) return;

    const containerRect = stickyContainer.getBoundingClientRect();
    const details1Rect = details1.getBoundingClientRect();
    
    // Get the computed scale of the details images
    const details1Style = window.getComputedStyle(details1);
    const details1Transform = details1Style.transform;
    const matrix = new DOMMatrix(details1Transform);
    const scale = matrix.a; // Get the scale factor from the transform matrix
    
    // Calculate canvas size based on details scale
    if (containerRect.top <= 0 && containerRect.bottom >= 0) {
        // Map the scale (1 to 0.6) to canvas size (100% to 60%)
        const canvasSize = 100 - ((1 - scale) * 100);
        const size = Math.max(60, Math.min(100, canvasSize));
        
        canvas.style.width = `${size}%`;
        canvas.style.height = `${size}%`;
        
        // Center the canvas
        const offset = (100 - size) / 2;
        canvas.style.left = `${offset}%`;
        canvas.style.top = `${offset}%`;
    }
}

// Add scroll event listener
window.addEventListener('scroll', handleCanvasResize);




