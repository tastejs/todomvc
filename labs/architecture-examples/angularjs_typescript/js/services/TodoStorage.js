'use strict';
var TodoStorage = (function () {
    function TodoStorage() {
        this.STORAGE_ID = 'todos-angularjs-requirejs';
    }
    TodoStorage.prototype.get = function () {
        return JSON.parse(localStorage.getItem(this.STORAGE_ID) || '[]');
    };
    TodoStorage.prototype.put = function (todos) {
        localStorage.setItem(this.STORAGE_ID, JSON.stringify(todos));
    };
    return TodoStorage;
})();
//@ sourceMappingURL=TodoStorage.js.map
