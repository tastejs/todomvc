package com.todo.client;

/**
 * An individual ToDo item.
 *
 * @author ceberhardt
 * @author dprotti
 *
 */
public class ToDoItem {

	private String title;

	private boolean completed;

	public ToDoItem(String title) {
		this(title, false);
	}

	public ToDoItem(String title, boolean completed) {
		this.title = title;
		this.completed = completed;
	}

	public boolean isCompleted() {
		return completed;
	}

	public void setCompleted(boolean completed) {
		this.completed = completed;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

}
