/*jshint strict:false */
/*global enyo:false */
enyo.kind({
	name: 'ToDo.NotepadFooterView',
	tag: 'footer',
	id: 'footer',
	attributes: {
		class: 'footer',
	},
	showing: false,
	components: [{
		tag: 'span',
		attributes: {
			class: 'todo-count'
		},
		components: [{
			name: 'count',
			id: 'count-number',
			attributes: {
				class: 'count-number'
			},
			tag: 'strong',
		}, {
			name: 'countText',
			id: 'countText',
			attributes: {
				class: 'countText'
			},
			tag: 'span'
		}]
	}, {
		tag: 'ul',
		attributes: {
			class: 'filters'
		},
		components: [{
			tag: 'li',
			components: [{
				tag: 'a',
				attributes: {
					class: 'tagAll selected',
					href: '#/'
				},
				content: 'All'
			}]
		}, {
			tag: 'li',
			components: [{
				tag: 'a',
				attributes: {
					class: 'tagActive',
					href: '#/active'
				},
				content: 'Active'
			}]
		}, {
			tag: 'li',
			components: [{
				tag: 'a',
				attributes: {
					class: 'tagComplete',
					href: '#/completed'
				},
				content: 'Completed'
			}]
		}]
	}, {
		kind: 'enyo.Button',
		id: 'clear-completed',
		name: 'clear-completed',
		content: 'Clear completed',
		attributes: {
			class: 'clear-completed'
		},
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
