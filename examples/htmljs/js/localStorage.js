(function (html) {
    'use strict';
    // Storage id for htmljs framework
    var STORAGE_ID = 'todos-htmljs';
    var storage = {
        getFromLocalStorage: function () {
            // get all "todo" items, parse JSON string from local storage
            return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
        },
        saveToLocalStorage: function (todos) {
            // save all "todo" items
            localStorage.setItem(STORAGE_ID, JSON.stringify(todos));
        }
    };
    // export storage module
    html.module('storage', storage);
})(window.html);