import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { Router, Route, hashHistory } from 'react-router';
import App from './containers/App';
import reducer from './reducers';
import { loadState, saveState } from './storage';

// Loads the initial state from local storage
const initialState = loadState();

// Creates our store with the './reducers'
// reducer and the initial state
const store = createStore(reducer, initialState);

// Saves the state on local storage each time it changes
store.subscribe(() => saveState(store.getState()));

// Renders the application on the .todoapp element
render(
	<Provider store={store}>
		{/* Provider passes the store to child elements through React context
		Router Creates a router with hash history */}
		<Router history={hashHistory}>
			{/* path matches "/" and passes the filter
			 string from the url (if there is one) in the
			 'params' property to our app component */}
			<Route path="/(:filter)"
				component={App}></Route>
		</Router>
	</Provider>,
	document.getElementsByClassName('todoapp')[0]
);
