import { produce } from 'immer';
import { StateHistoryPlugin } from '@datorama/akita';
import { createTodo, VISIBILITY_FILTER, Todo } from './todo.model';
import { TodosStore, TodosQuery, TodosState, todosQuery, todosStore } from './todos.store';

function toggleCompleted(todo: Todo) {
  return { completed: !todo.completed };
}

export class TodosFacade {
  readonly filter$ = this.query.filter$;
  readonly todos$ = this.query.todos$;
  readonly history = new StateHistoryPlugin(this.query);

  constructor(private store: TodosStore, private query: TodosQuery) {}

  addTodo(text: string) {
    this.store.add(createTodo(text));
  }
  deleteTodo({ id }) {
    this.store.remove(id);
  }
  toggleComplete({ id }) {
    todosStore.update(id, toggleCompleted);
  }

  updateFilter(filter: VISIBILITY_FILTER) {
    this.store.update(
      produce((draft: TodosState) => {
        draft.filter = filter;
      })
    );
  }
}

export const facade = new TodosFacade(todosStore, todosQuery);
