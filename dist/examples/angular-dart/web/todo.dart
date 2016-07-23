library todo;

import 'dart:html' as dom;
import 'dart:convert' as convert;
import 'package:angular/angular.dart';


class StorageService {
	final dom.Storage _storage = dom.window.localStorage;
	static const String STORAGE_KEY = 'todos-angulardart';

	List<Item> loadItems() {
		final String data = _storage[STORAGE_KEY];

		if (data == null) {
			return [];
		}

		final List<Map> rawItems = convert.JSON.decode(data);
		return rawItems.map((item) => new Item.fromJson(item)).toList();
	}

	void saveItems(List<Item> items) {
		_storage[STORAGE_KEY] = convert.JSON.encode(items);
	}
}


class Item {
	String title;
	bool completed;

	Item([this.title = '', this.completed = false]);

	Item.fromJson(Map obj) {
		this.title = obj['title'];
		this.completed = obj['completed'];
	}

	bool get isEmpty => title.trim().isEmpty;

	Item clone() => new Item(this.title, this.completed);

	String toString() => completed ? '[X]' : '[ ]' + ' ${this.title}';

	void normalize() {
		title = title.trim();
	}

	// This is method is called when from JSON.encode.
	Map toJson() => { 'title': title, 'completed': completed };
}


@NgDirective(
	selector: '[todo-controller]',
	publishAs: 'todo'
)
class TodoController {
	List<Item> items = [];
	Item newItem = new Item();
	Item editedItem = null;
	Item previousItem = null;

	StorageService _storageService;

	TodoController(Scope scope, StorageService storage) {
		items = storage.loadItems();
		_storageService = storage;

		// Since there is no native support for deeply watching collections, we
		// instead watch over the JSON-serialized string representing the items.
		// While hugely inefficient, this is a very simple work-around.
		scope.$watch((Scope scope) => convert.JSON.encode(items), save);
	}

	void save() {
		_storageService.saveItems(items);
	}

	void add() {
		if (newItem.isEmpty) {
			return;
		}

		newItem.normalize();
		items.add(newItem);
		newItem = new Item();
	}

	void remove(Item item) {
		items.remove(item);
	}

	void clearCompleted() {
		items.removeWhere((i) => i.completed);
	}

	int remaining() {
		return items.where((item) => !item.completed).length;
	}

	int completed() {
		return items.where((item) => item.completed).length;
	}

	int total() {
		return items.length;
	}

	bool get allChecked {
		return items.every((i) => i.completed);
	}

	void set allChecked(value) {
		items.forEach((i) => i.completed = value);
	}

	void editTodo(Item item) {
		editedItem = item;
		previousItem = item.clone();
	}

	void doneEditing() {
		if (editedItem == null) {
			return;
		}

		if (editedItem.isEmpty) {
			items.remove(editedItem);
		}

		editedItem.normalize();
		editedItem = null;
		previousItem = null;
	}

	void revertEditing(Item item) {
		editedItem = null;
		item.title = previousItem.title;
		previousItem = null;
	}
}
