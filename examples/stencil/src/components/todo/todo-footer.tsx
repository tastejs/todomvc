import {Component, Prop, h, Event, EventEmitter} from '@stencil/core';
import {pluralize} from '../../utils/utils';
import {ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS} from './showing-state';
import classNames from 'classnames';

@Component({
  tag: 'todo-footer',
  styleUrl: 'todo-footer.css',
  shadow: true
})
export class TodoFooter {

  @Prop() count: number;
  @Prop() completedCount: number;
  @Prop() nowShowing: string;
  @Event() clearCompleted: EventEmitter<void>;

  render() {
    let activeTodoWord = pluralize(this.count, 'item');
    let clearButton = null;

    if (this.completedCount > 0) {
      clearButton = (
        <button
          class="clear-completed"
          onClick={_ => this.clearCompleted.emit()}>
          Clear completed
        </button>
      );
    }

    let nowShowing = this.nowShowing;
    return (
      <footer class="footer">
					<span class="todo-count">
						<strong>{this.count}</strong> {activeTodoWord} left
					</span>
        <ul class="filters">
          <li>
            <a
              href="#/"
              class={classNames({selected: nowShowing === ALL_TODOS})}>
              All
            </a>
          </li>
          {' '}
          <li>
            <a
              href="#/active"
              class={classNames({selected: nowShowing === ACTIVE_TODOS})}>
              Active
            </a>
          </li>
          {' '}
          <li>
            <a
              href="#/completed"
              class={classNames({selected: nowShowing === COMPLETED_TODOS})}>
              Completed
            </a>
          </li>
        </ul>
        {clearButton}
      </footer>
    );
  }

}
