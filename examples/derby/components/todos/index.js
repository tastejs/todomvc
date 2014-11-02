module.exports = Todos;

// Component controllers are standard JavaScript classes that inhert from
// derby.Component. Perform all initialization in the component's init method,
// and leave the constructor function empty. This init method is called
// immediately before rendering
function Todos() {}
Todos.prototype.view = __dirname;
Todos.prototype.init = function(model) {

  // Components automatically have a model scoped to a reserved path. It is
  // good practice to create scoped models for each of the properties used
  // in the component. model.scope() returns a model scoped from the root
  // namespace, and model.at() returns a model underneath the current scope
  this.todos = model.at('todos');
  this.mode = model.at('mode');
  this.items = model.at('items');
  this.stats = model.at('stats');
  this.editing = model.at('editing');
  this.newTodo = model.at('newTodo');
  this.newTodo.set('');

  // Filter the todos based on the mode. Filters are used to map collections
  // represented by an object into a list.
  var filter = model.filter(this.todos, this.mode, function(todo, id, todos, mode) {
    if (!todo) return;
    if (mode === 'active') return !todo.completed;
    if (mode === 'completed') return todo.completed;
    return true;
  });
  // Sort the todos by their createdAt property
  filter.sort(function(a, b) {
    if (a && b) return a.createdAt - b.createdAt;
  });
  // Maintain a reference to the list of todos that match this filter for
  // rendering. This reference is two-way bindable, so modifying its items
  // will update the underlying todo objects as well
  filter.ref(this.items);

  // Compute counts based on the todos. model.start() will re-run a function
  // of one or more properties in the model whenever any inputs change. The
  // return value is deep diffed against the output path in the model
  model.start(this.stats, this.todos, function(todos) {
    if (!todos) return;
    var stats = {
      completed: 0,
      remaining: 0,
      total: 0
    };
    for (var id in todos) {
      var todo = todos[id];
      if (!todo) continue;
      stats.total++;
      if (todo.completed) {
        stats.completed++;
      } else {
        stats.remaining++;
      }
    }
    return stats;
  });
};

// Create a new todo from the newTodo input and clear the input
Todos.prototype.add = function() {
  var title = this.newTodo.get().trim();
  if (!title) return;
  this.todos.add({
    title: title,
    completed: false,
    createdAt: Date.now()
  });
  this.newTodo.set('');
};

// Edit the given todo and focus its input
Todos.prototype.edit = function(todo, labelElement) {
  this.editing.set(todo);
  labelElement.parentNode.nextSibling.focus();
};

// Stop editing
Todos.prototype.close = function() {
  this.editing.set(null);
};

// Delete the given todo
Todos.prototype.del = function(todo) {
  this.todos.del(todo.id);
};

// Delete all completed todos
Todos.prototype.clearCompleted = function() {
  var todos = this.todos.get() || {};
  for (var id in todos) {
    var todo = todos[id];
    if (todo && todo.completed) {
      this.todos.del(id);
    }
  }
};

// This is a two-way function bound to the toggle-all checkbox.
// The "get" function is called when rendering and on binding udpates.
// The "set" function is called when the checkbox value is changed.
//
// Checkboxes and other inputs have two way bindings. Since "remaining" is a
// computed value, we don't want to update it directly. Instead, we should
// edit the underlying data of the todos, which will update the remaining
// value, and ultimately render the correct checked state. While not used in
// this example, the set function of a two-way function can optionally return
// an array or object representing which inputs to modify.
Todos.prototype.allChecked = {
  get: function(remaining) {
    return !remaining;
  },
  set: function(value) {
    var todos = this.todos.get() || {};
    for (var id in todos) {
      this.todos.set(id + '.completed', value);
    }
  }
};
