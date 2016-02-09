package io.udash.todo.views.todo

import io.udash._
import io.udash.properties.single.ReadableProperty
import io.udash.todo._
import io.udash.todo.storage.LocalTodoStorage
import org.scalajs.dom.ext.KeyCode
import org.scalajs.dom.raw.HTMLElement
import org.scalajs.dom.{Event, KeyboardEvent}

import scala.concurrent.Future

object TodoViewPresenter extends ViewPresenter[TodoState] {

  import Context._

  override def create(): (View, Presenter[TodoState]) = {
    val model = ModelProperty[TodoViewModel]
    val presenter: TodoPresenter = new TodoPresenter(model)
    (new TodoView(model, presenter), presenter)
  }
}

class TodoPresenter(model: ModelProperty[TodoViewModel]) extends Presenter[TodoState] {
  private val todosProperty = model.subSeq(_.todos)

  // Toggle button state subprop
  val allCheckedProperty = todosProperty.transform(
    (todos: Seq[Todo]) => todos.forall(_.completed),
    (value: Boolean) => todosProperty.get.map(_.copy(completed = value))
  )

  // Init model with AllTodosFilter filter
  model.subProp(_.todosFilter).set(TodoFilter.All)

  // Load from storage
  todosProperty.set(LocalTodoStorage.load().map(todo => Todo(todo.title, completed = todo.completed, editing = false)))

  // Persist todos on every change
  todosProperty.listen(v => LocalTodoStorage.store(v.map(todo => storage.Todo(todo.name, todo.completed))))

  override def handleState(state: TodoState): Unit =
    model.subProp(_.todosFilter).set(state match {
      case TodoAllState => TodoFilter.All
      case TodoActiveState => TodoFilter.Active
      case TodoCompletedState => TodoFilter.Completed
    })

  def addTodo(): Unit = {
    val nameProperty: Property[String] = model.subProp(_.newTodoName)
    val name = nameProperty.get.trim
    if (name.nonEmpty) {
      todosProperty.append(Todo(name, completed = false))
      nameProperty.set("")
    }
  }

  def startItemEdit(item: ModelProperty[Todo]): Unit = {
    item.subProp(_.editName).set(item.subProp(_.name).get)
    item.subProp(_.editing).set(true)
  }

  def cancelItemEdit(item: ModelProperty[Todo]): Unit =
    item.subProp(_.editing).set(false)

  def endItemEdit(item: ModelProperty[Todo]): Unit = {
    val name = item.subProp(_.editName).get.trim
    if (item.subProp(_.editing).get && name.nonEmpty) {
      item.subProp(_.name).set(name)
      item.subProp(_.editing).set(false)
    } else if (name.isEmpty) {
      deleteItem(item.get)
    }
  }

  def deleteItem(item: Todo): Unit =
    todosProperty.remove(item)

  def clearCompleted(): Unit =
    todosProperty.set(todosProperty.get.filter(TodoFilter.Active.predicate))

  def setItemsCompleted(): Unit =
    CallbackSequencer.sequence {
      val targetValue = !allCheckedProperty.get
      todosProperty.elemProperties.foreach(p => p.asModel.subProp(_.completed).set(targetValue))
    }
}

class TodoView(model: ModelProperty[TodoViewModel],
               presenter: TodoPresenter) extends FinalView {

  import Context._

  import scalatags.JsDom.all._
  import scalatags.JsDom.tags2.section

  private val isTodoListNonEmpty: ReadableProperty[Boolean] =
    model.subSeq(_.todos).transform(_.nonEmpty)

  private val isCompletedTodoListNonEmpty: ReadableProperty[Boolean] =
    model.subSeq(_.todos).filter(TodoFilter.Completed.predicate).transform(_.nonEmpty)

  override val getTemplate: Modifier =
    div(
      headerTemplate,
      showIf(isTodoListNonEmpty)(Seq(
        listTemplate.render,
        footerTemplate.render
      ))
    )

  private lazy val headerTemplate =
    header(cls := "header")(
      TextInput(model.subProp(_.newTodoName), debounce = None)(
        cls := "new-todo",
        placeholder := "What needs to be done?",
        autofocus := true,
        onkeydown :+= ((ev: KeyboardEvent) => {
          if (ev.keyCode == KeyCode.Enter) {
            presenter.addTodo()
            true //prevent default
          } else false // do not prevent default
        })
      )
    )

  private lazy val listTemplate =
    section(cls := "main")(
      Checkbox(
        presenter.allCheckedProperty,
        cls := "toggle-all",
        onclick :+= ((ev: Event) => {
          presenter.setItemsCompleted()
          false
        })
      ),
      produce(model.subProp(_.todosFilter))(filter =>
        ul(cls := "todo-list")(
          repeat(model.subSeq(_.todos).filter(filter.predicate))(
            (item: CastableProperty[Todo]) =>
              listItemTemplate(item.asModel).render
          )
        ).render
      )
    )

  private def listItemTemplate(item: ModelProperty[Todo]) =
    li(
      reactiveClass(item.subProp(_.completed), "completed"),
      reactiveClass(item.subProp(_.editing), "editing")
    )(
      div(cls := "view")(
        Checkbox(item.subProp(_.completed), cls := "toggle"),
        label(
          ondblclick :+= ((ev: Event) => presenter.startItemEdit(item), true)
        )(bind(item.subProp(_.name))),
        button(
          cls := "destroy",
          onclick :+= ((ev: Event) => presenter.deleteItem(item.get), true)
        )
      ),
      TextInput(item.subProp(_.editName), debounce = None)(
        item.subProp(_.editing).reactiveApply((el, editing) =>
          if (editing) Future(el.asInstanceOf[HTMLElement].focus())
        ),
        cls := "edit", tabindex := -1,
        onkeydown :+= ((ev: KeyboardEvent) => {
          if (ev.keyCode == KeyCode.Enter) {
            presenter.endItemEdit(item)
            true //prevent default
          } else if (ev.keyCode == KeyCode.Escape) {
            presenter.cancelItemEdit(item)
            true //prevent default
          } else false // do not prevent default
        }),
        onblur :+= ((ev: Event) => {
          presenter.endItemEdit(item)
          true //prevent default
        })
      )
    )

  private def footerButtonTemplate(title: String, link: String, expectedFilter: TodoFilter) =
    a(
      href := link,
      reactiveClass(model.subProp(_.todosFilter).transform(_ == expectedFilter), "selected")
    )(title)

  private lazy val footerTemplate =
    footer(cls := "footer")(
      produce(model.subSeq(_.todos).filter(TodoFilter.Active.predicate))(todos => {
        val size = todos.size
        val pluralization = if (size == 1) "item" else "items"
        span(cls := "todo-count")(s"$size $pluralization left").render
      }),
      ul(cls := "filters")(
        li(footerButtonTemplate("All", TodoAllState.url, TodoFilter.All)),
        li(footerButtonTemplate("Active", TodoActiveState.url, TodoFilter.Active)),
        li(footerButtonTemplate("Completed", TodoCompletedState.url, TodoFilter.Completed))
      ),
      showIf(isCompletedTodoListNonEmpty)(Seq(
        button(
          cls := "clear-completed",
          onclick :+= ((ev: Event) => presenter.clearCompleted(), true)
        )("Clear completed").render
      )
      )
    )

  private def reactiveClass(p: ReadableProperty[Boolean], clsName: String) =
    p.reactiveApply((el, value) =>
      if (value) el.classList.add(clsName)
      else el.classList.remove(clsName)
    )
}
