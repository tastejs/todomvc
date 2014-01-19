'use strict';

function Todo() {
    var self = $.observable(this),
        db = DB('riot-todo'),
        items = db.get();

    self.add = function(name) {
        var item = { id: generateId(), name: name };
        items[item.id] = item;
        self.trigger('add', item);
    };

    self.edit = function(item) {
        items[item.id] = item;
        self.trigger('edit', item);
    };

    self.remove = function(filter) {
        var removedItems = self.items(filter).map(function(item) {
            delete items[item.id];
            return item;
        });
        self.trigger('remove', removedItems);
    };

    self.toggle = function(filter) {
        var toggledItems = self.items(filter).map(function(item) {
            item.done = !item.done;
            return item;
        });
        self.trigger('toggle', toggledItems);
    };

    // @param filter: <empty>, id, 'active', 'completed'
    self.items = function(filter) {
        return Object.keys(items).filter(function(id) {
            return matchFilter(items[id], filter);
        }).map(function(id) {
            return items[id];
        });
    }

    // sync database
    self.on('add remove toggle edit', function() {
        db.put(items);
    });

    // Private methods
    function generateId() {
        var keys = Object.keys(items), i = keys.length;
        return (i ? items[keys[i - 1]].id + 1 : i + 1);
    }

    function matchFilter(item, filter) {
        return !filter ||
            filter.toString() === item.id.toString() ||
            filter === (item.done ? 'completed' : 'active');
    }
};
