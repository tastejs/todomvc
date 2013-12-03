(function () {
    function View(template) {
        this.template = template;

        this.$todoList = $$('#todo-list');
        this.$todoItemCounter = $$('#todo-count');
        this.$clearCompleted = $$('#clear-completed');
    }

    View.prototype._removeItem = function (id) {
        var elem = $$('[data-id="' + id + '"]');

        if (elem) {
            this.$todoList.removeChild(elem);
        }
    };

    View.prototype._clearCompletedButton = function (completedCount, visible) {
        this.$clearCompleted.innerHTML = this.template.clearCompletedButton(completedCount);
        this.$clearCompleted.style.display = visible ? 'block' : 'none';
    };

    View.prototype.render = function (viewCmd, parameter) {
        if (viewCmd === 'showEntries') {
            this.$todoList.innerHTML = this.template.show(parameter);
        } else if (viewCmd === 'removeItem') {
            this._removeItem(parameter);
        } else if (viewCmd === 'updateElementCount') {
            this.$todoItemCounter.innerHTML = this.template.itemCounter(parameter);
        } else if (viewCmd === 'clearCompletedButton') {
            this._clearCompletedButton(parameter.completed, parameter.visible);
        }
    };

    window.app.View = View;
}())
