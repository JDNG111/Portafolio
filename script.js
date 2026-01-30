// Inicializar animaciones del portafolio
function initPortfolioAnimations() {
    // Animación de revelación al hacer scroll
    const reveals = document.querySelectorAll('.reveal');
    
    const revealOnScroll = () => {
        reveals.forEach(element => {
            const windowHeight = window.innerHeight;
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 100;
            
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
                
                // Animar barras de habilidades
                if (element.classList.contains('skill-percentage')) {
                    const width = element.getAttribute('data-width');
                    gsap.to(element, {
                        width: width + '%',
                        duration: 1.5,
                        ease: 'power3.out'
                    });
                }
            }
        });
    };
    
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Ejecutar una vez al cargar
    
    // Animación de navbar al hacer scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
    
    // Animación de botón "Back to Top"
    const backToTopButton = document.querySelector('.back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });
        
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Smooth scroll para enlaces internos en la misma página
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId.startsWith('#!')) return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement && targetId.startsWith('#')) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Cerrar menú móvil si está abierto
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    navbarCollapse.classList.remove('show');
                }
            }
        });
    });
    
    // Animación de tarjetas de proyecto al pasar el mouse
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                scale: 1.02,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
    
    // Animación de iconos de habilidades
    const skillIcons = document.querySelectorAll('.skill-icon');
    skillIcons.forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            gsap.to(icon, {
                y: -10,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        icon.addEventListener('mouseleave', () => {
            gsap.to(icon, {
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
    
    // Formulario de contacto
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validación básica
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            if (!name || !email || !message) {
                alert('Por favor, completa todos los campos.');
                return;
            }
            
            // Aquí normalmente enviarías el formulario a un servidor
            // Por ahora solo mostraremos una alerta
            alert('¡Mensaje enviado con éxito! Te contactaré pronto.');
            contactForm.reset();
            
            // Animación de confirmación
            gsap.fromTo('.btn-custom', 
                { scale: 1 }, 
                { scale: 1.1, duration: 0.2, yoyo: true, repeat: 1 }
            );
        });
    }
    
    // Efecto de escritura para el título del hero (solo en index.html)
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        };
        
        // Iniciar efecto de escritura después de que cargue la página
        setTimeout(typeWriter, 1000);
    }
}

// Asegurar que las animaciones se ejecuten cuando la página esté completamente cargada
window.addEventListener('load', function() {
    // Si el loader ya se ha ocultado, inicializar animaciones
    if (document.getElementById('loader') && document.getElementById('loader').style.display === 'none') {
        initPortfolioAnimations();
    }
});

// Inicializar cuando se cambia de página (para SPA-like behavior)
if (window.history.pushState) {
    const originalPushState = window.history.pushState;
    window.history.pushState = function() {
        originalPushState.apply(this, arguments);
        window.dispatchEvent(new Event('locationchange'));
    };
    
    window.addEventListener('popstate', () => {
        window.dispatchEvent(new Event('locationchange'));
    });
}

// Reiniciar animaciones cuando se cambia de página
window.addEventListener('locationchange', function() {
    setTimeout(initPortfolioAnimations, 100);
});
