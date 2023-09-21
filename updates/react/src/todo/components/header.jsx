import { useCallback } from "react";
import { Input } from "./input";

export function Header({ dispatch }) {
    const addItem = useCallback((title) => dispatch({ type: "ADD_ITEM", payload: { title } }), [dispatch]);

    return (
        <header className="header" data-testid="header">
            <h1>todos</h1>
            <Input onSubmit={addItem} label="New Todo Input" placeholder="What needs to be done?" />
        </header>
    );
}
