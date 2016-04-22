import TodoApp from './components/todo-app';
import store from './redux/store';
import * as urlActions from './redux/actions/url';

const setHashState = hash => store.dispatch(urlActions.setHashState(hash));

// Create the application and mount.
TodoApp.create(document.querySelector('todo-app'));

// Set URL state.
setHashState(location.hash);

// Set URL state when hash changes.
window.onhashchange = e => setHashState(location.hash);
