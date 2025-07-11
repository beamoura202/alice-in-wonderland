document.addEventListener("DOMContentLoaded", function () {
    const scenes = [
        { id: "chapter8", audioId: "intro-audio" },
        { id: "sticky-container", audioId: "cena1-audio" },
        { id: "sticky-container2", audioId: "cena3-audio" },
        { id: "sticky-container3", audioId: "cena4-audio" },
    ];

    let currentAudio = null;
    let audioUnlocked = false;
    let rainha1AudioPlayed = false; // Flag para evitar tocar múltiplas vezes

    // Função para testar áudio manualmente
    window.testAudio = function(audioId) {
        const audio = document.getElementById(audioId);
        if (audio) {
            console.log(`Testando ${audioId}...`);
            audio.play().then(() => {
                console.log(`${audioId} tocando com sucesso!`);
            }).catch((error) => {
                console.log(`Erro ao tocar ${audioId}:`, error);
            });
        } else {
            console.log(`Áudio ${audioId} não encontrado!`);
        }
    };

    // Função para observar a imagem rainha1 (cena2)
    function checkForRainha1() {
        if (!audioUnlocked) return;

        const rainha1 = document.getElementById('rainha1');
        if (!rainha1) return;

        const rect = rainha1.getBoundingClientRect();
        const isVisible = rect.top >= 0 && rect.left >= 0 && 
                         rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && 
                         rect.right <= (window.innerWidth || document.documentElement.clientWidth);

        if (isVisible && !rainha1AudioPlayed) {
            const audioCena2 = document.getElementById('cena2-audio');
            if (audioCena2) {
                // Para qualquer áudio atual
                if (currentAudio) {
                    currentAudio.pause();
                    currentAudio.currentTime = 0;
                }

                currentAudio = audioCena2;
                audioCena2.play().catch((error) => {
                    console.log(`Erro ao reproduzir áudio cena2-audio:`, error);
                });
                
                rainha1AudioPlayed = true;
                console.log('Rainha1 em vista - tocando cena2');
            }
        } else if (!isVisible && rainha1AudioPlayed) {
            // Rainha1 saiu do ecrã - voltar para o áudio da seção visível
            rainha1AudioPlayed = false;
            
            // Para o áudio atual da cena2
            if (currentAudio && currentAudio.id === 'cena2-audio') {
                currentAudio.pause();
                currentAudio.currentTime = 0;
                currentAudio = null;
            }
            
            // Encontrar qual seção está visível e tocar o áudio correspondente
            scenes.forEach(scene => {
                const element = document.getElementById(scene.id);
                if (element) {
                    const elementRect = element.getBoundingClientRect();
                    const elementVisible = elementRect.top < window.innerHeight && elementRect.bottom > 0;
                    
                    if (elementVisible) {
                        const audio = document.getElementById(scene.audioId);
                        if (audio && currentAudio !== audio) {
                            currentAudio = audio;
                            audio.play().catch((error) => {
                                console.log(`Erro ao reproduzir áudio ${scene.audioId}:`, error);
                            });
                            console.log(`Rainha1 saiu do ecrã - voltando para ${scene.audioId}`);
                        }
                    }
                }
            });
        }
    }

    const observer = new IntersectionObserver((entries) => {
        if (!audioUnlocked) return; // Só executa se já desbloqueou
        entries.forEach(entry => {
            const scene = scenes.find(s => s.id === entry.target.id);
            if (!scene) return;
            
            const audio = document.getElementById(scene.audioId);
            if (!audio) return;

            if (entry.isIntersecting) {
                // Só troca áudio se não estivermos na cena2 da rainha1
                if (!rainha1AudioPlayed || scene.audioId !== 'cena2-audio') {
                    if (currentAudio && currentAudio !== audio) {
                        currentAudio.pause();
                        currentAudio.currentTime = 0;
                    }

                    currentAudio = audio;
                    audio.play().catch((error) => {
                        console.log(`Erro ao reproduzir áudio ${scene.audioId}:`, error);
                    });
                }
            } else {
                // Só pausa se não estivermos na cena2 da rainha1
                if (audio && !entry.isIntersecting && !rainha1AudioPlayed) {
                    audio.pause();
                    audio.currentTime = 0;
                }
            }
        });
    }, {
        threshold: 0.01, // 1% visível
        rootMargin: '0px 0px -100px 0px' // Margem para detectar antes
    });

    scenes.forEach(scene => {
        const el = document.getElementById(scene.id);
        if (el) {
            observer.observe(el);
        }
    });

    // Função para desbloquear todos os áudios
    function unlockAllAudios() {
        // Inclui também o áudio da cena2
        const allAudioIds = [...scenes.map(s => s.audioId), 'cena2-audio'];
        allAudioIds.forEach(audioId => {
            const audio = document.getElementById(audioId);
            if (audio) {
                audio.play().then(() => {
                    audio.pause();
                    audio.currentTime = 0;
                }).catch(() => {});
            }
        });
    }

    function handleFirstInteraction() {
        unlockAllAudios();
        audioUnlocked = true;
        document.removeEventListener('click', handleFirstInteraction);
        window.removeEventListener('scroll', handleFirstInteraction);
        console.log('Áudio desbloqueado!');
    }

    // Event listeners
    document.addEventListener('click', handleFirstInteraction);
    window.addEventListener('scroll', handleFirstInteraction);
    
    // Verifica constantemente a condição da rainha1
    window.addEventListener('scroll', checkForRainha1);
});