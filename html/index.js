function onScreen() {
    // Check if the top of the page collides with each section
    $('.section').each(function() {
        var windowScroll = $(document).scrollTop();
        var navHeight = $('.nav ul').height();

        // Complex line checks if windowScroll (top of page) + nav bar hits Section Top / Bottom
        if( windowScroll + navHeight >= $(this).offset().top && windowScroll + navHeight <= $(this).offset().top + $(this).height()) {
            // This section is active! Add Highlight
            $('.nav ul li a#nav-' + $(this).attr('id')).addClass('highlight');
        } else {
            // No - Remove highlight class
            $('.nav ul li a#nav-' + $(this).attr('id')).removeClass('highlight');
        }

    });
}

$(window).on('scroll resize', function () {
    onScreen();
});