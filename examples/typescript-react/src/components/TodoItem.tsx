import React, { useState, ChangeEvent, FormEvent, KeyboardEvent } from 'react';
import classNames from 'classnames';

interface ITodoItemProps {
  todo: ITodo;

  isEditing: boolean;

  onToggle: (event: ChangeEvent<HTMLInputElement>) => void;
  onEdit: (todo: ITodo) => void;
  onEditSubmission: (todo: ITodo, updatedTitle: string) => void;
  onEditCancel: (todo: ITodo) => void;
}

const TodoItem: React.FC<ITodoItemProps> = (props: ITodoItemProps) => {
  const { todo, isEditing, onEdit, onEditSubmission, onEditCancel } = props;
  const [editingStateText, setEditingStateText] = useState(todo.title);

  const handleLabelDoubleClick = () => {
    onEdit(todo);
    setEditingStateText(todo.title);
  };

  const handleEditInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const updatedValue = event.target.value;
    setEditingStateText(updatedValue);
  };

  const handleEditInputBlur = () => {
    onEditSubmission(todo, editingStateText);
  };

  const handleEditFormSubmission = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onEditSubmission(todo, editingStateText);
  };

  const handleEditInputKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      onEditCancel(todo);
    }
  };

  return (
    <li
      className={classNames({
        completed: todo.completed,
        editing: isEditing,
      })}
    >
      <div className="view">
        <input className="toggle" type="checkbox" checked={todo.completed} onChange={props.onToggle} />
        <label onDoubleClick={handleLabelDoubleClick}>{todo.title}</label>
      </div>
      {isEditing && (
        <form onSubmit={handleEditFormSubmission}>
          <input
            className="edit"
            value={editingStateText}
            onChange={handleEditInputChange}
            onBlur={handleEditInputBlur}
            onKeyUp={handleEditInputKeyUp}
            autoFocus
          />
        </form>
      )}
    </li>
  );
};

export default TodoItem;
