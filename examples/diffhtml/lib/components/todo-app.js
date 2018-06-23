import { html } from 'diffhtml';
import Component from 'diffhtml-components/dist/es/component';
import PropTypes from 'prop-types';
import store from '../redux/store';
import * as todoAppActions from '../redux/actions/todo-app';
import TodoList from './todo-list';

export default class TodoApp extends Component {
	render() {
		const state = store.getState();
		const todoApp = state[this.props.reducer];
		const status = state.url.path.slice(1);
		const allTodos = todoApp.todos;
		const todos = todoApp.getByStatus(status);
		const activeTodos = todoApp.getByStatus('active');
		const completedTodos = todoApp.getByStatus('completed');

		localStorage['diffhtml-todos'] = JSON.stringify(allTodos);

		return html`
			<section class="todoapp"
				onsubmit=${this.onSubmitHandler}
				onclick=${this.onClickHandler}
				onkeydown=${this.handleKeyDown}
				ondblclick=${this.startEditing}
				onchange=${this.toggleCompletion}>

				<header class="header">
					<h1>todos</h1>

					<form class="add-todo">
						<input
							class="new-todo"
							placeholder="What needs to be done?"
							autofocus="">
					</form>
				</header>

				${allTodos.length && html`
					<section class="main">
            <input class="toggle-all" id="toggle-all" type="checkbox" ${this.setCheckedState()}>
            <label for="toggle-all">Mark all as complete</label>

						<ul class="todo-list">
							<${TodoList}
								stopEditing=${this.stopEditing}
								getTodoClassNames=${this.getTodoClassNames}
								todos=${todos}
							/>
						}</ul>
					</section>

					<footer class="footer">
						<span class="todo-count">
							<strong>${String(activeTodos.length)}</strong>
							${activeTodos.length == 1 ? ' item' : ' items'} left
						</span>

						<ul class="filters">
							<li>
								<a href="#/" class=${this.getNavClass('/')}>All</a>
							</li>
							<li>
								<a href="#/active" class=${this.getNavClass('/active')}>Active</a>
							</li>
							<li>
								<a href="#/completed" class=${this.getNavClass('/completed')}>Completed</a>
							</li>
						</ul>

						${completedTodos.length && html`
							<button class="clear-completed" onclick=${this.clearCompleted}>Clear completed</button>
						`}
					</footer>
				`}
			</section>

			<footer class="info">
				<p>Double-click to edit a todo</p>

				<p>
					Created by <a href="http://github.com/tbranyen">Tim Branyen</a>
					using <a href="http://diffhtml.org">diffHTML 1.0</a>
				</p>

				<p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
			</footer>
		`;
	}

	static propTypes = {
		reducer: PropTypes.string.isRequired
	}

	constructor(props) {
		super(props);

		this.unsubscribeStore = store.subscribe(() => this.forceUpdate());
	}

	addTodo = ev => {
		ev.preventDefault();

		const newTodo = ev.target.parentNode.querySelector('.new-todo');
		store.dispatch(todoAppActions.addTodo(newTodo.value));
		newTodo.value = '';
	}

	removeTodo = ev => {
		if (!ev.target.matches('.destroy')) { return; }

		const li = ev.target.parentNode.parentNode;

		store.dispatch(todoAppActions.removeTodo(li.key));
	}

	toggleCompletion = ev => {
		if (!ev.target.matches('.toggle')) { return; }

		const li = ev.target.parentNode.parentNode;

		store.dispatch(todoAppActions.toggleCompletion(li.key, ev.target.checked));
	}

	startEditing = ev => {
		if (!ev.target.matches('label')) { return; }

		const li = ev.target.parentNode.parentNode;

		store.dispatch(todoAppActions.startEditing(li.key));

		li.querySelector('form input').focus();
	}

	stopEditing = ev => {
		ev.preventDefault();

		const parentNode = ev.target.parentNode;
		const nodeName = parentNode.nodeName.toLowerCase();
		const li = nodeName === 'li' ? parentNode : parentNode.parentNode;
		const editTodo = li.querySelector('.edit');
		const text = editTodo.value.trim();

		if (text) {
			store.dispatch(todoAppActions.stopEditing(li.key, text));
		} else {
			store.dispatch(todoAppActions.removeTodo(li.key));
		}
	}

	clearCompleted = ev => {
		if (!ev.target.matches('.clear-completed')) { return; }

		store.dispatch(todoAppActions.clearCompleted());
	}

	toggleAll = ev => {
		if (!ev.target.matches('.toggle-all')) { return; }

		store.dispatch(todoAppActions.toggleAll(ev.target.checked));
	}

	handleKeyDown = ev => {
		if (!ev.target.matches('.edit, .new-todo')) { return; }

		switch (ev.keyCode) {
			case 27: {
				const todoApp = store.getState()[this.props.reducer];
				const li = ev.target.parentNode.parentNode;

				ev.target.value = todoApp.todos.find(todo => todo.key === li.key).title;

				this.stopEditing(ev);
				break;
			}

			case 13: {
				// Mock the submit handler.
				this.onSubmitHandler(Object.assign({}, ev, {
					preventDefault: () => ev.preventDefault(),
					target: ev.target.parentNode
				}));

				break;
			}
		}
	}

	onSubmitHandler = ev => {
		ev.preventDefault();

		if (ev.target.matches('.add-todo')) {
			this.addTodo(ev);
		} else if (ev.target.matches('.edit-todo')) {
			this.stopEditing(ev);
		}
	}

	onClickHandler = ev => {
		if (ev.target.matches('.destroy')) {
			this.removeTodo(ev);
		} else if (ev.target.matches('.toggle-all')) {
			this.toggleAll(ev);
		} else if (ev.target.matches('.clear-completed')) {
			this.clearCompleted(ev);
		}
	}

	getTodoClassNames = todo => {
		return [
			todo.completed ? 'completed' : '',
			todo.editing ? 'editing' : ''
		].filter(Boolean).join(' ');
	}

	setCheckedState = () => {
		const todoApp = store.getState()[this.props.reducer];
		const notChecked = todoApp.todos.filter(todo => !todo.completed).length;

		return notChecked ? '' : 'checked';
	}

	getNavClass = name => {
		const state = store.getState();
		const path = state.url.path;

		return path === name ? 'selected' : undefined;
	}
}
