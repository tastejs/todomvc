/*global riot, todoStorage */

(function () {
	'use strict';

  var ENTER_KEY = 13;
  var ESC_KEY = 27;

  var tmpl = document.getElementById('todo').innerHTML;
  var root = document.getElementById('root');
  var todo = new tplite.Component(tmpl, {
    onMount(){
      var self = this;
      window.addEventListener("hashchange", function(){
        self.setState({activeFilter: location.hash.substr(2)})
      }, false);
    },
    shouldUpdate: function(){
      this.state.remaining = this.state.todos.filter(function(t){
        return !t.completed
      }).length;
      this.state.allDone = this.state.remaining === 0;
      todoStorage.save(this.state.todos);
      return true
    },
    addTodo: function(e){
      if (e.which === ENTER_KEY) {
        var value = e.target.value && e.target.value.trim();
        if (!value) {
          return;
        }
        var todos = this.state.todos;
        todos.push({ title: value, completed: false });
        this.setState({ todos: todos });
        e.target.value = '';
      }
    },
    removeTodo: function(todo){
      var todos = this.state.todos;
      todos.some(function (t) {
        if (todo === t) {
          todos.splice(todos.indexOf(t), 1);
        }
      })
      this.setState({ todos: todos })
    },
    toggleAll(e) {
      var todos = this.state.todos;
      todos.forEach(function (t) {
        t.completed = e.target.checked;
      });
      this.setState({ todos: todos })
      console.log('toggleAll', todos, e.target.checked)
      return true
    },
    removeCompleted(e) {
      console.log('removeCompleted', e)
      this.setState({todos: this.state.todos.filter(function(t) {
        return !t.completed;
      })});
    },
    // todoitem
    toggleTodo(todo){
      todo.completed = !todo.completed
      this.render()
    },
    editTodo(todo){
      todo.editing = true 
      this.render()
    },
    doneEdit(todo, e){
      if (!todo.editing) return;
      todo.editing = false;
      var enteredText = e.target.value && e.target.value.trim();
      if (enteredText){
        todo.title = enteredText
      }else{
        this.trigger('removeTodo', todo)
      }
      this.render()
    },
    editKeyUp(todo, e){
      if (e.which === ENTER_KEY){
        this.trigger('doneEdit', todo, e)
      }else if (e.which === ESC_KEY){
        e.target.value = todo.title
        this.trigger('doneEdit', todo, e)
      }
    }
  }, {
    todos: todoStorage.fetch(),
    remaining: 0,
    activeFilter: location.hash.substr(2) || 'all',
    filteredTodos: function(todos, filter){
      return todos.filter(function(t){
        return filter == 'all' ? true : filter == 'active' ? !t.completed : t.completed;
      })
    }
  }).mount(root)

}());
