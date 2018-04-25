package todomvc

import japgolly.scalajs.react.component.Scala.Unmounted
import japgolly.scalajs.react.extra.OnUnmount
import japgolly.scalajs.react.extra.router._
import japgolly.scalajs.react.raw.ReactDOM
import org.scalajs.dom

import scala.scalajs.js.annotation.JSExport

object Main {
  val baseUrl: BaseUrl =
    BaseUrl(dom.window.location.href.takeWhile(_ != '#'))

  val routerConfig: RouterConfig[TodoFilter] =
    RouterConfigDsl[TodoFilter].buildConfig { dsl =>
      import dsl._

      /* how the application renders the list given a filter */
      def filterRoute(s: TodoFilter): Rule =
        staticRoute("#/" + s.link, s) ~> renderR(TodoList(model, s))

      val filterRoutes: Rule =
        TodoFilter.values.map(filterRoute).reduce(_ | _)

      /* build a final RouterConfig with a default page */
      filterRoutes.notFound(redirectToPage(TodoFilter.All)(Redirect.Replace))
    }

  /* instantiate model and restore todos */
  val model: TodoModel =
    new TodoModel(Storage(dom.ext.LocalStorage, "todos-scalajs-react"))

  model.restorePersisted.foreach(_.runNow())

  /** The router is itself a React component, which at this point is not mounted  */
  val router: Unmounted[Unit, Resolution[TodoFilter], OnUnmount.Backend] =
    Router(baseUrl, routerConfig.logToConsole)()

  /**
   * Main entry point, which the sbt plugin finds and makes the browser run.
   *
   * Takes the unmounted router component and gives to React,
   *  will render into the first element with `todoapp` class
   */
  @JSExport
  def main(args: Array[String]): Unit = {
    router.renderIntoDOM(dom.document.getElementsByClassName("todoapp")(0).asInstanceOf[ReactDOM.Container])
    ()
  }
}
