'use strict';

function todoPresenter($element, options) {

    var template = options.template,
        todo = options.model,
        $list = $element.find("#todo-list");

    /* Listen to user events */

    $element.on("keyup", '#new-todo', function(e) {
        var val = $.trim(this.value);
        if (val && e.which === 13) {
            todo.add(val);
            this.value = '';
        }

    }).on("click", '#toggle-all', function() {
        todo.toggle();

    }).on("click", '#clear-completed', function() {
        todo.remove('completed');
    });

    /* Listen to model events */

    // Reload the list
    todo.on('reload', function(items) {
        $list.empty() && $.each(items, add);

    // Remove an item
    }).on('remove', function(items) {
        items.forEach(function(item) { $('#' + item.id).remove(); });

    // Toggle items
    }).on('toggle', function(item) {
        toggle($('#' + item.id), !!item.done);

    // Add, edit and update counts
    }).on('add', add).on('edit', edit).on('add remove toggle reload', counts);


    /* Private functions */

    function toggle(el, flag) {
        el.toggleClass('completed', flag);
        $(':checkbox', el).prop('checked', flag);
    }

    function edit(item) {
        var el = $('#' + item.id);
        el.removeClass('editing');
        $('label, .edit', el).text(item.name).val(item.name);
    }

    function add(item) {
        if (this.id) item = this;

        var el = $list.prepend($.render(template, item)),
            input = $('.edit', el);

        $('.toggle', el).click(function() {
            todo.toggle(item.id);
        });

        function blur() {
            el.removeClass('editing');
        }

        toggle(el, !!item.done);

        // edit
        input.blur(blur).keydown(function(e) {
            var val = $.trim(this.value);
            console.log(e.which)
            if (val && e.which === 13) {
                item.name = val;
                todo.edit(item);
            }

            if (e.which === 27) blur();
        });

        $('label', el).dblclick(function() {
            el.addClass('editing');
            input.focus()[0].select();
        });

        // remove
        $('.destroy', el).click(function() {
            todo.remove(item.id);
        });
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
