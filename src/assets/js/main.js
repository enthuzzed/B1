// Product catalog data
const products = [
    {
        id: 1,
        name: "Smart Snack Vending Machine",
        description: "Modern touchscreen vending machine with cashless payment",
        image: "smart-vending.jpg",
        features: ["Touchscreen Interface", "Cashless Payments", "Remote Monitoring"]
    },
    {
        id: 2,
        name: "Healthy Choice Vending Machine",
        description: "Specialized for healthy snacks and beverages",
        image: "healthy-vending.jpg",
        features: ["Temperature Control", "Fresh Food Options", "Digital Display"]
    },
    {
        id: 3,
        name: "Premium Coffee Vending Machine",
        description: "Gourmet coffee and hot beverage dispenser",
        image: "coffee-vending.jpg",
        features: ["Fresh Ground Coffee", "Multiple Beverages", "Cup Sensor"]
    }
];

// Initialize the product catalog
function initializeProducts() {
    const productCatalog = document.getElementById('product-catalog');
    if (!productCatalog) return;

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product-card';
        productElement.innerHTML = `
            <img src="src/assets/images/${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <ul>
                ${product.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
        `;
        productCatalog.appendChild(productElement);
    });
}

// Handle contact form submission
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Here you would typically send this data to your backend
        console.log('Form submitted:', data);
        
        // Show success message
        alert('Thank you for your interest! We will contact you soon.');
        contactForm.reset();
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

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!header.contains(e.target) && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            header.classList.remove('menu-open');
        }
    });
}

// Lazy load and animate machine images
document.addEventListener('DOMContentLoaded', () => {
    const machineImages = document.querySelectorAll('.machine-image img');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '0';
                img.src = img.dataset.src;
                
                img.onload = () => {
                    img.style.transition = 'opacity 0.5s ease';
                    img.style.opacity = '1';
                };
                
                observer.unobserve(img);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });
    
    machineImages.forEach(img => {
        if (img.dataset.src) {
            imageObserver.observe(img);
        }
    });
});

// Initialize language handling
let currentLang = localStorage.getItem('language') || 'en';

function initLanguage() {
    const languageSelector = document.getElementById('languageSelector');
    if (languageSelector) {
        languageSelector.value = currentLang;
        translatePage();
        
        languageSelector.addEventListener('change', (e) => {
            currentLang = e.target.value;
            localStorage.setItem('language', currentLang);
            translatePage();
        });
    }
}

function translatePage() {
    document.documentElement.lang = currentLang;
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[currentLang] && translations[currentLang][key]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translations[currentLang][key];
            } else {
                element.textContent = translations[currentLang][key];
            }
        }
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeMobileMenu();
    initializeHeader();
    initializeProducts();
    initializeContactForm();
    initializeSmoothScroll();
    initLanguage();
});