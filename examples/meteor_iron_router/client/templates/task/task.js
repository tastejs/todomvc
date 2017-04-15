var ENTER_KEY = 13;
var ESC_KEY = 27;

Template.Task.events({
	'click .toggle': function (event) {
		Meteor.call('setComplete', this._id, !this.completed);
	},
	'dblclick .view': function (event) {
		Session.set('editing', this._id);
	},
	'keydown .edit, focusout .edit': function (event) {
		if (event.type === 'keydown' && event.which === ESC_KEY) {
			event.target.value = this.title;
			Session.set('editing', null);
		} else if ((event.type === 'keydown' && event.which === ENTER_KEY) || event.type === 'focusout') {
			Session.set('editing', null);
			Meteor.call('setTodo', this._id, event.target.value);
		}
	},
	'click .destroy': function (event) {
		event.preventDefault();
		Meteor.call('removeTask', this._id);
	}
});

Template.Task.helpers({
	isComplete: function () {
		return (this.completed) ? 'checked' : '';
	},
	getState: function () {
		if (this.completed) {
			return 'completed';
		}
		if (Session.equals('editing', this._id)) {
			return 'editing';
		}
	}
});
