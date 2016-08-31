define(['text!./todo-item.html', 'jsface', 'ko', 'sugar'], function (template, Class, ko) {

	var TodoItem = Class({
		constructor: function (params) {
			this.model = params.model;
			this.todoList = params.todoList;
			ko.observe(this);

			for (var prop in this.model) {
				var key = '_' + prop;
				if (this.model.hasOwnProperty(key) && ko.isObservable(this.model[key])) {
					this.model[key].subscribe(this.todoList.persist.bind(this.todoList));
				}
			}

			var computed = {
				visible: function () {
					if (this.todoList.filter() === '') { return true; }
					if (this.todoList.filter() === 'active') { return !this.model.completed; }
					if (this.todoList.filter() === 'completed') { return this.model.completed; }
				}.bind(this)
			};
			Object.each(computed, function (key, value) {
				ko.defineComputedProperty(this, key, value);
			}.bind(this));

			return this;
		}
	});

	return {
		viewModel: TodoItem,
		template: template
	};

});
