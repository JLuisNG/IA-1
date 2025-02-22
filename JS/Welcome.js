document.addEventListener('DOMContentLoaded', () => {
    // =========== PANTALLA DE CARGA ===========
    const loadingScreen = document.getElementById('loading-screen');
    
    // Mostrar pantalla de carga al inicio
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => loadingScreen.style.display = 'none', 300);
        
        // Animar todos los valores estadísticos inmediatamente después de la carga
        animateStatValues();
        
        // Animar el contador de pacientes inmediatamente
        const counterNumber = document.querySelector('.counter-number');
        if (counterNumber) {
            animateCounter(6467, 2000);
        }
    }, 2000);

    // =========== MENÚ USUARIO ===========
    const userMenuToggle = document.getElementById('user-menu-toggle');
    const userDropdown = document.getElementById('user-dropdown');

    userMenuToggle.addEventListener('click', () => {
        const isVisible = userDropdown.style.display === 'block';
        userDropdown.style.display = isVisible ? 'none' : 'block';
    });

    // Cerrar menú desplegable al hacer clic fuera
    document.addEventListener('click', (event) => {
        if (!userMenuToggle.contains(event.target) && !userDropdown.contains(event.target)) {
            userDropdown.style.display = 'none';
        }
    });

    // Redirigir al hacer clic en Log Out con animación de carga
    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        loadingScreen.style.display = 'flex';
        loadingScreen.style.opacity = '1';
        setTimeout(() => {
            window.location.href = 'Login.html';
        }, 2000);
    });

    // =========== CONTADOR DE PACIENTES ===========
    // Función para animar el contador
    function animateCounter(target, duration) {
        const counterNumber = document.querySelector('.counter-number');
        let start = 0;
        const increment = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const percentage = Math.min(progress / duration, 1);
            
            // Función de easing
            const easing = t => t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1;
            const currentCount = Math.floor(easing(percentage) * target);
            
            counterNumber.textContent = currentCount.toLocaleString();
            
            if (progress < duration) {
                requestAnimationFrame(increment);
            }
        };
        requestAnimationFrame(increment);
    }

    // =========== ANIMACIÓN DE ESTADÍSTICAS ===========
    function animateStatValues() {
        const statValues = document.querySelectorAll('.stat-value');
        
        statValues.forEach(element => {
            const finalValue = parseInt(element.getAttribute('data-value') || element.textContent.replace(/[^0-9.-]/g, ''));
            animateValue(element, 0, finalValue, 2000);
        });
    }
    
    const animateValue = (element, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easing = t => t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1;
            const currentValue = Math.floor(easing(progress) * (end - start) + start);
            
            // Formatear según el tipo de valor
            if (element.textContent.includes('%')) {
                element.textContent = `${currentValue}%`;
            } else if (element.textContent.includes('m')) {
                element.textContent = `${currentValue}m`;
            } else {
                element.textContent = currentValue.toLocaleString();
            }
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };
});


// Agregar esto al final de tu archivo JavaScript

// =========== ANIMACIÓN DEL FOOTER ===========
function animateFooter() {
    // Detectar cuando el footer entre en el viewport
    const footer = document.querySelector('.footer');
    const footerSections = document.querySelectorAll('.footer__section');
    const footerBottom = document.querySelector('.footer__bottom');
    
    if (!footer) return; // Salir si no hay footer
    
    // Función para verificar si un elemento está en el viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) + 100
        );
    }
    
    // Función para animar elementos cuando entran en viewport
    function checkFooterVisibility() {
        if (isInViewport(footer)) {
            // Animar secciones con delay progresivo
            footerSections.forEach((section, index) => {
                section.style.animation = `fadeInUp 0.8s ease-out ${index * 0.2}s forwards`;
                section.style.opacity = '0';
                section.style.transform = 'translateY(30px)';
            });
            
            // Animar la parte inferior
            if (footerBottom) {
                footerBottom.style.animation = `fadeInUp 0.8s ease-out 0.6s forwards`;
                footerBottom.style.opacity = '0';
                footerBottom.style.transform = 'translateY(30px)';
            }
            
            // Eliminar el evento de scroll una vez animado
            window.removeEventListener('scroll', checkFooterVisibility);
        }
    }
    
    // Inicializar con opacidad 0
    footerSections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
    });
    
    if (footerBottom) {
        footerBottom.style.opacity = '0';
        footerBottom.style.transform = 'translateY(30px)';
    }
    
    // Comprobar visibilidad en cada scroll
    window.addEventListener('scroll', checkFooterVisibility);
    
    // Comprobar también al cargar la página
    checkFooterVisibility();
}

// Agregar a las funciones que se ejecutan después de cargar la página
document.addEventListener('DOMContentLoaded', () => {
    // Código existente...
    
    // Añadir animación del footer
    animateFooter();
});