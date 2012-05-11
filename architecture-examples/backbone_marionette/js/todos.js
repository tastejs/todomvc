// An example Backbone/Backbone.Marionette application 
// contributed by [Derick Bailey](http://mutedsolutions.com)
// and build with [Backbone.Marionette](http://github.com/derickbailey/backbone.marionette).

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
    },

    isDone: function(){
      return this.get("done");
    }
  });

  App.TodoCollection = Backbone.Collection.extend({
    model: App.Todo,

    initialize: function(){
      this.updateCounts();
      this.on("add", this.updateCounts, this);
      this.on("remove", this.updateCounts, this);
      this.on("change:done", this.updateCounts, this);
    },

    clearCompleted: function(){
      var that = this;
      var completed = this.where({done: true});
      _.each(completed, function(todo){ that.remove(todo); });
    },

    toggle: function(done){
      this.each(function(todo){ todo.toggle(done); });
    },

    updateCounts: function(){
      var data = {};

      data.total = this.length;
      data.done = this.doneCount();
      data.remaining = data.total - data.done;

      this.counts = data;
      this.trigger("update:counts");
    },

    doneCount: function(){
      var done = this.reduce(function(memo, todo){

        if (todo.isDone()){
          memo += 1
        };

        return memo;
      }, 0);

      return done;
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
      "change .mark-all-done": "toggleAllComplete",
    },

    triggers: {
      "click .todo-clear a": "clear:completed"
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

  App.StatsView = Marionette.ItemView.extend({
    template: "#stats-template",

    initialize: function(){
      this.bindTo(this.collection, "update:counts", this.render, this);
    },

    serializeData: function(){
      return this.collection.counts;
    }
  });

  // Helpers
  // -------

  var todoApp = {

    run: function(){
      this.todoList = new App.TodoCollection();

      var form = this.getTodoForm();

      form.on("create:todo", this.todoList.add, this.todoList);
      form.on("toggle:all", this.todoList.toggle, this.todoList);
      form.on("clear:completed", this.todoList.clearCompleted, this.todoList);

      var listView = this.getListView(this.todoList);
      form.list.show(listView);

      var statsView = this.getStatsView(this.todoList);
      form.stats.show(statsView);
    },

    getStatsView: function(todos){
      var statsView = new App.StatsView({
        collection: todos
      });
      return statsView;
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
