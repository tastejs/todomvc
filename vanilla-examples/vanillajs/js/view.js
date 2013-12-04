/*global $, $$, $parent, $live */

(function (window) {
    'use strict';

    function View(template) {
        this.template = template;

        this.ENTER_KEY = 13;
        this.ESCAPE_KEY = 27;

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

    View.prototype._editItem = function (id, title) {
        var listItem = $$('[data-id="' + id + '"]');

        if (!listItem) {
            return;
        }

        listItem.className = listItem.className + ' editing';

        var input = document.createElement('input');
        input.className = 'edit';

        listItem.appendChild(input);
        input.focus();
        input.value = title;
    };

    View.prototype._editItemDone = function (id, title) {
        var listItem = $$('[data-id="' + id + '"]');

        if (!listItem) {
            return;
        }

        var input = listItem.querySelector('input.edit');
        listItem.removeChild(input);

        listItem.className = listItem.className.replace('editing', '');

        listItem.querySelectorAll('label').each(function (label) {
            label.textContent = title;
        });
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
        } else if (viewCmd === 'editItem') {
            this._editItem(parameter.id, parameter.title);
        } else if (viewCmd === 'editItemDone') {
            this._editItemDone(parameter.id, parameter.title);
        }
    };

    View.prototype._itemIdForEvent = function (e) {
        var element = e.target,
            li = $parent(element, 'li'),
            id = li.dataset.id;

        return id;
    };

    View.prototype.bind = function (event, handler) {
        if (event === 'newTodo') {
            this.$newTodo.addEventListener('change', function () {
                handler(this.$newTodo.value);
            }.bind(this));

        } else if (event === 'removeCompleted') {
            this.$clearCompleted.addEventListener('click', function () {
                handler();
            }.bind(this));

        } else if (event === 'toggleAll') {
            this.$toggleAll.addEventListener('click', function (e) {
                var input = e.target;

                handler({completed: input.checked});
            }.bind(this));

        } else if (event === 'itemEdit') {
            $live('#todo-list li label', 'dblclick', function (e) {
                var id = this._itemIdForEvent(e);

                handler({id: id});
            }.bind(this));

        } else if (event === 'itemRemove') {
            $live('#todo-list .destroy', 'click', function (e) {
                var id = this._itemIdForEvent(e);

                handler({id: id});
            }.bind(this));

        } else if (event === 'itemToggle') {
            $live('#todo-list .toggle', 'click', function (e) {
                var input = e.target,
                    id = this._itemIdForEvent(e);

                handler({id: id, completed: input.checked});
            }.bind(this));

        } else if (event === 'itemEditDone') {
            $live('#todo-list li .edit', 'blur', function (e) {
                var input = e.target,
                    id = this._itemIdForEvent(e);

                if (!input.dataset.iscanceled) {
                    handler({
                        id: id,
                        title: input.value
                    });
                }
            }.bind(this));

            $live('#todo-list li .edit', 'keypress', function (e) {
                var input = e.target;
                if (e.keyCode === this.ENTER_KEY) {
                    // Remove the cursor from the input when you hit enter just like if it
                    // were a real form
                    input.blur();
                }
            }.bind(this));

        } else if (event === 'itemEditCancel') {
            $live('#todo-list li .edit', 'keypress', function (e) {
                var input = e.target,
                    id = this._itemIdForEvent(e);

                if (e.keyCode === this.ESCAPE_KEY) {

                    input.dataset.iscanceled = true;
                    input.blur();

                    handler({id: id});
                }
            }.bind(this));
        }
    };

    window.app.View = View;
}(window));
