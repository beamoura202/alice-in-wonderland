document.addEventListener('DOMContentLoaded', function () {

    const arvoreDir = document.getElementById('arvoredir');
    const arvoreEsq = document.getElementById('arvoreesq');
    const planta = document.getElementById('planta');
    const gato = document.getElementById('gato');
    const gatoCab = document.getElementById('gato-cabeca');
    const gatoCorp = document.getElementById('gato-corpo');
    const alice = document.getElementById('alice');

    const fundoImg = document.getElementById('fundo-img');
    const fundoArvore = document.getElementById('fundo-arvore');
    const vegetacaoContainer = document.getElementById('vegetacao-container'); // << ADICIONE ESTA LINHA


    window.addEventListener('scroll', function () {
        const containerRect = vegetacaoContainer.getBoundingClientRect();
        const scrollProgress = Math.abs(containerRect.top) / (containerRect.height - window.innerHeight);

        if (scrollProgress >= 0.1) {
            arvoreDir.classList.add('move-ad');
            arvoreEsq.classList.add('move-ae');
            planta.classList.add('move-p');
            gato.classList.add('move-g');
            alice.classList.add('move-a');
        } else {
            arvoreDir.classList.remove('move-ad');
            arvoreEsq.classList.remove('move-ae');
            planta.classList.remove('move-p');
            gato.classList.remove('move-g');
            alice.classList.remove('move-a');
        }
    });

    window.addEventListener('scroll', function () {
        const containerRect = vegetacaoContainer.getBoundingClientRect();
        const scrollProgress = Math.abs(containerRect.top) / (containerRect.height - window.innerHeight);

        if (scrollProgress >= 0.3 && scrollProgress <= 0.4) {

            arvoreDir.classList.add('move-left2a');
            planta.classList.add('move-left2p');
            gato.classList.add('move-right2g');
            alice.classList.add('move-left2alice');

            fundoArvore.classList.add('move-left3');
            fundoImg.classList.add('move-left4');
            arvoreDir.classList.add('move-ad');
            arvoreEsq.classList.add('move-ae');
            planta.classList.add('move-p');
            gato.classList.add('move-g');
            alice.classList.add('move-a');

        } else {

            arvoreDir.classList.remove('move-left2a');
            planta.classList.remove('move-left2p');
            gato.classList.remove('move-right2g');
            alice.classList.remove('move-left2alice');

            fundoArvore.classList.remove('move-left3');
            fundoImg.classList.remove('move-left4');


        }
    });
    window.addEventListener('scroll', function () {
        const containerRect = vegetacaoContainer.getBoundingClientRect();
        const scrollProgress = Math.abs(containerRect.top) / (containerRect.height - window.innerHeight);

        if (scrollProgress >= 0.4 && scrollProgress <= 0.5) {
            arvoreDir.classList.add('move-right2');
            arvoreEsq.classList.add('move-right2e');
            planta.classList.add('move-right2p');
            gato.classList.add('move-right2g');
            alice.classList.add('move-right2al');

            fundoArvore.classList.add('move-right3');
            fundoImg.classList.add('move-right4');

        } else {


            arvoreDir.classList.remove('move-right2');
            arvoreEsq.classList.remove('move-right2e');
            planta.classList.remove('move-right2p');
            gato.classList.remove('move-right2g');
            alice.classList.remove('move-right2al');

            fundoArvore.classList.remove('move-right3');
            fundoImg.classList.remove('move-right4');
        }
    });



    window.addEventListener('scroll', function () {
        const containerRect = vegetacaoContainer.getBoundingClientRect();
        const scrollProgress = Math.abs(containerRect.top) / (containerRect.height - window.innerHeight);

        if (scrollProgress >= 0.6) {

            // Cabeça aparece suavemente
            // Gato desaparece suavemente
            gato.classList.add('fade-out');
            gatoCab.classList.add('show');




        } else {
            gatoCab.classList.remove('show');

            gato.classList.remove('fade-out');
            gato.classList.add('show');


            gatoCab.classList.add('hide');

        }



        if (scrollProgress >= 0.65) {
            gatoCab.classList.add('oscilando');
        }
        else {
            gatoCab.classList.remove('oscilando');
        }
    });
});


