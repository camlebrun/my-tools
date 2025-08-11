// ===== QUICKTOOLS 2025 - PROFESSIONAL INTERACTIONS =====

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initScrollEffects();
    initAnimations();
    initFloatingElements();
    initSmoothScrolling();
    initToolCards();
});

// ===== NAVIGATION SYSTEM =====
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    // Mobile navigation toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
    
    // Navbar scroll effect
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
}

// ===== SCROLL EFFECTS =====
function initScrollEffects() {
    // Subtle parallax effect for floating elements
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-element');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 1;
            const yPos = -(scrolled * speed * 0.3);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, observerOptions);
    
    // Observe all elements that should animate on scroll
    const animateElements = document.querySelectorAll('.tool-card, .section-header, .cta-content');
    animateElements.forEach(el => observer.observe(el));
}

// ===== ANIMATIONS =====
function initAnimations() {
    // Stagger animation for tool cards
    const toolCards = document.querySelectorAll('.tool-card');
    toolCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Subtle hover animations for interactive elements
    const interactiveElements = document.querySelectorAll('.btn, .nav-link');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-1px)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// ===== FLOATING ELEMENTS =====
function initFloatingElements() {
    const floatingElements = document.querySelectorAll('.floating-element');
    
    floatingElements.forEach((element, index) => {
        // Add subtle animation delays
        element.style.animationDelay = `${index * 2}s`;
    });
}

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
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

// ===== TOOL CARDS INTERACTIONS =====
function initToolCards() {
    const toolCards = document.querySelectorAll('.tool-card');
    
    toolCards.forEach(card => {
        // Enhanced hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
            this.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
        });
    });
}

// ===== UTILITY FUNCTIONS =====
function scrollToTools() {
    const toolsSection = document.getElementById('tools');
    if (toolsSection) {
        toolsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// ===== PERFORMANCE OPTIMIZATIONS =====
// Throttle scroll events for better performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(function() {
    // Scroll-based effects here
}, 16)); // ~60fps

// ===== ACCESSIBILITY ENHANCEMENTS =====
// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Escape key closes mobile menu
    if (e.key === 'Escape') {
        const navMenu = document.getElementById('navMenu');
        const navToggle = document.getElementById('navToggle');
        if (navMenu && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    // Enter key activates focused elements
    if (e.key === 'Enter') {
        const focusedElement = document.activeElement;
        if (focusedElement && focusedElement.classList.contains('tool-card')) {
            const button = focusedElement.querySelector('.btn');
            if (button) {
                button.click();
            }
        }
    }
});

// ===== LOADING STATES =====
function showLoading(element) {
    element.classList.add('loading');
    element.disabled = true;
}

function hideLoading(element) {
    element.classList.remove('loading');
    element.disabled = false;
}

// ===== ERROR HANDLING =====
function showError(message, element) {
    const errorDiv = document.createElement('div');
    errorDiv.classList.add('error-message');
    errorDiv.textContent = message;
    errorDiv.style.color = 'var(--error)';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = 'var(--space-sm)';
    
    element.parentNode.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// ===== THEME SUPPORT =====
// Check for user's preferred color scheme
function initThemeSupport() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    function handleThemeChange(e) {
        if (e.matches) {
            document.documentElement.classList.add('dark-theme');
        } else {
            document.documentElement.classList.remove('dark-theme');
        }
    }
    
    prefersDark.addListener(handleThemeChange);
    handleThemeChange(prefersDark);
}

// Initialize theme support
initThemeSupport();

// ===== ANALYTICS & PERFORMANCE =====
// Track user interactions for UX improvements
function trackInteraction(element, action) {
    // This could be connected to analytics services
    console.log(`User interaction: ${action} on ${element.tagName}`);
}

// Add interaction tracking to important elements
document.addEventListener('click', function(e) {
    if (e.target.closest('.btn')) {
        trackInteraction(e.target.closest('.btn'), 'button_click');
    }
    if (e.target.closest('.tool-card')) {
        trackInteraction(e.target.closest('.tool-card'), 'tool_card_interaction');
    }
});

// ===== SERVICE WORKER SUPPORT =====
// Register service worker for offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// ===== EXPORT FUNCTIONS =====
// Make functions available globally for HTML onclick attributes
window.scrollToTools = scrollToTools;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.showError = showError;
