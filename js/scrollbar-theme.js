
//----------------------------------------------------------------------------- Custom Scrollbar Implementation
document.addEventListener('DOMContentLoaded', function () {
    // Criar elementos do scrollbar customizado
    const customScrollbar = document.createElement('div');
    customScrollbar.className = 'custom-scrollbar';

    const scrollbarTrack = document.createElement('div');
    scrollbarTrack.className = 'custom-scrollbar-track';

    const scrollbarThumb = document.createElement('div');
    scrollbarThumb.className = 'custom-scrollbar-thumb';

    // Container para as marcações das cenas
    const sceneMarkers = document.createElement('div');
    sceneMarkers.className = 'scene-markers';

    // Montar estrutura
    scrollbarTrack.appendChild(scrollbarThumb);
    customScrollbar.appendChild(sceneMarkers);
    customScrollbar.appendChild(scrollbarTrack);
    document.body.appendChild(customScrollbar);

    let isDragging = false;
    let startY = 0;
    let startScrollTop = 0;
    let markersCreated = false;

    // Função para criar marcadores das cenas
    function createSceneMarkers() {
        // Limpar marcadores existentes
        sceneMarkers.innerHTML = '';

        const documentHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;

        // Array para armazenar posições das cenas
        const scenePositions = [];

        // Detectar qual capítulo estamos (baseado no title ou URL)
        const pageTitle = document.title;
        // Prioridade: Cap9 sobre Cap1
        const isChapter9 = pageTitle.includes('Chapter 9') || window.location.pathname.includes('cap9.html');
        const isChapter1 = !isChapter9 && (pageTitle.includes('Chapter I') || pageTitle.includes('Chapter 1') || window.location.pathname.includes('index.html'));
        const isChapter2 = pageTitle.includes('Chapter 2') || window.location.pathname.includes('cap2.html');
                const isChapter3 = pageTitle.includes('Chapter 3') || window.location.pathname.includes('cap3.html');
        
        const isChapter4 = pageTitle.includes('Chapter 4') || window.location.pathname.includes('cap4.html');
        const isChapter5 = pageTitle.includes('Chapter 5') || window.location.pathname.includes('cap5.html');
        const isChapter6 = pageTitle.includes('Chapter 6') || window.location.pathname.includes('cap6.html');
        const isChapter7 = pageTitle.includes('Chapter 7') || window.location.pathname.includes('cap7.html');
        const isChapter8 = pageTitle.includes('Chapter 8') || window.location.pathname.includes('cap8.html');
        const isChapter10 = pageTitle.includes('Chapter 10') || window.location.pathname.includes('cap10.html');
        const isChapter11 = pageTitle.includes('Chapter 11') || window.location.pathname.includes('cap11.html');
        const isChapter12 = pageTitle.includes('Chapter 12') || window.location.pathname.includes('cap12.html');


        console.log('Página detectada:', { isChapter1, isChapter2, isChapter4, pageTitle, isChapter5, isChapter6, isChapter7, isChapter8, isChapter9, isChapter10, isChapter11, isChapter12 });

        if (isChapter1) {
            // Lógica específica para Cap1 - usar posições absolutas (alinhamento com bottom da barra)
            const cena1 = document.getElementById('sticky-container');
            const cena2 = document.getElementById('sticky-container-2');
            const cena3 = document.getElementById('sticky-container3');

            console.log('Cap1 - Elementos encontrados:', { cena1, cena2, cena3 });

            if (cena1) {
                // Cap1: Posição absoluta do final da cena1
                const cena1End = cena1.offsetTop + cena1.offsetHeight;
                scenePositions.push({
                    name: 'SC 1',
                    position: cena1End,
                    element: cena1,
                    markerPosition: (cena1End / documentHeight) * clientHeight
                });
            }

            if (cena2) {
                // Cap1: Posição absoluta do final da cena2
                const cena2End = cena2.offsetTop + cena2.offsetHeight;
                scenePositions.push({
                    name: 'SC 2',
                    position: cena2End,
                    element: cena2,
                    markerPosition: (cena2End / documentHeight) * clientHeight
                });
            }

            if (cena3) {
                // Cap1: Cena 3 termina aos 60% da div sticky-container3
                const cena3Mid = cena3.offsetTop + (cena3.offsetHeight * 0.6);
                scenePositions.push({
                    name: 'SC 3',
                    position: cena3Mid,
                    element: cena3,
                    markerPosition: (cena3Mid / documentHeight) * clientHeight
                });

                // Cap1: Cena 4 começa aos 60% da div sticky-container3 e vai até o final
                const cena4End = cena3.offsetTop + cena3.offsetHeight;
                scenePositions.push({
                    name: 'SC 4',
                    position: cena4End,
                    element: cena3,
                    scrollTo: cena3.offsetTop + (cena3.offsetHeight * 0.6),
                    markerPosition: (cena4End / documentHeight) * clientHeight
                });
            }
        } else if (isChapter2) {
            // Lógica específica para Cap2
            const cena1 = document.getElementById('sticky-containers12');
            const cena2 = document.getElementById('sticky-container-2');
            const cena3 = document.getElementById('sticky-container-3');

            console.log('Cap2 - Elementos encontrados:', { cena1, cena2, cena3 });

            if (cena1) {
                const cena1End = cena1.offsetTop + cena1.offsetHeight;
                const cena1ScrollEnd = cena1End - window.innerHeight;
                scenePositions.push({
                    name: 'SC 1',
                    position: Math.max(0, cena1ScrollEnd),
                    element: cena1,
                    markerPosition: (Math.max(0, cena1ScrollEnd) / (documentHeight - clientHeight)) * clientHeight
                });
            }

            if (cena2) {
                const cena2End = cena2.offsetTop + cena2.offsetHeight;
                const cena2ScrollEnd = cena2End - window.innerHeight;
                scenePositions.push({
                    name: 'SC 2',
                    position: Math.max(0, cena2ScrollEnd),
                    element: cena2,
                    markerPosition: (Math.max(0, cena2ScrollEnd) / (documentHeight - clientHeight)) * clientHeight
                });
            }

            if (cena3) {
                const cena3End = cena3.offsetTop + cena3.offsetHeight;
                const cena3ScrollEnd = cena3End - window.innerHeight;
                scenePositions.push({
                    name: 'SC 3',
                    position: Math.max(0, cena3ScrollEnd),
                    element: cena3,
                    markerPosition: (Math.max(0, cena3ScrollEnd) / (documentHeight - clientHeight)) * clientHeight
                });
            }
        } else if (isChapter3) {

            // Lógica específica para Cap3
            const sticky1cap3 = document.getElementById('sticky-container');
            if (sticky1cap3) {
                // Cena 1 termina quando sticky-container acaba
                const cena1End = sticky1cap3.offsetTop + sticky1cap3.offsetHeight;
                scenePositions.push({
                    name: 'SC 1',
                    position: cena1End,
                    element: sticky1cap3,
                    markerPosition: (cena1End / documentHeight) * clientHeight
                });
            }

        } else if (isChapter4) {
            // Lógica específica para Cap4
            const cena1 = document.getElementById('sticky-container');
            const cena2 = document.getElementById('sticky-container2');
            const cena3 = document.getElementById('sticky-container2');

            console.log('Cap4 - Elementos encontrados:', { cena1, cena2, cena3 });

            if (!cena1) console.warn('Elemento sticky-container não encontrado!');
            if (!cena2) console.warn('Elemento sticky-container2 não encontrado!');

            if (cena1) {
                // Cena 1 termina no final do sticky-container
                const cena1End = cena1.offsetTop + cena1.offsetHeight;
                scenePositions.push({
                    name: 'SC 1',
                    position: cena1End,
                    element: cena1,
                    markerPosition: (cena1End / documentHeight) * clientHeight
                });
            }

            if (cena2) {
                // Cena 2 termina quando sticky-container2 chega a 50%
                const cena2Mid = cena2.offsetTop + (cena2.offsetHeight * 0.5);
                scenePositions.push({
                    name: 'SC 2',
                    position: cena2Mid,
                    element: cena2,
                    markerPosition: (cena2Mid / documentHeight) * clientHeight
                });
            }

            if (cena3) {
                // Cena 3 termina no final do sticky-container2
                const cena3End = cena3.offsetTop + cena3.offsetHeight;
                scenePositions.push({
                    name: 'SC 3',
                    position: cena3End,
                    element: cena3,
                    markerPosition: (cena3End / documentHeight) * clientHeight
                });
            }
            // Se nenhum elemento for encontrado, criar marcador genérico para debug
            if (!cena1 && !cena2 && !cena3) {
                scenePositions.push({
                    name: 'Debug',
                    position: 100,
                    element: document.body,
                    markerPosition: 100
                });
            }

        } else if (isChapter5) {
            // Lógica específica para Cap5
            const sectionFolhas = document.getElementById('sectionfolhas');

            if (sectionFolhas) {
                // Cena 1 termina quando sectionfolhas começa
                const cena1End = sectionFolhas.offsetTop;
                scenePositions.push({
                    name: 'SC 1',
                    position: cena1End,
                    element: sectionFolhas,
                    markerPosition: (cena1End / documentHeight) * clientHeight
                });

                // Cena 2 termina quando sectionfolhas acaba
                const cena2End = sectionFolhas.offsetTop + sectionFolhas.offsetHeight;
                scenePositions.push({
                    name: 'SC 2',
                    position: cena2End,
                    element: sectionFolhas,
                    markerPosition: (cena2End / documentHeight) * clientHeight
                });
            }

        } else if (isChapter6) {
            // Lógica específica para Cap4
            const cena1 = document.getElementById('sticky-container');
            const cena2 = document.getElementById('sticky-container2');
            const cena3 = document.getElementById('sticky-container2');


            if (cena1) {
                // Cena 1 termina no final do sticky-container
                const cena1End = cena1.offsetTop + cena1.offsetHeight;
                scenePositions.push({
                    name: 'SC 1',
                    position: cena1End,
                    element: cena1,
                    markerPosition: (cena1End / documentHeight) * clientHeight
                });
            }

            if (cena2) {
                // Cena 2 termina quando sticky-container2 chega a 50%
                const cena2Mid = cena2.offsetTop + (cena2.offsetHeight * 0.5);
                scenePositions.push({
                    name: 'SC 2',
                    position: cena2Mid,
                    element: cena2,
                    markerPosition: (cena2Mid / documentHeight) * clientHeight
                });
            }

            if (cena3) {
                // Cena 3 termina no final do sticky-container2
                const cena3End = cena3.offsetTop + cena3.offsetHeight;
                scenePositions.push({
                    name: 'SC 3',
                    position: cena3End,
                    element: cena3,
                    markerPosition: (cena3End / documentHeight) * clientHeight
                });
            }
            // Se nenhum elemento for encontrado, criar marcador genérico para debug
            if (!cena1 && !cena2 && !cena3) {
                scenePositions.push({
                    name: 'Debug',
                    position: 100,
                    element: document.body,
                    markerPosition: 100
                });
            }

        } else if (isChapter7) {
            const sticky1 = document.getElementById('sticky-container');
            const sticky2 = document.getElementById('sticky-container2');

            if (sticky2) {
                // Cena 1 termina quando começa sticky-container2
                const cena1End = sticky2.offsetTop;
                scenePositions.push({
                    name: 'SC 1',
                    position: cena1End,
                    element: sticky2,
                    markerPosition: (cena1End / documentHeight) * clientHeight
                });

                // Cena 2 termina quando sticky-container2 acaba
                const cena2End = sticky2.offsetTop + sticky2.offsetHeight;
                scenePositions.push({
                    name: 'SC 2',
                    position: cena2End,
                    element: sticky2,
                    markerPosition: (cena2End / documentHeight) * clientHeight
                });
            }
        } else if (isChapter8) {
            // Lógica específica para Cap8
            const rainha1 = document.getElementById('rainha1');
            const sticky1 = document.getElementById('sticky-container');
            const sticky2 = document.getElementById('sticky-container2');
            const sticky3 = document.getElementById('sticky-container3');

            if (rainha1) {
                // Cena 1 termina quando rainha1 recebe bottom 0 (percent >= 0.5 do sticky-container)
                const sticky1 = document.getElementById('sticky-container');
                if (sticky1) {
                    const cena1End = sticky1.offsetTop + (sticky1.offsetHeight * 0.5);
                    scenePositions.push({
                        name: 'SC 1',
                        position: cena1End,
                        element: rainha1,
                        markerPosition: (cena1End / documentHeight) * clientHeight
                    });
                }
            }

            if (sticky1) {
                // Cena 2 termina quando sticky-container acaba
                const cena2End = sticky1.offsetTop + sticky1.offsetHeight;
                scenePositions.push({
                    name: 'SC 2',
                    position: cena2End,
                    element: sticky1,
                    markerPosition: (cena2End / documentHeight) * clientHeight
                });
            }

            if (sticky2) {
                // Cena 3 termina quando sticky-container2 acaba
                const cena3End = sticky2.offsetTop + sticky2.offsetHeight;
                scenePositions.push({
                    name: 'SC 3',
                    position: cena3End,
                    element: sticky2,
                    markerPosition: (cena3End / documentHeight) * clientHeight
                });
            }

            if (sticky3) {
                // Cena 4 termina quando sticky-container3 acaba
                const cena4End = sticky3.offsetTop + sticky3.offsetHeight;
                scenePositions.push({
                    name: 'SC 4',
                    position: cena4End,
                    element: sticky3,
                    markerPosition: (cena4End / documentHeight) * clientHeight
                });
            }

            // Se nenhum elemento for encontrado, criar marcador genérico para debug
            if (!rainha1 && !sticky1 && !sticky2 && !sticky3) {
                scenePositions.push({
                    name: 'Debug',
                    position: 100,
                    element: document.body,
                    markerPosition: 100
                });
            }

        } else if (isChapter9) {
            // Lógica específica para Cap9
            const sticky1cap9 = document.getElementById('sticky-container');
            const sticky3cap9 = document.getElementById('sticky-container3');

            if (sticky1cap9) {
                // Cena 1 termina quando sticky-container acaba
                const cena1End = sticky1cap9.offsetTop + sticky1cap9.offsetHeight;
                scenePositions.push({
                    name: 'SC 1',
                    position: cena1End,
                    element: sticky1cap9,
                    markerPosition: (cena1End / documentHeight) * clientHeight
                });
            }

            if (sticky3cap9) {
                // Cena 2 termina quando sticky-container3 começa
                const cena2End = sticky3cap9.offsetTop;
                scenePositions.push({
                    name: 'SC 2',
                    position: cena2End,
                    element: sticky3cap9,
                    markerPosition: (cena2End / documentHeight) * clientHeight
                });

                // Cena 3 termina quando sticky-container3 acaba
                const cena3End = sticky3cap9.offsetTop + sticky3cap9.offsetHeight;
                scenePositions.push({
                    name: 'SC 3',
                    position: cena3End,
                    element: sticky3cap9,
                    markerPosition: (cena3End / documentHeight) * clientHeight
                });
            }

            // Se nenhum elemento for encontrado, criar marcador genérico para debug
            if (!sticky1cap9 && !sticky3cap9) {
                scenePositions.push({
                    name: 'Debug',
                    position: 100,
                    element: document.body,
                    markerPosition: 100
                });
            }

        } else if (isChapter10) {
            // Lógica específica para Cap10
            const documentHeight = document.documentElement.scrollHeight;
            const clientHeight = document.documentElement.clientHeight;
            // Cena 1 termina aos 40% do scroll
            const cena1End = documentHeight * 0.4;
            scenePositions.push({
                name: 'SC 1',
                position: cena1End,
                element: document.body,
                markerPosition: (cena1End / documentHeight) * clientHeight
            });

            // Cena 2 termina quando sticky-container acaba
            const sticky1cap10 = document.getElementById('sticky-container');
            if (sticky1cap10) {
                const cena2End = sticky1cap10.offsetTop + sticky1cap10.offsetHeight;
                scenePositions.push({
                    name: 'SC 2',
                    position: cena2End,
                    element: sticky1cap10,
                    markerPosition: (cena2End / documentHeight) * clientHeight
                });
            }

         } else if (isChapter11) {
          
            // Lógica específica para Cap11
            const sticky1cap11 = document.getElementById('sticky-container1');
            const sticky2cap11 = document.getElementById('sticky-container2');

            if (sticky1cap11) {
                // Cena 1 termina quando sticky-container1 acaba
                const cena1End = sticky1cap11.offsetTop + sticky1cap11.offsetHeight;
                scenePositions.push({
                    name: 'SC 1',
                    position: cena1End,
                    element: sticky1cap11,
                    markerPosition: (cena1End / documentHeight) * clientHeight
                });
            }

            if (sticky2cap11) {
                // Cena 2 termina aos 50% do scroll da sticky-container2
                const cena2End = sticky2cap11.offsetTop + (sticky2cap11.offsetHeight * 0.5);
                scenePositions.push({
                    name: 'SC 2',
                    position: cena2End,
                    element: sticky2cap11,
                    markerPosition: (cena2End / documentHeight) * clientHeight
                });

                // Cena 3 termina aos 70% do scroll da sticky-container2
                const cena3End = sticky2cap11.offsetTop + (sticky2cap11.offsetHeight * 0.7);
                scenePositions.push({
                    name: 'SC 3',
                    position: cena3End,
                    element: sticky2cap11,
                    markerPosition: (cena3End / documentHeight) * clientHeight
                });

                // Cena 4 termina quando sticky-container2 acaba
                const cena4End = sticky2cap11.offsetTop + sticky2cap11.offsetHeight;
                scenePositions.push({
                    name: 'SC 4',
                    position: cena4End,
                    element: sticky2cap11,
                    markerPosition: (cena4End / documentHeight) * clientHeight
                });
            }
            // Cena 2 termina quando sticky-container acaba
            const sticky1cap10 = document.getElementById('sticky-container');
            if (sticky1cap10) {
                const cena2End = sticky1cap10.offsetTop + sticky1cap10.offsetHeight;
                scenePositions.push({
                    name: 'SC 2',
                    position: cena2End,
                    element: sticky1cap10,
                    markerPosition: (cena2End / documentHeight) * clientHeight
                });
            }
        } else if (isChapter12) {
            // Lógica específica para Cap12
            const aliceContainer = document.getElementById('alice-container');
            const sticky1cap12 = document.getElementById('sticky-container1');
            const sticky2cap12 = document.getElementById('sticky-container2');
            const sticky3cap12 = document.getElementById('sticky-container3');

            if (aliceContainer) {
                // Cena 1 termina quando alice-container acaba
                const cena1End = aliceContainer.offsetTop + aliceContainer.offsetHeight;
                scenePositions.push({
                    name: 'SC 1',
                    position: cena1End,
                    element: aliceContainer,
                    markerPosition: (cena1End / documentHeight) * clientHeight
                });
            }

            if (sticky1cap12) {
                // Cena 2 termina quando sticky-container acaba
                const cena2End = sticky1cap12.offsetTop + sticky1cap12.offsetHeight;
                scenePositions.push({
                    name: 'SC 2',
                    position: cena2End,
                    element: sticky1cap12,
                    markerPosition: (cena2End / documentHeight) * clientHeight
                });
            }

            if (sticky2cap12) {
                // Cena 3 termina quando sticky-container2 acaba
                const cena3End = sticky2cap12.offsetTop + sticky2cap12.offsetHeight;
                scenePositions.push({
                    name: 'SC 3',
                    position: cena3End,
                    element: sticky2cap12,
                    markerPosition: (cena3End / documentHeight) * clientHeight
                });
            }

            if (sticky3cap12) {
                // Cena 4 termina quando sticky-container3 acaba
                const cena4End = sticky3cap12.offsetTop + sticky3cap12.offsetHeight;
                scenePositions.push({
                    name: 'SC 4',
                    position: cena4End,
                    element: sticky3cap12,
                    markerPosition: (cena4End / documentHeight) * clientHeight
                });
            }


        }



























        // Calcular altura do thumb para alinhamento preciso
        const scrollRatio = clientHeight / documentHeight;
        const thumbHeight = Math.max(scrollRatio * clientHeight, 30);

        // Criar marcadores para todas as posições encontradas
        scenePositions.forEach((scene) => {
            // Usar markerPosition se existir, senão calcular baseado na position
            let markerPosition = scene.markerPosition !== undefined ?
                scene.markerPosition :
                (scene.position / documentHeight) * clientHeight;

            // ///////////////////////////////////////////////////////////////Ajuste vertical só para capítulo 7
            if (isChapter7) {
                markerPosition = markerPosition + 40;
            }
            // ///////////////////////////////////////////////////////////////Ajuste vertical só para capítulo 8
            if (isChapter8) {
                markerPosition = markerPosition + 40;
            }
              // ///////////////////////////////////////////////////////////////Ajuste vertical só para capítulo 9
            if (isChapter9) {
                markerPosition = markerPosition + 40;
            }
              // ///////////////////////////////////////////////////////////////Ajuste vertical só para capítulo 10
            if (isChapter10) {
                markerPosition = markerPosition + 40;
            }
               // ///////////////////////////////////////////////////////////////Ajuste vertical só para capítulo 11
            if (isChapter11) {
                markerPosition = markerPosition + 40;
            }
                // ///////////////////////////////////////////////////////////////Ajuste vertical só para capítulo 12
            if (isChapter12) {
                markerPosition = markerPosition + 40;
            }
            ////////////////////////////////////////////////////////////////////////////////////////////////////
            // Criar marcador
            const marker = document.createElement('div');
            marker.className = 'scene-marker';
            marker.style.top = markerPosition + 'px';

            // Criar label do marcador
            const markerLabel = document.createElement('div');
            markerLabel.className = 'scene-marker-label';
            markerLabel.textContent = scene.name;

            // Criar linha do marcador
            const markerLine = document.createElement('div');
            markerLine.className = 'scene-marker-line';

            marker.appendChild(markerLabel);
            marker.appendChild(markerLine);
            sceneMarkers.appendChild(marker);

           
        });
    }

    function updateScrollbar() {
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Calcular proporção e posição do thumb
        const scrollRatio = clientHeight / scrollHeight;
        const thumbHeight = Math.max(scrollRatio * clientHeight, 30);
        const thumbTop = (scrollTop / scrollHeight) * clientHeight;

        // Aplicar estilos
        scrollbarThumb.style.height = thumbHeight + 'px';
        scrollbarThumb.style.top = thumbTop + 'px';

        // Mostrar/esconder scrollbar se necessário
        if (scrollHeight <= clientHeight) {
            customScrollbar.style.display = 'none';
        } else {
            customScrollbar.style.display = 'block';
        }

        // Criar marcadores das cenas apenas uma vez após o carregamento
        if (!markersCreated && scrollHeight > clientHeight) {
            createSceneMarkers();
            markersCreated = true;
        }
    }

    // Event listeners
    window.addEventListener('scroll', updateScrollbar);
    window.addEventListener('resize', function () {
        markersCreated = false; // Reset para recriar marcadores no resize
        updateScrollbar();
    });

    // Drag functionality
    scrollbarThumb.addEventListener('mousedown', function (e) {
        isDragging = true;
        startY = e.clientY;
        startScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        document.body.style.userSelect = 'none';
        e.preventDefault();
    });

    document.addEventListener('mousemove', function (e) {
        if (!isDragging) return;

        const deltaY = e.clientY - startY;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        const scrollRatio = (scrollHeight - clientHeight) / clientHeight;

        const newScrollTop = startScrollTop + (deltaY * scrollRatio);
        window.scrollTo(0, Math.max(0, Math.min(newScrollTop, scrollHeight - clientHeight)));
    });

    document.addEventListener('mouseup', function () {
        if (isDragging) {
            isDragging = false;
            document.body.style.userSelect = '';
        }
    });

    // Track click functionality
    scrollbarTrack.addEventListener('click', function (e) {
        if (e.target === scrollbarThumb) return;

        const rect = scrollbarTrack.getBoundingClientRect();
        const clickY = e.clientY - rect.top;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;

        const targetScrollTop = (clickY / clientHeight) * scrollHeight;
        window.scrollTo({
            top: targetScrollTop,
            behavior: 'smooth'
        });
    });

    // Inicializar
    updateScrollbar();

    // Timeout para garantir que os marcadores sejam criados após carregamento completo
    setTimeout(() => {
        markersCreated = false;
        updateScrollbar();
    }, 1000);
});