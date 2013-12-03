/*global $, $$ */

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

        this.itemEvents = {};
        this.itemEditingEvents = {};
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

        this._bindItemEditing();
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
            this._bindItems();
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

    View.prototype._bindItems = function () {
        Object.keys(this.itemEvents).forEach(function (event) {
            var handler = this.itemEvents[event];

            if (event === 'itemEdit') {
                $('#todo-list li').each(function (li) {
                    li.querySelectorAll('label').each(function (label) {
                        label.addEventListener('dblclick', function () {
                            handler({id: li.dataset.id});
                        });
                    });
                });
            }
        }.bind(this));
    };

    View.prototype._bindItemEditing = function () {
        Object.keys(this.itemEditingEvents).forEach(function (event) {
            var handler = this.itemEditingEvents[event];

            if (event === 'itemEditDone') {
                $('#todo-list li').each(function (li) {
                    li.querySelectorAll('input').each(function (input) {
                        input.addEventListener('blur', function (e) {
                            if (!input.dataset.iscanceled) {
                                handler({
                                    id: li.dataset.id,
                                    title: input.value
                                });
                            }
                        }.bind(this));
                        input.addEventListener('keypress', function (e) {
                            if (e.keyCode === this.ENTER_KEY) {
                                // Remove the cursor from the input when you hit enter just like if it
                                // were a real form
                                input.blur();
                            }
                        }.bind(this));
                    }.bind(this));
                }.bind(this));
            } else if (event === 'itemEditCancel') {
                $('#todo-list li').each(function (li) {
                    li.querySelectorAll('input').each(function (input) {
                        input.addEventListener('keypress', function (e) {
                            if (e.keyCode === this.ESCAPE_KEY) {

                                input.dataset.iscanceled = true;
                                input.blur();

                                handler({id: li.dataset.id});
                            }
                        }.bind(this));
                    }.bind(this));
                }.bind(this));
            }
        }.bind(this));
    };

    View.prototype.bind = function (event, handler) {
        if (event === 'newTodo') {
            this.$newTodo.addEventListener('change', function () {
                handler(this.$newTodo.value);
            }.bind(this));
        } else if (event === 'itemEdit') {
            this.itemEvents[event] = handler;
        } else if (event === 'itemEditDone' || event === 'itemEditCancel') {
            this.itemEditingEvents[event] = handler;
        }
    };

    window.app.View = View;
}(window));
