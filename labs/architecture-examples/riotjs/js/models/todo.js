'use strict';

function Todo() {
    var self = $.observable(this),
        db = DB('riot-todo'),
        items = db.get();

    self.add = function(name, done) {
        var item = {
          id: generateId(), name: name, done: done
        };

        items[item.id] = item;
        self.trigger('add', item);
    };

    self.edit = function(item) {
        if (!item.name) {
          return self.remove(item.id);
        }

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

    self.toggle = function(id) {
        items[id].done = !items[id].done;
        self.trigger('toggle', items[id]);
    };

    self.toggleAll = function() {
        var filter = self.isDone() ? 'completed' : 'active';
        self.items(filter).forEach(function(item) {
          self.toggle(item.id);
        });
    };

    // @param filter: <empty>, id, 'active', 'completed'
    self.items = function(filter) {
        return Object.keys(items).filter(function(id) {
            return matchFilter(items[id], filter);
        }).map(function(id) {
            return items[id];
        });
    }

    self.isDone = function(){
        return self.items('active').length == 0;
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
