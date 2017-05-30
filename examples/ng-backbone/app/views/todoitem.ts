import { Component, View, Collection, Model } from "ng-backbone";
import { ENTER_KEY, ESCAPE_KEY, FILTER_ACTIVE, FILTER_COMPLETED } from "../constants";

@Component({
  el: ".todo-item",
  events: {
    "click .toggle": "toggleCompletion",
    "dblclick label": "editTodo",
    "click .destroy": "removeTodo",
    "keyup .edit": "updateEditing",
    "blur .edit": "saveEditing"
  },
  template: `
  <div class="view">
    <input class="toggle" type="checkbox" data-ng-prop="'checked', todo.completed">
    <label data-ng-text="todo.title"></label>
    <button class="destroy"></button>
  </div>
  <input class="edit" data-ng-attr="'value', todo.title">
`
})

export class TodoItemView extends View {
  todo: Model;
  edit: HTMLInputElement;

  // Make a shortcut for `todo` scope model and auto-render
  initialize(){
    this.todo = this.models.get( "todo" );
    this.render();
  }

  // Obtain .edit node reference on mounting
  componentDidMount(){
    this.edit = this.$( ".edit" ).get( 0 ) as HTMLInputElement;
  }

  // Toggle visibility of the item according to the specified filter param
  filter( filter: string ): void {
    switch( filter ) {
      case FILTER_ACTIVE:
        return this.toggleVisible( !this.todo.get( "completed" ) );
      case FILTER_COMPLETED:
        return this.toggleVisible( this.todo.get( "completed" ) );
      default:
        return this.toggleVisible( true );
    }
  }

  // Show/hide the view
  toggleVisible( toggle: boolean ): void {
    this.el.classList.toggle( "hidden", !toggle );
  }

  // Toggle item state by click on .toggle
  toggleCompletion(){
    let completed =  Boolean( this.todo.get( "completed" ) );
    this.todo.set( "completed", !completed );
    this.todo.save();
  }

  // Remove an item from the list
  removeTodo(){
    // Collection updates asynchronously, so on fast repeating remove the model may not esits anymore
    if ( !this.todo ) {
      return;
    }
    this.remove();
    this.todo.destroy();
    this.todo = null;
  }

  // Switch to editing mode
  editTodo(){
    this.el.classList.toggle( "editing", true );
    this.edit.focus();
  }

  // Handle keyup while editing
  updateEditing( e: KeyboardEvent ): void {
    if ( e.which === ENTER_KEY ) {
      return this.saveEditing();
    }
    if ( e.which === ESCAPE_KEY ) {
      return this.stopEditing();
    }
  }
  // Save the edited value
  private saveEditing(): void {
    let value: string = this.edit.value.trim();
    if ( value ) {
      this.todo.set( "title", value );
      this.todo.save();
    } else {
      this.removeTodo();
    }
    this.stopEditing();
  }
  // Leave editing mode
  private stopEditing(){
    if ( this.todo ) {
      this.edit.value = this.todo.get( "title" );
    }
    this.el.classList.toggle( "editing", false );
  }

}
