// Add these utility functions at the top of your file
function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function easeOutQuad(t) {
    return t * (2 - t);
}

function easeOutElastic(x) {
    const c4 = (2 * Math.PI) / 3;
    return x === 0
        ? 0
        : x === 1
        ? 1
        : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
}

function easeOutElasticExaggerated(x) {
    const c4 = (2 * Math.PI) / 3;
    return x === 0
        ? 0
        : x === 1
        ? 1
        : Math.pow(2, -8 * x) * Math.sin((x * 6 - 0.75) * c4) * 1.5 + 1;
}

function calculateCurvedPath(progress, radius, reverse = false) {
    const angle = progress * Math.PI;
    const x = Math.sin(angle) * radius;
    const y = -Math.cos(angle) * radius + radius;
    return reverse ? { x: -x, y } : { x, y };
}

function calculateCustomCurvedPath(progress, startX, endX, curveHeight) {
    // Convert progress to radians
    const angle = progress * Math.PI / 2;
    
    // Linear interpolation for X position
    const x = startX + (endX - startX) * progress;
    
    // Curved path for Y using sine
    const y = Math.sin(angle) * curveHeight;
    
    return { x, y };
}

function calculateTwoStagePath(progress, startX, endX, curveHeight) {
    // First half: horizontal movement
    if (progress <= 0.5) {
        const moveProgress = progress * 2; // Scale 0-0.5 to 0-1
        return {
            x: startX + (endX - startX) * moveProgress,
            y: 0
        };
    } 
    // Second half: curved path
    else {
        const curveProgress = (progress - 0.5) * 2; // Scale 0.5-1 to 0-1
        return {
            x: endX,
            y: Math.sin(curveProgress * Math.PI) * curveHeight
        };
    }
}

function calculateTwoStageAnimation(progress) {
    // Stage 1: Move horizontally (0 to 0.5 progress)
    if (progress <= 0.5) {
        const moveProgress = easeOutQuad(progress * 2); // Convert 0-0.5 to 0-1
        return {
            x: -100 + (110 * moveProgress), // Move from -100vw to 10vw
            y: 0,
            scale: 2.4
        };
    }
    // Stage 2: Curve motion (0.5 to 1 progress)
    else {
        const curveProgress = easeOutQuad((progress - 0.5) * 2); // Convert 0.5-1 to 0-1
        const curveHeight = 150; // Max height of curve in pixels
        
        return {
            x: 10, // Stay at 10vw
            y: Math.sin(curveProgress * Math.PI) * curveHeight,
            scale: 2.4
        };
    }
}

function calculateCurvedEntrance(progress) {
    const easedProgress = easeInOutQuad(progress);
    
    // Stage 1: Horizontal entry (0 to 0.4)
    if (progress <= 0.4) {
        const moveProgress = progress / 0.4;
        const easedMoveProgress = easeOutQuad(moveProgress);
        
        return {
            x: -100 + (110 * easedMoveProgress),
            y: 0,
            scale: 0.8 + (easedMoveProgress * 0.8),
            rotation: -10 + (easedMoveProgress * 10)
        };
    }
    // Stage 2: Upward curve (0.4 to 0.7)
    else if (progress <= 0.7) {
        const curveProgress = (progress - 0.4) / 0.3;
        const easedCurveProgress = easeInOutQuad(curveProgress);
        
        const curveHeight = 180;
        const x = 10 - (easedCurveProgress * 20);
        const y = -Math.sin(easedCurveProgress * Math.PI) * curveHeight;
        
        return {
            x: x,
            y: y,
            scale: 1.6 + (easedCurveProgress * 0.8),
            rotation: 0
        };
    }
    // Stage 3: Final adjustment (0.7 to 1.0)
    else {
        const finalProgress = (progress - 0.7) / 0.3;
        const easedFinalProgress = easeInOutQuad(finalProgress);
        const floatY = Math.sin(finalProgress * Math.PI * 2) * 15;
        
        return {
            x: -10 + (easedFinalProgress * 20),
            y: -180 + floatY,
            scale: 2.4,
            rotation: 0
        };
    }
}

function calculateReverseCurvedEntrance(progress) {
    const easedProgress = easeInOutQuad(progress);
    
    // Stage 1: Horizontal entry from right (0 to 0.4)
    if (progress <= 0.4) {
        const moveProgress = progress / 0.4;
        const easedMoveProgress = easeOutQuad(moveProgress);
        
        return {
            x: 100 - (110 * easedMoveProgress), // Move from +100vw to -10vw
            y: 0,
            scale: 0.8 + (easedMoveProgress * 0.8),
            rotation: 10 - (easedMoveProgress * 10)
        };
    }
    // Stage 2: Upward curve (0.4 to 0.7)
    else if (progress <= 0.7) {
        const curveProgress = (progress - 0.4) / 0.3;
        const easedCurveProgress = easeInOutQuad(curveProgress);
        
        const curveHeight = 180;
        const x = -10 + (easedCurveProgress * 20); // Move right during curve
        const y = -Math.sin(easedCurveProgress * Math.PI) * curveHeight;
        
        return {
            x: x,
            y: y,
            scale: 1.6 + (easedCurveProgress * 0.8),
            rotation: 0
        };
    }
    // Stage 3: Final adjustment (0.7 to 1.0)
    else {
        const finalProgress = (progress - 0.7) / 0.3;
        const easedFinalProgress = easeInOutQuad(finalProgress);
        const floatY = Math.sin(finalProgress * Math.PI * 2) * 15;
        
        return {
            x: 10 - (easedFinalProgress * 20),
            y: -180 + floatY,
            scale: 2.4,
            rotation: 0
        };
    }
}

function calculateTransitionProgress(scrollPosition, transitionStart, transitionDuration) {
    if (scrollPosition < transitionStart) return 0;
    if (scrollPosition > transitionStart + transitionDuration) return 1;
    return (scrollPosition - transitionStart) / transitionDuration;
}

function calculateOpacityTransition(currentProgress, startPoint, duration) {
    if (currentProgress < startPoint) return 0;
    if (currentProgress > startPoint + duration) return 1;
    return (currentProgress - startPoint) / duration;
}

