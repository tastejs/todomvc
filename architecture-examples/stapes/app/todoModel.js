var TodoModel = Stapes.create().extend({
	"addTask" : function(name) {
		this.push({
			"complete" : false,
			"name" : name,
			"edit" : false
		});
	},

	"clearCompleted" : function() {
		this.remove(function(item) {
			return item.complete === true;
		});
	},

	"getComplete" : function() {
		return this.filter(function(item) {
			return item.complete === true;
		});
	},

	"getLeft" : function() {
		return this.filter(function(item) {
			return item.complete === false;
		});
	}
});