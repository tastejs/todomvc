/*
Lavaca 1.0.4
Copyright (c) 2012 Mutual Mobile

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
(function(ns, $, Collection, LocalStore) {

/**
 * @class app.models.Collection
 * @super Lavaca.mvc.Collection
 * A Collection for todos
 */
ns.StoredCollection = Collection.extend(function(id, models, map) {
  this.store = new this.TStore(id);
  var savedModels = this.store.all();
  Collection.call(this, models ? savedModels.concat(models) : savedModels, map);
  this
    .on('addItem', this.onAddItem, this)
    .on('changeItem', this.onChangeItem, this)
    .on('removeItem', this.onRemoveItem, this);
},{
  TStore: LocalStore,
  storeItem: function(model) {
    this.store.set(model.id(), model);
  },
  unstoreItem: function(model) {
    this.store.remove(model.id());
  },
  onAddItem: function(e) {
    this.storeItem(e.model);
  },
  onChangeItem: function(e) {
    this.storeItem(e.model);
  },
  onRemoveItem: function(e) {
    this.unstoreItem(e.model);
  }
});

})(app.models, Lavaca.$, Lavaca.mvc.Collection, Lavaca.storage.LocalStore);