import 'package:angular2/angular2.dart';
import 'package:angular2/router.dart';
import 'package:angular_dart_todomvc/components/footer.dart';
import 'package:angular_dart_todomvc/components/footer_info.dart';
import 'package:angular_dart_todomvc/components/header.dart';
import 'package:angular_dart_todomvc/components/todo_checkall.dart';
import 'package:angular_dart_todomvc/components/todos_list.dart';
import 'package:angular_dart_todomvc/services/todos.dart';

@RouteConfig(const [
  const Route(
      path: TodosList.allPath,
      name: 'TodoAll',
      component: TodosList,
      useAsDefault: true),
  const Route(
      path: TodosList.activePath, name: 'TodoActive', component: TodosList),
  const Route(
      path: TodosList.completedPath,
      name: 'TodoCompleted',
      component: TodosList)
])
@Component(
  selector: 'todomvc-app',
  styleUrls: const [],
  templateUrl: 'app.html',
  directives: const [
    TodoMvcHeader,
    TodoMvcFooter,
    TodosList,
    TodoCheckAll,
    FooterInfo,
    ROUTER_DIRECTIVES
  ],
  providers: const [TodosStore],
)
class TodoMvcApp {
  final TodosStore _todos;

  bool get hasItems => _todos.items?.isNotEmpty == true;

  TodoMvcApp(this._todos);
}
