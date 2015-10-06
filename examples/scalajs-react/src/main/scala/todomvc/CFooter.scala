package todomvc

import japgolly.scalajs.react.ScalazReact._
import japgolly.scalajs.react._
import japgolly.scalajs.react.vdom.prefix_<^._

import scalaz.effect.IO
import scalaz.syntax.std.list._
import scalaz.syntax.std.string._

object CFooter {

  case class Props private[CFooter](
    filterLink:       TodoFilter => ReactTag,
    onClearCompleted: IO[Unit],
    currentFilter:    TodoFilter,
    activeCount:      Int,
    completedCount:   Int
  )

  case class Backend($: BackendScope[Props, Unit]) {
    val clearButton =
      <.button(^.className := "clear-completed", ^.onClick ~~> $.props.onClearCompleted, "Clear completed")

    def filterLink(s: TodoFilter) =
      <.li($.props.filterLink(s)(($.props.currentFilter == s) ?= (^.className := "selected"), s.title))

    def withSpaces(ts: TagMod*) =
      ts.toList.intersperse(" ")

    def render =
      <.footer(
        ^.className := "footer",
        <.span(
          ^.className := "todo-count",
          withSpaces(<.strong($.props.activeCount), "item" plural $.props.activeCount, "left")
        ),
        <.ul(
          ^.className := "filters",
          withSpaces(TodoFilter.values map filterLink)
        ),
        clearButton(($.props.completedCount == 0) ?= ^.visibility.hidden)
      )
  }

  private val component = ReactComponentB[Props]("CFooter")
    .stateless
    .backend(Backend)
    .render(_.backend.render)
    .build

  def apply(filterLink:      TodoFilter => ReactTag,
            onClearCompleted:IO[Unit],
            currentFilter:   TodoFilter,
            activeCount:     Int,
            completedCount:  Int) =

    component(
      Props(
        filterLink       = filterLink,
        onClearCompleted = onClearCompleted,
        currentFilter    = currentFilter,
        activeCount      = activeCount,
        completedCount   = completedCount
      )
    )
}
