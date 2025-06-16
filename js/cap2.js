// Se o utilizador fizer scroll para cima no topo, volta ao index.html no fim
let alreadyRedirected = false;
window.addEventListener('scroll', function() {
  if (window.scrollY === 0 && !alreadyRedirected) {
    alreadyRedirected = true;
    // Passa um parâmetro para indicar que deve fazer scroll para o fim
    window.location.href = 'index.html#end';
  }
});