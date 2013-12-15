/*global $, $$, $parent, $live */

(function (window) {
    'use strict';

    /**
     * View that abstracts away the browser's DOM completely.
     * It has two simple entry points:
     *
     *   - bind(eventName, handler)
     *     Takes a todo application event and registers the handler
     *   - render(command, parameterObject)
     *     Renders the given command with the options
     */
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
        $('#filters .selected').forEach(function (item) {
            item.className = '';
        });

        $('#filters [href="#/' + currentPage + '"]').forEach(function (item) {
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

        listItem.querySelectorAll('label').forEach(function (label) {
            label.textContent = title;
        });
    };

    View.prototype.render = function (viewCmd, parameter) {
        var that = this;
        var viewCommands = {
                showEntries: function () {
                    that.$todoList.innerHTML = that.template.show(parameter);
                },
                removeItem: function () {
                    that._removeItem(parameter);
                },
                updateElementCount: function () {
                    that.$todoItemCounter.innerHTML = that.template.itemCounter(parameter);
                },
                clearCompletedButton: function () {
                    that._clearCompletedButton(parameter.completed, parameter.visible);
                },
                contentBlockVisibility: function () {
                    that.$main.style.display = that.$footer.style.display = parameter.visible ? 'block' : 'none';
                },
                toggleAll: function () {
                    that.$toggleAll.checked = parameter.checked;
                },
                setFilter: function () {
                    that._setFilter(parameter);
                },
                clearNewTodo: function () {
                    that.$newTodo.value = '';
                },
                elementComplete: function () {
                    that._elementComplete(parameter.id, parameter.completed);
                },
                editItem: function () {
                    that._editItem(parameter.id, parameter.title);
                },
                editItemDone: function () {
                    that._editItemDone(parameter.id, parameter.title);
                }
            };

        viewCommands[viewCmd]();
    };

    View.prototype._itemIdForEvent = function (e) {
        var element = e.target;
        var li = $parent(element, 'li');
        var id = li.dataset.id;

        return id;
    };

    View.prototype._bindItemEditDone = function (handler) {
        $live('#todo-list li .edit', 'blur', function (e) {
            var input = e.target;
            var id = this._itemIdForEvent(e);

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
    };

    View.prototype._bindItemEditCancel = function (handler) {
        $live('#todo-list li .edit', 'keyup', function (e) {
            var input = e.target;
            var id = this._itemIdForEvent(e);

            if (e.keyCode === this.ESCAPE_KEY) {

                input.dataset.iscanceled = true;
                input.blur();

                handler({id: id});
            }
        }.bind(this));
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
                var input = e.target;
                var id = this._itemIdForEvent(e);

                handler({id: id, completed: input.checked});
            }.bind(this));

        } else if (event === 'itemEditDone') {
            this._bindItemEditDone(handler);

        } else if (event === 'itemEditCancel') {
            this._bindItemEditCancel(handler);
        }
    };

    // Export to window
    window.app = window.app || {};
    window.app.View = View;
}(window));
