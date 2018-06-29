/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _controller = __webpack_require__(1);

var _controller2 = _interopRequireDefault(_controller);

var _helpers = __webpack_require__(5);

var _template = __webpack_require__(6);

var _template2 = _interopRequireDefault(_template);

var _store = __webpack_require__(3);

var _store2 = _interopRequireDefault(_store);

var _view = __webpack_require__(4);

var _view2 = _interopRequireDefault(_view);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var store = new _store2.default('todos-vanilla-es6');

var template = new _template2.default();
var view = new _view2.default(template);

/**
 * @type {Controller}
 */
var controller = new _controller2.default(store, view);

var setView = function setView() {
  return controller.setView(document.location.hash);
};
(0, _helpers.$on)(window, 'load', setView);
(0, _helpers.$on)(window, 'hashchange', setView);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _item = __webpack_require__(2);

var _store = __webpack_require__(3);

var _store2 = _interopRequireDefault(_store);

var _view = __webpack_require__(4);

var _view2 = _interopRequireDefault(_view);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Controller = function () {
	/**
  * @param  {!Store} store A Store instance
  * @param  {!View} view A View instance
  */
	function Controller(store, view) {
		var _this = this;

		_classCallCheck(this, Controller);

		this.store = store;
		this.view = view;

		view.bindAddItem(this.addItem.bind(this));
		view.bindEditItemSave(this.editItemSave.bind(this));
		view.bindEditItemCancel(this.editItemCancel.bind(this));
		view.bindRemoveItem(this.removeItem.bind(this));
		view.bindToggleItem(function (id, completed) {
			_this.toggleCompleted(id, completed);
			_this._filter();
		});
		view.bindRemoveCompleted(this.removeCompletedItems.bind(this));
		view.bindToggleAll(this.toggleAll.bind(this));

		this._activeRoute = '';
		this._lastActiveRoute = null;
	}

	/**
  * Set and render the active route.
  *
  * @param {string} raw '' | '#/' | '#/active' | '#/completed'
  */


	_createClass(Controller, [{
		key: 'setView',
		value: function setView(raw) {
			var route = raw.replace(/^#\//, '');
			this._activeRoute = route;
			this._filter();
			this.view.updateFilterButtons(route);
		}

		/**
   * Add an Item to the Store and display it in the list.
   *
   * @param {!string} title Title of the new item
   */

	}, {
		key: 'addItem',
		value: function addItem(title) {
			var _this2 = this;

			this.store.insert({
				id: Date.now(),
				title: title,
				completed: false
			}, function () {
				_this2.view.clearNewTodo();
				_this2._filter(true);
			});
		}

		/**
   * Save an Item in edit.
   *
   * @param {number} id ID of the Item in edit
   * @param {!string} title New title for the Item in edit
   */

	}, {
		key: 'editItemSave',
		value: function editItemSave(id, title) {
			var _this3 = this;

			if (title.length) {
				this.store.update({ id: id, title: title }, function () {
					_this3.view.editItemDone(id, title);
				});
			} else {
				this.removeItem(id);
			}
		}

		/**
   * Cancel the item editing mode.
   *
   * @param {!number} id ID of the Item in edit
   */

	}, {
		key: 'editItemCancel',
		value: function editItemCancel(id) {
			var _this4 = this;

			this.store.find({ id: id }, function (data) {
				var title = data[0].title;
				_this4.view.editItemDone(id, title);
			});
		}

		/**
   * Remove the data and elements related to an Item.
   *
   * @param {!number} id Item ID of item to remove
   */

	}, {
		key: 'removeItem',
		value: function removeItem(id) {
			var _this5 = this;

			this.store.remove({ id: id }, function () {
				_this5._filter();
				_this5.view.removeItem(id);
			});
		}

		/**
   * Remove all completed items.
   */

	}, {
		key: 'removeCompletedItems',
		value: function removeCompletedItems() {
			this.store.remove({ completed: true }, this._filter.bind(this));
		}

		/**
   * Update an Item in storage based on the state of completed.
   *
   * @param {!number} id ID of the target Item
   * @param {!boolean} completed Desired completed state
   */

	}, {
		key: 'toggleCompleted',
		value: function toggleCompleted(id, completed) {
			var _this6 = this;

			this.store.update({ id: id, completed: completed }, function () {
				_this6.view.setItemComplete(id, completed);
			});
		}

		/**
   * Set all items to complete or active.
   *
   * @param {boolean} completed Desired completed state
   */

	}, {
		key: 'toggleAll',
		value: function toggleAll(completed) {
			var _this7 = this;

			this.store.find({ completed: !completed }, function (data) {
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var _ref = _step.value;
						var id = _ref.id;

						_this7.toggleCompleted(id, completed);
					}
				} catch (err) {
					_didIteratorError = true;
					_iteratorError = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion && _iterator.return) {
							_iterator.return();
						}
					} finally {
						if (_didIteratorError) {
							throw _iteratorError;
						}
					}
				}
			});

			this._filter();
		}

		/**
   * Refresh the list based on the current route.
   *
   * @param {boolean} [force] Force a re-paint of the list
   */

	}, {
		key: '_filter',
		value: function _filter(force) {
			var _this8 = this;

			var route = this._activeRoute;

			if (force || this._lastActiveRoute !== '' || this._lastActiveRoute !== route) {
				/* jscs:disable disallowQuotedKeysInObjects */
				this.store.find({
					'': _item.emptyItemQuery,
					'active': { completed: false },
					'completed': { completed: true }
				}[route], this.view.showItems.bind(this.view));
				/* jscs:enable disallowQuotedKeysInObjects */
			}

			this.store.count(function (total, active, completed) {
				_this8.view.setItemsLeft(active);
				_this8.view.setClearCompletedButtonVisibility(completed);

				_this8.view.setCompleteAllCheckbox(completed === total);
				_this8.view.setMainVisibility(total);
			});

			this._lastActiveRoute = route;
		}
	}]);

	return Controller;
}();

