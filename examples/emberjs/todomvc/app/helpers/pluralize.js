import { helper as buildHelper } from '@ember/component/helper';
import { pluralize } from 'ember-inflector';

export function pluralizeHelper([singular, count]/*, hash*/) {
	return count === 1 ? singular : pluralize(singular);
}

export default buildHelper(pluralizeHelper);
