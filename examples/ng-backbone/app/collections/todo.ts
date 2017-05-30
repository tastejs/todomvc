import { Collection, Model } from "ng-backbone";
import { TodoModel } from "../models/todo";

export class TodoCollection extends Collection {
  localStorage = new Backbone.LocalStorage( "todos" );
  model = TodoModel;
  // getter available in the template scope as todos.allChecked
  getAllChecked(): boolean {
    return this.getCompleted().length === this.length;
  }
  // getter available in the template scope as todos.completed
  getCompleted(): Model[] {
    return this.where({ "completed":  true });
  }
  // getter available in the template scope as todos.remaining
  getRemaining(): Model[] {
    return this.where({ "completed":  false });
  }
}
