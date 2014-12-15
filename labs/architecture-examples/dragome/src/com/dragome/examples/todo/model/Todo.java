package com.dragome.examples.todo.model;

public class Todo
{
	private String title= "";
	private boolean completed;

	public Todo()
	{
	}

	public Todo(Todo todo)
	{
		setTitle(todo.getTitle());
		setCompleted(todo.isCompleted());
	}

	public Todo(String title, boolean done)
	{
		this.title= title;
		this.completed= done;
	}

	public boolean isCompleted()
	{
		return completed;
	}

	public void setCompleted(boolean done)
	{
		this.completed= done;
	}

	public String getTitle()
	{
		return title;
	}

	public void setTitle(String title)
	{
		this.title= title;
	}
}
