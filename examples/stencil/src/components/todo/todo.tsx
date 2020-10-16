import { Component, Prop, h, State } from '@stencil/core';
import {TodoModel} from './todo-model';
import {ACTIVE_TODOS, COMPLETED_TODOS, ALL_TODOS, ShowingState} from './showing-state';

const ENTER_KEY = 13;

@Component({
  tag: 'todo-app',
  styleUrl: 'todo.css',
  shadow: true
})
export class Todo {

  @State() newTodo: string;
  @State() editing: string;
  @State() nowShowing: ShowingState = ALL_TODOS;
  @Prop() model: TodoModel;

  handleNewTodoKeyDown (event: KeyboardEvent) {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }
    event.preventDefault();

    let val = this.newTodo.trim();
    if (val) {
      this.model.addTodo(val);
      this.newTodo = '';
    }
  }

  toggle (todoId) {
    this.model.toggle(todoId);
  }

  destroy(todoId) {
    this.model.destroy(todoId);
  }

  edit(todoId) {
    this.editing = todoId;
  }

  save(todoId, text) {
    this.model.save(todoId, text);
    this.editing = null;
  }

  cancel() {
    this.editing = null;
  }


  handleChange (event) {
    this.newTodo = event.target.value;
  }

  clearCompleted() {
    this.model.clearCompleted();
  }

  toggleAll(event) {
    let checked = event.target.checked;
    this.model.toggleAll(checked);
  }

  // noinspection JSMethodCanBeStatic
  componentWillLoad() {
    window.addEventListener("hashchange", (ev) => {
      let newURL = ev.newURL;
      let tokens = newURL.split('#');
      let hash = tokens.length > 1?tokens[1]:'/all';
      switch (hash) {
        case '/active': this.nowShowing = ACTIVE_TODOS; break;
        case '/completed': this.nowShowing = COMPLETED_TODOS; break;
        default: this.nowShowing = ALL_TODOS;
      }
    }, false);
  }

  render() {
    let main, footer;

    if (!this.model)
      return <div>todo-app web component requires a model</div>;

    let todos = this.model.todos;

    let shownTodos = todos.filter(function (todo) {
      switch (this.nowShowing) {
        case ACTIVE_TODOS:
          return !todo.completed;
        case COMPLETED_TODOS:
          return todo.completed;
        default:
          return true;
      }
    }, this);

    let todoItems = shownTodos.map(function (todo) {
      return (
        <todo-item
          key={todo.id}
          todo={todo}
          onToggle={ev => this.toggle(ev.detail)}
          onDestroy={ev => this.destroy(ev.detail)}
          onEdit={ev => this.edit(ev.detail)}
          editing={this.editing === todo.id}
          onSave={ev => this.save(ev.detail.todoId, ev.detail.text)}
          onCancel={_ => this.cancel()}
        />
      );
    }, this);

    let activeTodoCount = todos.reduce(function (accum, todo) {
      return todo.completed ? accum : accum + 1;
    }, 0);

    let completedCount = todos.length - activeTodoCount;

    if (activeTodoCount || completedCount) {
      footer =
        <todo-footer
          count={activeTodoCount}
          completedCount={completedCount}
          nowShowing={this.nowShowing}
          onClearCompleted={_ => this.clearCompleted()}
        />;
    }


    if (todos.length) {
      main = (
        <section class="main">
          <input
            id="toggle-all"
            class="toggle-all"
            type="checkbox"
            onChange={ev => this.toggleAll(ev)}
            checked={activeTodoCount === 0}
          />
          <label
            htmlFor="toggle-all"
          />
          <ul class="todo-list">
            {todoItems}
          </ul>
        </section>
      );
    }


    return <div class="todo">
      <div class="todoapp">
      <header class="header">
        <h1>todos</h1>
        <input
          class="new-todo"
          placeholder="What needs to be done?"
          value={this.newTodo}
          onKeyDown={(event: KeyboardEvent) => this.handleNewTodoKeyDown(event)}
          onInput={(event: UIEvent) => this.handleChange(event)}
          autoFocus={true}
        />
      </header>
        {main}
        {footer}
      </div>
    </div>

  }
}
