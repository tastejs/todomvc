import 'package:angular2/core.dart';
import 'package:angular_dart_todomvc/components/footer.dart';
import 'package:angular_dart_todomvc/components/header.dart';
import 'package:angular_dart_todomvc/components/todos_list.dart';
import 'package:angular_dart_todomvc/models/item.dart';
import 'package:angular_dart_todomvc/services/storage.dart';
import 'package:angular_dart_todomvc/services/todos.dart';

@Component(
  selector: 'todomvc-app',
  styleUrls: const [],
  templateUrl: 'app.html',
  directives: const [TodoMvcHeader, TodoMvcFooter, TodosList],
  providers: const [StorageService, TodosService],
)
class TodoMvcApp {
  final TodosService _todos;
  List<Item> get items => _todos.items;

  TodoMvcApp(this._todos);

  bool get allChecked => items.every((i) => i.completed);

  void set allChecked(value) {
    items.forEach((i) => i.completed = value);
    _todos.persist();
  }
}
