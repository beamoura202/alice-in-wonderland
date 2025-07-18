document.addEventListener("DOMContentLoaded", function () {
    const scenes = [
        { id: "chapter12", audioId: "intro-audio" },
        { id: "sticky-container2", audioId: "cena3-audio" },
        { id: "sticky-container3", audioId: "cena4-audio" },
    ];

    let currentAudio = null;
    let audioUnlocked = false;
    let aliceAudioStarted = false;
    let rainhaAudioStarted = false;

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
                if (currentAudio && currentAudio !== audio) {
                    console.log("⏸️ Parando áudio anterior:", currentAudio.id);
                    currentAudio.pause();
                    currentAudio.currentTime = 0;
                }
                currentAudio = audio;
                console.log("▶️ Iniciando áudio:", scene.audioId, "para elemento:", scene.id);
                
                // Se entrou na cena3, para o áudio cena2 se estiver tocando
                if (scene.id === "sticky-container2") {
                    const cena2Audio = document.getElementById('cena2-audio');
                    if (cena2Audio === currentAudio) {
                        console.log("⏹️ Parando cena2-audio porque entrou na cena3");
                        cena2Audio.pause();
                        cena2Audio.currentTime = 0;
                    }
                }
                
                audio.play().catch(e => {
                    console.log("⚠️ Áudio bloqueado pelo navegador - aguardando interação do usuário");
                });
            } else {
                // Elemento saiu da viewport - comportamento especial para cena3 e cena4
                if (scene.id === "sticky-container2") {
                    // Se saiu da cena3 e rainha ainda está visível, volta para cena2
                    const rainha = document.getElementById('rainhacena2');
                    if (rainha) {
                        const computedStyle = window.getComputedStyle(rainha);
                        const bottom = parseFloat(computedStyle.bottom || '-100vh');
                        
                        // Se rainha ainda está visível (não desceu completamente)
                        if (bottom > -99 * window.innerHeight / 100) {
                            console.log("🔄 Saiu da cena3 mas rainha ainda visível, voltando para cena2-audio");
                            const cena2Audio = document.getElementById('cena2-audio');
                            if (cena2Audio && currentAudio !== cena2Audio) {
                                if (currentAudio) {
                                    currentAudio.pause();
                                    currentAudio.currentTime = 0;
                                }
                                currentAudio = cena2Audio;
                                cena2Audio.play().catch(e => {
                                    console.log("⚠️ Áudio cena2 bloqueado pelo navegador");
                                });
                            }
                            return; // Não para o áudio neste caso
                        }
                    }
                }
                
                if (scene.id === "sticky-container3") {
                    // Se saiu da cena4 e cena3 ainda está visível, volta para cena3
                    const cena3Container = document.getElementById('sticky-container2');
                    if (cena3Container) {
                        const cena3Rect = cena3Container.getBoundingClientRect();
                        const isInCena3 = cena3Rect.top < window.innerHeight && cena3Rect.bottom > 0;
                        
                        // Se cena3 ainda está visível na viewport
                        if (isInCena3) {
                            console.log("🔄 Saiu da cena4 mas cena3 ainda visível, voltando para cena3-audio");
                            const cena3Audio = document.getElementById('cena3-audio');
                            if (cena3Audio && currentAudio !== cena3Audio) {
                                if (currentAudio) {
                                    currentAudio.pause();
                                    currentAudio.currentTime = 0;
                                }
                                currentAudio = cena3Audio;
                                cena3Audio.play().catch(e => {
                                    console.log("⚠️ Áudio cena3 bloqueado pelo navegador");
                                });
                            }
                            return; // Não para o áudio neste caso
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
        rootMargin: "0px 0px -50% 0px" // Detecta quando está na metade superior da viewport
    });

    // Função para verificar movimento da Alice
    function checkAliceMovement() {
        const alice = document.getElementById('alicecena1');
        if (!alice || !audioUnlocked || aliceAudioStarted) return;

        const left = parseFloat(alice.style.left || '-100vw');
        
        // Se Alice moveu-se para a direita (left > -100vw), inicia audio cena1
        if (left > -100) {
            console.log("🎭 Alice moveu-se para a direita, iniciando cena1-audio");
            const cena1Audio = document.getElementById('cena1-audio');
            
            if (cena1Audio) {
                if (currentAudio && currentAudio !== cena1Audio) {
                    currentAudio.pause();
                    currentAudio.currentTime = 0;
                }
                currentAudio = cena1Audio;
                aliceAudioStarted = true;
                cena1Audio.play().catch(e => {
                    console.log("⚠️ Áudio cena1 bloqueado pelo navegador");
                });
            }
        }
    }

    // Função para verificar movimento da Rainha
    function checkRainhaMovement() {
        const rainha = document.getElementById('rainhacena2');
        if (!rainha || !audioUnlocked || rainhaAudioStarted) return;

        const computedStyle = window.getComputedStyle(rainha);
        const bottom = parseFloat(computedStyle.bottom || '-100vh');
        
        // Debug: mostrar o valor atual do bottom
        console.log("👑 Debug Rainha - bottom atual:", bottom + "px");
        
        // Se Rainha começou a subir (bottom > -99vh para ser mais sensível), inicia audio cena2
        if (bottom > -99 * window.innerHeight / 100) {
            console.log("👑 Rainha começou a subir, iniciando cena2-audio - bottom:", bottom + "px");
            const cena2Audio = document.getElementById('cena2-audio');
            
            if (cena2Audio) {
                if (currentAudio && currentAudio !== cena2Audio) {
                    console.log("⏸️ Parando áudio anterior para cena2:", currentAudio.id);
                    currentAudio.pause();
                    currentAudio.currentTime = 0;
                }
                currentAudio = cena2Audio;
                rainhaAudioStarted = true;
                cena2Audio.play().catch(e => {
                    console.log("⚠️ Áudio cena2 bloqueado pelo navegador");
                });
            }
        }
    }

    // Função para reset das flags quando necessário
    function resetAudioFlags() {
        const alice = document.getElementById('alicecena1');
        const rainha = document.getElementById('rainhacena2');
        
        if (alice) {
            const left = parseFloat(alice.style.left || '-100vw');
            // Reset da flag da Alice só quando ela volta completamente para a esquerda
            if (left <= -100 && aliceAudioStarted) {
                console.log("🎭 Alice voltou à posição inicial, resetando flag");
                aliceAudioStarted = false;
            }
        }
        
        if (rainha) {
            const computedStyle = window.getComputedStyle(rainha);
            const bottom = parseFloat(computedStyle.bottom || '-100vh');
            
            // Reset da flag da Rainha só quando ela volta completamente para baixo
            if (bottom <= -99 * window.innerHeight / 100 && rainhaAudioStarted) {
                console.log("👑 Rainha voltou à posição inicial, resetando flag");
                rainhaAudioStarted = false;
                
                // Para o áudio cena2 quando a rainha desce completamente
                const cena2Audio = document.getElementById('cena2-audio');
                if (cena2Audio === currentAudio) {
                    console.log("⏹️ Parando cena2-audio porque rainha desceu completamente");
                    cena2Audio.pause();
                    cena2Audio.currentTime = 0;
                    currentAudio = null;
                }
            }
            // Se a rainha está visível mas não há áudio cena2 tocando, permite que toque novamente
            else if (bottom > -99 * window.innerHeight / 100 && rainhaAudioStarted) {
                const cena2Audio = document.getElementById('cena2-audio');
                const cena3Container = document.getElementById('sticky-container2');
                
                // Verifica se não está na cena3 e permite que cena2 toque
                if (cena3Container) {
                    const cena3Rect = cena3Container.getBoundingClientRect();
                    const isInCena3 = cena3Rect.top < window.innerHeight && cena3Rect.bottom > 0;
                    
                    if (!isInCena3 && cena2Audio && currentAudio !== cena2Audio) {
                        console.log("🔄 Rainha visível mas não na cena3, permitindo cena2-audio");
                        if (currentAudio) {
                            currentAudio.pause();
                            currentAudio.currentTime = 0;
                        }
                        currentAudio = cena2Audio;
                        cena2Audio.play().catch(e => {
                            console.log("⚠️ Áudio cena2 bloqueado pelo navegador");
                        });
                    }
                }
            }
        }
        
        // Verificar se cena3 está visível mas não há áudio cena3 tocando
        const cena3Container = document.getElementById('sticky-container2');
        const cena4Container = document.getElementById('sticky-container3');
        
        if (cena3Container && cena4Container) {
            const cena3Rect = cena3Container.getBoundingClientRect();
            const cena4Rect = cena4Container.getBoundingClientRect();
            
            const isInCena3 = cena3Rect.top < window.innerHeight && cena3Rect.bottom > 0;
            const isInCena4 = cena4Rect.top < window.innerHeight && cena4Rect.bottom > 0;
            
            // Se está na cena3 mas não na cena4, e não há áudio cena3 tocando
            if (isInCena3 && !isInCena4) {
                const cena3Audio = document.getElementById('cena3-audio');
                if (cena3Audio && currentAudio !== cena3Audio) {
                    console.log("🔄 Na cena3 mas não na cena4, permitindo cena3-audio");
                    if (currentAudio) {
                        currentAudio.pause();
                        currentAudio.currentTime = 0;
                    }
                    currentAudio = cena3Audio;
                    cena3Audio.play().catch(e => {
                        console.log("⚠️ Áudio cena3 bloqueado pelo navegador");
                    });
                }
            }
        }
    }

    // Observer customizado para movimentos usando MutationObserver
    const aliceObserver = new MutationObserver(() => checkAliceMovement());
    const rainhaObserver = new MutationObserver(() => checkRainhaMovement());
    
    // Configurar observers para detectar mudanças no style
    const alice = document.getElementById('alicecena1');
    const rainha = document.getElementById('rainhacena2');
    
    if (alice) {
        aliceObserver.observe(alice, { 
            attributes: true, 
            attributeFilter: ['style'] 
        });
        console.log("🎭 Observer configurado para movimentos da Alice");
    }
    
    if (rainha) {
        rainhaObserver.observe(rainha, { 
            attributes: true, 
            attributeFilter: ['style'] 
        });
        console.log("👑 Observer configurado para movimentos da Rainha");
    }

    // Também verificar por polling como backup - intervalo mais rápido
    setInterval(() => {
        if (audioUnlocked) {
            checkAliceMovement();
            checkRainhaMovement();
            resetAudioFlags(); // Adiciona verificação de reset
        }
    }, 50); // Reduzido de 100ms para 50ms para detectar mais rapidamente

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
        console.log('🔓 Todos os áudios desbloqueados para cap12, audioUnlocked:', audioUnlocked);
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
    
    // Adicionar aviso visual para o usuário
    if (!audioUnlocked) {
        console.log("🔔 AVISO: Clique ou toque na página para ativar o áudio!");
    }

    console.log('🎬 Audio script para cap12 carregado, elementos encontrados:', {
        chapter12: !!document.getElementById('chapter12'),
        alicecena1: !!document.getElementById('alicecena1'),
        rainhacena2: !!document.getElementById('rainhacena2'),
        stickyContainer2: !!document.getElementById('sticky-container2'),
        stickyContainer3: !!document.getElementById('sticky-container3'),
        introAudio: !!document.getElementById('intro-audio'),
        cena1Audio: !!document.getElementById('cena1-audio'),
        cena2Audio: !!document.getElementById('cena2-audio'),
        cena3Audio: !!document.getElementById('cena3-audio'),
        cena4Audio: !!document.getElementById('cena4-audio')
    });
});
