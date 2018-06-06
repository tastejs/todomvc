define(['jsface', 'ko', 'sugar'], function (Class, ko) {

	var TodoItem = Class({
		constructor: function (data) {
			data = data || {};
			this.title = data.title || '';
			this.id = data.id || Date.now();
			this.completed = !!data.completed;
			this.editing = false;
			ko.observe(this);

			return this;
		},
		serialize: function () {
			return Object.select(this, ['title', 'id', 'completed']);
		}
	});

	return TodoItem;

});
