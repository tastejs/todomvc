import {TodoItemModel, TodoModel} from "./components/todo/todo-model";

export * from './components';
import {store, uuid} from './utils/utils';


export class TodoModelImpl implements TodoModel {

  key: string;
  todos: Array<TodoItemModel>;
  onChanges: Array<Function>;

  constructor(key: string) {
    this.key = key;
    this.todos = store(key);
    this.onChanges = [];
  }

  subscribe(onChange) {
    this.onChanges.push(onChange);
  }

  inform() {
    store(this.key, this.todos);
    this.onChanges.forEach(function (cb) { cb(); });
  };

  addTodo(title) {
    this.todos = this.todos.concat({
      id: uuid(),
      title: title,
      completed: false
    });

    this.inform();
  };

  toggleAll(checked) {
    // Note: it's usually better to use immutable data structures since they're
    // easier to reason about and React works very well with them. That's why
    // we use map() and filter() everywhere instead of mutating the array or
    // todo items themselves.
    this.todos = this.todos.map(function (todo) {
      return {...todo, ...{completed: checked}};
    });

    this.inform();
  };

  toggle(todoId) {
    this.todos = this.todos.map(function (todo) {
      return todo.id !== todoId ?
        todo : {...todo, ...{completed: !todo.completed}};
    });

    this.inform();
  };

  destroy(todoId) {
    this.todos = this.todos.filter(function (candidate) {
      return candidate.id !== todoId;
    });

    this.inform();
  };

  save(todoId, text) {
    this.todos = this.todos.map(function (todo) {
      return todo.id !== todoId ? todo : {...todo, ...{title: text}};
    });

    this.inform();
  };

  clearCompleted() {
    this.todos = this.todos.filter(function (todo) {
      return !todo.completed;
    });

    this.inform();
  };

}



