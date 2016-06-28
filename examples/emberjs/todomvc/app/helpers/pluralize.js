import Ember from 'ember';
import { pluralize } from 'ember-inflector';

export function pluralizeHelper([singular, count]/*, hash*/) {
	return count === 1 ? singular : pluralize(singular);
}

export default Ember.Helper.helper(pluralizeHelper);
