package io.udash.todo

import io.udash.Application

object ApplicationContext {
  private val routingRegistry = new RoutingRegistryDef
  private val viewFactoriesRegistry = new StatesToViewFactoryDef

  val applicationInstance: Application[RoutingState] = new Application[RoutingState](routingRegistry, viewFactoriesRegistry)
}
