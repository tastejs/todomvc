import m from "mithril"
import Header from "./header"
import Body from "./body"
import Footer from "./footer"
import { ROUTES } from "./model"

const Layout = {
  view: ({ attrs: { mdl } }) =>
    m("section.todoapp", [
      m(Header, { mdl }),
      mdl.todos.length >= 1 && [m(Body, { mdl }), m(Footer, { mdl })],
    ]),
}

const Routes = (mdl) =>
  ROUTES.reduce((routes, { route }) => {
    routes[route] = {
      render: () => m(Layout, { mdl }),
    }
    return routes
  }, {})

export default Routes
