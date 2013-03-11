package com.todo.client;

import java.util.Date;

import com.google.gwt.cell.client.AbstractCell;
import com.google.gwt.cell.client.ValueUpdater;
import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.DivElement;
import com.google.gwt.dom.client.Element;
import com.google.gwt.dom.client.EventTarget;
import com.google.gwt.dom.client.InputElement;
import com.google.gwt.dom.client.NativeEvent;
import com.google.gwt.event.dom.client.KeyCodes;
import com.google.gwt.safehtml.client.SafeHtmlTemplates;
import com.google.gwt.safehtml.shared.SafeHtml;
import com.google.gwt.safehtml.shared.SafeHtmlBuilder;
import com.google.gwt.safehtml.shared.SafeHtmlUtils;

/**
 * A cell that renders {@link ToDoItem} instances. This cell is rendered in both view and edit modes
 * based on user interaction. In edit mode, browser events are handled in order to update the model
 * item state.
 *
 * @author ceberhardt
 *
 */
public class ToDoCell extends AbstractCell<ToDoItem> {

	/**
	 * The HTML templates used to render the cell.
	 */
	interface Templates extends SafeHtmlTemplates {

		/**
		 * The view-mode template
		 */
		@SafeHtmlTemplates.Template("<div class='{2}' data-timestamp='{3}'>" + "{0} "
				+ "<label>{1}</label>" + "<button class='destroy'></a>" + "</div>")
		SafeHtml view(SafeHtml checked, SafeHtml task, String done, String timestamp);

		/**
		 * A template the renders a checked input
		 */
		@SafeHtmlTemplates.Template("<input class='toggle' type='checkbox' checked>")
		SafeHtml inputChecked();

		/**
		 * A template the renders an un-checked input
		 */
		@SafeHtmlTemplates.Template("<input class='toggle' type='checkbox'>")
		SafeHtml inputClear();

		/**
		 * The edit-mode template
		 */
		@SafeHtmlTemplates.Template("<div class='listItem editing'><input class='edit' value='{0}' type='text'></div>")
		SafeHtml edit(String task);
	}

	private static Templates templates = GWT.create(Templates.class);

	/**
	 * The item that is currently being edited
	 */
	private ToDoItem editingItem = null;

	/**
	 * A flag that indicates that we are starting to edit the cell
	 */
	private boolean beginningEdit = false;

	public ToDoCell() {
		super("click", "keyup", "blur", "dblclick");
	}

	@Override
	public void render(Context context, ToDoItem value, SafeHtmlBuilder sb) {
		// render the cell in edit or view mode
		if (isEditing(value)) {
			SafeHtml rendered = templates.edit(value.getTitle());
			sb.append(rendered);
		} else {
			SafeHtml rendered =
					templates.view(value.isDone() ? templates.inputChecked() : templates.inputClear(),
							SafeHtmlUtils.fromString(value.getTitle()), value.isDone() ? "listItem view completed"
									: "listItem view",
							// NOTE: The addition of a timestamp here is a bit of a HACK! The problem
							// is that the CellList uses a HasDataPresenter for rendering. This class
							// caches the more recent rendered contents for each cell, skipping a render
							// if it looks like the cell hasn't changed. However, this fails for editable cells
							// that are able to change the DOM representation directly. This hack simply
							// ensures that the presenter always renders the cell.
							Long.toString(new Date().getTime()));
			sb.append(rendered);
		}
	}

	@Override
	public boolean isEditing(Context context, Element parent, ToDoItem value) {
		return isEditing(value);
	}

	@Override
	public void onBrowserEvent(Context context, Element parent, ToDoItem value, NativeEvent event,
			ValueUpdater<ToDoItem> valueUpdater) {

		String type = event.getType();

		if (isEditing(value)) {

			// handle keyup events
			if ("keyup".equals(type)) {
				int keyCode = event.getKeyCode();

				// handle enter key to commit the edit
				if (keyCode == KeyCodes.KEY_ENTER) {
					commitEdit(parent, value);
					endEdit(context, parent, value);
				}

				// handle escape key to cancel the edit
				if (keyCode == KeyCodes.KEY_ESCAPE) {
					endEdit(context, parent, value);
				}
			}

			// handle blur event
			if ("blur".equals(type) && !beginningEdit) {
				commitEdit(parent, value);
				endEdit(context, parent, value);
			}

		} else {

			// handle double clicks to enter edit more
			if ("dblclick".equals(type)) {
				beginEdit(context, parent, value);

				beginningEdit = true;
				InputElement input = getInputElement(parent);
				input.focus();
				beginningEdit = false;
			}

			// when not in edit mode - handle click events on the cell
			if ("click".equals(type)) {

				EventTarget eventTarget = event.getEventTarget();
				Element clickedElement = Element.as(eventTarget);
				String tagName = clickedElement.getTagName();

				// check whether the checkbox was clicked
				if (tagName.equals("INPUT")) {

					// if so, synchronise the model state
					InputElement input = clickedElement.cast();
					value.setDone(input.isChecked());

					// update the 'row' style
					if (input.isChecked()) {
						getViewRootElement(parent).addClassName("completed");
					} else {
						getViewRootElement(parent).removeClassName("completed");
					}

				} else if (tagName.equals("BUTTON")) {
					// if the delete anchor was clicked - delete the item
					value.delete();
				}
			}
		}

	}

	/**
	 * Commits the changes in text value to the ToDoItem
	 */
	private void commitEdit(Element parent, ToDoItem value) {
		InputElement input = getInputElement(parent);
		value.setTitle(input.getValue());
	}

	/**
	 * Begins editing the given item, rendering the cell in edit mode
	 */
	private void beginEdit(Context context, Element parent, ToDoItem value) {
		editingItem = value;
		renderCell(context, parent, value);
	}

	/**
	 * Ends editing the given item, rendering the cell in view mode
	 */
	private void endEdit(Context context, Element parent, ToDoItem value) {
		editingItem = null;
		renderCell(context, parent, value);
	}

	/**
	 * Renders the cell, replacing the contents of the parent with the newly rendered content.
	 */
	private void renderCell(Context context, Element parent, ToDoItem value) {
		SafeHtmlBuilder sb = new SafeHtmlBuilder();
		render(context, value, sb);
		parent.setInnerHTML(sb.toSafeHtml().asString());
	}

	/**
	 * Gets whether the given item is being edited.
	 */
	private boolean isEditing(ToDoItem item) {
		return editingItem == item;
	}

	/**
	 * Get the input element in edit mode.
	 */
	private InputElement getInputElement(Element parent) {
		return parent.getFirstChild().getFirstChild().<InputElement> cast();
	}

	/**
	 * Gets the root DIV element of the view mode template.
	 */
	private DivElement getViewRootElement(Element parent) {
		return parent.getFirstChild().<DivElement> cast();
	}

}
