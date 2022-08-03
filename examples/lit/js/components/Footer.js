import { html, css, LitElement, unsafeCSS } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { when } from 'lit/directives/when.js';

import { deleteCompleted } from '../store.js'
import { appCSSRules, baseCSSRules } from '../constant.js'

function filterLink({ text, filter, selectedFilter }) {
    return html`<a
        class="${classMap({ selected: filter === selectedFilter })}"
        href="#/${filter}"
    >${text}</a>`;
}

export class Footer extends LitElement {
    static properties = {
        itemsLeft: { type: Number },
        totalItems: { type: Number },
        selectedFilter: { type: String }
    }

    static styles = [
        css`:host(:focus) { box-shadow: none!important }`,
        ...baseCSSRules.map((r) => unsafeCSS(r)),
        ...appCSSRules.map((r) => unsafeCSS(r))
    ]

    render () {
        return html`
        <footer class="footer">
            <span class="todo-count">
                <strong>${this.itemsLeft}</strong>
                items left
            </span>
            <ul class="filters">
                <li>
                    ${filterLink({
                        text: 'All',
                        filter: 'all',
                        selectedFilter: this.selectedFilter
                    })}
                </li>
                <li>
                    ${filterLink({
                        text: 'Active',
                        filter: 'active',
                        selectedFilter: this.selectedFilter
                    })}
                </li>
                <li>
                    ${filterLink({
                        text: 'Completed',
                        filter: 'completed',
                        selectedFilter: this.selectedFilter
                    })}
                </li>
            </ul>
            ${when(this.totalItems !== this.itemsLeft, () => (
                html`
                <button @click=${deleteCompleted} class="clear-completed">
                    Clear Completed
                </button>`
            ))}
        </footer>`
    }
}
customElements.define('todo-footer', Footer)
