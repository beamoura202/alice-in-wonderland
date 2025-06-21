window.addEventListener('scroll', function() {
  const sticky = document.querySelector('.sticky-container1');
  const img = document.querySelector('.imagemalicecena1');
  const rect = sticky.getBoundingClientRect();

  if (rect.top <= window.innerHeight && rect.bottom >= 0) {
    img.classList.add('move');
  } else {
    img.classList.remove('move');
  }
});