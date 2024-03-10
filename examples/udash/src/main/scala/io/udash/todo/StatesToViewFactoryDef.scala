package io.udash.todo

import io.udash._
import io.udash.todo.views._
import io.udash.todo.views.todo.TodoViewFactory

class StatesToViewFactoryDef extends ViewFactoryRegistry[RoutingState] {
  def matchStateToResolver(state: RoutingState): ViewFactory[_ <: RoutingState] = state match {
    case RootState => RootViewFactory
    case _: TodoState => TodoViewFactory
    case _ => ErrorViewFactory
  }
}
