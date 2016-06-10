/*global $*/

var todoList = new TodoList();

var app = new Backbone.Marionette.Application();

app.bindTo(todoList, 'all', function () {
  if (todoList.length === 0) {
    app.main.$el.hide();
    app.footer.$el.hide();
  } else {
    app.main.$el.show();
    app.footer.$el.show();
  }
});

app.addRegions({
  header : '#header',
  main   : '#main',
  footer : '#footer'
});

app.addInitializer(function(){
  app.header.show(new Header());
  app.main.show(new TodoListCompositeView({
    collection : todoList
  }));
  app.footer.show(new Footer());

  todoList.fetch();
});


app.vent.on('todoList:filter',function(filter) {
  filter = filter || 'all';
  $('#todoapp').attr('class', 'filter-' + filter);
});

$(function(){
  app.start();
  new Router();
  Backbone.history.start();
});


