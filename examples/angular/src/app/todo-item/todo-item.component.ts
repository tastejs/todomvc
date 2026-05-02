import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, AfterViewChecked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Todo } from '../todos.service';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './todo-item.component.html',
})
export class TodoItemComponent implements AfterViewChecked {
  @Input({ required: true }) todo!: Todo;

  @Output() remove = new EventEmitter<Todo>();

  @ViewChild('todoInputRef') inputRef?: ElementRef<HTMLInputElement>;

  title = '';
  isEditing = false;

  // Track which edit session we've already focused so we don't re-focus
  // on every change-detection pass while editing.
  private focusedFor: Todo | null = null;

  toggleTodo(): void {
    this.todo.completed = !this.todo.completed;
  }

  removeTodo(): void {
    this.remove.emit(this.todo);
  }

  startEdit(): void {
    this.isEditing = true;
  }

  handleFocus(_event: Event): void {
    this.title = this.todo.title;
  }

  commitEdit(): void {
    if (!this.isEditing) return;
    const text = this.title.trim();
    this.isEditing = false;
    if (text.length === 0) {
      this.remove.emit(this.todo);
    } else {
      this.todo.title = text;
    }
  }

  cancelEdit(): void {
    this.title = this.todo.title;
    this.isEditing = false;
  }

  ngAfterViewChecked(): void {
    if (this.isEditing && this.focusedFor !== this.todo) {
      this.inputRef?.nativeElement.focus();
      this.focusedFor = this.todo;
    } else if (!this.isEditing && this.focusedFor) {
      this.focusedFor = null;
    }
  }
}
