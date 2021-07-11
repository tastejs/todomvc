import { ENTER_KEY, ESCAPE_KEY, ITodoItemProps, ITodoItemState } from '../../model';
import * as classNames from 'classnames';
import * as React from 'react';
import { useState } from 'react';
import { BadgeComponent } from '../badge/BadgeComponent';
import styled from 'styled-components';
import { Utils } from '../../utils';

export const ToDoItemComponent = ({
	onSave,
	onDestroy,
	onEdit,
	onCancel,
	todo,
	onToggle,
	editing
}: ITodoItemProps) => {
	const [state, setState] = useState<ITodoItemState>({
		editText: `${todo.title} ${Utils.getLabelsFromArray(todo.badges)}`.trim()
	});

	const handleSubmit = () => {
		const newText = Utils.removeLabelsFromString(state.editText);
		if (newText) {
			onSave(newText, Utils.getLabelsFromString(state.editText));
			setState({ editText: state.editText.trim() });
		} else {
			onDestroy();
		}
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
			<ViewContainer isVisible={!editing}>
				<input
					className='toggle'
					type='checkbox'
					checked={todo.completed}
					onChange={onToggle}
				/>
				<label onDoubleClick={() => onEdit()}>{todo.title}</label>
				{!!todo.badges.length && (
					<BadgeListContainer>
						{todo.badges.map((badge, i) => (
							<BadgeContainer hasRightSpacing={i < todo.badges.length}>
								<BadgeComponent name={badge.name.replace('@', '')} />
							</BadgeContainer>
						))}
					</BadgeListContainer>
				)}
				<button className='destroy' onClick={onDestroy} />
			</ViewContainer>
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

const BadgeListContainer = styled.div`
	display: flex;
	justify-content: space-between;
	padding-right: 2rem;
`;

const BadgeContainer = styled.div<{ hasRightSpacing: boolean }>`
	margin: ${props => (props.hasRightSpacing ? 'auto 0.5rem auto 0' : 'auto 0')};
`;

const ViewContainer = styled.div<{ isVisible: boolean }>`
	display: ${props => (props.isVisible ? 'flex' : 'none')};
	justify-content: space-between;
	margin: auto 1rem;
`;
