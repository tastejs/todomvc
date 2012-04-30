(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  window.HeaderViewModel = function(todos) {
    this.title = ko.observable('');
    this.onAddTodo = __bind(function(view_model, event) {
      if (!$.trim(this.title()) || (event.keyCode !== 13)) {
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
