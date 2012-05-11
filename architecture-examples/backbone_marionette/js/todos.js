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

    toggleAll: function(done){
      this.each(function(todo){ todo.toggle(done); });
    },

    updateCounts: function(){
      var counts = {};

      counts.total = this.length;
      counts.done = this.doneCount();
      counts.remaining = counts.total - counts.done;
      counts.allDone = counts.remaining === 0;

      this.counts = counts;
      this.trigger("update:counts", counts);
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
      "click .mark-all-done": "toggleAllClicked",
    },

    triggers: {
      "change .todo-clear a": "clear:completed"
    },

    initialize: function(){
      this.bindTo(this.collection, "update:counts", this.countsUpdated, this);
    },

    countsUpdated: function(counts){
      var $chk = this.$(".mark-all-done");
      if (counts.allDone){
        $chk.prop("checked", true);
      } else {
        $chk.prop("checked", false);
      }
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

    toggleAllClicked: function(e){
      var $chk = $(e.currentTarget);
      var checked = !!$chk.attr("checked");
      this.collection.toggleAll(checked);
    },

    render: function(){
      this.initializeRegions();
    }
  });

  App.TodoItemView = Marionette.ItemView.extend({
    template: "#item-template",
    tagName: "li",

    events: {
      "click input.check": "checkChanged"
    },

    initialize: function(){
      _.bindAll(this, "render");
      this.bindTo(this.model, "change:done", this.changeDone, this);
    },

    checkChanged: function(e){
      var checked = !!$(e.currentTarget).attr("checked");
      this.model.toggle(checked);
    },

    changeDone: function(model, done){
      var $chk = this.$(".check");
      var $todo = this.$(".todo");

      if (done){
        $chk.prop("checked", true);
        $todo.addClass("done");
      } else {
        $chk.prop("checked", false);
        $todo.removeClass("done");
      }
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

      var form = this.getTodoForm(this.todoList);

      form.on("create:todo", this.todoList.add, this.todoList);
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

    getTodoForm: function(todos){
      var layout = new App.Layout({
        el: $("#todoapp"),
        collection: todos
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
