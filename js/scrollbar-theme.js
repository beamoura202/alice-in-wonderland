
//----------------------------------------------------------------------------- Custom Scrollbar Implementation
document.addEventListener('DOMContentLoaded', function() {
    // Criar elementos do scrollbar customizado
    const customScrollbar = document.createElement('div');
    customScrollbar.className = 'custom-scrollbar';
    
    const scrollbarTrack = document.createElement('div');
    scrollbarTrack.className = 'custom-scrollbar-track';
    
    const scrollbarThumb = document.createElement('div');
    scrollbarThumb.className = 'custom-scrollbar-thumb';
    
    // Montar estrutura
    scrollbarTrack.appendChild(scrollbarThumb);
    customScrollbar.appendChild(scrollbarTrack);
    document.body.appendChild(customScrollbar);
    
    let isDragging = false;
    let startY = 0;
    let startScrollTop = 0;
    
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
    }
    
    // Event listeners
    window.addEventListener('scroll', updateScrollbar);
    window.addEventListener('resize', updateScrollbar);
    
    // Drag functionality
    scrollbarThumb.addEventListener('mousedown', function(e) {
        isDragging = true;
        startY = e.clientY;
        startScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        document.body.style.userSelect = 'none';
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        
        const deltaY = e.clientY - startY;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        const scrollRatio = (scrollHeight - clientHeight) / clientHeight;
        
        const newScrollTop = startScrollTop + (deltaY * scrollRatio);
        window.scrollTo(0, Math.max(0, Math.min(newScrollTop, scrollHeight - clientHeight)));
    });
    
    document.addEventListener('mouseup', function() {
        if (isDragging) {
            isDragging = false;
            document.body.style.userSelect = '';
        }
    });
    
    // Track click functionality
    scrollbarTrack.addEventListener('click', function(e) {
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
});