// --- Original Commented Code (Keep or remove as desired) ---
// let cardElement;
// let prevRatio = 0.0;
// let increasingSize = "translate3d(0px, ratio-translate, 0px) scale3d(ratio-scale, ratio-scale, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)"
// let decreasingSize = "translate3d(0px, ratio-translate, 0px) scale3d(ratio-scale, ratio-scale, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)"

// window.addEventListener("load", (event) => {
//     cardElement = document.getElementsByClassName("sq-card")[0];
//     createShrinkObserver();
// }, false);
// ... (rest of commented observer code) ...
// function handleShrink(entries, observer) {
//     entries.forEach((entry) => {
//         entry.target.style.transform = increasingSize.replace("ratio-translate", (0) +"vh").replaceAll("ratio-scale", Math.max(0.7, (entry.intersectionRatio)));
//         prevRatio = entry.intersectionRatio;
//     });
// }
// --- End of Original Commented Code ---


// --- Global Variables ---
var hbgMenu; // Hamburger menu element
var menuList; // Navigation list element

// --- Function Definitions ---

/**
 * Checks if an element is fully within the browser viewport.
 * @param {Element|jQuery} el - The DOM element or jQuery object to check.
 * @returns {boolean} True if the element is fully in the viewport, false otherwise.
 */
function isElementInViewport(el) {
  // Handle jQuery object
  if (typeof jQuery === "function" && el instanceof jQuery) {
    el = el[0];
  }
  if (!el) return false; // Add check if element exists

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
 * Uses a threshold (0.4) to determine "partial".
 * @param {Element|jQuery} el - The DOM element or jQuery object to check.
 * @returns {boolean} True if the element is partially in the viewport, false otherwise.
 */
function isElementPartiallyInViewport(el) {
  // Handle jQuery object
  if (typeof jQuery === "function" && el instanceof jQuery) {
    el = el[0];
  }
   if (!el) return false; // Add check if element exists

  var rect = el.getBoundingClientRect(),
      windowHeight = (window.innerHeight || document.documentElement.clientHeight);

  // Calculate visibility percentage (simplified logic from original)
  const visibleHeight = Math.max(0, Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0));
  const visibilityRatio = rect.height > 0 ? visibleHeight / rect.height : 0;

  // Return true if at least 40% is visible (matches original threshold logic)
  return visibilityRatio >= 0.4;
}


/**
 * Adds fade-in animation classes to elements when they scroll into view.
 * Targets elements with class 'fade' or 'fade-card'.
 */
function animateFade() {
    // Source: https://codepen.io/shaylonh/pen/dXzpLW (Modified)
    // Use vanilla JS querySelectorAll for potentially better performance
    document.querySelectorAll('.fade').forEach(function(element) {
      if (isElementPartiallyInViewport(element)) {
        element.classList.add('after-fade');
      }
    });

    document.querySelectorAll('.fade-card').forEach(function(element) {
        if (isElementPartiallyInViewport(element)) {
            element.classList.add('after-fade-card');
        }
    });
}

/**
 * Updates the width of the scroll progress bar based on scroll position.
 * Source: https://www.w3schools.com/howto/howto_js_scroll_indicator.asp (Modified)
 */
function scrollIndicator() {
  var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  // Prevent division by zero if height is 0
  var scrolled = height > 0 ? (winScroll / height) * 100 : 0;
  var progressBar = document.getElementById("myBar");
  if (progressBar) { // Check if progress bar element exists
      progressBar.style.width = scrolled + "%";
  }
}

/**
 * Toggles the visibility of the mobile navigation menu.
 */
function toggleMenu() {
    if (menuList) { // Check if menuList exists
        if (menuList.style.maxHeight === "0px" || menuList.style.maxHeight === "") {
            menuList.style.maxHeight = "150px"; // Or calculate height: menuList.scrollHeight + "px";
            hbgMenu.setAttribute('aria-expanded', 'true'); // Update ARIA state
        } else {
            menuList.style.maxHeight = "0px";
            hbgMenu.setAttribute('aria-expanded', 'false'); // Update ARIA state
        }
    }
}


// --- Event Listeners ---

/**
 * Sets up initial animations, menu toggling, and finds menu elements
 * after the DOM is fully loaded.
 */
window.addEventListener('DOMContentLoaded', (event) => {
  // Trigger initial fade for elements already in view
  animateFade();

  // Apply intro fade effect immediately
  document.querySelectorAll('.intro').forEach(function(element) {
    element.classList.add('intro-after-fade');
  });

  // Get menu elements
  hbgMenu = document.querySelector(".hbg-menu"); // Use querySelector
  menuList = document.getElementById("menu-list");

  // Initialize menu state (closed)
  if (menuList) {
      menuList.style.maxHeight = "0px";
  }

  // Add click listener to hamburger menu button
  if (hbgMenu) {
      hbgMenu.addEventListener('click', toggleMenu);
  }
});


/**
 * Handles scroll events to trigger animations and update the scroll indicator.
 */
window.onscroll = function() {
  animateFade();      // Call the globally defined function
  scrollIndicator();  // Call the globally defined function
};
