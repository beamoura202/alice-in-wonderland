document.addEventListener('DOMContentLoaded', function () {
    const fadeBlack = document.getElementById('fade-black');
    const stickyContainer3 = document.getElementById('sticky-container3');
    const sticky = document.getElementById('sticky-container1');
    const alice = document.getElementById('alicecena1');
    const rainha = document.getElementById('rainhacena2');
    const bules = [
        document.getElementById('bule1'),
        document.getElementById('bule2'),
        document.getElementById('bule3'),
        document.getElementById('bule4'),
        document.getElementById('bule5'),
        document.getElementById('bule6')
    ];
    const canvas = document.getElementById("canvas-loop");
    const cartasContainer = document.getElementById('cartas-container');
    const cartaEsq = document.getElementById('cartaesq');
    const cartaDir = document.getElementById('cartadir');
    const carta = document.getElementById('carta');

    let currentFactor = 0;
    let targetFactor = 0;
    const scaleFactor = 0.25;
    let screenshotImg = new Image();
    screenshotImg.src = "imgcap12/final.png";

    screenshotImg.onload = function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    let alreadyFaded = false;

    function animarEntrada(elemento, progress, delay = 0) {
        if (!elemento) return;
        if (progress < 0.7) {
            elemento.style.bottom = '-100vh';
            elemento.style.transform = 'translateX(-50%) scale(0.5)';
            elemento.classList.remove('shake', 'mesa-rotacao');
            elemento.style.animationDelay = '';
        } else if (progress >= 0.7 && progress < 0.8) {
            const moveIn = (progress - 0.7) / 0.1;
            elemento.style.bottom = `calc(${-100 + 100 * moveIn}vh)`;
            const scale = 0.5 + 0.5 * moveIn;
            elemento.style.transform = `translateX(-50%) scale(${scale})`;
            elemento.classList.remove('shake', 'mesa-rotacao');
            elemento.style.animationDelay = '';
        } else if (progress >= 0.9) {
            elemento.style.bottom = '0';
            elemento.style.transform = 'translateX(-50%) scale(1)';
            elemento.classList.add('mesa-rotacao');
            if (elemento.id !== 'rainhacena2') {
                elemento.classList.add('shake');
                elemento.style.animationDelay = `${delay}s`;
            } else {
                elemento.classList.remove('shake');
                elemento.style.animationDelay = '';
            }
        }
    }

    function applySpiralEffect(factor) {
        if (!screenshotImg.complete) return;
        const ctx = canvas.getContext("2d");

        const width = Math.floor(screenshotImg.width * scaleFactor);
        const height = Math.floor(screenshotImg.height * scaleFactor);

        const lowResCanvas = document.createElement('canvas');
        const lowCtx = lowResCanvas.getContext('2d');
        lowResCanvas.width = width;
        lowResCanvas.height = height;
        lowCtx.drawImage(screenshotImg, 0, 0, width, height);

        const imageData = lowCtx.getImageData(0, 0, width, height);
        const data = imageData.data;
        const result = lowCtx.createImageData(width, height);

        const cx = width / 2;
        const cy = height / 2;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const dx = x - cx;
                const dy = y - cy;
                const r = Math.sqrt(dx * dx + dy * dy);
                const angle = Math.atan2(dy, dx) + r * factor;

                const sx = Math.round(cx + r * Math.cos(angle));
                const sy = Math.round(cy + r * Math.sin(angle));

                const srcIdx = (y * width + x) * 4;

                let distortedIdx;
                if (sx >= 0 && sx < width && sy >= 0 && sy < height) {
                    distortedIdx = (sy * width + sx) * 4;
                    result.data[srcIdx] = data[distortedIdx];
                    result.data[srcIdx + 1] = data[srcIdx + 1];
                    result.data[srcIdx + 2] = data[distortedIdx + 2];
                    result.data[srcIdx + 3] = data[distortedIdx + 3];
                } else {
                    result.data[srcIdx] = 0;
                    result.data[srcIdx + 1] = 0;
                    result.data[srcIdx + 2] = 0;
                    result.data[srcIdx + 3] = 255;
                }
            }
        }

        lowCtx.putImageData(result, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(lowResCanvas, 0, 0, canvas.width, canvas.height);
    }

    function animate() {
        currentFactor += (targetFactor - currentFactor) * 0.02;
        applySpiralEffect(currentFactor);
        requestAnimationFrame(animate);
    }

    window.addEventListener('scroll', () => {
        // ALICE animação scroll
        if (sticky && alice) {
            const rect = sticky.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const stickyHeight = sticky.offsetHeight;
            const scrollTop = Math.max(0, windowHeight - rect.top);
            const progress = Math.min(1, scrollTop / stickyHeight);

            if (progress < 0.05) {
                alice.style.left = '-100vw';
            } else if (progress >= 0.05 && progress < 0.15) {
                const moveIn = (progress - 0.05) / 0.1;
                alice.style.left = `calc(${(-100 + 100 * moveIn)}vw)`;
            } else if (progress >= 0.15 && progress < 0.5) {
                alice.style.left = '0vw';
            } else if (progress >= 0.5 && progress < 0.6) {
                const moveOut = (progress - 0.5) / 0.1;
                alice.style.left = `calc(${-100 * moveOut}vw)`;
            } else if (progress >= 0.6) {
                alice.style.left = '-100vw';
            }

            // Rainha + bules
            animarEntrada(rainha, progress, 0);
            bules.forEach((bule, i) => animarEntrada(bule, progress, 0.15 * (i + 1)));
        }

        // Cartas efeito de scale + ocultar quando sticky3 está visível
        if (cartasContainer && stickyContainer3) {
            const rectCartas = cartasContainer.getBoundingClientRect();
            const rectSticky3 = stickyContainer3.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const containerHeight = cartasContainer.offsetHeight;

            const sticky3At50vh = rectSticky3.top <= windowHeight * 0.5;

            if (rectCartas.top <= windowHeight && rectCartas.bottom >= 0) {
                const scrollTop = Math.max(0, windowHeight - rectCartas.top);
                const progress = Math.min(1, scrollTop / containerHeight);
                const scale = 1 + (progress * 1);

                if (sticky3At50vh) {
                    [cartaEsq, cartaDir, carta].forEach(el => {
                        if (el) {
                            el.classList.remove('visible');
                            el.classList.add('hidden');
                        }
                    });
                } else {
                    [cartaEsq, cartaDir, carta].forEach(el => {
                        if (el) {
                            el.classList.add('visible');
                            el.classList.remove('hidden');
                            el.style.transform = `scale(${scale})`;
                        }
                    });
                }
            } else if (rectCartas.top > windowHeight) {
                [cartaEsq, cartaDir, carta].forEach(el => {
                    if (el) {
                        el.classList.remove('visible', 'hidden');
                        el.style.transform = 'scale(1)';
                    }
                });
            }
        }

        // Ativa efeito de distorção e fade final + redireciona para creditos.html
        if (stickyContainer3 && !alreadyFaded) {
            const rect = stickyContainer3.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const stickyHeight = stickyContainer3.offsetHeight;
            const scrollTop = Math.max(0, windowHeight - rect.top);
            const progress = Math.min(1, scrollTop / stickyHeight);

            if (progress >= 0.3) {
                document.body.classList.add('loop-effect');
                targetFactor = 0.04;
                if (!window._loopEffectStarted) {
                    window._loopEffectStarted = true;
                    animate();
                }
            } else {
                document.body.classList.remove('loop-effect');
                targetFactor = 0;
                window._loopEffectStarted = false;
            }

            if (progress >= 1) {
                fadeBlack.classList.add('active');
                alreadyFaded = true;

                setTimeout(() => {
                    window.location.href = 'creditos.html';
                }, 2000);
            }
        }
    });
});
