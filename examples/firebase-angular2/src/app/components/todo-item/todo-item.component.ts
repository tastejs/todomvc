import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'todo-item',
  templateUrl: './todo-item.component.html',
})
export class TodoItemComponent implements OnInit {

  @Input() todo;

  @Output() itemModified = new EventEmitter();

  @Output() itemRemoved = new EventEmitter();

  editing = false;

  constructor() { }

  ngOnInit() {
  }

  cancelEditing() {
    this.editing = false;
  }

  stopEditing(editedTitle) {
    this.todo.title = editedTitle.value;
    this.editing = false;

    if (this.todo.title.length === 0) {
      this.remove();
    } else {
      this.update();
    }
  }

  edit() {
    this.editing = true;
  }

  toggleCompletion() {
    this.todo.completed = !this.todo.completed;
    this.update();
  }

  remove() {
    this.itemRemoved.next(this.todo.uid);
  }

  update() {
    this.todo.title = this.todo.title.trim();
    this.itemModified.next(this.todo);
  }
}
