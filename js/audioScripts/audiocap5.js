document.addEventListener("DOMContentLoaded", function () {
    const scenes = [
        { id: "chapter5", audioId: "audio-intro" },
        { id: "sticky-container", audioId: "audio-cena1" },
        { id: "sectionfolhas", audioId: "audio-cena2" },
    ];

    let currentAudio = null;
    let audioUnlocked = false;

    // Função para testar áudio manualmente
    window.testAudio = function (audioId) {
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
            } else {
                if (audio && !entry.isIntersecting) {
                    audio.pause();
                    audio.currentTime = 0;
                }
            }
        });
    }, {
        threshold: 0.01, // Reduzindo para 1% visível
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
        scenes.forEach(scene => {
            const audio = document.getElementById(scene.audioId);
            if (audio) {
                audio.play().then(() => {
                    audio.pause();
                    audio.currentTime = 0;
                }).catch(() => { });
            }
        });
    }

    function handleFirstInteraction() {
        unlockAllAudios();
        audioUnlocked = true;
        document.removeEventListener('click', handleFirstInteraction);
        window.removeEventListener('scroll', handleFirstInteraction);
    }

    document.addEventListener('click', handleFirstInteraction);
    window.addEventListener('scroll', handleFirstInteraction);

    // --- CAPÍTULO 5: Sistema de timing para frases ---
    // audiocena1
    const audioCena1 = document.getElementById('audio-cena1');
    const frase_1 = document.getElementById('c1f1');
    const frase_2 = document.getElementById('c1f2');
    const frase_3 = document.getElementById('c1f3');
    const frase_4 = document.getElementById('c1f4');
    const frase_5 = document.getElementById('c1f5');
    const frase_6 = document.getElementById('c1f6');
    const frase_7 = document.getElementById('c1f7');
    const frase_8 = document.getElementById('c1f8');



    if (audioCena1 && frase_1 && frase_2 && frase_3 && frase_4 && frase_5 && frase_6 && frase_7 && frase_8) {
        audioCena1.addEventListener('timeupdate', function () {
            const t = this.currentTime;
            // Frase 1: 0 - 2.5s
            if (t >= 11.287 && t < 13.035) {
                frase_1.style.setProperty('opacity', '1', 'important');
                frase_1.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase_1.style.setProperty('opacity', '0', 'important');
                frase_1.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 2: 2.5 - 5.5s
            if (t >= 14.481 && t < 24.041) {
                frase_2.style.setProperty('opacity', '1', 'important');
                frase_2.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase_2.style.setProperty('opacity', '0', 'important');
                frase_2.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 3: 5.5 - 8.5s
            if (t >= 24.354 && t < 28.5361) {
                frase_3.style.setProperty('opacity', '1', 'important');
                frase_3.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase_3.style.setProperty('opacity', '0', 'important');
                frase_3.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 4: 8.5 - 12s
            if (t >= 28.6674 && t < 35.759) {
                frase_4.style.setProperty('opacity', '1', 'important');
                frase_4.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase_4.style.setProperty('opacity', '0', 'important');
                frase_4.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 5: 12 - 15s
            if (t >= 35.780 && t < 37.358) {
                frase_5.style.setProperty('opacity', '1', 'important');
                frase_5.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase_5.style.setProperty('opacity', '0', 'important');
                frase_5.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 6: 12 - 15s
            if (t >= 46.831 && t < 55.769) {
                frase_6.style.setProperty('opacity', '1', 'important');
                frase_6.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase_6.style.setProperty('opacity', '0', 'important');
                frase_6.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 7: 12 - 15s
            if (t >= 56.071 && t < 59.309) {
                frase_7.style.setProperty('opacity', '1', 'important');
                frase_7.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase_7.style.setProperty('opacity', '0', 'important');
                frase_7.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 8: 12 - 15s
            if (t >= 63.717 && t < 67.235) {
                frase_8.style.setProperty('opacity', '1', 'important');
                frase_8.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase_8.style.setProperty('opacity', '0', 'important');
                frase_8.style.setProperty('visibility', 'hidden', 'important');
            }
        });
        audioCena1.addEventListener('play', function () {
            [frase_1, frase_2, frase_3, frase_4, frase_5, frase_6,frase_7,frase_8].forEach(f => {
                f.style.setProperty('opacity', '0', 'important');
                f.style.setProperty('visibility', 'hidden', 'important');
            });
        });
    }

    // audiocena2
    const audioCena5_2 = document.getElementById('audio-cena2');
    const frase1c2 = document.getElementById('c2f1');
    const frase2c2 = document.getElementById('c2f2');
    const frase3c2 = document.getElementById('c2f3');

    if (audioCena5_2 && frase1c2 && frase2c2 && frase3c2 ) {
        audioCena5_2.addEventListener('timeupdate', function () {
            const t = this.currentTime;
            // Frase 6: 0 - 3s
            if (t >= 12.809 && t < 17.437) {
                frase1c2.style.setProperty('opacity', '1', 'important');
                frase1c2.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase1c2.style.setProperty('opacity', '0', 'important');
                frase1c2.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 7: 3 - 6s
            if (t >= 18.431 && t < 21.222) {
                frase2c2.style.setProperty('opacity', '1', 'important');
                frase2c2.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase2c2.style.setProperty('opacity', '0', 'important');
                frase2c2.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 8: 6 - 9s
            if (t >= 23.593 && t < 25.191) {
                frase3c2.style.setProperty('opacity', '1', 'important');
                frase3c2.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase3c2.style.setProperty('opacity', '0', 'important');
                frase3c2.style.setProperty('visibility', 'hidden', 'important');
            }
          
        });
        audioCena5_2.addEventListener('play', function () {
            [frase1c2, frase2c2, frase3c2].forEach(f => {
                f.style.setProperty('opacity', '0', 'important');
                f.style.setProperty('visibility', 'hidden', 'important');
            });
        });
    }
});
