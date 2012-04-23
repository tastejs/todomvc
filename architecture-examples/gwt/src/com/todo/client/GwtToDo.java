package com.todo.client;

import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.user.client.ui.RootPanel;

/**
 * Entry point class
 */
public class GwtToDo implements EntryPoint {

	@Override
	public void onModuleLoad() {
		ToDoView toDoView = new ToDoView();
		new ToDoPresenter(toDoView);
		RootPanel.get().add(toDoView);
	}
}
