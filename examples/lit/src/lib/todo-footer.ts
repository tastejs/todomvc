import { LitElement, html, css, nothing } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { property } from "lit/decorators/property.js";
import { classMap } from "lit/directives/class-map.js";

import { todoStyles } from "./todo.css.js";
import { type Todos } from "./todos.js";
import { updateOnEvent } from "./utils.js";
import { ClearCompletedEvent } from "./events.js";

@customElement("todo-footer")
export class TodoFooter extends LitElement {
    static override styles = [
        todoStyles,
        css`
            :host {
                display: block;
                padding: 10px 15px;
                height: 20px;
                text-align: center;
                font-size: 15px;
                border-top: 1px solid #e6e6e6;
            }
            :host:before {
                content: "";
                position: absolute;
                right: 0;
                bottom: 0;
                left: 0;
                height: 50px;
                overflow: hidden;
                box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2), 0 8px 0 -3px #f6f6f6, 0 9px 1px -3px rgba(0, 0, 0, 0.2), 0 16px 0 -6px #f6f6f6, 0 17px 2px -6px rgba(0, 0, 0, 0.2);
            }

            .todo-count {
                float: left;
                text-align: left;
            }
            .todo-count strong {
                font-weight: 300;
            }

            .filters {
                margin: 0;
                padding: 0;
                list-style: none;
                position: absolute;
                right: 0;
                left: 0;
            }

            li {
                display: inline;
            }
            li a {
                color: inherit;
                margin: 3px;
                padding: 3px 7px;
                text-decoration: none;
                border: 1px solid transparent;
                border-radius: 3px;
            }

            a:hover {
                border-color: #db7676;
            }

            a.selected {
                border-color: #ce4646;
            }
            .clear-completed,
            :host .clear-completed:active {
                float: right;
                position: relative;
                line-height: 19px;
                text-decoration: none;
                cursor: pointer;
            }

            .clear-completed:hover {
                text-decoration: underline;
            }
        `,
    ];

    @updateOnEvent("change")
    @property({ attribute: false })
        todoList?: Todos;

    override render() {
        if (this.todoList === undefined || this.todoList.all.length === 0)
            return nothing;

        const allFilter = filterLink({
            text: "All",
            filter: "all",
            selectedFilter: this.todoList?.filter,
        });
        const activeFilter = filterLink({
            text: "Active",
            filter: "active",
            selectedFilter: this.todoList?.filter,
        });
        const completedFilter = filterLink({
            text: "Completed",
            filter: "completed",
            selectedFilter: this.todoList?.filter,
        });
        return html`
            <span class="todo-count">
                <strong>${this.todoList?.active.length}</strong>
                items left
            </span>
            <ul class="filters">
                <li>${allFilter}</li>
                <li>${activeFilter}</li>
                <li>${completedFilter}</li>
            </ul>
            ${(this.todoList?.completed.length ?? 0) > 0 ? html`<button @click=${this.#onClearCompletedClick} class="clear-completed">Clear Completed</button>` : nothing}
        `;
    }

    #onClearCompletedClick() {
        this.dispatchEvent(new ClearCompletedEvent());
    }
}

function filterLink({ text, filter, selectedFilter }: { text: string; filter: string; selectedFilter: string | undefined }) {
    return html`<a class="${classMap({ selected: filter === selectedFilter })}" href="#/${filter}">${text}</a>`;
}

declare global {
    // eslint-disable-next-line no-unused-vars
    interface HTMLElementTagNameMap {
        "todo-footer": TodoFooter;
    }
}
