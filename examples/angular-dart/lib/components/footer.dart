import 'package:angular2/angular2.dart';
import 'package:angular_dart_todomvc/models/item.dart';
import 'package:angular_dart_todomvc/services/todos.dart';

@Component(
  selector: 'todomvc-footer',
  styleUrls: const [],
  template: '''
<footer id="footer" *ngIf="items.isNotEmpty">
    <span id="todo-count"><strong>{{remaining}}</strong> {{remainingTxt}}</span>
    <button id="clear-completed" (click)="clearCompleted()" *ngIf="completed > 0">Clear completed</button>
</footer>
    ''',
  directives: const [],
  providers: const [],
)
class TodoMvcFooter {
  final TodosService _todos;
  List<Item> get items => _todos.items;

  TodoMvcFooter(this._todos);

  void clearCompleted() {
    items.removeWhere((i) => i.completed);
  }

  int get remaining => items.where((item) => !item.completed).length;

  int get completed => items.where((item) => item.completed).length;

  String get remainingTxt => remaining == 1 ? "item left" : "items left";
}
