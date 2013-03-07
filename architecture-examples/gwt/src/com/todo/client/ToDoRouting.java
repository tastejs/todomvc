package com.todo.client;

public enum ToDoRouting {
	/**
	 * Displays all todo items
	 */
	ALL(new ToDoRoutingAll()),
	/**
	 * Displays active todo items - i.e. those that have not been done
	 */
	ACTIVE(new ToDoRoutingActive()),
	/**
	 * Displays completed todo items - i.e. those that have been done
	 */
	COMPLETED(new ToDoRoutingCompleted());
	
	private final ToDoRoutingFunction routingFunction;
	
	private ToDoRouting(ToDoRoutingFunction routingFunction) {
		this.routingFunction = routingFunction;
	}

	public ToDoRoutingFunction getRoutingFunction() {
		return routingFunction;
	}
}