exports.default = Controller;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * @typedef {!{id: number, completed: boolean, title: string}}
 */
var Item = exports.Item = undefined;

/**
 * @typedef {!Array<Item>}
 */
var ItemList = exports.ItemList = undefined;

/**
 * Enum containing a known-empty record type, matching only empty records unlike Object.
 *
 * @enum {Object}
 */
var Empty = {
  Record: {}
};

/**
 * Empty ItemQuery type, based on the Empty @enum.
 *
 * @typedef {Empty}
 */
var EmptyItemQuery = exports.EmptyItemQuery = undefined;

/**
 * Reference to the only EmptyItemQuery instance.
 *
 * @type {EmptyItemQuery}
 */
var emptyItemQuery = exports.emptyItemQuery = Empty.Record;

/**
 * @typedef {!({id: number}|{completed: boolean}|EmptyItemQuery)}
 */
var ItemQuery = exports.ItemQuery = undefined;

/**
 * @typedef {!({id: number, title: string}|{id: number, completed: boolean})}
 */
var ItemUpdate = exports.ItemUpdate = undefined;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _item = __webpack_require__(2);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Store = function () {
	/**
  * @param {!string} name Database name
  * @param {function()} [callback] Called when the Store is ready
  */
	function Store(name, callback) {
		_classCallCheck(this, Store);

		/**
   * @type {Storage}
   */
		var localStorage = window.localStorage;

		/**
   * @type {ItemList}
   */
		var liveTodos = void 0;

		/**
   * Read the local ItemList from localStorage.
   *
   * @returns {ItemList} Current array of todos
   */
		this.getLocalStorage = function () {
			return liveTodos || JSON.parse(localStorage.getItem(name) || '[]');
		};

		/**
   * Write the local ItemList to localStorage.
   *
   * @param {ItemList} todos Array of todos to write
   */
		this.setLocalStorage = function (todos) {
			localStorage.setItem(name, JSON.stringify(liveTodos = todos));
		};

		if (callback) {
			callback();
		}
	}

	/**
  * Find items with properties matching those on query.
  *
  * @param {ItemQuery} query Query to match
  * @param {function(ItemList)} callback Called when the query is done
  *
  * @example
  * db.find({completed: true}, data => {
  *	 // data shall contain items whose completed properties are true
  * })
  */


	_createClass(Store, [{
		key: 'find',
		value: function find(query, callback) {
			var todos = this.getLocalStorage();
			var k = void 0;

			callback(todos.filter(function (todo) {
				for (k in query) {
					if (query[k] !== todo[k]) {
						return false;
					}
				}
				return true;
			}));
		}

		/**
   * Update an item in the Store.
   *
   * @param {ItemUpdate} update Record with an id and a property to update
   * @param {function()} [callback] Called when partialRecord is applied
   */

	}, {
		key: 'update',
		value: function update(_update, callback) {
			var id = _update.id;
			var todos = this.getLocalStorage();
			var i = todos.length;
			var k = void 0;

			while (i--) {
				if (todos[i].id === id) {
					for (k in _update) {
						todos[i][k] = _update[k];
					}
					break;
				}
			}

			this.setLocalStorage(todos);

			if (callback) {
				callback();
			}
		}

		/**
   * Insert an item into the Store.
   *
   * @param {Item} item Item to insert
   * @param {function()} [callback] Called when item is inserted
   */

	}, {
		key: 'insert',
		value: function insert(item, callback) {
			var todos = this.getLocalStorage();
			todos.push(item);
			this.setLocalStorage(todos);

			if (callback) {
				callback();
			}
		}

		/**
   * Remove items from the Store based on a query.
   *
   * @param {ItemQuery} query Query matching the items to remove
   * @param {function(ItemList)|function()} [callback] Called when records matching query are removed
   */

	}, {
		key: 'remove',
		value: function remove(query, callback) {
			var k = void 0;

			var todos = this.getLocalStorage().filter(function (todo) {
				for (k in query) {
					if (query[k] !== todo[k]) {
						return true;
					}
				}
				return false;
			});

			this.setLocalStorage(todos);

			if (callback) {
				callback(todos);
			}
		}

		/**
   * Count total, active, and completed todos.
   *
   * @param {function(number, number, number)} callback Called when the count is completed
   */

	}, {
		key: 'count',
		value: function count(callback) {
			this.find(_item.emptyItemQuery, function (data) {
				var total = data.length;

				var i = total;
				var completed = 0;

				while (i--) {
					completed += data[i].completed;
				}
				callback(total, total - completed, completed);
			});
		}
	}]);

	return Store;
}();

