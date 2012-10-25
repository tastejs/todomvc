/*
Lavaca 1.0.4
Copyright (c) 2012 Mutual Mobile

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
(function(ns, $, StoredCollection) {

/**
 * @class app.models.Collection
 * @super Lavaca.mvc.Collection
 * A Collection for todos
 */
ns.TodosCollection = StoredCollection.extend(function() {
  StoredCollection.apply(this, arguments);
  this.updateCounts();
}, {
  TModel: ns.Todo,
  /**
   * @method itemsLeft
   * Filters items that have not been marked done
   * @return {Object} The items not marked done
   */
  itemsLeft: function() {
    return this.filter({done: false})
  },
  /**
   * @method itemsCompleted
   * Filters items that have been marked done
   * @return {Object} The items marked done
   */
  itemsCompleted: function() {
    return this.filter({done: true})
  },
  /**
   * @method clearDone
   * Removes all models marked done
   */
  clearDone: function() {
    var models = this.filter({done: true}),
        model,
        i = -1;
    while (model = models[++i]) {
      this.remove(model); 
    }
  },
  removeTodo: function(cid) {
    this.remove({cid: cid});
  },
  addTodo: function(text) {
    return this.add({
      text: text,
      done: false,
      cid: new Date().getTime()
    });
  },
  editTodo: function(cid, text) {
    var todo = this.first({cid: cid});
    if (todo) {
      todo.set('text', text);
    }
    return todo;
  },
  markTodo: function(cid, done) {
    var todo = this.first({cid: cid});
    if (todo) {
      todo.set('done', done);
    }
    return todo;
  },
  onAddItem: function(e) {
    StoredCollection.prototype.onAddItem.apply(this, arguments);
    this.updateCounts();
  },
  onChangeItem: function(e) {
    StoredCollection.prototype.onChangeItem.apply(this, arguments);
    this.updateCounts();
  },
  onRemoveItem: function(e) {
    StoredCollection.prototype.onRemoveItem.apply(this, arguments);
    this.updateCounts();
  },
  updateCounts: function(e) {
    this.set('doneCount', this.filter({done: true}).length);
    this.set('remainingCount', this.filter({done: false}).length);
    this.set('hasDone', this.doneCount > 0);
    this.set('hasRemaining', this.remainingCount > 0);
    this.set('count', this.count());
  }
});

})(app.models, Lavaca.$, app.models.StoredCollection);