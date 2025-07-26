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

    // --- Controle preciso do áudio da cena3 (sticky-container2) ---
    function handleStickyContainer2Audio() {
        if (!audioUnlocked) return;
        const sticky1 = document.getElementById('sticky-container');
        const sticky2 = document.getElementById('sticky-container2');
        const sticky3 = document.getElementById('sticky-container3');
        const audioCena3 = document.getElementById('cena3-audio');
        if (!sticky1 || !sticky2 || !sticky3 || !audioCena3) return;

        const rect1 = sticky1.getBoundingClientRect();
        const rect2 = sticky2.getBoundingClientRect();
        const rect3 = sticky3.getBoundingClientRect();
        // Começa quando sticky-container (cena2) termina (sai do topo)
        // Termina quando sticky-container3 entra na viewport
        const cena2Terminou = rect1.bottom <= 0;
        const sticky3IsVisible = rect3.top < window.innerHeight && rect3.bottom > 0;
        const sticky2IsActive = rect2.bottom > 0 && rect2.top < window.innerHeight;

        if (cena2Terminou && sticky2IsActive && !sticky3IsVisible) {
            if (currentAudio !== audioCena3) {
                if (currentAudio) {
                    currentAudio.pause();
                    currentAudio.currentTime = 0;
                }
                currentAudio = audioCena3;
                audioCena3.play().catch(() => {});
            }
        } else {
            if (currentAudio === audioCena3) {
                audioCena3.pause();
                audioCena3.currentTime = 0;
                currentAudio = null;
            }
        }
    }
    window.addEventListener('scroll', handleStickyContainer2Audio);
    document.addEventListener('DOMContentLoaded', handleStickyContainer2Audio);

    // Event listeners
    document.addEventListener('click', handleFirstInteraction);
    window.addEventListener('scroll', handleFirstInteraction);
    
    // Verifica constantemente a condição da rainha1
    window.addEventListener('scroll', checkForRainha1);



    // --- CAPÍTULO 8: Sistema de timing para frases ---
    // audiocena1
    const audioCena1 = document.getElementById('cena1-audio');
    const frase_1 = document.getElementById('c1f1');
    const frase_2 = document.getElementById('c1f2');
    const frase_3 = document.getElementById('c1f3');
   

    if (audioCena1 && frase_1 && frase_2 && frase_3) {
        audioCena1.addEventListener('timeupdate', function () {
            const t = this.currentTime;
            // Frase 1: 0 - 2.5s
            if (t >= 10.557 && t < 15.641) {
                frase_1.style.setProperty('opacity', '1', 'important');
                frase_1.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase_1.style.setProperty('opacity', '0', 'important');
                frase_1.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 2: 2.5 - 5.5s
            if (t >= 21.822 && t < 34.185) {
                frase_2.style.setProperty('opacity', '1', 'important');
                frase_2.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase_2.style.setProperty('opacity', '0', 'important');
                frase_2.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 3: 5.5 - 8.5s
            if (t >=39.035 && t < 40.543) {
                frase_3.style.setProperty('opacity', '1', 'important');
                frase_3.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase_3.style.setProperty('opacity', '0', 'important');
                frase_3.style.setProperty('visibility', 'hidden', 'important');
            }
          
        });
        audioCena1.addEventListener('play', function () {
            [frase_1, frase_2, frase_3].forEach(f => {
                f.style.setProperty('opacity', '0', 'important');
                f.style.setProperty('visibility', 'hidden', 'important');
            });
        });
    }

    // audiocena2
    const audioCena5_2 = document.getElementById('cena2-audio');
    const frase1c2 = document.getElementById('c2f1');
    const frase2c2 = document.getElementById('c2f2');
    const frase3c2 = document.getElementById('c2f3');
    const frase4c2 = document.getElementById('c2f4');
    const frase5c2 = document.getElementById('c2f5');
    const frase6c2 = document.getElementById('c2f6');
    const frase7c2 = document.getElementById('c2f7');
    const frase8c2 = document.getElementById('c2f8');
    const frase9c2 = document.getElementById('c2f9');
   

    if (audioCena5_2 && frase1c2 && frase2c2 && frase3c2 && frase4c2 && frase5c2 && frase6c2 && frase7c2 && frase8c2 && frase9c2) {
        audioCena5_2.addEventListener('timeupdate', function () {
            const t = this.currentTime;
            // Frase 1: 0 - 3s
            if (t >= 0.001 && t <  2.833) {
                frase1c2.style.setProperty('opacity', '1', 'important');
                frase1c2.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase1c2.style.setProperty('opacity', '0', 'important');
                frase1c2.style.setProperty('visibility', 'hidden', 'important');
            }
                // Frase 2: 0 - 3s
            if (t >= 3.122  && t < 6.020) {
                frase2c2.style.setProperty('opacity', '1', 'important');
                frase2c2.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase2c2.style.setProperty('opacity', '0', 'important');
                frase2c2.style.setProperty('visibility', 'hidden', 'important');
            }
                // Frase 4: 0 - 3s
            if (t >= 6.808 && t <8.761) {
                frase3c2.style.setProperty('opacity', '1', 'important');
                frase3c2.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase3c2.style.setProperty('opacity', '0', 'important');
                frase3c2.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 5: 0 - 3s
            if (t >= 11.516 && t < 14.637) {    
                frase4c2.style.setProperty('opacity', '1', 'important');
                frase4c2.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase4c2.style.setProperty('opacity', '0', 'important');
                frase4c2.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 6: 0 - 3s
            if (t >= 19.904&& t < 21.434) {
                frase5c2.style.setProperty('opacity', '1', 'important');
                frase5c2.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase5c2.style.setProperty('opacity', '0', 'important');
                frase5c2.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 7: 0 - 3s
            if (t >= 24.522 && t < 27.310) {
                frase6c2.style.setProperty('opacity', '1', 'important');
                frase6c2.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase6c2.style.setProperty('opacity', '0', 'important');
                frase6c2.style.setProperty('visibility', 'hidden', 'important');
            }   
            // Frase 8: 0 - 3s
            if (t >= 27.426 && t <28.954) {
                frase7c2.style.setProperty('opacity', '1', 'important');
                frase7c2.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase7c2.style.setProperty('opacity', '0', 'important');
                frase7c2.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 9: 0 - 3s
            if (t >=35.655 && t < 36.198) {
                frase8c2.style.setProperty('opacity', '1', 'important');
                frase8c2.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase8c2.style.setProperty('opacity', '0', 'important');
                frase8c2.style.setProperty('visibility', 'hidden', 'important');
            }
           // Frase 9: 0 - 3s
            if (t >=37.468 && t < 38.565) {
                frase9c2.style.setProperty('opacity', '1', 'important');
                frase9c2.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase9c2.style.setProperty('opacity', '0', 'important');
                frase9c2.style.setProperty('visibility', 'hidden', 'important');
            }
    
         
        });
        audioCena5_2.addEventListener('play', function () {
            [frase1c2,frase2c2,frase3c2,frase4c2,frase5c2,frase6c2,frase7c2,frase8c2,frase9c2].forEach(f => {
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
   
   

    if (audioCena5_3 && frase1c3 && frase2c3 && frase3c3 && frase4c3 ) {
        audioCena5_3.addEventListener('timeupdate', function () {
            const t = this.currentTime;
            // Frase 1: 0 - 3s
            if (t >= 12.497 && t <13.620) {
                frase1c3.style.setProperty('opacity', '1', 'important');
                frase1c3.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase1c3.style.setProperty('opacity', '0', 'important');
                frase1c3.style.setProperty('visibility', 'hidden', 'important');
            }
                // Frase 2: 0 - 3s
            if (t >= 14.378 && t < 15.794) {
                frase2c3.style.setProperty('opacity', '1', 'important');
                frase2c3.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase2c3.style.setProperty('opacity', '0', 'important');
                frase2c3.style.setProperty('visibility', 'hidden', 'important');
            }
                // Frase 4: 0 - 3s
            if (t >=26.281 && t < 29.847) {
                frase3c3.style.setProperty('opacity', '1', 'important');
                frase3c3.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase3c3.style.setProperty('opacity', '0', 'important');
                frase3c3.style.setProperty('visibility', 'hidden', 'important');
            }
          // Frase 4: 0 - 3s
            if (t >=30.095 && t <35.233) {
                frase4c3.style.setProperty('opacity', '1', 'important');
                frase4c3.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase4c3.style.setProperty('opacity', '0', 'important');
                frase4c3.style.setProperty('visibility', 'hidden', 'important');
            }
         
        });
        audioCena5_3.addEventListener('play', function () {
            [frase1c3,frase2c3,frase3c3,frase4c3].forEach(f => {
                f.style.setProperty('opacity', '0', 'important');
                f.style.setProperty('visibility', 'hidden', 'important');
            });
        });
    }
     // audiocena4
    const audioCena5_4 = document.getElementById('cena4-audio');
    const rainhaCora = document.getElementById('RainhaCora');
        const gato = document.getElementById('gato');


if (audioCena5_4 && rainhaCora && gato) {
    audioCena5_4.addEventListener('timeupdate', function () {
        const t = this.currentTime;

        // Mostra RainhaCora aos 23 segundos
        if (t >= 31.055 && t < 40) {
            rainhaCora.classList.add('show');
            rainhaCora.classList.remove('exit');
        }

        // Faz sair aos 34 segundos
        else if (t >= 34) {
            rainhaCora.classList.add('exit');
        }

        // Esconde antes dos 23
        else {
            rainhaCora.classList.remove('show', 'exit');
        }




 // Mostra RainhaCora aos 23 segundos
        if (t >= 36 ) {
            gato.classList.add('exit');
        }
     
        else {
            rainhaCora.classList.remove('exit');
        }


    });
    

    audioCena5_4.addEventListener('play', function () {
        rainhaCora.classList.remove('show', 'exit');
                gato.classList.remove('exit');

    });
}
    const frase1c4 = document.getElementById('c4f1');
    const frase2c4 = document.getElementById('c4f2');
    const frase3c4 = document.getElementById('c4f3');
    const frase4c4 = document.getElementById('c4f4');
    const frase5c4 = document.getElementById('c4f5');
    const frase6c4 = document.getElementById('c4f6');
    const frase7c4 = document.getElementById('c4f7');

   

    if (audioCena5_4 && frase1c4 && frase2c4 && frase3c4 && frase4c4 && frase5c4 && frase6c4 && frase7c4 ) {
        audioCena5_4.addEventListener('timeupdate', function () {
            const t = this.currentTime;
            // Frase 1: 0 - 3s
            if (t >= 2.700&& t < 4.114) {
                frase1c4.style.setProperty('opacity', '1', 'important');
                frase1c4.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase1c4.style.setProperty('opacity', '0', 'important');
                frase1c4.style.setProperty('visibility', 'hidden', 'important');
            }
                // Frase 2: 0 - 3s
            if (t >=4.557 && t < 6.076) {
                frase2c4.style.setProperty('opacity', '1', 'important');
                frase2c4.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase2c4.style.setProperty('opacity', '0', 'important');
                frase2c4.style.setProperty('visibility', 'hidden', 'important');
            }
                // Frase 4: 0 - 3s
            if (t >=7.489  && t < 10.030) {
                frase3c4.style.setProperty('opacity', '1', 'important');
                frase3c4.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase3c4.style.setProperty('opacity', '0', 'important');
                frase3c4.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 5: 0 - 3s
            if (t >= 13.136 && t <14.903) {    
                frase4c4.style.setProperty('opacity', '1', 'important');
                frase4c4.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase4c4.style.setProperty('opacity', '0', 'important');
                frase4c4.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 6: 0 - 3s
            if (t >= 17.091 && t <  19.072) {
                frase5c4.style.setProperty('opacity', '1', 'important');
                frase5c4.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase5c4.style.setProperty('opacity', '0', 'important');
                frase5c4.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 7: 0 - 3s
            if (t >=19.577 && t <  26.851) {
                frase6c4.style.setProperty('opacity', '1', 'important');
                frase6c4.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase6c4.style.setProperty('opacity', '0', 'important');
                frase6c4.style.setProperty('visibility', 'hidden', 'important');
            }   
             // Frase 7: 0 - 3s
            if (t >=31.055  && t < 32.093) {
                frase7c4.style.setProperty('opacity', '1', 'important');
                frase7c4.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase7c4.style.setProperty('opacity', '0', 'important');
                frase7c4.style.setProperty('visibility', 'hidden', 'important');
            }   
    
         
        });
        audioCena5_4.addEventListener('play', function () {
            [frase1c4,frase2c4,frase3c4,frase4c4,frase5c4,frase6c4,frase7c4].forEach(f => {
                f.style.setProperty('opacity', '0', 'important');
                f.style.setProperty('visibility', 'hidden', 'important');
            });
        });
    }
});