function handlePopupAnimation(scrollProgress3) {
    // Reset da flag de áudio quando voltar para antes da transição
    if (scrollProgress3 < 0.6 && window.audioTransitioned) {
        const audioCena3 = document.getElementById('audio-cena3');
        const audioCena4 = document.getElementById('audio-cena4');
        
        if (audioCena3 && audioCena4) {
            console.log("Voltando para audio-cena3");
            audioCena4.pause();
            audioCena4.currentTime = 0;
            audioCena3.play();
            window.audioTransitioned = false;
        }
    }

    if (scrollProgress3 >= 0.6) {
        const transitionProgress = calculateTransitionProgress(scrollProgress3, 0.6, 0.3);
        const fundo3 = document.getElementById('fundo3-img');
        const fundo4 = document.getElementById('fundo4-img');
        
        // Move backgrounds (with safety checks)
        if (fundo3 && fundo4) {
            const translateY = transitionProgress * 100;
            fundo3.style.transform = `translateY(-${translateY}%)`;
            fundo3.style.opacity = 1 - transitionProgress;
            
            // Trocar áudio quando a transição começar (quando fundo4 começa a aparecer)
            if (transitionProgress > 0 && !window.audioTransitioned) {
                const audioCena3 = document.getElementById('audio-cena3');
                const audioCena4 = document.getElementById('audio-cena4');
                
                if (audioCena3 && audioCena4) {
                    console.log("Trocando de audio-cena3 para audio-cena4");
                    audioCena3.pause();
                    audioCena3.currentTime = 0;
                    audioCena4.play();
                    window.audioTransitioned = true;
                }
            }
            
            if (transitionProgress >= 1) {
                fundo4.classList.add('fixed');
                // Só remove a classe fixed quando o scroll chegar ao fim do container
                if (scrollProgress3 >= 0.95) {
                    fundo4.classList.remove('fixed');
                    fundo4.style.transform = 'translateY(0)';
                }
            } else {
                fundo4.classList.remove('fixed');
                fundo4.style.transform = `translateY(${100 - translateY}%)`;
            }
            fundo4.style.opacity = transitionProgress;
        }
        
        // Character transition
        if (transitionProgress > 0.5) {
            const characterTransitionProgress = (transitionProgress - 0.5) * 2;
            
            // Fade out the old character (with safety check)
            const personagem3 = document.getElementById('personagemc3-img');
            if (personagem3) {
                personagem3.style.opacity = 1 - characterTransitionProgress;
            }
            
            // Show and position new character (with safety check)
            const personagem4 = document.getElementById('personagemc4-img');
            if (personagem4) {
                personagem4.style.visibility = 'visible';
                personagem4.style.opacity = characterTransitionProgress;
                personagem4.style.transform = 'translate(-50%, -50%)';
            }
            
            // Keep scene 3 details visible (removed fade out)
            // document.getElementById('detalhesc3-img').style.opacity = 1 - characterTransitionProgress;
            
            // Fade in scene 4 details (with safety check)
            const detalhes4 = document.getElementById('detalhesc4-img');
            if (detalhes4) {
                detalhes4.style.visibility = 'visible';
                detalhes4.style.opacity = characterTransitionProgress;
            }
        }
        
        // Handle completion of initial transition
        if (transitionProgress >= 1) {
            // Hide scene 3 elements only during forward transition (with safety check)
            const personagem3 = document.getElementById('personagemc3-img');
            if (personagem3) {
                personagem3.style.visibility = 'hidden';
                personagem3.style.opacity = '0';
            }
            // Keep detalhesc3-img visible (removed hiding)
            // document.getElementById('detalhesc3-img').style.visibility = 'hidden';
            
            // Show scene 4 elements (with safety checks)
            const personagem4 = document.getElementById('personagemc4-img');
            const detalhes4 = document.getElementById('detalhesc4-img');
            if (personagem4) {
                personagem4.style.visibility = 'visible';
                personagem4.style.opacity = '1';
            }
            if (detalhes4) {
                detalhes4.style.visibility = 'visible';
                detalhes4.style.opacity = '1';
            }
        } else {
            // When transition is not complete, ensure scene 3 character can be visible
            const personagem3 = document.getElementById('personagemc3-img');
            if (personagem3 && scrollProgress3 < 0.6) {
                // Before transition starts, make sure character can be visible
                personagem3.style.visibility = 'visible';
                personagem3.style.opacity = '1';
            }
        }

        // Add delay for popup (with safety checks) - COMENTADO para evitar conflitos de posição
        const popup = document.getElementById('detalhesc42-img');
        const background = document.querySelector('.popup-background');
        if (popup && background && !popup.hasAttribute('data-delayed')) {
            popup.setAttribute('data-delayed', 'true');
            // setTimeout comentado - o popup é controlado pelo scroll progress
            /*
            setTimeout(() => {
                popup.style.visibility = 'visible';
                popup.style.transform = 'translate(-50%, -50%) scale(1)';
                popup.style.opacity = '1';
                popup.classList.add('active');
                background.style.visibility = 'visible';
                background.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                background.classList.add('active');
            }, 2000);
            */
        }
        
        // Atualizar o z-index do popup e seus elementos relacionados (with safety checks)
        // Garantir que o popup esteja na camada mais alta
        const popup2 = document.getElementById('detalhesc42-img');
        const background2 = document.querySelector('.popup-background');
        if (popup2 && background2) {
            popup2.style.zIndex = '1000';
            background2.style.zIndex = '999';
            
            // Garantir que eventos de clique funcionem
            popup2.style.pointerEvents = 'auto';
            background2.style.pointerEvents = 'none';
        }
        
    } else {
        // Reset all elements (with safety checks)
        const elements = {
            'fundo3-img': { transform: 'translateY(0)', opacity: '1' },
            'fundo4-img': { transform: 'translateY(100%)', opacity: '0' },
            'personagemc3-img': { visibility: 'visible', opacity: '1' },
            'personagemc4-img': { transform: 'translate(-50%, 100%)', visibility: 'hidden', opacity: '0' },
            'detalhesc4-img': { transform: 'translateY(100%)', visibility: 'hidden', opacity: '0' }
        };
        
        Object.entries(elements).forEach(([id, styles]) => {
            const element = document.getElementById(id);
            if (element) {
                Object.entries(styles).forEach(([prop, value]) => {
                    element.style[prop] = value;
                });
            }
        });
    }
    
    // Popup aparece mais cedo (0.65 a 0.75) (with safety checks)
    const popup = document.getElementById('detalhesc42-img');
    const background = document.querySelector('.popup-background');
    
    if (popup && background) {
        // Garantir posição fixa do popup - sempre centralizado
        const baseTransform = 'translate(-50%, -50%)';
        
        if (scrollProgress3 >= 0.65 && scrollProgress3 <= 0.75) {
            const popupProgress = (scrollProgress3 - 0.65) / 0.1;
            
            popup.style.visibility = 'visible';
            background.style.visibility = 'visible';
            
            const scaleValue = Math.min(popupProgress, 1) * 1;
            popup.style.transform = ` scale(${scaleValue})`;
            popup.style.opacity = Math.min(popupProgress, 1);
            
            // Garantir posição fixa
            popup.style.left = '10vw';
            popup.style.top = '20%';
            popup.style.position = 'absolute';
            
            background.style.backgroundColor = `rgba(0, 0, 0,0)`;
            
            if (popupProgress >= 1) {
                popup.classList.add('active');
                background.classList.add('active');
            } else {
                popup.classList.remove('active');
                background.classList.remove('active');
            }
        } else if (scrollProgress3 > 0.75) {
            // Manter popup visível com posição fixa
            popup.style.visibility = 'visible';
            popup.style.transform = `scale(1)`;
            popup.style.opacity = '1';
            popup.classList.add('active');
            
            // Garantir posição fixa
            popup.style.left = '10vw';
            popup.style.top = '20%';
            popup.style.position = 'absolute';
            
            background.style.visibility = 'visible';
            background.style.backgroundColor = 'rgba(0, 0, 0, 0)';
            background.classList.add('active');
        } else {
            // Esconder popup
            popup.style.visibility = 'hidden';
            popup.style.transform = ` scale(0)`;
            popup.style.opacity = '0';
            popup.classList.remove('active');
            
            background.style.visibility = 'hidden';
            background.style.backgroundColor = 'rgba(0, 0, 0, 0)';
            background.classList.remove('active');
        }
    }
    
    // COMENTADO: Agora controlado pelo áudio em audiocap1.js
    /*
    // Frase aparece logo após o popup (0.75 a 0.8) (with safety check)
    const frase3 = document.getElementById('frasec3');
    
    if (frase3) {
        if (scrollProgress3 >= 0.75) {
            const fraseProgress = (scrollProgress3 - 0.75) / 0.05;
            frase3.style.opacity = Math.min(fraseProgress, 1);
        } else {
            frase3.style.opacity = '0';
        }
    }
    */
}

