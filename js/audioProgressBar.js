/**
 * 🎵 Audio Progress Bar Controller - UNIVERSAL
 * Controla a barra de progresso sincronizada com áudio
 * 
 * Funciona automaticamente em TODOS os capítulos:
 * - Detecta todos os elementos <audio> na página
 * - Sincroniza a barra de progresso automaticamente
 * - Para outros áudios quando um novo inicia
 * - Não precisa de configuração específica por capítulo
 * 
 * Compatível com: cap1.html, cap2.html, cap3.html, etc.
 */

class AudioProgressBar {
    constructor() {
        this.progressBar = document.getElementById('barraProgresso');
        this.barraContainer = document.getElementById('barra');
        this.currentAudio = null;
        this.isPlaying = false;
        this.updateInterval = null;
        this.lastLoggedProgress = -1; // Para controlar o debug
        this.audioElements = []; // Array para guardar todos os áudios
        this.isCurrentlyInChapter = false; // Estado atual de chapter
        this.scrollThrottleTimeout = null; // Throttle para scroll
        
        // Debug: verificar elementos
        console.log('🔍 DEBUG: progressBar encontrado:', !!this.progressBar);
        console.log('🔍 DEBUG: barraContainer encontrado:', !!this.barraContainer);
        
        // Bind methods to maintain context
        this.updateProgress = this.updateProgress.bind(this);
        this.onAudioEnd = this.onAudioEnd.bind(this);
        this.onAudioPause = this.onAudioPause.bind(this);
        this.onAudioPlay = this.onAudioPlay.bind(this);
        
        // Verifica se deve ocultar a barra em páginas de chapters
        this.checkIfChapterPage();
        
        // Adiciona listener para detectar mudanças de secção durante scroll
        window.addEventListener('scroll', () => {
            this.handleScrollChange();
        });
        
        // Verificação periódica para garantir que a barra só aparece com áudio tocando
        setInterval(() => {
            this.checkAudioState();
        }, 1000); // Verifica a cada segundo
        
        // Inicializa o sistema de detecção automática
        this.setupAudioDetection();
    }

