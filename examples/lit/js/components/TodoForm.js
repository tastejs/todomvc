import { html, css, LitElement, unsafeCSS } from 'lit'

import { addTodoByText } from '../store.js'
import { appCSSRules, baseCSSRules } from '../constant.js'

export class TodoForm extends LitElement {
    static styles = [
        css`:host(:focus) { box-shadow: none!important }`,
        ...baseCSSRules.map((r) => unsafeCSS(r)),
        ...appCSSRules.map((r) => unsafeCSS(r))
    ]

    render () {
        return html`
            <form @submit=${this.handleSubmit.bind(this)}>
            <input
                class="new-todo"
                autofocus="autofocus"
                autocomplete="off"
                placeholder="what needs to be done?"
            />
            </form>
        `;
    }

    handleSubmit (event) {
        event.preventDefault()
        if (event.target[0].value.length <= 0) {
            return
        }

        addTodoByText(event.target[0].value)
        event.target[0].value = ''
    }
}
customElements.define('todo-form', TodoForm)
