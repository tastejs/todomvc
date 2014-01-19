'use strict';

function todoPresenter($element, options) {

    var template = options.template,
        todo = options.model,
        $list = $element.find('#todo-list');

    /* Listen to user events */

    $element.on('keyup', '#new-todo', function(e) {
        var val = $.trim(this.value);
        if (val && e.which === 13) {
            todo.add(val);
            this.value = '';
        }

    }).on('click', '#toggle-all', function() {
        todo.toggle();

    }).on('click', '#clear-completed', function() {
        todo.remove('completed');

    }).on('click', '.toggle', function(e) {
        todo.toggle(getTaskId(e.target));

    }).on('blur', '.edit', function(e) {
        getTaskElement(e.target).removeClass('editing');

    }).on('keydown', '.edit', function(e) {
        var el = $(e.target), val = $.trim(this.value);
        if (val && e.which === 13) {
            todo.edit({ name: val, id: getTaskId(el) });
        } else if (e.which === 27) el.blur();

    }).on('dblclick', '.todo-task label', function(e) {
        var el = getTaskElement(e.target);
        el.addClass('editing');
        el.find('.edit').focus();

    }).on('click', '.destroy', function(e) {
        todo.remove(getTaskId(e.target));
    });

    /* Listen to model events */

    // Reload the list
    todo.on('reload', function(items) {
        $list.empty() && $.each(items, add);

    // Remove an item
    }).on('remove', function(items) {
        items.forEach(function(item) { $('#task_' + item.id).remove(); });

    // Toggle items
    }).on('toggle', function(items) {
        toggle($('#task_' + items[0].id), !!items[0].done);

    // Add, edit and update counts
    }).on('add', add).on('edit', edit).on('add remove toggle reload', counts);


    /* Private functions */

    function toggle(el, flag) {
        el.toggleClass('completed', flag);
        $(':checkbox', el).prop('checked', flag);
    }

    function edit(item) {
        var el = $('#task_' + item.id);
        el.removeClass('editing');
        $('label, .edit', el).text(item.name).val(item.name);
    }

    function add(item) {
        if (this.id) item = this;
        var el = $($.render(template, item));

        $list.prepend(el);
        toggle(el, !!item.done);
    }

    function getTaskElement(element) {
        return $(element).closest('[data-task]');
    }

    function getTaskId(element) {
        return getTaskElement(element).data('task');
    }

    function counts() {
        var active = todo.items('active').length,
            plural = (active === 1 ? '' : 's'),
            done = todo.items('completed').length;

        $('#todo-count').html('<strong>' + active + '</strong> item' + plural + ' left')
        $('#clear-completed').toggle(done > 0).text('Clear completed (' + done + ')')
        $('#footer').toggle(active + done > 0);
    }
}