exports.default = Store;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _item = __webpack_require__(2);

var _helpers = __webpack_require__(5);

var _template = __webpack_require__(6);

var _template2 = _interopRequireDefault(_template);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _itemId = function _itemId(element) {
	return parseInt(element.parentNode.dataset.id || element.parentNode.parentNode.dataset.id, 10);
};
var ENTER_KEY = 13;
var ESCAPE_KEY = 27;

var View = function () {
	/**
  * @param {!Template} template A Template instance
  */
	function View(template) {
		var _this = this;

		_classCallCheck(this, View);

		this.template = template;
		this.$todoList = (0, _helpers.qs)('.todo-list');
		this.$todoItemCounter = (0, _helpers.qs)('.todo-count');
		this.$clearCompleted = (0, _helpers.qs)('.clear-completed');
		this.$main = (0, _helpers.qs)('.main');
		this.$toggleAll = (0, _helpers.qs)('.toggle-all');
		this.$newTodo = (0, _helpers.qs)('.new-todo');
		(0, _helpers.$delegate)(this.$todoList, 'li label', 'dblclick', function (_ref) {
			var target = _ref.target;

			_this.editItem(target);
		});
	}

	/**
  * Put an item into edit mode.
  *
  * @param {!Element} target Target Item's label Element
  */


	_createClass(View, [{
		key: 'editItem',
		value: function editItem(target) {
			var listItem = target.parentElement.parentElement;

			listItem.classList.add('editing');

			var input = document.createElement('input');
			input.className = 'edit';

			input.value = target.innerText;
			listItem.appendChild(input);
			input.focus();
		}

		/**
   * Populate the todo list with a list of items.
   *
   * @param {ItemList} items Array of items to display
   */

	}, {
		key: 'showItems',
		value: function showItems(items) {
			this.$todoList.innerHTML = this.template.itemList(items);
		}

		/**
   * Remove an item from the view.
   *
   * @param {number} id Item ID of the item to remove
   */

	}, {
		key: 'removeItem',
		value: function removeItem(id) {
			var elem = (0, _helpers.qs)('[data-id="' + id + '"]');

			if (elem) {
				this.$todoList.removeChild(elem);
			}
		}

		/**
   * Set the number in the 'items left' display.
   *
   * @param {number} itemsLeft Number of items left
   */

	}, {
		key: 'setItemsLeft',
		value: function setItemsLeft(itemsLeft) {
			this.$todoItemCounter.innerHTML = this.template.itemCounter(itemsLeft);
		}

		/**
   * Set the visibility of the "Clear completed" button.
   *
   * @param {boolean|number} visible Desired visibility of the button
   */

	}, {
		key: 'setClearCompletedButtonVisibility',
		value: function setClearCompletedButtonVisibility(visible) {
			this.$clearCompleted.style.display = !!visible ? 'block' : 'none';
		}

		/**
   * Set the visibility of the main content and footer.
   *
   * @param {boolean|number} visible Desired visibility
   */

	}, {
		key: 'setMainVisibility',
		value: function setMainVisibility(visible) {
			this.$main.style.display = !!visible ? 'block' : 'none';
		}

		/**
   * Set the checked state of the Complete All checkbox.
   *
   * @param {boolean|number} checked The desired checked state
   */

	}, {
		key: 'setCompleteAllCheckbox',
		value: function setCompleteAllCheckbox(checked) {
			this.$toggleAll.checked = !!checked;
		}

		/**
   * Change the appearance of the filter buttons based on the route.
   *
   * @param {string} route The current route
   */

	}, {
		key: 'updateFilterButtons',
		value: function updateFilterButtons(route) {
			(0, _helpers.qs)('.filters .selected').className = '';
			(0, _helpers.qs)('.filters [href="#/' + route + '"]').className = 'selected';
		}

		/**
   * Clear the new todo input
   */

	}, {
		key: 'clearNewTodo',
		value: function clearNewTodo() {
			this.$newTodo.value = '';
		}

		/**
   * Render an item as either completed or not.
   *
   * @param {!number} id Item ID
   * @param {!boolean} completed True if the item is completed
   */

	}, {
		key: 'setItemComplete',
		value: function setItemComplete(id, completed) {
			var listItem = (0, _helpers.qs)('[data-id="' + id + '"]');

			if (!listItem) {
				return;
			}

			listItem.className = completed ? 'completed' : '';

			// In case it was toggled from an event and not by clicking the checkbox
			(0, _helpers.qs)('input', listItem).checked = completed;
		}

		/**
   * Bring an item out of edit mode.
   *
   * @param {!number} id Item ID of the item in edit
   * @param {!string} title New title for the item in edit
   */

	}, {
		key: 'editItemDone',
		value: function editItemDone(id, title) {
			var listItem = (0, _helpers.qs)('[data-id="' + id + '"]');

			var input = (0, _helpers.qs)('input.edit', listItem);
			listItem.removeChild(input);

			listItem.classList.remove('editing');

			(0, _helpers.qs)('label', listItem).textContent = title;
		}

		/**
   * @param {Function} handler Function called on synthetic event.
   */

	}, {
		key: 'bindAddItem',
		value: function bindAddItem(handler) {
			(0, _helpers.$on)(this.$newTodo, 'change', function (_ref2) {
				var target = _ref2.target;

				var title = target.value.trim();
				if (title) {
					handler(title);
				}
			});
		}

		/**
   * @param {Function} handler Function called on synthetic event.
   */

	}, {
		key: 'bindRemoveCompleted',
		value: function bindRemoveCompleted(handler) {
			(0, _helpers.$on)(this.$clearCompleted, 'click', handler);
		}

		/**
   * @param {Function} handler Function called on synthetic event.
   */

	}, {
		key: 'bindToggleAll',
		value: function bindToggleAll(handler) {
			(0, _helpers.$on)(this.$toggleAll, 'click', function (_ref3) {
				var target = _ref3.target;

				handler(target.checked);
			});
		}

		/**
   * @param {Function} handler Function called on synthetic event.
   */

	}, {
		key: 'bindRemoveItem',
		value: function bindRemoveItem(handler) {
			(0, _helpers.$delegate)(this.$todoList, '.destroy', 'click', function (_ref4) {
				var target = _ref4.target;

				handler(_itemId(target));
			});
		}

		/**
   * @param {Function} handler Function called on synthetic event.
   */

	}, {
		key: 'bindToggleItem',
		value: function bindToggleItem(handler) {
			(0, _helpers.$delegate)(this.$todoList, '.toggle', 'click', function (_ref5) {
				var target = _ref5.target;

				handler(_itemId(target), target.checked);
			});
		}

		/**
   * @param {Function} handler Function called on synthetic event.
   */

	}, {
		key: 'bindEditItemSave',
		value: function bindEditItemSave(handler) {
			(0, _helpers.$delegate)(this.$todoList, 'li .edit', 'blur', function (_ref6) {
				var target = _ref6.target;

				if (!target.dataset.iscanceled) {
					handler(_itemId(target), target.value.trim());
				}
			}, true);

			// Remove the cursor from the input when you hit enter just like if it were a real form
			(0, _helpers.$delegate)(this.$todoList, 'li .edit', 'keypress', function (_ref7) {
				var target = _ref7.target,
				    keyCode = _ref7.keyCode;

				if (keyCode === ENTER_KEY) {
					target.blur();
				}
			});
		}

		/**
   * @param {Function} handler Function called on synthetic event.
   */

	}, {
		key: 'bindEditItemCancel',
		value: function bindEditItemCancel(handler) {
			(0, _helpers.$delegate)(this.$todoList, 'li .edit', 'keyup', function (_ref8) {
				var target = _ref8.target,
				    keyCode = _ref8.keyCode;

				if (keyCode === ESCAPE_KEY) {
					target.dataset.iscanceled = true;
					target.blur();

					handler(_itemId(target));
				}
			});
		}
	}]);

	return View;
}();

