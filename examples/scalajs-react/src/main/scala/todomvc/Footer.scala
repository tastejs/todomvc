package todomvc

import japgolly.scalajs.react._
import japgolly.scalajs.react.vdom.prefix_<^._
import org.scalajs.dom.html

object Footer {

  case class Props(
    filterLink:       TodoFilter => ReactTag,
    onClearCompleted: Callback,
    currentFilter:    TodoFilter,
    activeCount:      Int,
    completedCount:   Int
  )

  class Backend($: BackendScope[Props, Unit]) {
    def clearButton(P: Props): ReactTagOf[html.Button] =
      <.button(
        ^.className := "clear-completed",
        ^.onClick --> P.onClearCompleted,
        "Clear completed",
        (P.completedCount == 0) ?= ^.visibility.hidden
      )

    def filterLink(P: Props)(s: TodoFilter): ReactTagOf[html.LI] =
      <.li(
        P.filterLink(s)(
          s.title,
          (P.currentFilter == s) ?= (^.className := "selected")
        )
      )

    def render(P: Props): ReactTagOf[html.Element] =
      <.footer(
        ^.className := "footer",
        <.span(
          ^.className := "todo-count",
          <.strong(P.activeCount),
          s" ${if (P.activeCount == 1) "item" else "items"} left"
        ),
        <.ul(
          ^.className := "filters",
          TodoFilter.values map filterLink(P)
        ),
        clearButton(P)
      )
  }

  private val component =
    ReactComponentB[Props]("Footer")
      .stateless
      .renderBackend[Backend]
      .build

  def apply(P: Props): ReactElement =
    component(P)
}
