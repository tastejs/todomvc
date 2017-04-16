exports = module.exports = Migration;

function Migration() {
	//
}

Migration.prototype.up = function() {
	this.models.TodoList.changeProperties({
		items: [this.HasMany(this.models.TodoItem), this.AutoFetch]
	});

};

Migration.prototype.down = function() {
	this.models.TodoList.changeProperties({
		items: [this.HasMany(this.models.TodoItem)]
	});

};
