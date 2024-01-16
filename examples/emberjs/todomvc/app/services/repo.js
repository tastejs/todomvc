import { uniqueId } from '@ember/helper';
import Service from '@ember/service';

import { TrackedMap, TrackedObject } from 'tracked-built-ins';

function load() {
	// localStorage has to be an array (required by the todomvc repo),
	// so let's convert to an object on id.
	let list = JSON.parse(window.localStorage.getItem('todos') || '[]');

	return list.reduce((indexed, todo) => {
		indexed.set(todo.id, new TrackedObject(todo));

		return indexed;
	}, new TrackedMap());
}

function save(indexedData) {
	let data = [...indexedData.values()];

	window.localStorage.setItem('todos', JSON.stringify(data));
}

export default class Repo extends Service {
	/**
	 * @type {Map<string, {
	 *   id: number,
	 *   title: string,
	 *   completed: boolean,
	 * }>}
	 */
	data = null;

	load = () => {
		this.data = load();
	};

	get all() {
		return [...this.data.values()];
	}

	get completed() {
		return this.all.filter((todo) => todo.completed);
	}

	get active() {
		return this.all.filter((todo) => !todo.completed);
	}

	get remaining() {
		// This is an alias
		return this.active;
	}

	clearCompleted = () => {
		this.completed.forEach(this.delete);
	};

	add = (attrs) => {
		let newId = uniqueId();

		this.data.set(newId, new TrackedObject({ ...attrs, id: newId }));
		this.persist();
	};

	delete = (todo) => {
		this.data.delete(todo.id);
		this.persist();
	};

	persist = () => {
		save(this.data);
	};
}
