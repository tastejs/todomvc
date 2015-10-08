import Ember from 'ember';

export default Ember.Controller.extend({
	todos: Ember.inject.controller(),
	activeTodos: Ember.computed.alias('todos.remaining')
});
