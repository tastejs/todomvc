import 'package:angular2/angular2.dart';
import 'package:angular_dart_todomvc/models/item.dart';
import 'package:angular_dart_todomvc/services/todos.dart';

@Component(
    selector: 'todo-item',
    template: '''
<li [ngClass]="{'completed': item.completed, 'editing': editing}">
    <div class="view">
        <input type="checkbox" class="toggle" [(ngModel)]="item.completed" (ngModelChange)="save()">
        <label (dblclick)="editTodo()">{{item.title}}</label>
        <button class="destroy" (click)="remove()"></button>
    </div>
    <input type="text" class="edit" [(ngModel)]="item.title" (keyup.escape)="revertEditing()" (keydown.enter)="doneEditing()"  (blur)="doneEditing()">
 </li>
    ''')
class TodoItem {
  @Input()
  Item item;

  Item _editedItem = null;
  Item _previousItem = null;

  final TodosStore _todos;

  TodoItem(this._todos);

  bool get editing => item == _editedItem;

  void editTodo() {
    _editedItem = item;
    _previousItem = item.clone();
  }

  void save() {
    _todos.persist();
  }

  void doneEditing() {
    if (_editedItem == null) {
      return;
    }

    if (_editedItem.isEmpty) {
      _todos.removeItem(item);
    } else {
      _editedItem.normalize();
      save();
    }

    _editedItem = null;
    _previousItem = null;
  }

  void revertEditing() {
    _editedItem = null;
    item.title = _previousItem.title;
    item.completed = _previousItem.completed;
    _previousItem = null;
  }

  void remove() {
    _todos.removeItem(item);
  }
}
