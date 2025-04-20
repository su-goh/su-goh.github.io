// --- Global Variables ---
var hbgMenu; // Hamburger menu element
var menuList; // Navigation list element
var imageModal; // The image modal element
var modalImage; // The image element inside the modal
var closeModalBtn; // The close button for the modal

// --- Variables for Scroll Effect ---
var scrollContainer;
var cardViewport; // Optional, might not be needed directly by JS
var effectCards = [];
var isThrottled = false; // Flag for throttling scroll handler
var throttleDuration = 50; // Milliseconds to throttle scroll updates

// --- Function Definitions ---

/**
 * Checks if an element is fully within the browser viewport.
 */
function isElementInViewport(el) {
  if (typeof jQuery === "function" && el instanceof jQuery) {
    el = el[0];
  }
  if (!el) return false;
  var rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Checks if an element is partially within the browser viewport.
 */
function isElementPartiallyInViewport(el) {
  if (typeof jQuery === "function" && el instanceof jQuery) {
    el = el[0];
  }
   if (!el) return false;
  var rect = el.getBoundingClientRect(),
      windowHeight = (window.innerHeight || document.documentElement.clientHeight);
  const visibleHeight = Math.max(0, Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0));
  const visibilityRatio = rect.height > 0 ? visibleHeight / rect.height : 0;
  return visibilityRatio >= 0.4;
}


/**
 * Adds fade-in animation classes to elements when they scroll into view.
 */
function animateFade() {
    document.querySelectorAll('.fade').forEach(function(element) {
      if (isElementPartiallyInViewport(element)) {
        element.classList.add('after-fade');
      }
    });
    // Note: .fade-card is used by both project types now
    document.querySelectorAll('.fade-card').forEach(function(element) {
        // Don't apply initial fade to the scroll effect cards, JS handles them
        if (!element.classList.contains('yt-effect-card') && isElementPartiallyInViewport(element)) {
            element.classList.add('after-fade-card');
        }
    });
}

/**
 * Updates the width of the scroll progress bar based on scroll position.
 */
function scrollIndicator() {
  var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  var scrolled = height > 0 ? (winScroll / height) * 100 : 0;
  var progressBar = document.getElementById("myBar");
  if (progressBar) {
      progressBar.style.width = scrolled + "%";
  }
}

/**
 * Toggles the visibility of the mobile navigation menu.
 */
function toggleMenu() {
    if (menuList) {
        if (menuList.style.maxHeight === "0px" || menuList.style.maxHeight === "") {
            menuList.style.maxHeight = "150px";
            if(hbgMenu) hbgMenu.setAttribute('aria-expanded', 'true');
        } else {
            menuList.style.maxHeight = "0px";
             if(hbgMenu) hbgMenu.setAttribute('aria-expanded', 'false');
        }
    }
}

/**
 * Opens the image modal and displays the clicked image.
 */
function openImageModal(event) {
    if (event.target.classList.contains('clickable-yt-img')) {
        if (imageModal && modalImage) {
            imageModal.style.display = "flex";
            modalImage.src = event.target.src;
        }
    }
}

/**
 * Closes the image modal.
 */
function closeImageModal() {
    if (imageModal) {
        imageModal.style.display = "none";
    }
}

/**
 * Handles the scroll-driven animation for YouTube project cards.
 */
function handleScrollEffect() {
    if (!scrollContainer || effectCards.length === 0) return;

    const containerRect = scrollContainer.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const numCards = effectCards.length;
    if (numCards === 0) return; // Avoid division by zero if no cards

    // Calculate progress: 0 when top enters viewport bottom, 1 when top reaches viewport top
    const scrollDistance = viewportHeight - containerRect.top;
    const animationDistance = containerRect.height; // Total height over which animation occurs

    let progress = 0;
    if (animationDistance > 0) {
        // Ensure progress doesn't exceed 1 even if container is shorter than viewport
        progress = Math.max(0, Math.min(1, scrollDistance / (animationDistance - viewportHeight) ));
        // Clamp progress strictly between 0 and 1
         progress = Math.max(0, Math.min(1, progress));
    }


    // Determine which card should be active based on progress
    // Map progress (0-1) to the index range (0 to numCards - 1)
    const segment = progress * (numCards - 1);
    // FIX: Use floor to make cards active for longer, clamp to ensure valid index
    let activeIndex = Math.floor(segment);
    activeIndex = Math.min(activeIndex, numCards - 1); // Clamp index

    // Apply classes based on index relative to activeIndex
    effectCards.forEach((card, index) => {
        card.classList.remove('is-active', 'is-next', 'is-stacked', 'is-exiting');

        if (index < activeIndex) {
            card.classList.add('is-exiting'); // Card has passed
        } else if (index === activeIndex) {
            card.classList.add('is-active'); // Current card
        } else if (index === activeIndex + 1) {
            card.classList.add('is-next'); // Next card in stack
        } else if (index === activeIndex + 2) {
            card.classList.add('is-stacked'); // Card further down stack
        }
        // Cards further than index + 2 will have no extra class (and default opacity 0)
    });
}

/**
 * Throttles the execution of a function.
 */
function throttle(func, duration) {
  let timeoutId = null;
  let lastArgs = null;
  let trailingCallScheduled = false;

  function throttled(...args) {
    lastArgs = args;
    if (!timeoutId) {
      func.apply(this, lastArgs);
      timeoutId = setTimeout(() => {
        timeoutId = null;
        if (trailingCallScheduled) {
          throttled.apply(this, lastArgs);
          trailingCallScheduled = false;
        }
      }, duration);
    } else {
      trailingCallScheduled = true;
    }
  }

  throttled.cancel = () => {
    clearTimeout(timeoutId);
    timeoutId = null;
    trailingCallScheduled = false;
  };

  return throttled;
}


// --- Event Listeners ---

/**
 * Sets up initial state and listeners after the DOM is loaded.
 */
window.addEventListener('DOMContentLoaded', (event) => {
  // Initial Setup
  animateFade();
  document.querySelectorAll('.intro').forEach(element => element.classList.add('intro-after-fade'));

  // Menu Setup
  hbgMenu = document.querySelector(".hbg-menu");
  menuList = document.getElementById("menu-list");
  if (menuList) menuList.style.maxHeight = "0px";
  if (hbgMenu) hbgMenu.addEventListener('click', toggleMenu);

  // Modal Setup
  imageModal = document.getElementById("imageModal");
  modalImage = document.getElementById("modalImage");
  closeModalBtn = document.querySelector(".close-modal");
  var clickableImageContainer = document.querySelector("#youtube-projects") || document.body;
  clickableImageContainer.addEventListener('click', openImageModal);
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeImageModal);
  if (imageModal) {
    imageModal.addEventListener('click', (e) => { if (e.target === imageModal) closeImageModal(); });
  }

  // Scroll Effect Setup
  scrollContainer = document.getElementById("yt-scroll-effect-container");
  cardViewport = document.querySelector(".yt-card-viewport");
  if (scrollContainer) {
      effectCards = Array.from(scrollContainer.querySelectorAll(".yt-effect-card"));
      // Initial call to set card states if container is already in view
      handleScrollEffect();
  }

});


/**
 * Handles scroll events (throttled).
 */
const throttledScrollHandler = throttle(handleScrollEffect, throttleDuration);

window.addEventListener('scroll', () => {
    animateFade();
    scrollIndicator();
    // Only run the effect handler if the container exists
    if (scrollContainer) {
        throttledScrollHandler();
    }
});
