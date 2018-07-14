import { filterBy } from '@ember/object/computed';
import Controller from '@ember/controller';

export default Controller.extend({
	todos: filterBy('model', 'completed', true)
});
