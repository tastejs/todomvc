package com.todo.client;

import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.Element;
import com.google.gwt.dom.client.SpanElement;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.KeyCodes;
import com.google.gwt.event.dom.client.KeyUpEvent;
import com.google.gwt.event.dom.client.KeyUpHandler;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.cellview.client.CellList;
import com.google.gwt.user.cellview.client.HasKeyboardSelectionPolicy.KeyboardSelectionPolicy;
import com.google.gwt.user.client.ui.Anchor;
import com.google.gwt.user.client.ui.CheckBox;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.Widget;
import com.google.gwt.view.client.AbstractDataProvider;
import com.todo.client.ToDoPresenter.ViewEventHandler;

/**
 * A view for the {@link ToDoPresenter}
 *
 */
public class ToDoView extends Composite implements ToDoPresenter.View {

  private static ToDoViewUiBinder uiBinder = GWT.create(ToDoViewUiBinder.class);

  interface ToDoViewUiBinder extends UiBinder<Widget, ToDoView> {
  }

  @UiField
  TextBoxWithPlaceholder taskText;

  @UiField
  SpanElement remainingTasksCount;

  @UiField
  SpanElement remainingTasksLabel;

  @UiField
  Element mainSection;

  @UiField
  Element todoStatsContainer;

  @UiField
  SpanElement clearTasksCount;

  @UiField
  SpanElement clearTasksLabel;

  @UiField
  Anchor clearCompleted;

  @UiField
  CheckBox toggleAllCheckBox;

  @UiField(provided = true)
  CellList<ToDoItem> todoTable = new CellList<ToDoItem>(new ToDoCell());

  public ToDoView() {
    initWidget(uiBinder.createAndBindUi(this));

    // removes the yellow highlight
    todoTable.setKeyboardSelectionPolicy(KeyboardSelectionPolicy.DISABLED);

    // add IDs to the elements that have ui:field attributes. This is required because the UiBinder
    // does not permit the addition of ID attributes to elements marked with ui:field.
    // *SIGH*
    mainSection.setId("main");
    clearCompleted.getElement().setId("clear-completed");
    taskText.getElement().setId("new-todo");
  }

  @Override
  public String getTaskText() {
    return taskText.getText();
  }

  @Override
  public void addhandler(final ViewEventHandler handler) {

    // wire-up the events from the UI to the presenter.

		toggleAllCheckBox.addClickHandler(new ClickHandler() {
			@Override
			public void onClick(ClickEvent event) {
				handler.markAllCompleted(toggleAllCheckBox.getValue());
			}
		});

    taskText.addKeyUpHandler(new KeyUpHandler() {
      @Override
      public void onKeyUp(KeyUpEvent event) {
        if (event.getNativeKeyCode() == KeyCodes.KEY_ENTER) {
          handler.addTask();
        }
      }
    });

    clearCompleted.addClickHandler(new ClickHandler() {
      @Override
      public void onClick(ClickEvent event) {
        handler.clearCompletedTasks();
      }
    });
  }

  @Override
  public void setDataProvider(AbstractDataProvider<ToDoItem> data) {
    data.addDataDisplay(todoTable);
  }

  @Override
  public void clearTaskText() {
    taskText.setText("");
  }

  @Override
  public void setTaskStatistics(int totalTasks, int completedTasks) {
    int remainingTasks = totalTasks - completedTasks;

    hideElement(mainSection, totalTasks == 0);
    hideElement(todoStatsContainer, totalTasks == 0);
    hideElement(clearCompleted.getElement(), completedTasks == 0);

    remainingTasksCount.setInnerText(Integer.toString(remainingTasks));
    remainingTasksLabel.setInnerText(remainingTasks > 1 || remainingTasks == 0 ? "items" : "item");
    clearTasksCount.setInnerHTML(Integer.toString(completedTasks));
    clearTasksLabel.setInnerText(completedTasks > 1 ? "items" : "item");

    toggleAllCheckBox.setValue(totalTasks == completedTasks);
  }

  private void hideElement(Element element, boolean hide) {
    if (hide) {
    	element.setAttribute("style", "display:none;");
    } else {
    	element.setAttribute("style", "display:block;");
    }
  }
}
