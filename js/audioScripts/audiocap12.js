document.addEventListener("DOMContentLoaded", function () {
    const scenes = [
        { id: "chapter12", audioId: "intro-audio" },
        { id: "sticky-container2", audioId: "cena3-audio" },
        { id: "sticky-container3", audioId: "cena4-audio" },
    ];

    let audioUnlocked = false;
    let aliceAudioStarted = false;
    let rainhaAudioStarted = false;

    // ===== SISTEMA DE CONTROLE CENTRALIZADO =====
    const audioController = {
        currentAudio: null,
        currentScene: null,
        isTransitioning: false,
        sceneStates: {
            cena4: {
                isActive: false,
                isFinalized: false,
                controlledBy: null
            }
        },

        // Método seguro para mudança de cena
        transitionTo(sceneId, audioElement, controller = 'observer') {
            if (this.isTransitioning) {
                console.log('🔒 Transição em andamento, ignorando:', sceneId, 'por', controller);
                return false;
            }

            this.isTransitioning = true;

            try {
                // VERIFICAÇÃO GLOBAL: Se cena4 está ativa, só permitir controladores autorizados
                if (this.sceneStates.cena4.isActive && sceneId !== 'cena4' &&
                    controller !== 'scroll-reverse' && controller !== 'scroll-down') {
                    console.log('🚫 Cena4 ativa - bloqueando transição para:', sceneId, 'por', controller);
                    return false;
                }

                // Verificações específicas para cena4
                if (sceneId === 'cena4') {
                    if (this.sceneStates.cena4.isFinalized) {
                        console.log('❌ Cena4 já finalizada, ignorando tentativa de', controller);
                        return false;
                    }

                    if (this.sceneStates.cena4.controlledBy &&
                        this.sceneStates.cena4.controlledBy !== controller) {
                        console.log('⚠️ Cena4 já controlada por:', this.sceneStates.cena4.controlledBy, '- ignorando', controller);
                        return false;
                    }
                }

                // Para áudio anterior se diferente
                if (this.currentAudio && this.currentAudio !== audioElement) {
                    console.log('⏸️ Parando áudio anterior:', this.currentAudio.id);
                    this.currentAudio.pause();
                    this.currentAudio.currentTime = 0;
                }

                // Se é scroll-reverse ou scroll-down, desativar cena4
                if ((controller === 'scroll-reverse' || controller === 'scroll-down') &&
                    this.sceneStates.cena4.isActive && sceneId !== 'cena4') {
                    console.log('⬇️⬆️ Scroll detectado - desativando cena4');
                    this.sceneStates.cena4.isActive = false;
                    this.sceneStates.cena4.controlledBy = null;
                }

                // Inicia novo áudio
                this.currentAudio = audioElement;
                this.currentScene = sceneId;

                // Atualiza estado específico da cena4
                if (sceneId === 'cena4') {
                    this.sceneStates.cena4.isActive = true;
                    this.sceneStates.cena4.controlledBy = controller;
                }

                console.log('▶️ Iniciando áudio:', audioElement.id, 'para cena:', sceneId, 'controlado por:', controller);

                audioElement.play().catch(e => {
                    console.error('❌ Erro ao reproduzir áudio:', e);
                    this.handleAudioError(sceneId, e);
                });

                return true;

            } catch (error) {
                console.error('❌ Erro na transição:', error);
                this.handleAudioError(sceneId, error);
                return false;
            } finally {
                this.isTransitioning = false;
            }
        },

        // Tratamento de erros
        handleAudioError(sceneId, error) {
            console.error('🚨 Erro de áudio na cena:', sceneId, error);

            // Reset do estado em caso de erro
            if (sceneId === 'cena4') {
                this.sceneStates.cena4.isActive = false;
                this.sceneStates.cena4.controlledBy = null;
            }

            // Estratégia de recuperação básica
            setTimeout(() => {
                if (this.currentAudio && this.currentAudio.paused) {
                    console.log('🔄 Tentando recuperar áudio após erro...');
                    this.currentAudio.play().catch(() => {
                        console.log('⚠️ Recuperação falhou - aguardando interação do usuário');
                    });
                }
            }, 1000);
        },

        // Reset de emergência
        emergencyReset() {
            console.log('🆘 Reset de emergência do sistema de áudio');
            this.isTransitioning = false;
            if (this.currentAudio) {
                this.currentAudio.pause();
                this.currentAudio.currentTime = 0;
            }
            this.currentAudio = null;
            this.currentScene = null;
            this.sceneStates.cena4 = {
                isActive: false,
                isFinalized: false,
                controlledBy: null
            };
        }
    };

    // ===== OBSERVER OTIMIZADO =====
    const observer = new IntersectionObserver((entries) => {
        console.log("🔍 Observer executando, audioUnlocked:", audioUnlocked);
        if (!audioUnlocked) return;

        entries.forEach(entry => {
            console.log("🔍 Observer detectou:", entry.target.id, "isIntersecting:", entry.isIntersecting);

            const scene = scenes.find(s => entry.target.id === s.id);
            if (!scene) {
                console.log("❌ Nenhuma cena encontrada para:", entry.target.id);
                return;
            }

            const audio = document.getElementById(scene.audioId);
            if (!audio) {
                console.log("❌ Áudio não encontrado:", scene.audioId);
                return;
            }

            if (entry.isIntersecting) {
                // TRATAMENTO ESPECIAL PARA CENA4
                if (scene.id === "sticky-container3") {
                    const success = audioController.transitionTo('cena4', audio, 'observer');
                    if (!success) {
                        console.log('🚫 Observer: Transição para cena4 bloqueada');
                    }
                    return; // Sai aqui para cena4
                }

                // OUTRAS CENAS - comportamento normal
                if (scene.id === "sticky-container2") {
                    // VERIFICAR SE CENA4 ESTÁ ATIVA ANTES DE PERMITIR CENA3
                    if (audioController.sceneStates.cena4.isActive) {
                        console.log("🚫 Cena4 ativa - bloqueando cena3-audio");
                        return;
                    }
                }

                audioController.transitionTo(scene.id, audio, 'observer');

                // Tratamento especial para cena3 vs cena2
                if (scene.id === "sticky-container2") {
                    const cena2Audio = document.getElementById('cena2-audio');
                    if (cena2Audio === audioController.currentAudio) {
                        console.log("⏹️ Parando cena2-audio porque entrou na cena3");
                        cena2Audio.pause();
                        cena2Audio.currentTime = 0;
                    }
                }

            } else {
                // SAÍDA DA VIEWPORT

                // CENA4 NÃO É PARADA AQUI! Só no fim do body
                if (scene.id === "sticky-container3") {
                    const scrollBottom = window.innerHeight + window.scrollY;
                    const docHeight = document.body.offsetHeight;
                    const isAtEnd = scrollBottom >= docHeight - 2;

                    if (!isAtEnd) {
                        console.log("👋 Saiu da cena4 (não chegou ao fim do body) - desativando estado de cena4");
                        audioController.sceneStates.cena4.isActive = false;
                        audioController.sceneStates.cena4.controlledBy = null;
                    } else {
                        console.log("ℹ️ Saiu da cena4 viewport mas está no fim do body - mantendo ativo");
                    }
                    return;
                }
                // Comportamento especial para cena3 -> cena2
                if (scene.id === "sticky-container2") {
                    // VERIFICAR SE CENA4 ESTÁ ATIVA ANTES DE VOLTAR PARA CENA2
                    if (audioController.sceneStates.cena4.isActive) {
                        console.log("🚫 Cena4 ativa - não voltando para cena2");
                        return;
                    }

                    const rainha = document.getElementById('rainhacena2');
                    if (rainha) {
                        const computedStyle = window.getComputedStyle(rainha);
                        const bottom = parseFloat(computedStyle.bottom || '-100vh');

                        if (bottom > -99 * window.innerHeight / 100) {
                            //NOVA RESTRIÇÃO: rainha deve estar dentro do sticky-container1
                            const stickyContainer1 = document.getElementById('sticky-container1');
                            if (stickyContainer1) {
                                const containerRect = stickyContainer1.getBoundingClientRect();
                                const isInSticky1 = containerRect.top < window.innerHeight && containerRect.bottom > 0;

                                if (!isInSticky1) {
                                    console.log("🚫 Rainha visível mas FORA de sticky-container1 - bloqueando cena2-audio");
                                    return;
                                }
                            }
                            console.log("🔄 Saiu da cena3 mas rainha ainda visível, voltando para cena2-audio");
                            const cena2Audio = document.getElementById('cena2-audio');
                            if (cena2Audio && audioController.currentAudio !== cena2Audio) {
                                audioController.transitionTo('cena2', cena2Audio, 'observer-fallback');
                            }
                            return;
                        }
                    }
                }

                // Comportamento normal - para áudio quando sai da viewport
                if (audio === audioController.currentAudio) {
                    console.log("⏹️ Parando áudio:", scene.audioId, "elemento saiu da viewport:", scene.id);
                    audio.pause();
                    audio.currentTime = 0;
                    audioController.currentAudio = null;
                    audioController.currentScene = null;
                }
            }
        });
    }, {
        threshold: [0, 0.01, 0.1],
        rootMargin: "0px 0px -50% 0px"
    });

    // ===== SISTEMA DE SCROLL BIDIRECIONAL OTIMIZADO =====
    let lastScrollY = window.scrollY;
    let scrollDirection = 'down';

    // Função para detectar qual cena está visível atualmente
    function getCurrentVisibleScene() {
        const viewportHeight = window.innerHeight;
        const scrollTop = window.scrollY;

        // Verificar elementos na ordem de prioridade
        const elements = [
            { id: 'chapter12', scene: 'intro', audio: 'intro-audio' },
            { id: 'alicecena1', scene: 'cena1', audio: 'cena1-audio', checkStyle: 'left' },
            { id: 'rainhacena2', scene: 'cena2', audio: 'cena2-audio', checkStyle: 'bottom' },
            { id: 'sticky-container2', scene: 'cena3', audio: 'cena3-audio' },
            { id: 'sticky-container3', scene: 'cena4', audio: 'cena4-audio' }
        ];

        for (let element of elements) {
            const el = document.getElementById(element.id);
            if (!el) continue;

            if (element.checkStyle === 'left') {
                // Alice - verificar posição left
                const left = parseFloat(el.style.left || '-100vw');
                if (left > -100) {
                    return element;
                }
            } else if (element.checkStyle === 'bottom') {
                // Rainha - verificar posição bottom
                const computedStyle = window.getComputedStyle(el);
                const bottom = parseFloat(computedStyle.bottom || '-100vh');
                if (bottom > -99 * window.innerHeight / 100) {
                    // Verificar se não estamos na cena3 ao mesmo tempo
                    const cena3Container = document.getElementById('sticky-container2');
                    if (cena3Container) {
                        const cena3Rect = cena3Container.getBoundingClientRect();
                        const isInCena3 = cena3Rect.top < viewportHeight && cena3Rect.bottom > 0;
                        if (!isInCena3) {
                            return element;
                        }
                    } else {
                        return element;
                    }
                }
            } else {
                // Elementos normais - verificar getBoundingClientRect
                const rect = el.getBoundingClientRect();
                const isVisible = rect.top < viewportHeight && rect.bottom > 0;

                if (isVisible) {
                    // Para cena4, verificar se não está finalizada
                    if (element.scene === 'cena4' && audioController.sceneStates.cena4.isFinalized) {
                        continue;
                    }
                    return element;
                }
            }
        }

        return null;
    }

    window.addEventListener('scroll', function () {
        // Detectar direção do scroll
        const currentScrollY = window.scrollY;
        const previousDirection = scrollDirection;
        scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
        lastScrollY = currentScrollY;

        const cena4Audio = document.getElementById('cena4-audio');
        if (!cena4Audio) return;

        const scrollBottom = window.innerHeight + window.scrollY;
        const docHeight = document.body.offsetHeight;
        const isAtEnd = scrollBottom >= docHeight - 2;

        // Lógica de finalização da cena4 no fim do documento
        if (isAtEnd && !audioController.sceneStates.cena4.isFinalized) {
            console.log("🏁 Chegou ao fim do body - finalizando cena4");

            audioController.sceneStates.cena4.isFinalized = true;
            audioController.sceneStates.cena4.isActive = false;
            audioController.sceneStates.cena4.controlledBy = null;

            if (cena4Audio === audioController.currentAudio) {
                cena4Audio.pause();
                cena4Audio.currentTime = 0;
                audioController.currentAudio = null;
                audioController.currentScene = null;
                console.log("⏹️ Cena4 finalizada no fim do body");
            }

        } else if (!isAtEnd && audioController.sceneStates.cena4.isFinalized) {
            audioController.sceneStates.cena4.isFinalized = false;
            console.log("🔄 Saiu do fim do body - cena4 pode tocar novamente");
        }

        // ===== SISTEMA DE SCROLL INTELIGENTE =====
        // Só executa se o áudio está desbloqueado e mudou a direção ou não há áudio tocando
        if (!audioUnlocked) return;

        // Detectar a cena atual visível
        const currentScene = getCurrentVisibleScene();

        if (!currentScene) {
            console.log("🔍 Nenhuma cena visível detectada");
            return;
        }

        const targetAudio = document.getElementById(currentScene.audio);
        if (!targetAudio) {
            console.log("❌ Áudio não encontrado:", currentScene.audio);
            return;
        }

        // Verificar se precisa trocar o áudio
        const needsChange = audioController.currentAudio !== targetAudio;
        const directionChanged = previousDirection !== scrollDirection;

        if (needsChange || directionChanged) {
            console.log(`🎵 Cena detectada: ${currentScene.scene} | Direção: ${scrollDirection} | Precisa trocar: ${needsChange}`);

            // Verificações específicas antes de trocar
            let canTransition = true;

            // Se é cena4, verificar se não está finalizada
            if (currentScene.scene === 'cena4' && audioController.sceneStates.cena4.isFinalized) {
                canTransition = false;
                console.log("🚫 Cena4 finalizada - não pode tocar");
            }

            // Se cena4 está ativa e não é para tocar cena4, bloquear
            if (audioController.sceneStates.cena4.isActive && currentScene.scene !== 'cena4') {
                canTransition = false;
                console.log("🚫 Cena4 ativa - bloqueando", currentScene.scene);
            }

            if (canTransition) {
                const controller = scrollDirection === 'up' ? 'scroll-reverse' : 'scroll-down';
                const success = audioController.transitionTo(currentScene.scene, targetAudio, controller);

                if (success) {
                    console.log(`✅ Áudio trocado para ${currentScene.audio} via ${controller}`);
                } else {
                    console.log(`❌ Falha ao trocar para ${currentScene.audio} via ${controller}`);
                }
            }
        }
    });

    // ===== FUNÇÕES DE MOVIMENTO (Alice e Rainha) =====
    function checkAliceMovement() {
        const alice = document.getElementById('alicecena1');
        if (!alice || !audioUnlocked || aliceAudioStarted) return;

        const left = parseFloat(alice.style.left || '-100vw');

        if (left > -100) {
            console.log("🎭 Alice moveu-se para a direita, iniciando cena1-audio");
            const cena1Audio = document.getElementById('cena1-audio');

            if (cena1Audio) {
                audioController.transitionTo('cena1', cena1Audio, 'alice-movement');
                aliceAudioStarted = true;
            }
        }
    }

    function checkRainhaMovement() {
        const rainha = document.getElementById('rainhacena2');
        if (!rainha || !audioUnlocked || rainhaAudioStarted) return;

        const computedStyle = window.getComputedStyle(rainha);
        const bottom = parseFloat(computedStyle.bottom || '-100vh');

        if (bottom > -99 * window.innerHeight / 100) {
            console.log("👑 Rainha começou a subir, iniciando cena2-audio - bottom:", bottom + "px");
            const cena2Audio = document.getElementById('cena2-audio');

            if (cena2Audio) {
                audioController.transitionTo('cena2', cena2Audio, 'rainha-movement');
                rainhaAudioStarted = true;
            }
        }
    }

    function resetAudioFlags() {
        const alice = document.getElementById('alicecena1');
        const rainha = document.getElementById('rainhacena2');

        if (alice) {
            const left = parseFloat(alice.style.left || '-100vw');
            if (left <= -100 && aliceAudioStarted) {
                console.log("🎭 Alice voltou à posição inicial, resetando flag");
                aliceAudioStarted = false;
            }
        }

        if (rainha) {
            const computedStyle = window.getComputedStyle(rainha);
            const bottom = parseFloat(computedStyle.bottom || '-100vh');

            if (bottom <= -99 * window.innerHeight / 100 && rainhaAudioStarted) {
                console.log("👑 Rainha voltou à posição inicial, resetando flag");
                rainhaAudioStarted = false;

                const cena2Audio = document.getElementById('cena2-audio');
                if (cena2Audio === audioController.currentAudio) {
                    console.log("⏹️ Parando cena2-audio porque rainha desceu completamente");
                    cena2Audio.pause();
                    cena2Audio.currentTime = 0;
                    audioController.currentAudio = null;
                    audioController.currentScene = null;
                }
            }
            // Lógica adicional para permitir cena2 tocar novamente
            else if (bottom > -99 * window.innerHeight / 100 && rainhaAudioStarted) {
                const cena2Audio = document.getElementById('cena2-audio');
                const cena3Container = document.getElementById('sticky-container2');

                // VERIFICAR SE NÃO ESTAMOS NA CENA4 ANTES DE PERMITIR CENA2
                if (audioController.sceneStates.cena4.isActive) {
                    console.log("🚫 Cena4 ativa - bloqueando cena2-audio");
                    return;
                }

                if (cena3Container) {
                    const cena3Rect = cena3Container.getBoundingClientRect();
                    const isInCena3 = cena3Rect.top < window.innerHeight && cena3Rect.bottom > 0;

                    if (!isInCena3 && cena2Audio && audioController.currentAudio !== cena2Audio) {
                        const stickyContainer1 = document.getElementById('sticky-container1');
                        if (stickyContainer1) {
                            const containerRect = stickyContainer1.getBoundingClientRect();
                            const isInSticky1 = containerRect.top < window.innerHeight && containerRect.bottom > 0;

                            if (!isInSticky1) {
                                console.log("🚫 Rainha visível mas sticky-container1 fora da viewport - bloqueando cena2-audio fallback");
                                return;
                            }
                        }

                        console.log("🔄 Rainha visível mas não na cena3, permitindo cena2-audio");
                        audioController.transitionTo('cena2', cena2Audio, 'rainha-fallback');
                    }
                }
            }
        }

        // Verificações adicionais para cena3 (NÃO interfere com cena4)
        const cena3Container = document.getElementById('sticky-container2');
        const cena4Container = document.getElementById('sticky-container3');

        if (cena3Container && cena4Container) {
            const cena3Rect = cena3Container.getBoundingClientRect();
            const cena4Rect = cena4Container.getBoundingClientRect();

            const isInCena3 = cena3Rect.top < window.innerHeight && cena3Rect.bottom > 0;
            const isInCena4 = cena4Rect.top < window.innerHeight && cena4Rect.bottom > 0;

            // BLOQUEAR SE CENA4 ESTÁ ATIVA
            if (audioController.sceneStates.cena4.isActive) {
                console.log("🚫 Cena4 ativa - bloqueando verificações de cena3");
                return;
            }

            // Se está na cena3 mas NÃO na cena4 e NÃO é cena4 finalizada
            if (isInCena3 && !isInCena4 && !audioController.sceneStates.cena4.isFinalized) {
                const cena3Audio = document.getElementById('cena3-audio');
                if (cena3Audio && audioController.currentAudio !== cena3Audio) {
                    console.log("🔄 Na cena3 mas não na cena4, permitindo cena3-audio");
                    audioController.transitionTo('cena3', cena3Audio, 'fallback-check');
                }
            }
        }
    }

    // ===== CONFIGURAÇÃO DE OBSERVERS =====
    const aliceObserver = new MutationObserver(() => checkAliceMovement());
    const rainhaObserver = new MutationObserver(() => checkRainhaMovement());

    const alice = document.getElementById('alicecena1');
    const rainha = document.getElementById('rainhacena2');

    if (alice) {
        aliceObserver.observe(alice, {
            attributes: true,
            attributeFilter: ['style']
        });
        console.log("🎭 Observer configurado para movimentos da Alice");
    }

    if (rainha) {
        rainhaObserver.observe(rainha, {
            attributes: true,
            attributeFilter: ['style']
        });
        console.log("👑 Observer configurado para movimentos da Rainha");
    }

    // Polling como backup (intervalo reduzido)
    setInterval(() => {
        if (audioUnlocked) {
            checkAliceMovement();
            checkRainhaMovement();
            resetAudioFlags();
        }
    }, 50);

    // Configurar observers para todos os elementos
    scenes.forEach(scene => {
        const element = document.getElementById(scene.id);
        if (element) {
            observer.observe(element);
            console.log(`Observer configurado para: ${scene.id}`);
        } else {
            console.warn(`Elemento não encontrado: ${scene.id}`);
        }
    });

    // ===== SISTEMA DE DESBLOQUEIO DE ÁUDIO =====
    function unlockAllAudios() {
        console.log("🔓 Tentando desbloquear áudios...");
        const allAudios = ['intro-audio', 'cena1-audio', 'cena2-audio', 'cena3-audio', 'cena4-audio'];

        allAudios.forEach(audioId => {
            const audio = document.getElementById(audioId);
            if (audio) {
                console.log("🎵 Desbloqueando áudio:", audioId);
                audio.play().then(() => {
                    audio.pause();
                    audio.currentTime = 0;
                    console.log("✅ Áudio desbloqueado:", audioId);
                }).catch(e => {
                    console.log('❌ Erro ao desbloquear áudio:', audioId, e);
                });
            }
        });
        audioUnlocked = true;
        console.log('🔓 Todos os áudios desbloqueados, audioUnlocked:', audioUnlocked);
    }

    function enableAudioOnUserInteraction() {
        console.log("👆 Interação do usuário detectada - desbloqueando áudios...");
        unlockAllAudios();

        document.removeEventListener('click', enableAudioOnUserInteraction);
        document.removeEventListener('touchstart', enableAudioOnUserInteraction);
        document.removeEventListener('keydown', enableAudioOnUserInteraction);
        document.removeEventListener('scroll', enableAudioOnUserInteraction);
    }

    document.addEventListener('click', enableAudioOnUserInteraction);
    document.addEventListener('touchstart', enableAudioOnUserInteraction);
    document.addEventListener('keydown', enableAudioOnUserInteraction);
    document.addEventListener('scroll', enableAudioOnUserInteraction);

    if (!audioUnlocked) {
        console.log("🔔 AVISO: Clique ou toque na página para ativar o áudio!");
    }

    console.log('🎬 Audio script carregado com sistema bidirecional otimizado');

    // ===== SISTEMA DE TIMING PARA FRASES (mantido igual) =====

    // audiocena1
    const audioCena1 = document.getElementById('cena1-audio');
    const important = document.getElementById('important');

    if (audioCena1 && important) {
        audioCena1.addEventListener('timeupdate', function () {
            const t = this.currentTime;

            // ➤ Mostra o elemento aos 10s
            if (t >= 20.983 && t < 41.596) {
                important.classList.add('show');
                important.classList.remove('invertido', 'sair-direita');
            }

            // ➤ Sai para a direita aos 40s
            else if (t >= 42) {
                important.classList.add('sair-direita');
            }
        });

        audioCena1.addEventListener('play', function () {
            important.classList.remove('show', 'invertido', 'sair-direita');
        });
    }
    const frase_1 = document.getElementById('c1f1');
    const frase_2 = document.getElementById('c1f2');
    const frase_3 = document.getElementById('c1f3');
    const frase_4 = document.getElementById('c1f4');
    const frase_5 = document.getElementById('c1f5');
    const frase_6 = document.getElementById('c1f6');
    const frase_7 = document.getElementById('c1f7');
    const frase_8 = document.getElementById('c1f8');
    const frase_9 = document.getElementById('c1f9');

    if (audioCena1 && frase_1 && frase_2 && frase_3 && frase_4 && frase_5 && frase_6 && frase_7 && frase_8 && frase_9) {
        audioCena1.addEventListener('timeupdate', function () {
            const t = this.currentTime;
            // Frase 1: 0.815 - 1.472s
            if (t >= 0.815 && t < 1.472) {
                frase_1.style.setProperty('opacity', '1', 'important');
                frase_1.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase_1.style.setProperty('opacity', '0', 'important');
                frase_1.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 2: 7.965 - 10.243s
            if (t >= 7.965 && t < 10.243) {
                frase_2.style.setProperty('opacity', '1', 'important');
                frase_2.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase_2.style.setProperty('opacity', '0', 'important');
                frase_2.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 3: 12.475 - 13.282s
            if (t >= 12.475 && t < 13.282) {
                frase_3.style.setProperty('opacity', '1', 'important');
                frase_3.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase_3.style.setProperty('opacity', '0', 'important');
                frase_3.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 4: 14.340 - 15.448s
            if (t >= 14.340 && t < 15.448) {
                frase_4.style.setProperty('opacity', '1', 'important');
                frase_4.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase_4.style.setProperty('opacity', '0', 'important');
                frase_4.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 5: 17.346 - 18.304s
            if (t >= 17.346 && t < 18.304) {
                frase_5.style.setProperty('opacity', '1', 'important');
                frase_5.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase_5.style.setProperty('opacity', '0', 'important');
                frase_5.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 6: 19.682 - 20.983s
            if (t >= 19.682 && t < 20.983) {
                frase_6.style.setProperty('opacity', '1', 'important');
                frase_6.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase_6.style.setProperty('opacity', '0', 'important');
                frase_6.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 7: 28.398 - 30.922s
            if (t >= 28.398 && t < 30.922) {
                frase_7.style.setProperty('opacity', '1', 'important');
                frase_7.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase_7.style.setProperty('opacity', '0', 'important');
                frase_7.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 8: 31.525 - 33.163s
            if (t >= 31.525 && t < 33.163) {
                frase_8.style.setProperty('opacity', '1', 'important');
                frase_8.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase_8.style.setProperty('opacity', '0', 'important');
                frase_8.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 9: 37.441 - 41.596s
            if (t >= 37.441 && t < 41.596) {
                frase_9.style.setProperty('opacity', '1', 'important');
                frase_9.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase_9.style.setProperty('opacity', '0', 'important');
                frase_9.style.setProperty('visibility', 'hidden', 'important');
            }
        });

        audioCena1.addEventListener('play', function () {
            [frase_1, frase_2, frase_3, frase_4, frase_5, frase_6, frase_7, frase_8, frase_9].forEach(f => {
                f.style.setProperty('opacity', '0', 'important');
                f.style.setProperty('visibility', 'hidden', 'important');
            });
        });
    }

    // audiocena2
    const audioCena5_2 = document.getElementById('cena2-audio');
    const frase1c2 = document.getElementById('c2f1');
    const frase2c2 = document.getElementById('c2f2');
    const frase3c2 = document.getElementById('c2f3');
    const frase4c2 = document.getElementById('c2f4');
    const frase5c2 = document.getElementById('c2f5');
    const frase6c2 = document.getElementById('c2f6');
    const frase7c2 = document.getElementById('c2f7');

    if (audioCena5_2 && frase1c2 && frase2c2 && frase3c2 && frase4c2 && frase5c2 && frase6c2 && frase7c2) {
        audioCena5_2.addEventListener('timeupdate', function () {
            const t = this.currentTime;
            // Frase 1: 0.01 - 2.601s
            if (t >= 0.01 && t < 2.601) {
                frase1c2.style.setProperty('opacity', '1', 'important');
                frase1c2.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase1c2.style.setProperty('opacity', '0', 'important');
                frase1c2.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 2: 7.379 - 8.513s
            if (t >= 7.379 && t < 8.513) {
                frase2c2.style.setProperty('opacity', '1', 'important');
                frase2c2.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase2c2.style.setProperty('opacity', '0', 'important');
                frase2c2.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 3: 9.591 - 12.449s
            if (t >= 9.591 && t < 12.449) {
                frase3c2.style.setProperty('opacity', '1', 'important');
                frase3c2.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase3c2.style.setProperty('opacity', '0', 'important');
                frase3c2.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 4: 13.069 - 14.742s
            if (t >= 13.069 && t < 14.742) {
                frase4c2.style.setProperty('opacity', '1', 'important');
                frase4c2.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase4c2.style.setProperty('opacity', '0', 'important');
                frase4c2.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 5: 16.625 - 17.768s
            if (t >= 16.625 && t < 17.768) {
                frase5c2.style.setProperty('opacity', '1', 'important');
                frase5c2.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase5c2.style.setProperty('opacity', '0', 'important');
                frase5c2.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 6: 20.042 - 20.760s
            if (t >= 20.042 && t < 20.760) {
                frase6c2.style.setProperty('opacity', '1', 'important');
                frase6c2.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase6c2.style.setProperty('opacity', '0', 'important');
                frase6c2.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 7: 22.182 - 23.260s
            if (t >= 22.182 && t < 23.260) {
                frase7c2.style.setProperty('opacity', '1', 'important');
                frase7c2.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase7c2.style.setProperty('opacity', '0', 'important');
                frase7c2.style.setProperty('visibility', 'hidden', 'important');
            }
        });

        audioCena5_2.addEventListener('play', function () {
            [frase1c2, frase2c2, frase3c2, frase4c2, frase5c2, frase6c2, frase7c2].forEach(f => {
                f.style.setProperty('opacity', '0', 'important');
                f.style.setProperty('visibility', 'hidden', 'important');
            });
        });
    }

    // audiocena3
    const audioCena3 = document.getElementById('cena3-audio');
    const frase1c3 = document.getElementById('c3f1');
    const frase2c3 = document.getElementById('c3f2');

    if (audioCena3 && frase1c3 && frase2c3) {
        audioCena3.addEventListener('timeupdate', function () {
            const t = this.currentTime;
            // Frase 1: 0.01 - 1.395s
            if (t >= 0.01 && t < 1.395) {
                frase1c3.style.setProperty('opacity', '1', 'important');
                frase1c3.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase1c3.style.setProperty('opacity', '0', 'important');
                frase1c3.style.setProperty('visibility', 'hidden', 'important');
            }
            // Frase 2: 5.275 - 7.193s
            if (t >= 5.275 && t < 7.193) {
                frase2c3.style.setProperty('opacity', '1', 'important');
                frase2c3.style.setProperty('visibility', 'visible', 'important');
            } else {
                frase2c3.style.setProperty('opacity', '0', 'important');
                frase2c3.style.setProperty('visibility', 'hidden', 'important');
            }
        });

        audioCena3.addEventListener('play', function () {
            [frase1c3, frase2c3].forEach(f => {
                f.style.setProperty('opacity', '0', 'important');
                f.style.setProperty('visibility', 'hidden', 'important');
            });
        });
    }

    // Log de elementos encontrados
    console.log('🎬 Elementos encontrados:', {
        chapter12: !!document.getElementById('chapter12'),
        alicecena1: !!document.getElementById('alicecena1'),
        rainhacena2: !!document.getElementById('rainhacena2'),
        stickyContainer2: !!document.getElementById('sticky-container2'),
        stickyContainer3: !!document.getElementById('sticky-container3'),
        introAudio: !!document.getElementById('intro-audio'),
        cena1Audio: !!document.getElementById('cena1-audio'),
        cena2Audio: !!document.getElementById('cena2-audio'),
        cena3Audio: !!document.getElementById('cena3-audio'),
        cena4Audio: !!document.getElementById('cena4-audio')
    });

});