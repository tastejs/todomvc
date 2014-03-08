(function () {
	'use strict';

	App.Main = absurd.component('Main', {
		css: { '#main': {} },
		html: '#main',
		filter: 'all',
		todos: [],
		constructor: function(model, router) {
			this.model = model;
			model.on('updated', this.bind(this.update));
		},
		update: function(filter) {
			this.filter = filter || 'all';
			this.css['#main'].display = this.model.all() == 0 ? 'none' : 'block';
			this.todos = this.model.todos(this.filter);
			this.populate();
		},
		removeToDo: function(e, index) {
			this.model.remove(index);
		},
		toggleToDo: function(e, index) {
			this.model.toggle(index, e.target.checked);
		},
		toggleAll: function(e) {
			this.model.toggleAll(e.target.checked);
		},
		edit: function(e, index) {
			var editInput = this.qs('.edit', e.currentTarget);
			editInput.value = this.model.todo(index).title;
			this.addClass('editing', e.currentTarget);
			editInput.focus();
		},
		onInputChanged: function(e, index) {
			if(e.keyCode == 13 && e.target.value.toString().trim() != '') {
				this.save(e, index);
			}
		},
		save: function(e, index) {
			this.model.changeTitle(e.target.value, index);
		},
		populated: function() {
			var checkboxes = this.qsa('.toggle');
			for(var i=0; i<checkboxes.length; i++) {
				checkboxes[i].checked = this.todos[i].completed;
			}
			this.qs('#toggle-all').checked = this.model.areAllCompleted();
		}
	});

})();