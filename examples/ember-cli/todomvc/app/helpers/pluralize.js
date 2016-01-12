import Ember from 'ember';

export function pluralize([singular, count]/*, hash*/) {
	return count === 1 ? singular : singular + 's';
}

export default Ember.Helper.helper(pluralize);
