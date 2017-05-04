import 'package:angular2/angular2.dart';
import 'package:angular_dart_todomvc/components/todo.dart';
import 'package:angular_dart_todomvc/models/item.dart';
import 'package:angular_dart_todomvc/services/todos.dart';

@Component(
  selector: 'todos-list',
  styleUrls: const [],
  template: '''
 <ul id="todo-list">
    <todo-item *ngFor="let item of items" [item]="item"></todo-item>
 </ul>
    ''',
  directives: const [TodoItem],
  providers: const [],
)
class TodosList {
  final TodosService _todos;
  List<Item> get items => _todos.items;
  TodosList(this._todos);
}
