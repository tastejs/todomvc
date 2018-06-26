import { TodoApp } from "./todoapp";
import { Todo } from "./todowidget";

const todos: Todo[] = [
    // {
    //     id: new Date().getTime(),
    //     title: "Learn prest-lib widgets",
    //     completed: true
    // },
    // {
    //     id: new Date().getTime() + 1,
    //     title: "Add star to prest-lib",
    //     completed: false
    // }
];

const app = new TodoApp(document.getElementById("app"), todos);

(self as any).app = app;
(self as any).app.version = "@VERSION@";
