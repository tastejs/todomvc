import React from 'react';
import classNames from 'classnames';
import {ESCAPE_KEY, ENTER_KEY} from './constants';

class TodoItem extends React.Component {
	constructor(props) {
		super(props);
		this.state = {editText: this.props.todo.title};
		this.textInput = null;
	}

	handleSubmit() {
		let val = !!this.state.editText ? this.state.editText.trim() : null;
		if (val) {
			this.props.onSave(val);
			this.setState({editText: val});
		} else {
			this.props.onDestroy();
		}
	}

	handleEdit() {
		this.props.onEdit();
		this.setState({editText: this.props.todo.title});
	}

	handleKeyDown(event) {
		if (event.which === ESCAPE_KEY) {
			this.setState({editText: this.props.todo.title});
			this.props.onCancel(event);
		} else if (event.which === ENTER_KEY) {
			this.handleSubmit(event);
		}
	}

	handleChange(event) {
		if (this.props.editing) {
			this.setState({editText: event.target.value});
		}
	}

	componentDidUpdate(prevProps) {
		if (!prevProps.editing && this.props.editing && this.textInput) {
			this.textInput.focus();
		}
	}

	render() {
		return (
			<li className={classNames({
				completed: this.props.todo.completed,
				editing: this.props.editing
			})}>
				<div className='view'>
					<input
						className='toggle'
						type='checkbox'
						checked={this.props.todo.completed}
						onChange={() => this.props.onToggle()}
					/>
					<label onDoubleClick={() => this.handleEdit()}>
						{this.props.todo.title}
					</label>
					<button className='destroy' onClick={(e) => this.props.onDestroy(e)}/>
				</div>
				<input
					className='edit'
					ref={input => this.textInput = input}
					value={this.state.editText}
					onBlur={() => this.handleSubmit()}
					onChange={e => this.handleChange(e)}
					onKeyDown={e => this.handleKeyDown(e)}
				/>
			</li>
		);
	}
}

export default TodoItem;
