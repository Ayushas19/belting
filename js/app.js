/* ==========================================================================
   Belting Engineering Works - Main Application Script
   Product Filtering, Scroll Reveal Animations, Inquiry Form & Logo Helper
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initScrollReveals();
    initProductFilters();
    initModals();
    initMobileNav();
    makeLogoTransparent();
    initBlueScrollAndHeroSteps();
});

/* --------------------------------------------------------------------------
   1. Scroll Reveal Animations
   -------------------------------------------------------------------------- */
function initScrollReveals() {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   2. Product Category Filters
   -------------------------------------------------------------------------- */
function initProductFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const cat = btn.dataset.category;

            productCards.forEach(card => {
                if (cat === 'all' || card.dataset.category === cat) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/* --------------------------------------------------------------------------
   3. Modal Management & Quick Inquiry
   -------------------------------------------------------------------------- */
function initModals() {
    const closeBtns = document.querySelectorAll('.modal-close');
    const modals = document.querySelectorAll('.modal-overlay');

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modals.forEach(m => m.classList.remove('active'));
        });
    });

    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modals.forEach(m => m.classList.remove('active'));
        }
    });

    // Quick Inquiry Modal Trigger
    const openBtns = document.querySelectorAll('[data-open-inquiry]');
    openBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const modal = document.getElementById('inquiryModal');
            if (modal) {
                const prodTitle = btn.dataset.productName;
                const titleInput = document.getElementById('inquiryProductInput');
                if (prodTitle && titleInput) {
                    titleInput.value = prodTitle;
                }
                modal.classList.add('active');
            }
        });
    });
}

/* --------------------------------------------------------------------------
   4. Mobile Navigation Toggle
   -------------------------------------------------------------------------- */
function initMobileNav() {
    const toggleBtn = document.getElementById('mobileNavToggle');
    const navLinks = document.querySelector('.nav-links');

    if (toggleBtn && navLinks) {
        toggleBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            toggleBtn.querySelector('i').classList.toggle('fa-bars');
            toggleBtn.querySelector('i').classList.toggle('fa-times');
        });
    }
}

/* --------------------------------------------------------------------------
   5. Logo Background Removal Helper
   -------------------------------------------------------------------------- */
function makeLogoTransparent() {
    const logoImgs = document.querySelectorAll('.brand-logo-img');
    logoImgs.forEach(img => {
        const process = () => {
            try {
                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth || img.width;
                canvas.height = img.naturalHeight || img.height;
                if (!canvas.width || !canvas.height) return;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imgData.data;

                for (let i = 0; i < data.length; i += 4) {
                    if (data[i] < 30 && data[i+1] < 30 && data[i+2] < 30) {
                        data[i+3] = 0;
                    }
                }
                ctx.putImageData(imgData, 0, 0);
                img.src = canvas.toDataURL('image/png');
                img.style.mixBlendMode = 'normal';
            } catch (e) {
                img.style.mixBlendMode = 'screen';
            }
        };

        if (img.complete) {
            process();
        } else {
            img.onload = process;
        }
    });
}

/* --------------------------------------------------------------------------
   6. Hero 3-Scroll Step Interactive Engine & Blue Scroll Progress System
   -------------------------------------------------------------------------- */
function initBlueScrollAndHeroSteps() {
    const progressBar = document.getElementById('blueScrollProgress');
    
    // Window Scroll Handler for Blue Progress Bar
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
    }, { passive: true });

    // Hero 3-Scroll Step Controller
    const heroSection = document.getElementById('heroMachineSection');
    if (!heroSection) return;

    const heroSteps = [
        {
            badge: '<i class="fas fa-industry"></i> SCROLL 1 OF 3 • INDUSTRIAL CONVEYOR BELT MACHINE',
            title: 'Premier Manufacturer of <span>PVC & PU Conveyor Belts</span>',
            desc: 'Belting Engineering Works manufactures high-performance industrial conveyor belts, modular plastic systems, stainless mesh lines, and custom technological equipment in Kanpur, UP.',
            prompt: '<i class="fas fa-mouse"></i> Scroll down (Step 1/3) to reveal manufacturing details'
        },
        {
            badge: '<i class="fas fa-industry"></i> SCROLL 2 OF 3 • FULL-CYCLE KANPUR PLANT',
            title: 'Self-Produced Components & <span>Warehouse Stock</span>',
            desc: 'We produce conveyor systems from components of our own production. This reduces production lead times and guarantees immediately available spare parts in our Kanpur warehouses.',
            prompt: '<i class="fas fa-mouse"></i> Scroll down (Step 2/3) to reveal custom solutions'
        },
        {
            badge: '<i class="fas fa-drafting-table"></i> SCROLL 3 OF 3 • CUSTOM ENGINEERING DRAWINGS',
            title: 'Non-Standard Equipment & <span>Premise Specifics</span>',
            desc: 'We design and manufacture conveyor systems taking into account the exact specifics of your production premises, including non-standard equipment built according to customer drawings.',
            prompt: '<i class="fas fa-arrow-down"></i> Scroll down (Step 3/3) to explore complete website'
        }
    ];

    let currentStepIndex = 0;
    let isTransitioning = false;

    function updateHeroStep(index) {
        if (index < 0 || index >= heroSteps.length) return;
        currentStepIndex = index;

        const badge = document.getElementById('heroBadge');
        const title = document.getElementById('heroTitle');
        const desc = document.getElementById('heroDesc');
        const promptText = document.getElementById('heroScrollPromptText');
        const card = document.getElementById('heroDynamicCard');

        // Update Step Pills
        [1, 2, 3].forEach(stepNum => {
            const pill = document.getElementById(`heroStep${stepNum}Pill`);
            if (pill) {
                if (stepNum - 1 === index) pill.classList.add('active');
                else pill.classList.remove('active');
            }
        });

        // Card Fade Animation
        if (card) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(12px) scale(0.98)';
        }

        setTimeout(() => {
            if (badge) badge.innerHTML = heroSteps[index].badge;
            if (title) title.innerHTML = heroSteps[index].title;
            if (desc) desc.textContent = heroSteps[index].desc;
            if (promptText) promptText.innerHTML = heroSteps[index].prompt;

            if (card) {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
            }
        }, 180);

        // Boost Belt Speed on step change
        if (window.scrollBelt) {
            window.scrollBelt.scrollBoost = 5.0 + (index * 2.5);
        }
    }

    // Step Pill Click Handlers
    [1, 2, 3].forEach((stepNum, idx) => {
        const pill = document.getElementById(`heroStep${stepNum}Pill`);
        if (pill) {
            pill.addEventListener('click', () => updateHeroStep(idx));
        }
    });

    // Wheel Event Handler for 3-Step Hero Scroll
    window.addEventListener('wheel', (e) => {
        const heroRect = heroSection.getBoundingClientRect();
        
        // If user is inside top hero viewport
        if (heroRect.top >= -40 && heroRect.top <= 80 && e.deltaY > 0) {
            if (currentStepIndex < 2) {
                e.preventDefault();
                if (!isTransitioning) {
                    isTransitioning = true;
                    updateHeroStep(currentStepIndex + 1);
                    setTimeout(() => {
                        isTransitioning = false;
                    }, 500);
                }
            }
        }
    }, { passive: false });
}
