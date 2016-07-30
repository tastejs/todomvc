package todomvc

import java.util.UUID

case class TodoId(id: UUID)

object TodoId {
  def random = new TodoId(UUID.randomUUID)
}

case class Title(value: String) {
  def editable = UnfinishedTitle(value)
}

case class UnfinishedTitle(value: String) {
  def validated: Option[Title] = Option(value.trim).filterNot(_.isEmpty).map(Title)
}

case class Todo(id: TodoId, title: Title, isCompleted: Boolean)

sealed abstract class TodoFilter(val link: String, val title: String, val accepts: Todo => Boolean)

object TodoFilter {
  object All       extends TodoFilter("",          "All",        _ => true)
  object Active    extends TodoFilter("active",    "Active",    !_.isCompleted)
  object Completed extends TodoFilter("completed", "Completed",  _.isCompleted)

  def values: List[TodoFilter] =
    List(All, Active, Completed)
}
