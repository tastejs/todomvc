import { connect } from 'pwa-helpers'
import { html, css, LitElement, unsafeCSS } from 'lit';
import { classMap } from 'lit/directives/class-map.js';

import { store, setEdit, setTodo, toggleTodos, leaveEdit, deleteTodo } from '../store.js'
import { appCSSRules, baseCSSRules } from '../constant.js'

const ESCAPE_KEY = 27;

export class TodoItem extends connect(store)(LitElement) {
    static properties = {
        todo: { type: Object }
    }

    static styles = [
        css`
        :host(:focus) { box-shadow: none!important; }
        .todo-list li:last-child {
            border-bottom: 1px solid #ededed!important;
        }
        `,
        ...baseCSSRules.map((r) => unsafeCSS(r)),
        ...appCSSRules.map((r) => unsafeCSS(r))
    ]

    get isEditing () {
        const state = store.getState()
        return this.todo.id === state.editingTodo
    }

    stateChanged() {
        this.requestUpdate()
    }

    beginEdit(event) {
        setEdit(this.todo.id)
        event.target.closest('li').lastElementChild[0].select()
    }

    finishEdit(event) {
        event.preventDefault()

        const text = event.target[0].value
        setTodo({ ...this.todo, text })
        leaveEdit()
    }

    abortEdit(event) {
        event.target.value = this.todo.text
        leaveEdit()
    }

    captureEscape(event) {
        if (event.which === ESCAPE_KEY) {
            abortEdit(event)
        }
    }

    render() {
        const itemClassList = {
            todo: true,
            completed: this.todo.completed,
            editing: this.isEditing
        }
        return html`
        <ul class="todo-list">
            <li class="${classMap(itemClassList)}">
                <div class="view">
                    <input
                        class="toggle"
                        type="checkbox"
                        .checked=${this.todo.completed}
                        @change=${()=> toggleTodos([this.todo.id])}
                    />
                    <label @dblclick=${this.beginEdit.bind(this)}>
                        ${this.todo.text}
                    </label>
                    <button
                        @click=${()=> deleteTodo(this.todo.id)}
                        class="destroy"
                    ></button>
                </div>
                <form @submit=${this.finishEdit.bind(this)}>
                    <input
                        class="edit"
                        type="text"
                        @keyup=${this.captureEscape.bind(this)}
                        @blur=${this.abortEdit.bind(this)}
                        value=${this.todo.text}
                    />
                </form>
            </li>
        </ul>
      `
    }
}
customElements.define('todo-item', TodoItem)
