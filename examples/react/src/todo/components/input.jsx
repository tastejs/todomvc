import { useCallback } from "react";

export function Input({ onSubmit, placeholder, label, defaultValue, onBlur, editing = false }) {
    const handleBlur = useCallback(
        (e) => {
            if (!onBlur) return;
            const value = e.target.value.trim();
            onBlur(value);
        },
        [onBlur]
    );

    const handleKeyDown = useCallback(
        (e) => {
            if (e.key !== "Enter") return;
            const value = e.target.value.trim();
            // For new-todo, ignore empty submits. For edit, an empty
            // submit means "delete this todo" — let the parent decide.
            if (!editing && value.length === 0) return;
            onSubmit(value);
            // Only clear the new-todo input on submit; the edit input is
            // about to unmount so leave it alone.
            if (!editing) e.target.value = "";
        },
        [onSubmit, editing]
    );

    return (
        <input
            className={editing ? "edit" : "new-todo"}
            type="text"
            data-testid="text-input"
            autoFocus
            aria-label={label}
            placeholder={placeholder}
            defaultValue={defaultValue}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
        />
    );
}
