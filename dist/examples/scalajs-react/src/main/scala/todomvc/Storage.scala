package todomvc

import japgolly.scalajs.react.Callback
import org.scalajs.dom
import upickle.default._

import scala.util.{Failure, Success, Try}

case class Storage(storage: dom.ext.Storage, namespace: String) {
  def store[T: Writer](data: T): Callback =
    Callback(storage(namespace) = write(data))

  def load[T: Reader]: Option[T] =
    Try(storage(namespace) map read[T]) match {
      case Success(Some(t)) => Some(t)
      case Success(None)    => None
      case Failure(th)      =>
        dom.console.error(s"Got invalid data ${th.getMessage}")
        None
    }
}
