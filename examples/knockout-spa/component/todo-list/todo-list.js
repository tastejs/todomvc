define(['text!./todo-list.html', 'model/todo-item', 'util/dom', 'jsface', 'ko', 'sugar'], function (
	template, TodoItem, Dom, Class, ko) {

	var TodoList = Class({
		constructor: function (params) {
			this.filter = params.filter;
			this.storageKey = params.storageKey || 'todos';
			try {
				this.models =
					JSON.parse(localStorage.getItem(this.storageKey)).map(function (item) {
						return new TodoItem(item);
					}) || [];
			} catch (e) {
				this.models = [];
			}
			this.newItemTitle = '';
			ko.observe(this);

			this._models.subscribe(this.persist.bind(this));

			var computed = {
				activeItemsCount: function () {
					return this.models.count(function (model) {
						return !model.completed;
					}.bind(this));
				}.bind(this),
				allCompleted: function () {
					return this.models.length && !this.activeItemsCount;
				}.bind(this)
			};
			Object.each(computed, function (key, value) {
				ko.defineComputedProperty(this, key, value);
			}.bind(this));

			return this;
		},
		createItem: function (data, event) {
			var keyCode = (event.which ? event.which : event.keyCode);
			if (keyCode === Dom.keyCodes.enter) {
				var newItemTitle = this.newItemTitle.compact();
				if (newItemTitle) {
					this.models.push(new TodoItem({ title: newItemTitle }));
					this.newItemTitle = '';
				}
			} else {
				return true;
			}
		},
		destroyItem: function (data) {
			this.models.remove(function (model) {
				return model.id === data.model.id;
			});
		},
		destroyCompletedItems: function () {
			this.models.remove(function (model) {
				return model.completed;
			});
		},
		toggleAllItems: function () {
			var shouldMarkAllCompleted = !this.allCompleted;
			this.models.forEach(function (model) {
				model.completed = shouldMarkAllCompleted;
			}.bind(this));
			return true;
		},
		persist: function () {
			localStorage.setItem(this.storageKey,
				JSON.stringify(this.models.map(function (model) {
					return model.serialize();
				})));
		}
	});

	return {
		viewModel: TodoList,
		template: template
	};

});
