/*jshint strict:false */
/*global enyo:false, ENTER_KEY:false, ESC_KEY:false */
// The main task list view
enyo.kind({
	name: 'ToDo.NotepadMainView',
	tag: 'section', // give it a specific html tagS
	id: 'main', // force an id value, otherwise enyo makes its own
	attributes: {
		class: 'main'
	},
	focus: false,
	showing: false, // hide initially
	controller: 'ToDo.notepadcontroller', // connect it to the global controller
	components: [{
		// create the checkbox, and have it bubble markAllComplete events, not clicks.
		// We don't have to listen for all clicks and sort through them, this click gives a specific event
		tag: 'input',
		id: 'toggle-all',
		attributes: {
			class: 'toggle-all',
			type: 'checkbox'
		},
		handlers: {
			onclick: 'markAllComplete'
		},
		markAllComplete: function () {
			// the event bubbles up the enyo object instance hierarchy, not the DOM hierarchy
			this.bubble('onMarkAllComplete');
			return true;
		}
	}, {
		tag: 'label',
		content: 'Mark all as complete',
		attributes: {
			class: 'toggle-all-label',
			'for': 'toggle-all'
		}
	}, {
		// the collection repeater automatically creates rows for us based on the tasks in the controller's collection
		// each row is given its own controller directly linked to its specific model
		// name: todo-list gives us a top level enyo object shortcut to grab the table
		kind: 'enyo.CollectionRepeater',
		controller: 'ToDo.notepadcontroller',
		tag: 'ul',
		name: 'todo-list',
		id: 'todo-list',
		attributes: {
			class: 'todo-list'
		},
		// what the table is made of
		components: [{
			tag: 'li',
			// create an automatic binding so the text and input fields automatically display content without custom code
			// the next release of Enyo will better support two way communication so the rows can update the models
			bindings: [{
				from: '.controller.title',
				to: '$.textLabel.content'
			}, {
				from: '.controller.title',
				to: '$.inputField.value',
				oneWay: false
			}],
			// what each row is made of
			components: [{
				tag: 'div',
				name: 'taskRow',
				attributes: {
					class: 'view'
				},
				components: [{
					tag: 'input',
					handlers: {
						onclick: 'markComplete'
					},
					name: 'checkbox',
					attributes: {
						type: 'checkbox',
						class: 'toggle'
					},
					markComplete: function () {
						this.inherited(arguments);
						this.bubble('onMarkComplete');
						return true;
					}
				}, {
					tag: 'label',
					name: 'textLabel',
					handlers: {
						ondblclick: 'throwEdit'
					},
					throwEdit: function () {
						this.inherited(arguments);
						this.bubble('onStartEdit');
						return true;
					}
				}, {
					kind: 'enyo.Button',
					handlers: {
						ontap: 'deleteTask'
					},
					attributes: {
						class: 'destroy'
					},
					deleteTask: function (inSender, inEvent) {
						this.bubbleUp('onDeleteTask', inSender, inEvent);
						return true;
					}
				}]
			}, {
				kind: 'enyo.Input',
				name: 'inputField',
				type: 'text',
				defaultFocus: true,
				attributes: {
					class: 'edit',
					onblur: enyo.bubbler
				},
				handlers: {
					onkeypress: 'sendEnter',
					onkeydown: 'sendEsc'
				},
				sendEnter: function (inSender, inEvent) {
					if (inEvent.keyCode === ENTER_KEY) {
						this.bubble('onblur');
						inEvent.preventDefault();
					}
					return true;
				},
				sendEsc: function (inSender, inEvent) {
					if (inEvent.keyCode === ESC_KEY) {
						this.bubble('onSendEsc');
					}
					return true;
				}
			}]
		}],
		// when the table is rendered in the dom, then build its contents
		rendered: function () {
			this.bubble('onReload');
		}
	}]
});
