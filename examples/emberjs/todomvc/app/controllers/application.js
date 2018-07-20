import { isBlank } from '@ember/utils';
import { filterBy } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default Controller.extend({
	repo: service(),
	remaining: filterBy('model', 'completed', false),
	completed: filterBy('model', 'completed'),
	actions: {
		createTodo(e) {
			if (e.keyCode === 13 && !isBlank(e.target.value)) {
				this.repo.add({ title: e.target.value.trim(), completed: false });
				e.target.value = '';
			}
		},

		clearCompleted() {
			this.model.removeObjects(this.completed);
			this.repo.persist();
		}
	}
});