exports.default = View;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.qs = qs;
exports.$on = $on;
exports.$delegate = $delegate;
/**
 * querySelector wrapper
 *
 * @param {string} selector Selector to query
 * @param {Element} [scope] Optional scope element for the selector
 */
function qs(selector, scope) {
  return (scope || document).querySelector(selector);
}

/**
 * addEventListener wrapper
 *
 * @param {Element|Window} target Target Element
 * @param {string} type Event name to bind to
 * @param {Function} callback Event callback
 * @param {boolean} [capture] Capture the event
 */
function $on(target, type, callback, capture) {
  target.addEventListener(type, callback, !!capture);
}

/**
 * Attach a handler to an event for all elements matching a selector.
 *
 * @param {Element} target Element which the event must bubble to
 * @param {string} selector Selector to match
 * @param {string} type Event name
 * @param {Function} handler Function called when the event bubbles to target
 *                           from an element matching selector
 * @param {boolean} [capture] Capture the event
 */
function $delegate(target, selector, type, handler, capture) {
  var dispatchEvent = function dispatchEvent(event) {
    var targetElement = event.target;
    var potentialElements = target.querySelectorAll(selector);
    var i = potentialElements.length;

    while (i--) {
      if (potentialElements[i] === targetElement) {
        handler.call(targetElement, event);
        break;
      }
    }
  };

  $on(target, type, dispatchEvent, !!capture);
}

