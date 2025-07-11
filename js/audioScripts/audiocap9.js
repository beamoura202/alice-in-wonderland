document.addEventListener("DOMContentLoaded", function () {
    const scenes = [
        { id: "chapter9", audioId: "intro-audio" },
        { id: "sticky-container", audioId: "cena1-audio" },
        { id: "sticky-container2", audioId: "cena2-audio" },
        { id: "sticky-container3", audioId: "cena3-audio" },
    ];

    let currentAudio = null;
    let audioUnlocked = false;

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

    const observer = new IntersectionObserver((entries) => {
        if (!audioUnlocked) return; // Só executa se já desbloqueou
        entries.forEach(entry => {
            const scene = scenes.find(s => s.id === entry.target.id);
            if (!scene) return;
            
            const audio = document.getElementById(scene.audioId);
            if (!audio) return;

            if (entry.isIntersecting) {
                if (currentAudio && currentAudio !== audio) {
                    currentAudio.pause();
                    currentAudio.currentTime = 0;
                }

                currentAudio = audio;
                audio.play().catch((error) => {
                    console.log(`Erro ao reproduzir áudio ${scene.audioId}:`, error);
                });
                console.log(`Seção ${entry.target.id} em vista - tocando ${scene.audioId}`);
            } else {
                // Pausa quando sai de vista
                if (audio && !entry.isIntersecting && currentAudio === audio) {
                    audio.pause();
                    audio.currentTime = 0;
                    currentAudio = null;
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
            console.log(`Observando seção: ${scene.id}`);
        } else {
            console.warn(`Seção não encontrada: ${scene.id}`);
        }
    });

    // Função para desbloquear todos os áudios
    function unlockAllAudios() {
        const allAudioIds = scenes.map(s => s.audioId);
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
        console.log('Cap9 - Áudio desbloqueado!');
    }

    // Event listeners
    document.addEventListener('click', handleFirstInteraction);
    window.addEventListener('scroll', handleFirstInteraction);
    
    console.log('Cap9 audio script carregado com sucesso');
});
