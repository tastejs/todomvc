export const loadState = () => {
	try {
		// Gets our state from the local storage
		const serializedState = localStorage.getItem('todos-react-redux');

		// If there's no stored data, returns undefined
		// so reducers will use their own defaults
		if (serializedState === null) {
			return undefined;
		}

		// There's a string representing our state
		// parses it and returns parsed object
		return JSON.parse(serializedState);
	} catch (err) {
		// If there was an error log it and let
		// loadState return undefined by itself
		console.log('There was an error loading the state', err);
	}
};

export const saveState = (state) => {
	try {
		// Serializes the state into a string constant
		const serializedState = JSON.stringify(state);

		// Saves the serialized state on local storage
		localStorage.setItem('todos-react-redux', serializedState);
	} catch (err) {
		// If there was an error log it
		console.log('There was an error saving the state', err);
	}
};
