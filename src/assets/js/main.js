// Language handling
const langState = {
    current: localStorage.getItem('preferred-language') || 'en'
};

function initializeLanguageToggle() {
    const toggleContainer = document.querySelector('.language-toggle');
    const toggleSlider = document.querySelector('.toggle-slider');
    const langOptions = document.querySelectorAll('.lang-option');
    
    // Set initial state
    updateLanguageUI(langState.current);
    translatePage();

    // Handle click on language options
    langOptions.forEach(option => {
        option.addEventListener('click', () => {
            const newLang = option.dataset.lang;
            langState.current = newLang;
            localStorage.setItem('preferred-language', newLang);
            updateLanguageUI(newLang);
            translatePage();
        });
    });
    
    // Handle click on toggle slider
    toggleSlider.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent event bubbling
        const newLang = toggleSlider.classList.contains('vi') ? 'en' : 'vi';
        
        langState.current = newLang;
        localStorage.setItem('preferred-language', newLang);
        updateLanguageUI(newLang);
        translatePageWithAnimation(); // Use animated transition
    });
}

function updateLanguageUI(lang) {
    const toggleSlider = document.querySelector('.toggle-slider');
    const langOptions = document.querySelectorAll('.lang-option');

    // Update slider position
    toggleSlider.classList.toggle('vi', lang === 'vi');

    // Update flag icon
    const flagIcon = toggleSlider.querySelector('.flag-icon');
    if (flagIcon) {
        flagIcon.src = lang === 'vi' ? 'src/assets/images/vn.png' : 'src/assets/images/en.png';
    }

    // Highlight active language
    langOptions.forEach(option => {
        option.classList.toggle('active', option.dataset.lang === lang);
    });
}

function detectBrowserLanguage() {
    const browserLang = navigator.language.toLowerCase().split('-')[0];
    return ['en', 'vi'].includes(browserLang) ? browserLang : 'en';
}

function translatePage() {
    document.documentElement.lang = langState.current;
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[langState.current] && translations[langState.current][key]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translations[langState.current][key];
            } else {
                element.textContent = translations[langState.current][key];
            }
        }
    });
}

function translatePageWithAnimation() {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transition = 'opacity 0.3s ease';
    });

    setTimeout(() => {
        translatePage();
        elements.forEach(element => {
            element.style.opacity = '1';
        });
    }, 300);
}

// Mobile menu handling
function initializeMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const header = document.querySelector('.header');
    if (!menuToggle || !navLinks || !header) return;

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        header.classList.toggle('menu-open');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-container')) {
            navLinks.classList.remove('active');
            header.classList.remove('menu-open');
        }
    });

    // Close menu when clicking a nav link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            header.classList.remove('menu-open');
        });
    });
}

// Handle header background on scroll
function initializeHeader() {
    const header = document.querySelector('.header');
    const scrollThreshold = 50;

    window.addEventListener('scroll', () => {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Smooth scroll for navigation links
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Handle contact form submission
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        console.log('Form submitted:', data);
        alert(translations[langState.current].formSubmitSuccess || 'Thank you for your interest! We will contact you soon.');
        contactForm.reset();
    });
}

// Handle machine details navigation
function initializeMachineDetails() {
    const machineNavContainer = document.querySelector('.machine-nav');
    if (!machineNavContainer) return;

    const machineNavBtns = machineNavContainer.querySelectorAll('.machine-nav-btn');
    const machineSpecs = document.querySelectorAll('.machine-specs');
    const machineImageContainer = document.querySelector('.machine-image');
    const machineImage = document.getElementById('machine-image');

    const imageMap = {
        'large': 'src/assets/images/big.png',
        'medium': 'src/assets/images/mid.png',
        'compact': 'src/assets/images/small.png'
    };

    // Preload images for smoother transitions
    Object.values(imageMap).forEach(src => {
        const img = new Image();
        img.src = src;
    });

    function updateImage(machineType) {
        if (!machineImage || !imageMap[machineType]) return;
        
        machineImageContainer.classList.add('loading');
        const newSrc = imageMap[machineType];
        
        // Only change if different
        if (machineImage.src.endsWith(newSrc)) {
            machineImageContainer.classList.remove('loading');
            return;
        }

        const altText = `${machineType.charAt(0).toUpperCase() + machineType.slice(1)} Capacity Vending Machine`;
        
        // Fade out
        machineImage.style.opacity = '0';
        machineImage.style.transform = 'scale(0.98)';
        
        setTimeout(() => {
            machineImage.src = newSrc;
            machineImage.alt = altText;
            machineImage.setAttribute('aria-label', altText);
            
            // Remove loading state once image is loaded
            machineImage.onload = () => {
                machineImage.style.opacity = '1';
                machineImage.style.transform = 'scale(1)';
                machineImageContainer.classList.remove('loading');
            };
        }, 200);
    }

    function showMachine(machineType) {
        if (!['large', 'medium', 'compact'].includes(machineType)) {
            machineType = 'large';
        }

        // Update buttons
        machineNavBtns.forEach(btn => {
            const isActive = btn.dataset.machine === machineType;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-selected', isActive);
        });

        // Update specs with staggered animation
        machineSpecs.forEach(spec => {
            const shouldBeActive = spec.classList.contains(machineType);
            
            if (shouldBeActive && !spec.classList.contains('active')) {
                // Show new content
                spec.style.display = 'block';
                spec.style.opacity = '0';
                spec.style.transform = 'translateY(10px)';
                
                // Trigger animation
                requestAnimationFrame(() => {
                    spec.classList.add('active');
                    spec.style.opacity = '1';
                    spec.style.transform = 'translateY(0)';
                });
            } else if (!shouldBeActive && spec.classList.contains('active')) {
                // Hide old content
                spec.classList.remove('active');
                spec.style.opacity = '0';
                spec.style.transform = 'translateY(-10px)';
                
                setTimeout(() => {
                    if (!spec.classList.contains('active')) {
                        spec.style.display = 'none';
                    }
                }, 300);
            }
        });

        // Update image with transition
        updateImage(machineType);

        // Update URL without scrolling
        const newUrl = new URL(window.location.href);
        newUrl.hash = machineType;
        history.replaceState(null, '', newUrl);
    }

    // Handle button clicks with debouncing
    let lastClick = 0;
    machineNavContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.machine-nav-btn');
        if (!btn || btn.classList.contains('active')) return;

        const now = Date.now();
        if (now - lastClick < 300) return; // Debounce clicks
        lastClick = now;

        e.preventDefault();
        showMachine(btn.dataset.machine);
    });

    // Handle keyboard navigation
    machineNavContainer.addEventListener('keydown', (e) => {
        const btn = e.target.closest('.machine-nav-btn');
        if (!btn) return;

        let newIndex;
        const current = Array.from(machineNavBtns).indexOf(btn);

        switch (e.key) {
            case 'ArrowRight':
            case 'ArrowDown':
                newIndex = (current + 1) % machineNavBtns.length;
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
                newIndex = (current - 1 + machineNavBtns.length) % machineNavBtns.length;
                break;
            default:
                return;
        }

        e.preventDefault();
        const newBtn = machineNavBtns[newIndex];
        newBtn.focus();
        showMachine(newBtn.dataset.machine);
    });

    // Handle hash changes
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.replace('#', '');
        showMachine(hash || 'large');
    });

    // Initial setup from URL hash or default
    const initialMachine = window.location.hash.replace('#', '') || 'large';
    showMachine(initialMachine);
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    initializeLanguageToggle();
    initializeMobileMenu();
    initializeHeader();
    initializeSmoothScroll();
    initializeContactForm();
    initializeMachineDetails();
});
