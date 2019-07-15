// By default, use session storage...
import { isObject } from './is-object';
import { isFunction } from './is-function';
/**
 * @author Jonmathon Hibbard
 * @license MIT
 */

const EMPTY_OBJ = {};
const LOCAL_STORAGE_DISABLED = 'localStorage is disabled';
const LOCAL_STORAGE_NOT_SUPPORTED = 'localStorage not supported';
const FAILED_TO_GET_REQUESTED_KEY = 'Failed to get requested key from local storage!';
const KEY_PREFIX = 'EXAMPLE_STORE_';
const activeDateStore = sessionStorage;
const generateKey = key => `${ KEY_PREFIX }${ key }`;
const LocalDataStore = {
	useSessionStorage() {
		activeDateStore = sessionStorage;
	},

	useLocalStorage() {
		activeDateStore = localStorage;
	},

	get(key) {
		if (!key) {
			return EMPTY_OBJ;
		}

		const storeKey = generateKey(key);
		const value = activeDateStore.getItem(storeKey);

		try {
			const result = JSON.parse(value);

			return result;
		} catch(e) {
			console.warn(FAILED_TO_GET_REQUESTED_KEY);

			return value;
		}
	},

	isset(key) {
		if (!key) {
			return false;
		}

		var storeKey = generateKey(key);

		return !!activeDateStore.getItem(storeKey);
	},

	set(key, value) {
		if (!key || isFunction(value)) {
			return false;
		}

		const storeKey = generateKey(key);

		// remove previous version (if it exists)
		LocalDataStore.remove(storeKey);

		if (isObject(value)) {
			value = JSON.stringify(value);
		}

		activeDateStore.setItem(storeKey, value);
	},

	remove(key) {
		if (!key || !LocalDataStore.isset(key)) {
			return false;
		}

		const storeKey = generateKey(key);

		activeDateStore.removeItem(storeKey);
	},

	clear() {
		activeDateStore.clear();
	}
};

export default LocalDataStore;
