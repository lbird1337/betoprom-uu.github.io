// js/main.js - Main JavaScript File (Updated with Portfolio Click)

document.addEventListener('DOMContentLoaded', () => {
  // --- Mobile Navigation Toggle ---
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu'); // Still targets the ul element

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      // Toggle the 'is-active' class on the button for hamburger animation
      navToggle.classList.toggle('is-active');
      // Toggle the 'is-open' class on the menu for showing/hiding
      navMenu.classList.toggle('is-open');
      // Optional: Prevent body scrolling when menu is open
      document.body.classList.toggle('nav-open');
      // Update aria-expanded attribute for accessibility
      const isExpanded = navToggle.classList.contains('is-active');
      navToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Close the mobile menu when a link is clicked
    // This now applies to all links within the nav-menu, including any buttons added there for mobile
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        // Close the menu for all links inside the nav-menu
        navToggle.classList.remove('is-active');
        navMenu.classList.remove('is-open');
        document.body.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --- Scroll Reveal Animation ---
  // Check if IntersectionObserver is supported
  if ('IntersectionObserver' in window) {
    const revealElements = document.querySelectorAll('[data-reveal]');

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add the 'is-visible' class when element is in viewport
          entry.target.classList.add('is-visible');
          // Stop observing once the element is visible
          observer.unobserve(entry.target);
        }
      });
    }, {
      // Options for the observer
      rootMargin: '0px', // Default is 0px
      threshold: 0.1 // Trigger when 10% of the element is visible
    });

    // Observe each element with the data-reveal attribute
    revealElements.forEach(element => {
      observer.observe(element);
    });
  } else {
    // Fallback for browsers that do not support IntersectionObserver
    // You could add a class to reveal all elements by default here if needed
    document.querySelectorAll('[data-reveal]').forEach(element => {
      element.classList.add('is-visible');
    });
  }

  // --- Smooth Scrolling for Navigation Links ---
  // Selects all links with href starting with #, including those with btn-primary class
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      // Prevent default for all internal links for smooth scrolling
      // This is the desired behavior for all internal navigation links, including buttons that link to sections
      e.preventDefault();

      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        // Get the height of the fixed header
        const headerHeight = document.querySelector('.site-header').offsetHeight;
        // Calculate the position to scroll to, accounting for the header height
        // Add a small offset (e.g., 10px) to prevent content from being directly under the header
        const scrollToPosition = targetElement.offsetTop - headerHeight - 10;


        window.scrollTo({
          top: scrollToPosition,
          behavior: 'smooth'
        });

        // Update the URL hash without triggering a jump
        // Only update hash for internal links, not external ones if any are added later
        if (targetId.startsWith('#')) {
             history.pushState(null, null, targetId);
        }
      }

       // Close mobile menu after clicking a link (if it's open)
       if (navToggle && navMenu && navMenu.classList.contains('is-open')) {
            navToggle.classList.remove('is-active');
            navMenu.classList.remove('is-open');
            document.body.classList.remove('nav-open');
            navToggle.setAttribute('aria-expanded', 'false');
       }
    });
  });

  // --- Portfolio Item Click to Expand/Collapse Details ---
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  portfolioItems.forEach(item => {
    // Add click listener to the entire portfolio item
    item.addEventListener('click', () => {
      // Toggle the 'is-expanded' class on the clicked item
      item.classList.toggle('is-expanded');

      // Optional: Close other expanded items when one is clicked
      portfolioItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('is-expanded')) {
          otherItem.classList.remove('is-expanded');
        }
      });
    });
  });


  // --- Header Scroll Effect (Optional - if you want the header to change on scroll) ---
  // Uncomment and modify if you have a .scrolled class in your CSS
  /*
  const siteHeader = document.querySelector('.site-header');
  if (siteHeader) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) { // Adjust scroll threshold as needed
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    });
  }
  */

});
