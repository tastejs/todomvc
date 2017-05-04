import 'package:angular2/angular2.dart';
import 'package:angular_dart_todomvc/models/item.dart';
import 'package:angular_dart_todomvc/services/todos.dart';

@Component(
  selector: 'todomvc-header',
  styleUrls: const [],
  template: '''
<header id="header">
    <h1>todos</h1>
    <input type="text" id="new-todo" placeholder="What needs to be done?" [(ngModel)]="newItem.title" autofocus (keyup.enter)="add()">
</header>
    ''',
  directives: const [],
  providers: const [],
)
class TodoMvcHeader {
  final TodosService _todos;

  Item newItem = new Item();

  TodoMvcHeader(this._todos);

  void add() {
    if (newItem.isEmpty) {
      return;
    }
    newItem.normalize();
    _todos.addItem(newItem);
    newItem = new Item();
  }
}
