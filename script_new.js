// Samsung Galaxy Toothbrush - Interactive Website
// Enhanced with Three.js, GSAP, and responsive interactions

// Global variables
let scene, camera, renderer, toothbrush, particles, clock;
let isLoaded = false;
let currentTestimonial = 0;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // First, ensure all sections are visible (failsafe)
    ensureVisibility();
    
    initThemeToggle();
    initNavigation();
    initThreeJS();
    initAnimations();
    initTestimonials();
    initLottieAnimation();
    initFormHandlers();
    initMobileMenu();
    
    // Remove loading screen after everything is initialized
    setTimeout(() => {
        const loading = document.querySelector('.loading');
        if (loading) {
            loading.style.opacity = '0';
            setTimeout(() => loading.remove(), 300);
        }
        isLoaded = true;
        
        // Final visibility check
        ensureVisibility();
    }, 2000);
});

// Failsafe function to ensure all content is visible
function ensureVisibility() {
    const elements = document.querySelectorAll('.feature-card, .spec-card, .testimonial-card, .section-header, .features, .tech-specs, .testimonials, .demo-section');
    elements.forEach(el => {
        if (el) {
            el.style.opacity = '1';
            el.style.visibility = 'visible';
            el.style.display = el.style.display === 'none' ? 'block' : el.style.display || '';
        }
    });
    
    // Specifically handle testimonials container
    const testimonialsContainer = document.querySelector('.testimonials-container');
    if (testimonialsContainer) {
        testimonialsContainer.style.display = 'flex';
        testimonialsContainer.style.opacity = '1';
    }
    
    // Ensure feature and spec grids are visible
    const grids = document.querySelectorAll('.features-grid, .specs-grid');
    grids.forEach(grid => {
        if (grid) {
            grid.style.display = 'grid';
            grid.style.opacity = '1';
        }
    });
}

// Theme Toggle Functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.setAttribute('data-theme', savedTheme);
    }
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Add smooth transition effect
        body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            body.style.transition = '';
        }, 300);
    });
}

// Navigation Functionality
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Three.js 3D Toothbrush Animation (or Image Animation)
function initThreeJS() {
    const canvas = document.getElementById('threejs-canvas');
    const heroImage = document.getElementById('heroImage');
    
    // If we have an image instead of canvas, initialize image animations
    if (heroImage && !canvas) {
        initImageAnimations();
        return;
    }
    
    // If no Three.js or canvas, skip
    if (!canvas || typeof THREE === 'undefined') {
        console.log('Three.js not available or canvas not found, using image mode');
        if (heroImage) {
            initImageAnimations();
        }
        return;
    }
    
    try {
    
    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    
    clock = new THREE.Clock();
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0x00a8ff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    const pointLight = new THREE.PointLight(0x40c9ff, 0.8);
    pointLight.position.set(-5, 0, 5);
    scene.add(pointLight);
    
    // Create toothbrush geometry
    createToothbrush();
    
    // Create particle system
    createParticles();
    
    // Position camera
    camera.position.set(0, 0, 8);
    
    // Start animation loop
    animate();
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    } catch (error) {
        console.error('Three.js initialization failed:', error);
        // Fallback to image mode if available
        if (heroImage) {
            initImageAnimations();
        }
    }
}

// Image Animation Alternative (when not using Three.js)
function initImageAnimations() {
    const heroImage = document.getElementById('heroImage');
    if (!heroImage) return;
    
    console.log('Initializing image animations');
    
    // Initialize background particles
    initBackgroundParticles();
    
    // Add some interactive animations to the image
    let animationFrame;
    let startTime = Date.now();
    
    function animateImage() {
        const elapsedTime = (Date.now() - startTime) / 1000;
        
        // Subtle floating animation that enhances the CSS animation
        const extraFloat = Math.sin(elapsedTime * 0.8) * 3;
        const extraRotate = Math.sin(elapsedTime * 0.5) * 1;
        
        // Apply additional transform to work with CSS animation
        const baseTransform = `translateY(${extraFloat}px) rotate(${extraRotate}deg)`;
        heroImage.style.transform = baseTransform;
        
        animationFrame = requestAnimationFrame(animateImage);
    }
    
    // Start the animation
    animateImage();
    
    // Add interactive glow effect
    heroImage.addEventListener('mouseenter', () => {
        heroImage.style.transition = 'filter 0.3s ease';
        heroImage.style.filter = (heroImage.style.filter || '') + ' brightness(1.2) saturate(1.3)';
    });
    
    heroImage.addEventListener('mouseleave', () => {
        heroImage.style.filter = heroImage.style.filter.replace(' brightness(1.2) saturate(1.3)', '');
    });
    
    // Cleanup function
    window.addEventListener('beforeunload', () => {
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }
    });
}

