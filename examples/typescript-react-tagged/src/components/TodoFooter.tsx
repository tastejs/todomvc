import * as React from 'react';

import { AppProps, Action, TodoFilter, assertNever } from '../shared';


function filterName(x: TodoFilter) {
  switch(x) {
    case TodoFilter.Active: return "Active";
    case TodoFilter.All: return "All";
    case TodoFilter.Completed: return "Completed";
    default: return assertNever(x);
  }
}

const FilterItem = (p: AppProps & { selectFilter: TodoFilter }) =>
  <li>
    <a href="#" 
      className={p.filter===p.selectFilter?"selected":""}
      onClick={() => p.controller({ name: "filter", filter: p.selectFilter})}>{filterName(p.selectFilter)}</a>
  </li>;

const Filters = (p: AppProps) =>
  <ul className="filters">
    <FilterItem selectFilter={TodoFilter.All} {...p} />
    {' '}
    <FilterItem selectFilter={TodoFilter.Active} {...p} />
    {' '}
    <FilterItem selectFilter={TodoFilter.Completed} {...p} />
  </ul>;

const FilterCount = (p: AppProps & { activeCount: number }) =>
  <span className="todo-count">
    <strong>{p.activeCount}</strong> {p.activeCount===1?"item":"items"} left
  </span>;

const FilterButton = (p: AppProps & { activeCount: number }) =>
  p.activeCount < p.todos.length
    ? <button
        className="clear-completed"
        onClick={() => p.controller({ name: "clearCompleted" })}>
        Clear completed
        </button>
    : null;

const TodoFooterShow = (p: AppProps) => {
  const activeCount = p.todos.filter(x=>!x.completed).length;
  return (
    <footer className="footer">
      <FilterCount activeCount={activeCount} {...p} />
      <Filters {...p} />
      <FilterButton activeCount={activeCount} {...p} />
    </footer>
  );
};

export const TodoFooter = (p: AppProps) =>
  p.todos.length>0 ? <TodoFooterShow {...p} /> : null; 