// Add this before your existing code
function showPopup() {
    const popup = document.getElementById('detalhesc42-img');
    popup.classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
    // Definir altura do sticky-container-2
    const stickyContainer2 = document.getElementById('sticky-container-2');
    if (stickyContainer2) {
        stickyContainer2.style.height = '2500vh';
    }
    
    // Código para a cena 1 (mantido como estava)
    window.addEventListener('scroll', () => {
        const detalhesImg = document.getElementById('detalhes-img');
        const coelhoImg = document.getElementById('coelho-img');
        // COMENTADO: Agora controlado pelo áudio em audiocap1.js
        // const fraseElement = document.getElementById('frase');
        const stickyContainer = document.getElementById('sticky-container');
        
        // Obter posição e dimensões do container
        const containerRect = stickyContainer.getBoundingClientRect();
        const containerTop = containerRect.top;
        const containerHeight = stickyContainer.offsetHeight;
        const viewportHeight = window.innerHeight;
        
        // Espaço total de scroll
        const scrollableSpace = containerHeight - viewportHeight;
        
        // Calcula a posição relativa do scroll dentro do container
        let scrollProgress = 0;
        
        if (containerTop <= 0 && containerTop > -scrollableSpace) {
            // Container está visível e há espaço para scroll
            scrollProgress = Math.abs(containerTop) / scrollableSpace;
            scrollProgress = Math.min(Math.max(scrollProgress, 0), 1);
            
            // Fases de animação da cena 1
            if (scrollProgress <= 0.25) {
                // Detalhes
                let detalhesProgress = scrollProgress * 4;
                
                let translateX;
                if (detalhesProgress < 0.2) {
                    translateX = -100;
                } else if (detalhesProgress > 0.8) {
                    translateX = 0;
                } else {
                    translateX = -100 + ((detalhesProgress - 0.2) / 0.6) * 100;
                }
                
                detalhesImg.style.transform = `translateY(-50%) translateX(${translateX}%)`;
                
                let detalhesOpacity;
                if (detalhesProgress < 0.2) {
                    detalhesOpacity = 0;
                } else if (detalhesProgress > 0.8) {
                    detalhesOpacity = 1;
                } else {
                    detalhesOpacity = (detalhesProgress - 0.2) / 0.6;
                }
                
                detalhesImg.style.opacity = detalhesOpacity.toFixed(2);
                
                coelhoImg.style.bottom = '-50%';
                coelhoImg.style.opacity = '0';
                // COMENTADO: Agora controlado pelo áudio em audiocap1.js
                // fraseElement.style.opacity = '0';
            } 
            else if (scrollProgress <= 0.5) {
                detalhesImg.style.transform = 'translateY(-50%) translateX(0)';
                detalhesImg.style.opacity = '1';
                
                let coelhoProgress = (scrollProgress - 0.25) * 4;
                
                let bottomPosition = -50 + coelhoProgress * 70;
                coelhoImg.style.bottom = `${bottomPosition}%`;
                
                let coelhoOpacity = Math.min(coelhoProgress * 1.5, 1);
                coelhoImg.style.opacity = coelhoOpacity.toFixed(2);
                
                // COMENTADO: Agora controlado pelo áudio em audiocap1.js
                // fraseElement.style.opacity = '0';
            }
            else if (scrollProgress <= 0.75) {
                detalhesImg.style.transform = 'translateY(-50%) translateX(0)';
                detalhesImg.style.opacity = '1';
                coelhoImg.style.bottom = '20%';
                coelhoImg.style.opacity = '1';
                
                // COMENTADO: Agora controlado pelo áudio em audiocap1.js
                // let fraseProgress = (scrollProgress - 0.5) * 4;
                // fraseElement.style.opacity = fraseProgress.toFixed(2);
            }
            else {
                detalhesImg.style.transform = 'translateY(-50%) translateX(0)';
                detalhesImg.style.opacity = '1';
                coelhoImg.style.bottom = '20%';
                coelhoImg.style.opacity = '1';
                // COMENTADO: Agora controlado pelo áudio em audiocap1.js
                // fraseElement.style.opacity = '1';
            }
            
        } else if (containerTop <= -scrollableSpace) {
            detalhesImg.style.transform = 'translateY(-50%) translateX(0)';
            detalhesImg.style.opacity = '1';
            coelhoImg.style.bottom = '20%';
            coelhoImg.style.opacity = '1';
            // COMENTADO: Agora controlado pelo áudio em audiocap1.js
            // fraseElement.style.opacity = '1';
        } else {
            detalhesImg.style.transform = 'translateY(-50%) translateX(-100%)';
            detalhesImg.style.opacity = '0';
            coelhoImg.style.bottom = '-50%';
            coelhoImg.style.opacity = '0';
            // COMENTADO: Agora controlado pelo áudio em audiocap1.js
            // fraseElement.style.opacity = '0';
        }

        // -------- CENA 2 - Personagem descendo com o scroll -------- //
        const stickyContainer2 = document.getElementById('sticky-container-2');
        const backgroundImg = document.getElementById('fundo2-img');
        const personagemImg = document.getElementById('personagemc2-img');
        
        // Obter posição e dimensões do container da cena 2
        const container2Rect = stickyContainer2.getBoundingClientRect();
        const container2Top = container2Rect.top;
        const container2Height = stickyContainer2.offsetHeight;
        
        // Espaço total de scroll para cena 2
        const scrollableSpace2 = container2Height - viewportHeight;
        
        if (container2Top <= 0 && container2Top > -scrollableSpace2) {
            // Container da cena 2 está visível e há espaço para scroll
            const scrollProgress2 = Math.abs(container2Top) / scrollableSpace2;
            
            // Controlar áudio da cena 2 - iniciar quando entrar na cena
            if (!window.cena2AudioStarted) {
                const audioCena2 = document.getElementById('audio-cena2');
                const audioCena1 = document.getElementById('audio-cena1');
                
                if (audioCena2) {
                    console.log("Iniciando audio-cena2");
                    if (audioCena1) {
                        audioCena1.pause();
                        audioCena1.currentTime = 0;
                    }
                    audioCena2.play();
                    window.cena2AudioStarted = true;
                }
            }
            
            // Fazer a personagem aparecer quando entrar na cena 2
            if (scrollProgress2 > 0.05) { // Pequeno atraso antes de mostrar
                personagemImg.style.opacity = '1';
            } else {
                personagemImg.style.opacity = '0';
            }
            
            // Posição vertical da personagem - vindo de cima para baixo com easing
            // Começar fora da tela (top: -50%) e mover para o centro (top: 50%)
            const easedProgress = easeOutQuad(scrollProgress2); // Aplicar easing para movimento mais natural
            const topPosition = -50 + (easedProgress * 100);
            
            // Limitamos a posição para que não desça abaixo do centro da tela
            const finalTopPosition = Math.min(topPosition, 50);
            
            // Aplicar a posição
            personagemImg.style.top = `${finalTopPosition}%`;
            personagemImg.style.transform = 'translateX(-50%) translateY(-50%)';
            
            // Para o fundo, queremos que ele pareça estar rolando gradualmente
            // Inicialmente em 0 (topo) e movendo-se para baixo conforme o scroll progride
            const bgProgress = scrollProgress2;
            const backgroundScale = 1; // Mantém a escala original
            
            // Movimento vertical do background - começando do topo e movendo apenas o suficiente
            // para mostrar a parte de baixo da imagem no final do scroll
            const maxBgShift = 100 - (100 * (viewportHeight / backgroundImg.offsetHeight));
            const bgShift = bgProgress * maxBgShift;
            
            backgroundImg.style.transform = `translateY(-${bgShift}%)`;

            // Details curved animations
            const detalhesc2 = document.getElementById('detalhesc2-img');
            const detalhesc22 = document.getElementById('detalhesc22-img');
            
            if (scrollProgress2 > 0.1) {
                // First details element - adjusted radius and timing
                const animationProgress = Math.min((scrollProgress2 - 0.1) * 1.5, 1);
                const animation = calculateReverseCurvedEntrance(animationProgress);
                
                detalhesc2.style.transform = `
                    translateX(${animation.x}vw) 
                    translateY(${animation.y}px) 
                    scale(${animation.scale})
                    rotate(${animation.rotation}deg)
                `;
                detalhesc2.style.opacity = Math.min((scrollProgress2 - 0.1) * 2, 1);
                
                // Add shadow during movement
                if (animationProgress > 0.1 && animationProgress < 0.9) {
                    const shadowIntensity = Math.sin(animationProgress * Math.PI) * 30;
                    detalhesc2.style.filter = `drop-shadow(0px ${shadowIntensity}px ${shadowIntensity/2}px rgba(0,0,0,0.3))`;
                } else {
                    detalhesc2.style.filter = 'none';
                }

                // Second details element - adjusted radius and timing
                const path1 = calculateCurvedPath(Math.min(scrollProgress2 * 1.5, 1), 200); // Reduced radius
                const opacity1 = Math.min((scrollProgress2 - 0.1) * 2, 1);
                
                detalhesc22.style.transform = `translate(${path1.x}px, ${path1.y}px) scale(0.8)`;
                detalhesc22.style.opacity = opacity1;
                
                const animationProgress2 = Math.min((scrollProgress2 - 0.2) * 1.5, 1);
                const animation2 = calculateCurvedEntrance(animationProgress2);
                
                detalhesc22.style.transform = `
                    translateX(${animation2.x}vw) 
                    translateY(${animation2.y}px) 
                    scale(${animation2.scale})
                    rotate(${animation2.rotation}deg)
                `;
                detalhesc22.style.opacity = Math.min((scrollProgress2 - 0.1) * 2, 1);
                
                // Add shadow during movement
                if (animationProgress2 > 0.1 && animationProgress2 < 0.9) {
                    const shadowIntensity2 = Math.sin(animationProgress2 * Math.PI) * 30;
                    detalhesc22.style.filter = `drop-shadow(0px ${shadowIntensity2}px ${shadowIntensity2/2}px rgba(0,0,0,0.3))`;
                } else {
                    detalhesc22.style.filter = 'none';
                }
            } else {
                // Reset position
                detalhesc2.style.transform = 'translateX(100vw) scale(0.8) rotate(10deg)';
                detalhesc2.style.opacity = '0';
                detalhesc2.style.filter = 'none';

                detalhesc22.style.transform = 'translateX(-100vw) scale(0.8) rotate(-10deg)';
                detalhesc22.style.opacity = '0';
                detalhesc22.style.filter = 'none';
            }

            // Text animation - appears in middle of scroll and stays
            // COMENTADO: Agora controlado pelo áudio em audiocap1.js
            /*
            const fraseElement2 = document.getElementById('frasec2');
            if (scrollProgress2 > 0.4 && scrollProgress2 < 0.6) {
                // Fade in during the middle portion
                const fraseProgress = (scrollProgress2 - 0.4) / 0.2;
                fraseElement2.style.opacity = Math.min(fraseProgress, 1);
            } else if (scrollProgress2 >= 0.6) {
                // Stay visible
                fraseElement2.style.opacity = '1';
            } else {
                // Hidden before middle
                fraseElement2.style.opacity = '0';
            }
            */
        } else if (container2Top <= -scrollableSpace2) {
            // Já scrollou além do container da cena 2
            personagemImg.style.opacity = '1';
            personagemImg.style.top = '50%'; 
            personagemImg.style.transform = 'translateX(-50%) translateY(-50%)';
            
            // Posição final do background - mostrando a parte de baixo
            const maxBgShift = 100 - (100 * (viewportHeight / backgroundImg.offsetHeight));
            backgroundImg.style.transform = `translateY(-${maxBgShift}%)`;

            // Keep text visible at end of scene
            // COMENTADO: Agora controlado pelo áudio em audiocap1.js
            // document.getElementById('frasec2').style.opacity = '1';
        } else {
            // Ainda não chegou ao container da cena 2
            personagemImg.style.opacity = '0';
            personagemImg.style.top = '-50%'; // Fora da tela, no topo
            personagemImg.style.transform = 'translateX(-50%) translateY(-50%)';
            backgroundImg.style.transform = 'translateY(0)';

            // Reset do áudio quando sair da cena 2
            if (window.cena2AudioStarted) {
                const audioCena2 = document.getElementById('audio-cena2');
                
                if (audioCena2) {
                    audioCena2.pause();
                    audioCena2.currentTime = 0;
                    console.log("Saindo da cena 2 - parando áudio");
                }
                window.cena2AudioStarted = false;
            }

            // Reset when above viewport
            // COMENTADO: Agora controlado pelo áudio em audiocap1.js
            // document.getElementById('frasec2').style.opacity = '0';
        }

        // -------- CENA 3 - Detalhes com animação -------- //
        const stickyContainer3 = document.getElementById('sticky-container3');
        const container3Rect = stickyContainer3.getBoundingClientRect();
        const container3Top = container3Rect.top;
        const container3Height = stickyContainer3.offsetHeight;
        const scrollableSpace3 = container3Height - viewportHeight;
        
        if (container3Top <= 0 && container3Top > -scrollableSpace3) {
            const scrollProgress3 = Math.abs(container3Top) / scrollableSpace3;
            const personagem = document.getElementById('personagemc3-img');

            // Controlar áudio da cena 3 - iniciar quando entrar na cena
            if (!window.cena3AudioStarted) {
                const audioCena3 = document.getElementById('audio-cena3');
                const audioCena2 = document.getElementById('audio-cena2');
                
                if (audioCena3) {
                    console.log("Iniciando audio-cena3");
                    if (audioCena2) {
                        audioCena2.pause();
                        audioCena2.currentTime = 0;
                    }
                    audioCena3.play();
                    window.cena3AudioStarted = true;
                    window.cena2AudioStarted = false; // Reset da flag da cena 2
                    window.audioTransitioned = false; // Reset da flag de transição
                }
            }

            // Controla o personagem da cena 3 - sempre visível quando na cena
            const detalhesc3 = document.getElementById('detalhesc3-img');
            // Personagem sempre visível quando estamos na cena 3
            personagem.classList.add('visible');
            personagem.style.opacity = '1';
            personagem.style.visibility = 'visible'; // Garantir que está visível
            
            // Mesa aparece quase imediatamente - resetando transformações
            detalhesc3.style.transform = 'scale(1)'; // Reset any scale
            detalhesc3.style.filter = 'none'; // Reset any filters
            
            if (scrollProgress3 < 0.05) {
                // 0% - 5%: Completamente invisível (preparando para animação)
                detalhesc3.style.opacity = '0';
                detalhesc3.style.visibility = 'visible'; // Mantém visível para animação
            } else {
                // 5% +: Animação controlada no código abaixo
                detalhesc3.style.visibility = 'visible';
            }
        } else {
            // Quando fora da cena 3, esconde o personagem temporariamente e para áudios
            const personagem = document.getElementById('personagemc3-img');
            if (personagem) {
                personagem.classList.remove('visible');
                personagem.style.opacity = '0';
                // NÃO definir visibility = 'hidden' para permitir reaparecimento
            }

            // Reset dos áudios quando sair da cena 3
            if (window.cena3AudioStarted) {
                const audioCena3 = document.getElementById('audio-cena3');
                const audioCena4 = document.getElementById('audio-cena4');
                
                if (audioCena3) {
                    audioCena3.pause();
                    audioCena3.currentTime = 0;
                }
                if (audioCena4) {
                    audioCena4.pause();
                    audioCena4.currentTime = 0;
                }
                
                window.cena3AudioStarted = false;
                window.audioTransitioned = false;
                console.log("Saindo da cena 3 - parando áudios");
            }
        }

        if (container3Top <= 0 && container3Top > -scrollableSpace3) {
            const scrollProgress3 = Math.abs(container3Top) / scrollableSpace3;
            const personagem = document.getElementById('personagemc3-img');
            const personagemc2 = document.getElementById('personagemc2-img');
            const detalhesc3 = document.getElementById('detalhesc3-img');

            // Debug logs
            console.log('Scene 3 Progress:', scrollProgress3);
            console.log('Character 2 exists:', !!personagemc2);
            
            // Scene 2 character exit animation
            if (scrollProgress3 < 0.5) {
                if (personagemc2) {
                    const exitProgress = scrollProgress3 / 0.5;
                    const easedProgress = easeOutElastic(exitProgress);
                    
                    const xPos = 100 * easedProgress;
                    const yPos = -50 * easedProgress;
                    const scale = 1 - (0.5 * easedProgress);
                    
                
                    
                    personagemc2.style.transform = `translate(${xPos}%, ${yPos}%) scale(${scale})`;
                    personagemc2.style.opacity = 1 - exitProgress;
                    
                    // Add visibility handling
                    if (exitProgress >= 1) {
                        personagemc2.style.visibility = 'hidden';
                    } else {
                        personagemc2.style.visibility = 'visible';
                    }
                }
            } else if (personagemc2) {
                // Ensure character is completely hidden after animation
                personagemc2.style.transform = 'translate(100%, -50%) scale(0.5)';
                personagemc2.style.opacity = '0';
                personagemc2.style.visibility = 'hidden';
            }

            // New character animation with scene 2 transition
           if (scrollProgress3 < 0.5) {
                if (personagemc2) {
                    const exitProgress = scrollProgress3 / 0.5;
                    const easedProgress = easeOutElastic(exitProgress);
                    
                    const xPos = 100 * easedProgress;
                    const yPos = -50 * easedProgress;
                    const scale = 1 - (0.5 * easedProgress);
                    
                   
                    personagemc2.style.transform = `translate(${xPos}%, ${yPos}%) scale(${scale})`;
                    personagemc2.style.opacity = 1 - exitProgress;
                }

                // Add exit animation for detalhesc2-img
                const detalhesc2 = document.getElementById('detalhesc2-img');
                const detalhesc22 = document.getElementById('detalhesc22-img');
                if (detalhesc2 && detalhesc22) {
                    const exitProgress = scrollProgress3 / 0.25;
                    const easedProgress = easeOutElastic(exitProgress);
                    
                    // First details element (detalhesc2)
                    const xPos1 = -100 * easedProgress;
                    const yPos1 = -50 * easedProgress;
                    const scale1 = 1 - (0.3 * easedProgress);
                    
                    detalhesc2.style.transform = `translate(${xPos1}%, ${yPos1}%) scale(${scale1})`;
                    detalhesc2.style.opacity = 1 - exitProgress;
                    
                    // Second details element (detalhesc22)
                    const xPos2 = 100 * easedProgress;
                    const yPos2 = -50 * easedProgress;
                    const scale2 = 1 - (0.3 * easedProgress);
                    
                    detalhesc22.style.transform = `translate(${xPos2}%, ${yPos2}%) scale(${scale2})`;
                    detalhesc22.style.opacity = 1 - exitProgress;
                }
            } else if (personagemc2) {
                // Ensure character is completely off screen after animation
                personagemc2.style.transform = 'translate(100%, -50%) scale(0.5)';
                personagemc2.style.opacity = '0';
                
                // Hide details elements
                const detalhesc2 = document.getElementById('detalhesc2-img');
                const detalhesc22 = document.getElementById('detalhesc22-img');
                if (detalhesc2 && detalhesc22) {
                    detalhesc2.style.transform = 'translate(-100%, -50%) scale(0.5)';
                    detalhesc2.style.opacity = '0';
                    
                    detalhesc22.style.transform = 'translate(100%, -50%) scale(0.5)';
                    detalhesc22.style.opacity = '0';
                }
            }

            // Mesa visibility é controlada no código acima
            // Animação da mesa ultra rápida com fade-in
            
            // Mesa animation - ultra rápida (5% to 9% of scroll)
            if (scrollProgress3 > 0.05 && scrollProgress3 < 0.09) {
                const detailsProgress = (scrollProgress3 - 0.05) / 0.04; // 5% to 9% (ultra rápida)
                const easedProgress = easeOutElasticExaggerated(detailsProgress);
                
                // Scale from 0.1 to 1.5 then back to 1
                const scale = 0.1 + (easedProgress * 1.4);
                
                // Fade-in opacity from 0 to 1
                const opacity = detailsProgress;
                
                detalhesc3.style.transform = `scale(${scale})`;
                detalhesc3.style.opacity = opacity;
                
                // Shadow effect durante animação - mais intenso e dramático
                const shadowIntensity = Math.sin(detailsProgress * Math.PI) * 100;
                detalhesc3.style.filter = `drop-shadow(0px ${shadowIntensity}px ${shadowIntensity/2}px rgba(0,0,0,0.8))`;
            } else if (scrollProgress3 >= 0.09) {
                // Keep details in final state after animation
                detalhesc3.style.transform = 'scale(1)';
                detalhesc3.style.opacity = '1';
                detalhesc3.style.filter = 'none';
            }
            // Comentado para evitar conflito:
            /*
            // Details animation (starts at 40% of scroll)
            if (scrollProgress3 > 0.4 && scrollProgress3 < 0.8) {
                const detailsProgress = (scrollProgress3 - 0.4) / 0.4;
                const easedProgress = easeOutElasticExaggerated(detailsProgress);
                
                // Scale from 0.1 to 1.4
                const scale = 0.1 + (easedProgress * 1);
                
                detalhesc3.style.transform = `scale(${scale})`;
                detalhesc3.style.opacity = Math.min(detailsProgress * 1, 1);
                
                // Shadow effect
                const shadowIntensity = Math.sin(detailsProgress * Math.PI) * 40;
                detalhesc3.style.filter = `drop-shadow(0px ${shadowIntensity}px ${shadowIntensity/2}px rgba(0,0,0,0.4))`;
            } else if (scrollProgress3 >= 0.8) {
                // Keep details in final state
                detalhesc3.style.transform = 'scale(1)';
                detalhesc3.style.opacity = '1';
                detalhesc3.style.filter = 'none';
            } else {
                // Keep details hidden before their animation
                detalhesc3.style.transform = 'scale(1)';
                detalhesc3.style.opacity = '1';
                detalhesc3.style.filter = 'none';
            }
            */

            // COMENTADO: Agora controlado pelo áudio em audiocap1.js
            /*
            // Fade in frase3 when scrollProgress3 is between 0.3 and 0.4
            if (scrollProgress3 > 0.3 && scrollProgress3 < 0.4) {
                const fraseProgress = (scrollProgress3 - 0.3) / 0.1;
                document.getElementById('frasec3').style.opacity = Math.min(fraseProgress, 1);
            } else if (scrollProgress3 >= 0.4) {
                document.getElementById('frasec3').style.opacity = '1';
            } else {
                document.getElementById('frasec3').style.opacity = '0';
            }
            */

            // Transition to scene 4
            handlePopupAnimation(scrollProgress3);

            // Inside your scroll event listener, where you handle the popup animation
            if (scrollProgress3 >= 0.6) {
                const popupProgress = calculateTransitionProgress(scrollProgress3, 0.6, 0.3);
                const popup = document.getElementById('detalhesc42-img');
                // COMENTADO: Agora controlado pelo áudio em audiocap1.js
                // const frase3 = document.getElementById('frasec3');
                
                if (popupProgress > 0) {
                    popup.style.visibility = 'visible';
                    
                    if (popupProgress >= 1) {
                        popup.classList.add('active');
                        
                        // COMENTADO: Agora controlado pelo áudio em audiocap1.js
                        /*
                        // Add delay before showing frase3
                        setTimeout(() => {
                            frase3.style.opacity = '1';
                        }, 500); // 500ms delay after popup is active
                        */
                    }
                }
            } else {
                const popup = document.getElementById('detalhesc42-img');
                // COMENTADO: Agora controlado pelo áudio em audiocap1.js
                // const frase3 = document.getElementById('frasec3');
                popup.classList.remove('active');
                popup.style.visibility = 'hidden';
                // COMENTADO: Agora controlado pelo áudio em audiocap1.js
                // frase3.style.opacity = '0';
            }

            // Inside your scroll event listener, after the details transition completes
            if (scrollProgress3 >= 0.7) { // Adjusted for earlier transition
                const popup = document.getElementById('detalhesc42-img');
                if (!popup.classList.contains('active')) {
                    setTimeout(showPopup, 500); // Add a small delay
                }
            }

            // Add exit animation for detalhesc2-img
            if (scrollProgress3 < 0.1) {
                const detalhesc2 = document.getElementById('detalhesc2-img');
                if (detalhesc2) {
                    const exitProgress = easeInOutQuad(scrollProgress3 / 0.1);
                    const xPos = exitProgress * 150; // Increased range of movement
                    detalhesc2.style.transform = `translateX(${xPos}vw)`;
                    detalhesc2.style.opacity = Math.cos(exitProgress * Math.PI * 0.5); // Smoother fade
                    detalhesc2.style.transition = 'transform 0.8s ease-out, opacity 0.8s ease-out';
                }
            } else {
                const detalhesc2 = document.getElementById('detalhesc2-img');
                if (detalhesc2) {
                    detalhesc2.style.transform = 'translateX(150vw)';
                    detalhesc2.style.opacity = '0';
                }
            }

            // ...existing code...
            if (scrollProgress3 < 0.01) {
                if (personagemc2) {
                    const exitProgress = easeOutQuad(scrollProgress3 / 0.01);
                    const yPos = 50 + (exitProgress * 150); // Move down from center faster
                    const scale = 1 - (0.3 * exitProgress);
                    
                    personagemc2.style.transform = `translate(-50%, ${yPos}%) scale(${scale})`;
                    personagemc2.style.opacity = 1 - exitProgress;
                    personagemc2.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
                }
            } else if (personagemc2) {
                personagemc2.style.transform = 'translate(-50%, 200%) scale(0.7)';
                personagemc2.style.opacity = '0';
            }
            // ...existing code...
        } else {
            // Reset character when outside scene 3 but allow it to reappear when returning
            const personagem3 = document.getElementById('personagemc3-img');
            if (personagem3) {
                personagem3.style.opacity = '0';
                personagem3.classList.remove('visible');
            }
            // Keep the table (detalhesc3-img) visible after leaving scene 3
            // const detalhesc3 = document.getElementById('detalhesc3-img');
            // detalhesc3.style.opacity = '0';
            // detalhesc3.style.visibility = 'hidden';
        }
    });
    
    // Dispara o evento de scroll uma vez para configurar a posição inicial
    window.dispatchEvent(new Event('scroll'));
    
    // Função ajustada para definir a altura do container baseada na altura real da imagem
    function ajustarAlturaContainer2() {
        const fundo2Img = document.getElementById('fundo2-img');
        const stickyContainer2 = document.getElementById('sticky-container-2');
        const cena2 = document.getElementById('cena2');
        
        // Esperar a imagem carregar para obter a altura real
        if (fundo2Img.complete) {
            ajustarAltura();
        } else {
            fundo2Img.addEventListener('load', ajustarAltura);
        }
        
        function ajustarAltura() {
            // Obter a altura real da imagem
            const alturaImagem = fundo2Img.naturalHeight;
            const larguraImagem = fundo2Img.naturalWidth;
            const larguraTela = window.innerWidth;
            
            // Calcular a altura proporcional da imagem quando ajustada à largura da tela
            const alturaAjustada = (alturaImagem / larguraImagem) * larguraTela;
            
            // Definir altura do container com base na imagem e viewport
            // Usamos 2 * viewport + altura ajustada para garantir espaço suficiente para o efeito
            const alturaContainer = (2 * window.innerHeight) + alturaAjustada;
            // COMENTADO: A altura agora é definida estaticamente no início
            // stickyContainer2.style.height = alturaContainer + 'px';
            
            // Ajustar o estilo do fundo2-img para exibir a imagem completa
            fundo2Img.style.height = alturaAjustada + 'px';
            fundo2Img.style.maxHeight = 'none';
            fundo2Img.style.width = '100%';
            fundo2Img.style.objectFit = 'cover';
            fundo2Img.style.objectPosition = 'top';
            fundo2Img.style.position = 'absolute';
            fundo2Img.style.top = '0';
            fundo2Img.style.left = '0';
            
            // Ajustar o espaço para a animação da cena 2
            // Limpar os espaços extras que não são necessários
            document.getElementById('animation-space-2').style.height = '0';
            document.getElementById('extra-space-2').style.height = '0';
            
            console.log('Altura da imagem ajustada:', alturaAjustada);
            console.log('Altura do container:', alturaContainer);
        }
    }
    
    // COMENTADO: A altura agora é definida estaticamente no início
    // ajustarAlturaContainer2();
    // window.addEventListener('resize', ajustarAlturaContainer2);

    // Add scene 4 setup function
    function setupScene4() {
        const stickyContainer3 = document.getElementById('sticky-container');
        const stickyContainer4 = document.getElementById('sticky-container-4');
        
        if (stickyContainer3 && stickyContainer4) {
            stickyContainer4.style.position = 'absolute';
            stickyContainer4.style.top = stickyContainer3.offsetTop + 'px';
            stickyContainer4.style.height = window.innerHeight + 'px';
        }
    }

    // Call setup and add resize listener
    setupScene4();
    window.addEventListener('resize', setupScene4);
});

