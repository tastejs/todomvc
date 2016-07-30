package todomvc

import japgolly.scalajs.react._
import japgolly.scalajs.react.extra._
import japgolly.scalajs.react.extra.router.RouterCtl
import japgolly.scalajs.react.vdom.prefix_<^._
import org.scalajs.dom.ext.KeyCode
import org.scalajs.dom.html

object TodoList {

  case class Props (
    ctl:           RouterCtl[TodoFilter],
    model:         TodoModel,
    currentFilter: TodoFilter
  )

  case class State(
    todos:      Seq[Todo],
    editing:    Option[TodoId]
  )

  /**
   * These specify when it makes sense to skip updating this component (see comment on `Listenable` below)
   */
  implicit val r1: Reusability[Props] =
    Reusability.fn[Props]((p1, p2) => p1.currentFilter == p2.currentFilter)
  implicit val r2: Reusability[State] =
    Reusability.fn[State]((s1, s2) => s1.editing == s2.editing && (s1.todos eq s2.todos))

  /**
   * One difference between normal react and scalajs-react is the use of backends.
   * Since components are not inheritance-based, we often use a backend class
   * where we put most of the functionality: rendering, state handling, etc.
   *
   * It extends OnUnmount so unsubscription of events can be made automatically.
   */
  class Backend($: BackendScope[Props, State]) extends OnUnmount {

    /**
     *  A backend lives for the entire life of a component. During that time,
     *   it might receive new Props,
     *   so we use this mechanism to keep state that is derived from Props, so
     *   we only update it again if Props changed in a meaningful way (as determined
     *   by the implicit `Reusability` defined above )
     */
    case class Callbacks(P: Props) {
      val handleNewTodoKeyDown: ReactKeyboardEventI => Option[Callback] =
        e => Some((e.nativeEvent.keyCode, UnfinishedTitle(e.target.value).validated)) collect {
          case (KeyCode.Enter, Some(title)) =>
            Callback(e.target.value = "") >> P.model.addTodo(title)
        }

      val updateTitle: TodoId => Title => Callback =
        id => title => editingDone(cb = P.model.update(id, title))

      val toggleAll: ReactEventI => Callback =
        e => P.model.toggleAll(e.target.checked)
    }

    val cbs: Px[Callbacks] =
      Px.cbA($.props).map(Callbacks)

    val startEditing: TodoId => Callback =
      id => $.modState(_.copy(editing = Some(id)))

    /**
     * @param cb Two changes to the same `State` must be combined using a callback like this.
     *           If not, rerendering will prohibit the second from having its effect.
     *           For this example, the current `State` contains both `editing` and the list of todos.
     */
    def editingDone(cb: Callback = Callback.empty): Callback =
      $.modState(_.copy(editing = None), cb)

    def render(P: Props, S: State): ReactTagOf[html.Div] = {
      val todos           = S.todos
      val filteredTodos   = todos filter P.currentFilter.accepts

      val activeCount     = todos count TodoFilter.Active.accepts
      val completedCount  = todos.length - activeCount

      /**
        * `cbs.value()` checks if `Props` changed (according to `Reusability`),
        * and, if it did, creates a new instance of `Callbacks`. For best
        * performance, it's best to call value() once per render() pass.
        */
      val callbacks = cbs.value()
      <.div(
        <.h1("todos"),
        <.header(
          ^.className := "header",
          <.input(
            ^.className     := "new-todo",
            ^.placeholder   := "What needs to be done?",
            ^.onKeyDown   ==>? callbacks.handleNewTodoKeyDown,
            ^.autoFocus     := true
          )
        ),
        todos.nonEmpty ?= todoList(P, callbacks, S.editing, filteredTodos, activeCount),
        todos.nonEmpty ?= footer(P, activeCount, completedCount)
      )
    }

    def todoList(P:             Props,
                 callbacks:     Callbacks,
                 editing:       Option[TodoId],
                 filteredTodos: Seq[Todo],
                 activeCount:   Int): ReactTagOf[html.Element] =
      <.section(
        ^.className := "main",
        <.input(
          ^.className  := "toggle-all",
          ^.`type`     := "checkbox",
          ^.checked    := activeCount == 0,
          ^.onChange  ==> callbacks.toggleAll
        ),
        <.ul(
          ^.className := "todo-list",
          filteredTodos.map(todo =>
            TodoItem(TodoItem.Props(
              onToggle         = P.model.toggleCompleted(todo.id),
              onDelete         = P.model.delete(todo.id),
              onStartEditing   = startEditing(todo.id),
              onUpdateTitle    = callbacks.updateTitle(todo.id),
              onCancelEditing  = editingDone(),
              todo             = todo,
              isEditing        = editing.contains(todo.id)
            ))
          )
        )
      )

    def footer(P: Props, activeCount: Int, completedCount: Int): ReactElement =
      Footer(Footer.Props(
        filterLink       = P.ctl.link,
        onClearCompleted = P.model.clearCompleted,
        currentFilter    = P.currentFilter,
        activeCount      = activeCount,
        completedCount   = completedCount
      ))
  }

  private val component =
    ReactComponentB[Props]("TodoList")
      /* state derived from the props */
      .initialState_P(p => State(p.model.todos, None))
      .renderBackend[Backend]
      /**
       * Makes the component subscribe to events coming from the model.
       * Unsubscription on component unmount is handled automatically.
       * The last function is the actual event handling, in this case
       *  we just overwrite the whole list in `state`.
       */
      .configure(Listenable.install((p: Props) => p.model, $ => (todos: Seq[Todo]) => $.modState(_.copy(todos = todos))))
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

  def apply(model: TodoModel, currentFilter: TodoFilter)(ctl: RouterCtl[TodoFilter]): ReactElement =
    component(Props(ctl, model, currentFilter))
}
