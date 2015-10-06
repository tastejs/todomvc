Meteor.publish('tasks', function (filter) {
	var q = filter || {};
	return Tasks.find(q);
});
