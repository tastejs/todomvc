import { writable } from 'svelte/store';

const ls: Record<string, any> = typeof localStorage === 'undefined' ? {} : localStorage;

function localStorageStore<T>({ key, initialValue = {} as T }: { key: string; initialValue?: T }) {
	const store = writable<T>(JSON.parse(ls[key] ?? JSON.stringify(initialValue)));
	store.subscribe((value) => {
		ls[key] = JSON.stringify(value);
	});

	return store;
}

export { localStorageStore as localStorage };
