document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('.nav-button');
    
    // Smooth scroll function
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            window.scrollTo({
                top: element.offsetTop - 20,
                behavior: 'smooth'
            });
        }
    };
    // Handle navigation button clicks
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const sectionId = button.dataset.section;
            scrollToSection(sectionId);
            
            // Update active state
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
    // Handle scroll events to update active section
    const handleScroll = () => {
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
                const sectionId = section.id;
                navButtons.forEach(button => {
                    if (button.dataset.section === sectionId) {
                        button.classList.add('active');
                    } else {
                        button.classList.remove('active');
                    }
                });
            }
        });
    };
    window.addEventListener('scroll', handleScroll);
    
    // Initial check for active section
    handleScroll();
});