import 'package:angular2/angular2.dart';
import 'package:angular_dart_todomvc/models/item.dart';
import 'package:angular_dart_todomvc/services/todos.dart';

@Component(
    selector: 'todomvc-header',
    template: '''
<header class="header">
    <h1>todos</h1>
    <input type="text" class="new-todo" placeholder="What needs to be done?" (keydown.enter)="add()" [(ngModel)]="newItem.title" autofocus>
</header>
    ''')
class TodoMvcHeader {
  final TodosStore _todos;

  Item newItem = new Item();

  TodoMvcHeader(this._todos);

  void add() {
    if (!newItem.isEmpty) {
      newItem.normalize();
      _todos.addItem(newItem);
      newItem = new Item();
    }
  }
}
