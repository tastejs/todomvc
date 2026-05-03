import { memo, useState, useCallback } from "react";
import classnames from "classnames";

import { Input } from "./input";

import { TOGGLE_ITEM, REMOVE_ITEM, UPDATE_ITEM } from "../constants";

export const Item = memo(function Item({ todo, dispatch }) {
    const [isWritable, setIsWritable] = useState(false);
    const { title, completed, id } = todo;

    const toggleItem = useCallback(() => dispatch({ type: TOGGLE_ITEM, payload: { id } }), [dispatch, id]);
    const removeItem = useCallback(() => dispatch({ type: REMOVE_ITEM, payload: { id } }), [dispatch, id]);
    const updateItem = useCallback(
        (newTitle) => dispatch({ type: UPDATE_ITEM, payload: { id, title: newTitle } }),
        [dispatch, id]
    );

    const handleDoubleClick = useCallback(() => setIsWritable(true), []);

    const commitEdit = useCallback(
        (newTitle) => {
            // Only act once per edit session — Enter then blur would
            // otherwise dispatch twice.
            if (!isWritable) return;
            setIsWritable(false);
            if (newTitle.length === 0) removeItem();
            else updateItem(newTitle);
        },
        [isWritable, removeItem, updateItem]
    );

    return (
        <li className={classnames({ completed, editing: isWritable })} data-testid="todo-item">
            <div className="view">
                <input
                    className="toggle"
                    type="checkbox"
                    data-testid="todo-item-toggle"
                    checked={completed}
                    onChange={toggleItem}
                />
                <label data-testid="todo-item-label" onDoubleClick={handleDoubleClick}>
                    {title}
                </label>
                <button
                    className="destroy"
                    data-testid="todo-item-button"
                    aria-label="Delete todo"
                    onClick={removeItem}
                />
            </div>
            {isWritable && (
                <Input
                    editing
                    onSubmit={commitEdit}
                    onBlur={commitEdit}
                    label="Edit todo"
                    defaultValue={title}
                />
            )}
        </li>
    );
});
