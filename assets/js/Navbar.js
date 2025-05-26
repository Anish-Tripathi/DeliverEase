// Elements 
const header = document.querySelector('[data-header]');
const navTogglers = document.querySelectorAll('[data-nav-toggler]');
const navbar = document.querySelector('[data-navbar]');
const overlay = document.querySelector('[data-overlay]');
const navLinks = document.querySelectorAll('[data-nav-link]');

// Handle navbar toggling for mobile
navTogglers.forEach(toggler => {
  toggler.addEventListener('click', () => {
    navbar.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.classList.toggle('nav-active');
  });
});

// Close mobile menu when clicking nav links
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navbar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.classList.remove('nav-active');

    // Handle redirection to index.html for specific links
    const href = link.getAttribute('href');
    if (href.includes('#') && !href.startsWith('#') && 
        !href.includes('OrderPage.html') && !href.includes('TrackOrder.html')) {
      // This is an internal link pointing to index.html with an anchor
      // No need for additional code as the href will handle the navigation
    }
  });
});

// Add scroll effect to header
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Set active link based on current section
function setActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  
  window.addEventListener('scroll', () => {
    let scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute('id');
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document.querySelector(`.navbar-link[href*="#${sectionId}"]`)?.classList.add('active');
      } else {
        document.querySelector(`.navbar-link[href*="#${sectionId}"]`)?.classList.remove('active');
      }
    });
  });
}

// Initialize functions when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  setActiveLink();
  
  // Set initial active link based on URL hash
  const hash = window.location.hash;
  if (hash) {
    document.querySelector(`.navbar-link[href*="${hash}"]`)?.classList.add('active');
  } else {
    // Set home as active by default if no hash
    document.querySelector('.navbar-link[href*="#home"]')?.classList.add('active');
  }
});