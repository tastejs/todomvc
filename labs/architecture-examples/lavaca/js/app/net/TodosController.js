/*
Lavaca 1.0.4
Copyright (c) 2012 Mutual Mobile

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
(function(ns, Controller, TodosCollection, Promise, $) {

/**
 * @class app.net.TodoController
 * @super Lavaca.mvc.Controller
 * Todo controller
 */
ns.TodosController = Controller.extend({
  /**
   * @method Todos
   * todos action, creates a history state and shows a view
   *
   * @param {Object} params  Action arguments
   * @param {Object} collection  History state model
   * @return {Lavaca.util.Promise}  A promise
   */
  home: function(params, model) {
    return this
      .view('home', app.ui.views.TodosView, app.models.get('todos'))
      .then(this.history(model, 'Lavaca Todos', params.url));
  },
  /**
   * @method clear
   * Removes all items from the to-do list
   *
   * @param {Object} params  Action arguments
   * @param {Object} collection  History state model
   * @return {Lavaca.util.Promise}  A promise
   */
  clear: function(params, model) {
    var list = app.models.get('todos');
    list.clearDone();
    return new Promise(this).resolve();
  },
  /**
   * @method remove
   * Removes an item from the to-do list
   *
   * @param {Object} params  Action arguments
   * @param {Object} collection  History state model
   * @return {Lavaca.util.Promise}  A promise
   */
  remove: function(params, model) {
    var list = app.models.get('todos');
    list.removeTodo(params.cid);
    return new Promise(this).resolve();
  },
  /**
   * @method add
   * Adds an item to the to-do list
   *
   * @param {Object} params  Action arguments
   * @param {Object} collection  History state model
   * @return {Lavaca.util.Promise}  A promise
   */
  add: function(params, model) {
    var list = app.models.get('todos'),
        todo = list.addTodo(params.text);
    return new Promise(this).resolve(todo);
  },
  /**
   * @method edit
   * Edits an item in the to-do list
   *
   * @param {Object} params  Action arguments
   * @param {Object} collection  History state model
   * @return {Lavaca.util.Promise}  A promise
   */
  edit: function(params, model) {
    var list = app.models.get('todos'),
        promise = new Promise(this);
    if (list.editTodo(params.cid, params.text)) {
      promise.resolve();
    } else {
      promise.reject();
    }
    return promise;
  },
  /**
   * @method mark
   * Marks an item in the to-do list either done or undone
   *
   * @param {Object} params  Action arguments
   * @param {Object} collection  History state model
   * @return {Lavaca.util.Promise}  A promise
   */
  mark: function(params, model) {
    var list = app.models.get('todos'),
        promise = new Promise(this);
    if (list.markTodo(params.cid, params.done)) {
      promise.resolve();
    } else {
      promise.reject();
    }
    return promise;
  },
  /**
   * @method lang
   * Switches the user to a specific language
   *
   * @param {Object} params  Action arguments
   * @param {Object} model  History state model
   * @return {Lavaca.util.Promise} A promise
   */
  lang: function(params, model) {
    var locale = params.locale || 'en_US';
    Lavaca.util.Translation.setDefault(locale);
    localStorage.setItem('app:lang', locale);
    this.viewManager.flush();
    app.state.set('lang', locale);
    return this.redirect('/?lang={0}', [locale]);
  }
});

})(Lavaca.resolve('app.net', true), Lavaca.mvc.Controller, app.models.TodosCollection, Lavaca.util.Promise, Lavaca.$);