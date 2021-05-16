import { createSignal } from "solid-js";
import { addTodo } from "../utils/store";

function NewTodoInput() {
	const [title, setTitle] = createSignal('')
	const onKeydown = (e) => {
		if(e.key !== 'Enter') return;
		addTodo(title());
		setTitle('');
	}
	return (
		<input
			type="text"
			className="new-todo"
			autofocus
			placeholder="What needs to be done?"
			onKeyDown={onKeydown}
			onInput={e => setTitle(e.target.value)}
			value={title()}
		/>
	);
}

export default NewTodoInput;
