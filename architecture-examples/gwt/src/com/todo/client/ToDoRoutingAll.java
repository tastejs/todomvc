package com.todo.client;

/**
 * A routing function that matches all todo items.
 */
public class ToDoRoutingAll implements ToDoRoutingFunction {

	@Override
	public boolean matches(ToDoItem item) {
		return true;
	}

}
