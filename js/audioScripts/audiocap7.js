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

    // Event listeners
    document.addEventListener('click', handleFirstInteraction);
    window.addEventListener('scroll', handleFirstInteraction);

    // Verifica constantemente a condição da cena 2.2
    window.addEventListener('scroll', checkForCena22);











    // --- CAPÍTULO 5: Sistema de timing para frases ---
    // audiocena1
    const audioCena1 = document.getElementById('audio-cena1');

    const frase_1 = document.getElementById('c1f1');
    const frase_2 = document.getElementById('c1f2');
  


    if (audioCena1 && frase_1 && frase_2) {
        audioCena1.addEventListener('timeupdate', function () {
            const t = this.currentTime;
            // Frase 1: 0 - 2.5s
            if (t >= 22.240 && t < 23.368) {
                frase_1.style.setProperty('opacity', '1', 'important');
                frase_1.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase_1.style.setProperty('opacity', '0', 'important');
                frase_1.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 2: 2.5 - 5.5s
            if (t >= 26.064 && t < 27.403) {
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

    // audiocena21
    const audioCena21 = document.getElementById('audio-cena2-1');
   const frasec2_1 = document.getElementById('c2f1');
    const frasec2_2= document.getElementById('c2f2');
    const frasec2_3 = document.getElementById('c2f3');
    const frasec2_4 = document.getElementById('c2f4');
    const frasec2_5 = document.getElementById('c2f5');

    if (audioCena21 && frasec2_1 && frasec2_2 && frasec2_3 && frasec2_4 && frasec2_5) {
        audioCena21.addEventListener('timeupdate', function () {
            const t = this.currentTime;
            // Frase 6: 0 - 3s
            if (t >= 0.002 && t < 1.925) {
                frasec2_1.style.setProperty('opacity', '1', 'important');
                frasec2_1.style.setProperty('visibility', 'visible', 'important');
            } else {
                frasec2_1.style.setProperty('opacity', '0', 'important');
                frasec2_1.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 7: 3 - 6s
            if (t >= 9.965 && t < 11.432) {
                frasec2_2.style.setProperty('opacity', '1', 'important');
                frasec2_2.style.setProperty('visibility', 'visible', 'important');
            } else {
                frasec2_2.style.setProperty('opacity', '0', 'important');
                frasec2_2.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 8: 6 - 9s
            if (t >= 13.115 && t < 14.173) {
                frasec2_3.style.setProperty('opacity', '1', 'important');
                frasec2_3.style.setProperty('visibility', 'visible', 'important');
            } else {
                frasec2_3.style.setProperty('opacity', '0', 'important');
                frasec2_3.style.setProperty('visibility', 'hidden', 'important');
            }
              // Frase 8: 6 - 9s
            if (t >= 15.755 && t < 18.434) {
                frasec2_4.style.setProperty('opacity', '1', 'important');
                frasec2_4.style.setProperty('visibility', 'visible', 'important');
            } else {
                frasec2_4.style.setProperty('opacity', '0', 'important');
                frasec2_4.style.setProperty('visibility', 'hidden', 'important');
            }
              // Frase 8: 6 - 9s
            if (t >= 20.513 && t < 24.086) {
                frasec2_5.style.setProperty('opacity', '1', 'important');
                frasec2_5.style.setProperty('visibility', 'visible', 'important');
            } else {
                frasec2_5.style.setProperty('opacity', '0', 'important');
                frasec2_5.style.setProperty('visibility', 'hidden', 'important');
            }

        });
        audioCena21.addEventListener('play', function () {
            [frasec2_1, frasec2_2, frasec2_3,frasec2_4,frasec2_5].forEach(f => {
                f.style.setProperty('opacity', '0', 'important');
                f.style.setProperty('visibility', 'hidden', 'important');
            });
        });
    }

     // audiocena22
    const audioCena22 = document.getElementById('audio-cena2-2');
   const frasec2_6 = document.getElementById('c2f6');
    const frasec2_7 = document.getElementById('c2f7');
    const frasec2_8 = document.getElementById('c2f8');
    const frasec2_9 = document.getElementById('c2f9');
    const frasec2_10 = document.getElementById('c2f10');
    const frasec2_11 = document.getElementById('c2f11');

    if (audioCena22 && frasec2_6 && frasec2_7 && frasec2_8 && frasec2_9 && frasec2_10 && frasec2_11) {
        audioCena22.addEventListener('timeupdate', function () {
            const t = this.currentTime;
            // Frase 6: 0 - 3s
            if (t >= 0.01 && t < 1.313) {
                frasec2_6.style.setProperty('opacity', '1', 'important');
                frasec2_6.style.setProperty('visibility', 'visible', 'important');
            } else {
                frasec2_6.style.setProperty('opacity', '0', 'important');
                frasec2_6.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 7: 3 - 6s
            if (t >= 2.501 && t < 6.459) {
                frasec2_7.style.setProperty('opacity', '1', 'important');
                frasec2_7.style.setProperty('visibility', 'visible', 'important');
            } else {
                frasec2_7.style.setProperty('opacity', '0', 'important');
                frasec2_7.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 8: 6 - 9s
            if (t >= 6.971 && t < 11.359) {
                frasec2_8.style.setProperty('opacity', '1', 'important');
                frasec2_8.style.setProperty('visibility', 'visible', 'important');
            } else {
                frasec2_8.style.setProperty('opacity', '0', 'important');
                frasec2_8.style.setProperty('visibility', 'hidden', 'important');
            }
              // Frase 8: 6 - 9s
            if (t >= 11.802 && t < 18.880) {
                frasec2_9.style.setProperty('opacity', '1', 'important');
                frasec2_9.style.setProperty('visibility', 'visible', 'important');
            } else {
                frasec2_9.style.setProperty('opacity', '0', 'important');
                frasec2_9.style.setProperty('visibility', 'hidden', 'important');
            }
              // Frase 8: 6 - 9s
            if (t >= 19.192 && t < 21.265) {
                frasec2_10.style.setProperty('opacity', '1', 'important');
                frasec2_10.style.setProperty('visibility', 'visible', 'important');
            } else {
                frasec2_10.style.setProperty('opacity', '0', 'important');
                frasec2_10.style.setProperty('visibility', 'hidden', 'important');
            }
               // Frase 8: 6 - 9s
            if (t >= 21.531 && t < 25.919) {
                frasec2_11.style.setProperty('opacity', '1', 'important');
                frasec2_11.style.setProperty('visibility', 'visible', 'important');
            } else {
                frasec2_11.style.setProperty('opacity', '0', 'important');
                frasec2_11.style.setProperty('visibility', 'hidden', 'important');
            }

        });
        audioCena22.addEventListener('play', function () {
            [frasec2_6, frasec2_7, frasec2_8,frasec2_9,frasec2_10,frasec2_11].forEach(f => {
                f.style.setProperty('opacity', '0', 'important');
                f.style.setProperty('visibility', 'hidden', 'important');
            });
        });
    }
});
