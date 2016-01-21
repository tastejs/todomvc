(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _controller = require('./controller');

var _controller2 = _interopRequireDefault(_controller);

var _helpers = require('./helpers');

var helpers = _interopRequireWildcard(_helpers);

var _template = require('./template');

var _template2 = _interopRequireDefault(_template);

var _store = require('./store');

var _store2 = _interopRequireDefault(_store);

var _model = require('./model');

var _model2 = _interopRequireDefault(_model);

var _view = require('./view');

var _view2 = _interopRequireDefault(_view);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var $on = helpers.$on;
var setView = function setView() {
	return todo.controller.setView(document.location.hash);
};

var Todo =
/**
 * Init new Todo List
 * @param  {string} The name of your list
 */
function Todo(name) {
	_classCallCheck(this, Todo);

	this.storage = new _store2.default(name);
	this.model = new _model2.default(this.storage);

	this.template = new _template2.default();
	this.view = new _view2.default(this.template);

	this.controller = new _controller2.default(this.model, this.view);
};

var todo = new Todo('todos-vanillajs');

$on(window, 'load', setView);
$on(window, 'hashchange', setView);
},{"./controller":2,"./helpers":3,"./model":4,"./store":5,"./template":6,"./view":7}],2:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Controller = function () {
	/**
  * Take a model & view, then act as controller between them
  * @param  {object} model The model instance
  * @param  {object} view  The view instance
  */

	function Controller(model, view) {
		var _this = this;

		_classCallCheck(this, Controller);

		this.model = model;
		this.view = view;

		this.view.bind('newTodo', function (title) {
			return _this.addItem(title);
		});
		this.view.bind('itemEdit', function (item) {
			return _this.editItem(item.id);
		});
		this.view.bind('itemEditDone', function (item) {
			return _this.editItemSave(item.id, item.title);
		});
		this.view.bind('itemEditCancel', function (item) {
			return _this.editItemCancel(item.id);
		});
		this.view.bind('itemRemove', function (item) {
			return _this.removeItem(item.id);
		});
		this.view.bind('itemToggle', function (item) {
			return _this.toggleComplete(item.id, item.completed);
		});
		this.view.bind('removeCompleted', function () {
			return _this.removeCompletedItems();
		});
		this.view.bind('toggleAll', function (status) {
			return _this.toggleAll(status.completed);
		});
	}

	/**
  * Load & Initialize the view
  * @param {string}  '' | 'active' | 'completed'
  */

	_createClass(Controller, [{
		key: 'setView',
		value: function setView(hash) {
			var route = hash.split('/')[1];
			var page = route || '';
			this._updateFilter(page);
		}

		/**
   * Event fires on load. Gets all items & displays them
   */

	}, {
		key: 'showAll',
		value: function showAll() {
			var _this2 = this;

			this.model.read(function (data) {
				return _this2.view.render('showEntries', data);
			});
		}

		/**
   * Renders all active tasks
   */

	}, {
		key: 'showActive',
		value: function showActive() {
			var _this3 = this;

			this.model.read({ completed: false }, function (data) {
				return _this3.view.render('showEntries', data);
			});
		}

		/**
   * Renders all completed tasks
   */

	}, {
		key: 'showCompleted',
		value: function showCompleted() {
			var _this4 = this;

			this.model.read({ completed: true }, function (data) {
				return _this4.view.render('showEntries', data);
			});
		}

		/**
   * An event to fire whenever you want to add an item. Simply pass in the event
   * object and it'll handle the DOM insertion and saving of the new item.
   */

	}, {
		key: 'addItem',
		value: function addItem(title) {
			var _this5 = this;

			if (title.trim() === '') {
				return;
			}

			this.model.create(title, function () {
				_this5.view.render('clearNewTodo');
				_this5._filter(true);
			});
		}

		/*
   * Triggers the item editing mode.
   */

	}, {
		key: 'editItem',
		value: function editItem(id) {
			var _this6 = this;

			this.model.read(id, function (data) {
				var title = data[0].title;
				_this6.view.render('editItem', { id: id, title: title });
			});
		}

		/*
   * Finishes the item editing mode successfully.
   */

	}, {
		key: 'editItemSave',
		value: function editItemSave(id, title) {
			var _this7 = this;

			title = title.trim();

			if (title.length !== 0) {
				this.model.update(id, { title: title }, function () {
					_this7.view.render('editItemDone', { id: id, title: title });
				});
			} else {
				this.removeItem(id);
			}
		}

		/*
   * Cancels the item editing mode.
   */

	}, {
		key: 'editItemCancel',
		value: function editItemCancel(id) {
			var _this8 = this;

			this.model.read(id, function (data) {
				var title = data[0].title;
				_this8.view.render('editItemDone', { id: id, title: title });
			});
		}

		/**
   * Find the DOM element with given ID,
   * Then remove it from DOM & Storage
   */

	}, {
		key: 'removeItem',
		value: function removeItem(id) {
			var _this9 = this;

			this.model.remove(id, function () {
				return _this9.view.render('removeItem', id);
			});
			this._filter();
		}

		/**
   * Will remove all completed items from the DOM and storage.
   */

	}, {
		key: 'removeCompletedItems',
		value: function removeCompletedItems() {
			var _this10 = this;

			this.model.read({ completed: true }, function (data) {
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var item = _step.value;

						_this10.removeItem(item.id);
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
   * Give it an ID of a model and a checkbox and it will update the item
   * in storage based on the checkbox's state.
   *
   * @param {number} id The ID of the element to complete or uncomplete
   * @param {object} checkbox The checkbox to check the state of complete
   *                          or not
   * @param {boolean|undefined} silent Prevent re-filtering the todo items
   */

	}, {
		key: 'toggleComplete',
		value: function toggleComplete(id, completed, silent) {
			var _this11 = this;

			this.model.update(id, { completed: completed }, function () {
				_this11.view.render('elementComplete', { id: id, completed: completed });
			});

			if (!silent) {
				this._filter();
			}
		}

		/**
   * Will toggle ALL checkboxes' on/off state and completeness of models.
   * Just pass in the event object.
   */

	}, {
		key: 'toggleAll',
		value: function toggleAll(completed) {
			var _this12 = this;

			this.model.read({ completed: !completed }, function (data) {
				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = data[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var item = _step2.value;

						_this12.toggleComplete(item.id, completed, true);
					}
				} catch (err) {
					_didIteratorError2 = true;
					_iteratorError2 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion2 && _iterator2.return) {
							_iterator2.return();
						}
					} finally {
						if (_didIteratorError2) {
							throw _iteratorError2;
						}
					}
				}
			});

			this._filter();
		}

		/**
   * Updates the pieces of the page which change depending on the remaining
   * number of todos.
   */

	}, {
		key: '_updateCount',
		value: function _updateCount() {
			var _this13 = this;

			this.model.getCount(function (todos) {
				var completed = todos.completed;
				var visible = completed > 0;
				var checked = completed === todos.total;

				_this13.view.render('updateElementCount', todos.active);
				_this13.view.render('clearCompletedButton', { completed: completed, visible: visible });

				_this13.view.render('toggleAll', { checked: checked });
				_this13.view.render('contentBlockVisibility', { visible: todos.total > 0 });
			});
		}

		/**
   * Re-filters the todo items, based on the active route.
   * @param {boolean|undefined} force  forces a re-painting of todo items.
   */

	}, {
		key: '_filter',
		value: function _filter(force) {
			var active = this._activeRoute;
			var activeRoute = active.charAt(0).toUpperCase() + active.substr(1);

			// Update the elements on the page, which change with each completed todo
			this._updateCount();

			// If the last active route isn't "All", or we're switching routes, we
			// re-create the todo item elements, calling:
			//   this.show[All|Active|Completed]()
			if (force || this._lastActiveRoute !== 'All' || this._lastActiveRoute !== activeRoute) {
				this['show' + activeRoute]();
			}

			this._lastActiveRoute = activeRoute;
		}

		/**
   * Simply updates the filter nav's selected states
   */

	}, {
		key: '_updateFilter',
		value: function _updateFilter(currentPage) {
			// Store a reference to the active route, allowing us to re-filter todo
			// items as they are marked complete or incomplete.
			this._activeRoute = currentPage;

			if (currentPage === '') {
				this._activeRoute = 'All';
			}

			this._filter();

			this.view.render('setFilter', currentPage);
		}
	}]);

	return Controller;
}();

