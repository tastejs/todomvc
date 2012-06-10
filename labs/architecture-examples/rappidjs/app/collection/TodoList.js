<<<<<<< HEAD
define(["js/data/Collection", "app/model/Todo", "flow"], function (Collection, Todo, flow) {
    return Collection.inherit("app.collection.TodoList", {
        $modelFactory: Todo,

        markAll: function (done) {
            this.each(function (todo) {
                todo.setCompleted(done);
                todo.save();
=======
define(["js/core/List"], function (List) {
    return List.inherit("app.collection.TodoList", {
        markAll: function (done) {
            this.each(function (todo) {
                todo.setCompleted(done);
>>>>>>> ff2959b913b2a0489bcd4d67eb2c021582beaa36
            });
        },
        areAllComplete: function () {
            if (this.$items.length === 0) {
                return false;
            }
            for (var i = 0; i < this.$items.length; i++) {
                if (!this.$items[i].isCompleted()) {
                    return false;
                }
            }
            return true;
        }.on('change', 'add', 'remove'),
        clearCompleted: function () {
<<<<<<< HEAD
            var self = this;
            // remove all completed todos in a sequence
            flow().seqEach(this.$items,function (todo, cb) {
                if (todo.isCompleted()) {
                    // remove the todo
                    todo.remove(null, function (err) {
                        if (!err) {
                            self.remove(todo);
                        }
                        cb(err);
                    });
                } else {
                    cb();
                }
            }).exec();
=======
            console.log("clear completed");
            for (var i = this.$items.length - 1; i >= 0; i--) {
                if (this.$items[i].isCompleted()) {
                    this.removeAt(i);
                }
            }
>>>>>>> ff2959b913b2a0489bcd4d67eb2c021582beaa36
        },
        numOpenTodos: function () {
            var num = 0;
            for (var i = 0; i < this.$items.length; i++) {
                if (!this.$items[i].isCompleted()) {
                    num++;
                }
            }
            return num;
        }.on('change', 'add', 'remove'),
        numCompletedTodos: function () {
            var num = 0;
            for (var i = 0; i < this.$items.length; i++) {
                if (this.$items[i].isCompleted()) {
                    num++;
                }
            }
            return num;
        }.on('change', 'add', 'remove'),
        hasCompletedTodos: function () {
            return this.numCompletedTodos() > 0;
        }.on('change', 'add', 'remove')
    });
});