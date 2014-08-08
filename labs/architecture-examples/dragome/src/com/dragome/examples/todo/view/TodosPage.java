package com.dragome.examples.todo.view;

import static com.dragome.model.listeners.KeyListener.KEY_ENTER;
import static com.dragome.model.listeners.KeyListener.KEY_ESC;

import java.util.stream.Stream;

import com.dragome.annotations.PageAlias;
import com.dragome.commons.compiler.annotations.CompilerType;
import com.dragome.commons.compiler.annotations.DragomeCompilerSettings;
import com.dragome.debugging.execution.DragomeVisualActivity;
import com.dragome.examples.todo.model.Todo;
import com.dragome.examples.todo.model.TodoManager;
import com.dragome.forms.bindings.builders.ComponentBuilder;
import com.dragome.forms.bindings.builders.LocalStorage;
import com.dragome.model.interfaces.VisualButton;
import com.dragome.model.interfaces.VisualCheckbox;
import com.dragome.model.interfaces.VisualLabel;
import com.dragome.model.interfaces.VisualLink;
import com.dragome.model.interfaces.VisualPanel;
import com.dragome.model.interfaces.VisualTextField;
import com.dragome.services.ServiceLocator;

@PageAlias(alias= "todo-mvc")
public class TodosPage extends DragomeVisualActivity
{
	public void build()
	{
		TodoManager todoManager= new TodoManager(ServiceLocator.getInstance().getParametersHandler().getFragment(), new LocalStorage());
		ComponentBuilder<TodoManager> componentBuilder= new ComponentBuilder<TodoManager>(mainPanel, todoManager);

		componentBuilder.bindTemplate("new-todo").as(VisualTextField.class).toProperty(TodoManager::getNewTodo, TodoManager::setNewTodo).onKeyUp((v, c) -> todoManager.addTodo(), KEY_ENTER).build();
		ComponentBuilder<TodoManager> mainSectionBuilder= componentBuilder.bindTemplate("main-section").as(VisualPanel.class).childBuilder();
		VisualCheckbox allChecked= mainSectionBuilder.bindTemplate("toggle-all").as(VisualCheckbox.class).toProperty(TodoManager::isAllChecked, TodoManager::setAllChecked).onClick(v -> todoManager.markAll(!todoManager.isAllChecked())).build();
		mainSectionBuilder.show(allChecked).when(() -> !todoManager.getTodos().isEmpty());
		mainSectionBuilder.showWhen(() -> !todoManager.getTodos().isEmpty());

		mainSectionBuilder.bindTemplate("completed-todo").as(VisualPanel.class).toListProperty(TodoManager::getTodos).filter(TodoManager::getStatusFilter).repeat((todo, builder) -> {
			builder.bindTemplate("todo-input").as(VisualTextField.class).toProperty(Todo::getTitle, Todo::setTitle).onKeyUp((v, c) -> todoManager.doneEditing(todo), KEY_ESC, KEY_ENTER).onBlur(v -> todoManager.doneEditing(todo)).build();
			builder.bindTemplate("title").as(VisualLabel.class).toProperty(Todo::getTitle, Todo::setTitle).onDoubleClick(v -> todoManager.editTodo(todo)).build();
			builder.bindTemplate("completed").as(VisualCheckbox.class).toProperty(Todo::isCompleted, Todo::setCompleted).onClick(v -> todoManager.todoCompleted(todo)).build();
			builder.bindTemplate("destroy").as(VisualButton.class).onClick(v -> todoManager.removeTodo(todo)).build();
			builder.styleWith("completed").when(todo::isCompleted);
			builder.styleWith("editing").when(() -> todo == todoManager.getEditedTodo());
		});

		ComponentBuilder<TodoManager> footerBuilder= componentBuilder.bindTemplate("footer-section").as(VisualPanel.class).childBuilder();
		footerBuilder.showWhen(() -> !todoManager.getTodos().isEmpty());
		footerBuilder.bindTemplate("items-count").as(VisualLabel.class).toProperty(TodoManager::getRemainingCount, TodoManager::setRemainingCount).build();
		footerBuilder.bindTemplate("items-label").as(VisualLabel.class).to(() -> todoManager.getRemainingCount() == 1 ? "item" : "items").build();

		Stream.of("/", "/active", "/completed").forEach(location -> {
			VisualLink link= footerBuilder.bindTemplate("filter:" + location).as(VisualLink.class).onClick(v1 -> todoManager.setLocation(location)).build();
			footerBuilder.style(link).with("selected").when(() -> todoManager.getLocation().equals(location));
		});

		ComponentBuilder<TodoManager> clearCompletedBuilder= footerBuilder.bindTemplate("clear-completed").as(VisualPanel.class).onClick(v2 -> todoManager.clearCompletedTodos()).childBuilder();
		clearCompletedBuilder.bindTemplate("clear-completed-number").as(VisualLabel.class).toProperty(TodoManager::getCompletedCount, TodoManager::setCompletedCount).build();
		clearCompletedBuilder.showWhen(() -> todoManager.getCompletedCount() > 0);
	}
}
