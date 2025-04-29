// js/main.js - Main JavaScript File (Enhanced Mobile Features & Content Updates)

document.addEventListener('DOMContentLoaded', () => {
  // --- Mobile Navigation Toggle ---
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu'); // Still targets the ul element
  const navGroup = document.querySelector('.nav-group'); // Select the nav-group wrapper

  if (navToggle && navMenu && navGroup) {
    navToggle.addEventListener('click', () => {
      // Toggle the 'is-active' class on the button for hamburger animation
      navToggle.classList.toggle('is-active');

      // Toggle the 'is-open' class on the nav-menu for showing/hiding
      // On mobile, we want to show/hide the nav-menu directly
      // On larger screens, the nav-menu is always visible (controlled by CSS)
      if (window.innerWidth <= 767.98) { // Check if we are on a mobile screen size
           navMenu.classList.toggle('is-open');
           // Also toggle display on the nav-group for mobile
           // Using style.display directly here to override potential CSS on small screens
           navGroup.style.display = navMenu.classList.contains('is-open') ? 'flex' : 'none';
      }


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
        // Hide the nav-group again on mobile after clicking a link
        if (window.innerWidth <= 767.98) {
             navGroup.style.display = 'none';
        }
        document.body.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Handle window resize to ensure correct menu state
    window.addEventListener('resize', () => {
        if (window.innerWidth > 767.98) {
            // If resized to larger than mobile, ensure menu is visible and classes are removed
            navMenu.classList.remove('is-open');
            navToggle.classList.remove('is-active');
            document.body.classList.remove('nav-open');
            navToggle.setAttribute('aria-expanded', 'false');
            // Ensure nav-group is displayed on larger screens
            navGroup.style.display = 'flex';
        } else {
             // If resized to mobile, ensure nav-group display matches nav-menu state
             navGroup.style.display = navMenu.classList.contains('is-open') ? 'flex' : 'none';
        }
    });

     // Set initial state on load based on window width
     if (window.innerWidth <= 767.98) {
         navGroup.style.display = 'none'; // Hide nav-group initially on mobile
     } else {
         navGroup.style.display = 'flex'; // Show nav-group initially on larger screens
     }

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
       // Check if navToggle and navMenu exist before accessing their properties
       if (navToggle && navMenu && navMenu.classList.contains('is-open')) {
            navToggle.classList.remove('is-active');
            navMenu.classList.remove('is-open');
            // Hide the nav-group again on mobile after clicking a link
            if (window.innerWidth <= 767.98) {
                 navGroup.style.display = 'none';
            }
            document.body.classList.remove('nav-open');
            navToggle.setAttribute('aria-expanded', 'false');
       }
    });
  });

  // --- Gallery Modal Functionality ---
  const modal = document.getElementById('portfolioModal');
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalText = document.getElementById('modalText');
  const closeButton = document.querySelector('.close-button');
  const prevButton = document.querySelector('.prev-button');
  const nextButton = document.querySelector('.next-button');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  const modalImageContainer = document.querySelector('.modal-image-container'); // Get the image container

  let currentItemIndex = 0; // To keep track of the currently displayed item

  // Function to update the modal content based on an item index
  function updateModalContent(index) {
      if (index >= 0 && index < portfolioItems.length) {
          const item = portfolioItems[index];
          const imageSrc = item.getAttribute('data-image-src');
          const title = item.getAttribute('data-title');
          const description = item.getAttribute('data-description');

          modalImage.src = imageSrc;
          modalImage.alt = title; // Use title as alt text for accessibility
          modalTitle.textContent = title;
          // Use innerHTML to render the HTML tags (like <br> and <a>) in the description
          modalText.innerHTML = description;
          currentItemIndex = index; // Update the current index
      }
  }

  // Function to open the modal
  function openModal(index) {
    updateModalContent(index); // Load content for the clicked item
    modal.classList.add('is-open'); // Add class to show modal
    document.body.classList.add('modal-open'); // Prevent body scrolling
  }

  // Function to close the modal
  function closeModal() {
    modal.classList.add('is-closing'); // Add class for closing animation
    modal.addEventListener('animationend', function handleAnimationEnd() {
      modal.classList.remove('is-open', 'is-closing'); // Remove classes after animation
      document.body.classList.remove('modal-open'); // Re-enable body scrolling
      modal.removeEventListener('animationend', handleAnimationEnd); // Clean up the event listener
    });
  }

  // Add click listeners to portfolio items to open the modal
  portfolioItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      openModal(index); // Open modal with the index of the clicked item
    });
  });

  // Add click listener to the close button
  if (closeButton) { // Check if closeButton exists
      closeButton.addEventListener('click', closeModal);
  }


  // Add click listeners for navigation buttons
  if (prevButton && nextButton) {
      prevButton.addEventListener('click', (e) => {
          e.stopPropagation(); // Prevent click from closing modal
          const prevIndex = (currentItemIndex - 1 + portfolioItems.length) % portfolioItems.length;
          updateModalContent(prevIndex);
      });

      nextButton.addEventListener('click', (e) => {
          e.stopPropagation(); // Prevent click from closing modal
          const nextIndex = (currentItemIndex + 1) % portfolioItems.length;
          updateModalContent(nextIndex);
      });
  }

  // --- Touch Swipe Navigation for Modal Image ---
  if (modalImageContainer && prevButton && nextButton) {
      let touchStartX = 0;
      let touchEndX = 0;
      const swipeThreshold = 50; // Minimum distance in pixels for a swipe

      modalImageContainer.addEventListener('touchstart', (e) => {
          touchStartX = e.changedTouches[0].screenX;
      }, false);

      modalImageContainer.addEventListener('touchmove', (e) => {
          touchEndX = e.changedTouches[0].screenX;
      }, false);

      modalImageContainer.addEventListener('touchend', (e) => {
          // If touchEndX is 0, it means touchmove didn't fire (e.g., a tap)
          if (touchEndX === 0) {
              // Handle as a tap if needed, or just ignore
          } else {
              handleSwipe();
          }
          // Reset touch positions
          touchStartX = 0;
          touchEndX = 0;
      }, false);

      function handleSwipe() {
          const swipeDistance = touchEndX - touchStartX;

          if (swipeDistance > swipeThreshold) {
              // Swipe right (go to previous)
              prevButton.click(); // Simulate click on previous button
          } else if (swipeDistance < -swipeThreshold) {
              // Swipe left (go to next)
              nextButton.click(); // Simulate click on next button
          }
      }
  }


  // Close the modal if the user clicks outside of the modal content
  window.addEventListener('click', (event) => {
    // Check if the click target is the modal background itself, not inside the modal-content
    if (event.target === modal) {
      closeModal();
    }
  });

  // Close the modal if the user presses the Escape key
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  // Allow navigation with arrow keys when modal is open
  document.addEventListener('keydown', (event) => {
      if (modal.classList.contains('is-open')) {
          if (event.key === 'ArrowLeft') {
              // Check if prevButton exists before simulating click
              if (prevButton) prevButton.click();
          } else if (event.key === 'ArrowRight') {
              // Check if nextButton exists before simulating click
              if (nextButton) nextButton.click();
          }
      }
  });


  // --- Image Lazy Loading ---
  // Select all images with the 'lazy-img' class
  const lazyImages = document.querySelectorAll('img.lazy-img');

  // Check if IntersectionObserver is supported for lazy loading
  if ('IntersectionObserver' in window) {
      const lazyImageObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
              if (entry.isIntersecting) {
                  const lazyImage = entry.target;
                  // Load the image from the data-src attribute
                  lazyImage.src = lazyImage.dataset.src;
                  // Optional: Add a class when loaded for styling purposes
                  lazyImage.classList.remove('lazy-img');
                  lazyImage.classList.add('loaded');
                  // Stop observing the image
                  observer.unobserve(lazyImage);
              }
          });
      });

      // Observe each lazy image
      lazyImages.forEach(lazyImage => {
          lazyImageObserver.observe(lazyImage);
      });
  } else {
      // Fallback for browsers that do not support IntersectionObserver
      // Load all lazy images immediately
      lazyImages.forEach(lazyImage => {
          lazyImage.src = lazyImage.dataset.src;
          lazyImage.classList.remove('lazy-img');
          lazyImage.classList.add('loaded');
      });
  }


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
