'use strict';

describe('todoPresenter', function() {
    it('loads a list of items', function() {
        assertLoadItems([{id: 1, name: 'Hardcore Mocks'}]);
        assertLoadItems([
            {id: 1, name: 'Hardcore Mocks'},
            {id: 2, name: 'More Mocks'}
        ]);
    });

    it('adds a new item', function() {
        assertAddItem('', 13, undefined);
        assertAddItem('Call Me', 13, 'Call Me');
        assertAddItem('Call Me', 14, undefined);
    });

    function assertAddItem(name, key, expected) {
        var added, model = new Todo();
        loadPresenter(model, function(element) {
            model.on('add', function (item) { added = item.name; });
            $('#new-todo', element).val(name).trigger($.Event('keyup', {
                which: key, keyCode: key
            }));

            assert.equal(added, expected);
            assertMatch(element.text(), added);
        });
    }

    function assertLoadItems(items) {
        var model = $.observable({
          items: function () { return items; },
          isDone: function () { return true; }
        });
        loadPresenter(model, function(element) {
            model.trigger('load', 'all');
            items.forEach(function(item) {
                assertMatch(element.text(), item.name);
            });
        });
    }

    function loadPresenter(model, callback) {
        var body = $(
            '<div>' +
                '<input id="toggle-all" type="checkbox">' +
                '<input id="new-todo" type="text">' +
                '<ul id="todo-list"></ul>' +
            '</div>'),
            template = (
            '<li id="task_{id}" data-task="{id}">' +
                '<div class="view todo-task">' +
                '<input class="toggle" type="checkbox">' +
                '<label>{name}</label>' +
                '<button class="destroy"/>' +
                '</div>' +
                '<input class="edit" value="{name}">' +
            '</li>');

        callback(todoPresenter(body, {model: model, template: template}));
    }
});
