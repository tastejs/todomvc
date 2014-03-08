(function () {
	'use strict';

	App.Model = absurd.component('Model', {
		data: [],
		constructor: function() {
			
		},
		add: function(text) {
			this.data.push({
				title: text,
				completed: false
			});
			this.dispatch('updated');
		},
		toggle: function(index) {
			this.data[index] ? this.data[index].completed = !this.data[index].completed : null;
			this.dispatch('updated');
		},
		remove: function(index) {
			this.data[index] ? this.data.splice(index, 1) : null;
			this.dispatch('updated');
		},
		changeTitle: function(title, index) {
			this.data[index].title = title;
			this.dispatch('updated');
		},
		all: function() {
			return this.data.length;
		},
		left: function() {
			return this.todos('active').length;
		},
		completed: function() {
			return this.todos('completed').length;
		},
		todo: function(index) {
			return this.data[index];
		},
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
		clearCompleted: function() {
			this.data = this.todos('active');
			this.dispatch('updated');
		}
	});

})();