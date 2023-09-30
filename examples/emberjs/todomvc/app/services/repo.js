import Service from '@ember/service';
import { TrackedObject } from 'tracked-built-ins';
import { tracked } from '@glimmer/tracking';

function load() {
  // localStorage has to be an array (required by the todomvc repo),
  // so let's convert to an object on id.
  let list = JSON.parse(window.localStorage.getItem('todos') || '[]'));

  return list.reduce((indexed, todo) => {
    indexed[todo.id] = todo;

    return indexed;
  }, new TrackedObject());
}

function save(indexedData) {
  let data = Object.values(indexedData);

	window.localStorage.setItem('todos', JSON.stringify(data));
}

export default class Repo extends Service {
  #lastId = 0;

  /**
    * @type {{ [id: string]: {
    *   id: number,
    *   title: string,
    *   completed: boolean,
    * }}}
    */
  @tracked data = new TrackedObject();

	load = () => {
    this.data = load();
	}

  get all() {
    return Object.values(this.data);
  }

  get completed() {
    return this.all.filter(todo => todo.completed);
  }

  get active() {
    return this.all.filter(todo => !todo.completed);
  }

  get remaining() {
    // This is an alias
    return this.active;
  }

  clearCompleted = () => {
    this.completed.forEach(this.delete);
  }

	add = (attrs) => {
    let newId = this.#lastId++;
		let todo = Object.assign({ id: newId }, attrs);

		this.data[newId] = todo;
		this.persist();

		return todo;
	}

	delete = (todo) => {
    delete this.data[todo.id];
		this.persist();
	}

	persist() {
		window.localStorage.setItem('todos', JSON.stringify(this.data));
	}
});
