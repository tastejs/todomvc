import { Events } from "prest-lib/src/main/events";
import { TodoWidget, Todo } from "./todowidget";
import { Store } from "./store";

export function todotHandlers(events: Events<TodoWidget>,
                              store: Store<Todo[]>): void {
    events
        .on("insert", (title: string, w: TodoWidget) => {
            const todo = {
                id: new Date().getTime(),
                title: title,
                completed: false
            } as Todo;
            w.getState().todos.push(todo);
            w.getState().todo = "";
            w.update();
        })
        .on("complete-all", (complete: boolean, w: TodoWidget) => {
            w.getState().todos.forEach(t => (t.completed = complete));
            w.update();
        })
        .on("complete", (id: number, w: TodoWidget) => {
            w.getState().todos.forEach(
                t => (t.id === id ? (t.completed = !t.completed) : null)
            );
            w.update();
        })
        .on("delete", (id: number, w: TodoWidget) => {
            w.getState().todos = w.getState().todos.filter(t => t.id !== id);
            w.update();
        })
        .on("clear-completed", (data: any, w: TodoWidget) => {
            w.getState().todos = w.getState().todos.filter(t => !t.completed);
            w.update();
        })
        .on("edit", (id: number, w: TodoWidget) => {
            w.getState().edit = id;
            w.update();
        })
        .on("edited", (title: string, w: TodoWidget) => {
            w.getState().todos.forEach(
                t => (t.id === w.getState().edit ? (t.title = title) : null)
            );
            w.getState().edit = null;
            w.update();
        })
        .any((data: any, w: TodoWidget, e: string) => {
            console.log(e, JSON.stringify(data, null, 4));
            console.log("state", JSON.stringify(w.getState(), null, 4));
            store.write(w.getState().todos);
        });
}
