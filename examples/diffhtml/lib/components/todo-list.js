import { html } from 'diffhtml';

function encode(str) {
	return str.replace(/["&'<>`]/g, match => `&#${match.charCodeAt(0)};`);
}

export default function renderTodoList(props) {
	return props.todos.map(todo => html`
		<li key="${todo.key}" class="${this.getTodoClassNames(todo)}">
			<div class="view">
				<input class="toggle" type="checkbox" ${todo.completed ? 'checked' : ''}>
				<label>${encode(todo.title)}</label>
				<button class="destroy"></button>
			</div>

			<form class="edit-todo">
				<input
					onblur=${props.stopEditing}
					value="${encode(todo.title)}"
					class="edit">
			</form>
		</li>
	`);
}
