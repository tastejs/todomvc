import {Component, Prop, h, State, Event, EventEmitter} from '@stencil/core';
import {TodoItemModel} from "./todo-model";
import classNames from 'classnames';

const ESCAPE_KEY = 27;
const ENTER_KEY = 13;


@Component({
  tag: 'todo-item',
  styleUrl: 'todo-item.css',
  shadow: true
})
export class TodoItem {
  @Prop() todo: TodoItemModel;
  @Prop() editing: boolean;
  @State() editText: string;
  @Event() toggle: EventEmitter<string>;
  @Event() destroy: EventEmitter<string>;
  @Event() edit: EventEmitter<string>;
  @Event() save: EventEmitter<{todoId: string, text: string}>;
  @Event() cancel: EventEmitter<void>;

  handleSubmit() {
    let text = this.editText.trim();
    if (text && this.editing) {
      this.save.emit({todoId: this.todo.id, text});
      this.editText = text;
    } else {
      this.destroy.emit();
    }
  }

  handleChange(event) {
    if (this.editing) {
      this.editText = event.target.value;
    }
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.which === ESCAPE_KEY) {
      this.editText = this.todo.title;
      this.cancel.emit();
    } else if (event.which === ENTER_KEY) {
      this.handleSubmit();
    }
  }


  onToggle() {
    this.toggle.emit(this.todo.id);
  }

  handleEdit() {
    this.edit.emit(this.todo.id);
    this.editText = this.todo.title;
  }

  onDestroy() {
    this.destroy.emit(this.todo.id);
  }

  render() {
    return (
      <li class={classNames({
        completed: this.todo.completed,
        editing: this.editing
      })}>
        <div class="view">
          <input
            class="toggle"
            type="checkbox"
            checked={this.todo.completed}
            onChange={_ => this.onToggle()}
          />
          <label onDblClick={_ => this.handleEdit()}>
            {this.todo.title}
          </label>
          <button class="destroy" onClick={_ => this.onDestroy()} />
        </div>
        <input
          class="edit"
          value={this.editText}
          onBlur={_ => this.handleSubmit()}
          onInput={ev => this.handleChange(ev)}
          onKeyDown={ev => this.handleKeyDown(ev)}
        />
      </li>
    );
  }

}
