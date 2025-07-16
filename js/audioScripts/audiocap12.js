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

        const bottom = parseFloat(rainha.style.bottom || '-100vh');
        
        // Se Rainha moveu-se para cima (bottom > -100vh), inicia audio cena2
        if (bottom > -100) {
            console.log("👑 Rainha moveu-se para cima, iniciando cena2-audio");
            const cena2Audio = document.getElementById('cena2-audio');
            
            if (cena2Audio) {
                if (currentAudio && currentAudio !== cena2Audio) {
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

    // Também verificar por polling como backup
    setInterval(() => {
        if (audioUnlocked) {
            checkAliceMovement();
            checkRainhaMovement();
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
