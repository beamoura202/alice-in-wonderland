document.addEventListener("DOMContentLoaded", function () {
    const scenes = [
        { id: "chapter1", audioId: "audio-intro" },
        { id: "cena1", audioId: "audio-cena1" },
        { id: "sticky-container-2", audioId: "audio-cena2" },
        { id: "sticky-container-3", audioId: "audio-cena3" },
    ];

    let currentAudio = null;
    let audioUnlocked = false; // NOVO

    const observer = new IntersectionObserver((entries) => {
        if (!audioUnlocked) return; // Só executa se já desbloqueou
        entries.forEach(entry => {
            const scene = scenes.find(s => s.id === entry.target.id);
            const audio = document.getElementById(scene.audioId);

            if (entry.isIntersecting) {
                if (currentAudio && currentAudio !== audio) {
                    currentAudio.pause();
                    currentAudio.currentTime = 0;
                }

                currentAudio = audio;
                currentAudio.play();
            } else {
                if (audio && !entry.isIntersecting) {
                    audio.pause();
                    audio.currentTime = 0;
                }
            }
        });
    }, {
        threshold: 0.1, // Teste com 10% visível
    });

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
                audio.play().then(() => {
                    audio.pause();
                    audio.currentTime = 0;
                }).catch(() => {});
            }
        });
    }

    function handleFirstInteraction() {
        unlockAllAudios();
        audioUnlocked = true; // SÓ AGORA libera o play do observer
        document.removeEventListener('click', handleFirstInteraction);
        window.removeEventListener('scroll', handleFirstInteraction);
        // Força o observer a rodar de novo após desbloquear
        observer.takeRecords().forEach(entry => observer.callback([entry]));
    }

    document.addEventListener('click', handleFirstInteraction);
    window.addEventListener('scroll', handleFirstInteraction);
});