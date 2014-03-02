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
   console.log(todo);
   console.log(index);
   todos.splice(index,1);
 }
