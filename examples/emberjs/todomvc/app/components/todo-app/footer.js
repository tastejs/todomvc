import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

function isPlural(num) {
  return num !== 1; // > 1 || === 0
}

export default class TodoAppFooterComponent extends Component {
  @service todoData;

  get suffix() {
    return isPlural(this.todoData.all.length) ? 'items' : 'item';
  }

  get remaining() {
    return this.todoData.incomplete.length;
  }

  get completed() {
    return this.todoData.completed.length;
  }
}
