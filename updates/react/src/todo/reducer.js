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

export const todoReducer = (state, action) => {
    switch (action.type) {
        case "ADD_ITEM":
            return state.concat({ id: nanoid(), title: action.payload.title, completed: false });
        case "UPDATE_ITEM":
            return state.map((todo) => (todo.id === action.payload.id ? { ...todo, title: action.payload.title } : todo));
        case "REMOVE_ITEM":
            return state.filter((todo) => todo.id !== action.payload.id);
        case "TOGGLE_ITEM":
            return state.map((todo) => (todo.id === action.payload.id ? { ...todo, completed: !todo.completed } : todo));
        case "REMOVE_ALL_ITEMS":
            return [];
        case "TOGGLE_ALL":
            return state.map((todo) => (todo.completed !== action.payload.completed ? { ...todo, completed: action.payload.completed } : todo));
        case "REMOVE_COMPLETED_ITEMS":
            return state.filter((todo) => !todo.completed);
    }

    throw Error(`Unknown action: ${action.type}`);
};
