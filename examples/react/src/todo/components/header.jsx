import { useCallback } from "react";
import { Input } from "./input";
import { Search } from "./search";

import { ADD_ITEM } from "../constants";

export function Header({ dispatch, search, onSearchChange }) {
    const addItem = useCallback((title) => dispatch({ type: ADD_ITEM, payload: { title } }), [dispatch]);

    return (
        <header className="header" data-testid="header">
            <h1>todos</h1>
            <Input onSubmit={addItem} label="New Todo Input" placeholder="What needs to be done?" />
            <Search value={search} onChange={onSearchChange} />
        </header>
    );
}
