package com.todo.client;

/**
 * A routing function filters todo items, based on some criteria
 */
public interface ToDoRoutingFunction {
	/**
	 * Determines whether the given todo item matches this routing function.
	 */
	boolean matches(ToDoItem item);
}
