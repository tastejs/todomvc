package com.todo.client;

/**
 * An individual ToDo item.
 *
 * @author ceberhardt
 *
 */
public class ToDoItem {

	private final ToDoPresenter presenter;

	private String title;

	private boolean done;

	public ToDoItem(String text, ToDoPresenter presenter) {
		this.title = text;
		this.done = false;
		this.presenter = presenter;
	}

	public ToDoItem(String title, boolean done, ToDoPresenter presenter) {
		this.title = title;
		this.done = done;
		this.presenter = presenter;
	}

	public boolean isDone() {
		return done;
	}

	public void setDone(boolean done) {
		this.done = done;
		presenter.itemStateChanged(this);
	}

	public void delete() {
		presenter.deleteTask(this);
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
		presenter.itemStateChanged(this);
	}
}
