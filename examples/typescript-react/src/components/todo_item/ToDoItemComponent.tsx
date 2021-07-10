import { ENTER_KEY, ESCAPE_KEY, ITodoItemProps, ITodoItemState } from '../../model';
import * as classNames from 'classnames';
import * as React from 'react';
import { useState } from 'react';

export const ToDoItemComponent = ({
	onSave,
	onDestroy,
	onEdit,
	onCancel,
	todo,
	onToggle,
	editing
}: ITodoItemProps) => {
	const [state, setState] = useState<ITodoItemState>({ editText: todo.title });

	const handleSubmit = () => {
		const val = state.editText.trim();
		if (val) {
			onSave(val);
			setState({ editText: val });
		} else {
			onDestroy();
		}
	};

	const handleEdit = () => {
		onEdit();
		setState({ editText: todo.title });
	};

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.keyCode === ESCAPE_KEY) {
			setState({ editText: todo.title });
			onCancel(event);
		} else if (event.keyCode === ENTER_KEY) {
			handleSubmit();
		}
	};

	const handleChange = (event: React.FormEvent) => {
		const input: any = event.target;
		setState({ editText: input.value });
	};

	return (
		<li
			className={classNames({
				completed: todo.completed,
				editing: editing
			})}
		>
			<div className='view'>
				<input
					className='toggle'
					type='checkbox'
					checked={todo.completed}
					onChange={onToggle}
				/>
				<label onDoubleClick={() => handleEdit()}>{todo.title}</label>
				<button className='destroy' onClick={onDestroy} />
			</div>
			<input
				className='edit'
				value={state.editText}
				onBlur={() => handleSubmit()}
				onChange={e => handleChange(e)}
				onKeyDown={e => handleKeyDown(e)}
			/>
		</li>
	);
};
