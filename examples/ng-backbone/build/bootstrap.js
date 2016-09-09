"use strict";
var todo_1 = require("./routers/todo");
var todo_2 = require("./views/todo");
var view = new todo_2.TodoView(), router = new todo_1.TodoRouter();
router.addListener(view);
Backbone.history.start();
