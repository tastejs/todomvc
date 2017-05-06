import 'package:angular2/angular2.dart';
import 'package:angular_dart_todomvc/services/todos.dart';

@Component(
    selector: 'todomvc-checkall',
    template: '''
<input class="toggle-all" type="checkbox" [(ngModel)]="allChecked">
    ''')
class TodoCheckAll {
  final TodosStore _todos;

  TodoCheckAll(this._todos);

  bool get allChecked => _todos.allChecked;

  void set allChecked(value) {
    _todos.allChecked = value;
  }
}