/**
 * Encode less-than and ampersand characters with entity codes to make user-
 * provided text safe to parse as HTML.
 *
 * @param {string} s String to escape
 *
 * @returns {string} String with unsafe characters escaped with entity codes
 */
var escapeForHTML = exports.escapeForHTML = function escapeForHTML(s) {
  return s.replace(/[&<]/g, function (c) {
    return c === '&' ? '&amp;' : '&lt;';
  });
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _item = __webpack_require__(2);

var _helpers = __webpack_require__(5);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Template = function () {
	function Template() {
		_classCallCheck(this, Template);
	}

	_createClass(Template, [{
		key: 'itemList',

		/**
   * Format the contents of a todo list.
   *
   * @param {ItemList} items Object containing keys you want to find in the template to replace.
   * @returns {!string} Contents for a todo list
   *
   * @example
   * view.show({
   *	id: 1,
   *	title: "Hello World",
   *	completed: false,
   * })
   */
		value: function itemList(items) {
			return items.reduce(function (a, item) {
				return a + ('\n<li data-id="' + item.id + '"' + (item.completed ? ' class="completed"' : '') + '>\n\t<div class="view">\n\t\t<input class="toggle" type="checkbox" ' + (item.completed ? 'checked' : '') + '>\n\t\t<label>' + (0, _helpers.escapeForHTML)(item.title) + '</label>\n\t\t<button class="destroy"></button>\n\t</div>\n</li>');
			}, '');
		}

		/**
   * Format the contents of an "items left" indicator.
   *
   * @param {number} activeTodos Number of active todos
   *
   * @returns {!string} Contents for an "items left" indicator
   */

	}, {
		key: 'itemCounter',
		value: function itemCounter(activeTodos) {
			return activeTodos + ' item' + (activeTodos !== 1 ? 's' : '') + ' left';
		}
	}]);

	return Template;
}();

exports.default = Template;

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map