'use strict';
/* jshint esnext: false */
/* jshint esversion: 9 */

import { writable, derived } from 'svelte/store';
import localStorageService from '../helpers/localStorage';
import {
	add,
	remove,
	modify,
	modifyAll,
	filterByUncompleted
} from '../transforms/todos';

export function createTodosStore(storageService) {
	const persistedValue = storageService.read();
	const store = writable(persistedValue);

	const updateWithTransform = function(transform) {
		return store.update(list => {
			const newList = transform(list);
			return storageService.write(newList);
		});
	};

	return {
		...store,
		add: todo =>
			updateWithTransform(list => add(list, todo)),
		remove: id =>
			updateWithTransform(list => remove(list, id)),
		toggle: (id, completed) =>
			updateWithTransform(list => modify(list, id, {completed})),
		updateTitle: (id, title) =>
			updateWithTransform(list => modify(list, id, {title})),
		toggleAll: completed =>
			updateWithTransform(list => modifyAll(list, {completed})),
		clearAllCompleteds: () =>
			updateWithTransform(list => filterByUncompleted(list))
	};
}

export function createVisibleStore(todosStore) {
	return derived(todosStore, $todosStore => $todosStore.length > 0);
}

export const todos = createTodosStore(localStorageService);
export const visible = createVisibleStore(todos);