// Background Particles System (Clean & Simple)
function initBackgroundParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: 0, y: 0 };
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Simple, beautiful particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = (Math.random() - 0.5) * 0.8;
            this.size = Math.random() * 1.0 + 0.3; // Smaller particles
            this.opacity = Math.random() * 0.2 + 0.05; // Much more subtle
            this.originalOpacity = this.opacity;
            this.twinkleSpeed = Math.random() * 0.02 + 0.01;
            this.twinklePhase = Math.random() * Math.PI * 2;
        }
        
        update() {
            // Smooth movement
            this.x += this.vx;
            this.y += this.vy;
            
            // Wrap around edges smoothly
            if (this.x < -50) this.x = canvas.width + 50;
            if (this.x > canvas.width + 50) this.x = -50;
            if (this.y < -50) this.y = canvas.height + 50;
            if (this.y > canvas.height + 50) this.y = -50;
            
            // Beautiful twinkling effect
            this.twinklePhase += this.twinkleSpeed;
            this.opacity = this.originalOpacity + Math.sin(this.twinklePhase) * 0.3;
            
            // Gentle mouse interaction
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                const force = (150 - distance) / 150;
                this.opacity = Math.min(1, this.originalOpacity + force * 0.4);
                // Subtle push away from mouse
                this.vx -= dx * force * 0.0003;
                this.vy -= dy * force * 0.0003;
            }
            
            // Gentle friction
            this.vx *= 0.995;
            this.vy *= 0.995;
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            
            // Clean glow effect
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.size * 4
            );
            gradient.addColorStop(0, '#ffffff');
            gradient.addColorStop(0.2, '#40c9ff');
            gradient.addColorStop(0.6, '#00a8ff');
            gradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 4, 0, Math.PI * 2);
            ctx.fill();
            
            // Bright center dot
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 0.7, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        }
    }
    
    // Create well-distributed particles (very subtle)
    for (let i = 0; i < 30; i++) {
        particles.push(new Particle());
    }
    
    // Mouse tracking
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    
    // Clean animation loop
    function animate() {
        // Clear with slight fade for subtle trailing
        ctx.fillStyle = 'rgba(13, 13, 13, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw elegant connection lines
        ctx.globalAlpha = 0.15;
        ctx.strokeStyle = '#00a8ff';
        ctx.lineWidth = 0.5;
        
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    const opacity = (120 - distance) / 120 * 0.3;
                    ctx.globalAlpha = opacity;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        
        // Update and draw particles
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

function createToothbrush() {
    const group = new THREE.Group();
    
    // Handle geometry
    const handleGeometry = new THREE.CylinderGeometry(0.3, 0.3, 4, 32);
    const handleMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x1a1a1a,
        shininess: 100,
        specular: 0x00a8ff
    });
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    handle.position.y = -1;
    group.add(handle);
    
    // Brush head
    const headGeometry = new THREE.CylinderGeometry(0.25, 0.25, 1, 32);
    const headMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x00a8ff,
        shininess: 100
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.5;
    group.add(head);
    
    // Bristles
    for (let i = 0; i < 50; i++) {
        const bristleGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.3, 4);
        const bristleMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
        const bristle = new THREE.Mesh(bristleGeometry, bristleMaterial);
        
        const angle = (i / 50) * Math.PI * 2;
        const radius = 0.15 + Math.random() * 0.08;
        bristle.position.x = Math.cos(angle) * radius;
        bristle.position.z = Math.sin(angle) * radius;
        bristle.position.y = 2.15;
        
        group.add(bristle);
    }
    
    // Add glow effect
    const glowGeometry = new THREE.SphereGeometry(0.4, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x00a8ff,
        transparent: true,
        opacity: 0.3
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.y = 1.5;
    group.add(glow);
    
    toothbrush = group;
    scene.add(toothbrush);
}

