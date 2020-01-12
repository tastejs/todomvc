'use strict';

const STORAGE_KEY = 'todos-svelte';

export default {
	read() {
		const json = localStorage.getItem(STORAGE_KEY);
		const persistedValue = json && JSON.parse(json);
		return persistedValue || [];
	},
	write(newList) {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
		return newList;
	}
};