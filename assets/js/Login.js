document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Basic validation
            if (!username || !password) {
                alert('Please fill in all fields');
                return;
            }
            
            // Here you would typically send the login data to your server
            // For demo purposes, let's just simulate a successful login
            
            // Show loading state
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Logging in...';
            submitButton.disabled = true;
            
            // Simulate network request
            setTimeout(() => {
                // Redirect to main page after successful login
                window.location.href = 'Index.html';
                
                // Reset button state (in case the redirect fails)
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 1000);
        });
    }
    
    // Mobile navigation toggle
    const navTogglers = document.querySelectorAll('[data-nav-toggler]');
    const navbar = document.querySelector('[data-navbar]');
    const overlay = document.querySelector('[data-overlay]');
    
    for (let i = 0; i < navTogglers.length; i++) {
        navTogglers[i].addEventListener('click', function() {
            navbar.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.classList.toggle('nav-active');
        });
    }
});