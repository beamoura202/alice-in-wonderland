////////////////////////cena1///////////////////////////////////////////////
// Configurações do efeito
const EFFECT_CONFIG = {
    startPercent: 30,           // Inicia o efeito aos 10% de scroll
    endPercent: 55,             // Máximo efeito aos 25% de scroll
    maxRotation: 20,            // Rotação máxima em graus
    maxScaleY: 1.4,             // Escala Y máxima (aumentei para compensar perspectiva)
    perspectiveDistance: 1060,   // Distância da perspectiva (menor = mais pronunciado)
    verticalOffset: 8           // Offset vertical em vh
};

// Função para calcular a porcentagem de scroll
function getScrollPercentage() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    return (scrollTop / scrollHeight) * 100;
}

// Função de easing para suavizar a transição
function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

// Função para aplicar o efeito de perspectiva
function applyPerspectiveEffect() {
    const mesa1 = document.getElementById('mesa1');
    const personagens1 = document.getElementById('personagens1');
    const alice1 = document.getElementById('alice1'); // ADICIONADO
    if (!mesa1) return;
    
    const scrollPercentage = getScrollPercentage();
    
    // Quando o scroll atinge a porcentagem inicial, inicia o efeito
    if (scrollPercentage >= EFFECT_CONFIG.startPercent) {
        // Calcula a intensidade do efeito baseado na porcentagem de scroll
        const rawIntensity = Math.min(
            (scrollPercentage - EFFECT_CONFIG.startPercent) / 
            (EFFECT_CONFIG.endPercent - EFFECT_CONFIG.startPercent), 
            1
        );
        
        // Aplica easing para uma transição mais suave
        const effectIntensity = easeOutCubic(rawIntensity);
        
        // Calcula os valores da transformação vertical
        // rotateX positivo com origin no topo faz com que a parte inferior se aproxime
        // mantendo a parte superior fixa
        const rotationX = effectIntensity * EFFECT_CONFIG.maxRotation;
        const scaleY = 1 + (effectIntensity * (EFFECT_CONFIG.maxScaleY - 1));
        
        // Aplica o efeito de perspectiva mantendo o topo fixo
        mesa1.style.transform = `
            translate(-50%, -50%) 
            perspective(${EFFECT_CONFIG.perspectiveDistance}px) 
            rotateX(${rotationX}deg) 
            scaleY(${scaleY})
        `;
        
        // Ajusta a posição Y para compensar a rotação (topo fica fixo)
        const offsetY = effectIntensity * EFFECT_CONFIG.verticalOffset;
        mesa1.style.top = `${50 + offsetY}vh`;
        
        // Adiciona classe para efeitos CSS adicionais
        mesa1.classList.add('perspective-active');
        
        // --- NOVO: Efeito de escala para personagens1 ---
        if (personagens1) {
            // Diminui de 1 até 0.7 conforme o efeito avança
            const minScale = 0.7;
            const scale = 1 - effectIntensity * (1 - minScale);
            personagens1.style.transform = `scale(${scale})`;
        }
        // --- NOVO: Alice cresce ---
        if (alice1) {
            const maxScale = 3; // ajuste conforme desejar
            const scale = 1 + effectIntensity * (maxScale - 1);
            const maxTranslate = 100; // em px, ajuste conforme necessário
            const translateY = effectIntensity * maxTranslate;
            alice1.style.transform = `scale(${scale}) translateY(${translateY}px)`;
        }
        
    } else {
        // Reset para posição original quando scroll < porcentagem inicial
        mesa1.style.transform = 'translate(-50%, -50%)';
        mesa1.style.top = '60vh';
        mesa1.classList.remove('perspective-active');
        if (personagens1) {
            personagens1.style.transform = 'scale(1)';
        }
        if (alice1) {
            alice1.style.transform = 'scale(1) translateY(0)';
        }
    }
}

// Event listener para o scroll
window.addEventListener('scroll', applyPerspectiveEffect);

// Aplica o efeito no carregamento inicial
document.addEventListener('DOMContentLoaded', applyPerspectiveEffect);



////////////////////////cena2///////////////////////////////////////////////
// Configuração do efeito da mesa2
const MESA2_EFFECT = {
    startPercent: 10,
    endPercent: 20,
    startRight: -100, // em vw
    endRight: 0
};

