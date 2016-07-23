define([
	'dojo/_base/declare',
	'dojo/_base/lang',
	'dojo/when',
	'dojo/Deferred',
	'dojo/Stateful',
	'dijit/registry',
	'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',
	'dijit/_WidgetsInTemplateMixin',
	'dojox/mvc/_InlineTemplateMixin',
	'dojox/mvc/at',
	'../computed',
	'dojox/mvc/Element',
	'./TodoEscape',
	'./TodoFocus'
], function (declare,
	lang,
	when,
	Deferred,
	Stateful,
	registry,
	_WidgetBase,
	_TemplatedMixin,
	_WidgetsInTemplateMixin,
	_InlineTemplateMixin,
	at,
	computed) {
	// To use Dojo's super call method, inherited()
	/*jshint strict:false*/

	/**
	 * Todo item, which does the following:
	 * - instantiate the template
	 * - expose the model for use in the template
	 * - provide event handlers
	 * @class Todo
	 */
	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _InlineTemplateMixin], {
		startup: function () {
			this.inherited(arguments);
			if (!this.todosWidget) {
				throw new Error('this.todosWidget property should be there before this widgets starts up: ' + this);
			}
			this.own(computed(this, 'isEditing', function (editedTodo) {
				return editedTodo === this.target;
			}, at(this.todosWidget, 'editedTodo')));
		},

		editTodo: function () {
			this.set('originalTitle', this.target.get('title'));
			this.todosWidget.set('editedTodo', this.target);
		},

		invokeSaveEdits: function () {
			// For handling input's blur event, make sure change event has been fired
			var dfd = new Deferred();
			setTimeout(lang.hitch(this, function () {
				when(this.saveEdits(), function (data) {
					dfd.resolve(data);
				}, function (e) {
					dfd.reject(e);
				});
			}), 0);
			return dfd.promise;
		},

		saveEdits: function (event) {
			var progress;
			var originalTitle = this.get('originalTitle');
			var newTitle = lang.trim(this.target.get('title'));
			var goAhead = this.get('isEditing') && newTitle !== originalTitle;
			var blur = !event;
			if (blur || goAhead) {
				this.target.set('title', newTitle);
			}
			if (goAhead) {
				if (newTitle) {
					progress = this.todosWidget.saveTodo(this.target, originalTitle, this.target.get('completed'));
				} else {
					progress = this.removeTodo();
				}
			}
			if (blur || goAhead) {
				progress = when(progress, lang.hitch(this, function () {
					this.todosWidget.set('editedTodo', null);
				}), lang.hitch(this, function (e) {
					this.todosWidget.set('editedTodo', null);
					throw e;
				}));
			}
			if (event && event.type === 'submit') {
				event.preventDefault();
			}
			return progress;
		},

		revertEdits: function () {
			if (this.get('isEditing')) {
				this.todosWidget.set('editedTodo', null);
				this.todosWidget.replaceTodo(this.target, new Stateful({
					id: this.target.get('id'),
					title: this.get('originalTitle'),
					completed: this.target.get('completed')
				}));
				this.destroyRecursive();
			}
		},

		toggleCompleted: function () {
			this.todosWidget.saveTodo(this.target, this.target.get('title'), !this.target.get('completed'));
		},

		removeTodo: function () {
			return when(this.todosWidget.removeTodo(this.target), lang.hitch(this, this.destroyRecursive));
		}
	});
});