exports.default = Controller;
},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.qs = qs;
exports.qsa = qsa;
exports.$on = $on;
exports.$delegate = $delegate;
exports.$parent = $parent;
// Allow for looping on nodes by chaining:
// qsa('.foo').forEach(function () {})
NodeList.prototype.forEach = Array.prototype.forEach;

// Get element(s) by CSS selector:
function qs(selector, scope) {
	return (scope || document).querySelector(selector);
}

function qsa(selector, scope) {
	return (scope || document).querySelectorAll(selector);
}

// addEventListener wrapper:
function $on(target, type, callback, useCapture) {
	target.addEventListener(type, callback, !!useCapture);
}

// Attach a handler to event for all elements that match the selector,
// now or in the future, based on a root element
function $delegate(target, selector, type, handler) {
	var dispatchEvent = function dispatchEvent(event) {
		var targetElement = event.target;
		var potentialElements = qsa(selector, target);
		var hasMatch = Array.from(potentialElements).includes(targetElement);

		if (hasMatch) {
			handler.call(targetElement, event);
		}
	};

	// https://developer.mozilla.org/en-US/docs/Web/Events/blur
	var useCapture = type === 'blur' || type === 'focus';

	$on(target, type, dispatchEvent, useCapture);
}

// Find the element's parent with the given tag name:
// $parent(qs('a'), 'div')
function $parent(element, tagName) {
	if (!element.parentNode) {
		return;
	}

	if (element.parentNode.tagName.toLowerCase() === tagName.toLowerCase()) {
		return element.parentNode;
	}

	return $parent(element.parentNode, tagName);
}
},{}],4:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Creates a new Model instance and hooks up the storage.
 * @constructor
 * @param {object} storage A reference to the client side storage class
 */

