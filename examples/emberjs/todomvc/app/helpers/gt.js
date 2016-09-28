import Ember from 'ember';

export function gt([n1, n2]/*, hash*/) {
	return n1 > n2;
}

export default Ember.Helper.helper(gt);