// Add these styles to your CSS file or add them dynamically
const transitionStyles = document.createElement('style');
transitionStyles.innerHTML = `
    #sticky-container-4 {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        visibility: hidden;
        z-index: 10;
    }
    
    #cena4 {
        position: relative;
        height: 100vh;
        width: 100%;
        overflow: hidden;
    }
    
    #fundo4-img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transform: translateY(100%);
        opacity: 0;
        transition: transform 0.1s ease-out, opacity 0.1s ease-out;
    }
    
    #fundo3-img {
        transition: transform 0.1s ease-out, opacity 0.1s ease-out;
    }
    
    #personagemc4-img, #detalhesc4-img {
        visibility: hidden;
        position: absolute;
        z-index: 11;
    }
`;
document.head.appendChild(transitionStyles);

// Add these styles at the end of your existing styles
const overlayStyles = document.createElement('style');
overlayStyles.innerHTML = `
    #transition-overlay {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background-color: #000;
        z-index: 1000;
        transition: height 1s ease-in-out;
    }
`;

// Create transition overlay element
function createTransitionOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'transition-overlay';
    overlay.style.position = 'fixed';
    overlay.style.bottom = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '0';
    overlay.style.backgroundColor = '#011309'; // Same as background color
    overlay.style.zIndex = '1000';
    overlay.style.transition = 'height 1s ease-in-out';
    document.body.appendChild(overlay);
    return overlay;
}

