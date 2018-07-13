import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { scheduleOnce } from '@ember/runloop';
import { isBlank } from '@ember/utils';
import { set } from '@ember/object';

export default Component.extend({
	repo: service(),
	tagName: 'li',
	editing: false,
	classNameBindings: ['todo.completed', 'editing'],

	actions: {
		startEditing() {
			this.get('onStartEdit')();
			this.set('editing', true);
			scheduleOnce('afterRender', this, 'focusInput');
		},

		doneEditing(todoTitle) {
			if (!this.get('editing')) { return; }
			if (isBlank(todoTitle)) {
				this.send('removeTodo');
			} else {
				this.set('todo.title', todoTitle.trim());
				this.set('editing', false);
				this.get('onEndEdit')();
			}
		},

		handleKeydown(e) {
			if (e.keyCode === 13) {
				e.target.blur();
			} else if (e.keyCode === 27) {
				this.set('editing', false);
			}
		},

		toggleCompleted(e) {
			let todo = this.get('todo');
			set(todo, 'completed', e.target.checked);
			this.get('repo').persist();
		},

		removeTodo() {
			this.get('repo').delete(this.get('todo'));
		}
	},

	focusInput() {
		this.element.querySelector('input.edit').focus();
	}
});