    /**
     * Verifica se estamos numa secção de chapter onde a barra não deve aparecer
     */
    checkIfChapterPage() {
        const currentPage = window.location.pathname.toLowerCase();
        
        // Verifica se estamos numa secção de chapter numerado (chapter1, chapter2, chapter3, etc.)
        const chapterSections = document.querySelectorAll('section[id^="chapter"]');
        console.log('🔍 Secções chapter encontradas:', chapterSections.length);
        
        let isInChapterSection = false;
        
        chapterSections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const isVisible = rect.top <= window.innerHeight && rect.bottom >= 0;
            console.log(`📐 Secção ${section.id}:`, {
                top: rect.top,
                bottom: rect.bottom,
                windowHeight: window.innerHeight,
                isVisible: isVisible
            });
            if (isVisible) {
                isInChapterSection = true;
                console.log('📖 Secção de chapter visível detectada:', section.id);
            }
        });
        
        console.log('🔍 DEBUG checkIfChapterPage:');
        console.log('  - URL:', currentPage);
        console.log('  - Em secção chapter?', isInChapterSection);
        console.log('  - Resultado final:', isInChapterSection);
        
        if (isInChapterSection) {
            console.log('📖 Secção chapter detectada - barra de progresso desativada');
            if (this.barraContainer) {
                this.barraContainer.style.display = 'none !important';
                this.barraContainer.style.opacity = '0';
            }
            return true;
        }
        
        console.log('✅ Não é secção de chapter - barra de progresso permitida');
        return false;
    }

    /**
     * Lida com mudanças de scroll para detectar se entramos/saímos de secções chapter
     */
    handleScrollChange() {
        // Throttle para não executar muito frequentemente
        if (this.scrollThrottleTimeout) return;
        
        this.scrollThrottleTimeout = setTimeout(() => {
            this.scrollThrottleTimeout = null;
            
            console.log('🔄 Verificando scroll change...');
            
            // Verifica se mudamos o estado de chapter
            const wasInChapter = this.isCurrentlyInChapter;
            const isInChapter = this.checkIfChapterPage();
            
            if (wasInChapter !== isInChapter) {
                console.log('🔄 Mudança de estado chapter detectada:', wasInChapter, '->', isInChapter);
                
                // Se saímos de um chapter e há áudio tocando, mostra a barra
                if (!isInChapter && this.currentAudio && !this.currentAudio.paused) {
                    console.log('🔄 Saiu de chapter com áudio tocando - mostrando barra');
                    this.forceShowProgressBar();
                }
                // Se entramos num chapter, oculta a barra
                else if (isInChapter) {
                    console.log('🔄 Entrou em chapter - ocultando barra');
                    this.hideProgressBar();
                }
            }
            
            this.isCurrentlyInChapter = isInChapter;
        }, 50); // Reduzido para 50ms para ser mais responsivo
    }

    /**
     * Verifica o estado atual dos áudios e oculta a barra se nenhum estiver tocando
     */
    checkAudioState() {
        const hasPlayingAudio = this.currentAudio && !this.currentAudio.paused;
        const isBarVisible = this.barraContainer && 
                            this.barraContainer.style.display !== 'none' && 
                            this.barraContainer.style.opacity !== '0';
        
        // Se a barra está visível mas não há áudio tocando, oculta
        if (isBarVisible && !hasPlayingAudio) {
            console.log('🔍 Verificação periódica: Nenhum áudio tocando - ocultando barra');
            this.hideProgressBar();
        }
    }

    /**
     * Configura a detecção automática de áudios
     */
    setupAudioDetection() {
        // Detecta automaticamente todos os elementos de áudio na página
        const allAudioElements = document.querySelectorAll('audio');
        
        if (allAudioElements.length === 0) {
            console.log('Nenhum elemento de áudio encontrado na página');
            return;
        }
        
        allAudioElements.forEach(audioElement => {
            this.audioElements.push(audioElement);
            
            // Adiciona listeners para detectar quando o áudio começa
            audioElement.addEventListener('play', () => this.onAudioPlay(audioElement));
            audioElement.addEventListener('pause', this.onAudioPause);
            audioElement.addEventListener('ended', this.onAudioEnd);
            
            // Listener adicional para debug
            audioElement.addEventListener('ended', () => {
                console.log('🔚 Evento ENDED disparado para áudio:', audioElement.id || audioElement.src);
                console.log('🔚 currentTime:', audioElement.currentTime);
                console.log('🔚 duration:', audioElement.duration);
            });
            
            const audioId = audioElement.id || audioElement.src.split('/').pop();
            console.log(`Áudio ${audioId} registado para detecção automática`);
        });
        
        console.log(`${this.audioElements.length} áudios registados para detecção automática em todos os capítulos`);
    }

    /**
     * Handler chamado quando qualquer áudio começa a tocar
     */
    onAudioPlay(audioElement) {
        const audioId = audioElement.id || audioElement.src.split('/').pop() || 'áudio desconhecido';
        console.log(`🎵 Áudio detectado: ${audioId}`);
        
        // Para todos os outros áudios
        this.audioElements.forEach(audio => {
            if (audio !== audioElement && !audio.paused) {
                audio.pause();
            }
        });
        
        // Define o áudio atual ANTES de tentar mostrar a barra
        this.currentAudio = audioElement;
        
        // Força mostrar a barra (sem verificar se há áudio tocando)
        this.forceShowProgressBar();
        
        // Inicia a barra de progresso para este áudio
        this.startProgress(audioElement);
    }

    /**
     * Mostra a barra de progresso
     */
    showProgressBar() {
        console.log('🔍 Tentando mostrar barra de progresso...');
        console.log('🔍 barraContainer:', this.barraContainer);
        
        // Verifica se há algum áudio tocando
        const hasPlayingAudio = this.currentAudio && !this.currentAudio.paused;
        console.log('🔍 Áudio tocando?', hasPlayingAudio);
        
        if (!hasPlayingAudio) {
            console.log('❌ Nenhum áudio tocando - barra não será mostrada');
            this.hideProgressBar();
            return;
        }
        
        const isChapter = this.checkIfChapterPage();
        console.log('🔍 isChapterPage:', isChapter);
        
        if (!this.barraContainer) {
            console.error('❌ Elemento #barra não encontrado!');
            return;
        }
        
        if (isChapter) {
            console.log('❌ Página de chapter - barra não será mostrada');
            return;
        }
        
        // Força a visibilidade com múltiplos métodos
        this.barraContainer.style.display = 'block';
        this.barraContainer.style.opacity = '1';
        this.barraContainer.style.visibility = 'visible';
        this.barraContainer.classList.add('show');
        
        console.log('✅ Display:', this.barraContainer.style.display);
        console.log('✅ Opacity:', this.barraContainer.style.opacity);
        console.log('✅ Classes:', this.barraContainer.className);
        
        console.log('🎵 Barra de progresso visível!');
        console.log('🔍 Classes atuais:', this.barraContainer.className);
        console.log('🔍 Estilo opacity:', this.barraContainer.style.opacity);
        console.log('🔍 Estilo display:', this.barraContainer.style.display);
    }

    /**
     * Oculta a barra de progresso
     */
    hideProgressBar() {
        if (this.barraContainer) {
            this.barraContainer.classList.remove('show');
            // Força ocultar com múltiplos métodos
            this.barraContainer.style.display = 'none';
            this.barraContainer.style.opacity = '0';
            this.barraContainer.style.visibility = 'hidden';
            
            console.log('🔇 Barra de progresso oculta');
            console.log('🔇 Display:', this.barraContainer.style.display);
            console.log('🔇 Opacity:', this.barraContainer.style.opacity);
        }
    }

    /**
     * Força mostrar a barra de progresso (sem verificações)
     */
    forceShowProgressBar() {
        console.log('💪 Forçando mostrar barra de progresso...');
        
        if (!this.barraContainer) {
            console.error('❌ Elemento #barra não encontrado!');
            return;
        }
        
        // Verifica apenas se estamos numa secção chapter
        const isChapter = this.checkIfChapterPage();
        if (isChapter) {
            console.log('❌ Página de chapter - barra não será mostrada');
            return;
        }
        
        // Força a visibilidade com múltiplos métodos
        this.barraContainer.style.display = 'block';
        this.barraContainer.style.opacity = '1';
        this.barraContainer.style.visibility = 'visible';
        this.barraContainer.classList.add('show');
        
        console.log('💪 Barra forçada a aparecer!');
        console.log('✅ Display:', this.barraContainer.style.display);
        console.log('✅ Opacity:', this.barraContainer.style.opacity);
    }

    /**
     * Inicia a barra de progresso com um áudio
     * @param {HTMLAudioElement} audio - Elemento de áudio
     */
    startProgress(audio) {
        if (!audio || !this.progressBar) {
            console.error('Áudio ou barra de progresso não encontrados');
            return;
        }

        // Para qualquer progresso anterior (sem ocultar a barra)
        this.resetProgress();

        this.currentAudio = audio;

        // Função para iniciar quando o áudio estiver pronto
        const startWhenReady = () => {
            if (audio.duration && !isNaN(audio.duration)) {
                this.isPlaying = true;
                
                // Define a duração da animação CSS (mantém para compatibilidade)
                const duration = audio.duration;
                this.progressBar.style.setProperty('--audio-duration', `${duration}s`);

                // Reseta a barra
                this.progressBar.style.width = '0%';

                // Adiciona listeners para eventos do áudio
                audio.addEventListener('ended', this.onAudioEnd);
                audio.addEventListener('pause', this.onAudioPause);

                // Usa apenas atualização manual (mais confiável)
                this.startManualUpdate();

                console.log(`Barra de progresso iniciada para áudio de ${duration.toFixed(2)}s`);
            } else {
                console.log('Aguardando áudio carregar...');
                // Aguarda um pouco e tenta novamente
                setTimeout(startWhenReady, 100);
            }
        };

        // Se o áudio já tem duração, inicia imediatamente
        if (audio.duration && !isNaN(audio.duration)) {
            startWhenReady();
        } else {
            // Aguarda o áudio carregar
            audio.addEventListener('loadedmetadata', startWhenReady, { once: true });
            // Força o carregamento se necessário
            audio.load();
        }
    }

    /**
     * Reseta a barra de progresso sem ocultá-la
     */
    resetProgress() {
        if (!this.progressBar) return;

        this.isPlaying = false;

        // Remove a animação CSS
        this.progressBar.classList.remove('playing');
        
        // Reseta a largura
        this.progressBar.style.width = '0%';

        // Remove listeners do áudio anterior
        if (this.currentAudio) {
            this.currentAudio.removeEventListener('ended', this.onAudioEnd);
            this.currentAudio.removeEventListener('pause', this.onAudioPause);
            this.currentAudio = null;
        }

        // Para a atualização manual
        this.stopManualUpdate();

        console.log('Barra de progresso resetada (sem ocultar)');
    }

    /**
     * Para a barra de progresso
     */
    stopProgress() {
        if (!this.progressBar) return;

        this.isPlaying = false;

        // Remove a animação CSS
        this.progressBar.classList.remove('playing');
        
        // Reseta a largura
        this.progressBar.style.width = '0%';

        // Remove listeners do áudio anterior
        if (this.currentAudio) {
            this.currentAudio.removeEventListener('ended', this.onAudioEnd);
            this.currentAudio.removeEventListener('pause', this.onAudioPause);
            this.currentAudio = null;
        }

        // Para a atualização manual
        this.stopManualUpdate();

        // Oculta a barra
        this.hideProgressBar();

        console.log('Barra de progresso parada');
    }

    /**
     * Pausa a barra de progresso
     */
    pauseProgress() {
        if (!this.isPlaying) return;

        this.isPlaying = false;
        this.progressBar.style.animationPlayState = 'paused';
        this.stopManualUpdate();

        console.log('Barra de progresso pausada');
    }

    /**
     * Resume a barra de progresso
     */
    resumeProgress() {
        if (this.isPlaying || !this.currentAudio) return;

        this.isPlaying = true;
        this.progressBar.style.animationPlayState = 'running';
        this.startManualUpdate();

        console.log('Barra de progresso resumida');
    }

    /**
     * Atualiza manualmente o progresso
     */
    updateProgress() {
        if (!this.currentAudio || !this.isPlaying || !this.progressBar) {
            return;
        }

        const currentTime = this.currentAudio.currentTime;
        const duration = this.currentAudio.duration;
        
        // Debug: verificar valores
        if (currentTime === 0 && duration === 0) {
            console.log('Áudio ainda não iniciou...');
            return;
        }
        
        if (duration > 0 && !isNaN(duration)) {
            const progress = (currentTime / duration) * 100;
            this.progressBar.style.width = `${progress}%`;
            
            // Debug a cada 10% de progresso
            if (Math.floor(progress) % 20 === 0 && Math.floor(progress) !== this.lastLoggedProgress) {
                console.log(`Progresso: ${progress.toFixed(1)}% (${currentTime.toFixed(1)}s/${duration.toFixed(1)}s)`);
                this.lastLoggedProgress = Math.floor(progress);
            }
        } else {
            console.log('Duração do áudio inválida:', duration);
        }
    }

    /**
     * Inicia atualização manual
     */
    startManualUpdate() {
        this.stopManualUpdate();
        this.updateInterval = setInterval(this.updateProgress, 100); // Atualiza a cada 100ms
    }

    /**
     * Para atualização manual
     */
    stopManualUpdate() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    /**
     * Handler para quando o áudio termina
     */
    onAudioEnd() {
        console.log('🔚 onAudioEnd chamado!');
        this.stopProgress();
        // Oculta a barra quando o áudio termina
        console.log('🔚 Áudio terminou - ocultando barra');
        this.hideProgressBar();
        
        // Força ocultar com delay para garantir
        setTimeout(() => {
            console.log('🔚 Forçando ocultar barra após delay');
            this.hideProgressBar();
        }, 100);
    }

    /**
     * Handler para quando o áudio é pausado
     */
    onAudioPause() {
        this.pauseProgress();
        // Oculta a barra quando o áudio é pausado
        console.log('⏸️ Áudio pausado - ocultando barra');
        this.hideProgressBar();
    }

    /**
     * Define a largura da barra manualmente (0-100)
     * @param {number} percentage - Percentagem (0-100)
     */
    setProgress(percentage) {
        if (!this.progressBar) return;
        
        const clampedPercentage = Math.max(0, Math.min(100, percentage));
        this.progressBar.style.width = `${clampedPercentage}%`;
    }

    /**
     * Testa a barra com uma animação de 5 segundos
     */
    testProgress() {
        console.log('Testando barra de progresso...');
        
        if (!this.progressBar) {
            console.error('Barra de progresso não encontrada para teste');
            return;
        }

        // Para qualquer progresso atual
        this.stopProgress();

        // Mostra a barra para o teste
        this.showProgressBar();

        // Teste simples: animação suave com JavaScript
        console.log('Iniciando animação de teste...');
        
        let progress = 0;
        const duration = 5000; // 5 segundos
        const updateInterval = 50; // atualiza a cada 50ms
        const increment = (100 / (duration / updateInterval));
        
        const animate = () => {
            progress += increment;
            if (progress <= 100) {
                this.progressBar.style.width = `${progress}%`;
                console.log(`Progresso: ${progress.toFixed(1)}%`);
                setTimeout(animate, updateInterval);
            } else {
                console.log('Animação de teste concluída');
                this.progressBar.style.width = '0%';
                // Oculta a barra após o teste
                setTimeout(() => this.hideProgressBar(), 1000);
            }
        };
        
        animate();
    }
    /**
     * Teste realista que simula um áudio real
     */
    testWithRealAudio() {
        console.log('Testando com áudio real...');
        
        if (this.audioElements.length > 0) {
            // Usa o primeiro áudio disponível
            const audioElement = this.audioElements[0];
            console.log(`Usando áudio: ${audioElement.id}`);
            
            // Para qualquer áudio que esteja a tocar
            this.stopAllAudios();
            audioElement.currentTime = 0;
            
            // Reproduz o áudio (a detecção automática vai cuidar da barra)
            audioElement.play().then(() => {
                console.log('Áudio iniciado com sucesso');
            }).catch(error => {
                console.error('Erro ao reproduzir áudio:', error);
            });
        } else {
            console.error('Nenhum elemento de áudio encontrado na página');
            // Fallback para teste simples
            this.testProgress();
        }
    }

    /**
     * Para todos os áudios
     */
    stopAllAudios() {
        this.audioElements.forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
        this.stopProgress();
    }

    /**
     * Reproduz um áudio específico pelo ID ou índice
     */
    playAudio(audioIdentifier) {
        let audioElement = null;
        
        // Se for um número, usa o índice
        if (typeof audioIdentifier === 'number') {
            audioElement = this.audioElements[audioIdentifier];
        } else {
            // Se for string, procura pelo ID
            audioElement = document.getElementById(audioIdentifier);
        }
        
        if (audioElement) {
            this.stopAllAudios();
            audioElement.play();
            const audioId = audioElement.id || audioElement.src.split('/').pop();
            console.log(`Reproduzindo áudio: ${audioId}`);
        } else {
            console.error(`Áudio não encontrado: ${audioIdentifier}`);
        }
    }

    /**
     * Lista todos os áudios disponíveis
     */
    listAudios() {
        console.log('Áudios disponíveis na página:');
        this.audioElements.forEach((audio, index) => {
            const duration = audio.duration ? `${audio.duration.toFixed(1)}s` : 'não carregado';
            const audioId = audio.id || audio.src.split('/').pop();
            const src = audio.src.split('/').slice(-2).join('/'); // Mostra as últimas 2 partes do caminho
            console.log(`${index + 1}. ${audioId} - ${duration} (${src})`);
        });
        
        if (this.audioElements.length === 0) {
            console.log('Nenhum áudio encontrado nesta página');
        }
    }

    /**
     * Teste de debug - força a barra a aparecer
     */
    forceShowBar() {
        console.log('🔧 TESTE: Forçando barra a aparecer...');
        if (this.barraContainer) {
            this.barraContainer.style.opacity = '1';
            this.barraContainer.classList.add('show');
            console.log('🔧 Barra forçada a aparecer');
        } else {
            console.error('🔧 Elemento #barra não encontrado!');
        }
    }

    /**
     * Teste de debug - força a barra a desaparecer
     */
    forceHideBar() {
        console.log('🔧 TESTE: Forçando barra a desaparecer...');
        if (this.barraContainer) {
            this.barraContainer.style.opacity = '0';
            this.barraContainer.classList.remove('show');
            console.log('🔧 Barra forçada a desaparecer');
        }
    }
}

