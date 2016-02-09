package io.udash.todo.views.todo

import io.udash._
import io.udash.css._
import io.udash.properties.single.ReadableProperty
import io.udash.todo._
import org.scalajs.dom.ext.KeyCode
import org.scalajs.dom.{Event, KeyboardEvent}

class TodoView(model: ModelProperty[TodoViewModel], presenter: TodoPresenter) extends FinalView with CssView {
  import scalatags.JsDom.all._
  import scalatags.JsDom.tags2.section

  private val isTodoListNonEmpty: ReadableProperty[Boolean] =
    model.subSeq(_.todos).transform(_.nonEmpty)

  private val isCompletedTodoListNonEmpty: ReadableProperty[Boolean] =
    model.subSeq(_.todos).filter(TodosFilter.Completed.matcher).transform(_.nonEmpty)

  private val headerTemplate = {
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
  }

  private val listTemplate = {
    section(cls := "main")(
      Checkbox(
        model.subProp(_.toggleAllChecked),
        cls := "toggle-all",
        onclick :+= ((ev: Event) => {
          presenter.setItemsCompleted()
          false
        })
      ),
      produce(model.subProp(_.todosFilter))(filter =>
        ul(cls := "todo-list")(
          repeat(model.subSeq(_.todos).filter(filter.matcher))(
            (item: CastableProperty[Todo]) =>
              listItemTemplate(item.asModel).render
          )
        ).render
      )
    )
  }

  private val footerTemplate = {
    footer(cls := "footer")(
      produce(model.subSeq(_.todos).filter(TodosFilter.Active.matcher))(todos => {
        val size: Int = todos.size
        val pluralization = if (size == 1) "item" else "items"
        span(cls := "todo-count")(s"$size $pluralization left").render
      }),
      ul(cls := "filters")(
        for {
          (name, filter) <- Seq(("All", TodosFilter.All), ("Active", TodosFilter.Active), ("Completed", TodosFilter.Completed))
        } yield li(footerButtonTemplate(name, TodoState(filter).url(ApplicationContext.applicationInstance), filter))
      ),
      showIf(isCompletedTodoListNonEmpty)(Seq(
        button(
          cls := "clear-completed",
          onclick :+= ((ev: Event) => presenter.clearCompleted(), true)
        )("Clear completed").render
      ))
    )
  }

  override val getTemplate: Modifier = div(
    headerTemplate,
    showIf(isTodoListNonEmpty)(Seq(
      listTemplate.render,
      footerTemplate.render
    ))
  )

  private def listItemTemplate(item: ModelProperty[Todo]) = {
    val editName = Property("")

    val editorInput = TextInput(editName, debounce = None)(
      cls := "edit",
      onkeydown :+= ((ev: KeyboardEvent) => {
        if (ev.keyCode == KeyCode.Enter) {
          presenter.endItemEdit(item, editName)
          true //prevent default
        } else if (ev.keyCode == KeyCode.Escape) {
          presenter.cancelItemEdit(item)
          true //prevent default
        } else false // do not prevent default
      }),
      onblur :+= ((ev: Event) => {
        presenter.endItemEdit(item, editName)
        true //prevent default
      })
    ).render

    val stdView = div(cls := "view")(
      Checkbox(item.subProp(_.completed), cls := "toggle"),
      label(
        ondblclick :+= ((ev: Event) => {
          presenter.startItemEdit(item, editName)
          editorInput.focus()
        }, true)
      )(bind(item.subProp(_.name))),
      button(
        cls := "destroy",
        onclick :+= ((ev: Event) => presenter.deleteItem(item.get), true)
      )
    )

    li(
      CssStyleName("completed").styleIf(item.subProp(_.completed)),
      CssStyleName("editing").styleIf(item.subProp(_.editing)),
    )(stdView, editorInput)
  }

  private def footerButtonTemplate(title: String, link: String, expectedFilter: TodosFilter) = {
    val isSelected = model.subProp(_.todosFilter).transform(_ == expectedFilter)
    a(href := link, CssStyleName("selected").styleIf(isSelected))(title)
  }
}
