package todomvc

import japgolly.scalajs.react._
import japgolly.scalajs.react.extra.router2._
import org.scalajs.dom

import scala.scalajs.js.JSApp
import scala.scalajs.js.annotation.JSExport
import scalaz.std.list._
import scalaz.syntax.foldable._

object Main extends JSApp {
  val baseUrl = BaseUrl(dom.window.location.href.takeWhile(_ != '#'))

  val routerConfig: RouterConfig[TodoFilter] = RouterConfigDsl[TodoFilter].buildConfig { dsl =>
    import dsl._

    /* how the application renders the list given a filter */
    def filterRoute(s: TodoFilter): Rule = staticRoute("#/" + s.link, s) ~> renderR(CTodoList(model, s))

    /** Combine routes for all filters using the Monoid instance for `Rule`.
      * This could have been written out as
      * `filterRoute(TodoFilter.All) | filterRoute(TodoFilter.Active) | filterRoute(TodoFilter.Completed)`
      */
    val filterRoutes: Rule = (TodoFilter.values map filterRoute).suml
    
    /* build a final RouterConfig with a default page */
    filterRoutes.notFound(redirectToPage(TodoFilter.All)(Redirect.Replace))
  }

  /* instantiate model and restore todos */
  val model = new TodoModel(Storage(dom.ext.LocalStorage, "todos-scalajs-react"))

  model.restorePersisted.foreach(_.unsafePerformIO())

  /** The router is itself a React component, which at this point is not mounted (U-suffix) */
  val router: ReactComponentU[Unit, Resolution[TodoFilter], Any, TopNode] =
    Router(baseUrl, routerConfig.logToConsole)()

  /**
   * Main entry point, which the sbt plugin finds and makes the browser run.
   *
   * Takes the unmounted router component and gives to React,
   *  will render into the first element with `todoapp` class
   */
  @JSExport
  override def main() =
    React.render(router, dom.document.getElementsByClassName("todoapp")(0))
}
