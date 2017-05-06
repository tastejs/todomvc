import 'package:angular2/platform/browser.dart';
import 'package:angular_dart_todomvc/components/app/app.dart';
import 'package:angular_dart_todomvc/services/storage.dart';

void main() {
  bootstrap(TodoMvcApp, [StorageService]);
}
