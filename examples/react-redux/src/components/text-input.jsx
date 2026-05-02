import { useState } from "react";
import classnames from "classnames";

export default function TextInput({ onSave, text = "", placeholder, editing = false, newTodo = false }) {
    const [value, setValue] = useState(text);

    const handleSubmit = (e) => {
        if (e.key !== "Enter") return;
        onSave(e.target.value.trim());
        if (newTodo) setValue("");
    };

    const handleBlur = (e) => {
        // If this input is used in the Header, call onSave to create a new todo.
        if (!newTodo) onSave(e.target.value);
    };

    return (
        <input
            className={classnames({ edit: editing, "new-todo": newTodo })}
            type="text"
            data-testid="text-input"
            placeholder={placeholder}
            autoFocus
            value={value}
            onBlur={handleBlur}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleSubmit}
        />
    );
}
