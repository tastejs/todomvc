package com.todo.client;

/**
 * A routing function that matches completed todo items.
 */
public class ToDoRoutingCompleted implements ToDoRoutingFunction {

	@Override
	public boolean matches(ToDoItem item) {
		return item.isDone();
	}

}
