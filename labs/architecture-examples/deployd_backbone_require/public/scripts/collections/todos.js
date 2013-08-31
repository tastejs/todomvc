define([
  "models/todo"
], function (Todo) {
  return Backbone.Collection.extend({
  	// Reference to this collection's model.
  	model: Todo,
    url: '/todos',

    initialize: function () {
      dpd.todos.on('create', function (newTodo) {
        if(!this.where({uuid: newTodo.uuid}).length) {
          this.add(newTodo);
        }
      }.bind(this));

      dpd.todos.on('update', function (newTodo) {
        var todo = this.findWhere({uuid: newTodo.uuid});
        if(todo) {
          todo.set(newTodo);
        }
      }.bind(this));
  
      dpd.todos.on('delete', function (newTodo) {
        var todo = this.findWhere({uuid: newTodo.uuid});
        if (todo) {
          todo.trigger('destroy');
          this.remove(todo);
        }
      }.bind(this));
    },

  	// Filter down the list of all todo items that are finished.
  	completed: function () {
  		return this.filter(function (todo) {
  			return todo.get('completed');
  		});
  	},

  	// Filter down the list to only todo items that are still not finished.
  	remaining: function () {
  		return this.without.apply(this, this.completed());
  	},
  });
});
