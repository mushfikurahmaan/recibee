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
    const submitButton = waitlistForm.querySelector('button[type="submit"]');

    // Add transition classes to button
    submitButton.classList.add('transition-all', 'duration-300', 'ease-in-out');

    // Check if user has already joined
    if (localStorage.getItem('waitlistJoined')) {
        setSuccessState();
    }

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
    const supabaseUrl = process.env.SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_KEY || '';
    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

    // Function to set success state with animation
    function setSuccessState() {
        submitButton.style.width = `${submitButton.offsetWidth}px`; // Preserve width
        submitButton.classList.add('success-animation');
        
        // Fade out current text
        submitButton.style.opacity = '0';
        setTimeout(() => {
            submitButton.innerHTML = '<i class="fas fa-check"></i> You\'re Set';
            submitButton.classList.remove('btn-primary');
            submitButton.classList.add('btn-success');
            submitButton.style.opacity = '1';
        }, 300);

        submitButton.disabled = true;
        emailInput.disabled = true;
    }

    // Function to set loading state with animation
    function setLoadingState() {
        submitButton.style.width = `${submitButton.offsetWidth}px`; // Preserve width
        submitButton.style.opacity = '0';
        setTimeout(() => {
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Joining...';
            submitButton.style.opacity = '1';
        }, 300);
        submitButton.disabled = true;
    }

    // Function to reset button state with animation
    function resetButtonState() {
        submitButton.style.opacity = '0';
        setTimeout(() => {
            submitButton.innerHTML = 'Join Waitlist';
            submitButton.disabled = false;
            submitButton.style.opacity = '1';
        }, 300);
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
        
        if (localStorage.getItem('waitlistJoined')) {
            return;
        }
        
        const email = emailInput.value.trim();
        
        if (!isValidEmail(email)) {
            showError('Please enter a valid email address');
            return;
        }
        
        setLoadingState();
        
        try {
            const { data, error } = await supabase
                .from('waitlist')
                .insert([{ email }]);

            if (error) {
                if (error.code === '23505') {
                    showError('This email is already registered');
                } else {
                    showError('Something went wrong. Please try again.');
                }
                resetButtonState();
                return;
            }

            setSuccessState();
            
            localStorage.setItem('waitlistJoined', 'true');
            localStorage.setItem('waitlistEmail', email);

            const currentCount = parseInt(counter.textContent.replace(/,/g, ''));
            animateCounter(counter, currentCount + 1);

        } catch (error) {
            console.error('Error:', error);
            showError('Something went wrong. Please try again.');
            resetButtonState();
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

// Add this CSS to your input.css file
const style = document.createElement('style');
style.textContent = `
    .success-animation {
        transition: all 0.3s ease-in-out;
    }
    .success-animation:disabled {
        cursor: default;
    }
`;
document.head.appendChild(style); 