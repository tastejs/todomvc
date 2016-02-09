package io.udash.todo.views.todo

case class Todo(name: String, editName: String = "", completed: Boolean = false, editing: Boolean = false)

sealed abstract class TodoFilter(val predicate: Todo => Boolean)

object TodoFilter {
  case object All extends TodoFilter(_ => true)
  case object Active extends TodoFilter(todo => !todo.completed)
  case object Completed extends TodoFilter(_.completed)
}

trait TodoViewModel {
  def todos: Seq[Todo]
  def todosFilter: TodoFilter
  def newTodoName: String
}