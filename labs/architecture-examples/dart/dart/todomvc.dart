library todomvc;

import 'dart:html';

part 'TodoElement.dart';
part 'TodoApp.dart';

void main() {
  new TodoApp();
}

class Todo {
  int id;
  String title;
  bool completed;
  Todo(this.title, this.completed);
}
