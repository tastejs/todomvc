// An example Backbone/Backbone.Marionette application 
// contributed by [Derick Bailey](http://mutedsolutions.com). 

// Define an application
var TodoMVC = new Backbone.Marionette.Application();

// Create a module to hide our private implementation details
TodoMVC.module("App", function(App, TodoMVC, Backbone, Marionette, $, _){

  // Models
  // ------

  App.Todo = Backbone.Model.extend({});

  App.TodoCollection = Backbone.Collection.extend({
    model: App.Todo
  });

  // Views
  // -----

  App.Layout = Marionette.Layout.extend({
    regions: {
      list: "#todo-list",
      stats: "#todo-stats"
    },

    events: {
      "keypress #new-todo":  "createOnEnter"
      //"keyup #new-todo":     "showTooltip",
      //"click .todo-clear a": "clearCompleted",
      //"click .mark-all-done": "toggleAllComplete"
    },

    createOnEnter: function(e) {
      if (e.keyCode != 13) return;
      var input = $(e.currentTarget);

      var content = input.val();
      var data = {
        content: content,
        done: false
      };

      this.trigger("create:todo", data);
      input.val('');
    },

    render: function(){
      this.initializeRegions();
    }
  });

  App.TodoItemView = Marionette.ItemView.extend({
    template: "#item-template",
    tagName: "li"
  });

  App.TodoListView = Marionette.CollectionView.extend({
    itemView: App.TodoItemView
  });

  // Helpers
  // -------

  var todoApp = {

    run: function(){
      this.todoList = new App.TodoCollection();

      var form = this.getTodoForm();
      form.on("create:todo", this.addTodo, this);

      var listView = this.getListView(this.todoList);
      form.list.show(listView);
    },

    addTodo: function(todoData){
      var todo = new App.Todo(todoData);
      this.todoList.add(todo);
    },

    getListView: function(todos){
      var listView = new App.TodoListView({
        collection: todos
      });
      return listView;
    },

    getTodoForm: function(){
      var layout = new App.Layout({
        el: $("#todoapp")
      });
      layout.render();
      return layout;
    }

  };
  
  // Initializers
  // ------------

  TodoMVC.addInitializer(function(){
    todoApp.run();
  });

});

// Start the app on jQuery DOMReady
$(function(){
  TodoMVC.start();
});
