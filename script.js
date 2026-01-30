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
                        ease: 'power3.out',
                        onUpdate: function() {
                            // Efecto de brillo durante la animación
                            const progress = this.progress();
                            const glow = progress * 10;
                            element.style.boxShadow = `0 0 ${glow}px rgba(39, 174, 96, 0.5)`;
                        },
                        onComplete: function() {
                            element.style.boxShadow = '0 0 10px rgba(39, 174, 96, 0.3)';
                        }
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
                ease: 'power2.out',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)'
            });
            
            // Efecto de brillo en el borde
            card.style.borderColor = 'var(--secondary-color)';
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)'
            });
            
            card.style.borderColor = '#e9ecef';
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
            
            const circle = icon.querySelector('.skill-icon-circle');
            if (circle) {
                gsap.to(circle, {
                    scale: 1.1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        });
        
        icon.addEventListener('mouseleave', () => {
            gsap.to(icon, {
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
            
            const circle = icon.querySelector('.skill-icon-circle');
            if (circle) {
                gsap.to(circle, {
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
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
            
            // Validación de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Por favor, ingresa un email válido.');
                return;
            }
            
            // Simular envío
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Enviando...';
            submitBtn.disabled = true;
            
            // Simular delay de envío
            setTimeout(() => {
                // Mostrar mensaje de éxito
                alert('¡Mensaje enviado con éxito! Te contactaré pronto.');
                contactForm.reset();
                
                // Restaurar botón
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Animación de confirmación
                gsap.fromTo(submitBtn, 
                    { scale: 1 }, 
                    { scale: 1.1, duration: 0.2, yoyo: true, repeat: 1 }
                );
            }, 1500);
        });
    }
    
    // Efecto de escritura para el título del hero (solo en index.html)
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname === '')) {
        const originalText = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < originalText.length) {
                heroTitle.textContent += originalText.charAt(i);
                i++;
                
                // Efecto de sonido de teclado (opcional)
                if (i % 3 === 0) {
                    // Aquí podrías agregar un sonido de teclado si quieres
                }
                
                setTimeout(typeWriter, 50);
            }
        };
        
        // Iniciar efecto de escritura después de que cargue la página
        setTimeout(typeWriter, 1000);
    }
    
    // Efecto de parpadeo en el cursor (opcional)
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
        }
        
        .typing-cursor {
            display: inline-block;
            width: 3px;
            background-color: var(--secondary-color);
            margin-left: 2px;
            animation: blink 1s infinite;
            vertical-align: baseline;
            height: 1.2em;
        }
    `;
    document.head.appendChild(style);
    
    // Añadir cursor parpadeante al título si estamos en la página de inicio
    if (heroTitle && (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname === '')) {
        const cursor = document.createElement('span');
        cursor.className = 'typing-cursor';
        heroTitle.appendChild(cursor);
        
        // Remover cursor cuando termine la animación
        setTimeout(() => {
            cursor.remove();
        }, originalText.length * 50 + 1000);
    }
}

// Asegurar que las animaciones se ejecuten cuando la página esté completamente cargada
window.addEventListener('load', function() {
    // Si el loader ya se ha ocultado, inicializar animaciones
    const loader = document.getElementById('loader');
    if (loader && loader.style.display === 'none') {
        initPortfolioAnimations();
    }
});

// Manejar cambios de página
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar animaciones cuando se carga la página
    setTimeout(() => {
        if (typeof initPortfolioAnimations === 'function') {
            initPortfolioAnimations();
        }
    }, 100);
    
    // Manejar enlaces activos en el navbar
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        
        // Para enlaces internos en la misma página
        if (linkHref.startsWith('#')) {
            if (window.location.hash === linkHref) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        } 
        // Para enlaces a otras páginas
        else if (linkHref === currentPage || 
                 (currentPage === '' && linkHref === 'index.html') ||
                 (currentPage.includes('index.html') && linkHref === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});

// Mejorar experiencia en móviles
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
    
    // Añadir padding al bottom para evitar que el contenido quede detrás del navbar en iOS
    const setSafeArea = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    window.addEventListener('resize', setSafeArea);
    setSafeArea();
}
