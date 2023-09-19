import { h } from "preact";

export default function TodoHeader({ onKeyDown }) {
    return (
        <header class="header">
            <h1>todos</h1>
            <input class="new-todo" placeholder="What needs to be done?" onKeyDown={onKeyDown} autoFocus />
        </header>
    );
}
