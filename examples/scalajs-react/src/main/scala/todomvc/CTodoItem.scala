package todomvc

import japgolly.scalajs.react.ScalazReact._
import japgolly.scalajs.react._
import japgolly.scalajs.react.vdom.prefix_<^._
import org.scalajs.dom.ext.KeyCode
import scalaz.effect.IO
import scalaz.syntax.semigroup._
import scalaz.syntax.std.option._
import scalaz.std.anyVal.unitInstance

object CTodoItem {

  case class Props private[CTodoItem] (
    onToggle:        IO[Unit],
    onDelete:        IO[Unit],
    onStartEditing:  IO[Unit],
    onUpdateTitle:   Title => IO[Unit],
    onCancelEditing: IO[Unit],
    todo:            Todo,
    isEditing:       Boolean
  )

  case class State(editText: UnfinishedTitle)

  case class Backend($: BackendScope[Props, State]) {

    def editFieldSubmit: IO[Unit] =
      $.state.editText.validated.fold($.props.onDelete)($.props.onUpdateTitle)

    /**
     * It's OK to make these into `val`s as long as they don't touch state.
     */
    val resetText: IO[Unit] =
      $.modStateIO(_.copy(editText = $.props.todo.title.editable))

    val editFieldKeyDown: ReactKeyboardEvent => Option[IO[Unit]] =
      e => e.nativeEvent.keyCode match {
        case KeyCode.Escape => (resetText |+| $.props.onCancelEditing).some
        case KeyCode.Enter  => editFieldSubmit.some
        case _              => None
      }

    val editFieldChanged: ReactEventI => IO[Unit] =
      e => $.modStateIO(_.copy(editText = UnfinishedTitle(e.target.value)))

    def render: ReactElement = {
      <.li(
        ^.classSet(
          "completed" -> $.props.todo.isCompleted,
          "editing"   -> $.props.isEditing
        ),
        <.div(
          ^.className := "view",
          <.input(
            ^.className := "toggle",
            ^.`type`    := "checkbox",
            ^.checked   := $.props.todo.isCompleted,
            ^.onChange ~~> $.props.onToggle
          ),
          <.label($.props.todo.title.value, ^.onDoubleClick ~~> $.props.onStartEditing),
          <.button(^.className := "destroy", ^.onClick ~~> $.props.onDelete)
        ),
        <.input(
          ^.className   := "edit",
          ^.onBlur     ~~> editFieldSubmit,
          ^.onChange   ~~> editFieldChanged,
          ^.onKeyDown ~~>? editFieldKeyDown,
          ^.value       := $.state.editText.value
        )
      )
    }
  }

  private val component = ReactComponentB[Props]("CTodoItem")
    .initialStateP(p => State(p.todo.title.editable))
    .backend(Backend)
    .render(_.backend.render)
    .build

  def apply(onToggle:        IO[Unit],
            onDelete:        IO[Unit],
            onStartEditing:  IO[Unit],
            onUpdateTitle:   Title => IO[Unit],
            onCancelEditing: IO[Unit],
            todo:            Todo,
            isEditing:       Boolean) =

    component.withKey(todo.id.id.toString)(
      Props(
        onToggle        = onToggle,
        onDelete        = onDelete,
        onStartEditing  = onStartEditing,
        onUpdateTitle   = onUpdateTitle,
        onCancelEditing = onCancelEditing,
        todo            = todo,
        isEditing       = isEditing
      )
    )
}
