/**

@property maria.SetModel.subclass

@description

A function that makes subclassing maria.SetModel more compact.

The following example creates a checkit.TodosModel constructor function
equivalent to the more verbose example shown in the documentation
for maria.SetModel.

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
            }
        }
    });

*/
maria.SetModel.subclass = maria.Model.subclass;
