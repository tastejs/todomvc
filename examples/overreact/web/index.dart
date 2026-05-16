import 'dart:html';

// ignore: unused_import
import 'package:over_react/over_react.dart';
import 'package:react/react_client.dart';
import 'package:react/react_dom.dart' as react_dom;
import 'package:todomvc_overreact/components.dart';

void main() {
  setClientConfiguration();

  var content = TodoApp()();

  react_dom.render(content, querySelector('#react-content'));
}
