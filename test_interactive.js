// Simple test for interactive toothbrush
console.log('Test script loaded');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, testing...');
    
    setTimeout(() => {
        console.log('Running test after delay...');
        
        const heroSection = document.querySelector('.hero');
        const toothbrushImg = document.querySelector('.hero-image img');
        const altImg = document.getElementById('heroImage');
        
        console.log('Hero section:', heroSection);
        console.log('Toothbrush img selector:', toothbrushImg);
        console.log('Alternative img:', altImg);
        
        const targetImg = toothbrushImg || altImg;
        
        if (targetImg) {
            console.log('Found image, setting up basic interaction...');
            
            // Simple click test
            targetImg.addEventListener('click', () => {
                console.log('Image clicked!');
                targetImg.style.transform = 'scale(1.2) rotate(180deg)';
                targetImg.style.transition = 'transform 0.5s ease';
                
                setTimeout(() => {
                    targetImg.style.transform = 'scale(1) rotate(0deg)';
                }, 500);
            });
            
            // Simple mouse move test
            if (heroSection) {
                heroSection.addEventListener('mousemove', (e) => {
                    const rect = heroSection.getBoundingClientRect();
                    const x = (e.clientX - rect.left - rect.width/2) / (rect.width/2);
                    const y = (e.clientY - rect.top - rect.height/2) / (rect.height/2);
                    
                    targetImg.style.transform = `rotateY(${x * 20}deg) rotateX(${-y * 15}deg)`;
                    targetImg.style.transition = 'transform 0.1s ease';
                });
                
                heroSection.addEventListener('mouseleave', () => {
                    targetImg.style.transform = 'rotateY(0deg) rotateX(0deg)';
                    targetImg.style.transition = 'transform 0.3s ease';
                });
            }
            
            console.log('Basic interaction setup complete');
        } else {
            console.error('No image found!');
        }
    }, 2000);
});
