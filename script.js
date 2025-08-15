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
            if (!this.navbar.contains(e.target)) {
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
        this.navToggle.classList.remove('active');
        this.navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    setupScrollEffects() {
        if (!this.navbar) return;
        
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            // Add scrolled class for navbar styling
            if (currentScrollY > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
            
            lastScrollY = currentScrollY;
        });
    }
    
    setupNavigationLinks() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Close mobile menu when clicking a link
                this.closeMobileMenu();
                
                // Update active state
                this.navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
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
        this.setupToolCards();
    }
    
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        document.querySelectorAll('.tool-card, .section-header').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
    
    setupFloatingShapes() {
        const shapes = document.querySelectorAll('.shape');
        
        shapes.forEach((shape, index) => {
            shape.style.animationDelay = `${index * 2}s`;
        });
    }
    
    setupToolCards() {
        const toolCards = document.querySelectorAll('.tool-card');
        
        toolCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px)';
                card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '';
            });
        });
    }
}

// ===== SMOOTH SCROLLING =====
class SmoothScrolling {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupSmoothScroll();
    }
    
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ===== UTILITY FUNCTIONS =====
class Utils {
    static showLoading(element) {
        if (!element) return;
        
        element.classList.add('loading');
        element.disabled = true;
        
        // Add loading text if it's a button
        if (element.tagName === 'BUTTON') {
            element.dataset.originalText = element.textContent;
            element.textContent = 'Chargement...';
        }
    }
    
    static hideLoading(element) {
        if (!element) return;
        
        element.classList.remove('loading');
        element.disabled = false;
        
        // Restore original text if it's a button
        if (element.tagName === 'BUTTON' && element.dataset.originalText) {
            element.textContent = element.dataset.originalText;
        }
    }
    
    static showError(message, targetElement) {
        if (!targetElement) return;
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: var(--error);
            font-size: 0.875rem;
            margin-top: var(--space-sm);
            padding: var(--space-sm);
            background: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: var(--radius-md);
        `;
        
        targetElement.parentNode.appendChild(errorDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }
    
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// ===== THEME SUPPORT =====
class ThemeManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupThemeDetection();
        this.setupThemeToggle();
        this.loadSavedTheme();
    }
    
    setupThemeDetection() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const handleThemeChange = (e) => {
            if (!localStorage.getItem('theme')) {
                if (e.matches) {
                    this.setTheme('dark');
                } else {
                    this.setTheme('light');
                }
            }
        };
        
        mediaQuery.addListener(handleThemeChange);
        handleThemeChange(mediaQuery);
    }
    
    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;
        
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            this.setTheme(newTheme);
        });
        
        // Update button icon based on current theme
        this.updateThemeButton();
    }
    
    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.updateThemeButton();
    }
    
    loadSavedTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.setTheme(savedTheme);
        }
    }
    
    updateThemeButton() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;
        
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            themeToggle.innerHTML = '☀️';
            themeToggle.setAttribute('aria-label', 'Passer au thème clair');
        } else {
            themeToggle.innerHTML = '🌙';
            themeToggle.setAttribute('aria-label', 'Passer au thème sombre');
        }
    }
}

// ===== PERFORMANCE OPTIMIZATION =====
class PerformanceOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupIntersectionObserver();
        this.setupThrottledScroll();
    }
    
    setupIntersectionObserver() {
        // Lazy load images and other heavy elements
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    setupThrottledScroll() {
        let ticking = false;
        
        const updateScroll = () => {
            // Handle scroll-based updates here
            ticking = false;
        };
        
        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateScroll);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', requestTick);
    }
}

// ===== MAIN APPLICATION =====
class App {
    constructor() {
        this.init();
    }
    
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
    }
    
    start() {
        try {
            // Initialize all components
            this.navigation = new Navigation();
            this.animations = new Animations();
            this.smoothScrolling = new SmoothScrolling();
            this.themeManager = new ThemeManager();
            this.performanceOptimizer = new PerformanceOptimizer();
            
            // Setup global utilities
            window.showLoading = Utils.showLoading;
            window.hideLoading = Utils.hideLoading;
            window.showError = Utils.showError;
            
            console.log('QuickTools app initialized successfully');
            
        } catch (error) {
            console.error('Error initializing app:', error);
        }
    }
}

// ===== SERVICE WORKER REGISTRATION =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful:', registration.scope);
            })
            .catch(error => {
                console.log('ServiceWorker registration failed:', error);
            });
    });
}

// ===== START THE APPLICATION =====
new App();