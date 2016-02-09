package io.udash.todo

import io.udash._
import io.udash.wrappers.jquery._
import org.scalajs.dom.{Element, document}

import scala.concurrent.ExecutionContextExecutor
import scala.scalajs.js.JSApp
import scala.scalajs.js.annotation.JSExport

object Context {
  private val routingRegistry: RoutingRegistryDef = new RoutingRegistryDef
  private val viewPresenterRegistry: StatesToViewPresenterDef = new StatesToViewPresenterDef
  implicit val applicationInstance: Application[RoutingState] =
    new Application[RoutingState](routingRegistry, viewPresenterRegistry, RootState)
  implicit val executionContext: ExecutionContextExecutor = scalajs.concurrent.JSExecutionContext.Implicits.queue
}

object Init extends JSApp with StrictLogging {

  import Context._

  @JSExport
  override def main(): Unit = {
    jQ(document).ready((_: Element) => {
      val appRoot = jQ(".todoapp").get(0)
      if (appRoot.isEmpty) logger.error("Application root element not found! Check your index.html file!")
      else applicationInstance.run(appRoot.get)
    })
  }
}
