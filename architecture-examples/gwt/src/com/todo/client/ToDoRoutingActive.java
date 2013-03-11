package com.todo.client;

/**
 * A routing function that matches active todo items.
 */
public class ToDoRoutingActive implements ToDoRoutingFunction {

	@Override
	public boolean matches(ToDoItem item) {
		return !item.isDone();
	}

}
