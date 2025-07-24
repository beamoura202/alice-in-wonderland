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





 // --- CAPÍTULO 9: Sistema de timing para frases ---
    // audiocena1
    const audioCena1 = document.getElementById('cena1-audio');
    const frase_1 = document.getElementById('c1f1');
    const frase_2 = document.getElementById('c1f2');
   

    if (audioCena1 && frase_1 && frase_2 ) {
        audioCena1.addEventListener('timeupdate', function () {
            const t = this.currentTime;
            // Frase 1: 0 - 2.5s
            if (t >= 4.836 && t < 6.134) {
                frase_1.style.setProperty('opacity', '1', 'important');
                frase_1.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase_1.style.setProperty('opacity', '0', 'important');
                frase_1.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 2: 2.5 - 5.5s
            if (t >= 7.172 && t < 14.707) {
                frase_2.style.setProperty('opacity', '1', 'important');
                frase_2.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase_2.style.setProperty('opacity', '0', 'important');
                frase_2.style.setProperty('visibility', 'hidden', 'important');
            }
         
          
        });
        audioCena1.addEventListener('play', function () {
            [frase_1, frase_2].forEach(f => {
                f.style.setProperty('opacity', '0', 'important');
                f.style.setProperty('visibility', 'hidden', 'important');
            });
        });
    }

    // audiocena2
    const audioCena5_2 = document.getElementById('cena2-audio');
    const frase1c2 = document.getElementById('c2f1');
    const frase2c2 = document.getElementById('c2f2');
   

    if (audioCena5_2 && frase1c2 ) {
        audioCena5_2.addEventListener('timeupdate', function () {
            const t = this.currentTime;
            // Frase 1: 0 - 3s
            if (t >= 4.535 && t < 10.313) {
                frase1c2.style.setProperty('opacity', '1', 'important');
                frase1c2.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase1c2.style.setProperty('opacity', '0', 'important');
                frase1c2.style.setProperty('visibility', 'hidden', 'important');
            }
          // Frase 2 0 - 3s
            if (t >= 11.093 && t < 20.861) {
                frase2c2.style.setProperty('opacity', '1', 'important');
                frase2c2.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase2c2.style.setProperty('opacity', '0', 'important');
                frase2c2.style.setProperty('visibility', 'hidden', 'important');
            }
        });
        audioCena5_2.addEventListener('play', function () {
            [frase1c2,frase2c2].forEach(f => {
                f.style.setProperty('opacity', '0', 'important');
                f.style.setProperty('visibility', 'hidden', 'important');
            });
        });
    }
     // audiocena3
    const audioCena5_3 = document.getElementById('cena3-audio');
    const frase1c3 = document.getElementById('c3f1');
    const frase2c3 = document.getElementById('c3f2');
    const frase3c3 = document.getElementById('c3f3');
    const frase4c3 = document.getElementById('c3f4');
    const frase5c3 = document.getElementById('c3f5');
    const frase6c3 = document.getElementById('c3f6');
    const frase7c3 = document.getElementById('c3f7');
    const frase8c3 = document.getElementById('c3f8');
    const frase9c3 = document.getElementById('c3f9');
    const frase10c3 = document.getElementById('c3f10');
    const frase11c3 = document.getElementById('c3f11');
    const frase12c3 = document.getElementById('c3f12');
   

    if (audioCena5_3 && frase1c2 && frase2c3 && frase3c3 && frase4c3 && frase5c3 && frase6c3 && frase7c3 && frase8c3 && frase9c3 && frase10c3 && frase11c3 && frase12c3) {
        audioCena5_3.addEventListener('timeupdate', function () {
            const t = this.currentTime;
            // Frase 1: 0 - 3s
            if (t >= 0.573 && t < 3.752) {
                frase1c3.style.setProperty('opacity', '1', 'important');
                frase1c3.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase1c3.style.setProperty('opacity', '0', 'important');
                frase1c3.style.setProperty('visibility', 'hidden', 'important');
            }
          // Frase 2 0 - 3s
            if (t >= 5.355 && t < 14.454) {
                frase2c3.style.setProperty('opacity', '1', 'important');
                frase2c3.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase2c3.style.setProperty('opacity', '0', 'important');
                frase2c3.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 3: 0 - 3s
            if (t >=15.092 && t < 17.540) {
                frase3c3.style.setProperty('opacity', '1', 'important');
                frase3c3.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase3c3.style.setProperty('opacity', '0', 'important');
                frase3c3.style.setProperty('visibility', 'hidden', 'important');
            }
          // Frase 4
            if (t >= 19.591 && t < 22.334) {
                frase4c3.style.setProperty('opacity', '1', 'important');
                frase4c3.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase4c3.style.setProperty('opacity', '0', 'important');
                frase4c3.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 5
            if (t >= 24.182 && t < 25.731) {
                frase5c3.style.setProperty('opacity', '1', 'important');
                frase5c3.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase5c3.style.setProperty('opacity', '0', 'important');
                frase5c3.style.setProperty('visibility', 'hidden', 'important');
            }
          // Frase 6
            if (t >= 26.531 && t < 35.039) {
                frase6c3.style.setProperty('opacity', '1', 'important');
                frase6c3.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase6c3.style.setProperty('opacity', '0', 'important');
                frase6c3.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 7
             if (t >= 35.476 && t <39.702) {
                frase7c3.style.setProperty('opacity', '1', 'important');
                frase7c3.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase7c3.style.setProperty('opacity', '0', 'important');
                frase7c3.style.setProperty('visibility', 'hidden', 'important');
            }
          // Frase 8
            if (t >= 43.400 && t <46.699) {
                frase8c3.style.setProperty('opacity', '1', 'important');
                frase8c3.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase8c3.style.setProperty('opacity', '0', 'important');
                frase8c3.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 9
            if (t >= 46.847 && t < 51.575) {
                frase9c3.style.setProperty('opacity', '1', 'important');
                frase9c3.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase9c3.style.setProperty('opacity', '0', 'important');
                frase9c3.style.setProperty('visibility', 'hidden', 'important');
            }
          // Frase 10
             if (t >= 52.144 && t < 55.082 ) {
                frase10c3.style.setProperty('opacity', '1', 'important');
                frase10c3.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase10c3.style.setProperty('opacity', '0', 'important');
                frase10c3.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 11
             if (t >= 57.545 && t < 60.839) {
                frase11c3.style.setProperty('opacity', '1', 'important');
                frase11c3.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase11c3.style.setProperty('opacity', '0', 'important');
                frase11c3.style.setProperty('visibility', 'hidden', 'important');
            }
          // Frase 12 
             if (t >= 62.752 && t < 69.960) {
                frase12c3.style.setProperty('opacity', '1', 'important');
                frase12c3.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase12c3.style.setProperty('opacity', '0', 'important');
                frase12c3.style.setProperty('visibility', 'hidden', 'important');
            }
        });
        audioCena5_3.addEventListener('play', function () {
            [frase1c3,frase2c3,frase3c3,frase4c3,frase5c3,frase6c3,frase7c3,frase8c3,frase9c3,frase9c3,frase10c3,frase11c3,frase12c3].forEach(f => {
                f.style.setProperty('opacity', '0', 'important');
                f.style.setProperty('visibility', 'hidden', 'important');
            });
        });
    }

});
