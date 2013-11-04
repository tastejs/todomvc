library todomvc;

import 'dart:html';
import 'dart:math';
import 'dart:convert';

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

	// this is automatically called by JSON.encode
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

/**
 * Escapes HTML-special characters of [text] so that the result can be
 * included verbatim in HTML source code, either in an element body or in an
 * attribute value.
 */
String htmlEscape(String text) {
  return text.replaceAll("&", "&amp;")
             .replaceAll("<", "&lt;")
             .replaceAll(">", "&gt;")
             .replaceAll('"', "&quot;")
             .replaceAll("'", "&apos;");
}
