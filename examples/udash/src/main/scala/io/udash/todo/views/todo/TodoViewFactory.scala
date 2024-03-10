package io.udash.todo.views.todo

import io.udash._
import io.udash.todo.TodoState

object TodoViewFactory extends ViewFactory[TodoState] {
  override def create(): (View, Presenter[TodoState]) = {
    val model = ModelProperty(TodoViewModel(Seq.empty, TodosFilter.All, "", toggleAllChecked = false))
    val presenter: TodoPresenter = new TodoPresenter(model)
    val view = new TodoView(model, presenter)
    (view, presenter)
  }
}