define(function(Todo){
	var Todos = dermis.collection({
		toggle: function(){
			var toggled = this.allCompleted();
			this.emit('change:toggle');

			this.all().forEach(function(todo){
				todo.set('completed', !toggled);
			});
		},
		clear: function(){
			this.completed().forEach(function(todo){
				todo.destroy();
			});
		},

		// These can all be implemented as rivets formatters
		allCompleted: function(){
			return this.completed().length === this.all().length;
		},

		todos: function(){
			return this[this.get('mode')]();
		},

		all: function(){
			var out = [];
			this.get('items').forEach(function(todo){
				if (todo.get('active')) out.push(todo);
			});
			return out;
		},
		completed: function(){
			var out = [];
			this.all().forEach(function(todo){
				if (todo.get('completed')) out.push(todo);
			});
			return out;
		},
		active: function(){
			var out = [];
			this.all().forEach(function(todo){
				if (!todo.get('completed')) out.push(todo);
			});
			return out;
		},

		serialize: function(){
			var out = [];
			this.all().forEach(function(todo){
				out.push(todo.getAll());
			});
			return out;
		}
	});
	Todos.set('mode', 'all');
	return Todos;
});