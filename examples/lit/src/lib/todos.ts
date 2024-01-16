/* Borrowed from https://github.com/ai/nanoid/blob/3.0.2/non-secure/index.js

The MIT License (MIT)

Copyright 2017 Andrey Sitnik <andrey@sitnik.ru>

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. */

// This alphabet uses `A-Za-z0-9_-` symbols.
// The order of characters is optimized for better gzip and brotli compression.
// References to the same file (works both for gzip and brotli):
// `'use`, `andom`, and `rict'`
// References to the brotli default dictionary:
// `-26T`, `1983`, `40px`, `75px`, `bush`, `jack`, `mind`, `very`, and `wolf`
let urlAlphabet = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";

function nanoid(size = 21) {
    let id = "";
    // A compact alternative for `for (var i = 0; i < step; i++)`.
    let i = size;
    while (i--) {
        // `| 0` is more compact and faster than `Math.floor()`.
        id += urlAlphabet[(Math.random() * 64) | 0];
    }
    return id;
}

export interface Todo {
    id: string;
    text: string;
    completed: boolean;
}

export type TodoEdit = Partial<Todo> & { id: string };

const todoFilters = ["all", "active", "completed"] as const;
export type TodoFilter = (typeof todoFilters)[number];
function isTodoFilter(value: string | undefined): value is TodoFilter {
    return todoFilters.includes(value as TodoFilter);
}

/**
 * A mutable, observable container for a todo list.
 *
 * @fires a `change` event when the todo list changes.
 */
export class Todos extends EventTarget {
    #todos: Array<Todo> = [];
    #filter: TodoFilter = this.#filterFromUrl();

    get all(): ReadonlyArray<Todo> {
        return this.#todos;
    }

    get active(): ReadonlyArray<Todo> {
        return this.#todos.filter((todo) => !todo.completed);
    }

    get completed(): ReadonlyArray<Todo> {
        return this.#todos.filter((todo) => todo.completed);
    }

    get allCompleted(): boolean {
        return this.#todos.every((todo) => todo.completed);
    }

    connect() {
        window.addEventListener("hashchange", this.#onHashChange);
    }

    disconnect() {
        window.removeEventListener("hashchange", this.#onHashChange);
    }

    filtered() {
        switch (this.#filter) {
            case "active":
                return this.active;
            case "completed":
                return this.completed;
        }
        return this.all;
    }

    #notifyChange() {
        this.dispatchEvent(new Event("change"));
    }

    add(text: string) {
        this.#todos.push({
            text,
            completed: false,
            id: nanoid(),
        });
        this.#notifyChange();
    }

    delete(id: string) {
        const index = this.#todos.findIndex((todo) => todo.id === id);
        // Note: if the todo is not found, index is -1, and the >>> will flip the
        // sign which makes the splice do nothing. Otherwise, index is the item
        // we want to remove.
        this.#todos.splice(index >>> 0, 1);
        this.#notifyChange();
    }

    update(edit: TodoEdit) {
        const todo = this.#todos.find((todo) => todo.id === edit.id);

        if (todo === undefined)
            return;

        Object.assign(todo, edit);
        this.#notifyChange();
    }

    toggle(id: string) {
        const todo = this.#todos.find((todo) => todo.id === id);
        if (todo === undefined)
            return;

        todo.completed = !todo.completed;
        this.#notifyChange();
    }

    toggleAll() {
        // First pass to see if all the TODOs are completed. If all the
        // todos are completed, we'll set them all to active
        const allComplete = this.#todos.every((todo) => todo.completed);

        // Replace the list to trigger updates
        this.#todos = this.#todos.map((todo) => ({
            ...todo,
            completed: !allComplete,
        }));
        this.#notifyChange();
    }

    clearCompleted() {
        this.#todos = this.active as Todo[];
        this.#notifyChange();
    }

    get filter(): TodoFilter {
        return this.#filter;
    }

    set filter(filter: TodoFilter) {
        this.#filter = filter;
        this.#notifyChange();
    }

    #onHashChange = () => {
        this.filter = this.#filterFromUrl();
    };

    #filterFromUrl() {
        let filter = /#\/(.*)/.exec(window.location.hash)?.[1];
        if (isTodoFilter(filter))
            return filter;

        return "all";
    }
}
