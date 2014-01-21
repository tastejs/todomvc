'use strict';

function filtersPresenter(links) {
    links = $(links);

    links.click(function(e) {
        var $target = $(e.target);
        e.preventDefault();
        links.removeClass('selected');
        $target.addClass('selected');
        $.route($(this).attr("href"));
    });

    return links;
}
