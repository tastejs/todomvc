library todomvc;

import 'dart:html';
import 'dart:math';
import 'dart:json';

part 'TodoElement.dart';
part 'TodoApp.dart';

void main() {
  new TodoApp();
}

class Todo {
  String id;
  String title;
  bool completed;
  
  Todo(String this.id, String this.title, [bool this.completed = false]);
  
  String toJson() {
    return '{"id": "$id", "title": "$title", "completed": "$completed"}';
  }
}

class UUID {
  static Random random = new Random();

  static String get() {
    return "${S4()}${S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}";
  }
  
  static String S4() {
    return random.nextInt(65536).toRadixString(16);
  }
}

// Dart has no bool.parse for the moment,see http://code.google.com/p/dart/issues/detail?id=2870 
class Boolean {
  static bool parse(String s) {
    return s == 'true';
  }
}
