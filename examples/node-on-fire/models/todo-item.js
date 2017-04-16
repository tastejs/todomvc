var fire = require('fire');
var app = fire.app('todomvc');

app.model(function TodoItem(TodoListModel) {
	this.list = [this.BelongsTo(TodoListModel), this.Required];
	this.name = [this.String, this.Required];
	this.completed = [this.Boolean, this.Required, this.Default(false)];
	this.createdAt = [this.DateTime, this.Default('CURRENT_TIMESTAMP')];
});
