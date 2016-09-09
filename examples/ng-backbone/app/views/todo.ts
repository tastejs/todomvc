import { Component, View, Collection, Model } from "ng-backbone";
import { TodoCollection } from "../collections/todo";
import { TodoItemView } from "./todoitem";
import { ENTER_KEY } from "../constants";

@Component({
  el: "todo-app",
  events: {
    "keyup .new-todo": "onAddTodo",
    "click .toggle-all": "toogleAll",
    "click .clear-completed": "clearCompleted"
  },
  models: {
    state: new Model({
      filter: ""
    })
  },
  collections: {
    todos: new TodoCollection()
  },
  views: {
    items: [ TodoItemView, function( view: TodoView, el: HTMLElement ){
      return {
        models: {
          todo: view.findModel( el )
        }
      };
    }]
  },
  template: `<section class="todoapp">
	<header class="header">
		<h1>todos</h1>
		<input class="new-todo" placeholder="What needs to be done?" autofocus="" >
	</header>
	<section class="main" data-ng-if="todos.length">
    <input class="toggle-all" type="checkbox" data-ng-prop="'checked', todos.allChecked">
		<ul class="todo-list">
			<li class="todo-item" data-ng-for="let todo of todos"
        data-ng-class="'editing', todo.editing"
        data-ng-class-0="'completed', todo.completed"
        data-ng-data="'id', todo.id">
			</li>
		</ul>
	</section>
  <footer class="footer" data-ng-if="todos.length">
		<span class="todo-count">
      <strong data-ng-text="todos.remaining.length">0</strong> item<span data-ng-if="todos.remaining.length !== 1">s</span> left
    </span>
    <ul class="filters">
      <li>
        <a href="#/" data-ng-class="'selected', !state.filter">All</a>
      </li>
      <li>
        <a href="#/active" data-ng-class="'selected', state.filter === 'active'">Active</a>
      </li>
      <li>
        <a href="#/completed" data-ng-class="'selected', state.filter === 'completed'">Completed</a>
      </li>
    </ul>
    <button class="clear-completed" data-ng-class="'hidden', !todos.completed.length">Clear completed</button>
	</footer>
</section>
`
})

export class TodoView extends View {
  // Shortcut for scope collection
  todos: TodoCollection;
  // Shortcut for scope model, which reflects view router state
  state: Model;

  initialize(){
    this.listenTo( this, "filter", this.onFilter );
    this.todos = this.collections.get( "todos" ) as TodoCollection;
    this.state = this.models.get( "state" );
    this.todos.fetch();
    this.render();
  }

  // We use this method in @Component subview constructor to map subview to the model of the collection
  findModel( el: HTMLElement ): NgBackbone.Model {
    let model: NgBackbone.Model;
    this.todos.forEach(( todo: NgBackbone.Model ) => {
      if ( todo.id === el.dataset[ "id" ] ) {
        model = todo;
      }
    });
    return model;
  }

  // Handle router event
  onFilter( filter: string ){
    this.state.set( "filter", filter );
    this.views.getAll( "items" ).forEach(( view: any ) => {
      view.filter( filter );
    });
  }

  // Handle keyup event on .new-todo
  onAddTodo( e: KeyboardEvent ): void {
    if ( e.which === ENTER_KEY ) {
      e.preventDefault();
      this.addTodo( e.target as HTMLInputElement );
    }
  }

  // Actually adding an item to the list
  private addTodo( el: HTMLInputElement ): void {
    let value: string = el.value.trim();
    if ( value ) {
      this.todos.create({
        title: value,
        completed: false
      });
      el.value = "";
    }
  }

  // Toggle all complete
  toogleAll(): void {
    let allChecked = this.todos.getAllChecked();
    this.todos.forEach(( todo: Model ) => {
      todo.set( "completed", !allChecked );
      todo.save();
    });
  }

  // Clear all completed items
  clearCompleted(){
    this.todos
      .getCompleted()
      .forEach(( todo: Model ) => {
        todo.destroy();
      })
  }

}