function applyMesa2Effect() {
    const divmesa2 = document.querySelector('.divmesa2');
    if (!divmesa2) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / scrollHeight) * 100;

    let rightValue;

    // Entrada (70% → 80%)
    if (scrollPercent < 70) {
        rightValue = -100;
    } else if (scrollPercent >= 70 && scrollPercent < 80) {
        const t = (scrollPercent - 70) / 10;
        rightValue = -100 + t * 100;
    }
    // Fixa no centro (80% → 90%)
    else if (scrollPercent >= 80 && scrollPercent < 90) {
        rightValue = 0;
    }
    // Saída para fora do ecrã (90% → 100%)
    else if (scrollPercent >= 90 && scrollPercent <= 100) {
        const t = (scrollPercent - 90) / 10;
        rightValue = 0 - t * 100;
    }
    // Após 100% garantir que saiu
    else {
        rightValue = -100;
    }

    divmesa2.style.right = `${rightValue}vw`;
}

window.addEventListener('scroll', applyMesa2Effect);
document.addEventListener('DOMContentLoaded', applyMesa2Effect);


// ---------------- GELATINA COM SCROLL + SALTOS AUTOMÁTICOS ----------------
const chaElements = [
  document.getElementById('cha1'),
  document.getElementById('cha2'),
  document.getElementById('cha3'),
  document.getElementById('cha4')
];

const jellyState = chaElements.map(() => ({
  scaleX: 1,
  scaleY: 1,
  rotation: 0,
  translateY: 0,
  jumpPhase: 0
}));

const jellyConfig = {
  maxDistort: 0.4,
  maxRotation: 5,
  damping: 0.9,
  delays: [0, 100, 200, 500],
  jumpAmplitude: 18,   // ligeiramente mais alto
  jumpSpeed: 0.25      // MUITO mais rápido
};


function updateJellyTransforms() {
  chaElements.forEach((el, i) => {
    if (!el) return;
    const s = jellyState[i];

    // compõe as transformações (ordem importa!)
    el.style.transform = `
      translateY(${s.translateY}px)
      scale(${s.scaleX}, ${s.scaleY})
      rotate(${s.rotation}deg)
    `;
  });
}

// ---- SCROLL EFFECT ----
let lastScrollTop = 0;

function applyJellyScrollEffect() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const delta = scrollTop - lastScrollTop;
  const impact = Math.min(Math.abs(delta) * 0.01, jellyConfig.maxDistort);
  lastScrollTop = scrollTop;

  chaElements.forEach((el, i) => {
    if (!el) return;
    const s = jellyState[i];

    if (delta > 0) {
      s.scaleX = 1 - impact;
      s.scaleY = 1 + impact;
      s.rotation = -jellyConfig.maxRotation;
    } else if (delta < 0) {
      s.scaleX = 1 + impact;
      s.scaleY = 1 - impact;
      s.rotation = jellyConfig.maxRotation;
    }

    setTimeout(updateJellyTransforms, jellyConfig.delays[i]);
  });
}

function animateJump() {
  chaElements.forEach((el, i) => {
    if (!el) return;
    const s = jellyState[i];

    s.jumpPhase += jellyConfig.jumpSpeed;
    s.translateY = Math.sin(s.jumpPhase + i) * jellyConfig.jumpAmplitude;

    // Rotação mais lenta
    s.rotation = Math.sin((s.jumpPhase + i) * 0.5) * 20;

    updateJellyTransforms();
  });

  requestAnimationFrame(animateJump);
}

document.addEventListener('DOMContentLoaded', () => {
  requestAnimationFrame(animateJump);
});


function handleCha5AnimationOnScroll() {
    const cha5base = document.getElementById('cha5base');
    const cha5cima = document.getElementById('cha5cima');
    const relogio = document.getElementById('relogio');
    if (!cha5base || !cha5cima || !relogio) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / scrollHeight) * 100;

    if (scrollPercent >= 85) {
        cha5base.style.animation = 'none';
        cha5cima.style.animation = 'none';
        cha5cima.style.bottom = '20vh';
        relogio.style.bottom = '15vh';
        if (!relogio.classList.contains('subindo')) {
            relogio.classList.add('subindo'); // Adiciona a classe quando sobe
        }
    } else {
        cha5base.style.animation = '';
        cha5cima.style.animation = '';
        cha5cima.style.bottom = '0vh';
        relogio.style.bottom = '0vh';
        if (relogio.classList.contains('subindo')) {
            relogio.classList.remove('subindo'); // Remove a classe quando desce
        }
    }
}

window.addEventListener('scroll', handleCha5AnimationOnScroll);
window.addEventListener('scroll', applyJellyScrollEffect);

document.addEventListener('DOMContentLoaded', handleCha5AnimationOnScroll);

// Adiciona a classe quando começa a subir

// Remove a classe quando terminar de subir
// document.getElementById('relogio').classList.remove('subindo');
