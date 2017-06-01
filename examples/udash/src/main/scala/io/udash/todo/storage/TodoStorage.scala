package io.udash.todo.storage

import org.scalajs.dom.ext.LocalStorage

case class Todo(title: String, completed: Boolean)

trait TodoStorage {
  def store(todo: Seq[Todo]): Unit
  def load(): Seq[Todo]
}

object LocalTodoStorage extends TodoStorage {
  import io.udash.rpc.DefaultClientUdashRPCFramework.{write, read}

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