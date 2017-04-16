exports = module.exports = Migration;

function Migration() {
	//
}

Migration.prototype.up = function() {
	this.models.createModel('TodoItem', {
		id: [this.UUID, this.CanUpdate(false)],
		list: [this.BelongsTo(this.models.TodoList), this.Required],
		name: [this.String, this.Required],
		createdAt: [this.DateTime, this.Default('CURRENT_TIMESTAMP')]
	});
	this.models.createModel('TodoList', {
		id: [this.UUID, this.CanUpdate(false)],
		items: [this.HasMany(this.models.TodoItem)],
		createdAt: [this.DateTime, this.Default('CURRENT_TIMESTAMP')]
	});

};

Migration.prototype.down = function() {
	this.models.destroyModel('TodoItem');
	this.models.destroyModel('TodoList');

};
