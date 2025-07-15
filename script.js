// Jesty Core - Complete JavaScript Functions
// ฟังก์ชันครบครันสำหรับเว็บไซต์ Jesty Core

class JestyCore {
    constructor() {
        this.init();
        this.currentSection = 'home';
        this.scrollPosition = 0;
        this.isScrolling = false;
        this.typewriterSpeed = 50;
        this.particleSystem = null;
        this.audioContext = null;
        this.soundEffects = {};
    }

    init() {
        // เริ่มต้นระบบทั้งหมด
        this.setupEventListeners();
        this.initSmoothScrolling();
        this.initAnimations();
        this.initParticleSystem();
        this.initCodeTypewriter();
        this.initPortfolioFilters();
        this.initGalleryModal();
        this.initContactForm();
        this.initThemeToggle();
        this.initPreloader();
        this.initPerformanceOptimization();
        this.initSoundEffects();
        this.initChatSystem();
        this.initAnalytics();
        console.log('🚀 Jesty Core initialized successfully!');
    }

    // ระบบ Event Listeners
    setupEventListeners() {
        // Navigation clicks
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const target = item.getAttribute('href').slice(1);
                this.navigateToSection(target);
                this.updateActiveNav(item);
            });
        });

        // Scroll events
        window.addEventListener('scroll', this.throttle(() => {
            this.handleScroll();
            this.updateNavOnScroll();
            this.parallaxEffect();
            this.revealOnScroll();
        }, 16));

        // Resize events
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
            this.updateParticles();
        }, 250));

        // Mouse events
        document.addEventListener('mousemove', (e) => {
            this.handleMouseMove(e);
            this.updateCursor(e);
        });

        // Keyboard events
        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });

        // Touch events for mobile
        this.setupTouchEvents();
    }

    // ระบบ Smooth Scrolling
    initSmoothScrolling() {
        // Custom smooth scroll implementation
        this.smoothScrollTo = (target, duration = 1000) => {
            const targetElement = document.querySelector(target);
            if (!targetElement) return;

            const targetPosition = targetElement.offsetTop - 90;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            let startTime = null;

            const animation = (currentTime) => {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const run = this.easeInOutCubic(timeElapsed, startPosition, distance, duration);
                window.scrollTo(0, run);
                if (timeElapsed < duration) requestAnimationFrame(animation);
            };

            requestAnimationFrame(animation);
        };
    }

    // ระบบ Animation
    initAnimations() {
        // Intersection Observer for scroll animations
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '-50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    this.animateCounter(entry.target);
                    this.animateProgressBars(entry.target);
                }
            });
        }, this.observerOptions);

        // Observe all animatable elements
        document.querySelectorAll('.script-card, .service-card, .gallery-item, .metric').forEach(el => {
            this.observer.observe(el);
        });

        // Hero animations
        this.animateHero();
    }

    // ระบบ Particle Effect
    initParticleSystem() {
        const canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '-1';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        const particles = [];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const createParticle = () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 3 + 1,
            opacity: Math.random() * 0.5 + 0.1,
            color: `hsla(${Math.random() * 60 + 200}, 70%, 60%, ${Math.random() * 0.3})`
        });

        // สร้าง particles
        for (let i = 0; i < 50; i++) {
            particles.push(createParticle());
        }

        const animateParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;

                if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.fill();
            });

            requestAnimationFrame(animateParticles);
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        animateParticles();
    }

    // ระบบ Code Typewriter Effect
    initCodeTypewriter() {
        const codeLines = document.querySelectorAll('.code-text');
        const originalTexts = Array.from(codeLines).map(line => line.innerHTML);

        const typewriterEffect = (element, text, speed = 50) => {
            element.innerHTML = '';
            let i = 0;
            
            const typeInterval = setInterval(() => {
                if (i < text.length) {
                    element.innerHTML = text.slice(0, i + 1);
                    i++;
                } else {
                    clearInterval(typeInterval);
                }
            }, speed);
        };

        // Start typewriter effect when code window is visible
        const codeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    codeLines.forEach((line, index) => {
                        setTimeout(() => {
                            typewriterEffect(line, originalTexts[index], this.typewriterSpeed);
                        }, index * 200);
                    });
                    codeObserver.unobserve(entry.target);
                }
            });
        });

        const codeWindow = document.querySelector('.code-window');
        if (codeWindow) codeObserver.observe(codeWindow);
    }

    // ระบบ Portfolio Filters
    initPortfolioFilters() {
        // Filter buttons
        const filterContainer = document.createElement('div');
        filterContainer.className = 'portfolio-filters';
        filterContainer.innerHTML = `
            <button class="filter-btn active" data-filter="all">All Scripts</button>
            <button class="filter-btn" data-filter="banking">Banking</button>
            <button class="filter-btn" data-filter="police">Police</button>
            <button class="filter-btn" data-filter="medical">Medical</button>
            <button class="filter-btn" data-filter="business">Business</button>
            <button class="filter-btn" data-filter="entertainment">Entertainment</button>
        `;

        const portfolioSection = document.querySelector('#portfolio .section-header');
        if (portfolioSection) {
            portfolioSection.appendChild(filterContainer);

            // Filter functionality
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const filter = btn.dataset.filter;
                    this.filterPortfolio(filter);
                    
                    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                });
            });
        }
    }

    // ระบบ Gallery Modal
    initGalleryModal() {
        const modal = document.createElement('div');
        modal.className = 'gallery-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <button class="modal-close">&times;</button>
                    <img class="modal-image" src="" alt="">
                    <div class="modal-info">
                        <h3 class="modal-title"></h3>
                        <p class="modal-description"></p>
                        <div class="modal-features"></div>
                    </div>
                    <div class="modal-navigation">
                        <button class="modal-prev">‹</button>
                        <button class="modal-next">›</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Gallery item clicks
        document.querySelectorAll('.gallery-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                this.openGalleryModal(index);
            });
        });

        // Modal controls
        modal.querySelector('.modal-close').addEventListener('click', () => {
            this.closeGalleryModal();
        });

        modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
            if (e.target === modal.querySelector('.modal-overlay')) {
                this.closeGalleryModal();
            }
        });
    }

    // ระบบ Contact Form
    initContactForm() {
        const contactForm = document.createElement('form');
        contactForm.className = 'contact-form';
        contactForm.innerHTML = `
            <div class="form-group">
                <input type="text" name="name" placeholder="Your Name" required>
                <label>Name</label>
            </div>
            <div class="form-group">
                <input type="email" name="email" placeholder="Your Email" required>
                <label>Email</label>
            </div>
            <div class="form-group">
                <select name="service" required>
                    <option value="">Select Service</option>
                    <option value="custom">Custom Development</option>
                    <option value="interface">Interface Design</option>
                    <option value="integration">System Integration</option>
                    <option value="support">Premium Support</option>
                </select>
                <label>Service</label>
            </div>
            <div class="form-group">
                <textarea name="message" placeholder="Your Message" rows="5" required></textarea>
                <label>Message</label>
            </div>
            <button type="submit" class="submit-btn">
                <span>Send Message</span>
                <i class="fas fa-paper-plane"></i>
            </button>
        `;

        // Add form to services section
        const servicesSection = document.querySelector('#services .section-container');
        if (servicesSection) {
            const formContainer = document.createElement('div');
            formContainer.className = 'contact-form-container';
            formContainer.appendChild(contactForm);
            servicesSection.appendChild(formContainer);

            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(contactForm);
            });
        }
    }

    // ระบบ Theme Toggle
    initThemeToggle() {
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        
        const navbar = document.querySelector('.nav-actions');
        if (navbar) {
            navbar.appendChild(themeToggle);

            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }

    // ระบบ Preloader
    initPreloader() {
        const preloader = document.createElement('div');
        preloader.className = 'preloader';
        preloader.innerHTML = `
            <div class="preloader-content">
                <div class="preloader-logo">
                    <div class="brand-icon">
                        <div class="icon-inner"></div>
                    </div>
                    <span class="brand-text">Jesty Core</span>
                </div>
                <div class="preloader-progress">
                    <div class="progress-bar"></div>
                </div>
                <div class="loading-text">Loading Excellence...</div>
            </div>
        `;
        document.body.appendChild(preloader);

        // Simulate loading progress
        let progress = 0;
        const progressBar = preloader.querySelector('.progress-bar');
        const loadingTexts = [
            'Initializing Systems...',
            'Loading Premium Scripts...',
            'Preparing Interface...',
            'Almost Ready...',
            'Welcome to Excellence!'
        ];

        const loadingInterval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(loadingInterval);
                setTimeout(() => {
                    preloader.style.opacity = '0';
                    setTimeout(() => preloader.remove(), 500);
                }, 1000);
            }
            progressBar.style.width = progress + '%';
            
            const textIndex = Math.floor((progress / 100) * loadingTexts.length);
            if (loadingTexts[textIndex]) {
                preloader.querySelector('.loading-text').textContent = loadingTexts[textIndex];
            }
        }, 200);
    }

    // ระบบ Performance Optimization
    initPerformanceOptimization() {
        // Lazy loading for images
        const lazyImages = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));

        // Virtual scrolling for large lists
        this.initVirtualScrolling();

        // Memory cleanup
        this.setupMemoryCleanup();
    }

    // ระบบ Sound Effects
    initSoundEffects() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create sound effects
            this.soundEffects = {
                click: this.createTone(800, 0.1, 'sine'),
                hover: this.createTone(1200, 0.05, 'sine'),
                success: this.createTone(600, 0.2, 'triangle'),
                error: this.createTone(200, 0.3, 'sawtooth')
            };

            // Add sound to interactions
            document.querySelectorAll('button, .nav-item, .script-card').forEach(el => {
                el.addEventListener('mouseenter', () => this.playSound('hover'));
                el.addEventListener('click', () => this.playSound('click'));
            });
        } catch (error) {
            console.log('Audio not supported');
        }
    }

    // ระบบ Chat System
    initChatSystem() {
        const chatWidget = document.createElement('div');
        chatWidget.className = 'chat-widget';
        chatWidget.innerHTML = `
            <div class="chat-toggle">
                <i class="fas fa-comments"></i>
            </div>
            <div class="chat-window">
                <div class="chat-header">
                    <h4>Jesty Core Support</h4>
                    <button class="chat-close">&times;</button>
                </div>
                <div class="chat-messages">
                    <div class="message bot-message">
                        <div class="message-content">
                            สวัสดีครับ! ยินดีต้อนรับสู่ Jesty Core 
                            มีอะไรให้ช่วยเหลือไหมครับ?
                        </div>
                        <div class="message-time">${new Date().toLocaleTimeString()}</div>
                    </div>
                </div>
                <div class="chat-input">
                    <input type="text" placeholder="Type your message...">
                    <button class="send-btn"><i class="fas fa-paper-plane"></i></button>
                </div>
            </div>
        `;
        document.body.appendChild(chatWidget);

        // Chat functionality
        const chatToggle = chatWidget.querySelector('.chat-toggle');
        const chatWindow = chatWidget.querySelector('.chat-window');
        const chatClose = chatWidget.querySelector('.chat-close');
        const chatInput = chatWidget.querySelector('input');
        const sendBtn = chatWidget.querySelector('.send-btn');

        chatToggle.addEventListener('click', () => {
            chatWindow.classList.toggle('open');
        });

        chatClose.addEventListener('click', () => {
            chatWindow.classList.remove('open');
        });

        const sendMessage = () => {
            const message = chatInput.value.trim();
            if (message) {
                this.addChatMessage(message, 'user');
                chatInput.value = '';
                
                // Simulate bot response
                setTimeout(() => {
                    this.addChatMessage(this.getBotResponse(message), 'bot');
                }, 1000);
            }
        };

        sendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }

    // ระบบ Analytics
    initAnalytics() {
        this.analytics = {
            pageViews: 0,
            interactions: 0,
            timeOnSite: Date.now(),
            scrollDepth: 0,
            clickHeatmap: new Map()
        };

        // Track page views
        this.analytics.pageViews++;

        // Track scroll depth
        window.addEventListener('scroll', () => {
            const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            this.analytics.scrollDepth = Math.max(this.analytics.scrollDepth, scrollPercent);
        });

        // Track clicks
        document.addEventListener('click', (e) => {
            this.analytics.interactions++;
            const key = `${e.clientX},${e.clientY}`;
            this.analytics.clickHeatmap.set(key, (this.analytics.clickHeatmap.get(key) || 0) + 1);
        });

        // Send analytics periodically
        setInterval(() => {
            this.sendAnalytics();
        }, 30000);
    }

    // Helper Functions
    throttle(func, limit) {
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

    debounce(func, wait) {
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

    easeInOutCubic(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t + 2) + b;
    }

    // Main Functions Implementation
    navigateToSection(section) {
        this.currentSection = section;
        this.smoothScrollTo(`#${section}`);
        this.updateURL(section);
        this.trackNavigation(section);
    }

    handleScroll() {
        this.scrollPosition = window.pageYOffset;
        this.updateScrollProgress();
        this.handleParallax();
        this.revealElements();
    }

    handleMouseMove(e) {
        const cursor = document.querySelector('.custom-cursor') || this.createCustomCursor();
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';

        // Magnetic effect for buttons
        document.querySelectorAll('button, .nav-item').forEach(el => {
            const rect = el.getBoundingClientRect();
            const distance = Math.hypot(e.clientX - (rect.left + rect.width/2), e.clientY - (rect.top + rect.height/2));
            
            if (distance < 100) {
                const strength = (100 - distance) / 100;
                const x = (e.clientX - (rect.left + rect.width/2)) * strength * 0.3;
                const y = (e.clientY - (rect.top + rect.height/2)) * strength * 0.3;
                el.style.transform = `translate(${x}px, ${y}px)`;
            } else {
                el.style.transform = '';
            }
        });
    }

    animateHero() {
        const heroElements = document.querySelectorAll('.hero-badge, .hero-title, .hero-description, .hero-metrics');
        heroElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    filterPortfolio(filter) {
        const cards = document.querySelectorAll('.script-card');
        cards.forEach(card => {
            const cardType = card.dataset.category || 'all';
            if (filter === 'all' || cardType === filter) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.5s ease';
            } else {
                card.style.display = 'none';
            }
        });
    }

    openGalleryModal(index) {
        const modal = document.querySelector('.gallery-modal');
        const galleryItems = document.querySelectorAll('.gallery-item');
        const item = galleryItems[index];
        
        modal.style.display = 'flex';
        modal.style.opacity = '0';
        
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);
        
        // Populate modal content
        const title = item.querySelector('.overlay-title').textContent;
        const description = item.querySelector('.overlay-description').textContent;
        
        modal.querySelector('.modal-title').textContent = title;
        modal.querySelector('.modal-description').textContent = description;
        
        document.body.style.overflow = 'hidden';
    }

    closeGalleryModal() {
        const modal = document.querySelector('.gallery-modal');
        modal.style.opacity = '0';
        
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }

    handleFormSubmission(form) {
        const formData = new FormData(form);
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            this.playSound('success');
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            submitBtn.classList.add('success');
            
            setTimeout(() => {
                form.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.classList.remove('success');
            }, 3000);
        }, 2000);
    }

    createTone(frequency, duration, type = 'sine') {
        return () => {
            if (!this.audioContext) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = type;
            
            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        };
    }

    playSound(soundName) {
        if (this.soundEffects[soundName]) {
            this.soundEffects[soundName]();
        }
    }

    addChatMessage(message, sender) {
        const chatMessages = document.querySelector('.chat-messages');
        const messageEl = document.createElement('div');
        messageEl.className = `message ${sender}-message`;
        messageEl.innerHTML = `
            <div class="message-content">${message}</div>
            <div class="message-time">${new Date().toLocaleTimeString()}</div>
        `;
        chatMessages.appendChild(messageEl);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    getBotResponse(message) {
        const responses = {
            'hello': 'สวัสดีครับ! ยินดีต้อนรับสู่ Jesty Core',
            'hi': 'สวัสดีครับ! มีอะไรให้ช่วยเหลือไหม?',
            'price': 'ราคาของ script แต่ละตัวอยู่ที่ 3,200-5,500 บาทครับ',
            'discord': 'เชิญเข้าร่วม Discord ของเราได้ที่ discord.gg/jestycore',
            'support': 'เรามีบริการ Premium Support 24/7 ครับ',
            'custom': 'เราให้บริการพัฒนา script แบบ custom ตามความต้องการครับ'
        };
        
        const lowerMessage = message.toLowerCase();
        for (const key in responses) {
            if (lowerMessage.includes(key)) {
                return responses[key];
            }
        }
        
        return 'ขอบคุณสำหรับข้อความครับ ทีมงานจะติดต่อกลับโดยเร็วที่สุด!';
    }

    sendAnalytics() {
        const data = {
            ...this.analytics,
            timeOnSite: Date.now() - this.analytics.timeOnSite,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
        };
        
        // Simulate sending to analytics service
        console.log('Analytics data:', data);
    }
}

