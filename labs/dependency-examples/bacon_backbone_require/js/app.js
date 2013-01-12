(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var Backbone, Bacon, FooterController, Todo, TodoApp, TodoList, TodoRouter;
    Backbone = require('backbone');
    Bacon = require('bacon');
    Todo = require('models/todo');
    TodoList = require('models/todo_list');
    TodoRouter = require('routers/router');
    FooterController = require('controllers/footer');
    return TodoApp = (function(_super) {
      var ENTER_KEY, enterPressed, value;

      __extends(TodoApp, _super);

      function TodoApp() {
        this.render = __bind(this.render, this);

        this.getTodo = __bind(this.getTodo, this);
        return TodoApp.__super__.constructor.apply(this, arguments);
      }

      ENTER_KEY = 13;

      enterPressed = function(e) {
        return e.keyCode === ENTER_KEY;
      };

      value = function(e) {
        return e.target.value.trim();
      };

      TodoApp.prototype.initialize = function() {
        var deleteTodo, editTodo, filter, filteredList, finishEdit, footerController, newTodo, todoRouter, toggleAll, toggleTodo,
          _this = this;
        this.todoList = new TodoList();
        todoRouter = new TodoRouter();
        footerController = new FooterController({
          el: this.$('#footer'),
          collection: this.todoList
        });
        filter = todoRouter.asEventStream('route:filter').map('.trim');
        toggleAll = this.$('#toggle-all').asEventStream('click');
        toggleTodo = this.$('#todo-list').asEventStream('click', '.toggle');
        deleteTodo = this.$('#todo-list').asEventStream('click', '.destroy');
        editTodo = this.$('#todo-list').asEventStream('dblclick', '.title');
        finishEdit = this.$('#todo-list').asEventStream('keyup', '.edit').filter(enterPressed);
        newTodo = this.$('#new-todo').asEventStream('keyup').filter(enterPressed).map(value).filter('.length');
        filteredList = Bacon.combineTemplate({
          filter: filter,
          todos: {
            all: this.todoList.all,
            active: this.todoList.active,
            completed: this.todoList.completed
          }
        }).map(function(_arg) {
          var filter, todos;
          filter = _arg.filter, todos = _arg.todos;
          return todos[filter === '' ? 'all' : filter];
        });
        toggleAll.map('.target.checked').onValue(this.todoList, 'toggleAll');
        toggleTodo.map(this.getTodo).onValue(function(todo) {
          return todo.save({
            completed: !todo.get('completed')
          });
        });
        deleteTodo.map(this.getTodo).onValue(function(todo) {
          return todo.destroy();
        });
        editTodo.onValue(function(e) {
          return $(e.currentTarget).closest('.todo').addClass('editing').find('.edit').focus();
        });
        finishEdit.map(function(e) {
          return {
            todo: _this.getTodo(e),
            title: value(e)
          };
        }).onValue(function(_arg) {
          var title, todo;
          todo = _arg.todo, title = _arg.title;
          return todo.save({
            title: title
          });
        });
        filter.onValue(function(filter) {
          return this.$('#filters a').removeClass('selected').filter("[href='#/" + filter + "']").addClass('selected');
        });
        newTodo.onValue(function(title) {
          return _this.todoList.create({
            title: title
          });
        });
        newTodo.onValue(this.$('#new-todo'), 'val', '');
        this.todoList.notEmpty.onValue(this.$('#main, #footer'), 'toggle');
        this.todoList.allCompleted.onValue(this.$('#toggle-all'), 'prop', 'checked');
        filteredList.onValue(this.render);
        Backbone.history.start();
        return this.todoList.fetch();
      };

      TodoApp.prototype.getTodo = function(e) {
        return this.todoList.get(e.target.transparency.model);
      };

      TodoApp.prototype.render = function(todos) {
        return this.$('#todo-list').render(_(todos).invoke('toJSON'), {
          todo: {
            "class": function(p) {
              if (this.completed) {
                return "todo completed";
              } else {
                return "todo";
              }
            }
          },
          toggle: {
            checked: function(p) {
              return this.completed;
            }
          }
        });
      };

      return TodoApp;

    })(Backbone.View);
  });

}).call(this);
