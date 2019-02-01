import _ from "lodash";

const storagekey = "todos::data";

export default class TodoList {
  constructor() {
    this.load();
  }

  load() {
    const data = window.localStorage.getItem(storagekey);
    if (data != null) {
      this.items = JSON.parse(data);
    } else {
      this.items = [];
    }
    this.maxId = _.isEmpty(this.items) ? 0 : _.maxBy(this.items, "id").id;
  }

  save() {
    window.localStorage.setItem(storagekey, JSON.stringify(this.items));
  }

  newId() {
    this.maxId += 1;
    return this.maxId;
  }

  add(name) {
    const item = {
      id: this.newId(),
      name,
      completed: false,
      createdAt: Date.now(),
    };
    this.items.unshift(item);
    this.save();
  }

  delete(todo) {
    this.items = this.items.filter(item => item.id != todo.id);
    this.save();
  }

  toggle(todo) {
    let item = _.find(this.items, it => it.id == todo.id);
    if (item) {
      item.completed = !item.completed;
      if (item.completed) {
        item.completedAt = Date.now();
      }
      this.save();
    }
  }

  rename(id, newName) {
    let item = _.find(this.items, it => it.id == id);
    if (item) {
      item.name = newName;
      this.save();
    }
  }

  filter(status) {
    switch (status) {
      case "active":
        return this.items.filter(item => item.completed == false);
      case "completed":
        return this.items.filter(item => item.completed == true);
      case "all":
      default:
        return this.items;
    }
  }
}
