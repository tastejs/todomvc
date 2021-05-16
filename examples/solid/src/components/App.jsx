import { For, Show, useContext } from 'solid-js';
import { TodosContext } from '../utils/store';
import NewTodoInput from './NewTodoInput';
import TodoItem from './TodoItem';
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
				<ul className="todo-list">
					<For each={state.todos}>
						{todo => <TodoItem {...todo} />}
					</For>
				</ul>
				<Show when={state.todos.length > 0}>
					<Footer />
				</Show>
			</section>
		</>
  );
}

export default App;
