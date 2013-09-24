/*global Ember, DS, Todos:true */
window.Todos = Ember.Application.create();

Todos.ApplicationAdapter = DS.LSAdapter.extend({
	namespace: 'todos-emberjs'
});
