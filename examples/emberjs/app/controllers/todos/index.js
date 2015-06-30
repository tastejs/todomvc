import Ember from 'ember';

export default Ember.Controller.extend({
	todos: Ember.inject.controller(),
	savedTodos: Ember.computed.alias('todos.savedTodos')
});
