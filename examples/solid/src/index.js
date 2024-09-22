import { render } from 'solid-js/web';
import App from './components/App';
import { TodosProvider } from './utils/store';

render(() => (
	<TodosProvider>
		<App />
	</TodosProvider>
), document.querySelector('section.todoapp'));
