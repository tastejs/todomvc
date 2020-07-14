import m from "mithril";
let totalActiveTodos = (mdl) =>
  mdl.todos.filter((todo) => todo.status == "active").length;
let todosCompleted = (mdl) =>
  mdl.todos.filter((todo) => todo.status == "completed").length;

const Footer = {
  view: ({ attrs: { mdl } }) => {
    return m("footer.footer", [
      m("span.todo-count", [
        m(
          "strong",
          `${totalActiveTodos(mdl)} ${
            totalActiveTodos(mdl) == 1 ? "item" : "items"
          }`
        ),
      ]),
      m("ul.filters", [
        m(
          "li",
          m(
            "a[href='#!/']",
            { class: mdl.filter == "all" && "selected" },
            "All"
          )
        ),
        m(
          "li",
          m(
            "a[href='#!/active']",
            { class: mdl.filter == "active" && "selected" },
            "Active"
          )
        ),
        m(
          "li",
          m(
            "a[href='#!/completed']",
            { class: mdl.filter == "completed" && "selected" },
            "Completed"
          )
        ),
      ]),
      todosCompleted(mdl) >= 1 &&
        m(
          "button.clear-completed",
          { onclick: (_) => mdl.todos.map((todo) => (todo.status = "active")) },
          "Clear completed"
        ),
    ]);
  },
};

export default Footer;
