import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class IndexRoute extends Route {
  @service todoData;

  model() {
    let data = this.todoData;

    return {
      get todos() {
        return data.all;
      }
    };
  }
}
