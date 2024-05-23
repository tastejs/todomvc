package live.connector.vertxui.samples.client.todomvc;

import java.util.ArrayList;
import java.util.List;

import com.github.nmorel.gwtjackson.client.ObjectMapper;
import com.github.nmorel.gwtjackson.client.exception.JsonDeserializationException;
import com.google.gwt.core.client.GWT;

import elemental.html.Storage;
import live.connector.vertxui.client.fluent.Fluent;

public class Store {

	private List<Model> models;

	private Storage storage = Fluent.window.getLocalStorage();

	public Store() {
	}

	public List<Model> getAll() {
		if (models == null) {
			models = new ArrayList<>();

			Storage storage = Fluent.window.getLocalStorage();
			for (int x = 0; x < storage.getLength(); x++) {
				String key = storage.key(x);
				String text = storage.getItem(key);
				try {
					models.add(Store.todoMap.read(text));
				} catch (JsonDeserializationException jde) {
					Fluent.console.log("Warn: could not parse " + text + ": " + jde.getMessage());
					storage.removeItem(key);
				}
			}
		}
		return models;
	}

	public void add(Model model) {
		models.add(model);
		storage.setItem("" + model.getId(), Store.todoMap.write(model));
	}

	public void setCompletedAll(boolean checked) {
		models.stream().forEach(model -> {
			if (model.isCompleted() != checked) {
				model.setCompleted(checked);
				storage.setItem("" + model.getId(), Store.todoMap.write(model));
			}
		});
	}

	public void setCompleted(Model model, boolean checked) {
		model.setCompleted(checked);
		storage.setItem(model.getId() + "", Store.todoMap.write(model));
	}

	public void remove(Model model) {
		models.remove(model);
		storage.removeItem(model.getId() + "");
	}

	public void removeCompletedAll() {
		for (int x = models.size() - 1; x != -1; x--) {
			Model model = models.get(x);
			if (model.isCompleted()) {
				models.remove(x);
				storage.removeItem(model.getId() + "");
			}
		}
	}

	public void setText(Model model, String text) {
		model.setTitle(text);
		storage.setItem(model.getId() + "", Store.todoMap.write(model));
	}

	// Boilerplate for pojo traffic:
	public interface TodoMap extends ObjectMapper<Model> {
	}

	public static TodoMap todoMap = null;
	static {
		if (GWT.isClient()) {
			todoMap = GWT.create(TodoMap.class);
		}
	}

}