// Cria instância global da barra de progresso
window.audioProgressBar = new AudioProgressBar();

// Exemplo de uso quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎵 Audio Progress Bar carregado e pronto para usar em TODOS os capítulos!');
    console.log('📡 Sistema de detecção automática ativo - detecta qualquer áudio na página');
    console.log('👁️ Barra aparece automaticamente quando há áudio a tocar');
    
    // Exemplos de uso (funcionam em qualquer capítulo):
    
    // 1. AUTOMÁTICO: Basta reproduzir qualquer áudio
    // - A barra aparece automaticamente quando o áudio inicia
    // - A barra desaparece quando o áudio para/termina
    // - Não aparece em páginas de chapter
    
    // 2. MANUAL: Reproduzir áudio específico
    // window.audioProgressBar.playAudio('audio-cena1'); // Por ID
    // window.audioProgressBar.playAudio(0); // Por índice (primeiro áudio)
    
    // 3. Controlo da visibilidade
    // window.audioProgressBar.showProgressBar(); // Mostrar manualmente
    // window.audioProgressBar.hideProgressBar(); // Ocultar manualmente
    
    // 4. Parar todos os áudios (oculta a barra)
    // window.audioProgressBar.stopAllAudios();
    
    // 5. Listar áudios disponíveis na página atual
    // window.audioProgressBar.listAudios();
    
    // 6. Teste simples da barra (mostra temporariamente)
    // window.audioProgressBar.testProgress();
    
    // FUNCIONAMENTO AUTOMÁTICO:
    // ✅ Detecta todos os elementos <audio> na página
    // ✅ Barra só aparece quando há áudio a tocar
    // ✅ Oculta automaticamente em páginas de chapter
    // ✅ Funciona em cap1.html, cap2.html, cap3.html, etc.
    // ✅ Transições suaves de aparecer/desaparecer
});

// Exporta a classe para uso em módulos (opcional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioProgressBar;
}
