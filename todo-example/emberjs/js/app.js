Todos = Ember.Application.create();

Todos.Todo = Ember.Object.extend({
  id: null,
  title: null,
  isDone: false,
  todoChanged: function () {
    Todos.TodoStore.update(this);
  }.observes('title', 'isDone')
});

Todos.todosController = Ember.ArrayProxy.create({
  content: [],

  createTodo: function(title) {
    var todo = Todos.Todo.create({ title: title }),
    stats = document.getElementById('stats-area');
    this.pushObject(todo);
    Todos.TodoStore.create(todo);

    (stats.style.display=='block')? stats.style.display = 'inline' : stats.style.display = 'block';
  },

  pushObject: function (item, ignoreStorage) {
    if (!ignoreStorage)
      Todos.TodoStore.create(item);
    return this._super(item);
  },

  removeObject: function (item) {
    Todos.TodoStore.remove(item);
    return this._super(item);
  },

  clearCompletedTodos: function() {
    this.filterProperty('isDone', true).forEach(this.removeObject, this);
  },

  remaining: function() {
    return this.filterProperty('isDone', false).get('length');
  }.property('@each.isDone'),

  completed: function() {
    return this.filterProperty('isDone', true).get('length');
  }.property('@each.isDone'),

  allAreDone: function(key, value) {
    if (value !== undefined) {
      this.setEach('isDone', value);

      return value;
    } else {
      return !!this.get('length') && this.everyProperty('isDone', true);
    }
  }.property('@each.isDone')
});

Todos.StatsView = Ember.View.extend({
  remainingBinding: 'Todos.todosController.remaining',
  remainingString: function() {
    var remaining = this.get('remaining');
    return remaining + (remaining === 1 ? " item" : " items");
  }.property('remaining'),

  completedBinding: 'Todos.todosController.completed',
  completedString: function() {
    var completed = this.get('completed');
    return completed + " completed" + (completed === 1 ? " item" : " items");
  }.property('completed')
});

Todos.CreateTodoView = Ember.TextField.extend({
  insertNewline: function() {
    var value = this.get('value');

    if (value) {
      Todos.todosController.createTodo(value);
      this.set('value', '');
    }
  }
});

Todos.TodoStore = (function () {
  // Generate four random hex digits.
  var S4 = function () {
     return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  };

  // Generate a pseudo-GUID by concatenating random hexadecimal.
  var guid = function () {
     return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
  };

  // Our Store is represented by a single JS object in *localStorage*. Create it
  // with a meaningful name, like the name you'd give a table.
  var Store = function(name) {
    this.name = name;
    var store = localStorage.getItem(this.name);
    this.data = (store && JSON.parse(store)) || {};

    // Save the current state of the **Store** to *localStorage*.
    this.save = function() {
      localStorage.setItem(this.name, JSON.stringify(this.data));
    };

    // Add a model, giving it a (hopefully)-unique GUID, if it doesn't already
    // have an id of it's own.
    this.create = function (model) {
      if (!model.get('id')) model.set('id', guid());
      return this.update(model);
    };

    // Update a model by replacing its copy in `this.data`.
    this.update = function(model) {
      this.data[model.get('id')] = model.getProperties('id', 'title', 'isDone');
      this.save();
      return model;
    };

    // Retrieve a model from `this.data` by id.
    this.find = function(model) {
      return Todos.Todo.create(this.data[model.get('id')]);
    };

    // Return the array of all models currently in storage.
    this.findAll = function() {
      var result = [];
      for (var key in this.data)
      {
        var todo = Todos.Todo.create(this.data[key]);
        result.push(todo);
      }

      return result;
    };

    // Delete a model from `this.data`, returning it.
    this.remove = function(model) {
      delete this.data[model.get('id')];
      this.save();
      return model;
    };
  };

  return new Store('todos-emberjs');
})();

(function () {
  var items = Todos.TodoStore.findAll();

  if (items.length < 1)
  {
    var todo = Todos.Todo.create({'title': 'First Task'});
    Todos.TodoStore.create(todo);
    items = [todo];
  }

  Todos.todosController.arrayContentWillChange(0, 0, items.length);
  Todos.todosController.set('[]', items);
  Todos.todosController.arrayContentDidChange(0, 0, items.length);
})();
