var TodoModel = Stapes.create().extend({
	"addTodo": function(title) {
		this.push({
			"completed" : false,
			"title" : title,
			"edit" : false
		});
	},

	"clearCompleted": function() {
		this.remove(function(item) {
			return item.completed === true;
		});
	},

	"getComplete": function() {
		return this.filter(function(item) {
			return item.completed === true;
		});
	},

	"getLeft": function() {
		return this.filter(function(item) {
			return item.completed === false;
		});
	}
});