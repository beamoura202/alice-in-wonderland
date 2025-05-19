document.addEventListener('DOMContentLoaded', function() {
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
            if (scrollProgress > 0.3 && scrollProgress < 0.7) {
                curiouserText.style.animationPlayState = 'running';
                curiouserText.style.opacity = '1';
            } else {
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
        
        const containerRect = container.getBoundingClientRect();
        const containerHeight = container.offsetHeight - window.innerHeight;
        const scrollProgress = Math.abs(containerRect.top) / containerHeight;
        
        if (scrollProgress > 0.5) {
            // Calculate scale factor (1.0 to 0.5 as scroll goes from 50% to 100%)
            const scaleProgress = (scrollProgress - 0.5) * 2; // Convert 0.5-1.0 to 0-1
            const scale = 1 - (scaleProgress * 0.5); // Will go from 1.0 to 0.5
            
            details1.style.transform = `scale(${scale})`;
            details2.style.transform = `scale(${scale})`;
        } else {
            // Reset scale
            details1.style.transform = 'scale(1)';
            details2.style.transform = 'scale(1)';
        }
    });
    
    // Trigger scroll event initially to set the initial state
    window.dispatchEvent(new Event('scroll'));

    // Replace the existing scroll event listener for trees
    window.addEventListener('scroll', () => {
        const sectionArvore = document.getElementById('sectionarvore');
        const rect = sectionArvore.getBoundingClientRect();
        const scrollEnd = rect.top + rect.height;
        const viewportHeight = window.innerHeight;
        
        const distanceToEnd = scrollEnd - viewportHeight;
        const leftTree = document.querySelector('.slide-left');
        const rightTree = document.querySelector('.slide-right');
        const house = document.getElementById('cap4cena2casa-img');
        
        if (distanceToEnd <= 100) {
            leftTree.classList.add('active');
            rightTree.classList.add('active');
            house.classList.add('scale-up');
        } else if (distanceToEnd > 200) {
            leftTree.classList.remove('active');
            rightTree.classList.remove('active');
            house.classList.remove('scale-up');
        }
    });

    function handleLizardAnimation() {
        const lizardImg = document.querySelector('#cap4cena3lagarto-img');
        const container = document.querySelector('#sticky-container2');
        const containerRect = container.getBoundingClientRect();
        const scrollPosition = window.pageYOffset;
        const triggerPoint = containerRect.top + containerRect.height - window.innerHeight;

        if (scrollPosition >= triggerPoint) {
            lizardImg.classList.add('lizard-animate');
        } else {
            lizardImg.classList.remove('lizard-animate');
        }
    }

    // Add scroll event listener
    window.addEventListener('scroll', handleLizardAnimation);

    // Call once on page load to check initial position
    document.addEventListener('DOMContentLoaded', handleLizardAnimation);

    function animateLizard() {
        const container = document.querySelector('#sticky-container2');
        const lizardContainer = document.querySelector('#lizard-container');
        
        if (!container || !lizardContainer) return; // Guard clause to prevent null errors
        
        const scrollPosition = window.pageYOffset;
        const containerTop = container.offsetTop;
        const containerHeight = container.offsetHeight;
        const startAnimation = containerTop + (containerHeight * 0.8); // Start at 80% of container
    
        requestAnimationFrame(() => {
            if (scrollPosition >= startAnimation) {
                const progress = Math.min((scrollPosition - startAnimation) / (window.innerHeight), 1);
                const bottomPosition = -70 + (170 * progress); // From -70vh to 100vh
                lizardContainer.style.bottom = `${bottomPosition}vh`;
            } else {
                lizardContainer.style.bottom = '-70vh';
            }
        });
    }

    // Cleanup old event listeners
    window.removeEventListener('scroll', animateLizard);

    // Add new event listener
    window.addEventListener('scroll', animateLizard);

    // Initialize on load
    document.addEventListener('DOMContentLoaded', animateLizard);
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
    // Create control panel
    const controlPanel = document.createElement('div');
    controlPanel.className = 'distortion-controls';
    controlPanel.innerHTML = `
        <div class="control-row">
            <label for="red-distortion">Red:</label>
            <input type="range" id="red-distortion" min="0" max="2" step="0.1" value="0.8">
            <span id="red-value">0.8</span>
        </div>
        <div class="control-row">
            <label for="green-distortion">Green:</label>
            <input type="range" id="green-distortion" min="0" max="2" step="0.1" value="0.8">
            <span id="green-value">0.8</span>
        </div>
        <div class="control-row">
            <label for="blue-distortion">Blue:</label>
            <input type="range" id="blue-distortion" min="0" max="2" step="0.1" value="0.8">
            <span id="blue-value">0.8</span>
        </div>
    `;
    
    document.body.appendChild(controlPanel);
    
    // Add event listeners to update values
    document.getElementById('red-distortion').addEventListener('input', function(e) {
        document.getElementById('red-value').textContent = e.target.value;
        // Trigger scroll to update the effect
        window.dispatchEvent(new Event('scroll'));
    });
    
    document.getElementById('green-distortion').addEventListener('input', function(e) {
        document.getElementById('green-value').textContent = e.target.value;
        window.dispatchEvent(new Event('scroll'));
    });
    
    document.getElementById('blue-distortion').addEventListener('input', function(e) {
        document.getElementById('blue-value').textContent = e.target.value;
        window.dispatchEvent(new Event('scroll'));
    });
}