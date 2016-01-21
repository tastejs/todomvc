'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _helpers = require('./helpers');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _itemId = function _itemId(element) {
	return parseInt((0, _helpers.$parent)(element, 'li').dataset.id, 10);
};

var _setFilter = function _setFilter(currentPage) {
	(0, _helpers.qs)('.filters .selected').className = '';
	(0, _helpers.qs)('.filters [href="#/' + currentPage + '"]').className = 'selected';
};

var _elementComplete = function _elementComplete(id, completed) {
	var listItem = (0, _helpers.qs)('[data-id="' + id + '"]');

	if (!listItem) {
		return;
	}

	listItem.className = completed ? 'completed' : '';

	// In case it was toggled from an event and not by clicking the checkbox
	(0, _helpers.qs)('input', listItem).checked = completed;
};

var _editItem = function _editItem(id, title) {
	var listItem = (0, _helpers.qs)('[data-id="' + id + '"]');

	if (!listItem) {
		return;
	}

	listItem.className += ' editing';

	var input = document.createElement('input');
	input.className = 'edit';

	listItem.appendChild(input);
	input.focus();
	input.value = title;
};

/**
 * View that abstracts away the browser's DOM completely.
 * It has two simple entry points:
 *
 *   - bind(eventName, handler)
 *     Takes a todo application event and registers the handler
 *   - render(command, parameterObject)
 *     Renders the given command with the options
 */

var View = function () {
	function View(template) {
		var _this = this;

		_classCallCheck(this, View);

		this.template = template;

		this.ENTER_KEY = 13;
		this.ESCAPE_KEY = 27;

		this.$todoList = (0, _helpers.qs)('.todo-list');
		this.$todoItemCounter = (0, _helpers.qs)('.todo-count');
		this.$clearCompleted = (0, _helpers.qs)('.clear-completed');
		this.$main = (0, _helpers.qs)('.main');
		this.$footer = (0, _helpers.qs)('.footer');
		this.$toggleAll = (0, _helpers.qs)('.toggle-all');
		this.$newTodo = (0, _helpers.qs)('.new-todo');

		this.viewCommands = {
			showEntries: function showEntries(parameter) {
				return _this.$todoList.innerHTML = _this.template.show(parameter);
			},
			removeItem: function removeItem(parameter) {
				return _this._removeItem(parameter);
			},
			updateElementCount: function updateElementCount(parameter) {
				return _this.$todoItemCounter.innerHTML = _this.template.itemCounter(parameter);
			},
			clearCompletedButton: function clearCompletedButton(parameter) {
				return _this._clearCompletedButton(parameter.completed, parameter.visible);
			},
			contentBlockVisibility: function contentBlockVisibility(parameter) {
				return _this.$main.style.display = _this.$footer.style.display = parameter.visible ? 'block' : 'none';
			},
			toggleAll: function toggleAll(parameter) {
				return _this.$toggleAll.checked = parameter.checked;
			},
			setFilter: function setFilter(parameter) {
				return _setFilter(parameter);
			},
			clearNewTodo: function clearNewTodo(parameter) {
				return _this.$newTodo.value = '';
			},
			elementComplete: function elementComplete(parameter) {
				return _elementComplete(parameter.id, parameter.completed);
			},
			editItem: function editItem(parameter) {
				return _editItem(parameter.id, parameter.title);
			},
			editItemDone: function editItemDone(parameter) {
				return _this._editItemDone(parameter.id, parameter.title);
			}
		};
	}

	_createClass(View, [{
		key: '_removeItem',
		value: function _removeItem(id) {
			var elem = (0, _helpers.qs)('[data-id="' + id + '"]');

			if (elem) {
				this.$todoList.removeChild(elem);
			}
		}
	}, {
		key: '_clearCompletedButton',
		value: function _clearCompletedButton(completedCount, visible) {
			this.$clearCompleted.innerHTML = this.template.clearCompletedButton(completedCount);
			this.$clearCompleted.style.display = visible ? 'block' : 'none';
		}
	}, {
		key: '_editItemDone',
		value: function _editItemDone(id, title) {
			var listItem = (0, _helpers.qs)('[data-id="' + id + '"]');

			if (!listItem) {
				return;
			}

			var input = (0, _helpers.qs)('input.edit', listItem);
			listItem.removeChild(input);

			listItem.className = listItem.className.replace(' editing', '');

			(0, _helpers.qsa)('label', listItem).forEach(function (label) {
				return label.textContent = title;
			});
		}
	}, {
		key: 'render',
		value: function render(viewCmd, parameter) {
			this.viewCommands[viewCmd](parameter);
		}
	}, {
		key: '_bindItemEditDone',
		value: function _bindItemEditDone(handler) {
			var self = this;

			(0, _helpers.$delegate)(self.$todoList, 'li .edit', 'blur', function () {
				if (!this.dataset.iscanceled) {
					handler({
						id: _itemId(this),
						title: this.value
					});
				}
			});

			// Remove the cursor from the input when you hit enter just like if it were a real form
			(0, _helpers.$delegate)(self.$todoList, 'li .edit', 'keypress', function (event) {
				if (event.keyCode === self.ENTER_KEY) {
					this.blur();
				}
			});
		}
	}, {
		key: '_bindItemEditCancel',
		value: function _bindItemEditCancel(handler) {
			var self = this;

			(0, _helpers.$delegate)(self.$todoList, 'li .edit', 'keyup', function (event) {
				if (event.keyCode === self.ESCAPE_KEY) {
					var id = _itemId(this);
					this.dataset.iscanceled = true;
					this.blur();

					handler({ id: id });
				}
			});
		}
	}, {
		key: 'bind',
		value: function bind(event, handler) {
			var _this2 = this;

			switch (event) {
				case 'newTodo':
					(0, _helpers.$on)(this.$newTodo, 'change', function () {
						return handler(_this2.$newTodo.value);
					});
					break;

				case 'removeCompleted':
					(0, _helpers.$on)(this.$clearCompleted, 'click', handler);
					break;

				case 'toggleAll':
					(0, _helpers.$on)(this.$toggleAll, 'click', function () {
						handler({ completed: this.checked });
					});
					break;

				case 'itemEdit':
					(0, _helpers.$delegate)(this.$todoList, 'li label', 'dblclick', function () {
						handler({ id: _itemId(this) });
					});
					break;

				case 'itemRemove':
					(0, _helpers.$delegate)(this.$todoList, '.destroy', 'click', function () {
						handler({ id: _itemId(this) });
					});
					break;

				case 'itemToggle':
					(0, _helpers.$delegate)(this.$todoList, '.toggle', 'click', function () {
						handler({
							id: _itemId(this),
							completed: this.checked
						});
					});
					break;

				case 'itemEditDone':
					this._bindItemEditDone(handler);
					break;

				case 'itemEditCancel':
					this._bindItemEditCancel(handler);
					break;
			}
		}
	}]);

	return View;
}();

exports.default = View;