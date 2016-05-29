import { compose, combineReducers, createStore, applyMiddleware } from 'redux';
import todoApp from './reducers/todo-app';
import url from './reducers/url';

// Makes a reusable function to create a store. Currently not exported, but
// could be in the future for testing purposes.
const createStoreWithMiddleware = compose(
	// Adds in store middleware, such as async thunk and logging.
	applyMiddleware(),

	// Hook devtools into our store.
	window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore);

// Compose the root reducer from modular reducers.
export default createStoreWithMiddleware(combineReducers({
	// Encapsulates all TodoApp state.
	todoApp,

	// Manage the URL state.
	url,

	// Store the last action taken.
	lastAction: (state, action) => action
}), {});
