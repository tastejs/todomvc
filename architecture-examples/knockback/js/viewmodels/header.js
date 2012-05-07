(function() {
  var ENTER_KEY;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  ENTER_KEY = 13;
  window.HeaderViewModel = function(todos) {
    this.title = ko.observable('');
    this.onAddTodo = __bind(function(view_model, event) {
      if (!$.trim(this.title()) || (event.keyCode !== ENTER_KEY)) {
        return true;
      }
      todos.create({
        title: $.trim(this.title())
      });
      return this.title('');
    }, this);
    return this;
  };
}).call(this);
