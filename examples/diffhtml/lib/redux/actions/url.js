export const SET_HASH_STATE = 'SET_HASH_STATE';

export function setHashState(hash) {
	const path = hash.slice(1) || '/';

	return {
		type: SET_HASH_STATE,
		path
	};
}
