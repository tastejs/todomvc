/// <reference path="../node_modules/backendless/libs/backendless.d.ts" />

interface TodoI{
    title:string;
    order?:number
    completed?:boolean;
    objectId?:string;
}

class Todo implements TodoI{
    order:number;
    title:string;
    completed:boolean;
    objectId:string;

    constructor(args:TodoI) {
        this.order = new Date().getTime();
        this.title = args && args.title || '';
        this.completed = args && args.completed || false;
    }
}

/**
 * @instance of {@class Backendless.DataStore}
 * @summary interface for manipulation with  data, create/update/save/delete todo items on the Backendless server
 */
var TodoStorage:Backendless.DataStore = Backendless.Persistence.of(Todo);
