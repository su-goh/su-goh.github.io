// previous card animation - shrink as scroll

// let cardElement;
// let prevRatio = 0.0;
// let increasingSize = "translate3d(0px, ratio-translate, 0px) scale3d(ratio-scale, ratio-scale, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)"
// let decreasingSize = "translate3d(0px, ratio-translate, 0px) scale3d(ratio-scale, ratio-scale, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)"

// window.addEventListener("load", (event) => {
//     cardElement = document.getElementsByClassName("sq-card")[0];
//     createShrinkObserver();
// }, false);

// window.addEventListener("load", (event) => {
//     cardElement = document.getElementsByClassName("sq-card")[1];
//     createShrinkObserver();
// }, false);

// window.addEventListener("load", (event) => {
//     cardElement = document.getElementsByClassName("sq-card")[2];
//     createShrinkObserver();
// }, false);

// function createShrinkObserver() {
//     let observer;
//     let options = {
//         root: null,
//         rootMargin: "100px",
//         threshold: generateThreshold()
//     };

//     observer = new IntersectionObserver(handleShrink, options);
//     observer.observe(cardElement);
// }

// function generateThreshold() {
//     let threshold = [];
//     let numSteps = 100;

//     for(let i = 0.0; i <= numSteps; i++) {
//         let ratio = i/numSteps;
//         threshold.push(ratio);
//     }

//     threshold.push(0.0);
//     return threshold;
// }

// function handleShrink(entries, observer) {
//     entries.forEach((entry) => {
//         // if (entry.intersectionRatio > prevRatio) {
//         //     entry.target.style.transform = increasingSize.replace("ratio-translate", 0 +"vh").replaceAll("ratio-scale", Math.max(0.7, entry.intersectionRatio + 0.2));
//         // } else {
//         //     entry.target.style.transform = increasingSize.replace("ratio-translate", 0 +"vh").replaceAll("ratio-scale", Math.max(0.7, entry.intersectionRatio - 0.2));
//         // }

//         entry.target.style.transform = increasingSize.replace("ratio-translate", (0) +"vh").replaceAll("ratio-scale", Math.max(0.7, (entry.intersectionRatio)));

//         prevRatio = entry.intersectionRatio;
//     });
// }

window.onscroll = function() {
  animateFade();
  scrollIndicator();
}

function animateIntro() {
    $.each($('.intro'), function(key, value) {
        $(value).addClass('intro-after-fade');
    });
}

var menuList = document.getElementById("menu-list");

window.addEventListener('click', function(event) {
  if (menuList == null) {
    menuList = document.getElementById("menu-list");
    menuList.style.maxHeight = "0px";
  }

  if(menuList.style.maxHeight == "0px") {
    menuList.style.maxHeight = "150px";
  } else {
    menuList.style.maxHeight = "0px";
  }
});


function animateFade() {
    // https://codepen.io/shaylonh/pen/dXzpLW
    $.each($('.fade'), function(key, value) {
      if (isElementInViewport($(value))) {
        $(value).addClass('after-fade');
      }
    });

    $.each($('.fade-card'), function(key, value) {
        if (isElementPartiallyInViewport($(value))) {
            $(value).addClass('after-fade-card');
        }
      });

    // $.each($('.fade-in'), function(key, value) {
    //     if (isElementInViewport($(value))) {
    //         i = 1
    //         $('.fade-in').each().setTimeout(() => {
    //             console.log('hello')
    //             $(this).addClass('after-fade-in')
    //             i += 1
    //         }, 500*i);
    //     }
    //   });
}
  
// http://stackoverflow.com/a/7557433/5628
function isElementInViewport(el) {
  
    //special bonus for those using jQuery
    if (typeof jQuery === "function" && el instanceof jQuery) {
      el = el[0];
    }
  
    var rect = el.getBoundingClientRect();
  
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
      rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
}

function isElementPartiallyInViewport(el) {

    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }  

    var rect = el.getBoundingClientRect(),
    windowHeight = (window.innerHeight || document.documentElement.clientHeight);

    return !(
    Math.floor(100 - (((rect.top >= 0 ? 0 : rect.top) / +-rect.height) * 100)) < 0.4 ||
    Math.floor(100 - ((rect.bottom - windowHeight) / rect.height) * 100) < 0.4
    )
}

// credit: https://www.w3schools.com/howto/howto_js_scroll_indicator.asp
function scrollIndicator() {
  var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  var scrolled = (winScroll / height) * 100;
  document.getElementById("myBar").style.width = scrolled + "%";
}