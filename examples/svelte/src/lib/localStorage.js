import { writable } from 'svelte/store';

const ls = typeof localStorage === 'undefined' ? {} : localStorage;

function localStorageStore({ key, initialValue = {} } = {}) {
	const store = writable(JSON.parse(ls[key] ?? JSON.stringify(initialValue)));
	store.subscribe((value) => {
		ls[key] = JSON.stringify(value);
	});

	return store;
}

export { localStorageStore as localStorage };
