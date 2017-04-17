import _ from 'underscore';
import { Model, Collection } from 'backscatter';

export class TaskModel extends Model {
    defaults() {
        return {
            "description": "",
            "completed": false
        }
    }

    validate(attr) {
        return !attr.description.length && "Task description must contain some text"
    }

    toggleCompleted() {
        this.set({"completed": !this.get('completed')});
    }
}

export class TaskCollection extends Collection {
    toggleCompleted() {
        this.invoke('set', 'completed', _.all(this.pluck('completed')) ? false : true);
    }

    removeCompleted() {
        this.remove(this.where({completed: true}));
    }
}

TaskCollection.prototype.model = TaskModel;
