/*jshint strict:false */
/*global enyo:false */
enyo.kind({
	name: 'ToDo.NotepadFooterView',
	tag: 'footer',
	id: 'footer',
	showing: false,
	components: [{
		tag: 'span',
		id: 'todo-count',
		components: [{
			name: 'count',
			id: 'count-number',
			tag: 'strong'
		}, {
			name: 'countText',
			id: 'countText',
			tag: 'span'
		}]
	}, {
		tag: 'ul',
		id: 'filters',
		components: [{
			tag: 'li',
			components: [{
				tag: 'a',
				id: 'tagAll',
				attributes: {
					class: 'selected',
					href: '#/'
				},
				content: 'All'
			}]
		}, {
			tag: 'li',
			components: [{
				tag: 'a',
				id: 'tagActive',
				attributes: {
					href: '#/active'
				},
				content: 'Active'
			}]
		}, {
			tag: 'li',
			components: [{
				tag: 'a',
				id: 'tagComplete',
				attributes: {
					href: '#/completed'
				},
				content: 'Completed'
			}]
		}]
	}, {
		kind: 'enyo.Button',
		name: 'clear-completed',
		id: 'clear-completed',
		controller: 'ToDo.notepadcontroller',
		showing: false,
		handlers: {
			ontap: 'clearCompleted'
		},
		clearCompleted: function (inSender, inEvent) {
			this.bubble('onClearCompleted');
			inEvent.preventDefault();
			return true;
		}
	}]
});
