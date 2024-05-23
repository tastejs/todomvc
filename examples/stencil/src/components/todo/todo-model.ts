
export interface TodoItemModel {
  id: string, title: string, completed: boolean
}

export interface TodoModel {
  addTodo(val: string)
  todos: Array<TodoItemModel>
  toggle(todoId: string)
  destroy(todoId: string)
  save(todoId: string, text: string)
  toggleAll(checked: boolean)
  clearCompleted()
}
