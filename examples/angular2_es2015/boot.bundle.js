webpackJsonp([0],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(1);

	__webpack_require__(3);

	__webpack_require__(7);

	__webpack_require__(30);

	__webpack_require__(31);

	var _browser = __webpack_require__(32);

	var _store = __webpack_require__(258);

	var _todo = __webpack_require__(261);

	(0, _browser.bootstrap)(_todo.TodoApp, [_store.TodoLocalStore, _browser.BrowserDomAdapter]);

/***/ },

/***/ 258:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.TodoLocalStore = exports.Todo = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _nodeUuid = __webpack_require__(259);

	var uuid = _interopRequireWildcard(_nodeUuid);

	var _localStorage = __webpack_require__(260);

	var _localStorage2 = _interopRequireDefault(_localStorage);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Todo = exports.Todo = function () {
		_createClass(Todo, [{
			key: 'setTitle',
			value: function setTitle(title) {
				this.title = title.trim();
			}
		}]);

		function Todo(title) {
			_classCallCheck(this, Todo);

			this.completed = this.completed;
			this.title = this.title;
			this.uid = this.uid;

			this.uid = uuid.v4();
			this.completed = false;
			this.title = title.trim();
		}

		return Todo;
	}();

	var TodoLocalStore = exports.TodoLocalStore = function () {
		function TodoLocalStore() {
			_classCallCheck(this, TodoLocalStore);

			this.todos = [];

			var persistedTodos = JSON.parse(_localStorage2.default.getItem('angular2-todos')) || [];

			this.todos = persistedTodos.map(function (todo) {
				var ret = new Todo(todo.title);
				ret.completed = todo.completed;
				ret.uid = todo.uid;
				return ret;
			});
		}

		_createClass(TodoLocalStore, [{
			key: 'get',
			value: function get(state) {
				return this.todos.filter(function (todo) {
					return todo.completed === state.completed;
				});
			}
		}, {
			key: 'allCompleted',
			value: function allCompleted() {
				return this.todos.length === this.getCompleted().length;
			}
		}, {
			key: 'setAllTo',
			value: function setAllTo(completed) {
				this.todos.forEach(function (todo) {
					return todo.completed = completed;
				});
				this.persist();
			}
		}, {
			key: 'removeCompleted',
			value: function removeCompleted() {
				this.todos = this.get({ completed: false });
				this.persist();
			}
		}, {
			key: 'getRemaining',
			value: function getRemaining() {
				return this.get({ completed: false });
			}
		}, {
			key: 'getCompleted',
			value: function getCompleted() {
				return this.get({ completed: true });
			}
		}, {
			key: 'toggleCompletion',
			value: function toggleCompletion(uid) {
				var todo = this._findByUid(uid);

				if (todo) {
					todo.completed = !todo.completed;
					this.persist();
				}
			}
		}, {
			key: 'remove',
			value: function remove(uid) {
				var todo = this._findByUid(uid);

				if (todo) {
					this.todos.splice(this.todos.indexOf(todo), 1);
					this.persist();
				}
			}
		}, {
			key: 'add',
			value: function add(title) {
				this.todos.push(new Todo(title));
				this.persist();
			}
		}, {
			key: 'persist',
			value: function persist() {
				_localStorage2.default.setItem('angular2-todos', JSON.stringify(this.todos));
			}
		}, {
			key: '_findByUid',
			value: function _findByUid(uid) {
				return this.todos.find(function (todo) {
					return todo.uid == uid;
				});
			}
		}]);

		return TodoLocalStore;
	}();

/***/ },

/***/ 261:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.TodoApp = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _dec, _class;

	var _core = __webpack_require__(54);

	var _store = __webpack_require__(258);

	var _todo = __webpack_require__(262);

	var _todo2 = _interopRequireDefault(_todo);

	var _todo_header = __webpack_require__(263);

	var _todo_footer = __webpack_require__(265);

	var _todo_item = __webpack_require__(267);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var TodoApp = exports.TodoApp = (_dec = (0, _core.Component)({
		selector: 'todo-app',
		template: _todo2.default,
		directives: [_todo_header.TodoHeader, _todo_footer.TodoFooter, _todo_item.TodoItem]
	}), _dec(_class = function () {
		function TodoApp(todoStore) {
			_classCallCheck(this, TodoApp);

			this._todoStore = todoStore;
		}

		_createClass(TodoApp, [{
			key: 'remove',
			value: function remove(uid) {
				this._todoStore.remove(uid);
			}
		}, {
			key: 'update',
			value: function update() {
				this._todoStore.persist();
			}
		}, {
			key: 'getTodos',
			value: function getTodos() {
				return this._todoStore.todos;
			}
		}, {
			key: 'allCompleted',
			value: function allCompleted() {
				return this._todoStore.allCompleted();
			}
		}, {
			key: 'setAllTo',
			value: function setAllTo(toggleAll) {
				this._todoStore.setAllTo(toggleAll.checked);
			}
		}]);

		return TodoApp;
	}()) || _class);
	Reflect.defineMetadata('design:paramtypes', [_store.TodoLocalStore], TodoApp);

