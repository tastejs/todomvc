'use strict';

describe('Todo', function() {
    describe('#add', function() {
        it('adds items to the todo list', function () {
            var subject = createTodos('finish the todoMVC', 'promote Riot');
            assertItems(subject.items(), [
                {id: 1, name: 'finish the todoMVC'},
                {id: 2, name: 'promote Riot'}
            ]);
        });
    });

    describe('#edit', function() {
        it('edits an item', function() {
            var subject = createTodos('finish the todoMVC', 'promote Riot');
            subject.edit({id: 1, name: 'finish the todoMVC', done: true});
            assertItems(subject.items(), [
                {id: 1, name: 'finish the todoMVC', done: true},
                {id: 2, name: 'promote Riot'}
            ]);
        });
    });

    describe('#remove', function() {
        it('removes an item', function() {
            var subject = createTodos('finish the todoMVC', 'promote Riot');
            subject.remove('1');
            assertItems(subject.items(), [
                {id: 2, name: 'promote Riot'}
            ]);
        });

        it('adds an item after removing', function() {
            var subject = createTodos('finish the todoMVC', 'promote Riot');
            subject.remove('1');
            subject.add('do something else');
            assertItems(subject.items(), [
                {id: 2, name: 'promote Riot'},
                {id: 3, name: 'do something else'}
            ]);
        });
    });

    describe('#toggle', function() {
        it('toggles all items', function () {
            var subject = createTodos('finish 1', 'finish 2', 'finish 3');

            subject.toggle("active");
            assertItems(subject.items(), [
                {id: 1, name: 'finish 1', done: true},
                {id: 2, name: 'finish 2', done: true},
                {id: 3, name: 'finish 3', done: true}
            ]);
        });

        it('toggles an item', function() {
            var subject = createTodos('finish the todoMVC');

            subject.toggle(1);
            assertItems(subject.items(), [
                {id: 1, name: 'finish the todoMVC', done: true}
            ]);

            subject.toggle(1);
            assertItems(subject.items(), [
                {id: 1, name: 'finish the todoMVC', done: false}
            ]);
        });

        it('triggers the toggle event', function() {
            var subject = createTodos('finish the todoMVC'),
                toggled = {count: 0, id: null};

            subject.on('toggle', function(items) {
                toggled.id = items[0].id;
                toggled.count++;
            });

            subject.toggle(1);
            assertItems(toggled, {count: 1, id: 1});

            subject.toggle(1);
            subject.toggle(1);
            assertItems(toggled, {count: 3, id: 1});
        });
    });

    function createTodos() {
        var subject = new Todo();
        [].forEach.call(arguments, function(item) { subject.add(item); });
        return subject;
    }

    function assertItems(items, expected) {
        assert.equal(JSON.stringify(items), JSON.stringify(expected));
    }
});
