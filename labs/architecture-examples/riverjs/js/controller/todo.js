/*
 * module dependence
 */

var model = require('model.todo') 
  , todos = exports.todos = model.get();

exports.newtodo = '';

exports.add = function (event) {
  if(event.keyCode == 13 && exports.newtodo){
    todos.unshift({
      desc:exports.newtodo,
      status:'active'
    });
    exports.newtodo = '';
  }
}

exports.remove = function (todo) {
  var index = todos.indexOf(todo);
  todos.splice(index,1);
}

exports.getAll = function(){

}

exports.getActive = function(){
}

exports.getCompleted = function(){
}
