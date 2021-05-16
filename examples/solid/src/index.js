import { render } from 'solid-js/web';
import App from './components/App';
import { TodosProvider } from './utils/store'
import * as serviceWorker from './serviceWorker';

import 'todomvc-common/base.css';
import 'todomvc-app-css/index.css';

render(() => (
	<TodosProvider>
		<App />
	</TodosProvider>
), document.querySelector('section.todoapp'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
