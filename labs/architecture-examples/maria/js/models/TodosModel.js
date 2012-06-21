maria.SetModel.subclass(checkit, 'TodosModel', {
    properties: {
        isEmpty: function() {
            return this.length === 0;
        },
        getDone: function() {
            return this.filter(function(todo) {
                return todo.isDone();
            });
        },
        getUndone: function() {
            return this.filter(function(todo) {
                return !todo.isDone();
            });
        },
        isAllDone: function() {
            return this.length > 0 &&
                   (this.getDone().length === this.length);
        },
        markAllDone: function() {
            this.forEach(function(todo) {
                todo.setDone(true);
            });
        },
        markAllUndone: function() {
            this.forEach(function(todo) {
                todo.setDone(false);
            });
        },
        deleteDone: function() {
            this['delete'].apply(this, this.getDone());
        },
        toJSON: function() {
            return this.map(function(todo) {
                return todo.toJSON();
            });
        }
    }
});

checkit.TodosModel.fromJSON = function(todosJSON) {
    var model = new checkit.TodosModel();
    for (var i = 0, ilen = todosJSON.length; i < ilen; i++) {
        model.add(checkit.TodoModel.fromJSON(todosJSON[i]));
    }
    return model;
};
