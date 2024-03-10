package io.udash.todo.storage

import org.scalajs.dom.ext.LocalStorage
import upickle.default._

case class Todo(title: String, completed: Boolean)
object Todo {
  implicit def rw: ReadWriter[Todo] = macroRW
}

trait TodoStorage {
  def store(todo: Seq[Todo]): Unit
  def load(): Seq[Todo]
}

object LocalTodoStorage extends TodoStorage {
  private val storage = LocalStorage
  private val namespace = "todos-udash"

  override def store(todos: Seq[Todo]): Unit =
    storage(namespace) = write(todos)

  def load(): Seq[Todo] = {
    storage(namespace) match {
      case Some(todos) =>
        read[Seq[Todo]](todos)
      case None =>
        Seq.empty
    }
  }
}