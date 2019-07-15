import FooterComponent from './footer';
import { noop } from '@app-constants';

const defaultProps = {
	activeTodoCount: 0,
	clearCompleted: noop,
	completedCount: 0,
	newTodo: '',
	nowShowing: '',
	todoItems: [],
	todos: []
};

const AppComponent = props => {
	const { activeTodoCount, clearCompleted, completedCount, newTodo, nowShowing, todoItems, todos } = { ...defaultProps, ...props };
	const main = (!todos || !todos.length) ? '' : `
		<section className="main">
			<input
				id="toggle-all"
				class="toggle-all"
				type="checkbox"
				checked=${ !activeTodoCount }
			/>
			<label for="toggle-all" />
			<ul class="todo-list">
				${ todoItems }
			</ul>
		</section>
	`;

	return `
		<div>
			<header className="header">
				<h1>todos</h1>
				<input
					class="new-todo"
					placeholder="What needs to be done?"
					value=${ newTodo }
				/>
			</header>
			${ main }
			${
				FooterComponent({
					count: activeTodoCount,
					completedCount: completedCount,
					nowShowing: nowShowing,
					onClearCompleted: clearCompleted
				})
			}
		</div>
	`;
};

export default AppComponent;
