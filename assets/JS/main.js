/* $(window).on("scroll", function() {
    var scrollPos = $(window).scrollTop();
    if (scrollPos <= 0) {
        $('.gos-header').addClass('top-of-page');
        $('.gos-header').removeClass('blurred');
    } else {
        $('.gos-header').removeClass('top-of-page');
        $('.gos-header').addClass('blurred');
    }
}); */

function show() {
    var x = document.getElementById("gos-info-tab");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }