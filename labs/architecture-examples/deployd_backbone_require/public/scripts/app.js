require([
  "models/todo",
  "collections/todos",
  "lib/utils",
  "views/app_view",
  "views/todo_view"
], function (Todo, Todos, Utils, AppView, TodoView) {
    $(function () {
    	'use strict';

      window.app = new AppView();
    });
  }
);
