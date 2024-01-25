"use strict";
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
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Todos_instances, _Todos_todos, _Todos_filter, _Todos_notifyChange, _Todos_onHashChange, _Todos_filterFromUrl;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Todos = void 0;
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
const todoFilters = ["all", "active", "completed"];
function isTodoFilter(value) {
    return todoFilters.includes(value);
}
/**
 * A mutable, observable container for a todo list.
 *
 * @fires a `change` event when the todo list changes.
 */
class Todos extends EventTarget {
    constructor() {
        super(...arguments);
        _Todos_instances.add(this);
        _Todos_todos.set(this, []);
        _Todos_filter.set(this, __classPrivateFieldGet(this, _Todos_instances, "m", _Todos_filterFromUrl).call(this));
        _Todos_onHashChange.set(this, () => {
            this.filter = __classPrivateFieldGet(this, _Todos_instances, "m", _Todos_filterFromUrl).call(this);
        });
    }
    get all() {
        return __classPrivateFieldGet(this, _Todos_todos, "f");
    }
    get active() {
        return __classPrivateFieldGet(this, _Todos_todos, "f").filter((todo) => !todo.completed);
    }
    get completed() {
        return __classPrivateFieldGet(this, _Todos_todos, "f").filter((todo) => todo.completed);
    }
    get allCompleted() {
        return __classPrivateFieldGet(this, _Todos_todos, "f").every((todo) => todo.completed);
    }
    connect() {
        window.addEventListener("hashchange", __classPrivateFieldGet(this, _Todos_onHashChange, "f"));
    }
    disconnect() {
        window.removeEventListener("hashchange", __classPrivateFieldGet(this, _Todos_onHashChange, "f"));
    }
    filtered() {
        switch (__classPrivateFieldGet(this, _Todos_filter, "f")) {
            case "active":
                return this.active;
            case "completed":
                return this.completed;
        }
        return this.all;
    }
    add(text) {
        __classPrivateFieldGet(this, _Todos_todos, "f").push({
            text,
            completed: false,
            id: nanoid(),
        });
        __classPrivateFieldGet(this, _Todos_instances, "m", _Todos_notifyChange).call(this);
    }
    delete(id) {
        const index = __classPrivateFieldGet(this, _Todos_todos, "f").findIndex((todo) => todo.id === id);
        // Note: if the todo is not found, index is -1, and the >>> will flip the
        // sign which makes the splice do nothing. Otherwise, index is the item
        // we want to remove.
        __classPrivateFieldGet(this, _Todos_todos, "f").splice(index >>> 0, 1);
        __classPrivateFieldGet(this, _Todos_instances, "m", _Todos_notifyChange).call(this);
    }
    update(edit) {
        const todo = __classPrivateFieldGet(this, _Todos_todos, "f").find((todo) => todo.id === edit.id);
        if (todo === undefined)
            return;
        Object.assign(todo, edit);
        __classPrivateFieldGet(this, _Todos_instances, "m", _Todos_notifyChange).call(this);
    }
    toggle(id) {
        const todo = __classPrivateFieldGet(this, _Todos_todos, "f").find((todo) => todo.id === id);
        if (todo === undefined)
            return;
        todo.completed = !todo.completed;
        __classPrivateFieldGet(this, _Todos_instances, "m", _Todos_notifyChange).call(this);
    }
    toggleAll() {
        // First pass to see if all the TODOs are completed. If all the
        // todos are completed, we'll set them all to active
        const allComplete = __classPrivateFieldGet(this, _Todos_todos, "f").every((todo) => todo.completed);
        // Replace the list to trigger updates
        __classPrivateFieldSet(this, _Todos_todos, __classPrivateFieldGet(this, _Todos_todos, "f").map((todo) => (Object.assign(Object.assign({}, todo), { completed: !allComplete }))), "f");
        __classPrivateFieldGet(this, _Todos_instances, "m", _Todos_notifyChange).call(this);
    }
    clearCompleted() {
        __classPrivateFieldSet(this, _Todos_todos, this.active, "f");
        __classPrivateFieldGet(this, _Todos_instances, "m", _Todos_notifyChange).call(this);
    }
    get filter() {
        return __classPrivateFieldGet(this, _Todos_filter, "f");
    }
    set filter(filter) {
        __classPrivateFieldSet(this, _Todos_filter, filter, "f");
        __classPrivateFieldGet(this, _Todos_instances, "m", _Todos_notifyChange).call(this);
    }
}
exports.Todos = Todos;
_Todos_todos = new WeakMap(), _Todos_filter = new WeakMap(), _Todos_onHashChange = new WeakMap(), _Todos_instances = new WeakSet(), _Todos_notifyChange = function _Todos_notifyChange() {
    this.dispatchEvent(new Event("change"));
}, _Todos_filterFromUrl = function _Todos_filterFromUrl() {
    var _a;
    let filter = (_a = /#\/(.*)/.exec(window.location.hash)) === null || _a === void 0 ? void 0 : _a[1];
    if (isTodoFilter(filter))
        return filter;
    return "all";
};
