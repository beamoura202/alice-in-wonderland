document.addEventListener('DOMContentLoaded', function() {
    const menu = document.querySelector('.menu-svg');
    menu.addEventListener('click', function() {
        menu.classList.remove('animate'); // Permite repetir animação
        void menu.offsetWidth; // Força reflow
        menu.classList.add('animate');
    });
});
const menu = document.querySelector('.menu-svg');

document.addEventListener('click', function(e) {
    if (!menu.contains(e.target) && !menu.classList.contains('hide')) {
        menu.classList.remove('animate');
        menu.classList.remove('hide');
        menu.classList.remove('hide-anim');
        void menu.offsetWidth; // força reflow
        menu.classList.add('hide-anim');
        setTimeout(() => {
            menu.classList.remove('hide-anim');
            menu.classList.add('hide');
        }, 1000); // 1000ms = duração da animação
    }
});

menu.addEventListener('click', function(e) {
    e.stopPropagation(); // impede que o clique no menu feche
    menu.classList.remove('hide');
    menu.classList.remove('animate');
    void menu.offsetWidth; // força reflow
    menu.classList.add('animate');
});

const svg = document.querySelector('.menu-svg');
const horas = svg.querySelector('#horas');
const minutos = svg.querySelector('#minutos');
const centro = { x: 214.73, y: 754.26 }; // centro do id fundo

function getPointerAngle(targetId) {
    // 12 em cima (-150°), 1 em -120°, 2 em -90°, ..., 3 em -60°, 4 em -30°, 5 em 0°, ..., 11 em -180°
    return ((targetId - 12) * 30) - 150;
}

for (let i = 1; i <= 12; i++) {
    const num = svg.querySelector(`g[id="${i}"]`);
    if (num) {
        num.addEventListener('click', function(e) {
            e.stopPropagation();

            // Remove a cor roxa de todos os ids 1 a 12
            for (let j = 1; j <= 12; j++) {
                const outro = svg.querySelector(`g[id="${j}"]`);
                if (outro) outro.classList.remove('numero-roxo');
            }
            // Adiciona a cor roxa ao número clicado
            num.classList.add('numero-roxo');

            // Roda o ponteiro das horas para o número clicado
            const angle = getPointerAngle(i);
            horas.classList.remove('animate');
            void horas.offsetWidth;
            horas.style.transform = `rotate(${angle}deg)`;
            horas.classList.add('animate');

            // Roda o ponteiro dos minutos 360 graus
            minutos.classList.remove('animate');
            void minutos.offsetWidth;
            minutos.style.transform = `rotate(360deg)`;
            minutos.classList.add('animate');

            // Reset minutos após animação
            setTimeout(() => {
                minutos.style.transform = `rotate(0deg)`;
                minutos.classList.remove('animate');
            }, 1200);

            // Redireciona após a animação (1200ms)
            setTimeout(() => {
                if (i === 1) {
                    window.location.href = 'index.html#chapter1';
                } else {
                    window.location.href = `cap${i}.html#chapter${i}`;
                }
            }, 1200);
        });
    }
}

function atualizaSegundos() {
  const agora = new Date();
  const segundos = agora.getSeconds();
  // 1 volta por minuto = 6 graus por segundo (360/60)
  const angulo = segundos * 6;

  const ponteiroSegundos = document.getElementById('segundos');
  if (ponteiroSegundos) {
    ponteiroSegundos.setAttribute(
      'transform',
      'rotate(' + angulo + ' 215.76 755.28)'
    );
  }
}

setInterval(atualizaSegundos, 1000); // Atualiza a cada 1 segundo
atualizaSegundos();



