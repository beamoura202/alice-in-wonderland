
document.addEventListener('DOMContentLoaded', function () {
  const mushrooms = [
    document.getElementById('cap5cena1detalhes1-img'),
    document.getElementById('cap5cena1detalhes2-img'),
    document.getElementById('cap5cena1detalhes3-img')
  ];

  function toggleMushroom(mushroom) {
    const isVisible = !mushroom.classList.contains('popup-appear');

    if (isVisible) {
      mushroom.classList.remove('popup-disappear');
      mushroom.classList.add('popup-appear');
    } else {
      mushroom.classList.remove('popup-appear');
      mushroom.classList.add('popup-disappear');
    }
  }

  function randomToggle() {
    const randomMushroom = mushrooms[Math.floor(Math.random() * mushrooms.length)];
    toggleMushroom(randomMushroom);
    const nextInterval = Math.random() * 2000 + 1000;
    setTimeout(randomToggle, nextInterval);
  }

  randomToggle();

  const sectionFolhas = document.getElementById('sectionfolhas');
  const lagarta = document.getElementById('cap5cena1lagarta2-img');
  const butterfly = document.getElementById('cap5cena2bor-img');
  const borbContainer = document.getElementById('borb');
  let animationTriggered = false;

  window.addEventListener('scroll', function () {
    const scrollTop = window.scrollY || window.pageYOffset;
    const windowHeight = window.innerHeight;
    const fullHeight = document.documentElement.scrollHeight;
    const scrollPercent = (scrollTop + windowHeight) / fullHeight;

    // ✅ Mostrar/esconder .borb aos 80%
    if (scrollPercent >= 0.80) {
      borbContainer.classList.add('aparece');
      borbContainer.classList.remove('desaparece');
    } else {
      borbContainer.classList.add('desaparece');
      borbContainer.classList.remove('aparece');
    }

    // ✅ Animação da lagarta e borboleta (baseada em visibilidade da seção)
    const folhasRect = sectionFolhas.getBoundingClientRect();
    const sectionTop = folhasRect.top;
    const sectionHeight = sectionFolhas.offsetHeight;
    let scrollProgress = 0;

    if (sectionTop <= 0 && sectionTop >= -(sectionHeight - windowHeight)) {
      scrollProgress = Math.abs(sectionTop) / (sectionHeight - windowHeight);
    } else if (sectionTop < -(sectionHeight - windowHeight)) {
      scrollProgress = 1;
    }

    if (scrollProgress >= 0.80 && !animationTriggered) {
      animationTriggered = true;

      requestAnimationFrame(() => {
        lagarta.classList.remove('show-caterpillar');
        lagarta.classList.add('hide-caterpillar');

        setTimeout(() => {
          butterfly.classList.remove('butterfly-returning', 'butterfly-reset');
          butterfly.classList.add('butterfly-flying');
        }, 6000);
      });
    } else if (scrollProgress < 0.80 && animationTriggered) {
      animationTriggered = false;

      requestAnimationFrame(() => {
        lagarta.classList.remove('hide-caterpillar');
        lagarta.classList.add('show-caterpillar');

        butterfly.classList.remove('butterfly-flying');
        butterfly.classList.add('butterfly-returning');

        setTimeout(() => {
          butterfly.classList.remove('butterfly-returning');
          butterfly.classList.add('butterfly-reset');
        }, 6000);
      });
    }
  });
});

