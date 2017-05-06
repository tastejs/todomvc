import 'package:angular2/angular2.dart';
import 'package:angular_dart_todomvc/services/todos.dart';

@Component(
  selector: 'todomvc-footer',
  template: '''
<footer class="footer" *ngIf="hasItems">
    <span class="todo-count"><strong>{{remaining}}</strong> {{remainingTxt}}</span>
    <button class="clear-completed" (click)="clearCompleted()" *ngIf="completed > 0">Clear completed</button>
</footer>
    '''
)
class TodoMvcFooter {
  final TodosStore _todos;

  TodoMvcFooter(this._todos);

  void clearCompleted() => _todos.clearCompleted();

  bool get hasItems => _todos.items?.isNotEmpty == true;

  int get remaining => _todos.remaining;

  int get completed => _todos.completed;

  String get remainingTxt => remaining == 1 ? "item left" : "items left";
}
