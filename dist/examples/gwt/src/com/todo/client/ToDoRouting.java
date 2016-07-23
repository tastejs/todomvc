package com.todo.client;

public enum ToDoRouting {
	/**
	 * Displays all todo items.
	 */
	ALL(new MatchAll()),
	/**
	 * Displays active todo items - i.e. those that have not been done.
	 */
	ACTIVE(new MatchActive()),
	/**
	 * Displays completed todo items - i.e. those that have been done.
	 */
	COMPLETED(new MatchCompleted());

	/**
	 * Matcher used to filter todo items, based on some criteria.
	 */
	public interface Matcher {
		/**
		 * Determines whether the given todo item meets the criteria of this matcher.
		 */
		boolean matches(ToDoItem item);
	}

	/**
	 * A matcher that matches any todo item.
	 */
	private static class MatchAll implements Matcher {
		@Override
		public boolean matches(ToDoItem item) {
			return true;
		}
	}

	/**
	 * A matcher that matches only active todo items.
	 */
	private static class MatchActive implements Matcher {
		@Override
		public boolean matches(ToDoItem item) {
			return !item.isCompleted();
		}
	}

	/**
	 * A matcher that matches only completed todo items.
	 */
	private static class MatchCompleted implements Matcher {
		@Override
		public boolean matches(ToDoItem item) {
			return item.isCompleted();
		}
	}

	private final Matcher matcher;

	private ToDoRouting(Matcher matcher) {
		this.matcher = matcher;
	}

	public Matcher getMatcher() {
		return matcher;
	}
}
