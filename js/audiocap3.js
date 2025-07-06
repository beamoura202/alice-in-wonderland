document.addEventListener("DOMContentLoaded", function () {
    const scenes = [
        { id: "chapter3", audioId: "audio-intro" },
        { id: "sticky-container", audioId: "audio-cena1" },
        
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

    // Suponha que você quer mostrar um texto após 5 segundos do áudio "audio-cena1"



    const audio = document.getElementById('audio-cena1');
    const frase1 = document.getElementById('frase1');
    const frase2 = document.getElementById('frase2');
    const frase3 = document.getElementById('frase3');
    const frase4 = document.getElementById('frase4');

    // Esconde todas as frases ao início
frase1.style.opacity = '0';
frase2.style.opacity = '0';
frase3.style.opacity = '0';
frase4.style.opacity = '0';

    audio.addEventListener('timeupdate', function () {
      // Frase 1: 4.2s até 10s
      if (audio.currentTime >= 4.2 && audio.currentTime < 10) {
        frase1.style.opacity = '1';
      } else {
        frase1.style.opacity = '0';
      }

      // Frase 2: 20.2s até 37.05s
      if (audio.currentTime >= 20.2 && audio.currentTime < 37.05) {
        frase2.style.opacity = '1';
      } else {
        frase2.style.opacity = '0';
      }

      // Frase 3: 37.9s até 39.8s
      if (audio.currentTime >= 37.9 && audio.currentTime < 39.8) {
        frase3.style.opacity = '1';
      } else {
        frase3.style.opacity = '0';
      }

      // Frase 4: 42.7s até 44.3s
      if (audio.currentTime >= 42.7 && audio.currentTime < 44.3) {
        frase4.style.opacity = '1';
      } else {
        frase4.style.opacity = '0';
      }
    });
});