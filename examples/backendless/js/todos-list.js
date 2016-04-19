/**
 * @class TodosList
 * @summary List of todos views
 */
var TodosList = (function() {
  const todosQuery = {
    properties: ['objectId', 'title', 'completed'],
    options   : {pageSize: 100, sortBy: 'order asc'}
  };

  function TodosList(appView) {
    var that = this;

    this.el = document.querySelector('.todo-list');
    this.todosViews = [];
    this.filter = null;
    this.appView = appView;

    //retrieve todos items from the backendless server
    //code below load only todos items of current logged user
    //by default backendless server return only 10 items, we pass "options.pageSize:100" for retrieve the first 100 items
    //also we pass "properties" for retrieve only needed fields of todo item
    TodoStorage.find(todosQuery, new Backendless.Async(function(result) {
      for (var i = 0; i < result.data.length; i++) {
        that.renderItem(result.data[i]);
        that.appView.updateState();
      }
    }));
  }

  TodosList.prototype.createItem = function(todo) {
    todo = new Todo(todo);

    this.renderItem(todo);

    TodoStorage.save(todo, new Backendless.Async(function(newItem) {
      todo.objectId = newItem.objectId;
    }));
  };

  TodosList.prototype.renderItem = function(todoData) {
    var todoView = new TodoView(todoData, this);

    this.todosViews.push(todoView);
    this.el.appendChild(todoView.el);
  };

  TodosList.prototype.removeItem = function(todoView) {
    this.el.removeChild(todoView.el);
    this.todosViews.splice(this.todosViews.indexOf(todoView), 1);
  };

  TodosList.prototype.removeCompleted = function() {
    var toRemove = [];

    for (var i = 0; i < this.todosViews.length; i++) {
      if (this.todosViews[i].data.completed) {
        toRemove.push(this.todosViews[i]);
      }
    }

    for (var j = 0; j < toRemove.length; j++) {
      toRemove[j].destroy();
    }
  };

  TodosList.prototype.getCounts = function() {
    var total = this.todosViews.length;
    var remains = 0;

    for (var i = 0; i < this.todosViews.length; i++) {
      if (!this.todosViews[i].data.completed) {
        remains++;
      }
    }

    return {total: total, remains: remains}
  };

  TodosList.prototype.setFilter = function(filter) {
    this.filter = filter;

    for (var j = 0; j < this.todosViews.length; j++) {
      this.todosViews[j].toggle();
    }
  };

  TodosList.prototype.toggleAll = function(completed) {
    for (var i = 0; i < this.todosViews.length; i++) {
      this.todosViews[i].updateCompleted(completed);
    }
  };

  TodosList.prototype.onTodoCompleteChange = function() {
    this.appView.updateState();
  };

  TodosList.prototype.onTodoDestroy = function(todoView) {
    this.removeItem(todoView);

    this.appView.updateState();
  };

  return TodosList;
})();
