$(window).on("scroll", function() {
    var scrollPos = $(window).scrollTop();
    if (scrollPos <= 0) {
        $('.gos-header').addClass('top-of-page');
        $('.gos-header').removeClass('blurred');
    } else {
        $('.gos-header').removeClass('top-of-page');
        $('.gos-header').addClass('blurred');
    }
});