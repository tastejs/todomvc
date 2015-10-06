Template.Main.events({
	'click .toggle-all': function (event) {
		var state = event.currentTarget.checked;
		Tasks.find({}).forEach(function (task) {
			Meteor.call('setComplete', task._id, state);
		});
	}
});

Template.Main.helpers({
	tasks: function () {
		return Tasks.find(this.q, {sort: {createdAt: -1}});
	},
	check: function () {
    // All tasks are complete
    if (!Tasks.find({completed: false}).count()) {
      return 'checked';
    }
  }
});
