import Component from '@ember/component';
import { set } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import { inject as service } from '@ember/service';
import { isBlank } from '@ember/utils';

export default Component.extend({
	repo: service(),
	tagName: 'li',
	editing: false,
	classNameBindings: ['todo.completed', 'editing'],

	actions: {
		startEditing() {
			this.onStartEdit();
			this.set('editing', true);
			scheduleOnce('afterRender', this, 'focusInput');
		},

		doneEditing(todoTitle) {
			if (!this.editing) { return; }

			if (isBlank(todoTitle)) {
				this.send('removeTodo');
			} else {
				this.set('todo.title', todoTitle.trim());
				this.set('editing', false);
				this.onEndEdit();
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
			let todo = this.todo;

			set(todo, 'completed', e.target.checked);
			this.repo.persist();
		},

		removeTodo() {
			this.repo.delete(this.todo);
		}
	},

	focusInput() {
		this.element.querySelector('input.edit').focus();
	}
});

<template>
  <div class="view">
    <input
      class="toggle"
      type="checkbox"
      checked={{todo.completed}}
      onchange={{action "toggleCompleted"}}
    >
    <label ondblclick={{action "startEditing"}}>{{todo.title}}</label>
    <button class="destroy" onclick={{action "removeTodo"}}></button>
  </div>
  <input
    class="edit"
    value={{todo.title}}
    onblur={{action "doneEditing" value="target.value"}}
    onkeydown={{action "handleKeydown"}}
    autofocus
  >
</template>
