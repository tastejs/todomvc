package live.connector.vertxui.samples.client.todomvc;

import java.util.List;

import com.google.gwt.core.client.GWT;

import elemental.events.KeyboardEvent;
import elemental.events.MouseEvent;
import elemental.events.UIEvent;
import live.connector.vertxui.client.fluent.Att;
import live.connector.vertxui.client.fluent.Fluent;
import live.connector.vertxui.samples.client.todomvc.State.Buttons;

public class Controller {

	// State, owned by this controller
	private State state = new State();

	// View and store. The store owns the models.
	private View view;
	private Store store;

	public Controller(Store store, View view) {
		this.store = store;
		this.view = view;

		// Get the initial state for the buttons
		if (GWT.isClient()) {
			String url = Fluent.window.getLocation().getHref();
			int start = url.indexOf("#");
			if (start == -1) {
				state.setButtons(Buttons.All);
			} else {
				url = url.substring(start + 1, url.length());
				if (url.equals("/active")) {
					state.setButtons(Buttons.Active);
				} else if (url.equals("/completed")) {
					state.setButtons(Buttons.Completed);
				} else {
					state.setButtons(Buttons.All);
				}
			}
		}

	}

	public List<Model> getModels() {
		return store.getAll();
	}

	public State getState() {
		return state;
	}

	public void onInput(Fluent fluent, KeyboardEvent event) {
		if (event.getKeyCode() == KeyboardEvent.KeyCode.ENTER) {
			String value = fluent.domValue().trim();
			if (!value.isEmpty()) {
				addModel(value);
				fluent.att(Att.value, "");
			}
		}
	}

	public void addModel(String value) {
		store.add(new Model(value, false));
		view.syncModel();
	}

	public void onSelectAll(Fluent fluent, MouseEvent __) {
		store.setCompletedAll(fluent.domChecked());
		view.syncModel();
	}

	public void onSelect(Fluent fluent, Model model) {
		// It is -unfortunately- very important that we call fluent.domChecked()
		// here, because this also synchronizes the latest visual state into the
		// virtual DOM. If we would not call it (or use it), we would have
		// checkboxes that were still checked when switching from view. This is
		// because Fluent changes as less as possible, and it simply doesn't
		// know that something is changed in the DOM.
		store.setCompleted(model, fluent.domChecked());
		view.syncModel();
	}

	public void onAll(Fluent __, MouseEvent ___) {
		state.setButtons(Buttons.All);
		view.syncState();
	}

	public void onActive(Fluent __, MouseEvent ___) {
		state.setButtons(Buttons.Active);
		view.syncState();
	}

	public void onCompleted(Fluent __, MouseEvent ___) {
		state.setButtons(Buttons.Completed);
		view.syncState();
	}

	public void onDestroy(Model model) {
		store.remove(model);
		view.syncModel();
	}

	public void onClearCompleted(Fluent __, MouseEvent ___) {
		store.removeCompletedAll();
		view.syncModel();
	}

	public void onEditStart(Model item) {
		state.setEditing(item);
		view.syncState();
	}

	public void onEditEnd(Fluent __, UIEvent ___) {
		state.setEditing(null);
		view.syncState();
	}

	public void onEditKey(Fluent fluent, KeyboardEvent event) {
		if (event.getKeyCode() != KeyboardEvent.KeyCode.ENTER) {
			return;
		}
		String value = fluent.domValue().trim();
		Model model = state.getEditing();
		if (!value.isEmpty()) {
			store.setText(model, value);
		} else {
			store.remove(model);
		}
		state.setEditing(null);
		view.syncModel();
		view.syncState();
	}

}
