import cx from "classnames";
import { h } from "preact";
import { useState, useEffect, useRef } from "preact/hooks";
export default function TodoItem({ onSave, onRemove, onToggle, todo, index }) {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);

    /**
     * useEffect keeps track of the 'editing' state change.
     * If the input field is present, we set focus programmatically.
     */
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
            inputRef.current.setSelectionRange(inputRef.current.value.length, inputRef.current.value.length);
        }
    }, [editing]);

    function handleSubmit(e) {
        const val = e.target.value.trim();
        if (val) {
            onSave(todo, val);
            setEditing(false);
        } else {
            onRemove(todo);
        }
    }

    function handleKeyDown(e) {
        if (e.key === "Escape") {
            // Reset before blur so the about-to-fire blur->handleSubmit
            // saves the original text (i.e. cancels).
            e.target.value = todo.title;
            setEditing(false);
        } else if (e.key === "Enter") {
            handleSubmit(e);
        }
    }

    function handleDoubleClick() {
        setEditing(true);
    }

    function handleToggle(e) {
        onToggle(todo);
        e.preventDefault();
    }

    function handleRemove() {
        onRemove(todo);
    }

    return (
        <li class={cx({ completed: todo.completed, editing })}>
            <div class="view">
                <input class="toggle" type="checkbox" checked={todo.completed} onChange={handleToggle} />
                <label onDblClick={handleDoubleClick}>{todo.title}</label>
                <button class="destroy" aria-label="Delete todo" onClick={handleRemove} />
            </div>
            {editing
                ? <input
                    class="edit"
                    aria-label="Edit todo"
                    ref={inputRef}
                    onBlur={handleSubmit}
                    onKeyDown={handleKeyDown}
                    defaultValue={todo.title}
                />
                : null}
        </li>
    );
}
