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

    stats.style.display = (stats.style.display == 'block') ?'inline' : 'block';
  },

  pushObject: function (item, ignoreStorage) {
    if (!ignoreStorage) {
      Todos.TodoStore.create(item);
    }
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
  }.property('@each.isDone'),

  completeClass: function () {
    return this.get('completed') < 1 ? 'none-completed' : 'some-completed';
  }.property('@each.isDone')
});

Todos.StatsView = Ember.View.extend({
  remainingBinding: 'Todos.todosController.remaining',
  remainingString: function() {
    var remaining = this.get('remaining');
    return remaining + (remaining === 1 ? " item" : " items");
  }.property('remaining')
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

Todos.ClearCompletedButtonView = Ember.Button.extend({
  completedBinding: 'Todos.todosController.completed',
  completedString: function() {
    var completed = this.get('completed');
    return completed + " completed" + (completed === 1 ? " item" : " items");
  }.property('completed'),

  completedButtonClass: function () {
      if (this.get('completed') < 1)
          return 'hidden';
      else
          return '';
  }.property('completed')
});

Todos.TodoStore = (function () {
  if (!!window.openDatabase) {
    // WebSQL store:
    persistence.store.websql.config(persistence, name, 'todo database', 5*1024*1024);
  } else if (!!Storage) {
    // In-memory localStore:
    persistence.store.memory.config(persistence);
  }
  var Store = function(name) {
    var Todo = persistence.define('todo', {
      title: 'TEXT',
      isDone: 'BOOL'
    });
    persistence.schemaSync();

    this.create = function(item) {
      var t = new Todo(item.getProperties('title', 'isDone'));
      persistence.add(t);
      persistence.flush();
    };

    this.update = function(item){
      Todo.all().filter('title', '=', item.get('title')).one(function(todo) {
        todo.isDone = item.get('isDone');
        persistence.flush();
      });
    };

    this.remove = function(item) {
      Todo.all().filter('title', '=', item.get('title')).one(function(obj) {
        persistence.remove(obj);
        persistence.flush();
      });
    };

    this.findAll = function() {
      Todo.all().list(function(items){
        var itemCount = items.length;
        var todos = [];
        items.forEach(function(item){
          todos.push(Todos.Todo.create({
            id: item.id,
            title: item.title,
            isDone: item.isDone
          }));
        });
        Todos.todosController.set('[]', todos);
      });
    };
  };
  return new Store('todos-emberjs-persistence');
})();

if (!!window.openDatabase) {
  // WebSQL store:
  (function () {
    persistence.store.websql.config(persistence, name, 'todo database', 5*1024*1024);
    Todos.TodoStore.findAll();
  })();
} else if (!!Storage) {
  // In-memory localStore:
  $(function() {
    persistence.store.memory.config(persistence);
    persistence.loadFromLocalStorage(function() {
      Todos.TodoStore.findAll();
    });
  });
  $(window).unload(function() {
    persistence.saveToLocalStorage();
  });
} else {
  alert('Your browser does not support WebSQL or localStore');
}
