// ===== INITIALIZE AOS =====
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    offset: 100
});

// ===== SMOOTH SCROLL FOR NAVIGATION =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== NAVBAR ACTIVE LINK =======
function setActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

// Call on page load if on home page
if (document.querySelector('.hero')) {
    setActiveNavLink();
}

// ===== FORM SUBMISSION =====
const forms = document.querySelectorAll('form');

forms.forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simple validation
        const inputs = this.querySelectorAll('input, textarea, select');
        let isValid = true;
        
        inputs.forEach(input => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                isValid = false;
                input.style.borderColor = '#e74c3c';
            } else {
                input.style.borderColor = '#e0e0e0';
            }
        });

        if (isValid) {
            // Show success message
            const successMsg = document.createElement('div');
            successMsg.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #6366f1, #ec4899);
                color: white;
                padding: 20px 30px;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                z-index: 9999;
                animation: slideInDown 0.5s ease-out;
            `;
            successMsg.innerHTML = `
                <h4 style="margin: 0 0 10px 0; font-weight: 700;">Success!</h4>
                <p style="margin: 0;">Thank you for reaching out. I'll get back to you soon.</p>
            `;
            
            document.body.appendChild(successMsg);
            
            // Remove message after 5 seconds
            setTimeout(() => {
                successMsg.style.animation = 'slideInUp 0.5s ease-out';
                setTimeout(() => successMsg.remove(), 500);
            }, 5000);

            // Reset form
            this.reset();
        }
    });
});

// ===== SCROLL ANIMATION FOR STATS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideInUp 0.8s ease-out forwards';
        }
    });
}, observerOptions);

document.querySelectorAll('.stat-box, .project-card, .service-card, .blog-card').forEach(el => {
    observer.observe(el);
});

// ===== SCROLL TO TOP BUTTON =====
function createScrollToTopButton() {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #6366f1, #ec4899);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.2rem;
        z-index: 999;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        box-shadow: 0 5px 20px rgba(99, 102, 241, 0.4);
    `;

    document.body.appendChild(scrollBtn);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.visibility = 'visible';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.visibility = 'hidden';
        }
    });

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    scrollBtn.addEventListener('mouseenter', () => {
        scrollBtn.style.transform = 'scale(1.1)';
    });

    scrollBtn.addEventListener('mouseleave', () => {
        scrollBtn.style.transform = 'scale(1)';
    });
}

createScrollToTopButton();

// ===== COUNTER ANIMATION FOR STATS =====
function animateCounters() {
    const statBoxes = document.querySelectorAll('.stat-box h3');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const h3 = entry.target;
                const text = h3.innerText;
                const number = parseInt(text.replace(/\D/g, ''));
                
                if (number) {
                    let current = 0;
                    const increment = number / 50;
                    
                    const counter = setInterval(() => {
                        current += increment;
                        if (current >= number) {
                            h3.innerText = text;
                            clearInterval(counter);
                        } else {
                            h3.innerText = Math.floor(current) + (text.includes('+') ? '+' : '');
                        }
                    }, 30);
                }
                
                observer.unobserve(h3);
            }
        });
    }, { threshold: 0.5 });

    statBoxes.forEach(box => observer.observe(box));
}

if (document.querySelectorAll('.stat-box').length > 0) {
    animateCounters();
}

// ===== MOBILE MENU CLOSE =====
const navLinks = document.querySelectorAll('.nav-link');
const navbarCollapse = document.querySelector('.navbar-collapse');

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        // Close mobile menu if open
        const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
            toggle: false
        });
        bsCollapse.hide();
    });
});

// ===== FILTER FUNCTIONALITY =====
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');

    if (filterButtons.length === 0) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');
            let visibleCount = 0;

            projectItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-filter') === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transition = 'opacity 0.3s ease';
                    }, 0);
                    visibleCount++;
                } else {
                    item.style.opacity = '0';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

initializeFilters();

// ===== FAQ ACCORDION =====
function initializeFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');

    if (faqQuestions.length === 0) return;

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const isActive = faqItem.classList.contains('active');

            // Close all other items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });

            // Toggle current item
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });
}

initializeFAQ();

// ===== THEME TOGGLE (Optional) =====
function initializeThemeToggle() {
    const theme = localStorage.getItem('theme') || 'light';
    
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
    }
}

// Call on page load
initializeThemeToggle();

// ===== LAZY LOADING IMAGES =====
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

lazyLoadImages();

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', (e) => {
    // Close mobile menu on Escape
    if (e.key === 'Escape') {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                toggle: false
            });
            bsCollapse.hide();
        }
    }
});

// ===== PERFORMANCE: DEBOUNCE FUNCTION =====
function debounce(func, wait) {
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

// ===== SCROLL PERFORMANCE OPTIMIZATION =====
const debouncedScroll = debounce(() => {
    // Scroll event handler
}, 250);

window.addEventListener('scroll', debouncedScroll);

// ===== PAGE LOAD ANIMATION =====
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// ===== INITIALIZE ON DOM READY =====
document.addEventListener('DOMContentLoaded', () => {
    // All initialization functions are called here
    setActiveNavLink();
    initializeFilters();
    initializeFAQ();
    initializeThemeToggle();
});

// ===== CONSOLE GREETING =====
console.log('%cWelcome to John Doe Portfolio!', 'font-size: 16px; color: #6366f1; font-weight: bold;');
console.log('%cMade with ❤️ using HTML, CSS, and JavaScript', 'font-size: 12px; color: #ec4899;');
