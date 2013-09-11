library todomvc;

import 'dart:html';
import 'dart:math';
import 'dart:json';

part 'TodoWidget.dart';
part 'TodoApp.dart';

void main() {
	new TodoApp();
}

class Todo {
	String id;
	String title;
	bool completed;

	Todo(String this.id, String this.title, {bool this.completed : false});

	Todo.fromJson(Map json) {
		id = json['id'];
		title = json['title'];
		completed = json['completed'];
	}

	Map toJson() {
		return {'id': id, 'title': title, 'completed': completed};
	}
}

class UUID {
	static Random random = new Random();

	static String createUuid() {
		return "${S4()}${S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}";
	}

	static String S4() {
		return random.nextInt(65536).toRadixString(16);
	}
}
