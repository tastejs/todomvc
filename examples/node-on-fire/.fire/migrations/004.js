exports = module.exports = Migration;

function Migration() {
	//
}

Migration.prototype.up = function() {
	this.models.TodoItem.addProperties({
		completed: [this.Boolean, this.Required, this.Default(false)]
	});

};

Migration.prototype.down = function() {
	this.models.TodoItem.removeProperties(['completed']);

};
