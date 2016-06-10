
var TodoList = (function(){
  function isCompleted(todo) { return todo.get('completed'); }

  return Backbone.Collection.extend({
    model: Todo,
    localStorage: new Backbone.LocalStorage('todos-backbone'),

    getCompleted: function() {
      return this.filter(isCompleted);
    },
    getActive: function() {
      return this.reject(isCompleted);
    },
    comparator: function( todo ) {
      return todo.get('created');
    }
  });
}());
