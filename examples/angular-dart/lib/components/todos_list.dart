import 'package:angular2/angular2.dart';
import 'package:angular2/platform/common.dart';
import 'package:angular2/router.dart';
import 'package:angular_dart_todomvc/components/todo.dart';
import 'package:angular_dart_todomvc/models/item.dart';
import 'package:angular_dart_todomvc/services/todos.dart';

@Component(
    selector: 'todos-list',
    template: '''
 <ul class="todo-list">
    <todo-item *ngFor="let item of items" [item]="item"></todo-item>
 </ul>
    ''',
    directives: const [TodoItem])
class TodosList {
  static const allPath = "/";
  static const completedPath = "/completed";
  static const activePath = "/active";

  final Location _location;
  final TodosStore _todos;

  TodosList(this._todos, this._location);

  Iterable<Item> get items {
    return _todos.items.where((Item item) {
      if (_completed && item.completed == true) {
        return true;
      }

      if (_active && item.completed == false) {
        return true;
      }

      return _all;
    });
  }

  bool get _completed => _location.path() == completedPath;

  bool get _active => _location.path() == activePath;

  bool get _all => _location.path() == allPath || _location.path().isEmpty;
}
