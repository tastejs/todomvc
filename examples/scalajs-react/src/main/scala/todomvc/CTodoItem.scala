package todomvc

import japgolly.scalajs.react._
import japgolly.scalajs.react.extra.{Reusability, Px}
import japgolly.scalajs.react.vdom.prefix_<^._
import org.scalajs.dom.ext.KeyCode

object CTodoItem {

  case class Props (
    onToggle:        Callback,
    onDelete:        Callback,
    onStartEditing:  Callback,
    onUpdateTitle:   Title => Callback,
    onCancelEditing: Callback,
    todo:            Todo,
    isEditing:       Boolean
  )

  implicit val reusableProps = Reusability.fn[Props]((p1, p2) =>
    (p1.todo eq p2.todo) && (p1.isEditing == p2.isEditing)
  )

  case class State(editText: UnfinishedTitle)

  class Backend($: BackendScope[Props, State]) {
    case class Callbacks(P: Props) {
      val editFieldSubmit: Callback =
        $.state.flatMap(_.editText.validated.fold(P.onDelete)(P.onUpdateTitle))

      val resetText: Callback =
        $.modState(_.copy(editText = P.todo.title.editable))

      val editFieldKeyDown: ReactKeyboardEvent => Option[Callback] =
        e => e.nativeEvent.keyCode match {
          case KeyCode.Escape => Some(resetText >> P.onCancelEditing)
          case KeyCode.Enter  => Some(editFieldSubmit)
          case _              => None
        }
    }
    val cbs = Px.cbA($.props).map(Callbacks)

    val editFieldChanged: ReactEventI => Callback =
      e => $.modState(_.copy(editText = UnfinishedTitle(e.target.value)))

    def render(P: Props, S: State): ReactElement = {
      val cb = cbs.value()
      <.li(
        ^.classSet(
          "completed" -> P.todo.isCompleted,
          "editing"   -> P.isEditing
        ),
        <.div(
          ^.className := "view",
          <.input(
            ^.className := "toggle",
            ^.`type`    := "checkbox",
            ^.checked   := P.todo.isCompleted,
            ^.onChange --> P.onToggle
          ),
          <.label(
            P.todo.title.value,
            ^.onDoubleClick --> P.onStartEditing
          ),
          <.button(
            ^.className := "destroy",
            ^.onClick --> P.onDelete
          )
        ),
        <.input(
          ^.className   := "edit",
          ^.onBlur     --> cb.editFieldSubmit,
          ^.onChange   ==> editFieldChanged,
          ^.onKeyDown ==>? cb.editFieldKeyDown,
          ^.value       := S.editText.value
        )
      )
    }
  }

  val component = ReactComponentB[Props]("CTodoItem")
    .initialState_P(p => State(p.todo.title.editable))
    .renderBackend[Backend].build

  def apply(P: Props) =
    component.withKey(P.todo.id.id.toString)(P)
}
