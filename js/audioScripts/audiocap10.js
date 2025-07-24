document.addEventListener("DOMContentLoaded", function () {
    const scenes = [
        { id: "chapter10", audioId: "intro-audio" },
        { id: "divpedra", audioId: "cena1-audio", className: true },
        { id: "danca", audioId: "cena2-audio", className: true },
    ];

    let currentAudio = null;
    let audioUnlocked = false;
    let divpedraAudioFinished = false;

    // Observer para detectar quando elementos entram/saem da viewport
    const observer = new IntersectionObserver((entries) => {
        console.log("Observer executando, audioUnlocked:", audioUnlocked);
        if (!audioUnlocked) return; // Só executa se já desbloqueou
        
        entries.forEach(entry => {
            console.log("Observer detectou entrada/saída:", entry.target, "isIntersecting:", entry.isIntersecting);
            
            const scene = scenes.find(s => {
                if (s.className) {
                    return entry.target.classList.contains(s.id);
                } else {
                    return entry.target.id === s.id;
                }
            });
            
            if (!scene) {
                console.log("Nenhuma cena encontrada para:", entry.target);
                return;
            }
            
            console.log("Cena encontrada:", scene);
            
            const audio = document.getElementById(scene.audioId);
            if (!audio) {
                console.log("Áudio não encontrado:", scene.audioId);
                return;
            }

            // Lógica específica para divpedra (cena1-audio)
            if (scene.id === "divpedra") {
                if (entry.isIntersecting) {
                    // Divpedra entrou na viewport - iniciar cena1-audio
                    if (currentAudio && currentAudio !== audio) {
                        currentAudio.pause();
                        currentAudio.currentTime = 0;
                    }
                    currentAudio = audio;
                    divpedraAudioFinished = false;
                    audio.play().catch(e => {
                        console.log("⚠️ Áudio bloqueado pelo navegador - aguardando interação do usuário");
                    });
                    console.log("Divpedra visível - iniciando cena1-audio");
                } else {
                    // Divpedra saiu da viewport - parar cena1-audio
                    if (audio === currentAudio) {
                        audio.pause();
                        audio.currentTime = 0;
                        divpedraAudioFinished = true;
                        currentAudio = null;
                        console.log("Divpedra não visível - parando cena1-audio");
                    }
                }
            }
            
            // Lógica específica para danca (cena2-audio)
            else if (scene.id === "danca") {
                if (entry.isIntersecting) {
                    // Danca entrou na viewport (moveu para a direita) - iniciar cena2-audio
                    if (currentAudio && currentAudio !== audio) {
                        currentAudio.pause();
                        currentAudio.currentTime = 0;
                    }
                    currentAudio = audio;
                    audio.play().catch(e => {
                        console.log("⚠️ Áudio bloqueado pelo navegador - aguardando interação do usuário");
                    });
                    console.log("Danca visível (moveu para direita) - iniciando cena2-audio");
                } else {
                    // Danca saiu da viewport - parar cena2-audio
                    if (audio === currentAudio) {
                        audio.pause();
                        audio.currentTime = 0;
                        currentAudio = null;
                        console.log("Danca não visível - parando cena2-audio");
                    }
                }
            }
            
            // Lógica padrão para outros elementos
            else {
                if (entry.isIntersecting) {
                    if (currentAudio && currentAudio !== audio) {
                        currentAudio.pause();
                        currentAudio.currentTime = 0;
                    }
                    currentAudio = audio;
                    audio.play().catch(e => {
                        console.log("⚠️ Áudio bloqueado pelo navegador - aguardando interação do usuário");
                    });
                    console.log(`${scene.id} visível - iniciando ${scene.audioId}`);
                } else {
                    if (audio === currentAudio) {
                        audio.pause();
                        audio.currentTime = 0;
                        currentAudio = null;
                        console.log(`${scene.id} não visível - parando ${scene.audioId}`);
                    }
                }
            }
        });
    }, {
        threshold: 0.1, // 10% visível
    });

    // Função auxiliar para verificar se danca está visível
    function isDancaVisible() {
        const danca = document.querySelector('.danca');
        if (!danca) return false;
        
        const rect = danca.getBoundingClientRect();
        return (rect.top < window.innerHeight && rect.bottom > 0);
    }

    // Configurar observers para todos os elementos
    scenes.forEach(scene => {
        let element;
        
        if (scene.className) {
            element = document.querySelector(`.${scene.id}`);
        } else {
            element = document.getElementById(scene.id);
        }
        
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
        scenes.forEach(scene => {
            const audio = document.getElementById(scene.audioId);
            if (audio) {
                console.log("🎵 Desbloqueando áudio:", scene.audioId);
                audio.play().then(() => {
                    audio.pause();
                    audio.currentTime = 0;
                    console.log("✅ Áudio desbloqueado:", scene.audioId);
                }).catch(e => {
                    console.log('❌ Erro ao desbloquear áudio:', scene.audioId, e);
                });
            } else {
                console.log("❌ Áudio não encontrado:", scene.audioId);
            }
        });
        audioUnlocked = true;
        console.log('🔓 Todos os áudios desbloqueados para cap10, audioUnlocked:', audioUnlocked);
    }

    // Desbloquear áudio no primeiro clique ou toque
    function enableAudioOnUserInteraction() {
        console.log("� Interação do usuário detectada - desbloqueando áudios...");
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

    console.log('🎬 Audio script para cap10 carregado, elementos encontrados:', {
        chapter10: !!document.getElementById('chapter10'),
        divpedra: !!document.querySelector('.divpedra'),
        danca: !!document.querySelector('.danca'),
        introAudio: !!document.getElementById('intro-audio'),
        cena1Audio: !!document.getElementById('cena1-audio'),
        cena2Audio: !!document.getElementById('cena2-audio')
    });

 // --- CAPÍTULO 10: Sistema de timing para frases ---
    // audiocena1
    const audioCena1 = document.getElementById('cena1-audio');
    const frase_1 = document.getElementById('c1f1');
    const frase_2 = document.getElementById('c1f2');
    const frase_3 = document.getElementById('c1f3');
   

    if (audioCena1 && frase_1 && frase_2 && frase_3) {
        audioCena1.addEventListener('timeupdate', function () {
            const t = this.currentTime;
            // Frase 1: 0 - 2.5s
            if (t >= 0.01 && t < 4.755) {
                frase_1.style.setProperty('opacity', '1', 'important');
                frase_1.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase_1.style.setProperty('opacity', '0', 'important');
                frase_1.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 2: 2.5 - 5.5s
            if (t >= 5.208 && t < 6.270) {
                frase_2.style.setProperty('opacity', '1', 'important');
                frase_2.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase_2.style.setProperty('opacity', '0', 'important');
                frase_2.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 3: 5.5 - 8.5s
            if (t >= 7.609 && t < 9.927) {
                frase_3.style.setProperty('opacity', '1', 'important');
                frase_3.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase_3.style.setProperty('opacity', '0', 'important');
                frase_3.style.setProperty('visibility', 'hidden', 'important');
            }
          
        });
        audioCena1.addEventListener('play', function () {
            [frase_1, frase_2, frase_3].forEach(f => {
                f.style.setProperty('opacity', '0', 'important');
                f.style.setProperty('visibility', 'hidden', 'important');
            });
        });
    }

    // audiocena2
    const audioCena5_2 = document.getElementById('cena2-audio');
    const frase1c2 = document.getElementById('c2f1');
   

    if (audioCena5_2 && frase1c2 ) {
        audioCena5_2.addEventListener('timeupdate', function () {
            const t = this.currentTime;
            // Frase 6: 0 - 3s
            if (t >= 9.055 && t < 109.055) {
                frase1c2.style.setProperty('opacity', '1', 'important');
                frase1c2.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase1c2.style.setProperty('opacity', '0', 'important');
                frase1c2.style.setProperty('visibility', 'hidden', 'important');
            }
         
        });
        audioCena5_2.addEventListener('play', function () {
            [frase1c2].forEach(f => {
                f.style.setProperty('opacity', '0', 'important');
                f.style.setProperty('visibility', 'hidden', 'important');
            });
        });
    }

});