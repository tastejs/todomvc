define(["js/core/List"], function (List) {
    return List.inherit("app.collection.TodoList", {
        markAll: function (done) {
            this.each(function (todo) {
                todo.setCompleted(done);
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
            console.log("clear completed");
            for (var i = this.$items.length - 1; i >= 0; i--) {
                if (this.$items[i].isCompleted()) {
                    this.removeAt(i);
                }
            }
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