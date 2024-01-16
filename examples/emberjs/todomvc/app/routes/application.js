import Route from '@ember/routing/route';
import { service } from '@ember/service';

/**
 * Handles app boot and general app one-time setup things.
 */
export default class Application extends Route {
	@service repo;

	beforeModel() {
		/**
		 * Load from localStorage
		 */
		this.repo.load();
	}
}
