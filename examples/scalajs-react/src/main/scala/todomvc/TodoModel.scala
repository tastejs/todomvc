package todomvc

import japgolly.scalajs.react.Callback
import japgolly.scalajs.react.extra.Broadcaster

import scala.language.postfixOps

class TodoModel(storage: Storage) extends Broadcaster[Seq[Todo]] {
  private object State {
    var todos = Seq.empty[Todo]

    def mod(f: Seq[Todo] => Seq[Todo]): Callback = {
      val newTodos = f(todos)

      Callback(todos = newTodos) >>
      storage.store(newTodos)    >>
      broadcast(newTodos)
    }

    def modOne(Id: TodoId)(f: Todo => Todo): Callback =
      mod(_.map {
        case existing@Todo(Id, _, _) => f(existing)
        case other                   => other
      })
  }

  def restorePersisted: Option[Callback] =
    storage.load[Seq[Todo]].map(existing => State.mod(_ ++ existing))

  def addTodo(title: Title): Callback =
    State.mod(_ :+ Todo(TodoId.random, title, isCompleted = false))

  def clearCompleted: Callback =
    State.mod(_.filterNot(_.isCompleted))

  def delete(id: TodoId): Callback =
    State.mod(_.filterNot(_.id == id))

  def todos: Seq[Todo] =
    State.todos

  def toggleAll(checked: Boolean): Callback =
    State.mod(_.map(_.copy(isCompleted = checked)))

  def toggleCompleted(id: TodoId): Callback =
    State.modOne(id)(old => old.copy(isCompleted = !old.isCompleted))

  def update(id: TodoId, text: Title): Callback =
    State.modOne(id)(_.copy(title = text))
}
