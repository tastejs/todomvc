// An example Backbone/Backbone.Marionette application 
// contributed by [Derick Bailey](http://mutedsolutions.com)
// and build with [Backbone.Marionette](http://github.com/derickbailey/backbone.marionette).

TodoMVC.module("TodoList", function(TodoList, TodoMVC, Backbone, Marionette, $, _){
  // Views
  // -----

  // Item view for each item in the collection
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

  // Collection view for the list of items
  TodoList.TodoListView = Marionette.CollectionView.extend({
    itemView: TodoList.TodoItemView
  });

  // Status view
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

  TodoMVC.vent.on("app:initialized", function(todos){
    todoList.run(todos);
  });

});
