document.addEventListener('DOMContentLoaded', function () {

    // Defina aqui para ficar disponível em todo o escopo
    const fadeBlack = document.getElementById('fade-black');

    window.addEventListener('scroll', function () {
        const sticky = document.getElementById('sticky-container1');
        const alice = document.getElementById('alicecena1');
        if (!sticky || !alice) return;

        const rect = sticky.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const stickyHeight = sticky.offsetHeight;

        // Quanto do sticky-container1 já foi rolado (0 a 1)
        const scrollTop = Math.max(0, windowHeight - rect.top);
        const progress = Math.min(1, scrollTop / stickyHeight);

        // Entrada entre 5% e 15%
        if (progress < 0.05) {
            alice.style.left = '-100vw';
        } else if (progress >= 0.05 && progress < 0.15) {
            const moveIn = (progress - 0.05) / 0.1;
            alice.style.left = `calc(${(-100 + 100 * moveIn)}vw)`;
        }
        // Fica no centro entre 15% e 50%
        else if (progress >= 0.15 && progress < 0.5) {
            alice.style.left = '0vw';
        }
        // Saída entre 50% e 60%
        else if (progress >= 0.5 && progress < 0.6) {
            const moveOut = (progress - 0.5) / 0.1;
            alice.style.left = `calc(${-100 * moveOut}vw)`;
        }
        // Após 60%, já saiu
        else if (progress >= 0.6) {
            alice.style.left = '-100vw';
        }

        // Rainha animação ao scroll de 70% a 80%
        const rainha = document.getElementById('rainhacena2');
        const bules = [
            document.getElementById('bule1'),
            document.getElementById('bule2'),
            document.getElementById('bule3'),
            document.getElementById('bule4'),
            document.getElementById('bule5'),
            document.getElementById('bule6')
        ];

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

        if (rainha && sticky) {
            animarEntrada(rainha, progress, 0);
            bules.forEach((bule, i) => animarEntrada(bule, progress, 0.15 * (i + 1)));
        }

        // Ativa fade preto quando chega ao fim do body
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 2) {
            fadeBlack.classList.add('active');
        } else {
            fadeBlack.classList.remove('active');
        }
    });

    // --- Efeito de loop/distorsão central com canvas ---
    const canvas = document.getElementById("canvas-loop");
    let currentFactor = 0;
    let targetFactor = 0;
    const scaleFactor = 0.25;
    let screenshotImg = null;

    // Carregar a imagem desejada
    screenshotImg = new Image();
    screenshotImg.src = "imgcap12/final.png"; // Caminho da sua imagem

    function applySpiralEffect(factor) {
        if (!screenshotImg.complete) return;
        const ctx = canvas.getContext("2d");

        const width = Math.floor(screenshotImg.width * scaleFactor);
        const height = Math.floor(screenshotImg.height * scaleFactor);

        // Canvas auxiliar
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
                    // Red e Blue distorcidos, Green original
                    result.data[srcIdx] = data[distortedIdx]; // Red distorcido
                    result.data[srcIdx + 1] = data[srcIdx + 1]; // Green original
                    result.data[srcIdx + 2] = data[distortedIdx + 2]; // Blue distorcido
                    result.data[srcIdx + 3] = data[distortedIdx + 3]; // Alpha distorcido
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
        currentFactor += (targetFactor - currentFactor) * 0.02; // Mais lento
        applySpiralEffect(currentFactor);
        requestAnimationFrame(animate);
    }

    screenshotImg.onload = function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    // Ativa/desativa efeito conforme scroll do cartas-container
    const cartasContainer = document.getElementById('cartas-container');
    const stickyContainer3 = document.getElementById('sticky-container3');
    const cartaEsq = document.getElementById('cartaesq');
    const cartaDir = document.getElementById('cartadir');
    const carta = document.getElementById('carta');


    window.addEventListener('scroll', () => {
        if (!cartasContainer || !stickyContainer3) return;
        const rectCartas = cartasContainer.getBoundingClientRect();
        const rectSticky3 = stickyContainer3.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const containerHeight = cartasContainer.offsetHeight;

        // Verifica se o topo do sticky-container3 está a 50vh do topo da viewport
        const sticky3At50vh = rectSticky3.top <= windowHeight * 0.5;

        // Verifica se o cartas-container está visível na viewport
        if (rectCartas.top <= windowHeight && rectCartas.bottom >= 0) {
            // Calcula o progresso do scroll dentro do container (0 a 1)
            const scrollTop = Math.max(0, windowHeight - rectCartas.top);
            const progress = Math.min(1, scrollTop / containerHeight);

            // Calcula o scale baseado no progresso (de 1 a 2)
            const scale = 1 + (progress * 1); // 1 + (0 a 1) * 1 = 1 a 2

            if (sticky3At50vh) {
                // Se sticky-container3 está a 50vh, recua as cartas
                if (cartaEsq) {
                    cartaEsq.classList.remove('visible');
                    cartaEsq.classList.add('hidden');
                }
                if (cartaDir) {
                    cartaDir.classList.remove('visible');
                    cartaDir.classList.add('hidden');

                } if (carta) {
                    carta.classList.remove('visible');
                    carta.classList.add('hidden');
                }
            } else {
                // Se sticky-container3 não está a 50vh, mostra as cartas com scale
                if (cartaEsq) {
                    cartaEsq.classList.add('visible');
                    cartaEsq.classList.remove('hidden');
                    cartaEsq.style.transform = `scale(${scale})`;
                }
                if (cartaDir) {
                    cartaDir.classList.add('visible');
                    cartaDir.classList.remove('hidden');
                    cartaDir.style.transform = `scale(${scale})`;
                  
                } if (carta) {
                      carta.classList.add('visible');
                    carta.classList.remove('hidden');
                    carta.style.transform = `scale(${scale})`;
                }
            }
        } else if (rectCartas.top > windowHeight) {
            // Se o container ainda não entrou na viewport, garante que as cartas estão escondidas
            if (cartaEsq) {
                cartaEsq.classList.remove('visible');
                cartaEsq.classList.remove('hidden');
                cartaEsq.style.transform = 'scale(1)';
            }
            if (cartaDir) {
                cartaDir.classList.remove('visible');
                cartaDir.classList.remove('hidden');
                cartaDir.style.transform = 'scale(1)';
                

            } if (carta) {
                carta.classList.remove('visible');
                carta.classList.remove('hidden');
                carta.style.transform = 'scale(1)';
            }
            
        }
    });

    // Efeito de distorção para o sticky-container3
    window.addEventListener('scroll', () => {
        if (!stickyContainer3) return;
        const rect = stickyContainer3.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const stickyHeight = stickyContainer3.offsetHeight;
        const scrollTop = Math.max(0, windowHeight - rect.top);
        const progress = Math.min(1, scrollTop / stickyHeight);

        // Ativa efeito de distorção quando chega mais cedo no scroll
        if (progress >= 0.3) { // Começa mais cedo
            document.body.classList.add('loop-effect');
            targetFactor = 0.04; // Ajuste a intensidade aqui se quiser
            if (!window._loopEffectStarted) {
                window._loopEffectStarted = true;
                animate();
            }
        } else {
            document.body.classList.remove('loop-effect');
            targetFactor = 0;
            window._loopEffectStarted = false;
        }

        // Ativa fade preto quando chega ao fim (100%)
        if (progress >= 1) {
            fadeBlack.classList.add('active');
        } else {
            fadeBlack.classList.remove('active');
        }
    });
});