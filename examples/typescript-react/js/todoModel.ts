/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */

/// <reference path="./interfaces.d.ts"/>

import { Utils } from "./utils";

// Generic "model" object. You can use whatever
// framework you want. For this application it
// may not even be worth separating this logic
// out, but we do this to demonstrate one way to
// separate out parts of your application.
class TodoModel implements ITodoModel {

  public key : string;
  public todos : Array<ITodo>;
  public tags : Array<ITags>;
  public onChanges : Array<any>;

  constructor(key) {
    this.key = key;
    this.tags = Utils.store(key).tags || [];
    this.todos = Utils.store(key).todos || [];
    this.onChanges = [];
  }

  public subscribe(onChange) {
    this.onChanges.push(onChange);
  }

  public inform() {
    Utils.store(this.key, {todos: this.todos, tags: this.tags});
    this.onChanges.forEach(function (cb) { cb(); });
  }

  public addTodo(title : string) {
  	const titleArray = title.split("@");
  	const id = Utils.uuid();

    this.todos = this.todos.concat({
      id: id,
      title: titleArray[0] || title,
      completed: false
    });

    this.addTags(titleArray.slice(1), id)

    this.inform();
  }

  public addTags(tags: string[], id) {
  	tags.forEach(tag => {
		this.tags = this.tags.concat({
			todoId: id,
			id: Utils.uuid(),
			tag: tag
		})
	});
  }

	public toggleAll(checked : Boolean) {
    // Note: It's usually better to use immutable data structures since they're
    // easier to reason about and React works very well with them. That's why
    // we use map(), filter() and reduce() everywhere instead of mutating the
    // array or todo items themselves.
    this.todos = this.todos.map<ITodo>((todo : ITodo) => {
      return Utils.extend({}, todo, {completed: checked});
    });

    this.inform();
  }

  public toggle(todoToToggle : ITodo) {
    this.todos = this.todos.map<ITodo>((todo : ITodo) => {
      return todo !== todoToToggle ?
        todo :
        Utils.extend({}, todo, {completed: !todo.completed});
    });

    this.inform();
  }

  public destroy(todo : ITodo) {
    this.todos = this.todos.filter(function (candidate) {
      return candidate !== todo;
    });

    this.inform();
  }

  public save(todoToSave : ITodo, text : string) {
  	const titleArray = text.split("@");

    this.todos = this.todos.map(function (todo) {
      return todo !== todoToSave ? todo : Utils.extend({}, todo, {title: titleArray[0] || text});
    });


	  this.tags = []
	  titleArray.splice(1).map(tag => {
		  this.tags.push({
			  todoId: todoToSave.id,
			  id: Utils.uuid(),
			  tag: tag
		  })
	  });

    this.inform();
  }

  public clearCompleted() {
    this.todos = this.todos.filter(function (todo) {
      return !todo.completed;
    });

    this.inform();
  }
}

export { TodoModel };
