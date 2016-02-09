package io.udash.todo

import io.udash._
import io.udash.todo.views.todo.TodosFilter

class RoutingRegistryDef extends RoutingRegistry[RoutingState] {
  def matchUrl(url: Url): RoutingState =
    url2State.applyOrElse(url.value.stripSuffix("/"), (x: String) => ErrorState)

  def matchState(state: RoutingState): Url =
    Url(state2Url.apply(state))

  private val (url2State, state2Url) = bidirectional {
    case "" => TodoState(TodosFilter.All)
    case "/active" => TodoState(TodosFilter.Active)
    case "/completed" => TodoState(TodosFilter.Completed)
  }
}
