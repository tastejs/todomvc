//a custom binding to handle the enter key (could go in a separate library)
o_O.bindings.enterKey = function(func, $el) {
  $el.keyup(function(e) {
    if(e.keyCode === 13)
      func.call(this)
  })
}
window.pluralize = function(word, count) {
  return word + (count === 1 ? "" : "s");
}

//represent a single todo item
var Todo = o_O.model.extend({
    type: 'Todo',
    title: '',
    completed: false,
    editing: false
  }, {
  edit: function() {  
    this.editing(true); 
  },
  remove: function() {
    todoapp.todos.remove(this)
  },
  visible: function() {
    var mode = todoapp.selected(),
        completed = this.completed()
    return mode == '' || (mode == 'completed' && completed) || (mode == 'active' && !completed)
  }
});

var TodoApp = o_O.model.extend({
  current: "",
  showTooltip: false,
  remainingCount: 0,
  completedCount: 0,
  selected: ''
}, {
  initialize: function() {
    var self = this
    this.todos = o_O.array(this.todos())

    this.todos.on('set:completed remove', function() {
      self.completedCount(self.completed().length)
      self.remainingCount(self.count() - self.completedCount())
    })
    
    this.todos.on('set:completed add remove', function() {
      self.persist()
    })
    
    // setup Routing  
    var router = o_O.router()
    router.add('*filter', function(filter) {
      self.selected(filter)
      $('#filters a').removeClass('selected').filter("[href='#/" + filter + "']").addClass('selected');  
    })
    router.start()
    
  },
  add: function () {
    var newTodo = new Todo({title: this.current()});
    this.todos.push(newTodo);
    this.current("");
  },
  count: function() {
    return this.todos.count()
  },
  removeCompleted: function (evt) {
    this.todos.remove(function(todo) {
      return todo.completed()
    })
    return false
  },
  completed: function () {
    return this.todos.filter(function(todo) {
      return todo.completed();
    })
  },
  persist: function() {
    localStorage.todos = JSON.stringify(this.todos.toJSON());
  },
  //writeable computed observable to handle marking all complete/incomplete
  allCompleted: function(v) {  
    if(arguments.length == 0) return !this.remainingCount()
    this.todos.each(function(todo) {
      todo.completed(v);
    })
  }
});


function main() {
  // load
  var todos
  try {
    todos = JSON.parse(localStorage.todos)
  } catch(e) {
    todos = []
  }

  for(var i=0; i<todos.length;i++) 
    todos[i] = o_O.model.create(todos[i])

  todoapp = new TodoApp({todos: todos})

  o_O.bind(todoapp, '#todoapp');
}
