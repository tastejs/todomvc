package todomvc

import japgolly.scalajs.react.ScalazReact._
import japgolly.scalajs.react._
import japgolly.scalajs.react.extra._
import japgolly.scalajs.react.extra.router2.RouterCtl
import japgolly.scalajs.react.vdom.prefix_<^._
import org.scalajs.dom.ext.KeyCode

import scala.scalajs.js
import scalaz.effect.IO
import scalaz.std.anyVal.unitInstance
import scalaz.syntax.semigroup._

object CTodoList {

  case class Props private[CTodoList] (ctl: RouterCtl[TodoFilter], model: TodoModel, currentFilter: TodoFilter)

  case class State(todos: Seq[Todo], editing: Option[TodoId])

  /**
   * These specify when it makes sense to skip updating this component (see comment on `Listenable` below)
   */
  implicit val r1 = Reusability.fn[Props]((p1, p2) => p1.currentFilter == p2.currentFilter)
  implicit val r2 = Reusability.fn[State]((s1, s2) => s1.editing == s2.editing && (s1.todos eq s2.todos))

  /**
   * One difference between normal react and scalajs-react is the use of backends.
   * Since components are not inheritance-based, we often use a backend class
   * where we put most of the functionality: rendering, state handling, etc.
   *
   * It extends OnUnmount so unsubscription of events can be made automatically.
   */
  case class Backend($: BackendScope[Props, State]) extends OnUnmount {

    def handleNewTodoKeyDown(event: ReactKeyboardEventI): Option[IO[Unit]] =
      Some((event.nativeEvent.keyCode, UnfinishedTitle(event.target.value).validated)) collect {
        case (KeyCode.Enter, Some(title)) =>
          IO(event.target.value = "") |+| $.props.model.addTodo(title)
      }
    
    def updateTitle(id: TodoId)(title: Title): IO[Unit] =
      editingDone(cb = $.props.model.update(id, title))

    def startEditing(id: TodoId): IO[Unit] =
      $.modStateIO(_.copy(editing = Some(id)))

    /**
     * @param cb Two changes to the same `State` must be combined using a callback like this.
     *           If not, rerendering will prohibit the second from having its effect.
     *           For this example, the current `State` contains both `editing` and the list of todos.
     */
    def editingDone(cb: OpCallbackIO = js.undefined): IO[Unit] =
      $.modStateIO(_.copy(editing = None), cb)

    def toggleAll(e: ReactEventI): IO[Unit] =
      $.props.model.toggleAll(e.target.checked)

    def render: ReactElement = {
      val todos           = $.state.todos
      val filteredTodos   = todos filter $.props.currentFilter.accepts

      val activeCount     = todos count TodoFilter.Active.accepts
      val completedCount  = todos.length - activeCount

      <.div(
        <.h1("todos"),
        <.header(
          ^.className := "header",
          <.input(
            ^.className     := "new-todo",
            ^.placeholder   := "What needs to be done?",
            ^.onKeyDown  ~~>? handleNewTodoKeyDown _,
            ^.autoFocus     := true
          )
        ),
        todos.nonEmpty ?= todoList(filteredTodos, activeCount),
        todos.nonEmpty ?= footer(activeCount, completedCount)
      )
    }

    def todoList(filteredTodos: Seq[Todo], activeCount: Int): ReactElement =
      <.section(
        ^.className := "main",
        <.input(
          ^.className  := "toggle-all",
          ^.`type`     := "checkbox",
          ^.checked    := activeCount == 0,
          ^.onChange ~~> toggleAll _
        ),
        <.ul(
          ^.className := "todo-list",
          filteredTodos.map(todo =>
            CTodoItem(
              onToggle         = $.props.model.toggleCompleted(todo.id),
              onDelete         = $.props.model.delete(todo.id),
              onStartEditing   = startEditing(todo.id),
              onUpdateTitle    = updateTitle(todo.id),
              onCancelEditing  = editingDone(),
              todo             = todo,
              isEditing        = $.state.editing.contains(todo.id)
            )
          )
        )
      )

    def footer(activeCount: Int, completedCount: Int): ReactElement =
      CFooter(
        filterLink       = $.props.ctl.link,
        onClearCompleted = $.props.model.clearCompleted,
        currentFilter    = $.props.currentFilter,
        activeCount      = activeCount,
        completedCount   = completedCount
      )
  }

  private val component = ReactComponentB[Props]("CTodoList")
    /* state derived from the props */
    .initialStateP(p => State(p.model.todos, None))
    .backend(Backend)
    .render(_.backend.render)
    /**
     * Makes the component subscribe to events coming from the model.
     * Unsubscription on component unmount is handled automatically.
     * The last function is the actual event handling, in this case
     *  we just overwrite the whole list in `state`.
     */
    .configure(Listenable.installIO((p: Props) => p.model, ($, todos: Seq[Todo]) => $.modStateIO(_.copy(todos = todos))))
    /**
     * Optimization where we specify whether the component can have changed.
     * In this case we avoid comparing model and routerConfig, and only do
     *  reference checking on the list of todos.
     *
     * The implementation of the «equality» checks are in the Reusability
     *  typeclass instances for `State` and `Props` at the top of the file.
     *
     *  To understand how things are redrawn, change `shouldComponentUpdate` for
     *  either `shouldComponentUpdateWithOverlay` or `shouldComponentUpdateAndLog`
     */
    .configure(Reusability.shouldComponentUpdate)
    /**
     * For performance reasons its important to only call `build` once for each component
     */
    .build

  def apply(model: TodoModel, currentFilter: TodoFilter)(ctl: RouterCtl[TodoFilter]) =
    component(Props(ctl, model, currentFilter))
}
