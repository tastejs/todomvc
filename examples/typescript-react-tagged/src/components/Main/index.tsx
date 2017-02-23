import * as React from 'react';

import { AppProps } from '../../shared';
import { TodoItems } from './TodoItems';

export const Main = (p: AppProps) =>
  p.todos.length > 0
  ? (
  <section className="main">
    <input
      className="toggle-all"
      type="checkbox"
      onChange={ (e:any) => { p.controller({ name: "toggleAll", checked: e.target.checked }); } }
      checked={p.todos.filter(x=>!x.completed).length === 0}
    />
    <TodoItems {...p} />
  </section>
  ) : null;
