package com.todo.client.events;

import com.google.gwt.event.shared.EventHandler;
import com.todo.client.ToDoItem;

public class ToDoUpdatedEvent extends ToDoEvent<ToDoUpdatedEvent.Handler> {

	public static final Type<ToDoUpdatedEvent.Handler> TYPE = new Type<ToDoUpdatedEvent.Handler>();

	public static interface Handler extends EventHandler {

		void onEvent(ToDoUpdatedEvent event);
	}

	public ToDoUpdatedEvent(ToDoItem toDo) {
		super(toDo);
	}

	@Override
	public Type<ToDoUpdatedEvent.Handler> getAssociatedType() {
		return TYPE;
	}

	@Override
	protected void dispatch(ToDoUpdatedEvent.Handler handler) {
		handler.onEvent(this);
	}
}