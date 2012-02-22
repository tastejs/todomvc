package com.todo.client;

/**
 * An inidividual ToDo item.
 * 
 * @author ceberhardt
 *
 */
public class ToDoItem {
  
  private final ToDoPresenter presenter;
  
  private String text;

  private boolean complete;
  
  public ToDoItem(String text, ToDoPresenter presenter) {
    this.text = text;    
    this.complete = false;
    this.presenter = presenter;
  }

  public ToDoItem(String text, boolean completed, ToDoPresenter presenter) {
    this.text = text;    
    this.complete = completed;    
    this.presenter = presenter;
  }

  public boolean isComplete() {
    return complete;
  }

  public void setComplete(boolean complete) {
    this.complete = complete;
    presenter.itemStateChanged(this);
  }
  
  public void delete() {
    presenter.deleteTask(this);
  }

  public String getText() {
    return text;
  }

  public void setText(String text) {
    this.text = text;
    presenter.itemStateChanged(this);
  }
}
