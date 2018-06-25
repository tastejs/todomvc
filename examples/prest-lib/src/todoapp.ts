import { Hash } from "prest-lib/src/main/hash";
import { TodoWidget, Todo } from "./todowidget";
import { Store } from "./store";
import { todotHandlers } from "./todohandlers";

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
        todotHandlers(this.todoWidget.events, this.store);
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
                case "/":
                case "/active":
                case "/completed":
                    this.todoWidget.getState().filter = data;
                    this.todoWidget.update();
                    this.todoWidget.events.emit("filter", data);
                    break;
                default:
                    this.todoWidget.getState().filter = "";
                    this.todoWidget.update();
                    this.todoWidget.events.emit("filter", data);
                    this.hash.write("/");
                    break;
            }
        })
        .start();
    }

}
