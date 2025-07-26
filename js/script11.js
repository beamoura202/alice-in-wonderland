document.addEventListener('DOMContentLoaded', function () {
    const sticky = document.getElementById('sticky-container1');
    const img = document.getElementById('alicecena1');

    let targetLeft = 0;
    let targetWidth = 20;
    let currentLeft = 0;
    let currentWidth = 20;
    let animating = false;

    function animate() {
        currentLeft += (targetLeft - currentLeft) * 0.15;
        currentWidth += (targetWidth - currentWidth) * 0.15;

        img.style.left = `${currentLeft}px`;
        img.style.width = `${currentWidth}vw`;

        if (Math.abs(currentLeft - targetLeft) > 0.5 || Math.abs(currentWidth - targetWidth) > 0.1) {
            requestAnimationFrame(animate);
        } else {
            currentLeft = targetLeft;
            currentWidth = targetWidth;
            img.style.left = `${currentLeft}px`;
            img.style.width = `${currentWidth}vw`;
            animating = false;
        }
    }

    window.addEventListener('scroll', function () {
        if (!sticky || !img) return;
        const rect = sticky.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        const totalScroll = rect.height - windowHeight;
        const scrolled = Math.min(Math.max(windowHeight - rect.top, 0), totalScroll);
        const percent = scrolled / totalScroll;
        const animPercent = Math.min(percent / 0.4, 1);

        const widthStart = 20; // vw
        const widthEnd = 7;   // vw
        targetWidth = widthStart - (widthStart - widthEnd) * animPercent;

        // left vai de 0 até ao centro do ecrã
        const center = window.innerWidth / 2;
        targetLeft = animPercent * center;

        if (!animating) {
            animating = true;
            requestAnimationFrame(animate);
        }
    });

    // Atualiza ao redimensionar a janela
    window.addEventListener('resize', function () {
        // recalcula o centro
        targetLeft = (window.innerWidth / 2);
        currentLeft = targetLeft;
        img.style.left = `${currentLeft}px`;
    });
});

let sapatosAnimados = false;

