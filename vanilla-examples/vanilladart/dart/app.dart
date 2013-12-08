library todomvc;

import 'dart:html';
import 'dart:convert';
import 'package:uuid/uuid.dart';

part 'TodoWidget.dart';
part 'TodoApp.dart';

void main() {
	new TodoApp();
}

class Todo {
	String id;
	String title;
	bool completed;

	Todo(this.id, this.title, {this.completed : false});

	Todo.fromJson(Map json) {
		id = json['id'];
		title = json['title'];
		completed = json['completed'];
	}

	// this is automatically called by JSON.encode
	Map toJson() {
		return {
			'id': id,
			'title': title,
			'completed': completed
		};
	}
}
