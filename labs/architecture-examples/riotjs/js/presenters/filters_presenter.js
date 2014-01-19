'use strict';

function filtersPresenter(links) {
    links.click(function(e) {
        var $target = $(e.target);
        e.preventDefault();
        links.removeClass('selected');
        $target.addClass('selected');
        $.route($(this).attr("href"));
    });
}
