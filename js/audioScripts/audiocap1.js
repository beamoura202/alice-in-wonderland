document.addEventListener("DOMContentLoaded", function () {
    const scenes = [
        { id: "chapter1", audioId: "audio-intro" },
        { id: "cena1", audioId: "audio-cena1" },
        { id: "sticky-container-2", audioId: "audio-cena2" },
        { id: "sticky-container3", audioId: "audio-cena3" },
    ];

    let currentAudio = null;
    let audioUnlocked = false; // NOVO

    // Configuração para frase sincronizada com áudio
    const audioCena1 = document.getElementById("audio-cena1");
    const fraseElement = document.getElementById("frase");

    // Função para controlar a frase baseada no tempo do áudio
    function setupAudioTimedEvents() {
        if (audioCena1 && fraseElement) {
            console.log("Setup de eventos de tempo configurado para audio-cena1 e frase");
            
            audioCena1.addEventListener('timeupdate', function() {
                const currentTime = audioCena1.currentTime;
                
                // Frase aparece aos 4.510s e desaparece aos 6.829s
                if (currentTime >= 4.510 && currentTime <= 6.829) {
                    if (fraseElement.style.opacity !== '1') {
                        console.log(`Mostrando frase aos ${currentTime.toFixed(3)}s`);
                        fraseElement.style.setProperty('opacity', '1', 'important');
                        fraseElement.style.setProperty('visibility', 'visible', 'important');
                    }
                } else {
                    if (fraseElement.style.opacity !== '0') {
                        console.log(`Escondendo frase aos ${currentTime.toFixed(3)}s`);
                        fraseElement.style.setProperty('opacity', '0', 'important');
                        fraseElement.style.setProperty('visibility', 'hidden', 'important');
                    }
                }
            });

            // Reset da frase quando o áudio para ou reseta
            audioCena1.addEventListener('pause', function() {
                console.log("Áudio pausado - escondendo frase");
                if (fraseElement) {
                    fraseElement.style.setProperty('opacity', '0', 'important');
                    fraseElement.style.setProperty('visibility', 'hidden', 'important');
                }
            });

            audioCena1.addEventListener('ended', function() {
                console.log("Áudio terminou - escondendo frase");
                if (fraseElement) {
                    fraseElement.style.setProperty('opacity', '0', 'important');
                    fraseElement.style.setProperty('visibility', 'hidden', 'important');
                }
            });

            // Garantir que a frase esteja escondida inicialmente
            fraseElement.style.setProperty('opacity', '0', 'important');
            fraseElement.style.setProperty('visibility', 'hidden', 'important');
        } else {
            console.error("Não foi possível encontrar audio-cena1 ou frase");
        }
    }

    // Chama a configuração dos eventos de tempo
    setupAudioTimedEvents();

    // Configuração para frases sincronizadas com áudio cena2
    const audioCena2 = document.getElementById("audio-cena2");
    const frasec2Element = document.getElementById("frasec2");
    const frasec22Element = document.getElementById("frasec22");
    const frasec23Element = document.getElementById("frasec23");

    function setupAudioTimedEventsCena2() {
        if (audioCena2 && frasec2Element && frasec22Element && frasec23Element) {
            console.log("Setup de eventos de tempo configurado para audio-cena2 e todas as frases");
            
            audioCena2.addEventListener('timeupdate', function() {
                const currentTime = audioCena2.currentTime;
                
                // Frasec2: aparece aos 6.992s e desaparece aos 10.153s
                if (currentTime >= 6.992 && currentTime <= 10.153) {
                    if (frasec2Element.style.opacity !== '1') {
                        console.log(`Mostrando frasec2 aos ${currentTime.toFixed(3)}s`);
                        frasec2Element.style.setProperty('opacity', '1', 'important');
                        frasec2Element.style.setProperty('visibility', 'visible', 'important');
                    }
                } else {
                    if (frasec2Element.style.opacity !== '0') {
                        console.log(`Escondendo frasec2 aos ${currentTime.toFixed(3)}s`);
                        frasec2Element.style.setProperty('opacity', '0', 'important');
                        frasec2Element.style.setProperty('visibility', 'hidden', 'important');
                    }
                }

                // Frasec22: aparece aos 11.215s e desaparece aos 16.976s
                if (currentTime >= 11.215 && currentTime <= 16.976) {
                    if (frasec22Element.style.opacity !== '1') {
                        console.log(`Mostrando frasec22 aos ${currentTime.toFixed(3)}s`);
                        frasec22Element.style.setProperty('opacity', '1', 'important');
                        frasec22Element.style.setProperty('visibility', 'visible', 'important');
                    }
                } else {
                    if (frasec22Element.style.opacity !== '0') {
                        console.log(`Escondendo frasec22 aos ${currentTime.toFixed(3)}s`);
                        frasec22Element.style.setProperty('opacity', '0', 'important');
                        frasec22Element.style.setProperty('visibility', 'hidden', 'important');
                    }
                }

                // Frasec23: aparece aos 17.323s e desaparece aos 20.637s
                if (currentTime >= 17.323 && currentTime <= 20.637) {
                    if (frasec23Element.style.opacity !== '1') {
                        console.log(`Mostrando frasec23 aos ${currentTime.toFixed(3)}s`);
                        frasec23Element.style.setProperty('opacity', '1', 'important');
                        frasec23Element.style.setProperty('visibility', 'visible', 'important');
                    }
                } else {
                    if (frasec23Element.style.opacity !== '0') {
                        console.log(`Escondendo frasec23 aos ${currentTime.toFixed(3)}s`);
                        frasec23Element.style.setProperty('opacity', '0', 'important');
                        frasec23Element.style.setProperty('visibility', 'hidden', 'important');
                    }
                }
            });

            // Reset de todas as frases quando o áudio para ou reseta
            audioCena2.addEventListener('pause', function() {
                console.log("Áudio cena2 pausado - escondendo todas as frases");
                [frasec2Element, frasec22Element, frasec23Element].forEach(element => {
                    if (element) {
                        element.style.setProperty('opacity', '0', 'important');
                        element.style.setProperty('visibility', 'hidden', 'important');
                    }
                });
            });

            audioCena2.addEventListener('ended', function() {
                console.log("Áudio cena2 terminou - escondendo todas as frases");
                [frasec2Element, frasec22Element, frasec23Element].forEach(element => {
                    if (element) {
                        element.style.setProperty('opacity', '0', 'important');
                        element.style.setProperty('visibility', 'hidden', 'important');
                    }
                });
            });

            // Garantir que todas as frases estejam escondidas inicialmente
            [frasec2Element, frasec22Element, frasec23Element].forEach(element => {
                if (element) {
                    element.style.setProperty('opacity', '0', 'important');
                    element.style.setProperty('visibility', 'hidden', 'important');
                }
            });
        } else {
            console.error("Não foi possível encontrar audio-cena2 ou alguma das frases");
        }
    }

    // Chama a configuração dos eventos de tempo para cena2
    setupAudioTimedEventsCena2();

    // Configuração para frasec3 sincronizada com áudio cena4
    const audioCena4 = document.getElementById("audio-cena4");
    const frasec3Element = document.getElementById("frasec3");

    function setupAudioTimedEventsCena4() {
        if (audioCena4 && frasec3Element) {
            console.log("Setup de eventos de tempo configurado para audio-cena4 e frasec3");
            
            audioCena4.addEventListener('timeupdate', function() {
                const currentTime = audioCena4.currentTime;
                
                // Frasec3: aparece aos 4.271s e desaparece aos 9.490s
                if (currentTime >= 4.271 && currentTime <= 9.490) {
                    if (frasec3Element.style.opacity !== '1') {
                        console.log(`Mostrando frasec3 aos ${currentTime.toFixed(3)}s`);
                        frasec3Element.style.setProperty('opacity', '1', 'important');
                        frasec3Element.style.setProperty('visibility', 'visible', 'important');
                    }
                } else {
                    if (frasec3Element.style.opacity !== '0') {
                        console.log(`Escondendo frasec3 aos ${currentTime.toFixed(3)}s`);
                        frasec3Element.style.setProperty('opacity', '0', 'important');
                        frasec3Element.style.setProperty('visibility', 'hidden', 'important');
                    }
                }
            });

            // Reset da frase quando o áudio para ou reseta
            audioCena4.addEventListener('pause', function() {
                console.log("Áudio cena4 pausado - escondendo frasec3");
                if (frasec3Element) {
                    frasec3Element.style.setProperty('opacity', '0', 'important');
                    frasec3Element.style.setProperty('visibility', 'hidden', 'important');
                }
            });

            audioCena4.addEventListener('ended', function() {
                console.log("Áudio cena4 terminou - escondendo frasec3");
                if (frasec3Element) {
                    frasec3Element.style.setProperty('opacity', '0', 'important');
                    frasec3Element.style.setProperty('visibility', 'hidden', 'important');
                }
            });

            // Garantir que a frase esteja escondida inicialmente
            frasec3Element.style.setProperty('opacity', '0', 'important');
            frasec3Element.style.setProperty('visibility', 'hidden', 'important');
        } else {
            console.error("Não foi possível encontrar audio-cena4 ou frasec3");
        }
    }

    // Chama a configuração dos eventos de tempo para cena4
    setupAudioTimedEventsCena4();

    const observer = new IntersectionObserver((entries) => {
        if (!audioUnlocked) return; // Só executa se já desbloqueou
        entries.forEach(entry => {
            const scene = scenes.find(s => s.id === entry.target.id);
            const audio = document.getElementById(scene.audioId);

            // Ignorar controle automático para cenas 3 e 4 - controladas pela transição do fundo
            if (scene.audioId === 'audio-cena3' || scene.audioId === 'audio-cena4') {
                return;
            }

            if (entry.isIntersecting) {
                if (currentAudio && currentAudio !== audio) {
                    currentAudio.pause();
                    currentAudio.currentTime = 0;
                }

                currentAudio = audio;
                currentAudio.play();
            } else {
                if (audio && !entry.isIntersecting) {
                    audio.pause();
                    audio.currentTime = 0;
                }
            }
        });
    }, {
        threshold: 0.1, // Teste com 10% visível
    });

    scenes.forEach(scene => {
        const el = document.getElementById(scene.id);
        if (el) {
            observer.observe(el);
        }
    });

    // Função para desbloquear todos os áudios
    function unlockAllAudios() {
        scenes.forEach(scene => {
            const audio = document.getElementById(scene.audioId);
            if (audio) {
                audio.play().then(() => {
                    audio.pause();
                    audio.currentTime = 0;
                }).catch(() => {});
            }
        });
    }

    function handleFirstInteraction() {
        unlockAllAudios();
        audioUnlocked = true; // SÓ AGORA libera o play do observer
        document.removeEventListener('click', handleFirstInteraction);
        window.removeEventListener('scroll', handleFirstInteraction);
        // Força o observer a rodar de novo após desbloquear
        observer.takeRecords().forEach(entry => observer.callback([entry]));
    }

    document.addEventListener('click', handleFirstInteraction);
    window.addEventListener('scroll', handleFirstInteraction);
});