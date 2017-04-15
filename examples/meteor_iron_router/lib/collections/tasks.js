Tasks = new Mongo.Collection('tasks');

if (Meteor.isServer) {
	Tasks.allow({
		insert: function (userId, doc) {
			return false;
		},

		update: function (userId, doc, fieldNames, modifier) {
			return false;
		},

		remove: function (userId, doc) {
			return false;
		}
	});

	Tasks.deny({
		insert: function (userId, doc) {
			return true;
		},

		update: function (userId, doc, fieldNames, modifier) {
			return true;
		},

		remove: function (userId, doc) {
			return true;
		}
	});
}
