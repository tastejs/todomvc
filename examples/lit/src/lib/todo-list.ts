import { LitElement, html, css, nothing } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { property } from "lit/decorators/property.js";
import { repeat } from "lit/directives/repeat.js";

import { todoStyles } from "./todo.css.js";
import { type Todos } from "./todos.js";

import "./todo-item.js";
import { ToggleAllTodoEvent } from "./events.js";
import { updateOnEvent } from "./utils.js";

declare global {
    // eslint-disable-next-line no-unused-vars
    interface HTMLElementTagNameMap {
        "todo-list": TodoList;
    }
    // eslint-disable-next-line no-unused-vars
    interface Window {
        extraTodoListCssToAdopt?: string;
    }
}

@customElement("todo-list")
export class TodoList extends LitElement {
    static override styles = [
        todoStyles,
        css`
            :host {
                display: block;
            }
            :focus {
                box-shadow: none !important;
            }
            .todo-list {
                margin: 0;
                padding: 0;
                list-style: none;
            }
            .toggle-all {
                width: 1px;
                height: 1px;
                border: none; /* Mobile Safari */
                opacity: 0;
                position: absolute;
                right: 100%;
                bottom: 100%;
            }

            .toggle-all + label {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 45px;
                height: 65px;
                font-size: 0;
                position: absolute;
                top: -65px;
                left: -0;
            }

            .toggle-all + label:before {
                content: "❯";
                display: inline-block;
                font-size: 22px;
                color: #949494;
                padding: 10px 27px 10px 27px;
                transform: rotate(90deg);
            }

            .toggle-all:checked + label:before {
                color: #484848;
            }

            todo-item {
                border-bottom: 1px solid #ededed;
            }
            todo-item:last-child {
                border-bottom: none;
            }
        `,
    ];

    @updateOnEvent("change")
    @property({ attribute: false })
        todoList?: Todos;

    override render() {
        return html`
            ${(this.todoList?.all.length ?? 0) > 0
        ? html`
                      <input @change=${this.#onToggleAllChange} id="toggle-all" type="checkbox" class="toggle-all" .checked=${this.todoList?.allCompleted ?? false} />
                      <label for="toggle-all"> Mark all as complete </label>
                  `
        : nothing}
            <ul class="todo-list">
                ${repeat(
        this.todoList?.filtered() ?? [],
        (todo) => todo.id,
        (todo) => html`<todo-item .todoId=${todo.id} .text=${todo.text} .completed=${todo.completed}></todo-item>`
    )}
            </ul>
        `;
    }

    #onToggleAllChange() {
        this.dispatchEvent(new ToggleAllTodoEvent());
    }
}