// Additional CSS for new features
const additionalCSS = `
    .preloader {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--primary-dark);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        transition: opacity 0.5s ease;
    }

    .preloader-content {
        text-align: center;
        color: var(--text-primary);
    }

    .preloader-progress {
        width: 300px;
        height: 4px;
        background: var(--accent-dark);
        border-radius: 2px;
        margin: 2rem 0;
        overflow: hidden;
    }

    .progress-bar {
        height: 100%;
        background: var(--gradient-luxury);
        width: 0%;
        transition: width 0.3s ease;
    }

    .portfolio-filters {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin: 2rem 0;
        flex-wrap: wrap;
    }

    .filter-btn {
        padding: 0.75rem 1.5rem;
        background: transparent;
        border: 1px solid var(--border-subtle);
        color: var(--text-secondary);
        border-radius: 50px;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .filter-btn.active,
    .filter-btn:hover {
        background: var(--gradient-primary);
        color: white;
        border-color: transparent;
    }

    .gallery-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        transition: opacity 0.3s ease;
    }

    .modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .modal-content {
        position: relative;
        max-width: 90%;
        max-height: 90%;
        background: var(--card-dark);
        border-radius: 20px;
        padding: 2rem;
        z-index: 1;
    }

    .modal-close {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: none;
        border: none;
        color: var(--text-primary);
        font-size: 2rem;
        cursor: pointer;
    }

    .contact-form-container {
        margin-top: 4rem;
        max-width: 800px;
        margin-left: auto;
        margin-right: auto;
    }

    .contact-form {
        background: var(--card-dark);
        padding: 3rem;
        border-radius: 20px;
        border: 1px solid var(--border-subtle);
    }

    .form-group {
        position: relative;
        margin-bottom: 2rem;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
        width: 100%;
        padding: 1rem;
        background: var(--accent-dark);
        border: 1px solid var(--border-subtle);
        border-radius: 10px;
        color: var(--text-primary);
        font-size: 1rem;
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
        outline: none;
        border-color: var(--primary-gold);
        box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.2);
    }

    .submit-btn {
        background: var(--gradient-luxury);
        color: var(--primary-dark);
        border: none;
        padding: 1rem 2rem;
        border-radius: 50px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: all 0.3s ease;
        width: 100%;
        justify-content: center;
    }

    .submit-btn:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-gold);
    }

    .submit-btn.success {
        background: #4caf50;
        color: white;
    }

    .theme-toggle {
        background: transparent;
        border: 1px solid var(--border-subtle);
        color: var(--text-secondary);
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-left: 1rem;
    }

    .theme-toggle:hover {
        background: var(--accent-dark);
        color: var(--text-primary);
    }

    .chat-widget {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        z-index: 1000;
    }

    .chat-toggle {
        width: 60px;
        height: 60px;
        background: var(--gradient-primary);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        box-shadow: var(--shadow-glow);
        transition: all 0.3s ease;
    }

    .chat-toggle:hover {
        transform: scale(1.1);
    }

    .chat-window {
        position: absolute;
        bottom: 80px;
        right: 0;
        width: 350px;
        height: 500px;
        background: var(--card-dark);
        border: 1px solid var(--border-subtle);
        border-radius: 20px;
        display: flex;
        flex-direction: column;
        opacity: 0;
        visibility: hidden;
        transform: translateY(20px);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .chat-window.open {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
    }

    .chat-header {
        padding: 1rem;
        border-bottom: 1px solid var(--border-subtle);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .chat-messages {
        flex: 1;
        padding: 1rem;
        overflow-y: auto;
    }

    .message {
        margin-bottom: 1rem;
    }

    .bot-message .message-content {
        background: var(--accent-dark);
        padding: 0.75rem 1rem;
        border-radius: 15px 15px 15px 5px;
        max-width: 80%;
    }

    .user-message .message-content {
        background: var(--gradient-primary);
        color: white;
        padding: 0.75rem 1rem;
        border-radius: 15px 15px 5px 15px;
        max-width: 80%;
        margin-left: auto;
    }

    .message-time {
        font-size: 0.75rem;
        color: var(--text-muted);
        margin-top: 0.25rem;
    }

    .chat-input {
        padding: 1rem;
        display: flex;
        gap: 0.5rem;
        border-top: 1px solid var(--border-subtle);
    }

    .chat-input input {
        flex: 1;
        padding: 0.75rem;
        background: var(--accent-dark);
        border: 1px solid var(--border-subtle);
        border-radius: 25px;
        color: var(--text-primary);
    }

    .send-btn {
        width: 40px;
        height: 40px;
        background: var(--gradient-primary);
        border: none;
        border-radius: 50%;
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .custom-cursor {
        position: fixed;
        width: 20px;
        height: 20px;
        background: var(--primary-gold);
        border-radius: 50%;
        pointer-events: none;
        z-index: 10000;
        mix-blend-mode: difference;
        transition: transform 0.1s ease;
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .animate-in {
        animation: fadeInUp 0.6s ease forwards;
    }

    @media (max-width: 768px) {
        .chat-window {
            width: 300px;
        }
        
        .portfolio-filters {
            gap: 0.5rem;
        }
        
        .filter-btn {
            padding: 0.5rem 1rem;
            font-size: 0.9rem;
        }
    }
`;

// Insert additional CSS
const style = document.createElement('style');
style.textContent = additionalCSS;
document.head.appendChild(style);

// Initialize Jesty Core when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.jestyCore = new JestyCore();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JestyCore;
}