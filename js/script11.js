document.addEventListener('DOMContentLoaded', function() {
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

  window.addEventListener('scroll', function() {
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
  window.addEventListener('resize', function() {
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
});