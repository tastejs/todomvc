package live.connector.vertxui.samples.client.todomvc;

import static live.connector.vertxui.client.fluent.Fluent.Footer;
import static live.connector.vertxui.client.fluent.Fluent.H1;
import static live.connector.vertxui.client.fluent.Fluent.Input;
import static live.connector.vertxui.client.fluent.Fluent.Li;
import static live.connector.vertxui.client.fluent.Fluent.Ul;
import static live.connector.vertxui.client.fluent.FluentBase.body;

import java.util.List;
import java.util.function.Predicate;

import com.google.gwt.core.client.EntryPoint;

import live.connector.vertxui.client.fluent.Att;
import live.connector.vertxui.client.fluent.Css;
import live.connector.vertxui.client.fluent.Fluent;
import live.connector.vertxui.client.fluent.ViewOn;
import live.connector.vertxui.client.fluent.ViewOnBoth;
import live.connector.vertxui.samples.client.todomvc.State.Buttons;

public class View implements EntryPoint {

	// Views
	private ViewOnBoth<State, List<Model>> list;
	private ViewOnBoth<State, List<Model>> footer;
	private ViewOn<List<Model>> toggle;

	public static String[] css = { "css/base.css", "css/index.css" };

	@Override
	public void onModuleLoad() {
		Store store = new Store();
		Controller controller = new Controller(store, this);
		start(controller);
	}

	public void start(Controller controller) {

		// Initialise models
		List<Model> modelsInit = controller.getModels();
		State stateInit = controller.getState();

		// Initialise views:

		// Static upper part
		// search for id=startpoint
		Fluent container = Fluent.getElementById("startpoint");
		if (container == null) { // if the existing index.html is not found
			// Note: todomvc is also the extend-an-existing-index.html example
			// for vertxui.
			body.classs("learn-bar").aside();
			container = body.section("todoapp");
		}

		// Header with H1 and Input
		container.header("header", H1(null, "todos"), Input("new-todo").att(Att.placeholder, "What needs to be done?")
				.att(Att.autofocus, "1").keydown(controller::onInput));

		// Main view
		Fluent main = container.section("main").css(Css.display, "block");

		// The toggle
		toggle = main.add(modelsInit, models -> {
			boolean allChecked = models.size() != 0 && models.stream().filter(x -> !x.isCompleted()).count() == 0;

			// Actually main should have display:none when no models
			return Input("toggle-all", "checkbox").att(Att.checked, allChecked ? "1" : null)
					.css(Css.display, models.size() == 0 ? "none" : null).click(controller::onSelectAll);
		});

		// The list of items
		list = main.add(stateInit, modelsInit, (state, models) -> {

			// Which models should be displayed?
			Predicate<Model> filter = p -> (state.getButtons() == Buttons.All)
					|| (p.isCompleted() == (state.getButtons() == Buttons.Completed));

			// Return an Unordered List with LIsted items.
			return Ul("todo-list", models.stream().filter(filter).map(item -> {

				Fluent li = Li(item.isCompleted() ? "completed" : null);

				Fluent div = li.div("view");

				// Someone has doubleclicked
				if (item == state.getEditing()) {
					// add 'editing' to the existing class
					li.classs(li.classs() != null ? li.classs() + " editing" : "editing");

					// add an extra input field
					li.input("edit").att(Att.value, item.getTitle()).keydown(controller::onEditKey)
							.blur(controller::onEditEnd);
				}

				div.input("toggle", "checkbox").att(Att.checked, item.isCompleted() ? "1" : null)
						.click((fluent, event) -> controller.onSelect(fluent, item));

				div.label(null, item.getTitle()).dblclick((fluent, event) -> controller.onEditStart(item));

				div.button("destroy", "button", null).click((f, e) -> controller.onDestroy(item));

				return div;
			}));
		});

		// Footer
		footer = main.add(stateInit, modelsInit, (state, models) -> {

			// Footer
			Fluent footer = Footer("footer").css(Css.display, models.size() == 0 ? "none" : "block");

			// Counter
			Fluent counter = footer.span("todo-count");
			long count = models.stream().filter(t -> !t.isCompleted()).count();
			counter.strong(null, count + "");
			if (count == 1) {
				// this is exceptional and bad style, combining plain text and
				// html. however this is how the todomvc example should work
				counter.textNode(" item left");
			} else {
				// this is exceptional and bad style, combining plain text and
				// html. however this is how the todomvc example should work
				counter.textNode(" items left");
			}

			// Buttons
			Fluent buttons = footer.ul("filters");
			buttons.li().a((state.getButtons() == Buttons.All ? "selected" : null), "All", "#/", controller::onAll);
			buttons.li().a((state.getButtons() == Buttons.Active ? "selected" : null), "Active", "#/active",
					controller::onActive);
			buttons.li().a((state.getButtons() == Buttons.Completed ? "selected" : null), "Completed", "#/completed",
					controller::onCompleted);

			// "Clear Completed" button
			if (count != modelsInit.size()) {
				footer.button("clear-completed", "button", "Clear completed").css(Css.display, "block")
						.click(controller::onClearCompleted);
			}
			return footer;
		});
	}

	public void syncModel() {
		list.sync();
		footer.sync();
		toggle.sync();
	}

	public void syncState() {
		list.sync();
		footer.sync();
	}

}