/***/ },

/***/ 262:
/***/ function(module, exports) {

	module.exports = "<section class=\"todoapp\">\n    <todo-header></todo-header>\n    <section class=\"main\" *ngIf=\"getTodos().length\">\n        <input class=\"toggle-all\" type=\"checkbox\" #toggleall [checked]=\"allCompleted()\" (click)=\"setAllTo(toggleall)\">\n        <ul class=\"todo-list\">\n            <todo-item *ngFor=\"#todo of getTodos()\" [todo]=\"todo\" (itemRemoved)=\"remove($event)\" (itemModified)=\"update($event)\"></todo-item>\n        </ul>\n    </section>\n    <todo-footer></todo-footer>\n</section>\n<footer class=\"info\">\n    <p>Double-click to edit a todo</p>\n    <p>Created by <a href=\"http://github.com/blacksonic\">Soós Gábor</a> using <a href=\"http://angular.io\">Angular2</a></p>\n    <p>Part of <a href=\"http://todomvc.com\">TodoMVC</a></p>\n</footer>";

/***/ },

/***/ 263:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.TodoHeader = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _dec, _class;

	var _core = __webpack_require__(54);

	var _store = __webpack_require__(258);

	var _todo_header = __webpack_require__(264);

	var _todo_header2 = _interopRequireDefault(_todo_header);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var TodoHeader = exports.TodoHeader = (_dec = (0, _core.Component)({
		selector: 'todo-header',
		template: _todo_header2.default
	}), _dec(_class = function () {
		function TodoHeader(todoStore) {
			_classCallCheck(this, TodoHeader);

			this.newTodo = '';

			this._todoStore = todoStore;
		}

		_createClass(TodoHeader, [{
			key: 'addTodo',
			value: function addTodo() {
				if (this.newTodo.trim().length) {
					this._todoStore.add(this.newTodo);
					this.newTodo = '';
				}
			}
		}]);

		return TodoHeader;
	}()) || _class);
	Reflect.defineMetadata('design:paramtypes', [_store.TodoLocalStore], TodoHeader);

/***/ },

/***/ 264:
/***/ function(module, exports) {

	module.exports = "<header class=\"header\">\n    <h1>todos</h1>\n    <input class=\"new-todo\" id=\"new-todo\" placeholder=\"What needs to be done?\" [(ngModel)]=\"newTodo\" autofocus=\"\" (keyup.enter)=\"addTodo()\">\n</header>\n";

/***/ },

/***/ 265:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.TodoFooter = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _dec, _class;

	var _core = __webpack_require__(54);

	var _store = __webpack_require__(258);

	var _todo_footer = __webpack_require__(266);

	var _todo_footer2 = _interopRequireDefault(_todo_footer);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var TodoFooter = exports.TodoFooter = (_dec = (0, _core.Component)({
		selector: 'todo-footer',
		template: _todo_footer2.default
	}), _dec(_class = function () {
		function TodoFooter(todoStore) {
			_classCallCheck(this, TodoFooter);

			this._todoStore = todoStore;
		}

		_createClass(TodoFooter, [{
			key: 'removeCompleted',
			value: function removeCompleted() {
				this._todoStore.removeCompleted();
			}
		}, {
			key: 'getCount',
			value: function getCount() {
				return this._todoStore.todos.length;
			}
		}, {
			key: 'getRemainingCount',
			value: function getRemainingCount() {
				return this._todoStore.getRemaining().length;
			}
		}, {
			key: 'hasCompleted',
			value: function hasCompleted() {
				return this._todoStore.getCompleted().length > 0;
			}
		}]);

		return TodoFooter;
	}()) || _class);
	Reflect.defineMetadata('design:paramtypes', [_store.TodoLocalStore], TodoFooter);

/***/ },

/***/ 266:
/***/ function(module, exports) {

	module.exports = "<footer class=\"footer\" *ngIf=\"getCount()\">\n    <span class=\"todo-count\"><strong>{{getRemainingCount()}}</strong> {{getRemainingCount() == 1 ? 'item' : 'items'}} left</span>\n    <button class=\"clear-completed\" *ngIf=\"hasCompleted()\" (click)=\"removeCompleted()\">Clear completed</button>\n</footer>\n";

/***/ },

