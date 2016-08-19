'use strict';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Tasks } from '../api/tasks.js';

import keys from './lib/keys.js';

import './task.js';
import './body.html';

const { ENTER_KEY } = keys;

Template.body.onCreated(function bodyOnCreated() {
	Meteor.subscribe('tasks');
});

Template.body.helpers({
	tasks() {
		const todosFilter = FlowRouter.getRouteName();
		const searchQuery = {};

		switch (todosFilter) {
			case 'Todos.active':
				searchQuery.completed = { $ne: true };
				break;
			case 'Todos.completed':
				searchQuery.completed = true;
				break;
			default:
				break;
		}

		return Tasks.find(searchQuery, { sort: { createdAt: -1 } });
	},

	tasksLeftCount() {
		return Tasks.find({ completed: { $ne: true } }).count();
	},

	tasksCompletedCount() {
		return Tasks.find({ completed: true }).count();
	},

	tasksCount() {
		return Tasks.find().count();
	}
});

Template.body.events({
	'keyup .js-new-todo'(event) {
		const { keyCode, target, target: { value } } = event;

		if (keyCode !== ENTER_KEY) {
			return;
		}

		Meteor.call('tasks.insert', value);

		target.value = '';
	},

	'click .js-clear-completed'() {
		Meteor.call('tasks.clearCompleted');
	},

	'click .js-toggle-all'(event) {
		Meteor.call('tasks.toggleAll', event.target.checked);
	}
});
