package io.udash.todo

import io.udash._

sealed abstract class RoutingState(val parentState: RoutingState) extends State {
  def url(implicit application: Application[RoutingState]): String = s"#${application.matchState(this).value}"
}

case object RootState extends RoutingState(null)
case object ErrorState extends RoutingState(RootState)

sealed abstract class TodoState extends RoutingState(RootState)
case object TodoAllState extends TodoState
case object TodoActiveState extends TodoState
case object TodoCompletedState extends TodoState
