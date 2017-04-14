/*
View that abstracts away the browser's DOM completely.
It has two simple entry points:

  - bind(eventName, handler)
    Takes a todo application event and registers the handler
  - render(command, parameterObject)
    Renders the given command with the options
*/


(function() {
  var View;

  View = (function() {
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

    View.prototype._removeItem = function(id) {
      var elem;
      elem = $$('[data-id="' + id + '"]');
      if (elem) {
        return this.$todoList.removeChild(elem);
      }
    };

    View.prototype._clearCompletedButton = function(completedCount, visible) {
      this.$clearCompleted.innerHTML = this.template.clearCompletedButton(completedCount);
      return this.$clearCompleted.style.display = visible ? 'block' : 'none';
    };

    View.prototype._setFilter = function(currentPage) {
      $('#filters .selected').forEach(function(item) {
        return item.className = '';
      });
      return $('#filters [href="#/' + currentPage + '"]').forEach(function(item) {
        return item.className = 'selected';
      });
    };

    View.prototype._elementComplete = function(id, completed) {
      var listItem;
      listItem = $$('[data-id="' + id + '"]');
      if (!listItem) {
        return;
      }
      listItem.className = completed ? 'completed' : '';
      return listItem.querySelector('input').checked = completed;
    };

    View.prototype._editItem = function(id, title) {
      var input, listItem;
      listItem = $$('[data-id="' + id + '"]');
      if (!listItem) {
        return;
      }
      listItem.className = listItem.className + ' editing';
      input = document.createElement('input');
      input.className = 'edit';
      listItem.appendChild(input);
      input.focus();
      return input.value = title;
    };

    View.prototype._editItemDone = function(id, title) {
      var input, listItem;
      listItem = $$('[data-id="' + id + '"]');
      if (!listItem) {
        return;
      }
      input = listItem.querySelector('input.edit');
      listItem.removeChild(input);
      listItem.className = listItem.className.replace('editing', '');
      return listItem.querySelectorAll('label').forEach(function(label) {
        return label.textContent = title;
      });
    };

    View.prototype.render = function(viewCmd, parameter) {
      var viewCommands,
        _this = this;
      viewCommands = {
        showEntries: function() {
          return _this.$todoList.innerHTML = _this.template.show(parameter);
        },
        removeItem: function() {
          return _this._removeItem(parameter);
        },
        updateElementCount: function() {
          return _this.$todoItemCounter.innerHTML = _this.template.itemCounter(parameter);
        },
        clearCompletedButton: function() {
          return _this._clearCompletedButton(parameter.completed, parameter.visible);
        },
        contentBlockVisibility: function() {
          return _this.$main.style.display = (_this.$footer.style.display = parameter.visible) ? 'block' : 'none';
        },
        toggleAll: function() {
          return _this.$toggleAll.checked = parameter.checked;
        },
        setFilter: function() {
          return _this._setFilter(parameter);
        },
        clearNewTodo: function() {
          return _this.$newTodo.value = '';
        },
        elementComplete: function() {
          return _this._elementComplete(parameter.id, parameter.completed);
        },
        editItem: function() {
          return _this._editItem(parameter.id, parameter.title);
        },
        editItemDone: function() {
          return _this._editItemDone(parameter.id, parameter.title);
        }
      };
      return viewCommands[viewCmd]();
    };

    View.prototype._itemIdForEvent = function(e) {
      var element, id, li;
      element = e.target;
      li = $parent(element, 'li');
      id = li.dataset.id;
      return id;
    };

    View.prototype._bindItemEditDone = function(handler) {
      var _this = this;
      $live('#todo-list li .edit', 'blur', function(e) {
        var id, input;
        input = e.target;
        id = _this._itemIdForEvent(e);
        if (!input.dataset.iscanceled) {
          return handler({
            id: id,
            title: input.value
          });
        }
      });
      return $live('#todo-list li .edit', 'keypress', function(e) {
        var input;
        input = e.target;
        if (e.keyCode === _this.ENTER_KEY) {
          return input.blur();
        }
      });
    };

    View.prototype._bindItemEditCancel = function(handler) {
      var _this = this;
      return $live('#todo-list li .edit', 'keyup', function(e) {
        var id, input;
        input = e.target;
        id = _this._itemIdForEvent(e);
        if (e.keyCode === _this.ESCAPE_KEY) {
          input.dataset.iscanceled = true;
          input.blur();
          return handler({
            id: id
          });
        }
      });
    };

    View.prototype.bind = function(event, handler) {
      var _this = this;
      if (event === 'newTodo') {
        return this.$newTodo.addEventListener('change', function() {
          return handler(_this.$newTodo.value);
        });
      } else if (event === 'removeCompleted') {
        return this.$clearCompleted.addEventListener('click', function() {
          return handler();
        });
      } else if (event === 'toggleAll') {
        return this.$toggleAll.addEventListener('click', function(e) {
          var input;
          input = e.target;
          return handler({
            completed: input.checked
          });
        });
      } else if (event === 'itemEdit') {
        return $live('#todo-list li label', 'dblclick', function(e) {
          var id;
          id = _this._itemIdForEvent(e);
          return handler({
            id: id
          });
        });
      } else if (event === 'itemRemove') {
        return $live('#todo-list .destroy', 'click', function(e) {
          var id;
          id = _this._itemIdForEvent(e);
          return handler({
            id: id
          });
        });
      } else if (event === 'itemToggle') {
        return $live('#todo-list .toggle', 'click', function(e) {
          var id, input;
          input = e.target;
          id = _this._itemIdForEvent(e);
          return handler({
            id: id,
            completed: input.checked
          });
        });
      } else if (event === 'itemEditDone') {
        return this._bindItemEditDone(handler);
      } else if (event === 'itemEditCancel') {
        return this._bindItemEditCancel(handler);
      }
    };

    return View;

  })();

  window.app = window.app || {};

  window.app.View = View;

}).call(this);
