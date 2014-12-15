/*******************************************************************************
 * Copyright (c) 2011-2014 Fernando Petrola
 * 
 *  This file is part of Dragome SDK.
 * 
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the GNU Public License v3.0
 * which accompanies this distribution, and is available at
 * http://www.gnu.org/licenses/gpl.html
 ******************************************************************************/
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
		copyFrom(todo);
	}

	public void copyFrom(Todo todo)
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
