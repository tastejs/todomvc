import {
	ENTER_KEY,
	IAppProps,
	IAppState,
	IFooterItem,
	ITodo,
	TodoType
} from './model';
import { FooterComponent, ToDoItemComponent } from './components';

declare var Router;
import * as React from 'react';
import { useEffect, useState } from 'react';

const footerItems: IFooterItem[] = [
	{ href: '#/', type: TodoType.ALL_TODOS, label: 'All' },
	{ href: '#/active', type: TodoType.ACTIVE_TODOS, label: 'Active' },
	{ href: '#/completed', type: TodoType.COMPLETED_TODOS, label: 'Completed' }
];

export const AppComponent = ({ model }: IAppProps) => {
	const [state, setState] = useState<IAppState>({
		nowShowing: TodoType.ALL_TODOS,
		editing: null
	});

	const [currentInputValue, setCurrentInputValue] = useState<string>('');

	const handleChange = (event: React.FormEvent) => {
		const input: any = event.target;
		setCurrentInputValue(input.value);
	};

	useEffect(() => {
		const router = Router({
			'/': setState.bind(this, { nowShowing: TodoType.ALL_TODOS }),
			'/active': setState.bind(this, { nowShowing: TodoType.ACTIVE_TODOS }),
			'/completed': setState.bind(this, { nowShowing: TodoType.COMPLETED_TODOS })
		});
		router.init('/');
	}, []);

	const handleNewTodoKeyDown = (event: React.KeyboardEvent) => {
		if (event.keyCode !== ENTER_KEY) {
			return;
		}
		event.preventDefault();

		if (currentInputValue) {
			model.addTodo(currentInputValue);
			setCurrentInputValue('');
		}
	};

	const toggleAll = (event: React.FormEvent) => {
		const target: any = event.target;
		const checked = target.checked;
		model.toggleAll(checked);
	};

	const toggle = (todoToToggle: ITodo) => {
		model.toggle(todoToToggle);
	};

	const destroy = (todo: ITodo) => {
		model.destroy(todo);
	};

	const edit = (todo: ITodo) => {
		setState({ editing: todo.id });
	};

	const save = (todoToSave: ITodo, text: String) => {
		model.save(todoToSave, text);
		setState({ editing: null });
	};

	const cancel = () => {
		setState({ editing: null });
	};

	const shownTodos = model.todos.filter(todo => {
		switch (state.nowShowing) {
			case TodoType.ACTIVE_TODOS:
				return !todo.completed;
			case TodoType.COMPLETED_TODOS:
				return todo.completed;
			default:
				return true;
		}
	});

	const activeTodoCount = model.todos.reduce((accum, todo) => {
		return todo.completed ? accum : accum + 1;
	}, 0);

	const completedCount = model.todos.length - activeTodoCount;

	return (
		<div>
			<header className='header'>
				<h1>todos</h1>
				<input
					className='new-todo'
					placeholder='What needs to be done?'
					value={currentInputValue}
					onKeyDown={e => handleNewTodoKeyDown(e)}
					autoFocus={true}
					onChange={handleChange}
				/>
			</header>
			{!!model.todos.length && (
				<section className='main'>
					<input
						id='toggle-all'
						className='toggle-all'
						type='checkbox'
						onChange={e => toggleAll(e)}
						checked={activeTodoCount === 0}
					/>
					<label htmlFor='toggle-all'>Mark all as complete</label>
					<ul className='todo-list'>
						{shownTodos.map(todo => (
							<ToDoItemComponent
								key={todo.id}
								todo={todo}
								onToggle={toggle.bind(this, todo)}
								onDestroy={destroy.bind(this, todo)}
								onEdit={edit.bind(this, todo)}
								editing={state.editing === todo.id}
								onSave={save.bind(this, todo)}
								onCancel={() => cancel()}
							/>
						))}
					</ul>
				</section>
			)}
			{!!(activeTodoCount || completedCount) && (
				<FooterComponent
					items={footerItems}
					count={activeTodoCount}
					completedCount={completedCount}
					nowShowing={state.nowShowing}
					onClearCompleted={() => model.clearCompleted()}
				/>
			)}
		</div>
	);
};
