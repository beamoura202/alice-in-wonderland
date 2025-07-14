document.addEventListener("DOMContentLoaded", function () {
    const scenes = [
        { id: "chapter2", audioId: "audio-intro" },
        { id: "sticky-container", audioId: "audio-cena1" },
        { id: "sticky-container-2", audioId: "audio-cena2" },
        { id: "space", audioId: "audio-cena3" },
    ];

    let currentAudio = null;
    let audioUnlocked = false;

    const observer = new IntersectionObserver((entries) => {
        if (!audioUnlocked) return; // Só executa se já desbloqueou
        entries.forEach(entry => {
            const scene = scenes.find(s => s.id === entry.target.id);
            if (!scene) return;
            
            const audio = document.getElementById(scene.audioId);
            if (!audio) return;

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
        threshold: 0.1, // 10% visível
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
                }).catch(e => {
                    console.log('Erro ao desbloquear áudio:', e);
                });
            }
        });
        audioUnlocked = true;
        console.log('Áudios desbloqueados');
    }

    // Desbloquear áudio no primeiro clique ou toque
    document.addEventListener('click', unlockAllAudios, { once: true });
    document.addEventListener('touchstart', unlockAllAudios, { once: true });
    
    // Backup: tentar desbloquear após um pequeno delay
    setTimeout(() => {
        if (!audioUnlocked) {
            unlockAllAudios();
        }
    }, 1000);

    // Sistema de timing para frases da cena 1
    const audioCena1 = document.getElementById("audio-cena1");
    const frase1 = document.getElementById("cap2cena1frase1");
    const frase2 = document.getElementById("cap2cena1frase2");
    const frase3 = document.getElementById("cap2cena1frase3");

    console.log('Procurando elementos...', {
        audioCena1: audioCena1,
        frase1: frase1,
        frase2: frase2,
        frase3: frase3
    });

    if (audioCena1 && frase1 && frase2 && frase3) {
        console.log('Todos os elementos encontrados! Configurando listeners...');
        
        audioCena1.addEventListener('timeupdate', function() {
            const currentTime = this.currentTime;
            console.log('Tempo atual do áudio:', currentTime);
            
            // Frase 1: aparece de 0s a 2s
            if (currentTime >= 0 && currentTime <= 2) {
                frase1.style.setProperty('opacity', '1', 'important');
                frase1.style.setProperty('visibility', 'visible', 'important');
                console.log('Mostrando frase 1');
            } else {
                frase1.style.setProperty('opacity', '0', 'important');
                frase1.style.setProperty('visibility', 'hidden', 'important');
            }
            
            // Frase 2: aparece de 3.207s a 7.501s
            if (currentTime >= 3.207 && currentTime <= 7.501) {
                frase2.style.setProperty('opacity', '1', 'important');
                frase2.style.setProperty('visibility', 'visible', 'important');
                console.log('Mostrando frase 2');
            } else {
                frase2.style.setProperty('opacity', '0', 'important');
                frase2.style.setProperty('visibility', 'hidden', 'important');
            }
            
            // Frase 3: aparece de 7.559s a 8.815s
            if (currentTime >= 7.559 && currentTime <= 8.815) {
                frase3.style.setProperty('opacity', '1', 'important');
                frase3.style.setProperty('visibility', 'visible', 'important');
                console.log('Mostrando frase 3');
            } else {
                frase3.style.setProperty('opacity', '0', 'important');
                frase3.style.setProperty('visibility', 'hidden', 'important');
            }
        });

        // Reset das frases quando o áudio reinicia
        audioCena1.addEventListener('play', function() {
            console.log('Áudio da cena 1 iniciado - resetando frases');
            frase1.style.setProperty('opacity', '0', 'important');
            frase1.style.setProperty('visibility', 'hidden', 'important');
            frase2.style.setProperty('opacity', '0', 'important');
            frase2.style.setProperty('visibility', 'hidden', 'important');
            frase3.style.setProperty('opacity', '0', 'important');
            frase3.style.setProperty('visibility', 'hidden', 'important');
        });

        // Debug: log quando elementos são encontrados
        console.log('Elementos de frase encontrados:', {
            frase1: !!frase1,
            frase2: !!frase2,
            frase3: !!frase3,
            audioCena1: !!audioCena1
        });
    } else {
        console.log('ERRO: Elementos não encontrados:', {
            frase1: !!frase1,
            frase2: !!frase2,
            frase3: !!frase3,
            audioCena1: !!audioCena1
        });
    }

    console.log('Audio script para cap2 carregado com sistema de timing');
    
    // Sistema de timing para frases da cena 3
    const audioCena3 = document.getElementById("audio-cena3");
    const frase3_1 = document.getElementById("cap2cena3frase1");
    const frase3_2 = document.getElementById("cap2cena3frase2");
    const frase3_3 = document.getElementById("cap2cena3frase3");

    if (audioCena3 && frase3_1 && frase3_2 && frase3_3) {
        console.log('Configurando sistema de timing para cena 3...');
        
        audioCena3.addEventListener('timeupdate', function() {
            const currentTime = this.currentTime;
            console.log('Tempo atual cena 3:', currentTime);
            
            // Frase 1: aparece aos 20.036s e sai aos 22.224s
            if (currentTime >= 20.036 && currentTime <= 22.224) {
                frase3_1.style.setProperty('opacity', '1', 'important');
                frase3_1.style.setProperty('visibility', 'visible', 'important');
                console.log('Mostrando frase 3-1 aos', currentTime);
            } else {
                frase3_1.style.setProperty('opacity', '0', 'important');
                frase3_1.style.setProperty('visibility', 'hidden', 'important');
            }
            
            // Frase 2: aparece aos 22.5s e sai aos 26.878s (corrigido timing)
            if (currentTime >= 22.5 && currentTime <= 26.878) {
                frase3_2.style.setProperty('opacity', '1', 'important');
                frase3_2.style.setProperty('visibility', 'visible', 'important');
                console.log('Mostrando frase 3-2 aos', currentTime);
            } else {
                frase3_2.style.setProperty('opacity', '0', 'important');
                frase3_2.style.setProperty('visibility', 'hidden', 'important');
                if (currentTime >= 22.5 && currentTime <= 27.5) {
                    console.log('Frase 3-2 deveria aparecer agora (tempo:', currentTime, ')');
                }
            }
            
            // Frase 3: aparece aos 27.421s e sai aos 33.098s
            if (currentTime >= 27.421 && currentTime <= 33.098) {
                frase3_3.style.setProperty('opacity', '1', 'important');
                frase3_3.style.setProperty('visibility', 'visible', 'important');
                console.log('Mostrando frase 3-3 aos', currentTime);
            } else {
                frase3_3.style.setProperty('opacity', '0', 'important');
                frase3_3.style.setProperty('visibility', 'hidden', 'important');
            }
        });

        // Reset das frases quando o áudio da cena 3 reinicia
        audioCena3.addEventListener('play', function() {
            console.log('Áudio da cena 3 iniciado - resetando frases');
            frase3_1.style.setProperty('opacity', '0', 'important');
            frase3_1.style.setProperty('visibility', 'hidden', 'important');
            frase3_2.style.setProperty('opacity', '0', 'important');
            frase3_2.style.setProperty('visibility', 'hidden', 'important');
            frase3_3.style.setProperty('opacity', '0', 'important');
            frase3_3.style.setProperty('visibility', 'hidden', 'important');
        });

        console.log('Sistema de timing da cena 3 configurado');
    } else {
        console.log('ERRO: Elementos da cena 3 não encontrados:', {
            frase3_1: !!frase3_1,
            frase3_2: !!frase3_2,
            frase3_3: !!frase3_3,
            audioCena3: !!audioCena3
        });
    }
    
    // Teste manual para verificar se as frases funcionam
    setTimeout(() => {
        const testeFrase1 = document.getElementById("cap2cena1frase1");
        if (testeFrase1) {
            console.log('Teste: Mostrando frase 1 por 3 segundos');
            testeFrase1.style.setProperty('opacity', '1', 'important');
            testeFrase1.style.setProperty('visibility', 'visible', 'important');
            
            setTimeout(() => {
                testeFrase1.style.setProperty('opacity', '0', 'important');
                testeFrase1.style.setProperty('visibility', 'hidden', 'important');
                console.log('Teste: Ocultando frase 1');
            }, 3000);
        }
    }, 2000);

    // Teste específico para frase 2 da cena 3
    setTimeout(() => {
        const testeFrase3_2 = document.getElementById("cap2cena3frase2");
        if (testeFrase3_2) {
            console.log('Teste cena 3: Mostrando frase 2 por 5 segundos');
            testeFrase3_2.style.setProperty('opacity', '1', 'important');
            testeFrase3_2.style.setProperty('visibility', 'visible', 'important');
            
            setTimeout(() => {
                testeFrase3_2.style.setProperty('opacity', '0', 'important');
                testeFrase3_2.style.setProperty('visibility', 'hidden', 'important');
                console.log('Teste cena 3: Ocultando frase 2');
            }, 5000);
        } else {
            console.log('ERRO: Frase 2 da cena 3 não encontrada no teste!');
        }
    }, 6000);
});
