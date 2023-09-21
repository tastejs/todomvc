import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewChecked, ChangeDetectionStrategy } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Todo } from "../todo";

@Component({
    selector: "app-todo-item",
    templateUrl: "./todo-item.component.html",
    // This strategy ensures that the item will only re-render when the todo data changes.
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoItemComponent implements AfterViewChecked {
    @Input() todo: Todo = {
        id: "",
        title: "",
        completed: false,
    };

    @Input() index: number = 0;

    @Output() deleteEvent = new EventEmitter<Todo>();

    @ViewChild("todoInputRef") inputRef: ElementRef | undefined;

    titleFormControl = new FormControl("");

    isEditing = false;

    toggleTodo(): void {
        this.todo.completed = !this.todo.completed;
    }

    removeTodo(): void {
        this.deleteEvent.emit(this.todo);
    }

    startEdit() {
        this.isEditing = true;
    }

    handleBlur(e: Event) {
        this.isEditing = false;
    }

    handleFocus(e: Event) {
        this.titleFormControl.setValue(this.todo.title);
    }

    updateTodo() {
        const title = this.titleFormControl.getRawValue()?.trimEnd();
        if (!title)
            this.deleteEvent.emit(this.todo);
        else
            this.todo.title = title;

        this.isEditing = false;
    }

    ngAfterViewChecked(): void {
        if (this.isEditing)
            this.inputRef?.nativeElement.focus();
    }
}
