document.addEventListener("DOMContentLoaded", function () {
    const scenes = [
        { id: "chapter4", audioId: "audio-intro" },
        { id: "sticky-container", audioId: "audio-cena1" },
        { id: "sticky-container2", audioId: "audio-cena2" },
        { id: "sticky-container2", audioId: "audio-cena3" }
    ];

    let currentAudio = null;
    let audioUnlocked = false;
    let cena2HasPlayed = false;
    let cena3HasStarted = false;
    
    // Observador especial para o audio-cena2 baseado na imagem da árvore
    let treeObserver = null;
    
    // Observador para a imagem da mão (audio-cena3)
    let handObserver = null;
    
    // Observador para a imagem arvoreesq (terminar audio-cena2)
    let treeLeftObserver = null;
    
    // Sistema de debounce para evitar múltiplas execuções
    let treeLeftDebounceTimer = null;
    let lastTreeLeftPosition = 0;
    
    // Função para verificar se a arvoreesq se moveu para a esquerda
    function checkTreeLeftMovement() {
        const treeLeftImg = document.getElementById('cap4cena2detalhes1-img');
        if (treeLeftImg && audioUnlocked) {
            const computedStyle = window.getComputedStyle(treeLeftImg);
            const transform = computedStyle.transform;
            const left = computedStyle.left;
            const marginLeft = computedStyle.marginLeft;
            
            // Extrair posição atual
            let currentPosition = 0;
            if (transform && transform !== 'none' && transform.includes('matrix')) {
                const matrixMatch = transform.match(/matrix\([^,]+,\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*([^,]+),/);
                if (matrixMatch) {
                    currentPosition = parseFloat(matrixMatch[1]);
                }
            }
            
            // Verificar múltiplas formas de movimento para a esquerda
            let isMovingLeft = false;
            
            // Verificar matrix transform (formato: matrix(1, 0, 0, 1, x, y))
            if (transform && transform !== 'none' && transform.includes('matrix')) {
                const matrixMatch = transform.match(/matrix\([^,]+,\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*([^,]+),/);
                if (matrixMatch) {
                    const translateX = parseFloat(matrixMatch[1]);
                    isMovingLeft = translateX < -50; // Consideramos movimento significativo após -50px
                }
            }
            
            // Verificar outras formas de movimento
            if (!isMovingLeft) {
                isMovingLeft = 
                    (transform && transform !== 'none' && transform.includes('translateX') && transform.includes('-')) ||
                    (left && left !== 'auto' && left.includes('-') && parseFloat(left) < 0) ||
                    (marginLeft && marginLeft !== '0px' && marginLeft.includes('-') && parseFloat(marginLeft) < 0) ||
                    (treeLeftImg.style.left && treeLeftImg.style.left.includes('-')) ||
                    (treeLeftImg.style.transform && treeLeftImg.style.transform.includes('translateX') && treeLeftImg.style.transform.includes('-'));
            }
            
            // Debounce para evitar múltiplas execuções
            if (treeLeftDebounceTimer) {
                clearTimeout(treeLeftDebounceTimer);
            }
            
            treeLeftDebounceTimer = setTimeout(() => {
                if (isMovingLeft && currentAudio && currentAudio.id === 'audio-cena2') {
                    // Parar audio-cena2 se estiver tocando
                    const audio2 = document.getElementById('audio-cena2');
                    if (audio2 && currentAudio === audio2) {
                        audio2.pause();
                        audio2.currentTime = 0;
                        currentAudio = null;
                        
                        // Iniciar audio-cena3 automaticamente
                        startCena3();
                    }
                }
                lastTreeLeftPosition = currentPosition;
            }, 100); // Debounce de 100ms
        }
    }
    
    // Função para configurar o observador da árvore esquerda
    function setupTreeLeftObserver() {
        if (treeLeftObserver) {
            treeLeftObserver.disconnect();
        }
        
        const treeLeftImg = document.getElementById('cap4cena2detalhes1-img');
        if (treeLeftImg) {
            treeLeftObserver = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && 
                        (mutation.attributeName === 'style' || 
                         mutation.attributeName === 'class' || 
                         mutation.attributeName === 'transform')) {
                        checkTreeLeftMovement();
                    }
                });
            });
            
            treeLeftObserver.observe(treeLeftImg, {
                attributes: true,
                attributeFilter: ['style', 'class', 'transform'],
                attributeOldValue: true,
                subtree: true
            });
            
            // Verificar também periodicamente (menos frequente)
            setInterval(() => {
                if (audioUnlocked && currentAudio && currentAudio.id === 'audio-cena2') {
                    checkTreeLeftMovement();
                }
            }, 500); // Mudado de 100ms para 500ms
        }
    }
    
    // Função para verificar se a mão está na posição left:-50%
    function checkHandPosition() {
        const handImg = document.getElementById('cap4cena2mao-img');
        if (handImg && audioUnlocked) {
            const computedStyle = window.getComputedStyle(handImg);
            const leftValue = computedStyle.left;
            
            // Verificar se a mão está em left:-50% (ou próximo disso)
            if (leftValue === '-50%' || leftValue.includes('-50%') || leftValue.includes('-48%') || leftValue.includes('-49%') || leftValue.includes('-51%') || leftValue.includes('-52%')) {
                startCena3();
            }
        }
    }
    
    // Função para configurar o observador da mão
    function setupHandObserver() {
        if (handObserver) {
            handObserver.disconnect();
        }
        
        const handImg = document.getElementById('cap4cena2mao-img');
        if (handImg) {
            handObserver = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
                        checkHandPosition();
                    }
                });
            });
            
            handObserver.observe(handImg, {
                attributes: true,
                attributeFilter: ['style', 'class']
            });
        }
    }
    
    // Função para verificar se a árvore está visível (com classe 'show')
    function checkTreeAnimation() {
        const leftTree = document.querySelector('.slide-left');
        if (leftTree && audioUnlocked) {
            const isVisible = leftTree.classList.contains('show');
            const isHidden = leftTree.classList.contains('hide');
            
            const audio2 = document.getElementById('audio-cena2');
            if (audio2) {
                if (isVisible && !isHidden) {
                    // Verificar se o elemento da árvore esquerda existe
                    const treeLeftImg = document.getElementById('cap4cena2detalhes1-img');
                    
                    // Resetar flag da cena3 quando volta para cena2
                    cena3HasStarted = false;
                    
                    // Árvore está se movendo para a direita - iniciar áudio
                    if (currentAudio && currentAudio !== audio2) {
                        currentAudio.pause();
                        currentAudio.currentTime = 0;
                    }
                    currentAudio = audio2;
                    cena2HasPlayed = true;
                    audio2.play().catch(() => {});
                }
            }
        }
    }
    
    // Função para configurar o observador da árvore
    function setupTreeObserver() {
        if (treeObserver) {
            treeObserver.disconnect();
        }
        
        const leftTree = document.querySelector('.slide-left');
        if (leftTree) {
            treeObserver = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        checkTreeAnimation();
                    }
                });
            });
            
            treeObserver.observe(leftTree, {
                attributes: true,
                attributeFilter: ['class']
            });
        }
    }
    
    // Função para iniciar audio-cena3
    function startCena3() {
        // Remover a verificação cena3HasStarted para permitir múltiplas reproduções
        const audio3 = document.getElementById("audio-cena3");
        if (audio3) {
            if (currentAudio && currentAudio !== audio3) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
            }
            currentAudio = audio3;
            cena3HasStarted = true;
            audio3.play().catch(() => {});
        }
    }
    
    // Teste manual: simular IntersectionObserver
    window.testIntersectionObserver = function() {
        const chapter4 = document.getElementById("chapter4");
        if (chapter4) {
            const scene = scenes.find(s => s.id === "chapter4");
            if (scene) {
                const audio = document.getElementById(scene.audioId);
                if (audio && audioUnlocked) {
                    audio.play().catch(() => {});
                }
            }
        }
    };
    
    // Configurar IntersectionObserver
    const observer = new IntersectionObserver((entries) => {
        if (!audioUnlocked) {
            return;
        }
        entries.forEach(entry => {
            const scene = scenes.find(s => s.id === entry.target.id);
            if (!scene) return;
            
            const audio = document.getElementById(scene.audioId);
            if (!audio) return;

            if (entry.isIntersecting) {
                // Para audio-intro (chapter4): toca quando aparece
                if (scene.audioId === "audio-intro") {
                    if (currentAudio && currentAudio !== audio) {
                        currentAudio.pause();
                        currentAudio.currentTime = 0;
                    }
                    currentAudio = audio;
                    audio.play().catch(() => {});
                }
                // Para audio-cena1 (sticky-container): toca sempre que aparece (mesmo voltando para cima)
                else if (scene.audioId === "audio-cena1") {
                    // Parar qualquer áudio atual (incluindo cena2 ou cena3)
                    if (currentAudio && currentAudio !== audio) {
                        currentAudio.pause();
                        currentAudio.currentTime = 0;
                    }
                    currentAudio = audio;
                    
                    // Reset dos flags quando volta para cena1
                    cena2HasPlayed = false;
                    cena3HasStarted = false;
                    
                    audio.play().catch(() => {});
                }
                // Para audio-cena2: toca quando aparece sticky-container2
                else if (scene.audioId === "audio-cena2") {
                    if (currentAudio && currentAudio !== audio) {
                        currentAudio.pause();
                        currentAudio.currentTime = 0;
                    }
                    currentAudio = audio;
                    cena2HasPlayed = true;
                    audio.play().catch(() => {});
                }
                // Para sticky-container2: não fazer nada para cena3, deixar ser controlado pela mão
                else if (scene.id === "sticky-container2" && scene.audioId === "audio-cena3") {
                    // Não fazer nada, deixar o audio-cena3 ser controlado pela posição da mão
                }
            } else {
                // Para audio-intro: para quando sai de tela
                if (scene.audioId === "audio-intro" && !entry.isIntersecting) {
                    if (audio && currentAudio === audio) {
                        audio.pause();
                        audio.currentTime = 0;
                    }
                }
                // Para audio-cena1: para quando sai de tela
                if (scene.audioId === "audio-cena1" && !entry.isIntersecting) {
                    if (audio && currentAudio === audio) {
                        audio.pause();
                        audio.currentTime = 0;
                    }
                }
            }
        });
    }, { threshold: 0.1, rootMargin: '50px 0px' });
    
    // Observar os elementos
    scenes.forEach(scene => {
        const el = document.getElementById(scene.id);
        if (el) {
            observer.observe(el);
        }
    });

    // Função para desbloquear todos os áudios
    function unlockAllAudios() {
        scenes.forEach(scene => {
            const audio = document.getElementById(scene.audioId);
            if (audio) {
                // Tentar tocar e pausar imediatamente para desbloquear
                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        audio.pause();
                        audio.currentTime = 0;
                    }).catch(() => {});
                }
            }
        });
    }

    function handleFirstInteraction() {
        unlockAllAudios();
        audioUnlocked = true;
        
        // Configurar observador da árvore
        setupTreeObserver();
        
        // Configurar observador da mão
        setupHandObserver();
        
        // Configurar observador da árvore esquerda
        setupTreeLeftObserver();
        
        document.removeEventListener('click', handleFirstInteraction);
        window.removeEventListener('scroll', handleFirstInteraction);
    }

    document.addEventListener('click', handleFirstInteraction);
    window.addEventListener('scroll', handleFirstInteraction);
    
    // Função para testar animação da árvore
    window.testTreeAnimation = function() {
        checkTreeAnimation();
    };
    
    // Função para testar posição da mão
    window.testHandPosition = function() {
        checkHandPosition();
    };
    
    // Função para testar movimento da árvore esquerda
    window.testTreeLeftMovement = function() {
        checkTreeLeftMovement();
    };
    
    // Função para testar o sistema completo de áudio
    window.testAudioSystem = function() {
        console.log('� [SISTEMA] Testando sistema de áudio completo...');
        
        // 1. Verificar se o áudio está desbloqueado
        console.log('🎵 [SISTEMA] Áudio desbloqueado?', audioUnlocked);
        
        // 2. Verificar áudio atual
        console.log('� [SISTEMA] Áudio atual:', currentAudio ? currentAudio.id : 'none');
        
        // 3. Verificar elementos
        const leftTree = document.querySelector('.slide-left');
        const treeLeftImg = document.getElementById('cap4cena2detalhes1-img');
        const handImg = document.getElementById('cap4cena2mao-img');
        
        console.log('� [SISTEMA] Elementos encontrados:', {
            leftTree: !!leftTree,
            treeLeftImg: !!treeLeftImg,
            handImg: !!handImg
        });
        
        // 4. Verificar observadores
        console.log('🎵 [SISTEMA] Observadores ativos:', {
            treeObserver: !!treeObserver,
            handObserver: !!handObserver,
            treeLeftObserver: !!treeLeftObserver
        });
        
        // 5. Testar detecção da árvore esquerda
        if (treeLeftImg) {
            const computedStyle = window.getComputedStyle(treeLeftImg);
            console.log('� [SISTEMA] Estado da árvore esquerda:', {
                transform: computedStyle.transform,
                left: computedStyle.left,
                marginLeft: computedStyle.marginLeft,
                inlineStyle: treeLeftImg.style.cssText
            });
        }
        
        // 6. Verificar se há áudio tocando
        const allAudios = document.querySelectorAll('audio');
        allAudios.forEach(audio => {
            if (!audio.paused) {
                console.log('� [SISTEMA] Áudio tocando:', audio.id, 'currentTime:', audio.currentTime);
            }
        });
        
        return {
            audioUnlocked,
            currentAudio: currentAudio ? currentAudio.id : null,
            elements: { leftTree: !!leftTree, treeLeftImg: !!treeLeftImg, handImg: !!handImg },
            observers: { treeObserver: !!treeObserver, handObserver: !!handObserver, treeLeftObserver: !!treeLeftObserver }
        };
    };
    
    // Função para simular movimento da árvore
    window.simulateTreeMovement = function(direction) {
        const leftTree = document.querySelector('.slide-left');
        if (leftTree) {
            if (direction === 'right') {
                leftTree.classList.add('show');
                leftTree.classList.remove('hide');
            } else if (direction === 'left') {
                leftTree.classList.add('hide');
                leftTree.classList.remove('show');
            }
        }
    };
    
    // Função para simular movimento da mão
    window.simulateHandMovement = function() {
        const handImg = document.getElementById('cap4cena2mao-img');
        if (handImg) {
            handImg.style.left = '-50%';
            checkHandPosition();
        }
    };
    
    // Função para simular movimento da árvore esquerda
    window.simulateTreeLeftMovement = function() {
        const treeLeftImg = document.getElementById('cap4cena2detalhes1-img');
        if (treeLeftImg) {
            // Testar múltiplas formas de movimento
            treeLeftImg.style.transform = 'translateX(-100px)';
            treeLeftImg.style.left = '-50px';
            treeLeftImg.classList.add('move-left');
            
            setTimeout(() => {
                checkTreeLeftMovement();
            }, 100);
        }
    };
    
    // Função para testar sequência completa
    window.testTreeSequence = function() {
        // Simular árvore movendo para direita (áudio cena2 inicia)
        setTimeout(() => {
            simulateTreeMovement('right');
        }, 1000);
        
        // Simular árvore esquerda movendo para esquerda (áudio cena2 para)
        setTimeout(() => {
            simulateTreeLeftMovement();
        }, 3000);
        
        // Simular mão movendo para left:-50% (áudio cena3 inicia)
        setTimeout(() => {
            simulateHandMovement();
        }, 5000);
    };
    
    // Função para testar transição cena2 -> cena3
    window.testCena2ToCena3 = function() {
        // Iniciar audio-cena2
        const audio2 = document.getElementById('audio-cena2');
        if (audio2 && audioUnlocked) {
            if (currentAudio && currentAudio !== audio2) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
            }
            currentAudio = audio2;
            cena2HasPlayed = true;
            audio2.play().catch(() => {});
            
            // Após 2 segundos, simular movimento da mão para iniciar cena3
            setTimeout(() => {
                simulateHandMovement();
            }, 2000);
        }
    };
    
    // Função para testar o sistema completo de áudio
    window.testAudioSystem = function() {
        const leftTree = document.querySelector('.slide-left');
        const treeLeftImg = document.getElementById('cap4cena2detalhes1-img');
        const handImg = document.getElementById('cap4cena2mao-img');
        
        const allAudios = document.querySelectorAll('audio');
        const playingAudios = [];
        allAudios.forEach(audio => {
            if (!audio.paused) {
                playingAudios.push(audio.id);
            }
        });
        
        return {
            audioUnlocked,
            currentAudio: currentAudio ? currentAudio.id : null,
            elements: { leftTree: !!leftTree, treeLeftImg: !!treeLeftImg, handImg: !!handImg },
            observers: { treeObserver: !!treeObserver, handObserver: !!handObserver, treeLeftObserver: !!treeLeftObserver },
            playingAudios: playingAudios
        };
    };
    
    // Função para encontrar elementos relacionados à árvore esquerda
    window.findTreeLeftElements = function() {
        const byId = document.getElementById('cap4cena2detalhes1-img');
        const byClass = document.querySelectorAll('.cap4cena2detalhes1-img, [class*="detalhes1"], [class*="arvore"]');
        const byData = document.querySelectorAll('[data-element*="detalhes1"], [data-element*="arvore"]');
        const allImages = document.querySelectorAll('img[src*="detalhes1"], img[src*="arvore"]');
        const similarIds = document.querySelectorAll('[id*="detalhes1"], [id*="arvore"]');
        
        const allFound = [...byClass, ...byData, ...allImages, ...similarIds];
        return allFound;
    };
    
    // Função para forçar parar o áudio cena2
    window.forceStopCena2 = function() {
        const audio2 = document.getElementById('audio-cena2');
        if (audio2) {
            audio2.pause();
            audio2.currentTime = 0;
            if (currentAudio === audio2) {
                currentAudio = null;
            }
        }
    };
});
