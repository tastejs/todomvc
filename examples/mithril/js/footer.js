import m from "mithril"
import { ROUTES } from "./model"

let totalActiveTodos = (mdl) =>
  mdl.todos.filter((todo) => todo.status == "active").length
let todosCompleted = (mdl) =>
  mdl.todos.filter((todo) => todo.status == "completed").length

const Footer = {
  view: ({ attrs: { mdl } }) =>
    m("footer.footer", [
      m("span.todo-count", [
        m(
          "strong",
          `${totalActiveTodos(mdl)} ${
            totalActiveTodos(mdl) == 1 ? "item" : "items"
          }`
        ),
      ]),
      m(
        "ul.filters",

        ROUTES.map(({ route, filter }) =>
          m(
            "li",
            m(
              m.route.Link,
              {
                class: m.route.get() == route && "selected",
                href: route,
              },
              filter
            )
          )
        )
      ),
      todosCompleted(mdl) >= 1 &&
        m(
          "button.clear-completed",
          { onclick: (_) => mdl.todos.map((todo) => (todo.status = "active")) },
          "Clear completed"
        ),
    ]),
}

export default Footer
