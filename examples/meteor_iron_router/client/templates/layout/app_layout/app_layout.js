Template.AppLayout.helpers({
	emptyList: function () {
		return Tasks.find({}).count();
	}
});
