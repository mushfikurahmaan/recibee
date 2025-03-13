document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const successPopup = document.getElementById('successPopup');
    const popupContent = document.getElementById('popupContent');
    const closePopupButton = document.getElementById('closePopup');
    const waitlistForm = document.getElementById('waitlistForm');
    const emailInput = document.getElementById('email');
    const formStatus = document.getElementById('formStatus');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');

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

    // Initialize Supabase client
    const supabaseUrl = 'https://nrucuekfxsgsiguelnuy.supabase.co'
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ydWN1ZWtmeHNnc2lndWVsbnV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4MzcwNDMsImV4cCI6MjA1NzQxMzA0M30.BfMvbOyB6AflVUWGyL88B7Eeo6rW9fXBbFVYnuHU3QM'
    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey)

    // Animate cook counter
    function animateCounter(element, target, duration = 2000) {
        const start = parseInt(element.textContent.replace(/,/g, ''))
        const increment = (target - start) / (duration / 16)
        let current = start

        const updateCounter = () => {
            current += increment
            if ((increment > 0 && current >= target) || (increment < 0 && current <= target)) {
                element.textContent = target.toLocaleString()
                return
            }
            element.textContent = Math.round(current).toLocaleString()
            requestAnimationFrame(updateCounter)
        }

        updateCounter()
    }

    // Email validation function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email) && email.includes('.');
    }

    // Show error message
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
    waitlistForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const submitButton = waitlistForm.querySelector('button[type="submit"]');
        
        // Validate email
        if (!isValidEmail(email)) {
            showError('Please enter a valid email address');
            return;
        }
        
        // Disable form while submitting
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Joining...';
        
        try {
            // Insert email into Supabase
            const { data, error } = await supabase
                .from('waitlist')
                .insert([{ email }]);

            if (error) {
                if (error.code === '23505') { // Unique constraint violation
                    showError('This email is already registered');
                } else {
                    showError('Something went wrong. Please try again.');
                }
                return;
            }

            // Show success popup
            successPopup.classList.remove('hidden');
            popupContent.classList.remove('scale-95', 'opacity-0');

            // Update counter
            const currentCount = parseInt(counter.textContent.replace(/,/g, ''));
            animateCounter(counter, currentCount + 1);

            // Reset form
            waitlistForm.reset();

        } catch (error) {
            console.error('Error:', error);
            showError('Something went wrong. Please try again.');
        } finally {
            // Re-enable form
            submitButton.disabled = false;
            submitButton.textContent = 'Join Waitlist';
        }
    });

    // Handle popup close
    closePopupButton.addEventListener('click', () => {
        popupContent.classList.add('scale-95', 'opacity-0')
        setTimeout(() => {
            successPopup.classList.add('hidden')
        }, 300)
    })

    // Close popup when clicking outside
    successPopup.addEventListener('click', (e) => {
        if (e.target === successPopup) {
            popupContent.classList.add('scale-95', 'opacity-0')
            setTimeout(() => {
                successPopup.classList.add('hidden')
            }, 300)
        }
    })

    // Initialize counter animation on load
    document.addEventListener('DOMContentLoaded', () => {
        animateCounter(counter, 1900)
    })

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