var fire = require('fire');
var app = fire.app('todomvc');

app.model(function TodoList(TodoItemModel) {
	this.items = [this.HasMany(TodoItemModel), this.AutoFetch];
	this.createdAt = [this.DateTime, this.Default('CURRENT_TIMESTAMP')];
});
