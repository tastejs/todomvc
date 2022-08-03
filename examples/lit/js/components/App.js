import { connect } from 'pwa-helpers'
import { LitElement, html, css, unsafeCSS } from 'lit';
import { when } from 'lit/directives/when.js';

import { store, getTodos } from '../store.js'
import './TodoForm.js';
import './TodoList.js';
import './Footer.js';

import { appCSSRules, baseCSSRules } from '../constant.js'

export class TodoApp extends connect(store)(LitElement) {
    static styles = [
        css`:host(:focus) { box-shadow: none!important }`,
        ...baseCSSRules.map((r) => unsafeCSS(r)),
        ...appCSSRules.map((r) => unsafeCSS(r))
    ]

    static getFilter () {
        return location.hash.includes('#/')
            ? location.hash.replace('#/', '')
            : 'all'
    }

    constructor (...args) {
        super(...args)

        this.filter = TodoApp.getFilter()
        window.addEventListener('hashchange', () => {
            this.filter = TodoApp.getFilter()
            this.requestUpdate()
        })
    }

    stateChanged() {
        this.requestUpdate()
    }

    get todos () {
        return getTodos(this.filter)
    }

    get itemsLeft () {
        const state = store.getState()
        console.log('!!', state.todos);
        return this.totalItems - state.completed.length
    }

    get totalItems () {
        const state = store.getState()
        return Object.keys(state.todos).length
    }

    render () {
        return html`
        <section class="todoapp">
            <header class="header">
                <h1>todos</h1>
                <todo-form></todo-form>
            </header>
            <section class="main">
                <todo-list todos=${JSON.stringify(this.todos)}></todo-list>
            </section>
            ${when(this.totalItems > 0, () => html`
                <todo-footer
                    itemsLeft=${this.itemsLeft}
                    totalItems=${this.totalItems}
                    selectedFilter=${this.filter}>
                </todo-footer>
            `)}
        </section>
        `
    }
}
customElements.define('todo-app', TodoApp)

