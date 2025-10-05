// ================================
// Lazy Loading para imágenes
// ================================
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        if (img.dataset.src) {
            img.src = img.dataset.src;
        }
    });
} else {
    // Fallback para navegadores antiguos
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// ================================
// LIGHTBOX para Galería de Proyectos
// ================================
document.addEventListener('DOMContentLoaded', function() {
    const lightboxOverlay = document.getElementById('lightboxOverlay');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const galleryItems = document.querySelectorAll('[data-lightbox="gallery"]');
    
    if (galleryItems.length > 0) {
        let currentIndex = 0;
        const images = Array.from(galleryItems).map(item => ({
            src: item.querySelector('img').src,
            alt: item.querySelector('img').alt
        }));

        // Abrir lightbox
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                currentIndex = index;
                openLightbox();
            });
        });

        // Cerrar lightbox
        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }

        lightboxOverlay?.addEventListener('click', (e) => {
            if (e.target === lightboxOverlay) {
                closeLightbox();
            }
        });

        // Navegación
        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', (e) => {
                e.stopPropagation();
                currentIndex = (currentIndex - 1 + images.length) % images.length;
                updateLightboxImage();
            });
        }

        if (lightboxNext) {
            lightboxNext.addEventListener('click', (e) => {
                e.stopPropagation();
                currentIndex = (currentIndex + 1) % images.length;
                updateLightboxImage();
            });
        }

        // Teclado
        document.addEventListener('keydown', (e) => {
            if (!lightboxOverlay?.classList.contains('active')) return;
            
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                currentIndex = (currentIndex - 1 + images.length) % images.length;
                updateLightboxImage();
            } else if (e.key === 'ArrowRight') {
                currentIndex = (currentIndex + 1) % images.length;
                updateLightboxImage();
            }
        });

        function openLightbox() {
            if (lightboxOverlay) {
                lightboxOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
                updateLightboxImage();
            }
        }

        function closeLightbox() {
            if (lightboxOverlay) {
                lightboxOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        }

        function updateLightboxImage() {
            if (lightboxImage && images[currentIndex]) {
                lightboxImage.src = images[currentIndex].src;
                lightboxImage.alt = images[currentIndex].alt;
            }
        }
    }

    // ================================
    // Animación de barras de métricas
    // ================================
    const metricBars = document.querySelectorAll('.metric-fill');
    
    if (metricBars.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const width = bar.style.width;
                    bar.style.width = '0';
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 100);
                    observer.unobserve(bar);
                }
            });
        }, { threshold: 0.5 });

        metricBars.forEach(bar => observer.observe(bar));
    }

    // ================================
    // Smooth scroll para timeline y features
    // ================================
    const timelineItems = document.querySelectorAll('.timeline-item');
    const featureCards = document.querySelectorAll('.feature-card');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.2 });

    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'all 0.6s ease';
        revealObserver.observe(item);
    });

    featureCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease';
        revealObserver.observe(card);
    });
});
// ================================
// PORTFOLIO - UNIFIED JAVASCRIPT
// Todo en un solo archivo
// ================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ================================
    // Header Scroll Effect
    // ================================
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');   
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ================================
    // Smooth Scrolling
    // ================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ================================
    // Active Navigation Link on Scroll
    // ================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveNavLink() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink();

    // ================================
    // Scroll Reveal Animation
    // ================================
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-reveal').forEach(element => {
        observer.observe(element);
    });

    // ================================
    // Staggered Animation Delays
    // ================================
    document.querySelectorAll('.projects-grid .project-card').forEach((card, index) => {
        card.style.transitionDelay = `${index * 100}ms`;
    });

    document.querySelectorAll('.skills-grid .skill-card').forEach((card, index) => {
        card.style.transitionDelay = `${index * 150}ms`;
    });

    // ================================
    // Mobile Menu Toggle
    // ================================
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav-links');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
            
            const icon = mobileMenuBtn.querySelector('i');
            if (nav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }

    // ================================
    // PROJECT FILTERS (para todos-proyectos.html)
    // ================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const categoryGroups = document.querySelectorAll('.category-group');

    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // Actualizar botones activos
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Filtrar proyectos
                filterProjects(filter);
            });
        });

        function filterProjects(category) {
            if (category === 'all') {
                categoryGroups.forEach(group => {
                    group.style.display = 'block';
                });
                
                projectCards.forEach((card, index) => {
                    card.classList.remove('hidden');
                    card.style.animation = 'none';
                    setTimeout(() => {
                        card.style.animation = `fadeInUp 0.6s ease ${index * 0.1}s forwards`;
                    }, 10);
                });
            } else {
                categoryGroups.forEach(group => {
                    const groupCategory = getCategoryFromGroup(group);
                    if (groupCategory === category) {
                        group.style.display = 'block';
                    } else {
                        group.style.display = 'none';
                    }
                });
                
                let visibleIndex = 0;
                projectCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    
                    if (cardCategory === category) {
                        card.classList.remove('hidden');
                        card.style.animation = 'none';
                        setTimeout(() => {
                            card.style.animation = `fadeInUp 0.6s ease ${visibleIndex * 0.1}s forwards`;
                        }, 10);
                        visibleIndex++;
                    } else {
                        card.classList.add('hidden');
                    }
                });
            }
            
            // Smooth scroll después de filtrar
            setTimeout(() => {
                const firstVisibleCard = document.querySelector('.project-card:not(.hidden)');
                if (firstVisibleCard) {
                    const yOffset = -150;
                    const y = firstVisibleCard.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    
                    window.scrollTo({
                        top: y,
                        behavior: 'smooth'
                    });
                }
            }, 100);
        }

        function getCategoryFromGroup(group) {
            const title = group.querySelector('.category-title').textContent.toLowerCase();
            
            if (title.includes('frontend')) {
                return 'frontend';
            } else if (title.includes('ux') || title.includes('ui')) {
                return 'ux-ui';
            } else if (title.includes('service')) {
                return 'service-design';
            }
            
            return null;
        }

        // Actualizar contador de proyectos
        function updateProjectCounts() {
            const allCount = projectCards.length;
            const frontendCount = document.querySelectorAll('[data-category="frontend"]').length;
            const uxCount = document.querySelectorAll('[data-category="ux-ui"]').length;
            const serviceCount = document.querySelectorAll('[data-category="service-design"]').length;

            filterButtons.forEach(btn => {
                const filter = btn.getAttribute('data-filter');
                const countSpan = btn.querySelector('.count');
                
                if (countSpan) {
                    switch(filter) {
                        case 'all':
                            countSpan.textContent = allCount;
                            break;
                        case 'frontend':
                            countSpan.textContent = frontendCount;
                            break;
                        case 'ux-ui':
                            countSpan.textContent = uxCount;
                            break;
                        case 'service-design':
                            countSpan.textContent = serviceCount;
                            break;
                    }
                }
            });
        }

        updateProjectCounts();

        // Verificar si hay filtro en URL
        const urlParams = new URLSearchParams(window.location.search);
        const filterParam = urlParams.get('filter');
        
        if (filterParam) {
            const filterBtn = document.querySelector(`[data-filter="${filterParam}"]`);
            if (filterBtn) {
                filterBtn.click();
            }
        }
    }

    // ================================
    // DYNAMIC PROJECT LOADING (para proyecto-detalle.html)
    // ================================
    const projectData = {
        'lumi': {
            title: 'Lumi - AI Integration Project',
            subtitle: 'Aplicación web que integra inteligencia artificial',
            tags: ['Frontend', 'AI Integration', '2024'],
            description: 'Aplicación web innovadora que integra inteligencia artificial para crear experiencias interactivas y personalizadas.',
            challenge: 'Durante el curso de IA, identificamos la necesidad de crear interfaces más intuitivas para interactuar con modelos de lenguaje.',
            solution: 'Desarrollé una interfaz conversacional que permite a los usuarios interactuar naturalmente con la IA.',
            tech: [
                { icon: 'js', name: 'JavaScript ES6+', desc: 'Lógica de la aplicación y manejo de estados' },
                { icon: 'html5', name: 'HTML5 & CSS3', desc: 'Estructura semántica y diseño responsive' },
                { icon: 'brain', name: 'OpenAI API', desc: 'Integración con modelos de lenguaje' },
                { icon: 'fire', name: 'Firebase', desc: 'Backend y persistencia de datos' }
            ],
            github: 'https://github.com/tu-usuario/lumi',
            demo: '#',
            status: 'En desarrollo'
        },
        'weather': {
            title: 'Weather Personalities',
            subtitle: 'App del clima con comentarios divertidos',
            tags: ['Frontend', 'API Integration', '2024'],
            description: 'Aplicación del clima que combina datos meteorológicos con comentarios humorísticos de diferentes personalidades.',
            challenge: 'Crear una experiencia del clima más entretenida y personal.',
            solution: 'Integré una API de clima con un sistema de comentarios basado en personalidades.',
            tech: [
                { icon: 'js', name: 'Vanilla JavaScript', desc: 'Sin frameworks, código puro' },
                { icon: 'cloud', name: 'Weather API', desc: 'Datos meteorológicos en tiempo real' },
                { icon: 'mobile-alt', name: 'Responsive', desc: 'Funciona en todos los dispositivos' }
            ],
            github: 'https://github.com/tu-usuario/weather',
            demo: '#',
            status: 'Completado'
        },
        'pomodoro': {
            title: 'Pomodoro Focus Timer',
            subtitle: 'Timer de productividad con la técnica Pomodoro',
            tags: ['Frontend', 'Productivity', '2024'],
            description: 'Aplicación de productividad que implementa la técnica Pomodoro con notificaciones y persistencia de datos.',
            challenge: 'Crear una herramienta de productividad simple pero efectiva.',
            solution: 'Timer funcional con gestión de estados, notificaciones del navegador y almacenamiento local.',
            tech: [
                { icon: 'js', name: 'JavaScript', desc: 'Manejo de tiempo y estados' },
                { icon: 'bell', name: 'Notifications API', desc: 'Alertas del navegador' },
                { icon: 'database', name: 'Local Storage', desc: 'Persistencia de sesiones' }
            ],
            github: 'https://github.com/tu-usuario/pomodoro',
            demo: '#',
            status: 'Completado'
        }
    };

    // Cargar datos del proyecto si estamos en una página de detalle
    const projectId = document.body.getAttribute('data-project');
    if (projectId && projectData[projectId]) {
        loadProjectData(projectData[projectId]);
    }

    function loadProjectData(data) {
        // Actualizar título
        const titleElement = document.querySelector('.project-hero-title');
        if (titleElement) titleElement.textContent = data.title;

        // Actualizar descripción
        const descElement = document.querySelector('.project-hero-description');
        if (descElement) descElement.textContent = data.description;

        // Actualizar tags
        const tagsContainer = document.querySelector('.project-hero-tags');
        if (tagsContainer) {
            tagsContainer.innerHTML = data.tags.map(tag => 
                `<span class="hero-tag"><i class="fas fa-tag"></i> ${tag}</span>`
            ).join('');
        }

        // Actualizar links
        const githubLink = document.querySelector('a[href*="github"]');
        if (githubLink) githubLink.href = data.github;

        const demoLink = document.querySelector('a[href*="demo"]');
        if (demoLink && data.demo) demoLink.href = data.demo;
    }

    // ================================
    // Performance: Prefers Reduced Motion
    // ================================
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (prefersReducedMotion.matches) {
        document.querySelectorAll('.scroll-reveal').forEach(el => {
            el.classList.add('revealed');
        });
    }

    // ================================
    // Console Easter Egg
    // ================================
    console.log(
        '%c¡Hola! 👋',
        'color: #ec4899; font-size: 24px; font-weight: bold;'
    );
    console.log(
        '%cSi estás revisando el código, ¡me gusta tu curiosidad! 💜',
        'color: #8b5cf6; font-size: 14px;'
    );
    console.log(
        '%cEscríbeme si quieres hablar de código o colaborar: tu-email@ejemplo.com',
        'color: #06b6d4; font-size: 12px;'
    );

    // ================================
    // Konami Code Easter Egg
    // ================================
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

    document.addEventListener('keydown', function(e) {
        konamiCode.push(e.key);
        konamiCode = konamiCode.slice(-10);
        
        if (konamiCode.join(',') === konamiSequence.join(',')) {
            console.log('%c🎉 ¡Encontraste el easter egg! 🎉', 'color: #ec4899; font-size: 20px; font-weight: bold;');
            document.body.style.filter = 'hue-rotate(180deg)';
            setTimeout(() => {
                document.body.style.filter = '';
            }, 3000);
        }
    });

});

// ================================
// Lazy Loading para imágenes
// ================================
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        if (img.dataset.src) {
            img.src = img.dataset.src;
        }
    });
} else {
    // Fallback para navegadores antiguos
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

document.addEventListener('DOMContentLoaded', function() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        // Solo hacer clicable si NO es frontend
        if (category === 'ux-ui' || category === 'service-design') {
            // Buscar el link principal dentro del card
            const mainLink = card.querySelector('.project-link[href*=".html"]');
            
            if (mainLink) {
                const url = mainLink.getAttribute('href');
                
                // Hacer toda la card clicable
                card.style.cursor = 'pointer';
                card.addEventListener('click', function(e) {
                    // Evitar que se active si clickean en un link específico
                    if (e.target.tagName !== 'A' && !e.target.closest('a')) {
                        window.location.href = url;
                    }
                });
            }
        }
    });
});
