package io.udash.todo

import io.udash.logging.CrossLogging
import io.udash.wrappers.jquery._
import org.scalajs.dom.Element

import scala.scalajs.js.annotation.JSExport

object JSLauncher extends CrossLogging {
  import ApplicationContext._

  @JSExport
  def main(args: Array[String]): Unit = {
    jQ((_: Element) => {
      jQ(".todoapp").get(0) match {
        case None =>
          logger.error("Application root element not found! Check your index.html file!")
        case Some(root) =>
          applicationInstance.run(root)
      }
    })
  }
}
