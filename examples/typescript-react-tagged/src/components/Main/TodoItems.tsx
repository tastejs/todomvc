import * as React from 'react';


import { AppProps, Todo, TodoFilter, assertNever } from '../../shared';
import { TodoItem } from './TodoItem';

export const TodoItems = (p: AppProps) =>
  <ul className="todo-list">
    {shownTodos(p).map(x => <TodoItem key={x.id} item={x} {...p} />)}
  </ul>;


function shownTodo(p: AppProps): (item: Todo) => boolean {
  switch(p.filter) {
    case TodoFilter.Active: return x => !x.completed;
    case TodoFilter.All: return x => true;
    case TodoFilter.Completed: return x => x.completed;
    default: return assertNever(p.filter);
  }
}

function shownTodos(p: AppProps) {
  const f = shownTodo(p);
  return p.todos.filter(f);
}

