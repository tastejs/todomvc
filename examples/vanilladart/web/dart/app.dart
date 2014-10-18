library todomvc;

import 'dart:html'
  show Element, InputElement, KeyCode, KeyboardEvent, querySelector, window;
import 'dart:convert' show HtmlEscape, JSON;
import 'package:uuid/uuid.dart';
import 'package:todomvc_vanilladart/models.dart' show Todo;

part 'TodoWidget.dart';
part 'TodoApp.dart';

void main() {
	new TodoApp();
}