var Model = function () {
	function Model(storage) {
		_classCallCheck(this, Model);

		this.storage = storage;
	}

	/**
  * Creates a new todo model
  *
  * @param {string} [title] The title of the task
  * @param {function} [callback] The callback to fire after the model is created
  */

	_createClass(Model, [{
		key: 'create',
		value: function create(title, callback) {
			title = title || '';

			var newItem = {
				title: title.trim(),
				completed: false
			};

			this.storage.save(newItem, callback);
		}

		/**
   * Finds and returns a model in storage. If no query is given it'll simply
   * return everything. If you pass in a string or number it'll look that up as
   * the ID of the model to find. Lastly, you can pass it an object to match
   * against.
   *
   * @param {string|number|object} [query] A query to match models against
   * @param {function} [callback] The callback to fire after the model is found
   *
   * @example
   * model.read(1, func) // Will find the model with an ID of 1
   * model.read('1') // Same as above
   * //Below will find a model with foo equalling bar and hello equalling world.
   * model.read({ foo: 'bar', hello: 'world' })
   */

	}, {
		key: 'read',
		value: function read(query, callback) {
			var queryType = typeof query === 'undefined' ? 'undefined' : _typeof(query);

			if (queryType === 'function') {
				this.storage.findAll(query);
			} else if (queryType === 'string' || queryType === 'number') {
				query = parseInt(query, 10);
				this.storage.find({ id: query }, callback);
			} else {
				this.storage.find(query, callback);
			}
		}

		/**
   * Updates a model by giving it an ID, data to update, and a callback to fire when
   * the update is complete.
   *
   * @param {number} id The id of the model to update
   * @param {object} data The properties to update and their new value
   * @param {function} callback The callback to fire when the update is complete.
   */

	}, {
		key: 'update',
		value: function update(id, data, callback) {
			this.storage.save(data, callback, id);
		}

		/**
   * Removes a model from storage
   *
   * @param {number} id The ID of the model to remove
   * @param {function} callback The callback to fire when the removal is complete.
   */

	}, {
		key: 'remove',
		value: function remove(id, callback) {
			this.storage.remove(id, callback);
		}

		/**
   * WARNING: Will remove ALL data from storage.
   *
   * @param {function} callback The callback to fire when the storage is wiped.
   */

	}, {
		key: 'removeAll',
		value: function removeAll(callback) {
			this.storage.drop(callback);
		}

		/**
   * Returns a count of all todos
   */

	}, {
		key: 'getCount',
		value: function getCount(callback) {
			var todos = {
				active: 0,
				completed: 0,
				total: 0
			};

			this.storage.findAll(function (data) {
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var todo = _step.value;

						if (todo.completed) {
							todos.completed++;
						} else {
							todos.active++;
						}

						todos.total++;
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

				callback(todos);
			});
		}
	}]);

	return Model;
}();

