import { html, css, LitElement, unsafeCSS } from "lit";
import { when } from 'lit/directives/when.js';
import { appCSSRules, baseCSSRules } from '../constant.js'

import { markAll } from '../store.js'
import './TodoItem.js';

export class TodoList extends LitElement {
    static properties = {
        todos: { type: Object }
    }

    static styles = [
        css`:host(:focus) { box-shadow: none!important }`,
        ...baseCSSRules.map((r) => unsafeCSS(r)),
        ...appCSSRules.map((r) => unsafeCSS(r))
    ]

    render () {
        return html`
            ${when(Object.keys(this.todos).length > 0, () => html`
                <input
                    @change=${markAll}
                    id="toggle-all"
                    type="checkbox"
                    class="toggle-all"
                />
                <label for="toggle-all">
                    Mark all as complete
                </label>`
            )}
            <ul class="todo-list">
                ${Object.values(this.todos).map((todo) => html`
                    <todo-item todo=${JSON.stringify(todo)}></todo-item>
                `)}
            </ul>
        `
    }
}
customElements.define('todo-list', TodoList)
