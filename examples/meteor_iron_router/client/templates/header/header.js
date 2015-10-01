var ENTER_KEY = 13;

Template.Header.events({
	'keypress .new-todo': function(event) {
		if(event.type === 'keypress' && event.which === ENTER_KEY) {
			Meteor.call('addTask', event.target.value);
			event.target.value = '';
		}
	}
});