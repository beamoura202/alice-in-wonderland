/**
 * Universal Page Transition Script
 * 
 * This script provides a smooth transition effect for any clickable element
 * that should navigate to another page. The transition uses the existing
 * #black-transition div to create a fade-in overlay effect.
 * 
 * Usage:
 * Add data-transition="target-url" to any element to enable the transition
 * 
 * Example:
 * <img src="image.png" data-transition="./page.html" alt="Click me">
 * <button data-transition="./another-page.html">Click me</button>
 */

// Function to handle the page transition using existing black-transition div
function universalPageTransition(targetUrl) {
    // Prevent multiple transitions
    if (window.transitionInProgress) {
        return;
    }
    window.transitionInProgress = true;
    
    console.log('Starting transition to:', targetUrl);
    
    // Find the existing black-transition div
    const blackTransition = document.getElementById('black-transition');
    
    if (!blackTransition) {
        console.warn('black-transition div not found, falling back to direct navigation');
        window.location.href = targetUrl;
        return;
    }
    
    // Start animation - grow the black overlay from bottom to top
    blackTransition.style.height = '100vh';
    blackTransition.style.pointerEvents = 'auto';
    
    // After animation completes, navigate to the target page
    setTimeout(() => {
        window.location.href = targetUrl;
    }, 800); // Match this with the CSS transition duration (0.8s)
}

// Function to initialize transition elements
function initializeUniversalTransitions() {
    // Find all elements with data-transition attribute
    const transitionElements = document.querySelectorAll('[data-transition]');
    
    transitionElements.forEach(element => {
        const targetUrl = element.getAttribute('data-transition');
        
        if (targetUrl) {
            // Make element look clickable
            element.style.cursor = 'pointer';
            element.style.pointerEvents = 'auto';
            
            // Add click event listener
            element.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Transition element clicked:', element.id || element.tagName);
                universalPageTransition(targetUrl);
            });
            
            // Add hover effect (optional)
            element.addEventListener('mouseenter', () => {
                element.style.filter = 'brightness(1.1)';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.filter = 'brightness(1)';
            });
        }
    });
    
    console.log(`Initialized ${transitionElements.length} transition elements`);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeUniversalTransitions);

// Also provide a way to manually add transition to specific elements
function addTransitionToElement(elementId, targetUrl) {
    const element = document.getElementById(elementId);
    if (element) {
        element.setAttribute('data-transition', targetUrl);
        // Re-initialize to pick up the new element
        initializeUniversalTransitions();
        return true;
    }
    console.warn(`Element with id "${elementId}" not found`);
    return false;
}

// Expose functions globally for manual use
window.universalPageTransition = universalPageTransition;
window.addTransitionToElement = addTransitionToElement;
window.initializeUniversalTransitions = initializeUniversalTransitions;
