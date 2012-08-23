'use strict';
var TodoModel = Stapes.create().extend({
	'addTodo': function(title) {
		this.push({
			'completed' : false,
			'title' : title
		});
	},

	'clearCompleted': function() {
		this.remove(function(item) {
			return item.completed === true;
		});
	},

	// Returns items on the basis of the current state
	'getItemsByState' : function(state) {
		state = state || "all"; // default
		return this.itemStates[ state ].call(this);
	},

	'getComplete': function() {
		return this.filter(function(item) {
			return item.completed === true;
		});
	},

	'getLeft': function() {
		return this.filter(function(item) {
			return item.completed === false;
		});
	},

	'itemStates': {
		'all' : function() {
			return this.getAllAsArray();
		},

		'active': function() {
			return this.getLeft();
		},

		'completed': function() {
			return this.getComplete();
	    }
	}
});
