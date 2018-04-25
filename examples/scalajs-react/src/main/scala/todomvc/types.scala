package todomvc

import java.util.UUID
import upickle.default._

case class TodoId(id: UUID)

object TodoId {
  def random = new TodoId(UUID.randomUUID)

  implicit def rw: ReadWriter[TodoId] = macroRW
}

case class Title(value: String) {
  def editable = UnfinishedTitle(value)
}

object Title {
  implicit def rw: ReadWriter[Title] = macroRW
}

case class UnfinishedTitle(value: String) {
  def validated: Option[Title] = Option(value.trim).filterNot(_.isEmpty).map(Title.apply)
}

case class Todo(id: TodoId, title: Title, isCompleted: Boolean)

object Todo {
  implicit def rw: ReadWriter[Todo] = macroRW
}

sealed abstract class TodoFilter(val link: String, val title: String, val accepts: Todo => Boolean)

object TodoFilter {
  object All       extends TodoFilter("",          "All",        _ => true)
  object Active    extends TodoFilter("active",    "Active",    !_.isCompleted)
  object Completed extends TodoFilter("completed", "Completed",  _.isCompleted)

  def values: List[TodoFilter] =
    List(All, Active, Completed)
}
