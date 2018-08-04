import {IoNode} from "../node_modules/io/build/io.js";

export class TodoModel extends IoNode {
  static get properties() {
    return {
      items: Array,
      filters: function () {
        return {
          '': function () {
            return true;
          },
          active: function(item) {
            return !item.completed;
          },
          completed: function(item) {
            return item.completed;
          }
        }
      }
    };
  }
  constructor() {
    super();
    const items = JSON.parse(localStorage.getItem('todoapp'));
    if (items) this.items = items;
  }
  newItem(title) {
    title = String(title).trim();
    if (title) {
      this.items.push({title: title, completed: false});
      this.dispatchEvent('io-object-mutated', {object: this}, false, window);
      this.save();
    }
  }
  getCompletedCount() {
    return this.items ? this.items.filter(this.filters.completed).length : 0;
  }
  getActiveCount() {
    return this.items ? (this.items.length - this.getCompletedCount(this.items)) : 0;
  }
  destroyItem(item) {
    var i = this.items.indexOf(item);
    this.items.splice(i, 1)
    this.dispatchEvent('io-object-mutated', {object: this}, false, window);
    this.save();
  }
  updateItemTitle(item, title) {
    title = String(title).trim();
    if (title) {
      var i = this.items.indexOf(item);
      this.items[i].title = title;
      this.dispatchEvent('io-object-mutated', {object: this}, false, window);
      this.save();
    }
  }
  toggleItem(item) {
    item.completed = !item.completed;
    this.dispatchEvent('io-object-mutated', {object: this}, false, window);
    this.save();
  }
  clearCompletedItems() {
    this.items = this.items.filter(this.filters.active);
    this.dispatchEvent('io-object-mutated', {object: this}, false, window);
    this.save();
  }
  toggleItemsCompleted() {
    let completed = !(this.items.length === this.getCompletedCount());
    for (var i = this.items.length; i--;) {
      this.items[i].completed = completed;
    }
    this.dispatchEvent('io-object-mutated', {object: this}, false, window);
    this.save();
  }
  save() {
    localStorage.setItem('todoapp', JSON.stringify(this.items));
  }
}

TodoModel.Register();
