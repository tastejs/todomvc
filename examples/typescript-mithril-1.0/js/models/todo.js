'use strict';
var TodoItem = (function () {
    function TodoItem(data) {
        this.title = stream(data.title);
        this.completed = stream(data.completed || false);
        this.editing = stream(data.editing || false);
        this.key = ++TodoItem.count;
    }
    return TodoItem;
}());
TodoItem.count = 0;
//# sourceMappingURL=todo.js.map