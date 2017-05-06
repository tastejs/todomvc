import 'package:angular2/angular2.dart';
import 'package:angular2/router.dart';
import 'package:angular_dart_todomvc/services/todos.dart';

@Component(
    selector: 'todomvc-footer',
    directives: const [ROUTER_DIRECTIVES],
    template: '''
<footer class="footer">
    <span class="todo-count"><strong>{{remaining}}</strong> {{remainingTxt}}</span>
    <ul class="filters">
					<li>
						<a [routerLink]="['TodoAll']">All</a>
					</li>
					<li>
						<a [routerLink]="['TodoActive']">Active</a>
					</li>
					<li>
						<a [routerLink]="['TodoCompleted']">Completed</a>
					</li>
		</ul>
    <button class="clear-completed" (click)="clearCompleted()" *ngIf="completed > 0">Clear completed</button>
</footer>
    ''')
class TodoMvcFooter {
  final TodosStore _todos;

  TodoMvcFooter(this._todos);

  void clearCompleted() => _todos.clearCompleted();

  int get remaining => _todos.remaining;

  int get completed => _todos.completed;

  String get remainingTxt => remaining == 1 ? "item left" : "items left";
}
