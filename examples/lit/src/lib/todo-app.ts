import { LitElement, html, css } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { customElement } from "lit/decorators/custom-element.js";
import { state } from "lit/decorators/state.js";

import { todoStyles } from "./todo.css.js";
import { Todos } from "./todos.js";

import "./todo-list.js";
import "./todo-form.js";
import "./todo-footer.js";
import { AddTodoEvent, DeleteTodoEvent, ToggleAllTodoEvent, EditTodoEvent, ClearCompletedEvent } from "./events.js";
import { updateOnEvent } from "./utils.js";

@customElement("todo-app")
export class TodoApp extends LitElement {
    static override styles = [
        todoStyles,
        css`
            :host {
                display: block;
                background: #fff;
                margin: 130px 0 40px 0;
                position: relative;
                box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 25px 50px 0 rgba(0, 0, 0, 0.1);
            }
            h1 {
                position: absolute;
                top: -140px;
                width: 100%;
                font-size: 80px;
                font-weight: 200;
                text-align: center;
                color: #b83f45;
                -webkit-text-rendering: optimizeLegibility;
                -moz-text-rendering: optimizeLegibility;
                text-rendering: optimizeLegibility;
            }
            main {
                position: relative;
                z-index: 2;
                border-top: 1px solid #e6e6e6;
            }
            .hidden {
                display: none;
            }
            :focus {
                box-shadow: none !important;
            }
        `,
    ];

    @updateOnEvent("change")
    @state()
    readonly todoList = new Todos();

    constructor() {
        super();

        // event handlers for the app
        this.addEventListener(AddTodoEvent.eventName, this.#onAddTodo);
        this.addEventListener(DeleteTodoEvent.eventName, this.#onDeleteTodo);
        this.addEventListener(EditTodoEvent.eventName, this.#onEditTodo);
        this.addEventListener(ToggleAllTodoEvent.eventName, this.#onToggleAll);
        this.addEventListener(ClearCompletedEvent.eventName, this.#onClearCompleted);
    }

    override connectedCallback(): void {
        super.connectedCallback();
        this.todoList.connect();
    }

    override disconnectedCallback(): void {
        super.disconnectedCallback();
        this.todoList.disconnect();
    }

    override render() {
        return html`<section>
            <header class="header">
                <h1>todos</h1>
                <todo-form .todoList=${this.todoList}></todo-form>
            </header>
            <main class="main">
                <todo-list class="show-priority" .todoList=${this.todoList}></todo-list>
            </main>
            <todo-footer
                class="${classMap({
        hidden: this.todoList.all.length === 0,
    })}"
                .todoList=${this.todoList}
            ></todo-footer>
        </section>`;
    }

    #onAddTodo = (e: AddTodoEvent) => {
        this.todoList.add(e.text);
    };

    #onDeleteTodo = (e: DeleteTodoEvent) => {
        this.todoList.delete(e.id);
    };

    #onEditTodo = (e: EditTodoEvent) => {
        this.todoList.update(e.edit);
    };

    #onToggleAll = (_e: ToggleAllTodoEvent) => {
        this.todoList.toggleAll();
    };

    #onClearCompleted = (_e: ClearCompletedEvent) => {
        this.todoList.clearCompleted();
    };
}

declare global {
    // eslint-disable-next-line no-unused-vars
    interface HTMLElementTagNameMap {
        "todo-app": TodoApp;
    }
}
