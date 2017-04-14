(function () {
	'use strict';

	App.Model = absurd.component('Model', {
		// Array storing the ToDos. It's synchronized with the local storage.
		data: [],
		// Entry point of the component. The `storage` variable is dependency-injected.
		constructor: function(storage) {
			this.data = storage.get();
		},
		// Event handler of the `this.dispatch('updated')`.
		updated: function(storage) {
			storage.put(this.data);
		},
		// Adding a new ToDo.
		add: function(text) {
			this.data.push({
				title: text,
				completed: false
			});
			this.dispatch('updated');
		},
		// Changing the status of ToDo item.
		toggle: function(index, completed) {
			this.data[index].completed = completed;
			this.dispatch('updated');
		},
		// Changing the title of ToDo item.
		changeTitle: function(title, index) {
			if(title === '') {
				this.remove(index);
			} else {
				this.data[index].title = title;	
			}
			this.dispatch('updated');
		},
		// Changing the status of all the ToDos.
		toggleAll: function(completed) {
			for(var i=0; i<this.data.length; i++) {
				this.data[i].completed = completed;
			}
			this.dispatch('updated');
		},
		// Removing a ToDo from the list.
		remove: function(index) {
			this.data[index] ? this.data.splice(index, 1) : null;
			this.dispatch('updated');
		},
		// Returns the number of all ToDos.
		all: function() {
			return this.data.length;
		},
		// Returns the number of the unfinished ToDos.
		left: function() {
			return this.todos('active').length;
		},
		// Returns the number of the finished ToDos.
		completed: function() {
			return this.todos('completed').length;
		},
		// Returning a boolean which shows if all the ToDos are completed.
		areAllCompleted: function() {
			return this.todos('completed').length == this.todos().length;
		},
		// Getting an access to specific ToDo in the list.
		todo: function(index) {
			return this.data[index];
		},
		// Getting an access to all ToDos based on a filter.
		todos: function(filter) {
			var arr = [];
			switch(filter) {
				case 'active': 
					for(var i=0; i<this.data.length; i++) {
						if(!this.data[i].completed) arr.push(this.data[i])
					}
				break;
				case 'completed': 
					for(var i=0; i<this.data.length; i++) {
						if(this.data[i].completed) arr.push(this.data[i])
					}
				break;
				default: arr = this.data;
			}
			return arr;
			
		},
		// Removing the completed ToDos from the list.
		clearCompleted: function() {
			this.data = this.todos('active');
			this.dispatch('updated');
		}
	});

})();