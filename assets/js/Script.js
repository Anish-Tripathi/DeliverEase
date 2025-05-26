'use strict';



document.addEventListener('DOMContentLoaded', function () {
  // Handle logout button click
  document.getElementById('logoutButton').addEventListener('click', function (event) {
      event.preventDefault(); // Prevent default link behavior
      
      // Optionally, you can clear user session data here
      // For example, if you have user information in localStorage
      localStorage.removeItem('currentUser'); // Adjust as necessary for your app
      
      // Redirect to login page
      window.location.href = 'login.html';
  });
});

const navbar = document.querySelector("[data-navbar]");
const navToggler = document.querySelectorAll("[data-nav-toggler]");
const navLinks = document.querySelectorAll("[data-nav-link]");
const overlay = document.querySelector("[data-overlay]");

for (let i = 0; i < navToggler.length; i++) {
  navToggler[i].addEventListener("click", function () {
    navbar.classList.toggle("active");
    overlay.classList.toggle("active");
  });
}

for (let i = 0; i < navLinks.length; i++) {
  navLinks[i].addEventListener("click", function () {
    navbar.classList.remove("active");
    overlay.classList.remove("active");
  });
}



/**
 * header
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

window.addEventListener("scroll", function () {
  if (window.scrollY >= 100) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
});