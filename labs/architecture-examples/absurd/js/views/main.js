(function () {
	'use strict';

	App.Main = absurd.component('Main', {
		// CSS styles injected into the page
		css: { 
			'.todo-removed': { animate: 'bounce' },
			'#main': { '#todo-list li': { animate: 'fadeInRight' } } 
		},
		// That's the DOM element which the component will operate on.
		html: '#main',
		// all | active | completed
		filter: 'all',
		// An temporary array which used during the rendering.
		todos: [],
		// The entry point of the component.
		constructor: function(model, router) {
			this.model = model;
			model.on('updated', this.bind(this.update));
			this.update();
			this.onAnimationEnd(function() {
				this.removeClass('todo-removed');
			})
		},
		// Updating the DOM element connected with the component
		// and the dynamic CSS styles.
		update: function(filter) {
			this.filter = filter || this.filter;
			this.css['#main'].display = this.model.all() == 0 ? 'none' : 'block';
			this.todos = this.model.todos(this.filter);
			this.populate();
		},
		// Event handler.
		removeToDo: function(e, index) {
			this.model.remove(index);
			this.addClass('todo-removed');
		},
		// Event handler.
		toggleToDo: function(e, index) {
			this.addClass('completed', this.qsa('#todo-list li:nth-child(' + (index + 1) + ')')[0]);
			this.model.toggle(index, e.target.checked);
		},
		// Event handler.
		toggleAll: function(e) {
			this.model.toggleAll(e.target.checked);
		},
		// Event handler.
		edit: function(e, index) {
			var editInput = this.qs('.edit', e.currentTarget);
			editInput.value = this.currentTitle = this.model.todo(index).title;
			this.addClass('editing', e.currentTarget);
			editInput.focus();
		},
		// Event handler.
		onInputChanged: function(e, index) {
			if(e.keyCode == 13) {
				this.save(e, index);
			} else if(e.keyCode == 27) {
				e.target.value = this.currentTitle;
				this.save(e, index);
			}
		},
		// Updating the data in the model.
		save: function(e, index, is) {
			if(!is.hidden(e.target)) {
				this.model.changeTitle(e.target.value.trim(), index);
			}
		},
		// Updating the state of the checkboxes.
		populated: function() {			
			var checkboxes = this.qsa('.toggle');
			for(var i=0; i<checkboxes.length; i++) {
				checkboxes[i].checked = this.todos[i].completed;
			}
			this.qs('#toggle-all').checked = this.model.areAllCompleted();
		}
	});

})();