"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClearCompletedEvent = exports.ToggleAllTodoEvent = exports.EditTodoEvent = exports.DeleteTodoEvent = exports.AddTodoEvent = void 0;
/**
 * An event that represents a request to add a new todo.
 */
class AddTodoEvent extends Event {
    constructor(text) {
        super(AddTodoEvent.eventName, { bubbles: true, composed: true });
        this.text = text;
    }
}
exports.AddTodoEvent = AddTodoEvent;
AddTodoEvent.eventName = "todo-add";
/**
 * An event that represents a request to delete a todo.
 */
class DeleteTodoEvent extends Event {
    constructor(id) {
        super(DeleteTodoEvent.eventName, { bubbles: true, composed: true });
        this.id = id;
    }
}
exports.DeleteTodoEvent = DeleteTodoEvent;
DeleteTodoEvent.eventName = "todo-delete";
/**
 * An event that represents a request to toggle the completion state of a todo.
 */
class EditTodoEvent extends Event {
    constructor(edit) {
        super(EditTodoEvent.eventName, { bubbles: true, composed: true });
        this.edit = edit;
    }
}
exports.EditTodoEvent = EditTodoEvent;
EditTodoEvent.eventName = "todo-edit";
/**
 * An event that represents a request to toggle the completion state of a todo.
 */
class ToggleAllTodoEvent extends Event {
    constructor() {
        super(ToggleAllTodoEvent.eventName, { bubbles: true, composed: true });
    }
}
exports.ToggleAllTodoEvent = ToggleAllTodoEvent;
ToggleAllTodoEvent.eventName = "todo-toggle-all";
/**
 * An event that represents a request to clear all completed todos.
 */
class ClearCompletedEvent extends Event {
    constructor() {
        super(ClearCompletedEvent.eventName, { bubbles: true, composed: true });
    }
}
exports.ClearCompletedEvent = ClearCompletedEvent;
ClearCompletedEvent.eventName = "clear-completed";
