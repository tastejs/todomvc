Template.Footer.events({
	'click .clear-completed': function(event) {
		Tasks.find({completed: true}).forEach(function(task) {
			Meteor.call('removeTask', task._id);
		});
	}
});

Template.Footer.helpers({
	tasksRemaining: function() {
		return Tasks.find({completed: false}).count();
	},
	hasCompleted: function() {
		return Tasks.find({completed: true}).count();
	},
	singular: function() {
		return (Tasks.find({completed: false}).count() == 1) ? '' : 's';
	},
	isActive: function(filter) {
		return (this.filter == filter) ? 'selected' : '';
	}
});