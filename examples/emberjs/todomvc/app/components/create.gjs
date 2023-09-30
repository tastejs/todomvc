import Component from '@glimmer/component';
import { on } from '@ember/modifier';
import { service } from '@ember/service';
import { isBlank } from '@ember/utils';

export default class Create extends Component {
  @service repo;

  // TODO: we should use a <form> instead of this.
  //       this logic was copied from "the old way"
  //       which was Ember 3.2, and todomvc has historically
  //       been not great for a11y
  createTodo = (event) => {
    let { keyCode, target } = event;
    let value = target.value.trim();

    if (keyCode === 13 && !isBlank(value)) {
				this.repo.add({ title: value, completed: false });
				target.value = '';
			}
  };

  <template>
    <input
      class="new-todo"
      {{on 'keydown' this.createTodo}}
      placeholder="What needs to be done?"
      autofocus
    >
  </template>
}
