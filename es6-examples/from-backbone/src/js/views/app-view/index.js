import '@app-styles/todomvc-common/base.css';
import '@app-styles/todomvc-app-css/index.css';
import TodoStatsView from '@app-components/todo-stats';
import { createTodo, fetchTodos } from '@app-actions/todos'
/**
 * @author Jonmathon Hibbard
 * @license MIT
 */

const ENTER_KEY = 13;
const KEY_UP_EVENT_TYPE = 'keyup';

const show = el => el.style.display = 'block';
const hide = el => el.style.display = 'none';

class AppView {
	el = null
	TodoList = {}

	constructor(props = {}) {
		const { el } = props;

		this.el = el;

		const inputEl = this.el.querySelector('.new-todo');

		inputEl.addEventListener(KEY_UP_EVENT_TYPE, event => {
			if (event.isComposing || event.keyCode === 229) {
				return;
			}

			const inputValue = newTodoInputEl.value;

			if (event.which === ENTER_KEY && inputValue.trim()) {
				createTodo({
					title: inputValue
				}).then(() => {
					inputEl.value = '';

					this.render();
				});
			}
		});
	}

	render() {
		const mainEl = this.el.querySelector('.main');
		const footerEl = this.el.querySelector('.footer');
		const toggleAllEl = this.el.querySelector('#toggle-all');

		fetchTodos().then((todos = {}) => {
			this.TodoList = todos;

			const hasTodos = todos && todos.length !== 0;
			const remaining = this.TodoList.todos.filter(todo => !todo.completed).length;
			const completed = this.TodoList.todos.filter(todo => todo.completed).length;

			if (hasTodos) {
				show(mainEl);
				show(footerEl);

				footerEl.innerHTML = TodoStatsView({ completed, remaining });

				const filterLinks = this.el.querySelectorAll('.filters li a');

				filterLinks.forEach(filterLink => filterLink.classList.add('selected') );
			} else {
				hide(mainEl);
				hide(footerEl);
			}

			toggleAllEl.checked = !remaining;
		});
	}
};

export default AppView;
