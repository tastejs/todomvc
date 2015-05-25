package todomvc

import japgolly.scalajs.react.extra.Broadcaster

import scala.language.postfixOps
import scalaz.effect.IO

class TodoModel(storage: Storage) extends Broadcaster[Seq[Todo]] {
  private object State {
    var todos = Seq.empty[Todo]

    def mod(f: Seq[Todo] => Seq[Todo]): IO[Unit] =
      IO {
        val newTodos = f(todos)
        todos = newTodos
        storage.store(newTodos)
        broadcast(newTodos)
      }

    def modOne(Id: TodoId)(f: Todo => Todo): IO[Unit] =
      mod(_.map {
        case existing@Todo(Id, _, _) => f(existing)
        case other                   => other
      })
  }

  def restorePersisted =
    storage.load[Seq[Todo]].map(existing => State.mod(_ ++ existing))

  def addTodo(title: Title): IO[Unit] =
    State.mod(_ :+ Todo(TodoId.random, title, isCompleted = false))

  def clearCompleted: IO[Unit] =
    State.mod(_.filterNot(_.isCompleted))

  def delete(id: TodoId): IO[Unit] =
    State.mod(_.filterNot(_.id == id))

  def todos: Seq[Todo] =
    State.todos

  def toggleAll(checked: Boolean): IO[Unit] =
    State.mod(_.map(_.copy(isCompleted = checked)))

  def toggleCompleted(id: TodoId): IO[Unit] =
    State.modOne(id)(old => old.copy(isCompleted = !old.isCompleted))

  def update(id: TodoId, text: Title): IO[Unit] =
    State.modOne(id)(_.copy(title = text))
}
