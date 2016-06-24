import Ember from 'ember';

export default Ember.Controller.extend({
	todos: Ember.computed.filterBy('model', 'completed', true)
});
