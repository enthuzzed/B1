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
    toggleSlider.style.transform = lang === 'vi' ? 'translateX(180%)' : 'translateX(0)';

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

// Mobile menu functionality
function initializeMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const header = document.querySelector('.header');

    if (!menuToggle || !navLinks) return;

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        header.classList.toggle('menu-open');
    });

    // Close menu when clicking a link
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
    const machineNavBtns = document.querySelectorAll('.machine-nav-btn');
    const machineSpecs = document.querySelectorAll('.machine-specs');

    if (!machineNavBtns.length) return;

    // Function to show specific machine
    function showMachine(machineType) {
        machineNavBtns.forEach(b => {
            b.classList.toggle('active', b.dataset.machine === machineType);
        });
        machineSpecs.forEach(spec => {
            spec.classList.toggle('active', spec.classList.contains(machineType));
        });
    }

    // Handle button clicks
    machineNavBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const machine = btn.dataset.machine;
            history.pushState(null, '', `#${machine}`);
            showMachine(machine);
        });
    });

    // Check URL hash on page load
    if (location.hash) {
        const machine = location.hash.replace('#', '');
        showMachine(machine);
    } else {
        showMachine('large'); // Show large machine by default
    }

    // Handle browser back/forward
    window.addEventListener('hashchange', () => {
        const machine = location.hash.replace('#', '') || 'large';
        showMachine(machine);
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeMobileMenu();
    initializeHeader();
    initializeContactForm();
    initializeSmoothScroll();
    initializeLanguageToggle();
    initializeMachineDetails();
});
