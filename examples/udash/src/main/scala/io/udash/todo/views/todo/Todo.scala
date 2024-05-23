package io.udash.todo.views.todo

import io.udash.properties.HasModelPropertyCreator

case class TodoViewModel(todos: Seq[Todo], todosFilter: TodosFilter, newTodoName: String, toggleAllChecked: Boolean)
object TodoViewModel extends HasModelPropertyCreator[TodoViewModel]

case class Todo(name: String, completed: Boolean = false, editing: Boolean = false)
object Todo extends HasModelPropertyCreator[Todo]

sealed abstract class TodosFilter(val matcher: Todo => Boolean)
object TodosFilter {
  case object All extends TodosFilter(_ => true)
  case object Active extends TodosFilter(todo => !todo.completed)
  case object Completed extends TodosFilter(todo => todo.completed)
}