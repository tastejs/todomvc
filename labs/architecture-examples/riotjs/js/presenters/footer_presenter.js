'use strict';

function footerPresenter(element, options) {
    var todo = options.model,
        template = options.template,
        filter = "#/";

    // Bind user events
    element.on('click', '#filters a', function(e){
        var $target = $(e.target);
        e.preventDefault();
        filter = $target.attr("href");
        $.route(filter);
    });

    // Bind model events
    todo.on('add remove toggle load', counts);

    function counts() {
        var data = getData(), hash = location.hash;
        element.html($.render(template, data));
        $('a[href="'+ filter +'"]', element).addClass('selected');
        toggle(data);
    }

    function toggle(data) {
        var showClear = (data.completed > 0),
            showFooter = (data.active + data.completed > 0);

        element.toggle(showFooter);
        $('#clear-completed', element).toggle(showClear);
    }

    function getData() {
        var active = todo.items('active').length,
            completed = todo.items('completed').length,
            items = (active === 1 ? 'item' : 'items');

        return {
            active: active,
            completed: completed,
            items: items
        };
    }
    return element;
}
