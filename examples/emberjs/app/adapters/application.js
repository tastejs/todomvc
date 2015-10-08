import Ember from 'ember';
import DS from 'ember-data';

let namespace;

if (Ember.testing) {
	namespace = 'todos-emberjs-testing';
} else {
	namespace = 'todos-emberjs';
}

export default DS.LSAdapter.extend({
	namespace
});
