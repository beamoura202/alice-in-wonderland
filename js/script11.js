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