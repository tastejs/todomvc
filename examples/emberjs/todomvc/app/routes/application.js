import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default Route.extend({
	repo: service(),
	model() {
		return this.repo.findAll();
	}
});
