define([
	'js/data/Collection',
	'app/model/Todo',
	'flow'
], function (Collection, Todo, flow) {
	'use strict';

	return Collection.inherit('app.collection.TodoList', {
		$modelFactory: Todo,

		markAll: function (done) {
			this.each(function (todo) {
				todo.setCompleted(done);
				todo.save();
			});
		},

		clearCompleted: function () {
			var self = this;

			// remove all completed todos in a sequence
			flow().seqEach(this.$items, function (todo, cb) {
				if (todo.isCompleted()) {
					todo.remove(null, function (err) {
						if (!err) {
							self.remove(todo);
						}
						cb(err);
					});
				} else {
					cb();
				}
			}).exec();
		},

		numOpenTodos: function () {
			return this.$items.filter(function (item) {
				return !item.isCompleted();
			}).length;
		}.on('change', 'add', 'remove'),

		numCompletedTodos: function () {
			return this.$items.filter(function (item) {
				return item.isCompleted();
			}).length;
		}.on('change', 'add', 'remove'),

		hasCompletedTodos: function () {
			return this.numCompletedTodos() > 0;
		}.on('change', 'add', 'remove'),

		areAllComplete: function () {
			return this.numOpenTodos() === 0;
		}.on('change', 'add', 'remove')
	});
});
