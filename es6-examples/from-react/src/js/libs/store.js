import { noop } from '../constants/common';
/**
 * @author Jonmathon Hibbard
 * @license MIT
 *
 * This is just an example of how to create your own redux store...and use it the same way you would redux..
 */

const createStore = compose => {
	let state;
	let listeners = [];

	const getState = () => state;
	const dispatch = action => {
		state = compose(state, action);

		listeners.map(listener => listener());
	};

	const subscribe = listener => {
		listeners.push(listener);

		const lastIdx = listeners.length - 1;

		// this is our unsubscribe routine.  so when we're done listening, the method that is returned here should be executed - which will allow us to stop listening to whatever it is that we were listening to before.
		return () => {
			listeners = [...listeners.slice(0, lastIdx), ...listeners.slice(lastIdx + 1)];
		}
	};

	dispatch({});

	return { getState, dispatch, subscribe };
};

const combineStores = stores => (state = {}, action) => Object.keys(stores).reduce((nextState, key) => {
	nextState[key] = stores[key](state[key], action);

	return nextState
}, {});

export { createStore, combineStores };
