document.addEventListener('DOMContentLoaded', () => {
    // Funções de easing para as animações
    function easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }

    function easeInOutElastic(t) {
        const c5 = (2 * Math.PI) / 4.5;
        return t === 0 ? 0 
            : t === 1 ? 1
            : t < 0.5
            ? -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * c5)) / 2
            : (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * c5)) / 2 + 1;
    }

    function calculateCurvedPath(progress, radius) {
        // Calcula posição em um caminho curvo (semicírculo)
        const angle = progress * Math.PI;
        const x = Math.sin(angle) * radius;
        const y = -Math.cos(angle) * radius + radius; // Offset para começar do topo
        return { x, y };
    }

    window.addEventListener('scroll', () => {
        const detalhesImg = document.getElementById('detalhes-img');
        const detalhes2Img = document.getElementById('detalhes2-img'); // Assumindo que você adicionará este elemento
        const coelhoImg = document.getElementById('coelho-img');
        const fraseElement = document.getElementById('frase');
        const stickyContainer = document.getElementById('sticky-container');
        
        // Obter posição e dimensões do container
        const containerRect = stickyContainer.getBoundingClientRect();
        const containerTop = containerRect.top;
        const containerHeight = stickyContainer.offsetHeight;
        const viewportHeight = window.innerHeight;
        
        // Espaço total de scroll
        const scrollableSpace = containerHeight - viewportHeight;
        
        // Calcula a posição relativa do scroll dentro do container
        let scrollProgress = 0;
        
        if (containerTop <= 0 && containerTop > -scrollableSpace) {
            // Container está visível e há espaço para scroll
            scrollProgress = Math.abs(containerTop) / scrollableSpace;
            scrollProgress = Math.min(Math.max(scrollProgress, 0), 1);
            
            // Fases de animação com o novo efeito de caminho curvo
            if (scrollProgress <= 0.4) {
                // Animação para detalhes-img com caminho curvo
                let detalhesProgress = scrollProgress / 0.4; // Normaliza para 0-1
                
                // Calcula o caminho curvo para detalhes-img
                const radius = viewportHeight * 0.4; // Raio do caminho curvo
                const { x, y } = calculateCurvedPath(detalhesProgress, radius);
                
                // Adiciona oscilação ao movimento
                const oscillation = Math.sin(detalhesProgress * Math.PI * 3) * 20;
                
                // Calcula a rotação para acompanhar a direção do movimento
                const tangentAngle = Math.atan2(
                    Math.cos(detalhesProgress * Math.PI) * radius,
                    Math.sin(detalhesProgress * Math.PI) * radius
                ) * (180 / Math.PI);
                
                // Cálculo de escala com efeito elástico
                const baseScale = 0.3;
                const maxScale = 1.0;
                const scaleProgress = easeInOutElastic(detalhesProgress);
                const currentScale = baseScale + (maxScale - baseScale) * scaleProgress;
                
                // Aplica a transformação
                detalhesImg.style.transform = `
                    translate(${x + oscillation}px, ${y}px)
                    rotate(${tangentAngle}deg)
                    scale(${currentScale})
                `;
                
                detalhesImg.style.opacity = easeInOutQuad(detalhesProgress);
                
                // Esconde os outros elementos durante esta fase
                if (detalhes2Img) detalhes2Img.style.opacity = '0';
                coelhoImg.style.bottom = '-50%';
                coelhoImg.style.opacity = '0';
                fraseElement.style.opacity = '0';
            } 
            else if (scrollProgress <= 0.7) {
                // Manter detalhes-img visível
                detalhesImg.style.transform = 'translate(0, 0) rotate(0deg) scale(1)';
                detalhesImg.style.opacity = '1';
                
                // Animação para detalhes2-img (se existir)
                if (detalhes2Img) {
                    let detalhes2Progress = (scrollProgress - 0.4) / 0.3; // Normaliza para 0-1
                    
                    // Calcula o caminho curvo para detalhes2-img, com direção diferente
                    const radius = viewportHeight * 0.3;
                    const { x, y } = calculateCurvedPath(detalhes2Progress, radius);
                    
                    // Adiciona oscilação em direção diferente
                    const oscillation = -Math.sin(detalhes2Progress * Math.PI * 2) * 15;
                    
                    // Calcula a rotação com ângulo diferente
                    const tangentAngle = Math.atan2(
                        Math.cos(detalhes2Progress * Math.PI) * radius,
                        Math.sin(detalhes2Progress * Math.PI) * radius
                    ) * (180 / Math.PI) - 30; // diferente do primeiro
                    
                    // Cálculo de escala
                    const baseScale = 0.2;
                    const maxScale = 0.9;
                    const scaleProgress = easeInOutElastic(detalhes2Progress);
                    const currentScale = baseScale + (maxScale - baseScale) * scaleProgress;
                    
                    // Aplica a transformação
                    detalhes2Img.style.transform = `
                        translate(${-x + oscillation}px, ${y * 0.7}px)
                        rotate(${-tangentAngle}deg)
                        scale(${currentScale})
                    `;
                    
                    detalhes2Img.style.opacity = easeInOutQuad(detalhes2Progress);
                }
                
                // Animação para o coelho
                let coelhoProgress = (scrollProgress - 0.4) / 0.3;
                let bottomPosition = -50 + coelhoProgress * 70;
                coelhoImg.style.bottom = `${bottomPosition}%`;
                coelhoImg.style.opacity = Math.min(coelhoProgress * 1.5, 1).toFixed(2);
                
                fraseElement.style.opacity = '0';
            }
            else if (scrollProgress <= 0.9) {
                // Manter detalhes e coelho visíveis
                detalhesImg.style.transform = 'translate(0, 0) rotate(0deg) scale(1)';
                detalhesImg.style.opacity = '1';
                
                if (detalhes2Img) {
                    detalhes2Img.style.transform = 'translate(0, 0) rotate(0deg) scale(0.9)';
                    detalhes2Img.style.opacity = '1';
                }
                
                coelhoImg.style.bottom = '20%';
                coelhoImg.style.opacity = '1';
                
                // Animação para a frase
                let fraseProgress = (scrollProgress - 0.7) / 0.2;
                fraseElement.style.opacity = fraseProgress.toFixed(2);
                
                // Adicionar efeito de escala à frase
                const fraseScale = 0.8 + (fraseProgress * 0.2);
                fraseElement.style.transform = `scale(${fraseScale})`;
            }
            else {
                // Todos os elementos visíveis e completos
                detalhesImg.style.transform = 'translate(0, 0) rotate(0deg) scale(1)';
                detalhesImg.style.opacity = '1';
                
                if (detalhes2Img) {
                    detalhes2Img.style.transform = 'translate(0, 0) rotate(0deg) scale(0.9)';
                    detalhes2Img.style.opacity = '1';
                }
                
                coelhoImg.style.bottom = '20%';
                coelhoImg.style.opacity = '1';
                fraseElement.style.opacity = '1';
                fraseElement.style.transform = 'scale(1)';
            }
            
        } else if (containerTop <= -scrollableSpace) {
            // Já scrollou além do container
            detalhesImg.style.transform = 'translate(0, 0) rotate(0deg) scale(1)';
            detalhesImg.style.opacity = '1';
            
            if (detalhes2Img) {
                detalhes2Img.style.transform = 'translate(0, 0) rotate(0deg) scale(0.9)';
                detalhes2Img.style.opacity = '1';
            }
            
            coelhoImg.style.bottom = '20%';
            coelhoImg.style.opacity = '1';
            fraseElement.style.opacity = '1';
            fraseElement.style.transform = 'scale(1)';
        } else {
            // Ainda não chegou ao container
            detalhesImg.style.transform = 'translate(-100%, -50%) scale(0.3)';
            detalhesImg.style.opacity = '0';
            
            if (detalhes2Img) {
                detalhes2Img.style.transform = 'translate(100%, -50%) scale(0.2)';
                detalhes2Img.style.opacity = '0';
            }
            
            coelhoImg.style.bottom = '-50%';
            coelhoImg.style.opacity = '0';
            fraseElement.style.opacity = '0';
            fraseElement.style.transform = 'scale(0.8)';
        }

        // -------- CENA 2 - Personagem descendo com o scroll -------- //
        const stickyContainer2 = document.getElementById('sticky-container-2');
        const backgroundImg = document.getElementById('fundo2-img');
        const personagemImg = document.getElementById('personagemc2-img');
        
        // Obter posição e dimensões do container da cena 2
        const container2Rect = stickyContainer2.getBoundingClientRect();
        const container2Top = container2Rect.top;
        const container2Height = stickyContainer2.offsetHeight;
        
        // Espaço total de scroll para cena 2
        const scrollableSpace2 = container2Height - viewportHeight;
        
        if (container2Top <= 0 && container2Top > -scrollableSpace2) {
            // Container da cena 2 está visível e há espaço para scroll
            const scrollProgress2 = Math.abs(container2Top) / scrollableSpace2;
            
            // Fazer a personagem aparecer quando entrar na cena 2
            if (scrollProgress2 > 0.05) { // Pequeno atraso antes de mostrar
                personagemImg.style.opacity = '1';
            } else {
                personagemImg.style.opacity = '0';
            }
            
            // Posição vertical da personagem - vindo de cima para baixo
            // Começar fora da tela (top: -50%) e mover para o centro (top: 50%)
            const topPosition = -50 + (scrollProgress2 * 100);
            
            // Limitamos a posição para que não desça abaixo do centro da tela
            const finalTopPosition = Math.min(topPosition, 50);
            
            // Aplicar a posição
            personagemImg.style.top = `${finalTopPosition}%`;
            personagemImg.style.transform = 'translateX(-50%) translateY(-50%)';
            
            // Para o fundo, queremos que ele pareça estar rolando gradualmente
            // Inicialmente em 0 (topo) e movendo-se para baixo conforme o scroll progride
            const bgProgress = scrollProgress2;
            
            // Movimento vertical do background - começando do topo e movendo apenas o suficiente
            // para mostrar a parte de baixo da imagem no final do scroll
            const maxBgShift = 100 - (100 * (viewportHeight / backgroundImg.offsetHeight));
            const bgShift = bgProgress * maxBgShift;
            
            backgroundImg.style.transform = `translateY(-${bgShift}%)`;
        } else if (container2Top <= -scrollableSpace2) {
            // Já scrollou além do container da cena 2
            personagemImg.style.opacity = '1';
            personagemImg.style.top = '50%'; 
            personagemImg.style.transform = 'translateX(-50%) translateY(-50%)';
            
            // Posição final do background - mostrando a parte de baixo
            const maxBgShift = 100 - (100 * (viewportHeight / backgroundImg.offsetHeight));
            backgroundImg.style.transform = `translateY(-${maxBgShift}%)`;
        } else {
            // Ainda não chegou ao container da cena 2
            personagemImg.style.opacity = '0';
            personagemImg.style.top = '-50%'; // Fora da tela, no topo
            personagemImg.style.transform = 'translateX(-50%) translateY(-50%)';
            backgroundImg.style.transform = 'translateY(0)';
        }
    });
    
    // Dispara o evento de scroll uma vez para configurar a posição inicial
    window.dispatchEvent(new Event('scroll'));
    
    // Função ajustada para definir a altura do container baseada na altura real da imagem
    function ajustarAlturaContainer2() {
        const fundo2Img = document.getElementById('fundo2-img');
        const stickyContainer2 = document.getElementById('sticky-container-2');
        
        // Esperar a imagem carregar para obter a altura real
        if (fundo2Img.complete) {
            ajustarAltura();
        } else {
            fundo2Img.addEventListener('load', ajustarAltura);
        }
        
        function ajustarAltura() {
            // Obter a altura real da imagem
            const alturaImagem = fundo2Img.naturalHeight;
            const larguraImagem = fundo2Img.naturalWidth;
            const larguraTela = window.innerWidth;
            
            // Calcular a altura proporcional da imagem quando ajustada à largura da tela
            const alturaAjustada = (alturaImagem / larguraImagem) * larguraTela;
            
            // Definir altura do container com base na imagem e viewport
            const alturaContainer = (2 * window.innerHeight) + alturaAjustada;
            stickyContainer2.style.height = alturaContainer + 'px';
            
            // Ajustar o estilo do fundo2-img para exibir a imagem completa
            fundo2Img.style.height = alturaAjustada + 'px';
            fundo2Img.style.maxHeight = 'none';
            fundo2Img.style.width = '100%';
            fundo2Img.style.objectFit = 'cover';
            fundo2Img.style.objectPosition = 'top';
            fundo2Img.style.position = 'absolute';
            fundo2Img.style.top = '0';
            fundo2Img.style.left = '0';
            
            // Ajustar o espaço para a animação da cena 2
            document.getElementById('animation-space-2').style.height = '0';
            document.getElementById('extra-space-2').style.height = '0';
        }
    }
    
    // Executar no carregamento e ao redimensionar a janela
    ajustarAlturaContainer2();
    window.addEventListener('resize', ajustarAlturaContainer2);
});