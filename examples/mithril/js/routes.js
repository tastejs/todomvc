import m from "mithril";

import Header from "./header";
import Body from "./body";
import Footer from "./footer";

const Layout = {
  view: ({ attrs: { mdl } }) =>
    m("section.todoapp", [
      m(Header, { mdl }),
      mdl.todos.length >= 1 && [m(Body, { mdl }), m(Footer, { mdl })],
    ]),
};

const Routes = (mdl) => ({
  "/": {
    onmatch: () => (mdl.filter = "all"),
    render: () => m(Layout, { mdl }),
  },
  "/active": {
    onmatch: () => (mdl.filter = "active"),
    render: () => m(Layout, { mdl }),
  },
  "/completed": {
    onmatch: () => (mdl.filter = "completed"),
    render: () => m(Layout, { mdl }),
  },
});

export default Routes;
