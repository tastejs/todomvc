import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { QueryEntity } from '@datorama/akita';
import { switchCase } from '@mindspace-io/utils';

import { Todo, VISIBILITY_FILTER } from './todo.model';

export interface TodosState extends EntityState<Todo> {
  filter: VISIBILITY_FILTER;
}

@StoreConfig({ name: 'todos' })
export class TodosStore extends EntityStore<TodosState, Todo> {
  constructor() {
    super({
      filter: VISIBILITY_FILTER.SHOW_ALL
    });
  }
}

export class TodosQuery extends QueryEntity<TodosState, Todo> {
  filter$ = this.select(state => state.filter);
  todos$ = combineLatest([this.filter$, this.selectAll()]).pipe(map(gatherVisibleTodos));

  constructor(protected store: TodosStore) {
    super(store);
  }
}

function gatherVisibleTodos([filter, todos]): Todo[] {
  const withFilter = switchCase(
    {
      [VISIBILITY_FILTER.SHOW_ACTIVE]: () => todos.filter(t => !t.completed),
      [VISIBILITY_FILTER.SHOW_COMPLETED]: () => todos.filter(t => t.completed)
    },
    todos || []
  );

  return withFilter(filter);
}

export const todosStore = new TodosStore();
export const todosQuery = new TodosQuery(todosStore);
