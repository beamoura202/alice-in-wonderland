document.addEventListener("DOMContentLoaded", function () {
    const scenes = [
        { id: "chapter3", audioId: "audio-intro" },
        { id: "sticky-container", audioId: "audio-cena1" },
        
    ];
    let currentAudio = null;
    let audioUnlocked = false; 

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






    // --- CAPÍTULO 3: Sistema de timing para frases ---
    // audiocena1
    const audioCena1 = document.getElementById('audio-cena1');
    const frase_1 = document.getElementById('c1f1');
    const frase_2 = document.getElementById('c1f2');
    const frase_3 = document.getElementById('c1f3');
    const frase_4 = document.getElementById('c1f4');
    const frase_5 = document.getElementById('c1f5');
   

    if (audioCena1 && frase_1 && frase_2 && frase_3 && frase_4 && frase_5) {
        audioCena1.addEventListener('timeupdate', function () {
            const t = this.currentTime;
            // Frase 1: 0 - 2.5s
            if (t >= 4.157 && t < 8.905) {
                frase_1.style.setProperty('opacity', '1', 'important');
                frase_1.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase_1.style.setProperty('opacity', '0', 'important');
                frase_1.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 2: 2.5 - 5.5s
            if (t >= 20.376 && t < 26.756) {
                frase_2.style.setProperty('opacity', '1', 'important');
                frase_2.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase_2.style.setProperty('opacity', '0', 'important');
                frase_2.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 3: 5.5 - 8.5s
            if (t >= 27.121 && t < 37.295) {
                frase_3.style.setProperty('opacity', '1', 'important');
                frase_3.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase_3.style.setProperty('opacity', '0', 'important');
                frase_3.style.setProperty('visibility', 'hidden', 'important');
            }
             if (t >= 37.849 && t < 39.396) {
                frase_4.style.setProperty('opacity', '1', 'important');
                frase_4.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase_4.style.setProperty('opacity', '0', 'important');
                frase_4.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 3: 5.5 - 8.5s
            if (t >= 42.859 && t < 44.007) {
                frase_5.style.setProperty('opacity', '1', 'important');
                frase_5.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase_5.style.setProperty('opacity', '0', 'important');
                frase_5.style.setProperty('visibility', 'hidden', 'important');
            }
          
        });
        audioCena1.addEventListener('play', function () {
            [frase_1, frase_2, frase_3,frase_4,frase_5].forEach(f => {
                f.style.setProperty('opacity', '0', 'important');
                f.style.setProperty('visibility', 'hidden', 'important');
            });
        });
    }
});