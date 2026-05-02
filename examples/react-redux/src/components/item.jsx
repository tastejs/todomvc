import { memo, useState } from "react";
import classnames from "classnames";
import { useDispatch } from "react-redux";
import TextInput from "./text-input";
import { editTodo, deleteTodo, toggleTodo } from "../store";

function Item({ todo }) {
    const dispatch = useDispatch();
    const [editing, setEditing] = useState(false);

    const handleSave = (text) => {
        if (text.length === 0) dispatch(deleteTodo(todo.id));
        else dispatch(editTodo({ id: todo.id, text }));
        setEditing(false);
    };

    const handleCancel = () => setEditing(false);

    return (
        <li
            className={classnames({ completed: todo.completed, editing })}
            data-testid="todo-item"
        >
            <div className="view">
                <input
                    className="toggle"
                    type="checkbox"
                    data-testid="todo-item-toggle"
                    checked={todo.completed}
                    onChange={() => dispatch(toggleTodo(todo.id))}
                />
                <label onDoubleClick={() => setEditing(true)} data-testid="todo-item-label">
                    {todo.text}
                </label>
                <button
                    className="destroy"
                    data-testid="todo-item-button"
                    aria-label="Delete todo"
                    onClick={() => dispatch(deleteTodo(todo.id))}
                />
            </div>
            {editing && (
                <TextInput
                    text={todo.text}
                    editing
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            )}
        </li>
    );
}

export default memo(Item);
