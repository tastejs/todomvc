import { Hash } from "../node_modules/prest-lib/src/main/hash";
import { TodoWidget, Todo } from "./todowidget";
import { Store } from "./store";

export class TodoApp {

    store: Store<Todo[]>;
    todoWidget: TodoWidget;
    hash: Hash<string>;

    constructor(element: HTMLElement, todos: Todo[] = []) {
        this._initStore(todos);
        this._initWidget(element);
        this._initRouting();
    }

    private _initStore(todos: Todo[]): void {
        this.store = new Store<Todo[]>(todos);
    }

    private _initWidget(element: HTMLElement): void {
        this.todoWidget = new TodoWidget()
            .setState({
                todo: "",
                todos: this.store.read(),
                filter: "",
                edit: null
            });

        this.todoWidget.events
            .on("insert", (title: string, w: TodoWidget) => {
                const todo = {
                    id: new Date().getTime(),
                    title: title,
                    completed: false
                } as Todo;
                w.getState().todos.push(todo);
                w.getState().todo = "";
                w.update();
                // this.store.write(w.getState().todos);
            })
            .on("complete-all", (complete: boolean, w: TodoWidget) => {
                w.getState().todos.forEach(t => t.completed = complete);
                w.update();
                // this.store.write(w.getState().todos);
            })
            .on("complete", (id: number, w: TodoWidget) => {
                w.getState().todos.forEach(t => t.id === id ? t.completed = !t.completed : null);
                w.update();
                // this.store.write(w.getState().todos);
            })
            .on("delete", (id: number, w: TodoWidget) => {
                console.log("dddd", id);
                w.getState().todos = w.getState().todos.filter(t => t.id !== id);
                w.update();
                // this.store.write(w.getState().todos);
            })
            .on("clear-completed", (data: any, w: TodoWidget) => {
                w.getState().todos = w.getState().todos.filter(t => !t.completed);
                w.update();
                // this.store.write(w.getState().todos);
            })
            .on("edit", (id: number, w: TodoWidget) => {
                w.getState().edit = id;
                w.update();
            })
            .on("edited", (title: string, w: TodoWidget) => {
                w.getState().todos.forEach(t => t.id === w.getState().edit ? t.title = title : null);
                w.getState().edit = null;
                w.update();
                // this.store.write(w.getState().todos);
            })
            .any((data: any, w: TodoWidget, e: string) => {
                console.log(e, JSON.stringify(data, null, 4));
                console.log("state", JSON.stringify(w.getState(), null, 4));
                this.store.write(w.getState().todos);
            });

        this.todoWidget.mount(element);
    }

    private _initRouting(): void {
        this.hash = new Hash<string>()
        .coders(
            data => encodeURIComponent(data),
            str => decodeURIComponent(str)
        )
        .onChange(data => {
            switch (data) {
                case "":
                case "active":
                case "completed":
                    this.todoWidget.getState().filter = data;
                    this.todoWidget.update();
                    this.todoWidget.events.emit("filter", data);
                    break;
                default:
                    this.todoWidget.getState().filter = "";
                    this.todoWidget.update();
                    this.todoWidget.events.emit("filter", data);
                    this.hash.write("");
                    break;
            }
        })
        .start();
    }

}
