document.addEventListener("DOMContentLoaded", function () {
    const scenes = [
        { id: "chapter11", audioId: "intro-audio" },
        { id: "cap11_cena2", audioId: "cena1-audio" },
        { id: "mesa-container", audioId: "cena2-audio" },
        { id: "alice-container", audioId: "cena4-audio" }
    ];

    let currentAudio = null;
    let audioUnlocked = false;
    let chapeleiroMovementStarted = false;
    let aliceContainerAudioStarted = false;

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
                
                audio.play().catch(e => {
                    console.log("⚠️ Áudio bloqueado pelo navegador - aguardando interação do usuário");
                });
            } else {
                // Elemento saiu da viewport - parar áudio
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

    // Função para verificar movimento do Chapeleiro
    function checkChapeleiroMovement() {
        const chapeleiro = document.getElementById('chapeleiro');
        if (!chapeleiro || !audioUnlocked || chapeleiroMovementStarted) return;

        const hasEnteredClass = chapeleiro.classList.contains('chapeleiro-entra');
        
        // Se Chapeleiro entrou (left: 0vw), inicia audio cena3
        if (hasEnteredClass) {
            console.log("🎩 Chapeleiro entrou, iniciando cena3-audio");
            const cena3Audio = document.getElementById('cena3-audio');
            
            if (cena3Audio) {
                if (currentAudio && currentAudio !== cena3Audio) {
                    console.log("⏸️ Parando áudio anterior para cena3:", currentAudio.id);
                    currentAudio.pause();
                    currentAudio.currentTime = 0;
                }
                currentAudio = cena3Audio;
                chapeleiroMovementStarted = true;
                cena3Audio.play().catch(e => {
                    console.log("⚠️ Áudio cena3 bloqueado pelo navegador");
                });
            }
        }
    }

    // Função para verificar movimento da Alice (quarta cena)
    function checkAliceContainerMovement() {
        const alice = document.getElementById('alice');
        if (!alice || !audioUnlocked || aliceContainerAudioStarted) return;

        const hasEnteredClass = alice.classList.contains('alice-entra');
        
        // Se Alice entrou (left: 0vw), inicia audio cena4
        if (hasEnteredClass) {
            console.log("👸 Alice entrou na cena4, iniciando cena4-audio");
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
        const chapeleiro = document.getElementById('chapeleiro');
        const aliceContainer = document.getElementById('alice');
        
        if (chapeleiro) {
            const hasEnteredClass = chapeleiro.classList.contains('chapeleiro-entra');
            const hasExitedClass = chapeleiro.classList.contains('chapeleiro-sair');
            
            // Reset da flag do Chapeleiro quando ele sai
            if (hasExitedClass && chapeleiroMovementStarted) {
                console.log("🎩 Chapeleiro saiu, resetando flag");
                chapeleiroMovementStarted = false;
                
                // Para o áudio cena3 quando o chapeleiro sai
                const cena3Audio = document.getElementById('cena3-audio');
                if (cena3Audio === currentAudio) {
                    console.log("⏹️ Parando cena3-audio porque chapeleiro saiu");
                    cena3Audio.pause();
                    cena3Audio.currentTime = 0;
                    currentAudio = null;
                }
            }
        }

        if (aliceContainer) {
            const aliceContainerElement = document.getElementById('alice-container');
            if (aliceContainerElement) {
                const rect = aliceContainerElement.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
                
                // Reset da flag da Alice quando o container sai da viewport
                if (!isVisible && aliceContainerAudioStarted) {
                    console.log("👸 Alice container saiu da viewport, resetando flag");
                    aliceContainerAudioStarted = false;
                    
                    // Para o áudio cena4 quando o container sai
                    const cena4Audio = document.getElementById('cena4-audio');
                    if (cena4Audio === currentAudio) {
                        console.log("⏹️ Parando cena4-audio porque container saiu");
                        cena4Audio.pause();
                        cena4Audio.currentTime = 0;
                        currentAudio = null;
                    }
                }
            }
        }
    }

    // Observer customizado para movimentos usando MutationObserver
    const chapeleiroObserver = new MutationObserver(() => {
        console.log("🔍 MutationObserver Chapeleiro detectou mudança");
        checkChapeleiroMovement();
    });
    const aliceContainerObserver = new MutationObserver(() => {
        console.log("🔍 MutationObserver Alice Container detectou mudança");
        checkAliceContainerMovement();
    });
    
    // Configurar observers para detectar mudanças no style e classes
    const chapeleiro = document.getElementById('chapeleiro');
    const aliceContainer = document.getElementById('alice');
    
    if (chapeleiro) {
        chapeleiroObserver.observe(chapeleiro, { 
            attributes: true, 
            attributeFilter: ['class'] 
        });
        console.log("🎩 Observer configurado para movimentos do Chapeleiro");
    }

    if (aliceContainer) {
        aliceContainerObserver.observe(aliceContainer, { 
            attributes: true, 
            attributeFilter: ['class'] 
        });
        console.log("👸 Observer configurado para movimentos da Alice container");
    }

    // Também verificar por polling como backup
    setInterval(() => {
        if (audioUnlocked) {
            checkChapeleiroMovement();
            checkAliceContainerMovement();
            resetAudioFlags();
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
    
    // Adicionar aviso visual para o usuário
    if (!audioUnlocked) {
        console.log("🔔 AVISO: Clique ou toque na página para ativar o áudio!");
    }

    console.log('🎬 Audio script para cap11 carregado, elementos encontrados:', {
        chapter11: !!document.getElementById('chapter11'),
        stickyContainer1: !!document.getElementById('sticky-container1'),
        mesaContainer: !!document.getElementById('mesa-container'),
        aliceContainer: !!document.getElementById('alice-container'),
        chapeleiro: !!document.getElementById('chapeleiro'),
        alice: !!document.getElementById('alice'),
        introAudio: !!document.getElementById('intro-audio'),
        cena1Audio: !!document.getElementById('cena1-audio'),
        cena2Audio: !!document.getElementById('cena2-audio'),
        cena3Audio: !!document.getElementById('cena3-audio'),
        cena4Audio: !!document.getElementById('cena4-audio')
    });
});
