// An example Backbone/Backbone.Marionette application 
// contributed by [Derick Bailey](http://mutedsolutions.com). 

// Define an application
var TodoMVC = new Backbone.Marionette.Application();

// Create a module to hide our private implementation details
TodoMVC.module("App", function(App, TodoMVC, Backbone, Marionette, $, _){

  // Models
  // ------

  App.Todo = Backbone.Model.extend({
    toggle: function(done){
      done = done || !this.get("done");
      this.set({done: done});
    }
  });

  App.TodoCollection = Backbone.Collection.extend({
    model: App.Todo,

    toggle: function(done){
      this.each(function(todo){ todo.toggle(done); });
    }
  });

  // Views
  // -----

  App.Layout = Marionette.Layout.extend({
    regions: {
      list: "#todo-list",
      stats: "#todo-stats"
    },

    events: {
      "keypress #new-todo":  "createOnEnter",
      "change .mark-all-done": "toggleAllComplete"
      //"keyup #new-todo":     "showTooltip",
      //"click .todo-clear a": "clearCompleted",
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

    toggleAllComplete: function(e){
      var checked = !!$(e.currentTarget).attr("checked");
      this.trigger("toggle:all", checked)
    },

    render: function(){
      this.initializeRegions();
    }
  });

  App.TodoItemView = Marionette.ItemView.extend({
    template: "#item-template",
    tagName: "li",

    events: {
      "click input.check": "checkClicked"
    },

    initialize: function(){
      this.bindTo(this.model, "change:done", this.showComplete, this);
    },

    checkClicked: function(e){
      this.model.toggle();
    },

    showComplete: function(attr, done){
      if (done){
        this.checkbox.attr("checked", "checked");
        this.todo.addClass("done");
      } else {
        this.checkbox.removeAttr("checked");
        this.todo.removeClass("done");
      }
    },

    onRender: function(){
      this.checkbox = this.$("input.check");
      this.todo = this.$(".todo");
    }
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
      form.on("toggle:all", this.toggleAll, this);

      var listView = this.getListView(this.todoList);
      form.list.show(listView);
    },

    toggleAll: function(done){
      this.todoList.toggle(done);
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
