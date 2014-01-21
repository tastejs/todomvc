/*
Sets up a brand new Todo list.
@param {string} name The name of your new to do list.
*/


(function() {
  var Todo, todo;

  Todo = (function() {
    function Todo(name) {
      this.name = name;
      this.storage = new app.Store(this.name);
      this.model = new app.Model(this.storage);
      this.template = new app.Template;
      this.view = new app.View(this.template);
      this.controller = new app.Controller(this.model, this.view);
    }

    return Todo;

  })();

  todo = new Todo("todos-coffeescript");

  window.addEventListener("load", function() {
    return todo.controller.setView(document.location.hash);
  });

  window.addEventListener("hashchange", function() {
    return todo.controller.setView(document.location.hash);
  });

}).call(this);
