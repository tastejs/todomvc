TodoMVC.module("TodoList", function(TodoList, App, Backbone, Marionette, $, _){

  // TodoList Router
  // ---------------
  //
  // Handle routes to show the active vs complete todo items

  TodoList.Router = Marionette.AppRouter.extend({
    appRoutes : {
      "": "showActiveItems",
      "*filter": "showFilteredItems"
    }
  });

  // TodoList Controller (Mediator)
  // ------------------------------
  //
  // Control the workflow and logic that exists at the application
  // level, above the implementation detail of views and models
  
  TodoList.Controller = function(){
    this.todoList = new App.Todos.TodoList();
  };

  _.extend(TodoList.Controller.prototype, {

    // Start the app by showing the appropriate views
    // and fetching the list of todo items, if there are any
    start: function(){
      this.showHeader(this.todoList);
      this.showFooter(this.todoList);
      this.showTodoList(this.todoList);

      this.todoList.fetch();
    },

    showHeader: function(todoList){
      var header = new App.Layout.Header({
        collection: todoList
      });
      App.header.show(header);
    },

    showFooter: function(todoList){
      var footer = new App.Layout.Footer({
        collection: todoList
      });
      App.footer.show(footer);
    },

    showTodoList: function(todoList){
      App.main.show(new TodoList.Views.ListView({
        collection : todoList
      }));
    },

    // Set the filter to show active items only
    showActiveItems: function(){
      App.vent.trigger("todoList:filter", "");
    },

    // Set the filter to show complete or all items
    showFilteredItems: function(filter){
      App.vent.trigger("todoList:filter", filter.trim());
    }
  });

  // TodoList Initializer
  // --------------------
  //
  // Get the TodoList up and running by initializing the mediator
  // when the the application is started, pulling in all of the
  // existing Todo items and displaying them.
  
  TodoList.addInitializer(function(){

    var controller = new TodoList.Controller();
    new TodoList.Router({
      controller: controller
    });

    controller.start();

  });

  // Application Event Handlers
  // --------------------------
  //
  // Handler for filtering the list of items by showing and
  // hiding through the use of various CSS classes
  
  TodoMVC.vent.on('todoList:filter',function(filter) {
    filter = filter || 'all';
    $('#todoTodoMVC').attr('class', 'filter-' + filter);
  });

});
