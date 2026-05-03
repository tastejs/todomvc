import { useState, useRef } from "react";
import classnames from "classnames";

export default function TextInput({
    onSave,
    onCancel,
    text = "",
    placeholder,
    editing = false,
    newTodo = false,
}) {
    const [value, setValue] = useState(text);
    const cancelled = useRef(false);

    const submit = () => {
        if (cancelled.current) {
            cancelled.current = false;
            return;
        }
        onSave(value.trim());
        if (newTodo) setValue("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            submit();
        } else if (e.key === "Escape" && editing && onCancel) {
            cancelled.current = true;
            onCancel();
        }
    };

    const handleBlur = () => {
        if (!newTodo) submit();
    };

    return (
        <input
            className={classnames({ edit: editing, "new-todo": newTodo })}
            type="text"
            data-testid="text-input"
            placeholder={placeholder}
            aria-label={editing ? "Edit todo" : "New todo"}
            autoFocus
            value={value}
            onBlur={handleBlur}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
        />
    );
}
