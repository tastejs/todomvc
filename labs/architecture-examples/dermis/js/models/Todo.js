/*global define dermis window*/
define(function () {
	'use strict';

	var Todo = dermis.model({
		setEditable: function () {
			this.set('editable', true);
		},
		save: function () {
			this.set('editable', false);
			var title = this.get('title').trim();
			if (title.length === 0) {
				var todo = this;
				window.setTimeout(function () {
					todo.destroy();
				}, 1);
			}
		},
		destroy: function () {
			this.collection.remove(this);
		},
		serialize: function () {
			return {
				title: this.get('title'),
				completed: this.get('completed')
			};
		}
	});
	return Todo;
});
