Meteor.publish('todos', function () {
	return Todos.find();
});
