import { For, Show, useContext } from 'solid-js';
import { TodosContext } from '../utils/store';
import { Router } from '../utils/router';
import NewTodoInput from './NewTodoInput';
import TodoList from './TodoList';
import Footer from './Footer';

function App() {
	const isAllComplete = () => state.todos.every(todo => todo.completed);
	const [state, { toggleCompleted }] = useContext(TodosContext);

  return (
		<>
			<header className="header">
				<h1>todos</h1>
				<NewTodoInput />
			</header>
			<section className="main">
				<input id="toggle-all" class="toggle-all" type="checkbox" checked={isAllComplete()} onChange={toggleCompleted} />
				<label for="toggle-all">Mark all as complete</label>
				<Router>
					<ul className="todo-list">
						<TodoList />
					</ul>
					<Show when={state.todos.length > 0}>
						<Footer />
					</Show>
				</Router>
			</section>
		</>
  );
}

export default App;