exports.default = Model;
},{}],5:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*jshint eqeqeq:false */

/**
 * Creates a new client side storage object and will create an empty
 * collection if no collection already exists.
 *
 * @param {string} name The name of our DB we want to use
 * @param {function} callback Our fake DB uses callbacks because in
 * real life you probably would be making AJAX calls
 */

var Store = function () {
	function Store(name, callback) {
		_classCallCheck(this, Store);

		this._dbName = name;

		if (!localStorage[name]) {
			var data = {
				todos: []
			};

			localStorage[name] = JSON.stringify(data);
		}

		if (callback) {
			callback.call(this, JSON.parse(localStorage[name]));
		}
	}

	/**
  * Finds items based on a query given as a JS object
  *
  * @param {object} query The query to match against (i.e. {foo: 'bar'})
  * @param {function} callback   The callback to fire when the query has
  * completed running
  *
  * @example
  * db.find({foo: 'bar', hello: 'world'}, function (data) {
 	 *	 // data will return any items that have foo: bar and
 	 *	 // hello: world in their properties
 	 * })
  */

	_createClass(Store, [{
		key: "find",
		value: function find(query, callback) {
			var todos = JSON.parse(localStorage[this._dbName]).todos;

			callback.call(this, todos.filter(function (todo) {
				for (var q in query) {
					if (query[q] !== todo[q]) {
						return false;
					}
				}
				return true;
			}));
		}

		/**
   * Will retrieve all data from the collection
   *
   * @param {function} callback The callback to fire upon retrieving data
   */

	}, {
		key: "findAll",
		value: function findAll(callback) {
			if (callback) {
				callback.call(this, JSON.parse(localStorage[this._dbName]).todos);
			}
		}

		/**
   * Will save the given data to the DB. If no item exists it will create a new
   * item, otherwise it'll simply update an existing item's properties
   *
   * @param {object} updateData The data to save back into the DB
   * @param {function} callback The callback to fire after saving
   * @param {number} id An optional param to enter an ID of an item to update
   */

	}, {
		key: "save",
		value: function save(updateData, callback, id) {
			var data = JSON.parse(localStorage[this._dbName]);
			var todos = data.todos;
			var len = todos.length;

			// If an ID was actually given, find the item and update each property
			if (id) {
				for (var i = 0; i < len; i++) {
					if (todos[i].id === id) {
						for (var key in updateData) {
							todos[i][key] = updateData[key];
						}
						break;
					}
				}

				localStorage[this._dbName] = JSON.stringify(data);

				if (callback) {
					callback.call(this, JSON.parse(localStorage[this._dbName]).todos);
				}
			} else {
				// Generate an ID
				updateData.id = new Date().getTime();

				todos.push(updateData);
				localStorage[this._dbName] = JSON.stringify(data);

				if (callback) {
					callback.call(this, [updateData]);
				}
			}
		}

		/**
   * Will remove an item from the Store based on its ID
   *
   * @param {number} id The ID of the item you want to remove
   * @param {function} callback The callback to fire after saving
   */

	}, {
		key: "remove",
		value: function remove(id, callback) {
			var data = JSON.parse(localStorage[this._dbName]);
			var todos = data.todos;
			var len = todos.length;

			for (var i = 0; i < todos.length; i++) {
				if (todos[i].id == id) {
					todos.splice(i, 1);
					break;
				}
			}

			localStorage[this._dbName] = JSON.stringify(data);

			if (callback) {
				callback.call(this, JSON.parse(localStorage[this._dbName]).todos);
			}
		}

		/**
   * Will drop all storage and start fresh
   *
   * @param {function} callback The callback to fire after dropping the data
   */

	}, {
		key: "drop",
		value: function drop(callback) {
			localStorage[this._dbName] = JSON.stringify({ todos: [] });

			if (callback) {
				callback.call(this, JSON.parse(localStorage[this._dbName]).todos);
			}
		}
	}]);

	return Store;
}();

