import { createEffect, createSignal, useContext } from "solid-js";
import { TodosContext } from "../utils/store";
import classNames from 'classnames';
import { onClickOutside } from '../utils/clickoutside'

function TodoItem(props) {
	const { editTodo, removeTodo, setIsTodoCompleted } = useContext(TodosContext)[1];
	const [isEditing, setIsEditing] = createSignal(false)
	const [newTitle, setNewTitle] = createSignal(props.title);

	const submit = () => (setIsEditing(false), editTodo(props.id, newTitle()));

	let ref;
	//onClickOutside(() => ref, submit);

	const onKeyDown = ev => {
		if(ev.key === 'Enter') submit();
		else if(ev.key === 'Escape') {
			setIsEditing(false);
			setNewTitle(props.title);
		}
	}

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
		<input
			ref={ref}
			class="edit"
			value={newTitle()}
			onInput={e => setNewTitle(e.currentTarget.value)}
			onKeyDown={onKeyDown}
			onBlur={submit}
		/>
	</li>
}

export default TodoItem;
