import React, { useState, ChangeEvent, FormEvent } from 'react';
import uuid from 'uuid/v4';
import { withRouter, RouteComponentProps, matchPath } from 'react-router-dom';

import TodoItem from './components/TodoItem';
import TodoFooter from './components/TodoFooter';
import isDefined from './utils/isDefined';

interface IAppProps {
  initialTodos: Array<ITodo> | [];
  handleSavingTodos: (todos: Array<ITodo>) => void;
}

const App: React.FC<IAppProps & RouteComponentProps> = (props) => {
  const [inputFieldText, setInputFieldText] = useState('');
  const [todos, setTodos] = useState<Array<ITodo>>(props.initialTodos);
  const [idOfTodoToEdit, setIdOfTodoToEdit] = useState<String | undefined>(undefined);

  const visibleTodos = todos.filter((todo) => {
    if (matchPath(props.location.pathname, { path: '/active' })) {
      return !todo.completed;
    }
    if (matchPath(props.location.pathname, { path: '/completed' })) {
      return todo.completed;
    }

    return true;
  });

  const onInputFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputFieldText(newValue);
  };

  const toggleSingleTodo = (todoToUpdate: ITodo) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id !== todoToUpdate.id) {
        return todo;
      }

      return {
        ...todo,
        completed: !todo.completed,
      };
    });

    setTodos(updatedTodos);
    props.handleSavingTodos(updatedTodos);
  };

  const toggleAllTodos = (event: ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    const updatedTodos = todos.map((todo) => ({ ...todo, completed: checked }));
    setTodos(updatedTodos);
    props.handleSavingTodos(updatedTodos);
  };

  const onFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newTodo = {
      id: uuid(),
      title: inputFieldText,
      completed: false,
    };
    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    props.handleSavingTodos(updatedTodos);
    setInputFieldText('');
  };

  const getCountOfActiveTodos = () => {
    const activeTodos = todos.filter((todo) => !todo.completed);
    return activeTodos.length;
  };

  const getCountOfCompletedTodos = () => {
    const activeTodos = todos.filter((todo) => todo.completed);
    return activeTodos.length;
  };

  const onTodoEdit = (todo: ITodo) => {
    setIdOfTodoToEdit(todo.id);
  };

  const onTodoEditSubmission = (todoToUpdate: ITodo, updatedTitle: string) => {
    const updatedTodos = todos
      .map((todo) => {
        if (todo.id !== todoToUpdate.id) {
          return todo;
        }

        if (updatedTitle === '') {
          return undefined;
        }

        return {
          ...todo,
          title: updatedTitle,
        };
      })
      .filter(isDefined);

    setTodos(updatedTodos);
    props.handleSavingTodos(updatedTodos);
    setIdOfTodoToEdit(undefined);
  };

  const onTodoEditCancel = () => {
    setIdOfTodoToEdit(undefined);
  };

  const onClearCompleted = () => {
    const updatedTodos = todos.filter((todo) => !todo.completed);
    setTodos(updatedTodos);
    props.handleSavingTodos(updatedTodos);
  };

  return (
    <section className="todoapp">
      <header className="header">
        <h1>todos</h1>
        <form onSubmit={onFormSubmit}>
          <input
            className="new-todo"
            value={inputFieldText}
            onChange={onInputFieldChange}
            autoFocus
            placeholder="What needs to be done?"
          />
        </form>
        {todos.length > 0 && (
          <>
            <section className="main">
              <input
                id="toggle-all"
                className="toggle-all"
                type="checkbox"
                onChange={toggleAllTodos}
                checked={getCountOfActiveTodos() === 0}
              />
              <label htmlFor="toggle-all">Mark all as complete</label>
              <ul className="todo-list">
                {visibleTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={() => {
                      toggleSingleTodo(todo);
                    }}
                    isEditing={idOfTodoToEdit === todo.id}
                    onEdit={onTodoEdit}
                    onEditSubmission={onTodoEditSubmission}
                    onEditCancel={onTodoEditCancel}
                  />
                ))}
              </ul>
            </section>
            <TodoFooter
              remainingTodosCount={getCountOfActiveTodos()}
              completedCount={getCountOfCompletedTodos()}
              onClearCompleted={onClearCompleted}
            />
          </>
        )}
      </header>
    </section>
  );
};

export default withRouter(App);
