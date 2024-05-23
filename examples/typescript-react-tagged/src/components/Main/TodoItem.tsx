import * as React from 'react';

import { AppProps, Action, Todo, KEY_ENTER, KEY_ESCAPE } from '../../shared';

export interface TodoItemProps extends AppProps {
  item: Todo;
}

const TodoItemView = (p: TodoItemProps) =>
  <div className="view">
    <input
      className="toggle"
      type="checkbox"
      checked={p.item.completed}
      onChange={() => p.controller({ name: "todoToggle", id: p.item.id }) }
    />
    <label onDoubleClick={() => p.controller({ name: "todoEdit", id: p.item.id }) }>
      {p.item.title}
    </label>
    <button className="destroy" onClick={() => p.controller({ name: "todoDestroy", id: p.item.id })}></button>
  </div>;

const TodoItemEdit = (p: TodoItemProps) => {
  const handleKeyDown = (event : React.KeyboardEvent<any>) => {
    if (event.keyCode === KEY_ESCAPE) {
      p.controller({ name: "todoCancelEdit" });
    } else if (event.keyCode === KEY_ENTER) {
      p.controller({ name: "todoSubmit" });
    }
  };
  const handleChange = (event : React.FormEvent<any>) => {
    const input : any = event.target;
    p.controller({ name: "todoChange", text: input.value });
  };
  
  return (
    <input
      className="edit"
      value={p.todoEdit.title}
      onBlur={() => p.controller({ name: "todoSubmit" })}
      onChange={(e:any) => p.controller({ name: "todoChange", text: e.target.value }) }
      onKeyDown={e => handleKeyDown(e) }
    />
  );
};

export const TodoItem = (p: TodoItemProps) => {
  const editing = p.todoEdit && p.todoEdit.id===p.item.id;
  const cn = (p.item.completed?"completed":"") + (editing?" editing":""); 
  return (
    <li className={cn}>
      { editing ? <TodoItemEdit {...p} /> :  <TodoItemView {...p} />}
    </li>
  );
};