function createParticles() {
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 1000;
    
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 20;
        positions[i + 1] = (Math.random() - 0.5) * 20;
        positions[i + 2] = (Math.random() - 0.5) * 20;
        
        colors[i] = Math.random() * 0.5 + 0.5;
        colors[i + 1] = Math.random() * 0.5 + 0.5;
        colors[i + 2] = 1;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
    });
    
    particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
}

function animate() {
    requestAnimationFrame(animate);
    
    if (!isLoaded) return;
    
    const elapsedTime = clock.getElapsedTime();
    
    // Rotate toothbrush
    if (toothbrush) {
        toothbrush.rotation.y = elapsedTime * 0.5;
        toothbrush.rotation.x = Math.sin(elapsedTime * 0.3) * 0.1;
        toothbrush.position.y = Math.sin(elapsedTime * 0.8) * 0.2;
    }
    
    // Animate particles
    if (particles) {
        particles.rotation.y = elapsedTime * 0.1;
        particles.rotation.x = elapsedTime * 0.05;
    }
    
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// GSAP Animations
function initAnimations() {
    if (typeof gsap === 'undefined') {
        console.log('GSAP not available');
        return;
    }
    
    try {
        gsap.registerPlugin(ScrollTrigger);
        
        // Hero section animations - REMOVED as requested
        // Text will appear immediately without animation
        
        // Feature cards animation
        gsap.from('.feature-card', {
            scrollTrigger: {
                trigger: '.features-grid',
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse"
            },
            duration: 0.8,
            y: 50,
            opacity: 0,
            stagger: 0.2,
            ease: "power2.out"
        });
        
        // Tech specs animation
        gsap.from('.spec-card', {
            scrollTrigger: {
                trigger: '.specs-grid',
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse"
            },
            duration: 0.6,
            y: 30,
            opacity: 0,
            stagger: 0.1,
            ease: "power2.out"
        });
        
        // Section headers animation
        gsap.from('.section-header', {
            scrollTrigger: {
                trigger: '.section-header',
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            duration: 1,
            y: 50,
            opacity: 0,
            ease: "power2.out"
        });
        
    } catch (error) {
        console.error('GSAP animation setup failed:', error);
        // Ensure content is still visible if animations fail
        ensureVisibility();
    }
}

// Testimonials 3D Carousel functionality
function initTestimonials() {
    const testimonials = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (!testimonials.length) return;
    
    let currentIndex = 0;
    
    function updateCarousel() {
        testimonials.forEach((card, index) => {
            // Remove all position classes
            card.classList.remove('active', 'prev', 'next', 'far-prev', 'far-next');
            
            const diff = index - currentIndex;
            
            if (diff === 0) {
                card.classList.add('active');
            } else if (diff === -1 || (diff === testimonials.length - 1 && testimonials.length > 2)) {
                card.classList.add('prev');
            } else if (diff === 1 || (diff === -(testimonials.length - 1) && testimonials.length > 2)) {
                card.classList.add('next');
            } else if (diff < -1 || diff > testimonials.length / 2) {
                card.classList.add('far-prev');
            } else {
                card.classList.add('far-next');
            }
        });
    }
    
    function nextTestimonial() {
        currentIndex = (currentIndex + 1) % testimonials.length;
        updateCarousel();
    }
    
    function prevTestimonial() {
        currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
        updateCarousel();
    }
    
    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', nextTestimonial);
    if (prevBtn) prevBtn.addEventListener('click', prevTestimonial);
    
    // Click on side cards to navigate
    testimonials.forEach((card, index) => {
        card.addEventListener('click', () => {
            if (index !== currentIndex) {
                currentIndex = index;
                updateCarousel();
            }
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevTestimonial();
        } else if (e.key === 'ArrowRight') {
            nextTestimonial();
        }
    });
    
    // Auto-rotate testimonials
    let autoRotateInterval = setInterval(nextTestimonial, 6000);
    
    // Pause auto-rotate on hover
    const testimonialsContainer = document.querySelector('.testimonials-container');
    if (testimonialsContainer) {
        testimonialsContainer.addEventListener('mouseenter', () => {
            clearInterval(autoRotateInterval);
        });
        
        testimonialsContainer.addEventListener('mouseleave', () => {
            autoRotateInterval = setInterval(nextTestimonial, 6000);
        });
    }
    
    // Touch/swipe support for mobile
    let startX = 0;
    let startY = 0;
    let isScrolling = false;
    
    if (testimonialsContainer) {
        testimonialsContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isScrolling = false;
        });
        
        testimonialsContainer.addEventListener('touchmove', (e) => {
            if (!startX || !startY) return;
            
            const diffX = startX - e.touches[0].clientX;
            const diffY = startY - e.touches[0].clientY;
            
            if (!isScrolling) {
                isScrolling = Math.abs(diffY) > Math.abs(diffX);
            }
            
            if (!isScrolling && Math.abs(diffX) > 50) {
                e.preventDefault();
                if (diffX > 0) {
                    nextTestimonial();
                } else {
                    prevTestimonial();
                }
                startX = 0;
                startY = 0;
            }
        });
    }
    
    // Initialize carousel
    updateCarousel();
}

// Lottie Animation
function initLottieAnimation() {
    const lottieContainer = document.getElementById('lottieDemo');
    if (!lottieContainer || typeof lottie === 'undefined') return;
    
    // Create a simple loading animation since we don't have a specific Lottie file
    lottieContainer.innerHTML = `
        <div class="demo-placeholder">
            <div class="demo-animation">
                <div class="pulse-circle"></div>
                <div class="rotating-border"></div>
            </div>
            <p>Interactive Demo Coming Soon</p>
        </div>
    `;
    
    // Add CSS for the demo animation
    const style = document.createElement('style');
    style.textContent = `
        .demo-placeholder {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: var(--text-secondary);
        }
        
        .demo-animation {
            position: relative;
            width: 100px;
            height: 100px;
            margin-bottom: 2rem;
        }
        
        .pulse-circle {
            width: 60px;
            height: 60px;
            background: var(--gradient-primary);
            border-radius: 50%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            animation: pulse 2s infinite;
        }
        
        .rotating-border {
            width: 100px;
            height: 100px;
            border: 2px solid transparent;
            border-top: 2px solid var(--accent-blue);
            border-radius: 50%;
            animation: rotate 1s linear infinite;
        }
        
        @keyframes pulse {
            0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(1.4); opacity: 0; }
        }
        
        @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}

// Form Handlers
function initFormHandlers() {
    const signupForm = document.getElementById('signupForm');
    
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = signupForm.querySelector('input[type="email"]').value;
            
            // Simulate form submission
            showNotification('Thank you! You\'ve been added to our early access list.', 'success');
            signupForm.reset();
        });
    }
}

// Mobile Menu
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navMenu.classList.toggle('mobile-active');
        });
    }
}

// Utility Functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--glass-bg);
        border: 1px solid var(--glass-border);
        color: var(--text-primary);
        padding: 1rem 1.5rem;
        border-radius: 10px;
        backdrop-filter: blur(20px);
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    
    if (type === 'success') {
        notification.style.borderColor = '#28a745';
    } else if (type === 'error') {
        notification.style.borderColor = '#dc3545';
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    // CTA Button interactions
    const exploreBtn = document.getElementById('exploreBtn');
    if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
            document.querySelector('#features').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Feature card hover effects
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (typeof gsap !== 'undefined') {
                gsap.to(this.querySelector('.feature-icon'), { 
                    duration: 0.3, 
                    scale: 1.1, 
                    rotation: 360,
                    ease: "back.out(1.7)" 
                });
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (typeof gsap !== 'undefined') {
                gsap.to(this.querySelector('.feature-icon'), { 
                    duration: 0.3, 
                    scale: 1, 
                    rotation: 0,
                    ease: "back.out(1.7)" 
                });
            }
        });
    });
    
    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        
        if (hero && scrolled < window.innerHeight) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
});

// Loading screen HTML (to be added to body if needed)
const loadingHTML = `
    <div class="loading">
        <div class="loading-spinner"></div>
    </div>
`;

// Add loading screen if it doesn't exist
if (!document.querySelector('.loading')) {
    document.body.insertAdjacentHTML('afterbegin', loadingHTML);
}

// Performance optimization
window.addEventListener('load', () => {
    // Preload critical resources
    const criticalResources = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap'
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = resource;
        document.head.appendChild(link);
    });
});

// Export for debugging
window.SamsungToothbrush = {
    scene,
    camera,
    renderer,
    toothbrush,
    particles
};
