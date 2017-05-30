import { Model } from "ng-backbone";

export class TodoModel extends Model {
  defaults() {
    return {
      title: "",
      completed: false
    }
  }
}
