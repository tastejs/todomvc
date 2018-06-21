import React, { Component, Fragment } from 'react';
import TodoFooter from './footer';
import TodoItem from './todoItem';
import * as Utils from './utils';

const ENTER_KEY = 13;

class TodoApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: null,
      newTodo: '',
      todos: Utils.getStore('react-todos')
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleNewTodoKeyDown = this.handleNewTodoKeyDown.bind(this);
    this.toggleAll = this.toggleAll.bind(this);
    this.cancel = this.cancel.bind(this);
    this.clearCompleted = this.clearCompleted.bind(this);
  }

  handleChange(event) {
    this.setState({ newTodo: event.target.value });
  }

  handleNewTodoKeyDown(event) {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }

    event.preventDefault();

    const title = this.state.newTodo.trim();

    if (title) {
      const newTodo = {
        id: Utils.uuidFunc(),
        title: title,
        completed: false
      };
      const newTodos = this.state.todos.concat(newTodo);
      this.setState({ todos: newTodos, newTodo: '' }, () => this.inform());
    }
  }

  inform() {
    Utils.getStore(this.key, this.state.todos);
  }

  toggleAll(event) {
    const newTodos = this.state.todos.map(function(todo) {
      return Object.assign({}, todo, { completed: event.target.checked });
    });
    this.setState({ todos: newTodos }, () => this.inform());
  }

  toggle(todoToToggle) {
    const newTodos = this.state.todos.map(function(todo) {
      return todo !== todoToToggle
        ? todo
        : Object.assign({}, todo, { completed: !todo.completed });
    });
    this.setState({ todos: newTodos }, () => this.inform());
  }

  destroy(todo) {
    const newTodos = this.state.todos.filter(function(candidate) {
      return candidate !== todo;
    });

    this.setState({ todos: newTodos }, () => this.inform());
  }

  edit(todo) {
    this.setState({ editing: todo.id });
  }

  save(todoToSave, text) {
    const newTodos = this.state.todos.map(function(todo) {
      return todo !== todoToSave
        ? todo
        : Object.assign({}, todo, { title: text });
    });

    this.setState({ todos: newTodos, editing: null }, () => this.inform());
  }

  cancel() {
    this.setState({ editing: null });
  }

  clearCompleted() {
    const newTodos = this.state.todos.filter(function(todo) {
      return !todo.completed;
    });

    this.setState({ todos: newTodos, editing: null }, () => this.inform());
  }

  render() {
    let footer = null;
    let main = null;
    const todos = this.state.todos;

    const shownTodos = todos.filter(function(todo) {
      switch (this.props.nowShowing) {
        case 'active':
          return !todo.completed;
        case 'completed':
          return todo.completed;
        default:
          return true;
      }
    }, this);

    const todoItems = shownTodos.map(todo => {
      return (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={this.toggle.bind(this, todo)}
          onDestroy={this.destroy.bind(this, todo)}
          onEdit={this.edit.bind(this, todo)}
          editing={this.state.editing === todo.id}
          onSave={this.save.bind(this, todo)}
          onCancel={this.cancel}
        />
      );
    }, this);

    const activeTodoCount = todos.reduce(function(accum, todo) {
      return todo.completed ? accum : accum + 1;
    }, 0);

    const completedCount = todos.length - activeTodoCount;

    if (activeTodoCount || completedCount) {
      footer = (
        <TodoFooter
          count={activeTodoCount}
          completedCount={completedCount}
          nowShowing={this.props.nowShowing}
          onClearCompleted={this.clearCompleted}
        />
      );
    }

    if (todos.length) {
      main = (
        <section className="main">
          <input
            id="toggle-all"
            className="toggle-all"
            type="checkbox"
            onChange={this.toggleAll}
            checked={activeTodoCount === 0}
          />
          <label htmlFor="toggle-all" />
          <ul className="todo-list">{todoItems}</ul>
        </section>
      );
    }

    return (
      <Fragment>
        <header className="header">
          <h1>todos</h1>
          <input
            className="new-todo"
            placeholder="What needs to be done?"
            value={this.state.newTodo}
            onKeyDown={this.handleNewTodoKeyDown}
            onChange={this.handleChange}
            autoFocus={true}
          />
        </header>
        {main}
        {footer}
      </Fragment>
    );
  }
}

export default TodoApp;
