package com.todo.client;

import com.google.gwt.user.client.ui.TextBox;

public class TextBoxWithPlaceholder extends TextBox {

	/**
	 * Sets the placeholder for this textbox
	 *
	 * @param value the placeholder value
	 */
	public void setPlaceholder(String value) {
		getElement().setAttribute("placeholder", value);
	}

	/**
	 * Gets the placeholder for this textbox
	 *
	 * @return the placeholder
	 */
	public String getPlaceholder() {
		return getElement().getAttribute("placeholder");
	}
}
