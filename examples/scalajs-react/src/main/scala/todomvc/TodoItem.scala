package todomvc

import japgolly.scalajs.react._
import japgolly.scalajs.react.extra.{Px, Reusability}
import japgolly.scalajs.react.vdom.TagOf
import japgolly.scalajs.react.vdom.html_<^._
import org.scalajs.dom.ext.KeyCode
import org.scalajs.dom.html
import org.scalajs.dom.html.{Input, LI}

object TodoItem {

  case class Props (
    onToggle:        Callback,
    onDelete:        Callback,
    onStartEditing:  Callback,
    onUpdateTitle:   Title => Callback,
    onCancelEditing: Callback,
    todo:            Todo,
    isEditing:       Boolean
  )

  implicit val reusableProps: Reusability[Props] =
    Reusability[Props]((p1, p2) =>
      (p1.todo eq p2.todo) && (p1.isEditing == p2.isEditing)
    )

  case class State(editText: UnfinishedTitle)

  class Backend($: BackendScope[Props, State]) {
    val inputRef: Ref[Input, Input] = Ref[html.Input]

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

    val cbs: Px[Callbacks] =
      Px.callback($.props).map(Callbacks).withoutReuse.autoRefresh

    val editFieldChanged: ReactEventFromInput => Callback =
      e => {
        /* need to capture event data because React reuses events */
        val captured = e.target.value
        $.modState(_.copy(editText = UnfinishedTitle(captured)))
      }

    def render(P: Props, S: State): TagOf[LI] = {
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
        ).withRef(inputRef)
      )
    }
  }

  private val component =
    ScalaComponent.builder[Props]("TodoItem")
      .initialStateFromProps(p => State(p.todo.title.editable))
      .renderBackend[Backend]
      .componentDidUpdate { componentDidUpdate ⇒
        Callback(componentDidUpdate.backend.inputRef.map(_.focus()))
            .when(componentDidUpdate.currentProps.isEditing && !componentDidUpdate.prevProps.isEditing)
            .void
      }
      .build

  def apply(P: Props): VdomElement =
    component.withKey(P.todo.id.id.toString)(P)
}
