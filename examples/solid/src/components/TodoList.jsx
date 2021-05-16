import { Switch, useContext } from "solid-js";
import { useRouter } from "../utils/router";
import { TodosContext } from '../utils/store';
import TodoItem from './TodoItem';

function TodoList() {
	const { matches } = useRouter();
	const [state] = useContext(TodosContext);

	return <ul className="todo-list">
		<Switch>
			<Match when={matches('')}>
				<For each={state.todos}>
					{todo => <TodoItem {...todo} />}
				</For>
			</Match>
			<Match when={matches('active')}>
				<For each={state.todos.filter(todo => !todo.completed)}>
					{todo => <TodoItem {...todo} />}
				</For>
			</Match>
			<Match when={matches('completed')}>
				<For each={state.todos.filter(todo => todo.completed)}>
					{todo => <TodoItem {...todo} />}
				</For>
			</Match>
		</Switch>
	</ul>
}

export default TodoList;
