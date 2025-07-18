document.addEventListener('DOMContentLoaded', function() {
    let audioUnlocked = false;
    let currentAudio = null;
    let chapeleiroAudioStarted = false;
    let aliceAudioStarted = false;
    
    // Configuração das cenas - baseado no cap12
    const scenes = [
        { id: 'chapter11', audioId: 'intro-audio' },
        { id: 'sticky-container1', audioId: 'cena1-audio' },
        { id: 'sticky-container2', audioId: 'cena3-audio' },
        { id: 'sticky-container3', audioId: 'cena4-audio' }
    ];
    
    console.log('🎬 Iniciando sistema de áudio do cap11...');
    
    // Criar observer para detectar quando elementos entram/saem da viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const scene = scenes.find(s => s.id === entry.target.id);
            if (!scene) return;
            
            const audio = document.getElementById(scene.audioId);
            if (!audio || !audioUnlocked) return;
            
            if (entry.isIntersecting) {
                console.log("👁️ Elemento visível:", scene.id);
                
                // Lógica especial para sticky-container1 (cena1)
                if (scene.id === 'sticky-container1') {
                    console.log("🎵 Iniciando áudio cena1 imediatamente");
                    if (currentAudio && currentAudio !== audio) {
                        currentAudio.pause();
                        currentAudio.currentTime = 0;
                    }
                    currentAudio = audio;
                    audio.play().catch(e => {
                        console.log("⚠️ Áudio cena1 bloqueado pelo navegador");
                    });
                    return;
                }
                
                // Lógica especial para sticky-container2 (cena3)
                if (scene.id === 'sticky-container2') {
                    // Verificar se não está na cena4
                    const cena4Container = document.getElementById('sticky-container3');
                    if (cena4Container) {
                        const cena4Rect = cena4Container.getBoundingClientRect();
                        const isInCena4 = cena4Rect.top < window.innerHeight && cena4Rect.bottom > 0;
                        
                        if (isInCena4) {
                            console.log("🔄 Na cena4, não iniciando cena3");
                            return;
                        }
                    }
                    
                    console.log("🎵 Iniciando áudio cena3");
                    if (currentAudio && currentAudio !== audio) {
                        currentAudio.pause();
                        currentAudio.currentTime = 0;
                    }
                    currentAudio = audio;
                    audio.play().catch(e => {
                        console.log("⚠️ Áudio cena3 bloqueado pelo navegador");
                    });
                    return;
                }
                
                // Para outras cenas, tocar diretamente
                if (currentAudio !== audio) {
                    console.log("🎵 Iniciando áudio:", scene.audioId);
                    if (currentAudio) {
                        currentAudio.pause();
                        currentAudio.currentTime = 0;
                    }
                    currentAudio = audio;
                    audio.play().catch(e => {
                        console.log("⚠️ Áudio bloqueado pelo navegador:", scene.audioId);
                    });
                }
            } else {
                // Elemento saiu da viewport
                if (audio === currentAudio) {
                    console.log("⏹️ Parando áudio:", scene.audioId, "elemento saiu da viewport:", scene.id);
                    audio.pause();
                    audio.currentTime = 0;
                    currentAudio = null;
                }
            }
        });
    }, {
        threshold: [0, 0.01, 0.1],
        rootMargin: "0px 0px -50% 0px"
    });

    // Função para verificar movimento do Chapeleiro
    function checkChapeleiroMovement() {
        const chapeleiro = document.getElementById('chapeleiro');
        if (!chapeleiro || !audioUnlocked || chapeleiroAudioStarted) return;

        const hasEnteredClass = chapeleiro.classList.contains('chapeleiro-entra');
        
        // Se Chapeleiro entrou (classe chapeleiro-entra), inicia audio cena2
        if (hasEnteredClass) {
            console.log("🎩 Chapeleiro entrou, iniciando cena2-audio");
            const cena2Audio = document.getElementById('cena2-audio');
            
            if (cena2Audio) {
                if (currentAudio && currentAudio !== cena2Audio) {
                    console.log("⏸️ Parando áudio anterior para cena2:", currentAudio.id);
                    currentAudio.pause();
                    currentAudio.currentTime = 0;
                }
                currentAudio = cena2Audio;
                chapeleiroAudioStarted = true;
                cena2Audio.play().catch(e => {
                    console.log("⚠️ Áudio cena2 bloqueado pelo navegador");
                });
            }
        }
    }

    // Função para verificar movimento da Alice
    function checkAliceMovement() {
        const alice = document.getElementById('alice');
        if (!alice || !audioUnlocked || aliceAudioStarted) return;

        const hasEnteredClass = alice.classList.contains('alice-entra');
        
        // Se Alice entrou (classe alice-entra), inicia audio cena4
        if (hasEnteredClass) {
            console.log("🎭 Alice entrou, iniciando cena4-audio");
            const cena4Audio = document.getElementById('cena4-audio');
            
            if (cena4Audio) {
                if (currentAudio && currentAudio !== cena4Audio) {
                    console.log("⏸️ Parando áudio anterior para cena4:", currentAudio.id);
                    currentAudio.pause();
                    currentAudio.currentTime = 0;
                }
                currentAudio = cena4Audio;
                aliceAudioStarted = true;
                cena4Audio.play().catch(e => {
                    console.log("⚠️ Áudio cena4 bloqueado pelo navegador");
                });
            }
        }
    }

    // Função para reset das flags quando necessário
    function resetAudioFlags() {
        const chapeleiro = document.getElementById('chapeleiro');
        const alice = document.getElementById('alice');
        
        if (chapeleiro) {
            const hasEnteredClass = chapeleiro.classList.contains('chapeleiro-entra');
            const hasExitedClass = chapeleiro.classList.contains('chapeleiro-sair');
            
            // Reset da flag do Chapeleiro quando ele sai
            if (hasExitedClass && chapeleiroAudioStarted) {
                console.log("🎩 Chapeleiro saiu, resetando flag");
                chapeleiroAudioStarted = false;
                
                // Para o áudio cena2 quando o chapeleiro sai
                const cena2Audio = document.getElementById('cena2-audio');
                if (cena2Audio === currentAudio) {
                    console.log("⏹️ Parando cena2-audio porque chapeleiro saiu");
                    cena2Audio.pause();
                    cena2Audio.currentTime = 0;
                    currentAudio = null;
                }
            }
        }
        
        if (alice) {
            const hasEnteredClass = alice.classList.contains('alice-entra');
            const hasExitedClass = alice.classList.contains('alice-sair');
            
            // Reset da flag da Alice quando ela sai
            if (hasExitedClass && aliceAudioStarted) {
                console.log("🎭 Alice saiu, resetando flag");
                aliceAudioStarted = false;
                
                // Para o áudio cena4 quando alice sai
                const cena4Audio = document.getElementById('cena4-audio');
                if (cena4Audio === currentAudio) {
                    console.log("⏹️ Parando cena4-audio porque alice saiu");
                    cena4Audio.pause();
                    cena4Audio.currentTime = 0;
                    currentAudio = null;
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
    const chapeleiroObserver = new MutationObserver(() => checkChapeleiroMovement());
    const aliceObserver = new MutationObserver(() => checkAliceMovement());
    
    // Configurar observers para detectar mudanças no style
    const chapeleiro = document.getElementById('chapeleiro');
    const alice = document.getElementById('alice');
    
    if (chapeleiro) {
        chapeleiroObserver.observe(chapeleiro, { 
            attributes: true, 
            attributeFilter: ['class'] 
        });
        console.log("🎩 Observer configurado para movimentos do Chapeleiro");
    }
    
    if (alice) {
        aliceObserver.observe(alice, { 
            attributes: true, 
            attributeFilter: ['class'] 
        });
        console.log("🎭 Observer configurado para movimentos da Alice");
    }

    // Polling como backup - intervalo mais rápido
    setInterval(() => {
        if (audioUnlocked) {
            checkChapeleiroMovement();
            checkAliceMovement();
            resetAudioFlags();
        }
    }, 50); // Mesmo intervalo do cap12

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
    
    // Adicionar aviso visual para o usuário
    if (!audioUnlocked) {
        console.log("🔔 AVISO: Clique ou toque na página para ativar o áudio!");
    }

    console.log('🎬 Audio script para cap11 carregado, elementos encontrados:', {
        chapter11: !!document.getElementById('chapter11'),
        chapeleiro: !!document.getElementById('chapeleiro'),
        alice: !!document.getElementById('alice'),
        stickyContainer1: !!document.getElementById('sticky-container1'),
        stickyContainer2: !!document.getElementById('sticky-container2'),
        stickyContainer3: !!document.getElementById('sticky-container3'),
        introAudio: !!document.getElementById('intro-audio'),
        cena1Audio: !!document.getElementById('cena1-audio'),
        cena2Audio: !!document.getElementById('cena2-audio'),
        cena3Audio: !!document.getElementById('cena3-audio'),
        cena4Audio: !!document.getElementById('cena4-audio')
    });
});
