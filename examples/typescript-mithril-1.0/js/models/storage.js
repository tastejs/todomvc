'use strict';
var TodoStorage = (function () {
    function TodoStorage() {
    }
    TodoStorage.get = function () {
        return JSON.parse(localStorage.getItem(TodoStorage.STORAGE_ID) || '[]');
    };
    TodoStorage.put = function (todos) {
        localStorage.setItem(TodoStorage.STORAGE_ID, JSON.stringify(todos));
    };
    return TodoStorage;
}());
TodoStorage.STORAGE_ID = 'todos-mithril';
//# sourceMappingURL=storage.js.map