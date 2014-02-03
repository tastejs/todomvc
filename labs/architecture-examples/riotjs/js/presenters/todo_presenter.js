'use strict';

function todoPresenter(element, options) {
    element = $(element);
    var template = options.template,
        todo = options.model,
        $list = element.find('#todo-list');

    /* Listen to user events */

    element.on('keyup', '#new-todo', function(e) {
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
        el.addClass('editing').find('.edit').focus();

    }).on('click', '.destroy', function(e) {
        todo.remove(getTaskId(e.target));
    });

    /* Listen to model events */

    // Reload the list
    todo.on('load', function(filter) {
        $list.empty() && todo.items(filter).forEach(add);

    // Remove an item
    }).on('remove', function(items) {
        items.forEach(function(item) {
            $('#task_' + item.id, $list).remove();
        });

    // Toggle items
    }).on('toggle', function(items) {
        items.forEach(function(item) {
            toggle($('#task_' + item.id, $list), !!item.done);
        });

    // Add & edit
    }).on('add', add).on('edit', edit);

    /* Private functions */

    function toggle(element, flag) {
        element.toggleClass('completed', flag);
        element.find(':checkbox').prop('checked', flag);
    }

    function edit(item) {
        var el = $('#task_' + item.id, $list);
        el.removeClass('editing');
        $('label, .edit', el).text(item.name).val(item.name);
    }

    function add(item) {
        var element = $($.render(template, item));
        $list.append(element);
        toggle(element, !!item.done);
    }

    function getTaskElement(element) {
        return $(element).closest('[data-task]');
    }

    function getTaskId(element) {
        return getTaskElement(element).data('task');
    }

    return element;
}
