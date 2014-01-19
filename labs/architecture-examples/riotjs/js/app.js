(function() { 'use strict';
    /*
       A Model instance exposed to global space so you can
       use the Todo APi from the console. For example:

       todo.add("My task");
   */
    window.todo = new Todo();
    todoPresenter(todo);
})();
