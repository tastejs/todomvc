package com.todo.client.events;

import com.google.gwt.event.shared.EventHandler;
import com.todo.client.ToDoItem;

public class ToDoRemovedEvent extends ToDoEvent<ToDoRemovedEvent.Handler> {

	public static final Type<ToDoRemovedEvent.Handler> TYPE = new Type<ToDoRemovedEvent.Handler>();

	public static interface Handler extends EventHandler {

		void onEvent(ToDoRemovedEvent event);
	}

	public ToDoRemovedEvent(ToDoItem toDo) {
		super(toDo);
	}

	@Override
	public Type<ToDoRemovedEvent.Handler> getAssociatedType() {
		return TYPE;
	}

	@Override
	protected void dispatch(ToDoRemovedEvent.Handler handler) {
		handler.onEvent(this);
	}
}