/***/ 267:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.TodoItem = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _dec, _dec2, _dec3, _dec4, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3;

	var _core = __webpack_require__(54);

	var _trim = __webpack_require__(268);

	var _todo_item = __webpack_require__(269);

	var _todo_item2 = _interopRequireDefault(_todo_item);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _initDefineProp(target, property, descriptor, context) {
		if (!descriptor) return;
		Object.defineProperty(target, property, {
			enumerable: descriptor.enumerable,
			configurable: descriptor.configurable,
			writable: descriptor.writable,
			value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
		});
	}

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
		var desc = {};
		Object['ke' + 'ys'](descriptor).forEach(function (key) {
			desc[key] = descriptor[key];
		});
		desc.enumerable = !!desc.enumerable;
		desc.configurable = !!desc.configurable;

		if ('value' in desc || desc.initializer) {
			desc.writable = true;
		}

		desc = decorators.slice().reverse().reduce(function (desc, decorator) {
			return decorator(target, property, desc) || desc;
		}, desc);

		if (context && desc.initializer !== void 0) {
			desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
			desc.initializer = undefined;
		}

		if (desc.initializer === void 0) {
			Object['define' + 'Property'](target, property, desc);
			desc = null;
		}

		return desc;
	}

	function _initializerWarningHelper(descriptor, context) {
		throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
	}

	var TodoItem = exports.TodoItem = (_dec = (0, _core.Component)({
		selector: 'todo-item',
		template: _todo_item2.default,
		pipes: [_trim.TrimPipe]
	}), _dec2 = (0, _core.Input)(), _dec3 = (0, _core.Output)(), _dec4 = (0, _core.Output)(), _dec(_class = (_class2 = function () {
		function TodoItem() {
			_classCallCheck(this, TodoItem);

			_initDefineProp(this, 'todo', _descriptor, this);

			_initDefineProp(this, 'itemModified', _descriptor2, this);

			_initDefineProp(this, 'itemRemoved', _descriptor3, this);

			this.editing = false;
		}

		_createClass(TodoItem, [{
			key: 'cancelEditing',
			value: function cancelEditing() {
				this.editing = false;
			}
		}, {
			key: 'stopEditing',
			value: function stopEditing(editedTitle) {
				this.todo.setTitle(editedTitle.value);
				this.editing = false;

				if (this.todo.title.length === 0) {
					this.remove();
				} else {
					this.update();
				}
			}
		}, {
			key: 'edit',
			value: function edit() {
				this.editing = true;
			}
		}, {
			key: 'toggleCompletion',
			value: function toggleCompletion() {
				this.todo.completed = !this.todo.completed;
				this.update();
			}
		}, {
			key: 'remove',
			value: function remove() {
				this.itemRemoved.next(this.todo.uid);
			}
		}, {
			key: 'update',
			value: function update() {
				this.itemModified.next(this.todo.uid);
			}
		}]);

		return TodoItem;
	}(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'todo', [_dec2], {
		enumerable: true,
		initializer: function initializer() {
			return this.todo;
		}
	}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'itemModified', [_dec3], {
		enumerable: true,
		initializer: function initializer() {
			return new _core.EventEmitter();
		}
	}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'itemRemoved', [_dec4], {
		enumerable: true,
		initializer: function initializer() {
			return new _core.EventEmitter();
		}
	})), _class2)) || _class);

/***/ },

/***/ 268:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.TrimPipe = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _dec, _class;

	var _core = __webpack_require__(54);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var TrimPipe = exports.TrimPipe = (_dec = (0, _core.Pipe)({ name: 'trim' }), _dec(_class = function () {
		function TrimPipe() {
			_classCallCheck(this, TrimPipe);
		}

		_createClass(TrimPipe, [{
			key: 'transform',
			value: function transform(value, args) {
				return value.trim();
			}
		}]);

		return TrimPipe;
	}()) || _class);

/***/ },

/***/ 269:
/***/ function(module, exports) {

	module.exports = "<li [class.completed]=\"todo.completed\" [class.editing]=\"editing\">\n    <div class=\"view\">\n        <input class=\"toggle\" type=\"checkbox\" (click)=\"toggleCompletion()\" [checked]=\"todo.completed\">\n        <label (dblclick)=\"edit(todo)\">{{todo.title | trim}}</label>\n        <button class=\"destroy\" (click)=\"remove()\"></button>\n    </div>\n    <input class=\"edit\" *ngIf=\"editing\" [value]=\"todo.title\" #editedtodo (blur)=\"stopEditing(editedtodo)\" (keyup.enter)=\"stopEditing(editedtodo)\" (keyup.escape)=\"cancelEditing()\">\n</li>\n";

/***/ }

});