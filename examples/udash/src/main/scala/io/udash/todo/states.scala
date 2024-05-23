package io.udash.todo

import io.udash._
import io.udash.todo.views.todo.TodosFilter

sealed abstract class RoutingState(val parentState: Option[ContainerRoutingState]) extends State {
  type HierarchyRoot = RoutingState

  def url(implicit application: Application[RoutingState]): String =
    s"#${application.matchState(this).value}"
}

sealed abstract class ContainerRoutingState(parentState: Option[ContainerRoutingState]) extends RoutingState(parentState) with ContainerState
sealed abstract class FinalRoutingState(parentState: Option[ContainerRoutingState]) extends RoutingState(parentState) with FinalState

object RootState extends ContainerRoutingState(None)
object ErrorState extends FinalRoutingState(Some(RootState))
case class TodoState(filter: TodosFilter) extends FinalRoutingState(Some(RootState))
