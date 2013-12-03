/*global $, $$ */

(function (window) {
    'use strict';

    function View(template) {
        this.template = template;

        this.$todoList = $$('#todo-list');
        this.$todoItemCounter = $$('#todo-count');
        this.$clearCompleted = $$('#clear-completed');
        this.$main = $$('#main');
        this.$footer = $$('#footer');
        this.$toggleAll = $$('#toggle-all');
        this.$newTodo = $$('#new-todo');
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

    View.prototype._setFilter = function (currentPage) {
        // Remove all other selected states. We loop through all of them in case the
        // UI gets in a funky state with two selected.
        $('#filters .selected').each(function (item) {
            item.className = '';
        });

        $('#filters [href="#/' + currentPage + '"]').each(function (item) {
            item.className = 'selected';
        });
    };

    View.prototype._elementComplete = function (id, completed) {
        var listItem = $$('[data-id="' + id + '"]');

        if (!listItem) {
            return;
        }

        listItem.className = completed ? 'completed' : '';

        // In case it was toggled from an event and not by clicking the checkbox
        listItem.querySelector('input').checked = completed;
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
        } else if (viewCmd === 'contentBlockVisibility') {
            this.$main.style.display = this.$footer.style.display = parameter.visible ? 'block' : 'none';
        } else if (viewCmd === 'toggleAll') {
            this.$toggleAll.checked = parameter.checked;
        } else if (viewCmd === 'setFilter') {
            this._setFilter(parameter);
        } else if (viewCmd === 'clearNewTodo') {
            this.$newTodo.value = '';
        } else if (viewCmd === 'elementComplete') {
            this._elementComplete(parameter.id, parameter.completed);
        }
    };

    View.prototype.bind = function (event, handler) {
        if (event === 'newTodo') {
            this.$newTodo.addEventListener('change', function () {
                handler(this.$newTodo.value);
            }.bind(this));
        }
    };

    window.app.View = View;
}(window));
