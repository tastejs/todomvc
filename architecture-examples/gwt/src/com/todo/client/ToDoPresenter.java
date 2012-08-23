package com.todo.client;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONBoolean;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.json.client.JSONString;
import com.google.gwt.storage.client.Storage;
import com.google.gwt.view.client.AbstractDataProvider;
import com.google.gwt.view.client.ListDataProvider;

/**
 * The presenter for the ToDo application. This class is responsible for the lifecycle of the
 * {@link ToDoItem} instances.
 *
 * @author ceberhardt
 *
 */
public class ToDoPresenter {

	private static final String STORAGE_KEY = "todo-gwt";

	/**
	 * The interface that a view for this presenter must implement.
	 */
	public interface View {

		/**
		 * Gets the text that the user has input for the creation of new tasks.
		 */
		String getTaskText();

		/**
		 * Clears the user input field where new tasks are added.
		 */
		void clearTaskText();

		/**
		 * Sets the current task statistics.
		 */
		void setTaskStatistics(int totalTasks, int completedTasks);

		/**
		 * Sets the data provider that acts as a source of {@link ToDoItem} instances.
		 */
		void setDataProvider(AbstractDataProvider<ToDoItem> data);

		/**
		 * Adds the handler to the events raised by the view.
		 */
		void addhandler(ViewEventHandler handler);
	}

	/**
	 * The interface that handles interactions from the view.
	 *
	 */
	public interface ViewEventHandler {
		/**
		 * Invoked when a user adds a new task.
		 */
		void addTask();

		/**
		 * Invoked when a user wishes to clear completed tasks.
		 */
		void clearCompletedTasks();

		/**
		 * Sets the completed state of all tasks to the given state
		 */
		void markAllCompleted(boolean completed);
	}

	/**
	 * Handler for view events, defers to private presenter methods.
	 */
	private final ViewEventHandler viewHandler = new ViewEventHandler() {
		@Override
		public void addTask() {
			ToDoPresenter.this.addTask();
		}

		@Override
		public void clearCompletedTasks() {
			ToDoPresenter.this.clearCompletedTasks();
		}

		@Override
		public void markAllCompleted(boolean completed) {
			ToDoPresenter.this.markAllCompleted(completed);
		}
	};

	private final ListDataProvider<ToDoItem> todos = new ListDataProvider<ToDoItem>();

	private final View view;

	private boolean suppressStateChanged = false;

	public ToDoPresenter(View view) {
		this.view = view;

		loadState();

		view.addhandler(viewHandler);
		view.setDataProvider(todos);
		updateTaskStatistics();
	}

	/**
	 * Computes the tasks statistics and updates the view.
	 */
	private void updateTaskStatistics() {
		int totalTasks = todos.getList().size();

		int completeTask = 0;
		for (ToDoItem task : todos.getList()) {
			if (task.isDone()) {
				completeTask++;
			}
		}

		view.setTaskStatistics(totalTasks, completeTask);
	}

	/**
	 * Deletes the given task and updates statistics.
	 */
	protected void deleteTask(ToDoItem toDoItem) {
		todos.getList().remove(toDoItem);
		updateTaskStatistics();
		saveState();
	}

	/**
	 * Invoked by a task when its state changes so that we can update the view statistics and persist.
	 */
	protected void itemStateChanged(ToDoItem toDoItem) {

		if (suppressStateChanged) {
			return;
		}

		// if the item has become empty, remove it
		if (toDoItem.getTitle().trim().equals("")) {
			todos.getList().remove(toDoItem);
		}

		updateTaskStatistics();
		saveState();
	}

	/**
	 * Sets the completed state of all tasks
	 */
	private void markAllCompleted(boolean completed) {

		// update the completed state of each item
		suppressStateChanged = true;
		for (ToDoItem task : todos.getList()) {
			task.setDone(completed);
		}
		suppressStateChanged = false;

		// cause the view to refresh the whole list - yes, this is a bit ugly!
		List<ToDoItem> items = new ArrayList<ToDoItem>(todos.getList());
		todos.getList().clear();
		todos.getList().addAll(items);

		updateTaskStatistics();
		saveState();
	}

	/**
	 * Adds a new task based on the user input field
	 */
	private void addTask() {
		String taskTitle = view.getTaskText().trim();

		// if white-space only, do not add a todo
		if (taskTitle.equals(""))
			return;

		ToDoItem toDoItem = new ToDoItem(taskTitle, this);
		view.clearTaskText();
		todos.getList().add(toDoItem);
		updateTaskStatistics();
		saveState();
	}

	/**
	 * Clears completed tasks and updates the view.
	 */
	private void clearCompletedTasks() {
		Iterator<ToDoItem> iterator = todos.getList().iterator();
		while (iterator.hasNext()) {
			ToDoItem item = iterator.next();
			if (item.isDone()) {
				iterator.remove();
			}
		}
		updateTaskStatistics();
		saveState();
	}

	/**
	 * Saves the current to-do items to local storage
	 */
	private void saveState() {
		Storage storage = Storage.getLocalStorageIfSupported();
		if (storage != null) {

			// JSON encode the items
			JSONArray todoItems = new JSONArray();
			for (int i = 0; i < todos.getList().size(); i++) {
				ToDoItem toDoItem = todos.getList().get(i);
				JSONObject jsonObject = new JSONObject();
				jsonObject.put("task", new JSONString(toDoItem.getTitle()));
				jsonObject.put("complete", JSONBoolean.getInstance(toDoItem.isDone()));
				todoItems.set(i, jsonObject);
			}

			// save to local storage
			storage.setItem(STORAGE_KEY, todoItems.toString());
		}
	}

	private void loadState() {
		Storage storage = Storage.getLocalStorageIfSupported();
		if (storage != null) {
			try {
				// get state
				String state = storage.getItem(STORAGE_KEY);

				// parse the JSON array
				JSONArray todoItems = JSONParser.parseStrict(state).isArray();
				for (int i = 0; i < todoItems.size(); i++) {
					// extract the to-do item values
					JSONObject jsonObject = todoItems.get(i).isObject();
					String task = jsonObject.get("task").isString().stringValue();
					boolean completed = jsonObject.get("complete").isBoolean().booleanValue();
					// add a new item to our list
					todos.getList().add(new ToDoItem(task, completed, this));
				}
			} catch (Exception e) {

			}
		}
	}

}
