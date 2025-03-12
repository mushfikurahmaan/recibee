document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const successPopup = document.getElementById('successPopup');
    const popupContent = document.getElementById('popupContent');
    const closePopupButton = document.getElementById('closePopup');
    const waitlistForm = document.getElementById('waitlistForm');
    const emailInput = document.getElementById('email');
    const formStatus = document.getElementById('formStatus');
    const errorMessage = document.getElementById('errorMessage');

    // Counter Animation
    const counter = document.getElementById('cookCounter');
    if (counter) {
        const firstPhaseStart = 1900;
        const firstPhaseEnd = 2000;
        const finalTarget = 2048;
        
        // First phase: 1900 to 2000 (30 seconds)
        const firstPhaseDuration = 30000;
        const firstPhaseStep = 100;
        
        // Second phase: 2000 to 2048 (5 minutes)
        const secondPhaseDuration = 300000; // 5 minutes
        const secondPhaseStep = 200;
        
        let currentNumber = firstPhaseStart;
        
        // First phase animation (faster)
        const firstPhaseInterval = setInterval(() => {
            currentNumber += (firstPhaseEnd - firstPhaseStart) / (firstPhaseDuration / firstPhaseStep);
            if (currentNumber <= firstPhaseEnd) {
                counter.textContent = Math.round(currentNumber).toLocaleString();
            } else {
                clearInterval(firstPhaseInterval);
                
                // Start second phase (slower)
                currentNumber = firstPhaseEnd;
                const secondPhaseInterval = setInterval(() => {
                    currentNumber += (finalTarget - firstPhaseEnd) / (secondPhaseDuration / secondPhaseStep);
                    if (currentNumber <= finalTarget) {
                        counter.textContent = Math.round(currentNumber).toLocaleString();
                    } else {
                        counter.textContent = finalTarget.toLocaleString();
                        clearInterval(secondPhaseInterval);
                    }
                }, secondPhaseStep);
            }
        }, firstPhaseStep);
    }

    // Function to show success popup
    function showSuccess() {
        successPopup.classList.remove('hidden');
        setTimeout(() => {
            popupContent.style.transform = 'scale(1)';
            popupContent.style.opacity = '1';
        }, 10);
    }

    // Function to hide popup
    function hidePopup() {
        popupContent.style.transform = 'scale(0.95)';
        popupContent.style.opacity = '0';
        setTimeout(() => {
            successPopup.classList.add('hidden');
        }, 300);
    }

    // Function to show error
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
        formStatus.classList.remove('hidden');
        setTimeout(() => {
            errorMessage.classList.add('hidden');
            formStatus.classList.add('hidden');
        }, 5000);
    }

    // Handle form submission
    waitlistForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        
        if (!isValidEmail(email)) {
            showError('Please enter a valid email address.');
            return;
        }

        // Show loading state
        const submitButton = waitlistForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Submitting...';
        submitButton.disabled = true;

        // Simulate submission delay
        setTimeout(() => {
            showSuccess();
            waitlistForm.reset();
            
            // Reset button state
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        }, 1000);
    });

    // Close popup when clicking the close button
    closePopupButton.addEventListener('click', hidePopup);

    // Close popup when clicking outside
    successPopup.addEventListener('click', function(e) {
        if (e.target === successPopup) {
            hidePopup();
        }
    });

    // Close popup with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !successPopup.classList.contains('hidden')) {
            hidePopup();
        }
    });

    // Email validation function
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add animation on scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.feature-card');
        
        elements.forEach(element => {
            const position = element.getBoundingClientRect();
            
            // Check if element is in viewport
            if (position.top < window.innerHeight && position.bottom >= 0) {
                element.classList.add('animate__animated', 'animate__fadeInUp');
            }
        });
    };

    // Initial check on page load
    animateOnScroll();
    
    // Check on scroll
    window.addEventListener('scroll', animateOnScroll);

    // Mobile menu toggle (if needed)
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
}); 