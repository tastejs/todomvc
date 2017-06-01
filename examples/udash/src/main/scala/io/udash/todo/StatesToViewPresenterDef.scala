package io.udash.todo

import io.udash._
import io.udash.todo.views._
import io.udash.todo.views.todo.TodoViewPresenter

class StatesToViewPresenterDef extends ViewPresenterRegistry[RoutingState] {
  def matchStateToResolver(state: RoutingState): ViewPresenter[_ <: RoutingState] = state match {
    case RootState => RootViewPresenter
    case TodoAllState => TodoViewPresenter
    case TodoActiveState => TodoViewPresenter
    case TodoCompletedState => TodoViewPresenter
    case _ => ErrorViewPresenter
  }
}
