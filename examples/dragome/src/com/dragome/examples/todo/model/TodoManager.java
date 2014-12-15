package com.dragome.examples.todo.model;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.dragome.forms.bindings.builders.LocalStorage;
import com.dragome.forms.bindings.builders.Tester;

public class TodoManager
{
    private List<Todo> todos= new ArrayList<Todo>();
    private String newTodo= "";
    private Todo editedTodo;
    private String location= "/";
    private Todo originalTodo;
    private Tester<Todo> statusFilter;
    private boolean allChecked;
    private long completedCount;
    private long remainingCount;
    private LocalStorage localStorage;

    public TodoManager()
    {
    }

    public TodoManager(String location, LocalStorage localStorage)
    {
	this.localStorage= localStorage;
	setTodos(localStorage.load("todos-dragome"));
	setLocation(location);
    }

    public void addTodo()
    {
	String tempNewTodo= getNewTodo().trim();
	if (tempNewTodo.length() == 0)
	    return;

	getTodos().add(new Todo(tempNewTodo, false));
	setNewTodo("");

	update();
    }

    private void update()
    {
	calculate();
	setTodos(getTodos());
    }

    private void calculate()
    {
	if (getTodos() != null)
	{
	    setRemainingCount(getTodos().stream().filter(t -> !t.isCompleted()).count());
	    setCompletedCount(getTodos().size() - remainingCount);
	    allChecked= remainingCount == 0;
	}
    }
    public void clearCompletedTodos()
    {
	setTodos(getTodos().stream().filter(t -> !t.isCompleted()).collect(Collectors.toList()));
	update();
    }

    public void doneEditing(Todo todo)
    {
	setEditedTodo(null);
	todo.setTitle(todo.getTitle().trim());

	if (todo.getTitle().length() == 0)
	    removeTodo(todo);
    }
    public void editTodo(Todo todo)
    {
	setEditedTodo(todo);
	originalTodo= new Todo(todo);
	setTodos(todos);
    }
    public long getCompletedCount()
    {
	return completedCount;
    }
    public Todo getEditedTodo()
    {
	return editedTodo;
    }
    public String getLocation()
    {
	return location;
    }

    public String getNewTodo()
    {
	return newTodo;
    }

    public Todo getOriginalTodo()
    {
	return originalTodo;
    }

    public long getRemainingCount()
    {
	return remainingCount;
    }

    public Tester<Todo> getStatusFilter()
    {
	return statusFilter;
    }

    public List<Todo> getTodos()
    {
	return todos;
    }

    public boolean isAllChecked()
    {
	return allChecked;
    }

    public void markAll(boolean completed)
    {
	getTodos().stream().forEach(t -> t.setCompleted(completed));
    }

    public void removeTodo(Todo todo)
    {
	getTodos().remove(todo);
	update();
    }

    public void revertEditing(Todo todo)
    {
	getTodos().set(getTodos().indexOf(todo), originalTodo);
	doneEditing(originalTodo);
    }

    public void setAllChecked(boolean allChecked)
    {
	this.allChecked= allChecked;
	update();
    }

    public void setCompletedCount(long completedCount)
    {
	this.completedCount= completedCount;
	setTodos(todos);
    }

    public void setEditedTodo(Todo editedTodo)
    {
	this.editedTodo= editedTodo;
    }

    public void setLocation(String location)
    {
	this.location= location != null ? location : "/";

	if (this.location.equals("/"))
	    setStatusFilter(t -> true);
	else if (this.location.equals("/active"))
	    setStatusFilter(t -> !t.isCompleted());
	else if (this.location.equals("/completed"))
	    setStatusFilter(t -> t.isCompleted());

	update();
    }

    public void setNewTodo(String newTodo)
    {
	this.newTodo= newTodo;
    }

    public void setOriginalTodo(Todo originalTodo)
    {
	this.originalTodo= originalTodo;
    }

    public void setRemainingCount(long remainingCount)
    {
	this.remainingCount= remainingCount;
    }

    public void setStatusFilter(Tester<Todo> statusFilter)
    {
	this.statusFilter= statusFilter;
	update();
    }

    public void setTodos(List<Todo> todos)
    {
	if (todos == null)
	    todos= new ArrayList<Todo>();

	this.todos= todos;
	localStorage.save("todos-dragome", todos);
    }

    public void todoCompleted(Todo todo)
    {
	int i= todo.isCompleted() ? -1 : 1;
	setRemainingCount(remainingCount + i);
	setCompletedCount(completedCount + (i * -1));
    }
}
