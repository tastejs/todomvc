import Ember from 'ember';

export default Ember.Controller.extend({
	todos: Ember.inject.controller(),
	completedTodos: Ember.computed.alias('todos.completed')
});
