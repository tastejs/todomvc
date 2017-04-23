// An example Backbone/Backbone.Marionette application 
// contributed by [Derick Bailey](http://mutedsolutions.com)
// and build with [Backbone.Marionette](http://github.com/derickbailey/backbone.marionette).

TodoMVC.module("TodoList", function(TodoList, TodoMVC, Backbone, Marionette, $, _){
  // Views
  // -----

  // Item view for each item in the collection. This handled the
  // interaction of each individual item, as well as the checking
  // and un-checking of the box, css class for strike-through / done, etc
  TodoList.TodoItemView = Marionette.ItemView.extend({
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

  // Collection view for the list of items. This is a wrapper
  // view that renders each of the individual Todo items, using
  // the defined TodoItemView.
  TodoList.TodoListView = Marionette.CollectionView.extend({
    itemView: TodoList.TodoItemView
  });

  // Stats view. This is the stats at the bottom of the todo list,
  // where you can see how many are lef to be done, and clear the
  // list of completed items.
  TodoList.StatsView = Marionette.ItemView.extend({
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

  // The primary object to get the actual todo list of the ground 
  // and running.
  var todoList = {

    run: function(todos){
      var listView = this.getListView(todos);
      TodoMVC.list.show(listView);

      var statsView = this.getStatsView(todos);
      TodoMVC.stats.show(statsView);
    },

    getStatsView: function(todos){
      var statsView = new TodoList.StatsView({
        collection: todos
      });
      return statsView;
    },

    getListView: function(todos){
      var listView = new TodoList.TodoListView({
        collection: todos
      });
      return listView;
    }
  };

  // Initializer
  // -----------

  // All `Marionette.Application` objects have an event aggregator. We're
  // listening to this one to tell us that the app was initialized, and
  // give us the list of Todos to use for display and manipulation in
  // our list.
  TodoMVC.vent.on("app:initialized", function(todos){
    todoList.run(todos);
  });

});
