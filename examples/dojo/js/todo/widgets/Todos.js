define([
	'dojo/_base/declare',
	'dojo/_base/array',
	'dojo/_base/lang',
	'dojo/router',
	'dojo/when',
	'dojo/Stateful',
	'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',
	'dijit/_WidgetsInTemplateMixin',
	'dojox/mvc/_InlineTemplateMixin',
	'dojox/mvc/at',
	'dojox/mvc/getStateful',
	'dojox/mvc/StatefulArray',
	'dojox/mvc/StoreRefController',
	'../computed',
	'../store/TodoLocalStorage',
	'dojox/mvc/Element',
	'dojox/mvc/WidgetList',
	'./CSSToggleWidget',
	'./TodoEnter'
], function (declare,
	array,
	lang,
	router,
	when,
	Stateful,
	_WidgetBase,
	_TemplatedMixin,
	_WidgetsInTemplateMixin,
	_InlineTemplateMixin,
	at,
	getStateful,
	StatefulArray,
	StoreRefController,
	computed,
	TodoLocalStorage) {
	// To use Dojo's super call method, inherited()
	/*jshint strict:false*/

	/**
	 * Todo list, which does:
	 * - instantiate the template
	 * - retrieve and persist the model via the Dojo object store
	 *   ({@link http://dojotoolkit.org/reference-guide/dojo/store.html})
	 * - expose the model for use in the template
	 * - provide event handlers
	 * @class Todos
	 */
	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _InlineTemplateMixin, StoreRefController],
		/** @lends Todos# */ {
		store: null,

		newTodo: '',

		status: '',

		saving: false,

		filteredTodos: null,

		remainingCount: 0,

		completedCount: 0,

		areAllChecked: false,

		/**
		 * Specifies how a data model should be created from the retrieved data.
		 * @see http://dojotoolkit.org/reference-guide/dojox/mvc/getStateful.html
		 */
		getStatefulOptions: {
			getType: function () {
				return 'storeData';
			},

			getStatefulStoreData: function (data) {
				return getStateful({todos: data});
			}
		},

		emptyConverter: {
			format: function (count) {
				return count === 0;
			},
			parse: function () {
				// No backward conversion
				throw false;
			}
		},

		pluralizeConverter: {
			format: function (count) {
				return count > 1 ? this.target.other : this.target.one;
			},
			parse: function () {
				// No backward conversion
				throw false;
			}
		},

		statusConverter: {
			format: function (status) {
				return status === this.target.statusForElem;
			},
			parse: function () {
				// No backward conversion
				throw false;
			}
		},

		postMixInProperties: function () {
			if (!this.store) {
				this.store = new TodoLocalStorage();
			}
			this.queryStore();

			// Set up router
			this.own(router.register(/.*/, lang.hitch(this, function (event) {
				var table = {
					'/active': 'active',
					'/completed': 'completed'
				};
				this.set('status', table[event.newPath] || '');
			})));
			router.startup();

			// Set up computed properties
			var statusTable = {
				active: false,
				completed: true
			};

			this.own(computed(this, 'filteredTodos', lang.hitch(this, function (completed, status) {
				var todos = this.get('todos');
				if (!status) {
					return todos;
				} else {
					var filteredTodos = [];
					for (var i = 0; i < completed.length; i++) {
						if (completed[i] === statusTable[status]) {
							filteredTodos.push(todos[i]);
						}
					}
					return filteredTodos;
				}
			}), lang.mixin(at(this.get('todos'), 'completed'), {each: true}), at(this, 'status')));

			this.own(computed(this, 'remainingCount', function (completed) {
				var count = 0;
				for (var i = 0; i < completed.length; i++) {
					count += +!completed[i];
				}
				return count;
			}, lang.mixin(at(this.get('todos'), 'completed'), {each: true})));

			this.own(computed(this, 'completedCount', function (completed) {
				var count = 0;
				for (var i = 0; i < completed.length; i++) {
					count += +completed[i];
				}
				return count;
			}, lang.mixin(at(this.get('todos'), 'completed'), {each: true})));

			this.own(computed(this, 'areAllChecked', function (remainingCount) {
				return remainingCount === 0;
			}, at(this, 'remainingCount')));

			this.inherited(arguments);
		},

		addTodo: function (event) {
			var ret;
			var title = lang.trim(this.get('newTodo'));
			if (title.length > 0) {
				this.set('saving', true);
				var data = {
					title: title,
					completed: false
				};
				ret = when(this.addStore(data), lang.hitch(this, function () {
					this.get('todos').push(new Stateful(data));
					this.set('newTodo', '');
					this.set('saving', false);
				}), lang.hitch(this, function (e) {
					this.set('saving', false);
					throw e;
				}));
			}
			event.preventDefault();
			return ret;
		},

		saveTodo: function (todo, originalTitle, originalCompleted) {
			this.set('saving', true);
			var data = lang.mixin({}, todo);
			delete data.isEditing;
			return when(this.putStore(data), lang.hitch(this, function () {
				this.set('saving', false);
			}), lang.hitch(this, function (e) {
				this.set('saving', false);
				todo.set('title', originalTitle);
				todo.set('completed', originalCompleted);
				throw e;
			}));
		},

		removeTodo: function (todo) {
			this.set('saving', true);
			return when(this.removeStore(this.store.getIdentity(todo)), lang.hitch(this, function () {
				this.set('saving', false);
				this.get('todos').splice(array.indexOf(this.get('todos'), todo), 1);
			}), lang.hitch(this, function (e) {
				this.set('saving', false);
				throw e;
			}));
		},

		replaceTodo: function (oldTodo, newTodo) {
			var index = this.get('todos').indexOf(oldTodo);
			if (index >= 0) {
				this.get('todos').splice(index, 1, newTodo);
			}
		},

		markAll: function () {
			var current = this.get('areAllChecked');
			array.forEach(this.get('todos'), function (todo) {
				var old = todo.get('completed');
				if (old !== current) {
					todo.set('completed', current);
					this.saveTodo(todo, todo.get('title'), old);
				}
			}, this);
		},

		clearCompletedTodos: function () {
			array.forEach(this.get('todos').slice(), function (todo) {
				if (todo.get('completed')) {
					this.removeTodo(todo);
				}
			}, this);
		}
	});
});
