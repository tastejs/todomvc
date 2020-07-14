export const newTodo = () =>
  JSON.parse(JSON.stringify({ title: "", status: "active", isEditing: false }))

export const model = {
  new: newTodo(),
  filter: "all",
  todos: [],
}

export const saveState = (mdl) =>
  localStorage.setItem("todos-mithril", JSON.stringify(mdl))

export const ESCAPE_KEY = 27
export const ENTER_KEY = 13
export const ROUTES = [
  { route: "/", filter: "all" },
  { route: "/active", filter: "active" },
  { route: "/completed", filter: "completed" },
]
