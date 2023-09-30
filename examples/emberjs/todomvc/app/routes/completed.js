import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class CompletedTodos extends Route {
  @service repo;

  /**
    * This should probably be renamed to "data"
    * its under active development.
    *
    * In a real app you'd use this to load your
    * _minimally required_ data to show the page.
    */
  model() {
    return this.repo.completed;
  }
}
