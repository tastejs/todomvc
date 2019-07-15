import StateComponent from '@app-libs/state-component';
import AppComponent from './component';
import TodoItemContainer from './todo-item/container';
import { createTodo, fetchTodos } from '@app-actions/todos'
import { noop, ACTIVE_TODOS, ALL_TODOS, COMPLETED_TODOS } from '@app-constants';

const ENTER_KEY = 13;
const defaultProps = {
	el: null
};

class AppView extends StateComponent {
	events = {
		'input.new-todo keyup': 'handleNewTodoKeyDown',
		'input.new-todo change': 'handleChange',
		'#toggle-all': 'toggleAll'
	}

	constructor(props) {
		super(props);

		this.state = {
			nowShowing: ALL_TODOS,
			editing: null,
			newTodo: ''
		};
	}

	handleChange(event) {
		this.setState({
			newTodo: event.target.value
		});
	}

	handleNewTodoKeyDown(event) {
		if (event.keyCode !== ENTER_KEY) {
			return;
		}

		event.preventDefault();

		const val = this.state.newTodo.trim();

		if (val) {
			// this.props.model.addTodo(val);

			this.setState({
				newTodo: ''
			});
		}
	}

	toggleAll(event) {
		var checked = event.target.checked;

		// this.props.model.toggleAll(checked);
	}

	toggle(todoToToggle) {
		// this.props.model.toggle(todoToToggle);
	}

	destroy(todo) {
		// this.props.model.destroy(todo);
	}

	edit(todo) {
		this.setState({
			editing: todo.id
		});
	}

	save(todoToSave, text) {
		// this.props.model.save(todoToSave, text);

		this.setState({
			editing: null
		});
	}

	cancel() {
		this.setState({
			editing: null
		});
	}

	clearCompleted() {
		this.props.model.clearCompleted();
	}

	filterShownTodos(todos) {
		return todos.filter(todo => {
			switch (this.state.nowShowing) {
				case ACTIVE_TODOS:
					return !todo.completed;
				case COMPLETED_TODOS:
					return todo.completed;
				default:
					return true;
			}
		});
	}

	didRender() {
		this.props.el.querySelector('input.new-todo').focus();
	}

	render() {
		// const { todos } = this.props.model;
		const { todos } = [];
		const activeTodoCount = todos.reduce((accum, todo) => todo.completed ? accum : accum + 1);
		const completedCount = todos.length - activeTodoCount;
		const shownTodos = this.filterShownTodos();
		const todoItems = shownTodos.map(todo =>
			hocTodoItemContainer({
				todo,
				onToggle: this.toggle.bind(this, todo),
				onDestroy: this.destroy.bind(this, todo),
				onEdit: this.edit.bind(this, todo),
				editing: this.state.editing === todo.id,
				onSave: this.save.bind(this, todo),
				onCancel: this.cancel.bind(this)
			})
		);

		const { nowShowing, newTodo } = this.state;

		el.html = AppComponent({
			activeTodoCount,
			completedCount,
			todos,
			todoItems,
			nowShowing,
			newTodo,
			clearCompleted: this.clearCompleted.bind(this)
		});
	}
}

export default AppView;