exports.default = Store;
},{}],6:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var htmlEscapes = {
	'&': '&amp',
	'<': '&lt',
	'>': '&gt',
	'"': '&quot',
	'\'': '&#x27',
	'`': '&#x60'
};

var reUnescapedHtml = /[&<>"'`]/g;
var reHasUnescapedHtml = new RegExp(reUnescapedHtml.source);

var escape = function escape(str) {
	return str && reHasUnescapedHtml.test(str) ? str.replace(reUnescapedHtml, escapeHtmlChar) : str;
};
var escapeHtmlChar = function escapeHtmlChar(chr) {
	return htmlEscapes[chr];
};

var Template = function () {
	function Template() {
		_classCallCheck(this, Template);

		this.defaultTemplate = '\n\t\t\t<li data-id="{{id}}" class="{{completed}}">\n\t\t\t\t<div class="view">\n\t\t\t\t\t<input class="toggle" type="checkbox" {{checked}}>\n\t\t\t\t\t<label>{{title}}</label>\n\t\t\t\t\t<button class="destroy"></button>\n\t\t\t\t</div>\n\t\t\t</li>\n\t\t';
	}

	/**
  * Creates an <li> HTML string and returns it for placement in your app.
  *
  * NOTE: In real life you should be using a templating engine such as Mustache
  * or Handlebars, however, this is a vanilla JS example.
  *
  * @param {object} data The object containing keys you want to find in the
  *                      template to replace.
  * @returns {string} HTML String of an <li> element
  *
  * @example
  * view.show({
 	 *	id: 1,
 	 *	title: "Hello World",
 	 *	completed: 0,
 	 * })
  */

	_createClass(Template, [{
		key: 'show',
		value: function show(data) {
			var _this = this;

			var view = data.map(function (d) {
				var template = _this.defaultTemplate;
				var completed = d.completed ? 'completed' : '';
				var checked = d.completed ? 'checked' : '';

				return _this.defaultTemplate.replace('{{id}}', d.id).replace('{{title}}', escape(d.title)).replace('{{completed}}', completed).replace('{{checked}}', checked);
			});

			return view.join('');
		}

		/**
   * Displays a counter of how many to dos are left to complete
   *
   * @param {number} activeTodos The number of active todos.
   * @returns {string} String containing the count
   */

	}, {
		key: 'itemCounter',
		value: function itemCounter(activeTodos) {
			var plural = activeTodos === 1 ? '' : 's';
			return '<strong>' + activeTodos + '</strong> item' + plural + ' left';
		}

		/**
   * Updates the text within the "Clear completed" button
   *
   * @param  {[type]} completedTodos The number of completed todos.
   * @returns {string} String containing the count
   */

	}, {
		key: 'clearCompletedButton',
		value: function clearCompletedButton(completedTodos) {
			return completedTodos > 0 ? 'Clear completed' : '';
		}
	}]);

	return Template;
}();

exports.default = Template;
},{}],7:[function(require,module,exports){
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
},{"./helpers":3}]},{},[1]);
