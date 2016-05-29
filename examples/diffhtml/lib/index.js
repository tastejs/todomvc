import { use, html, innerHTML } from 'diffhtml';
import inlineTransitions from 'diffhtml-middleware-inline-transitions';
import TodoApp from './components/todo-app';
import store from './redux/store';
import * as urlActions from './redux/actions/url';

use(inlineTransitions());

const setHashState = hash => store.dispatch(urlActions.setHashState(hash));

// Link the Component to the DOM.
const mount = document.querySelector('todo-app');
innerHTML(mount, html`<${TodoApp} reducer="todoApp" />`);

// Set URL state when hash changes.
window.onhashchange = e => setHashState(location.hash);
