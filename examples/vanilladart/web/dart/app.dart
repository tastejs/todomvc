library todomvc;

import 'dart:html'
    show Element, InputElement, KeyCode, KeyboardEvent, querySelector, window;
import 'dart:convert' show HtmlEscape, JSON;
import 'package:todomvc_vanilladart/models.dart';
import 'package:todomvc_vanilladart/uuid.dart';

part 'TodoWidget.dart';
part 'TodoApp.dart';

void main() {
  new TodoApp();
}
