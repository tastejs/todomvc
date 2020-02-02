import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

class Todo {
  @tracked title = '';
  @tracked completed = false;

  constructor(title) {
    this.title = title;
  }
}

export default class TodoDataService extends Service {
  @tracked data = [];

  constructor(...args) {
    super(...args);

    this.data = load();
  }

  get all() {
    return this.data;
  }

  get incomplete() {
    return this.data.filter(todo => {
      return todo.completed === false;
    });
  }

  get completed() {
    return this.data.filter(todo => {
      return todo.completed;
    });
  }

  @action toggle(todo) {
    todo.completed = !todo.completed;

    this.persist();
  }

  @action add(title) {
    let newTodo = new Todo(title);

    this.data = [...this.data, newTodo];

    this.persist();
  }

  @action remove(todo) {
    this.data = this.data.filter(existing => {
      return existing !== todo;
    });

    this.persist();
  }

  @action clearCompleted() {
    this.data = this.incomplete;
    this.persist();
  }

  @action updateTitle(todo, title) {
    todo.title = title;

    this.persist();
  }

  @action persist() {
    persist(this.data);
  }
}

/**************************
 * local storage helpers
 ***************************/

function load() {
  let lsValue = localStorage.getItem('todos');
  let array = (lsValue && JSON.parse(lsValue));

  let todos = deserializeTodoData(array);

  return todos;
}

function persist(todos) {
  let data = serializeTodos(todos);
  let result = JSON.stringify(data);

  localStorage.setItem('todos', result);

  return result;
}

function serializeTodos(todos) {
  return todos.map(todo => ({ title: todo.title, completed: todo.completed }));
}

function deserializeTodoData(data) {
  return (data || []).map(json => {
    let todo = new Todo(json.title);

    todo.completed = json.completed;

    return todo;
  });
}
