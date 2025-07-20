document.addEventListener("DOMContentLoaded", function () {
    const scenes = [
        { id: "chapter6", audioId: "audio-intro" },
        { id: "sticky-container12", audioId: "audio-cena1" },
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
            } else {
                if (audio && !entry.isIntersecting) {
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
        audioUnlocked = true;
        document.removeEventListener('click', handleFirstInteraction);
        window.removeEventListener('scroll', handleFirstInteraction);
    }

    document.addEventListener('click', handleFirstInteraction);
    window.addEventListener('scroll', handleFirstInteraction);

     // --- CAPÍTULO 6: Sistema de timing para frases ---
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
    const frase_9 = document.getElementById('c1f9');
    const frase_10 = document.getElementById('c1f10');
    const frase_11 = document.getElementById('c1f11');
    const frase_12 = document.getElementById('c1f12');
    const frase_13 = document.getElementById('c1f13');
    const frase_14 = document.getElementById('c1f14');




    if (audioCena1 && frase_1 && frase_2 && frase_3 && frase_4 && frase_5 && frase_6 && frase_7 && frase_8 && frase_9 && frase_10 && frase_11 && frase_12 && frase_13&& frase_14) {
        audioCena1.addEventListener('timeupdate', function () {
            const t = this.currentTime;
            // Frase 1: 0 - 2.5s
            if (t >= 4.161 && t <7.929) {
                frase_1.style.setProperty('opacity', '1', 'important');
                frase_1.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase_1.style.setProperty('opacity', '0', 'important');
                frase_1.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 2: 2.5 - 5.5s
            if (t >= 8.227  && t < 11.934) {
                frase_2.style.setProperty('opacity', '1', 'important');
                frase_2.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase_2.style.setProperty('opacity', '0', 'important');
                frase_2.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 3: 5.5 - 8.5s
            if (t >= 13.348 && t < 15.053 ) {
                frase_3.style.setProperty('opacity', '1', 'important');
                frase_3.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase_3.style.setProperty('opacity', '0', 'important');
                frase_3.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 4: 8.5 - 12s
            if (t >= 16.292 && t <18.545) {
                frase_4.style.setProperty('opacity', '1', 'important');
                frase_4.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase_4.style.setProperty('opacity', '0', 'important');
                frase_4.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 5: 12 - 15s
            if (t >= 20.085 && t <21.938 ) {
                frase_5.style.setProperty('opacity', '1', 'important');
                frase_5.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase_5.style.setProperty('opacity', '0', 'important');
                frase_5.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 6: 12 - 15s
            if (t >= 24.346 && t < 26.229 ) {
                frase_6.style.setProperty('opacity', '1', 'important');
                frase_6.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase_6.style.setProperty('opacity', '0', 'important');
                frase_6.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 7: 12 - 15s
            if (t >= 26.543 && t <32.056) {
                frase_7.style.setProperty('opacity', '1', 'important');
                frase_7.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase_7.style.setProperty('opacity', '0', 'important');
                frase_7.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 8: 12 - 15s
            if (t >= 32.237 && t < 40.594) {
                frase_8.style.setProperty('opacity', '1', 'important');
                frase_8.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase_8.style.setProperty('opacity', '0', 'important');
                frase_8.style.setProperty('visibility', 'hidden', 'important');
            }
             // Frase 9
            if (t >= 40.690  && t < 43.363) {
                frase_9.style.setProperty('opacity', '1', 'important');
                frase_9.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase_9.style.setProperty('opacity', '0', 'important');
                frase_9.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 10: 12 - 15s
            if (t >= 44.751 && t < 49.474) {
                frase_10.style.setProperty('opacity', '1', 'important');
                frase_10.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase_10.style.setProperty('opacity', '0', 'important');
                frase_10.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 11: 12 - 15s
            if (t >=  49.463 && t < 50.423) {
                frase_11.style.setProperty('opacity', '1', 'important');
                frase_11.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase_11.style.setProperty('opacity', '0', 'important');
                frase_11.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 12: 12 - 15s
            if (t >= 50.423 && t < 51.271) {
                frase_12.style.setProperty('opacity', '1', 'important');
                frase_12.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase_12.style.setProperty('opacity', '0', 'important');
                frase_12.style.setProperty('visibility', 'hidden', 'important');
            }
                        // Frase 13: 12 - 15s

              if (t >= 51.598 && t < 53.126) {
                frase_13.style.setProperty('opacity', '1', 'important');
                frase_13.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase_13.style.setProperty('opacity', '0', 'important');
                frase_13.style.setProperty('visibility', 'hidden', 'important');
            }
                        // Frase 14: 12 - 15s

              if (t >= 54.571 && t < 58.619) {
                frase_14.style.setProperty('opacity', '1', 'important');
                frase_14.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase_14.style.setProperty('opacity', '0', 'important');
                frase_14.style.setProperty('visibility', 'hidden', 'important');
            }
        });
        audioCena1.addEventListener('play', function () {
            [frase_1, frase_2, frase_3, frase_4, frase_5, frase_6,frase_7,frase_8,frase_9,frase_10,frase_11,frase_12,frase_13,frase_14].forEach(f => {
                f.style.setProperty('opacity', '0', 'important');
                f.style.setProperty('visibility', 'hidden', 'important');
            });
        });
    }

   
});
