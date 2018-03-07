/*jshint strict:false */
/*global enyo:false, ENTER_KEY:false */
// Header section for adding a new task.
enyo.kind({
	name: 'ToDo.NotepadHeaderView',
	tag: 'header',
	attributes: {
		class: 'header'
	},
	controller: 'ToDo.notepadcontroller',
	components: [{
		tag: 'h1',
		content: 'todos'
	}, {
		tag: 'form',
		attributes: {
			class: 'todo-form'
		},
		components: [{
			// instead of letting the event bubble up the DOM, let's stop it here and send a custom event name
			// up the enyo object hierarchy to our controller
			kind: 'enyo.Input',
			placeholder: 'What needs to be done?',
			attributes: {
				class: 'new-todo',
				autofocus: 'autofocus'
			},
			handlers: {
				onkeypress: 'saveNew'
			},
			saveNew: function (inSender, inEvent) {
				if (inEvent.keyCode === ENTER_KEY) {
					this.bubble('onSaveNew');
					inEvent.preventDefault();
				}
			}
		}]
	}]
});
