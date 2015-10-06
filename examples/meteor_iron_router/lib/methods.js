Meteor.methods({
	setTodo: function (id, todo) {
		todo = todo.trim();
		if (todo !== '') {
			Tasks.update(id, {$set: {title: todo}});
		} else {
			Meteor.call('removeTask', id);
		}
	},
	setComplete: function (id, complete) {
		Tasks.update(id, {$set: {completed: complete}});
	},
	addTask: function (todo) {
		todo = todo.trim();
		if (todo !== '') {
			Tasks.insert({
				title: todo,
				createdAt: new Date(),
				completed: false
			});
		} else {
			console.log('Fail: Empty Task');
		}
	},
	removeTask: function (id) {
		Tasks.remove(id);
	}
});
