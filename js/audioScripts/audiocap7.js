document.addEventListener("DOMContentLoaded", function () {
    const scenes = [
        { id: "chapter7", audioId: "audio-intro" },
        { id: "sticky-container", audioId: "audio-cena1" },
        { id: "sticky-container2", audioId: "audio-cena2-1" },
    ];

    let currentAudio = null;
    let audioUnlocked = false;
    let cena22AudioPlayed = false; // Flag para evitar tocar múltiplas vezes

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

    // Função para tocar áudio da cena 2.2 quando handleCha5AnimationOnScroll é ativada
    function checkForCena22() {
        if (!audioUnlocked) return;

        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;

        // Detecta quando scroll >= 85% (mesmo critério da função handleCha5AnimationOnScroll)
        if (scrollPercent >= 85 && !cena22AudioPlayed) {
            const audioCena22 = document.getElementById('audio-cena2-2');
            if (audioCena22) {
                // Para qualquer áudio atual
                if (currentAudio) {
                    currentAudio.pause();
                    currentAudio.currentTime = 0;
                }

                currentAudio = audioCena22;
                audioCena22.play().catch((error) => {
                    console.log(`Erro ao reproduzir áudio audio-cena2-2:`, error);
                });
                
                cena22AudioPlayed = true;
                console.log('Cena 2.2 audio iniciado (scroll >= 85%)');
            }
        } else if (scrollPercent < 85 && cena22AudioPlayed) {
            // Reset quando volta abaixo de 85%
            cena22AudioPlayed = false;
            const audioCena22 = document.getElementById('audio-cena2-2');
            if (audioCena22 && currentAudio === audioCena22) {
                audioCena22.pause();
                audioCena22.currentTime = 0;
                currentAudio = null;
            }
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
                // Só troca áudio se não estivermos na cena 2.2
                if (!cena22AudioPlayed) {
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
                // Só pausa se não estivermos na cena 2.2
                if (audio && !entry.isIntersecting && !cena22AudioPlayed) {
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
        // Inclui também o áudio da cena 2.2
        const allAudioIds = [...scenes.map(s => s.audioId), 'audio-cena2-2'];
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
    }

    // Event listeners
    document.addEventListener('click', handleFirstInteraction);
    window.addEventListener('scroll', handleFirstInteraction);
    
    // Verifica constantemente a condição da cena 2.2
    window.addEventListener('scroll', checkForCena22);
});
