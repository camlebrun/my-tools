// ===== MOUSE TRACKING FOR SPOTLIGHT EFFECT =====
class SpotlightEffect {
    constructor() {
        this.cards = document.querySelectorAll('.tool-card');
        if (this.cards.length > 0) {
            this.init();
        }
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            this.cards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    }
}

// ===== TOAST NOTIFICATIONS =====
class Toast {
    constructor() {
        this.container = document.createElement('div');
        this.container.className = 'toast-container';
        document.body.appendChild(this.container);
        
        // Add styles for toast container
        const styles = document.createElement('style');
        styles.textContent = `
            .toast-container {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: 10px;
                pointer-events: none;
            }
            .toast {
                background: rgba(10, 10, 12, 0.9);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.15);
                color: white;
                padding: 12px 24px;
                border-radius: 9999px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.4);
                font-size: 0.875rem;
                font-weight: 500;
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                pointer-events: auto;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .toast.show {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(styles);
    }

    show(message, duration = 3000) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<span>✨</span> ${message}`;
        this.container.appendChild(toast);

        // Force reflow
        toast.offsetHeight;

        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 3000);
        }, duration);
    }
}

// ===== NAVIGATION MANAGEMENT =====
class Navigation {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navToggle = document.getElementById('navToggle');
        this.navMenu = document.getElementById('navMenu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }
    
    init() {
        this.setupMobileMenu();
        this.setupScrollEffects();
        this.setupNavigationLinks();
        this.setupKeyboardNavigation();
    }
    
    setupMobileMenu() {
        if (!this.navToggle || !this.navMenu) return;
        
        this.navToggle.addEventListener('click', () => {
            this.toggleMobileMenu();
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.navbar && !this.navbar.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
    }
    
    toggleMobileMenu() {
        this.navToggle.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        document.body.style.overflow = this.navMenu.classList.contains('active') ? 'hidden' : '';
    }
    
    closeMobileMenu() {
        if (this.navToggle) this.navToggle.classList.remove('active');
        if (this.navMenu) this.navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    setupScrollEffects() {
        if (!this.navbar) return;
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
        });
    }
    
    setupNavigationLinks() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });
    }
    
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMobileMenu();
            }
        });
    }
}

// ===== ANIMATIONS & EFFECTS =====
class Animations {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupScrollAnimations();
        this.setupFloatingShapes();
    }
    
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('.tool-card, .section-header, .hero-content').forEach(el => {
            el.classList.add('reveal');
            observer.observe(el);
        });
    }
    
    setupFloatingShapes() {
        const shapes = document.querySelectorAll('.shape');
        shapes.forEach((shape, index) => {
            shape.style.animationDelay = `${index * 2}s`;
        });
    }
}

// ===== SMOOTH SCROLLING =====
class SmoothScrolling {
    constructor() {
        this.init();
    }
    
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    const offsetTop = targetElement.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ===== MAIN APPLICATION =====
class App {
    constructor() {
        this.init();
    }
    
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
    }
    
    start() {
        try {
            this.navigation = new Navigation();
            this.animations = new Animations();
            this.smoothScrolling = new SmoothScrolling();
            this.toast = new Toast();
            this.spotlight = new SpotlightEffect();
            
            // Global utilities
            window.showToast = (msg) => this.toast.show(msg);
            window.showError = (msg, el) => {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                errorDiv.textContent = msg;
                if (el && el.parentNode) {
                    el.parentNode.appendChild(errorDiv);
                    setTimeout(() => errorDiv.remove(), 5000);
                } else {
                    this.toast.show("❌ " + msg);
                }
            };
            
            console.log('QuickTools app initialized');
        } catch (error) {
            console.error('App init error:', error);
        }
    }
}

// Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
}

new App();
