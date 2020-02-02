import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

import { isEnterKey } from 'todomvc/utils/key';

function clearInput(input) {
  input.value = '';
}

export default class TodoAppHeaderComponent extends Component {
  @service todoData;

  @action onKeyDown(keyDownEvent) {
    let inputElement = keyDownEvent.target;
    let text = inputElement.value.trim();
    let hasValue = Boolean(text);

    if (isEnterKey(keyDownEvent) && hasValue) {
      this.todoData.add(text);

      clearInput(inputElement);
    }
  }

  @action focus(input) {
    input.focus();
  }
}
