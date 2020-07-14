import m from "mithril"
import { saveState, ENTER_KEY, ESCAPE_KEY } from "./model"

const Body = {
  view: ({ attrs: { mdl } }) => {
    console.log(m.route.get())
    return m("section.main", [
      m("input.toggle-all[id='toggle-all'][type='checkbox']", {
        checked: mdl.todos.filter((todo) => todo.status == "completed").length,
        onclick: (_) => {
          mdl.todos.map((todo) => (todo.status = "completed"))
          saveState(mdl)
        },
      }),
      m("label[for='toggle-all']", "Mark all as complete"),
      m(
        "ul.todo-list",
        mdl.todos
          .filter((todo) =>
            m.route.get() == "/"
              ? todo
              : todo.status == m.route.get().split("/")[1]
          )
          .map((todo, idx) =>
            m(
              `li.${todo.status}.${todo.isEditing && "editing"}`,
              { key: idx },
              [
                m("div.view", [
                  m("input.toggle[type='checkbox']", {
                    checked: todo.status == "completed",
                    value: todo.title,
                    onclick: () => {
                      todo.status == "active"
                        ? (todo.status = "completed")
                        : (todo.status = "active"),
                        saveState(mdl)
                    },
                  }),
                  m(
                    "label",
                    {
                      ondblclick: (_) => {
                        todo.isEditing = true
                        todo.newtitle = todo.title
                      },
                    },
                    `${todo.title}`
                  ),
                  m("button.destroy", {
                    onclick: () => {
                      mdl.todos.splice(idx, 1)
                      saveState(mdl)
                    },
                  }),
                ]),
                m("input.edit", {
                  onkeydown: (e) => {
                    if (e.which == ESCAPE_KEY) {
                      todo.isEditing = false
                    }
                    if (e.keyCode == ENTER_KEY) {
                      if (todo.newtitle.length) {
                        todo.isEditing = false
                        todo.title = todo.newtitle
                      } else {
                        mdl.todos.splice(idx, 1)
                      }
                      saveState(mdl)
                    }
                  },
                  oninput: (e) => (todo.newtitle = e.target.value),
                  value: todo.newtitle,
                }),
              ]
            )
          )
      ),
    ])
  },
}

export default Body
