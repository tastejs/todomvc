import Component from '@ember/component';
import { computed, set } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
	repo: service(),
	tagName: 'section',
	classNames: ['main'],
	canToggle: true,
	allCompleted: computed('todos.@each.completed', function () {
		return this.todos.isEvery('completed');
	}),

	actions: {
		enableToggle() {
			this.set('canToggle', true);
		},

		disableToggle() {
			this.set('canToggle', false);
		},

		toggleAll() {
			let allCompleted = this.allCompleted;

			this.todos.forEach(todo => set(todo, 'completed', !allCompleted));
			this.repo.persist();
		}
	}
});

<template>
  {{#if todos.length}}
    {{#if canToggle}}
      <input
        id="toggle-all"
        class="toggle-all"
        type="checkbox"
        checked={{allCompleted}}
        onchange={{action "toggleAll"}}
      >
      <label for="toggle-all">Mark all as complete</label>
    {{/if}}
    <ul class="todo-list">
      {{#each todos as |todo|}}
        {{todo-item
          todo=todo
          onStartEdit=(action "disableToggle")
          onEndEdit=(action "enableToggle")
        }}
      {{/each}}
    </ul>
  {{/if}}
</template>
