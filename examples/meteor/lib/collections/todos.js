// Collection to keep the todos
Todos = new Mongo.Collection('todos');

Todos.allow({
	insert: function () {
		return true;
	},
	update: function () {
		return true;
	},
	remove: function () {
		return true;
	}
});

if (Meteor.isServer) {
	Meteor.methods({
		clearCompleted: function() {
			Todos.remove({completed: true});
		},

		setAll: function(completed) {
			Todos.update({completed: !completed}, {$set: {completed: completed}},
				{multi: true});
		}
	});
}
