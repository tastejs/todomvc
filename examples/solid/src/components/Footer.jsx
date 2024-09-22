import { Show, useContext } from "solid-js";
import { useRouter } from "../utils/router";
import { TodosContext } from "../utils/store"

function Footer() {
	const [state, { clearCompleted }] = useContext(TodosContext);
	const { matches } = useRouter();

	const count = () => state.todos.filter(todo => !todo.completed).length;
	const completedExists = () => state.todos.some(todo => todo.completed);

	return <footer class="footer">
		<span class="todo-count"><strong>{count()}</strong> item left</span>
		<ul class="filters">
			<li>
				<a class={matches('') && 'selected'} href="#/">All</a>
			</li>
			<li>
				<a class={matches('active') && 'selected'} href="#/active">Active</a>
			</li>
			<li>
				<a class={matches('completed') && 'selected'} href="#/completed">Completed</a>
			</li>
		</ul>
		<Show when={completedExists()}>
			<button class="clear-completed" onClick={clearCompleted}>Clear completed</button>
		</Show>
	</footer>
}

export default Footer;
