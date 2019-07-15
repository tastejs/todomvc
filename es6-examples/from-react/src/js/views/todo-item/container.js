import StateComponent from '@app-libs/state-component';
import TodoItemComponent from './component';
import { noop } from '@app-constants';

const ESCAPE_KEY = 27;
const ENTER_KEY = 13;

class TodoItemContainer extends StateComponent {
	events = {
		'input.edit blur': 'handleSubmit',
		'input.edit change': 'handleSubmit',
		'input.edit keyup': 'handleSubmit',
		'input.toggle change': 'onToggle',
		'label.todo-item-label dblclick': 'handleEdit'
	}

	defaultProps() {
		return {
			el: null,
			editing: false,
			todo: {},
			onCancel: noop,
			onSave: noop,
			onDestroy: noop,
			onEdit: noop,
			onToggle: noop
		};
	}

	constructor(props) {
		super(props);

		this.state = {
			editText: this.props.todo.title
		};
	}

	handleSubmit() {
		const val = this.state.editText.trim();

		if (val) {
			this.props.onSave(val);

			this.setState({
				editText: val
			});
		} else {
			this.props.onDestroy();
		}
	}

	handleEdit() {
		this.props.onEdit();

		this.setState({
			editText: this.props.todo.title
		});
	}

	handleKeyDown(event) {
		if (event.which === ESCAPE_KEY) {
			this.setState({
				editText: this.props.todo.title
			});

			this.props.onCancel(event);
		} else if (event.which === ENTER_KEY) {
			this.handleSubmit(event);
		}
	}

	handleChange(event) {
		if (this.props.editing) {
			this.setState({
				editText: event.target.value
			});
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (
			nextProps.todo !== this.props.todo ||
			nextProps.editing !== this.props.editing ||
			nextState.editText !== this.state.editText
		);
	}

	didRender(prevProps) {
		if (!prevProps.editing && this.props.editing) {
			const editInputEl = this.el.querySelector('input.edit');

			editInputEl.focus();
			editInputEl.setSelectionRange(node.value.length, node.value.length);
		}
	}

	render() {
		this.el.html = TodoItemComponent({
			...this.props
		});
	}
};

const hocTodoItemContainer = props => {
	const container = new TodoItemContainer(props);

	return container.render();
}

export default hocTodoItemContainer;
