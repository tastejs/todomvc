import 'package:angular2/core.dart';
import 'package:angular_dart_todomvc/components/footer.dart';
import 'package:angular_dart_todomvc/components/footer_info.dart';
import 'package:angular_dart_todomvc/components/header.dart';
import 'package:angular_dart_todomvc/components/todo_checkall.dart';
import 'package:angular_dart_todomvc/components/todos_list.dart';
import 'package:angular_dart_todomvc/services/todos.dart';

@Component(
  selector: 'todomvc-app',
  styleUrls: const [],
  templateUrl: 'app.html',
  directives: const [TodoMvcHeader, TodoMvcFooter, TodosList, TodoCheckAll, FooterInfo],
  providers: const [TodosStore],
)
class TodoMvcApp {
  final TodosStore _todos;

  bool get hasItems => _todos.items?.isNotEmpty == true;

  TodoMvcApp(this._todos);
}
