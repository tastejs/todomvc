import { Model } from 'backscatter';
import { TaskCollection } from './task';

export default class SessionModel extends Model {

    defaults() {
        return {
            "filter": "all",			// all, active, completed
            "tasks": new TaskCollection
        }
    }
}
