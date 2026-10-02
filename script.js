document.addEventListener('DOMContentLoaded', () => {
    
    /* =========================================
       LÓGICA DEL ACORDEÓN (Preguntas Frecuentes)
    ========================================= */
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            
            accordionHeaders.forEach(otherHeader => {
                otherHeader.setAttribute('aria-expanded', 'false');
                otherHeader.nextElementSibling.style.maxHeight = null;
                otherHeader.querySelector('.icon-plus').textContent = '+';
            });

            if (!isExpanded) {
                header.setAttribute('aria-expanded', 'true');
                const content = header.nextElementSibling;
                content.style.maxHeight = content.scrollHeight + "px";
                header.querySelector('.icon-plus').textContent = '−';
            }
        });
    });

    /* =========================================
       LÓGICA DEL CARRUSEL HERO
    ========================================= */
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.carousel-button-right');
    const prevButton = document.querySelector('.carousel-button-left');
    const dotsNav = document.querySelector('.carousel-nav');
    const dots = Array.from(dotsNav.children);

    const slideWidth = slides[0].getBoundingClientRect().width;

    // Organizar los slides uno al lado del otro
    const setSlidePosition = (slide, index) => {
        slide.style.left = slideWidth * index + 'px';
    };
    slides.forEach(setSlidePosition);

    // Función para mover el carrusel
    const moveToSlide = (track, currentSlide, targetSlide) => {
        track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
        currentSlide.classList.remove('current-slide');
        targetSlide.classList.add('current-slide');
    };

    // Función para actualizar los puntos
    const updateDots = (currentDot, targetDot) => {
        currentDot.classList.remove('current-indicator');
        targetDot.classList.add('current-indicator');
    };

    // Mover a la derecha (Next)
    const moveToNext = () => {
        const currentSlide = track.querySelector('.current-slide');
        let nextSlide = currentSlide.nextElementSibling;
        const currentDot = dotsNav.querySelector('.current-indicator');
        let nextDot = currentDot.nextElementSibling;

        // Si llegamos al final, volver al primero
        if (!nextSlide) {
            nextSlide = slides[0];
            nextDot = dots[0];
        }

        moveToSlide(track, currentSlide, nextSlide);
        updateDots(currentDot, nextDot);
    };

    // Mover a la izquierda (Prev)
    const moveToPrev = () => {
        const currentSlide = track.querySelector('.current-slide');
        let prevSlide = currentSlide.previousElementSibling;
        const currentDot = dotsNav.querySelector('.current-indicator');
        let prevDot = currentDot.previousElementSibling;

        // Si estamos en el primero, ir al último
        if (!prevSlide) {
            prevSlide = slides[slides.length - 1];
            prevDot = dots[dots.length - 1];
        }

        moveToSlide(track, currentSlide, prevSlide);
        updateDots(currentDot, prevDot);
    };

    // Eventos de los botones laterales
    nextButton.addEventListener('click', () => {
        moveToNext();
        resetAutoPlay(); // Reiniciar el temporizador al hacer click manual
    });

    prevButton.addEventListener('click', () => {
        moveToPrev();
        resetAutoPlay(); // Reiniciar el temporizador al hacer click manual
    });

    // Evento de navegación por puntos
    dotsNav.addEventListener('click', e => {
        const targetDot = e.target.closest('button');
        
        if (!targetDot) return;

        const currentSlide = track.querySelector('.current-slide');
        const currentDot = dotsNav.querySelector('.current-indicator');
        const targetIndex = dots.findIndex(dot => dot === targetDot);
        const targetSlide = slides[targetIndex];

        moveToSlide(track, currentSlide, targetSlide);
        updateDots(currentDot, targetDot);
        resetAutoPlay(); // Reiniciar el temporizador al hacer click manual
    });

    // Cambio Automático (AutoPlay) cada 5 segundos
    let autoPlayInterval = setInterval(moveToNext, 5000);

    const resetAutoPlay = () => {
        clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(moveToNext, 5000);
    };

    // Recalcular posiciones si la ventana cambia de tamaño (Responsividad)
    window.addEventListener('resize', () => {
        const newSlideWidth = slides[0].getBoundingClientRect().width;
        slides.forEach((slide, index) => {
            slide.style.left = newSlideWidth * index + 'px';
        });
        // Ajustar el transform al slide actual
        const currentSlide = track.querySelector('.current-slide');
        track.style.transform = 'translateX(-' + currentSlide.style.left + ')';
    });

});