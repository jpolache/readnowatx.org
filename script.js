// ReadNow ATX - Navigation and Interactivity

document.addEventListener('DOMContentLoaded', function() {
  
  // Mobile navigation toggle
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  if (navToggle) {
    navToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      mainNav.classList.toggle('active');
    });
  }

  // Close mobile nav when clicking outside
  document.addEventListener('click', function(e) {
    if (mainNav && !e.target.closest('header')) {
      mainNav.classList.remove('active');
    }
  });

  // Handle dropdown submenus on mobile
  const navItems = document.querySelectorAll('#mainNav > ul > li');
  navItems.forEach(item => {
    const submenu = item.querySelector('ul');
    if (submenu) {
      item.addEventListener('click', function(e) {
        // Only toggle on mobile
        if (window.innerWidth <= 768) {
          e.preventDefault();
          e.stopPropagation();
          item.classList.toggle('active');
        }
      });
    }
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // Form validation helper
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      // Basic validation is handled by HTML5 attributes
      // Add custom validation here if needed
      console.log('Form submitted:', form);
    });
  });

});

// Utility function to check if viewport is mobile
function isMobile() {
  return window.innerWidth <= 768;
}

// Auto-close mobile nav on window resize
window.addEventListener('resize', function() {
  const mainNav = document.getElementById('mainNav');
  if (!isMobile() && mainNav) {
    mainNav.classList.remove('active');
  }
});