document.addEventListener('scroll', function () {
    const container = document.getElementById('sticky-container2');
    const detalhe1 = document.getElementById('detalhecena1');
    const detalhe2 = document.getElementById('detalhecena2');
    if (!container || !detalhe1 || !detalhe2) return;

    const rect = container.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const containerHeight = container.offsetHeight;

    const scrollPercent = Math.min(Math.max((windowHeight - rect.top) / containerHeight, 0), 1);

    if (scrollPercent > 0.3) {
        // Anima para baixo e esconde
        if (!detalhe1.classList.contains('detalhe1-hide-anim')) {
            detalhe1.classList.remove('detalhe1-show-anim', 'detalhe-hidden');
            detalhe2.classList.remove('detalhe2-show-anim', 'detalhe-hidden');
            detalhe1.classList.add('detalhe1-hide-anim');
            detalhe2.classList.add('detalhe2-hide-anim');
            setTimeout(() => {
                detalhe1.classList.add('detalhe-hidden');
                detalhe2.classList.add('detalhe-hidden');
            }, 1000);
        }
    } else {
        // Anima para cima e mostra
        if (detalhe1.classList.contains('detalhe-hidden')) {
            detalhe1.classList.remove('detalhe1-hide-anim', 'detalhe-hidden');
            detalhe2.classList.remove('detalhe2-hide-anim', 'detalhe-hidden');
            detalhe1.classList.add('detalhe1-show-anim');
            detalhe2.classList.add('detalhe2-show-anim');
        }
    }

    // Chapeleiro, Sape e Sapd animation
    const sticky2 = document.getElementById('sticky-container2');
    const sape = document.getElementById('sape');
    const sapd = document.getElementById('sapd');
    const chapeleiro = document.getElementById('chapeleiro');
    if (sticky2 && sape && sapd) {
        const rect = sticky2.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const containerHeight = sticky2.offsetHeight;
        const scrollPercent = Math.min(Math.max((windowHeight - rect.top) / containerHeight, 0), 1);

        if (scrollPercent > 0.5 && !sapatosAnimados) {
            // Só anima uma vez
            sape.classList.remove('sape-saltar');
            sapd.classList.remove('sapd-saltar');
            void sape.offsetWidth;
            void sapd.offsetWidth;
            sape.classList.add('sape-saltar');
            sapd.classList.add('sapd-saltar');
            sapatosAnimados = true;
        }
        // Se quiser que a animação possa ser reiniciada ao voltar acima dos 60%, descomente abaixo:
        // else if (scrollPercent <= 0.6 && sapatosAnimados) {
        //     sape.classList.remove('sape-saltar');
        //     sapd.classList.remove('sapd-saltar');
        //     sapatosAnimados = false;
        // }
    }

    if (sticky2 && chapeleiro) {
        const rect = sticky2.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const containerHeight = sticky2.offsetHeight;
        const scrollPercent = Math.min(Math.max((windowHeight - rect.top) / containerHeight, 0), 1);

        if (scrollPercent > 0.5 && scrollPercent <= 0.7) {
            chapeleiro.classList.add('chapeleiro-entra');
            chapeleiro.classList.remove('chapeleiro-sair');
        } else if (scrollPercent > 0.7) {
            chapeleiro.classList.remove('chapeleiro-entra');
            chapeleiro.classList.add('chapeleiro-sair');
        } else {
            chapeleiro.classList.remove('chapeleiro-entra', 'chapeleiro-sair');
        }
    }

    // Alice animation
    const sticky3 = document.getElementById('alice-container');
    const alice = document.getElementById('alice');
    const esquilo = document.getElementById('esquilo');

    if (sticky3 && alice) {
        const rect = sticky3.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const containerHeight = sticky3.offsetHeight;
        const scrollPercent = Math.min(Math.max((windowHeight - rect.top) / containerHeight, 0), 1);

        if (scrollPercent > 0.7) {
            alice.classList.add('alice-entra');
            esquilo.classList.add('esquilo-entra');

        } else {
            alice.classList.remove('alice-entra');
            esquilo.classList.remove('esquilo-entra');

        }

        // POP effect: faz pop a cada 5% de scroll acima de 0.7 e aumenta tamanho
        if (scrollPercent > 0.7) {
            const popStep = Math.floor((scrollPercent - 0.7) * 20); // 0,1,2,3,4,5...
            if (alice.dataset.lastPop != popStep) {
                alice.classList.remove('alice-pop');
                esquilo.classList.remove('esquilo-pop');

                void alice.offsetWidth;
                alice.classList.add('alice-pop');
                esquilo.classList.add('esquilo-pop');

                alice.dataset.lastPop = popStep;

                // Aumenta progressivamente o tamanho
                const baseWidth = 40; // vw
                const newWidth = baseWidth + popStep * 2; // aumenta 2vw por pop
                alice.style.setProperty('--alice-width', `${newWidth}vw`);

            }
        } else {
            alice.classList.remove('alice-pop');
            esquilo.classList.remove('esquilo-pop');

            alice.dataset.lastPop = '';
            alice.style.setProperty('--esquilo-width', `40vw`);

        }
    }


    // --- CAPÍTULO 11: Sistema de timing para frases ---


    // audiocena2
    const audioCena5_2 = document.getElementById('cena2-audio');
    const frase1c2 = document.getElementById('c2f1');
    const frase2c2 = document.getElementById('c2f2');
    const frase3c2 = document.getElementById('c2f3');
    const frase4c2 = document.getElementById('c2f4');


    if (audioCena5_2 && frase1c2 && frase2c2 && frase3c2 && frase4c2) {
        audioCena5_2.addEventListener('timeupdate', function () {
            const t = this.currentTime;
            // Frase 6: 0 - 3s
            if (t >= 9.162 && t < 10.459) {
                frase1c2.style.setProperty('opacity', '1', 'important');
                frase1c2.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase1c2.style.setProperty('opacity', '0', 'important');
                frase1c2.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 6: 0 - 3s
            if (t >= 12.226 && t < 14.764) {
                frase2c2.style.setProperty('opacity', '1', 'important');
                frase2c2.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase2c2.style.setProperty('opacity', '0', 'important');
                frase2c2.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 6: 0 - 3s
            if (t >= 16.106 && t < 25.444) {
                frase3c2.style.setProperty('opacity', '1', 'important');
                frase3c2.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase3c2.style.setProperty('opacity', '0', 'important');
                frase3c2.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 6: 0 - 3s
            if (t >= 25.761 && t < 27.119) {
                frase4c2.style.setProperty('opacity', '1', 'important');
                frase4c2.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase4c2.style.setProperty('opacity', '0', 'important');
                frase4c2.style.setProperty('visibility', 'hidden', 'important');
            }

        });
        audioCena5_2.addEventListener('play', function () {
            [frase1c2, frase2c2, frase3c2, frase4c2].forEach(f => {
                f.style.setProperty('opacity', '0', 'important');
                f.style.setProperty('visibility', 'hidden', 'important');
            });
        });
    }
    
    // audiocena3
    const audioCena5_3 = document.getElementById('cena3-audio');
    const lebre = document.getElementById('lebre');
const chapeleiro2 = document.getElementById('chapeleiro2');


if (audioCena5_3 && lebre && chapeleiro && chapeleiro2) {
  audioCena5_3.addEventListener('timeupdate', function () {
    const t = this.currentTime;

    // ➤ LEBRE entra e sai
    if (t >= 22.702 && t < 24.532) {
      lebre.classList.add('lebre-entra');
      lebre.classList.remove('lebre-sai');
    } else if (t >= 27.810 && t < 29.888) {
      lebre.classList.add('lebre-entra');
      lebre.classList.remove('lebre-sai');
    } else {
      lebre.classList.remove('lebre-entra');
      lebre.classList.add('lebre-sai');
    }

  if (t >= 38 && t < 58) {
  chapeleiro.classList.add('hide');
  chapeleiro2.classList.add('show');
  chapeleiro.classList.remove('chapeleiro-sai-direita');
} else if (t >= 58) {
  chapeleiro.classList.remove('hide');
  chapeleiro2.classList.remove('show');
  chapeleiro.classList.add('chapeleiro-sai-direita');
} else {
  chapeleiro.classList.remove('hide', 'chapeleiro-sai-direita');
  chapeleiro2.classList.remove('show');
}
  });
audioCena5_3.addEventListener('play', function () {
  lebre.classList.remove('lebre-entra', 'lebre-sai');
  chapeleiro.classList.remove('hide', 'chapeleiro-sai-direita');
  chapeleiro2.classList.remove('show');
});
}



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

    if (audioCena5_3 && frase1c3 && frase2c3 && frase3c3 && frase4c3 && frase5c3 && frase6c3 && frase7c3 && frase8c3 && frase9c3 && frase10c3) {
        audioCena5_3.addEventListener('timeupdate', function () {
            const t = this.currentTime;
            // Frase 1: 0 - 3s
            if (t >= 7.498 && t < 15.066) {
                frase1c3.style.setProperty('opacity', '1', 'important');
                frase1c3.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase1c3.style.setProperty('opacity', '0', 'important');
                frase1c3.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 2: 0 - 3s
            if (t >= 15.171 && t < 16.408) {
                frase2c3.style.setProperty('opacity', '1', 'important');
                frase2c3.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase2c3.style.setProperty('opacity', '0', 'important');
                frase2c3.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 3: 0 - 3s
            if (t >= 23.702 && t < 24.532) {
                frase3c3.style.setProperty('opacity', '1', 'important');
                frase3c3.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase3c3.style.setProperty('opacity', '0', 'important');
                frase3c3.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 4: 0 - 3s
            if (t >= 27.020 && t < 27.622) {
                frase4c3.style.setProperty('opacity', '1', 'important');
                frase4c3.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase4c3.style.setProperty('opacity', '0', 'important');
                frase4c3.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 5: 0 - 3s
            if (t >= 28.810 && t < 29.888) {
                frase5c3.style.setProperty('opacity', '1', 'important');
                frase5c3.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase5c3.style.setProperty('opacity', '0', 'important');
                frase5c3.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 6: 0 - 3s
            if (t >= 31.676 && t < 34.891) {
                frase6c3.style.setProperty('opacity', '1', 'important');
                frase6c3.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase6c3.style.setProperty('opacity', '0', 'important');
                frase6c3.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 7: 0 - 3s
            if (t >= 40.188 && t < 42.425) {
                frase7c3.style.setProperty('opacity', '1', 'important');
                frase7c3.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase7c3.style.setProperty('opacity', '0', 'important');
                frase7c3.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 8: 0 - 3s
            if (t >= 43.698 && t < 50.314) {
                frase8c3.style.setProperty('opacity', '1', 'important');
                frase8c3.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase8c3.style.setProperty('opacity', '0', 'important');
                frase8c3.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 9: 0 - 3s
            if (t >= 51.931 && t < 56.639) {
                frase9c3.style.setProperty('opacity', '1', 'important');
                frase9c3.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase9c3.style.setProperty('opacity', '0', 'important');
                frase9c3.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 10: 0 - 3s
            if (t >= 56.997 && t < 58.144) {
                frase10c3.style.setProperty('opacity', '1', 'important');
                frase10c3.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase10c3.style.setProperty('opacity', '0', 'important');
                frase10c3.style.setProperty('visibility', 'hidden', 'important');
            }

        });
        audioCena5_3.addEventListener('play', function () {
            [frase1c3, frase2c3, frase3c3, frase4c3, frase5c3, frase6c3, frase7c3, frase8c3, frase9c3, frase10c3].forEach(f => {
                f.style.setProperty('opacity', '0', 'important');
                f.style.setProperty('visibility', 'hidden', 'important');
            });
        });
    }

    // audiocena4
    const audioCena5_4 = document.getElementById('cena4-audio');
    const frase1c4 = document.getElementById('c4f1');
    const frase2c4 = document.getElementById('c4f2');
    const frase3c4 = document.getElementById('c4f3');

    if (audioCena5_4 && frase1c4 && frase2c4 && frase3c4) {
        audioCena5_4.addEventListener('timeupdate', function () {
            const t = this.currentTime;
            // Frase 1: 0 - 3s
            if (t >= 11.235 && t < 12.573) {
                frase1c4.style.setProperty('opacity', '1', 'important');
                frase1c4.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase1c4.style.setProperty('opacity', '0', 'important');
                frase1c4.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 2: 0 - 3s
            if (t >= 12.978 && t < 16.509) {
                frase2c4.style.setProperty('opacity', '1', 'important');
                frase2c4.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase2c4.style.setProperty('opacity', '0', 'important');
                frase2c4.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 3: 0 - 3s
            if (t >= 23.793 && t < 24.786) {
                frase3c4.style.setProperty('opacity', '1', 'important');
                frase3c4.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase3c4.style.setProperty('opacity', '0', 'important');
                frase3c4.style.setProperty('visibility', 'hidden', 'important');
            }

        });
        audioCena5_4.addEventListener('play', function () {
            [frase1c4, frase2c4, frase3c4].forEach(f => {
                f.style.setProperty('opacity', '0', 'important');
                f.style.setProperty('visibility', 'hidden', 'important');
            });
        });
    }


});