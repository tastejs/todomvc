package com.todo.client.events;

import com.google.gwt.event.shared.EventBus;
import com.google.gwt.event.shared.EventHandler;
import com.google.gwt.event.shared.GwtEvent;
import com.google.gwt.event.shared.SimpleEventBus;
import com.todo.client.ToDoItem;

public abstract class ToDoEvent<H extends EventHandler> extends GwtEvent<H> {

	private final ToDoItem toDo;

	public ToDoEvent(ToDoItem toDo) {
		this.toDo = toDo;
	}

	public ToDoItem getToDo() {
		return toDo;
	}

	/* This acts as a global event bus factory */

	private static EventBus eventBus = new SimpleEventBus();

	public static EventBus getGlobalEventBus() {
		return eventBus;
	}

}
