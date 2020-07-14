import m from "mithril";

import { newTodo, saveState, ENTER_KEY } from "./model";

const Header = {
  view: ({ attrs: { mdl } }) =>
    m("header.header", [
      m("h1", "todos"),
      m("input.new-todo[placeholder='What needs to be done?'][autofocus]", {
        onkeydown: (e) => {
          if (e.keyCode == ENTER_KEY && mdl.new.title.length >= 1) {
            mdl.new.title.trim();
            mdl.todos.push(mdl.new);
            mdl.new = newTodo();
            saveState(mdl);
          }
        },
        oninput: (e) => (mdl.new.title = e.target.value),
        value: mdl.new.title,
      }),
    ]),
};

export default Header;
