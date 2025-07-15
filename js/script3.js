document.addEventListener('DOMContentLoaded', function() {
    const backgroundImage = document.getElementById('fundo-img');
    const ratoImg = document.getElementById('cap3rato-img');
    const stickyContainer = document.getElementById('sticky-container');
    const stickySection = document.getElementById('cap3cena1');
    
    // Inicializar altura do container
    backgroundImage.onload = function() {
        const imgHeight = backgroundImage.offsetHeight;
        
        // Definir altura do container sticky baseada na altura da imagem
        stickySection.style.height = imgHeight + 'px';
        
        // Adicionar espaço para scroll (2x a altura da imagem)
        stickyContainer.style.height = (imgHeight ) + 'px';
        
        console.log('Altura da imagem: ' + imgHeight + 'px');
    };
    
    if (backgroundImage.complete) {
        backgroundImage.onload();
    }
    
    // Variáveis para animação do rato
    const baseLeftPosition = 48;
    const amplitude = 2;
    let lastDirection = 'right';
    let animationFrame;
    
    function animateRato() {
        // Calcular o progresso do scroll relativo ao container
        const scrollPosition = window.pageYOffset;
        const containerTop = stickyContainer.offsetTop;
        const containerHeight = stickyContainer.offsetHeight;
        const scrollProgress = (scrollPosition - containerTop) / containerHeight;
        
        // Animar apenas quando a seção estiver visível
        if (scrollProgress >= 0 && scrollProgress <= 1) {
            const oscillations = 10; // Número de oscilações completas durante o scroll
            const offset = Math.sin(scrollProgress * Math.PI * 2 * oscillations) * amplitude;
            
            ratoImg.style.left = (baseLeftPosition + offset) + '%';
            
            // Virar o rato baseado na direção do movimento
            if (offset < 0 && lastDirection !== 'left') {
                ratoImg.style.transform = 'scaleX(-1)';
                lastDirection = 'left';
            } else if (offset >= 0 && lastDirection !== 'right') {
                ratoImg.style.transform = 'scaleX(1)';
                lastDirection = 'right';
            }
        }
        
        animationFrame = requestAnimationFrame(animateRato);
    }
    
    // Iniciar animação
    animationFrame = requestAnimationFrame(animateRato);
    
    // Controlador de scroll - Efeito "sticky" para o fundo
    window.addEventListener('scroll', function() {
        const scrollPosition = window.pageYOffset;
        const containerTop = stickyContainer.offsetTop;
        const containerHeight = stickyContainer.offsetHeight;
        const imgHeight = backgroundImage.offsetHeight;
        
        // Calcular quando chegamos ao fundo da imagem
        if (scrollPosition >= containerTop + imgHeight) {
            // Fixar a imagem na posição quando o scroll ultrapassa o fundo da imagem
            backgroundImage.style.position = 'absolute';
            backgroundImage.style.top = 'auto';
            backgroundImage.style.bottom = '0';
        } else {
            // Comportamento normal (fixo no topo) quando estamos dentro da área da imagem
            backgroundImage.style.position = 'absolute';
            backgroundImage.style.top = '0';
            backgroundImage.style.bottom = 'auto';
        }
    });
    
    // Cleanup
    window.addEventListener('beforeunload', function() {
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }
    });
});




