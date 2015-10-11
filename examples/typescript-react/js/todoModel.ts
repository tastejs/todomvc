/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */

/// <reference path="../typings/react/react-global.d.ts" />
/// <reference path="./interfaces.d.ts"/>

namespace app.models {

  // Generic "model" object. You can use whatever
  // framework you want. For this application it
  // may not even be worth separating this logic
  // out, but we do this to demonstrate one way to
  // separate out parts of your application.
  export class TodoModel implements ITodoModel {

    public key : any;
    public todos : Array<ITodo>;
    public onChanges : Array<any>;

    constructor(key) {
      this.key = key;
      this.todos = app.miscelanious.Utils.store(key);
      this.onChanges = [];
    }

    public subscribe(onChange) {
      this.onChanges.push(onChange);
    }

    public inform() {
      app.miscelanious.Utils.store(this.key, this.todos);
      this.onChanges.forEach(function (cb) { cb(); });
    }

    public addTodo(title : string) {
      this.todos = this.todos.concat({
        id: app.miscelanious.Utils.uuid(),
        title: title,
        completed: false
      });

      this.inform();
    }

    public toggleAll(checked) {
      // Note: it's usually better to use immutable data structures since they're
      // easier to reason about and React works very well with them. That's why
      // we use map() and filter() everywhere instead of mutating the array or
      // todo items themselves.
      this.todos = this.todos.map<ITodo>((todo : ITodo) => {
        return app.miscelanious.Utils.extend({}, todo, {completed: checked});
      });

      this.inform();
    }

    public toggle(todoToToggle) {
      this.todos = this.todos.map<ITodo>((todo : ITodo) => {
        return todo !== todoToToggle ?
          todo :
          app.miscelanious.Utils.extend({}, todo, {completed: !todo.completed});
      });

      this.inform();
    }

    public destroy(todo) {
      this.todos = this.todos.filter(function (candidate) {
        return candidate !== todo;
      });

      this.inform();
    }

    public save(todoToSave, text) {
      this.todos = this.todos.map(function (todo) {
        return todo !== todoToSave ? todo : app.miscelanious.Utils.extend({}, todo, {title: text});
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

}
