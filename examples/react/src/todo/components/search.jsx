import { useCallback } from "react";

export function Search({ value, onChange }) {
    const handleChange = useCallback((e) => onChange(e.target.value), [onChange]);

    return (
        <input
            className="search-input"
            type="text"
            data-testid="search-input"
            aria-label="Search todos"
            placeholder="Search todos..."
            value={value}
            onChange={handleChange}
        />
    );
}
