import { TodoRouter } from "./routers/todo";
import { TodoView } from "./views/todo";

let view = new TodoView(),
    router = new TodoRouter();

router.addListener( view );
Backbone.history.start();