// Function to handle the transition
function pageTransition(targetUrl) {
    const overlay = createTransitionOverlay();
    
    // Start animation - expand from bottom to top
    setTimeout(() => {
        overlay.style.height = '100%';
    }, 50);
    
    // After animation completes, navigate to the target page
    setTimeout(() => {
        window.location.href = targetUrl;
    }, 1000); // Match this with the transition duration
}

// Modificar o event listener do popup
document.addEventListener('DOMContentLoaded', () => {
    const popup = document.getElementById('detalhesc42-img');
    
    if (popup) {
        popup.removeAttribute('onclick');
        popup.style.cursor = 'pointer';
        popup.style.pointerEvents = 'auto'; // Garantir que eventos de clique funcionem
        
        // Adicionar logging para debug
        popup.addEventListener('click', (e) => {
            console.log('Popup clicked!');
            e.stopPropagation(); // Impedir propagação do evento
            pageTransition('./textos/cap1texto.html'); // Updated path to match new folder structure
        });
        
        // Impedir que cliques em outros elementos interfiram
        document.addEventListener('click', (e) => {
            if (e.target.id === 'detalhesc42-img') {
                console.log('Popup clicked through document!');
            }
        });
    }
});

function handleSceneTransition(scrollProgress3) {
    const fundo4 = document.getElementById('fundo4-img');
    const character = document.querySelector('.character-wrapper');
    const details = document.querySelector('.details-wrapper');
    const popup = document.querySelector('.popup-wrapper');
    
    if (scrollProgress3 >= 1) {
        if (lastFixedPosition === 0) {
            lastFixedPosition = window.scrollY;
        }
        
        const scrollOffset = window.scrollY - lastFixedPosition;
        document.documentElement.style.setProperty('--scroll-offset', `${scrollOffset}px`);
        
        [fundo4, character, details, popup].forEach(el => {
            if (el) {
                el.classList.add('fixed', 'scrolling');
                el.style.position = 'fixed';
                el.style.bottom = '0';
            }
        });
    } else {
        lastFixedPosition = 0;
        document.documentElement.style.setProperty('--scroll-offset', '0px');
        
        [fundo4, character, details, popup].forEach(el => {
            if (el) {
                el.classList.remove('fixed', 'scrolling');
                el.style.position = '';
                el.style.bottom = '';
            }
        });
    }
}