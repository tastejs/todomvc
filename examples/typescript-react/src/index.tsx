import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';

import 'todomvc-common/base.css';
import 'todomvc-app-css/index.css';
import App from './App';

const handleSavingTodos = (todos: Array<ITodo>) => {
  localStorage.setItem('todos', JSON.stringify(todos));
};

const retrieveSavedTodos = (): Array<ITodo> => {
  const todosJSON = localStorage.getItem('todos');

  if (todosJSON) {
    return JSON.parse(todosJSON);
  }

  return [];
};

const initialTodos = retrieveSavedTodos();

ReactDOM.render(
  <Router>
    <App initialTodos={initialTodos} handleSavingTodos={handleSavingTodos} />
  </Router>,
  document.getElementById('root'),
);
