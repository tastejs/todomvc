import { createEffect, createSignal, useContext } from "solid-js";
import { TodosContext } from "../utils/store";
import classNames from 'classnames';
import { onClickOutside } from '../utils/clickoutside'

function TodoItem(props) {
	const { editTodo, removeTodo, setIsTodoCompleted } = useContext(TodosContext)[1];

	const [isEditing, setIsEditing] = createSignal(false)
	let ref;

	onClickOutside(() => ref, () => setIsEditing(false));

  return <li class={classNames({ completed: props.completed, editing: isEditing()})} onDblClick={() => setIsEditing(true)}>
		<div class="view">
			<input
				class="toggle"
				type="checkbox"
				checked={props.completed}
				onChange={e => setIsTodoCompleted(props.id, e.target.checked)}
			/>
			<label>{props.title}</label>
			<button class="destroy" onClick={() => removeTodo(props.id)}></button>
		</div>
		<input ref={ref} class="edit" value={props.title} onInput={e => editTodo(props.id, e.currentTarget.value)} />
	</li>
}

export default TodoItem;
