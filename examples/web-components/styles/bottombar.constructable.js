const sheet = new CSSStyleSheet();
sheet.replaceSync(`:host {
    display: block;
    box-shadow: none !important;
}

.bottombar {
    padding: 10px 0;
    height: 41px;
    text-align: center;
    font-size: 15px;
    border-top: 1px solid #e6e6e6;
    position: relative;
}

.bottombar::before {
    content: "";
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 50px;
    overflow: hidden;
    pointer-events: none;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2), 0 8px 0 -3px #f6f6f6, 0 9px 1px -3px rgba(0, 0, 0, 0.2), 0 16px 0 -6px #f6f6f6, 0 17px 2px -6px rgba(0, 0, 0, 0.2);
}

.todo-status {
    text-align: left;
    padding: 3px;
    height: 32px;
    line-height: 26px;
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
}

.todo-count {
    font-weight: 300;
}

.filter-list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: inline-block;
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
}

.filter-item {
    display: inline-block;
}

.filter-link {
    color: inherit;
    margin: 3px;
    padding: 0 7px;
    text-decoration: none;
    border: 1px solid transparent;
    border-radius: 3px;
    cursor: pointer;
    display: block;
    height: 26px;
    line-height: 26px;
}

.filter-link:hover {
    border-color: #db7676;
}

.filter-link.selected {
    border-color: #ce4646;
}

.clear-completed-button,
.clear-completed-button:active {
    text-decoration: none;
    cursor: pointer;
    padding: 3px;
    height: 32px;
    line-height: 26px;
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
}

.clear-completed-button:hover {
    text-decoration: underline;
}

/* rtl support */
html[dir="rtl"] .todo-status,
:host([dir="rtl"]) .todo-status {
    right: 12px;
    left: unset;
}

html[dir="rtl"] .clear-completed-button,
:host([dir="rtl"]) .clear-completed-button {
    left: 12px;
    right: unset;
}

@media (max-width: 430px) {
    .bottombar {
        height: 120px;
    }

    .todo-status {
        display: block;
        text-align: center;
        position: relative;
        left: unset;
        right: unset;
        top: unset;
        transform: unset;
    }

    .filter-list {
        display: block;
        position: relative;
        left: unset;
        right: unset;
        top: unset;
        transform: unset;
    }

    .clear-completed-button,
    .clear-completed-button:active {
        display: block;
        margin: 0 auto;
        position: relative;
        left: unset;
        right: unset;
        top: unset;
        transform: unset;
    }

        html[dir="rtl"] .todo-status,
    :host([dir="rtl"]) .todo-status {
        right: unset;
        left: unset;
    }

    html[dir="rtl"] .clear-completed-button,
    :host([dir="rtl"]) .clear-completed-button {
        left: unset;
        right: unset;
    }
}
`);
export default sheet;
