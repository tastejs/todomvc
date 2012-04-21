var requirejs = (typeof requirejs === "undefined" ? require("requirejs") : requirejs);

requirejs(["rAppid"], function (rAppid) {
    rAppid.defineClass("app.collection.TodoList", ["js.core.List"], function (List) {
        return List.inherit({
            markAll:function (done) {
                this.each(function (todo) {
                    todo.setDone(done);
                });
            },
            areAllComplete:function () {
                if(this.$items.length == 0) return false;
                for (var i = 0; i < this.$items.length; i++) {
                    if (!this.$items[i].get("isDone")) {
                        return false;
                    }
                }
                return true;
            }.on('change','add','remove'),
            clearCompleted:function () {
                console.log("clear completed");
                for (var i = this.$items.length-1; i >= 0; i--) {
                    if (this.$items[i].get("isDone")) {
                        this.removeAt(i);
                    }
                }
            },
            numOpenTodos:function () {
                var num = 0;
                for (var i = 0; i < this.$items.length; i++) {
                    if (!this.$items[i].get("isDone")) {
                        num++;
                    }
                }
                return num;
            }.on('change','add','remove'),
            numCompletedTodos: function(){
                var num = 0;
                for (var i = 0; i < this.$items.length; i++) {
                    if (this.$items[i].get("isDone")) {
                        num++;
                    }
                }
                return num;
            }.on('change', 'add', 'remove'),
            hasCompletedTodos: function(){
                return this.numCompletedTodos() > 0;
            }.on('change','add','remove')
        });
    });
});