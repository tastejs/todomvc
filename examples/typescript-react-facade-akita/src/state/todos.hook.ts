import { useObservable } from '@mindspace-io/utils';
import { facade, TodosFacade } from './todos.facade';
import { VISIBILITY_FILTER as v, Todo } from './todo.model';

export type TodoHookTuple = [string, Todo[], TodosFacade];

export function useTodosHook(): TodoHookTuple {
  const [filter] = useObservable(facade.filter$, v.SHOW_ALL);
  const [todos] = useObservable(facade.todos$, []);

  return [filter, todos, facade];
}
