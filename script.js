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
                            element.style.boxShadow = `0 0 ${glow}px rgba(76, 175, 80, 0.5)`;
                        },
                        onComplete: function() {
                            element.style.boxShadow = '0 0 10px rgba(76, 175, 80, 0.3)';
                        }
                    });
                }
            }
        });
    };
    
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();
    
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
    
    // Smooth scroll para enlaces internos
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
    
    // Animación de tarjetas de proyecto
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                scale: 1.02,
                duration: 0.3,
                ease: 'power2.out',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)'
            });
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
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            if (!name || !email || !message) {
                alert('Por favor, completa todos los campos.');
                return;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Por favor, ingresa un email válido.');
                return;
            }
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Enviando...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                alert('¡Mensaje enviado con éxito! Te contactaré pronto.');
                contactForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                gsap.fromTo(submitBtn, 
                    { scale: 1 }, 
                    { scale: 1.1, duration: 0.2, yoyo: true, repeat: 1 }
                );
            }, 1500);
        });
    }
    
    // Efecto de escritura para el título
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname === '')) {
        const originalText = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < originalText.length) {
                heroTitle.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        };
        
        setTimeout(typeWriter, 1000);
    }
}

// Inicializar cuando se carga la página
window.addEventListener('load', function() {
    const loader = document.getElementById('loader');
    if (loader && loader.style.display === 'none') {
        initPortfolioAnimations();
    }
});

// Manejar cambios de página
document.addEventListener('DOMContentLoaded', function() {
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
        
        if (linkHref.startsWith('#')) {
            if (window.location.hash === linkHref) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        } 
        else if (linkHref === currentPage || 
                 (currentPage === '' && linkHref === 'index.html') ||
                 (currentPage.includes('index.html') && linkHref === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});
