document.addEventListener("DOMContentLoaded", function () {
    const scenes = [
        { id: "chapter11", audioId: "intro-audio" },
        { id: "sticky-container1", audioId: "cena1-audio" },
        { id: "mesa-container", audioId: "cena2-audio" },
        { id: "alice-container", audioId: "cena4-audio" }
    ];

    let currentAudio = null;
    let audioUnlocked = false;
    let aliceMovementStarted = false;
    let chapeleiroMovementStarted = false;
    let aliceContainerAudioStarted = false;
    let chapeleiro3AudioStarted = false;

    // Observer para detectar quando elementos entram/saem da viewport
    const observer = new IntersectionObserver((entries) => {
        console.log("🔍 Observer executando, audioUnlocked:", audioUnlocked);
        if (!audioUnlocked) return; // Só executa se já desbloqueou
        
        entries.forEach(entry => {
            console.log("🔍 Observer detectou entrada/saída:", entry.target.id, "isIntersecting:", entry.isIntersecting, "intersectionRatio:", entry.intersectionRatio);
            
            const scene = scenes.find(s => entry.target.id === s.id);
            
            if (!scene) {
                console.log("❌ Nenhuma cena encontrada para:", entry.target.id);
                return;
            }
            
            console.log("✅ Cena encontrada:", scene);
            
            const audio = document.getElementById(scene.audioId);
            if (!audio) {
                console.log("❌ Áudio não encontrado:", scene.audioId);
                return;
            }

            if (entry.isIntersecting) {
                // Elemento entrou na viewport - iniciar áudio
                console.log("▶️ Elemento entrou na viewport:", scene.id);
                
                // Lógica especial para alice-container - só toca se Alice estiver na posição certa
                if (scene.id === 'alice-container') {
                    const alice = document.getElementById('alice');
                    if (alice) {
                        const computedStyle = window.getComputedStyle(alice);
                        const left = parseFloat(computedStyle.left) || 0;
                        const leftVw = (left / window.innerWidth) * 100;
                        console.log("👸 Verificando posição da Alice para cena4 - left:", leftVw.toFixed(1) + "vw");
                        
                        // Se Alice não está na posição direita, não toca o áudio ainda
                        if (leftVw < -5) {
                            console.log("👸 Alice não está na posição direita, aguardando movimento");
                            return;
                        }
                    }
                }
                
                if (currentAudio && currentAudio !== audio) {
                    console.log("⏸️ Parando áudio anterior:", currentAudio.id);
                    currentAudio.pause();
                    currentAudio.currentTime = 0;
                }
                currentAudio = audio;
                console.log("▶️ Iniciando áudio:", scene.audioId, "para elemento:", scene.id);
                
                audio.play().catch(e => {
                    console.log("⚠️ Áudio bloqueado pelo navegador - aguardando interação do usuário");
                });
            } else {
                // Elemento saiu da viewport - comportamento especial para chapter11 (intro)
                if (scene.id === "chapter11") {
                    // Se saiu da intro e sticky-container1 ainda está visível, volta para intro
                    const stickyContainer1 = document.getElementById('sticky-container1');
                    if (stickyContainer1) {
                        const rect = stickyContainer1.getBoundingClientRect();
                        const isInSticky1 = rect.top < window.innerHeight && rect.bottom > 0;
                        
                        // Se sticky-container1 ainda está visível na viewport mas não muito visível
                        if (isInSticky1 && rect.top > window.innerHeight * 0.3) {
                            console.log("🔄 Saiu da intro mas sticky-container1 ainda não está bem visível, mantendo intro-audio");
                            return; // Não para o áudio da intro neste caso
                        }
                    }
                }
                
                // Comportamento normal - para áudio quando sai da viewport
                if (audio === currentAudio) {
                    console.log("⏹️ Parando áudio:", scene.audioId, "elemento saiu da viewport:", scene.id);
                    audio.pause();
                    audio.currentTime = 0;
                    currentAudio = null;
                }
            }
        });
    }, {
        threshold: [0, 0.01, 0.1], // Múltiplos thresholds para detectar melhor
        rootMargin: "0px 0px 0px 0px" // Detecta quando entra na viewport completa
    });

    // Função para verificar movimento da Alice (primeira cena)
    function checkAliceMovement() {
        const alice = document.getElementById('alicecena1');
        if (!alice || !audioUnlocked || aliceMovementStarted) return;

        const left = parseFloat(alice.style.left || '0px');
        
        // Se Alice moveu-se para a direita (left > 0), inicia audio cena1
        if (left > 10) {
            console.log("🎭 Alice moveu-se para a direita, iniciando cena1-audio");
            const cena1Audio = document.getElementById('cena1-audio');
            
            if (cena1Audio) {
                if (currentAudio && currentAudio !== cena1Audio) {
                    currentAudio.pause();
                    currentAudio.currentTime = 0;
                }
                currentAudio = cena1Audio;
                aliceMovementStarted = true;
                cena1Audio.play().catch(e => {
                    console.log("⚠️ Áudio cena1 bloqueado pelo navegador");
                });
            }
        }
    }

    // Função para verificar movimento do Chapeleiro (cena3)
    function checkChapeleiroMovement() {
        const chapeleiro = document.getElementById('chapeleiro');
        if (!chapeleiro || !audioUnlocked) return;

        const computedStyle = window.getComputedStyle(chapeleiro);
        const left = parseFloat(computedStyle.left) || 0;
        const leftVw = (left / window.innerWidth) * 100;
        
        // Se Chapeleiro chegou perto de left: 0 (de -50vw para 0 OU da direita para 0), inicia audio cena3
        if (leftVw >= -5 && leftVw <= 5 && !chapeleiro3AudioStarted) {
            console.log("🎩 Chapeleiro chegou à posição 0, iniciando cena3-audio - left:", leftVw.toFixed(1) + "vw");
            const cena3Audio = document.getElementById('cena3-audio');
            
            if (cena3Audio) {
                if (currentAudio && currentAudio !== cena3Audio) {
                    console.log("⏸️ Parando áudio anterior para cena3:", currentAudio.id);
                    currentAudio.pause();
                    currentAudio.currentTime = 0;
                }
                currentAudio = cena3Audio;
                chapeleiro3AudioStarted = true;
                cena3Audio.play().catch(e => {
                    console.log("⚠️ Áudio cena3 bloqueado pelo navegador");
                });
            }
        }
        
        // Se Chapeleiro saiu do ecrã (muito à esquerda ou muito à direita), para o áudio
        if ((leftVw < -45 || leftVw > 100) && chapeleiro3AudioStarted) {
            console.log("🎩 Chapeleiro saiu do ecrã, parando cena3-audio - left:", leftVw.toFixed(1) + "vw");
            const cena3Audio = document.getElementById('cena3-audio');
            if (cena3Audio === currentAudio) {
                cena3Audio.pause();
                cena3Audio.currentTime = 0;
                currentAudio = null;
            }
            chapeleiro3AudioStarted = false;
        }
    }

    // Função para verificar movimento da Alice (quarta cena)
    function checkAliceContainerMovement() {
        const alice = document.getElementById('alice');
        if (!alice || !audioUnlocked) return;

        const computedStyle = window.getComputedStyle(alice);
        const left = parseFloat(computedStyle.left) || 0;
        const leftVw = (left / window.innerWidth) * 100;
        
        // Só fazer log se a posição mudou significativamente
        if (Math.abs(leftVw - (alice.lastLoggedPositionVw || -1000)) > 5) {
            console.log("👸 Debug Alice cena4 - left atual:", leftVw.toFixed(1) + "vw");
            alice.lastLoggedPositionVw = leftVw;
        }
        
        // Se Alice chegou perto de left: 0 (de -50vw para 0), inicia audio cena4
        if (leftVw >= -5 && !aliceContainerAudioStarted) {
            console.log("👸 Alice chegou à posição 0 na cena4, iniciando cena4-audio - left:", leftVw.toFixed(1) + "vw");
            const cena4Audio = document.getElementById('cena4-audio');
            
            if (cena4Audio) {
                if (currentAudio && currentAudio !== cena4Audio) {
                    console.log("⏸️ Parando áudio anterior para cena4:", currentAudio.id);
                    currentAudio.pause();
                    currentAudio.currentTime = 0;
                }
                currentAudio = cena4Audio;
                aliceContainerAudioStarted = true;
                cena4Audio.play().catch(e => {
                    console.log("⚠️ Áudio cena4 bloqueado pelo navegador");
                });
            }
        }
    }

    // Função para reset das flags quando necessário
    function resetAudioFlags() {
        const alice = document.getElementById('alicecena1');
        const chapeleiro = document.getElementById('chapeleiro');
        const aliceContainer = document.getElementById('alice');
        const aliceContainerElement = document.getElementById('alice-container');
        
        if (alice) {
            const left = parseFloat(alice.style.left || '0px');
            // Reset da flag da Alice só quando ela volta para a posição inicial
            if (left <= 10 && aliceMovementStarted) {
                console.log("🎭 Alice voltou à posição inicial, resetando flag");
                aliceMovementStarted = false;
            }
        }
        
        if (chapeleiro) {
            const computedStyle = window.getComputedStyle(chapeleiro);
            const left = parseFloat(computedStyle.left) || 0;
            const leftVw = (left / window.innerWidth) * 100;
            
            // Reset da flag do Chapeleiro quando ele sai da zona central (muito à esquerda ou muito à direita)
            if ((leftVw < -45 || leftVw > 100) && chapeleiro3AudioStarted) {
                console.log("🎩 Chapeleiro saiu da zona central, resetando flag - left:", leftVw.toFixed(1) + "vw");
                chapeleiro3AudioStarted = false;
            }
        }

        if (aliceContainer) {
            const computedStyle = window.getComputedStyle(aliceContainer);
            const left = parseFloat(computedStyle.left) || 0;
            const leftVw = (left / window.innerWidth) * 100;
            
            // Reset da flag da Alice quando ela volta para a posição inicial
            if (leftVw <= -45 && aliceContainerAudioStarted) {
                console.log("👸 Alice voltou à posição inicial, resetando flag");
                aliceContainerAudioStarted = false;
            }
        }
        
        // Para o áudio cena4 quando alice-container sai da viewport
        if (aliceContainerElement && aliceContainerAudioStarted) {
            const rect = aliceContainerElement.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (!isVisible) {
                console.log("👸 alice-container saiu da viewport, parando cena4-audio");
                const cena4Audio = document.getElementById('cena4-audio');
                if (cena4Audio === currentAudio) {
                    cena4Audio.pause();
                    cena4Audio.currentTime = 0;
                    currentAudio = null;
                }
                aliceContainerAudioStarted = false;
            }
        }
    }

    // Observer customizado para movimentos usando MutationObserver
    const aliceObserver = new MutationObserver(() => checkAliceMovement());
    const chapeleiroObserver = new MutationObserver(() => checkChapeleiroMovement());
    const aliceContainerObserver = new MutationObserver(() => checkAliceContainerMovement());
    
    // Configurar observers para detectar mudanças no style e classes
    const alice = document.getElementById('alicecena1');
    const chapeleiro = document.getElementById('chapeleiro');
    const aliceContainer = document.getElementById('alice');
    
    if (alice) {
        aliceObserver.observe(alice, { 
            attributes: true, 
            attributeFilter: ['style'] 
        });
        console.log("🎭 Observer configurado para movimentos da Alice");
    }
    
    if (chapeleiro) {
        chapeleiroObserver.observe(chapeleiro, { 
            attributes: true, 
            attributeFilter: ['style'] 
        });
        console.log("🎩 Observer configurado para movimentos do Chapeleiro");
    }

    if (aliceContainer) {
        aliceContainerObserver.observe(aliceContainer, { 
            attributes: true, 
            attributeFilter: ['style'] 
        });
        console.log("👸 Observer configurado para movimentos da Alice container");
    }

    // Função para verificar qual cena está visível na viewport
    function checkVisibleScenes() {
        if (!audioUnlocked) return;
        
        // Verificar se chapter11 ainda está visível para dar prioridade ao intro
        const chapter11 = document.getElementById('chapter11');
        if (chapter11) {
            const rect = chapter11.getBoundingClientRect();
            const isChapterVisible = rect.top < window.innerHeight && rect.bottom > 200; // Margem de 200px
            
            if (isChapterVisible && currentAudio && currentAudio.id === 'intro-audio') {
                // Se chapter11 ainda está bem visível e intro está tocando, não trocar
                return;
            }
        }
        
        scenes.forEach(scene => {
            const element = document.getElementById(scene.id);
            if (!element) return;
            
            const rect = element.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                const audio = document.getElementById(scene.audioId);
                if (!audio) return;
                
                // Lógica especial para alice-container - só toca se Alice estiver na posição certa
                if (scene.id === 'alice-container') {
                    const alice = document.getElementById('alice');
                    if (alice) {
                        const computedStyle = window.getComputedStyle(alice);
                        const left = parseFloat(computedStyle.left) || 0;
                        const leftVw = (left / window.innerWidth) * 100;
                        
                        // Se Alice não está na posição direita, não toca o áudio ainda
                        if (leftVw < -5) {
                            return;
                        }
                    }
                }
                
                // Para evitar loops infinitos, só troca se não é o mesmo áudio
                if (currentAudio !== audio) {
                    if (currentAudio) {
                        currentAudio.pause();
                        currentAudio.currentTime = 0;
                    }
                    currentAudio = audio;
                    audio.play().catch(e => {
                        console.log("⚠️ Áudio bloqueado pelo navegador");
                    });
                }
            }
        });
    }

    // Também verificar por polling como backup
    setInterval(() => {
        if (audioUnlocked) {
            checkAliceMovement();
            checkChapeleiroMovement();
            checkAliceContainerMovement();
            resetAudioFlags();
            checkVisibleScenes();
        }
    }, 100);

    // Configurar observers para todos os elementos
    scenes.forEach(scene => {
        const element = document.getElementById(scene.id);
        
        if (element) {
            observer.observe(element);
            console.log(`Observer configurado para: ${scene.id}`);
        } else {
            console.warn(`Elemento não encontrado: ${scene.id}`);
        }
    });

    // Função para desbloquear todos os áudios
    function unlockAllAudios() {
        console.log("🔓 Tentando desbloquear áudios...");
        const allAudios = ['intro-audio', 'cena1-audio', 'cena2-audio', 'cena3-audio', 'cena4-audio'];
        
        allAudios.forEach(audioId => {
            const audio = document.getElementById(audioId);
            if (audio) {
                console.log("🎵 Desbloqueando áudio:", audioId);
                audio.play().then(() => {
                    audio.pause();
                    audio.currentTime = 0;
                    console.log("✅ Áudio desbloqueado:", audioId);
                }).catch(e => {
                    console.log('❌ Erro ao desbloquear áudio:', audioId, e);
                });
            } else {
                console.log("❌ Áudio não encontrado:", audioId);
            }
        });
        audioUnlocked = true;
        console.log('🔓 Todos os áudios desbloqueados para cap11, audioUnlocked:', audioUnlocked);
    }

    // Desbloquear áudio no primeiro clique ou toque
    function enableAudioOnUserInteraction() {
        console.log("👆 Interação do usuário detectada - desbloqueando áudios...");
        unlockAllAudios();
        
        // Remover os event listeners após o primeiro uso
        document.removeEventListener('click', enableAudioOnUserInteraction);
        document.removeEventListener('touchstart', enableAudioOnUserInteraction);
        document.removeEventListener('keydown', enableAudioOnUserInteraction);
        document.removeEventListener('scroll', enableAudioOnUserInteraction);
    }
    
    document.addEventListener('click', enableAudioOnUserInteraction);
    document.addEventListener('touchstart', enableAudioOnUserInteraction);
    document.addEventListener('keydown', enableAudioOnUserInteraction);
    document.addEventListener('scroll', enableAudioOnUserInteraction);
    
    // Adicionar listener para scroll que verifica cenas visíveis
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (audioUnlocked) {
                checkVisibleScenes();
            }
        }, 100);
    });
    
    // Adicionar aviso visual para o usuário
    if (!audioUnlocked) {
        console.log("🔔 AVISO: Clique ou toque na página para ativar o áudio!");
    }

    console.log('🎬 Audio script para cap11 carregado, elementos encontrados:', {
        chapter11: !!document.getElementById('chapter11'),
        stickyContainer1: !!document.getElementById('sticky-container1'),
        mesaContainer: !!document.getElementById('mesa-container'),
        aliceContainer: !!document.getElementById('alice-container'),
        alicecena1: !!document.getElementById('alicecena1'),
        chapeleiro: !!document.getElementById('chapeleiro'),
        alice: !!document.getElementById('alice'),
        introAudio: !!document.getElementById('intro-audio'),
        cena1Audio: !!document.getElementById('cena1-audio'),
        cena2Audio: !!document.getElementById('cena2-audio'),
        cena3Audio: !!document.getElementById('cena3-audio'),
        cena4Audio: !!document.getElementById('cena4-audio')
    });
});
