'use strict';

function footerPresenter(element, options) {
    element = $(element);
    var todo = options.model, template = {
        count: '<strong>{active}</strong> {items} left',
        completed: 'Clear completed ({done})'
    };

    // Bind model events
    todo.on('add remove toggle load', counts);

    function counts() {
        var active = todo.items('active').length,
            done = todo.items('completed').length,
            items = (active === 1 ? 'item' : 'items'),
            showClear = (done > 0),
            showFooter = (done + active > 0),
            data = {active: active, done: done, items: items};

        element.toggle(showFooter);
        $('#todo-count', element).html(render('count', data))
        $('#clear-completed', element)
            .toggle(showClear)
            .html(render('completed', data))
    }

    function render(name, data) {
        return $.render(template[name], data);
    }

    return element;
}
