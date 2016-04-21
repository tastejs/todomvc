/// <reference path="../node_modules/backendless/libs/backendless.d.ts" />
/// <reference path="./todo-model.ts" />
/// <reference path="./app-view.ts" />
/// <reference path="./todo-view.ts" />

var todosQuery:Backendless.DataQueryValueI = {
    properties: ['objectId', 'title', 'completed'],
    options: {pageSize: 100, sortBy: 'order asc'}
};

interface todosCountsI {
    total: number;
    remains: number;
}

class TodosList {

    todosViews:TodoView[];
    filter:string;
    el:HTMLUListElement;

    constructor(public appView:AppView) {
        var self = this;

        this.el = <HTMLUListElement>document.querySelector('.todo-list');
        this.todosViews = [];
        this.filter = null;

        //retrieve todos items from the backendless server
        //code below load only todos items of current logged user
        //by default backendless server return only 10 items, we pass "options.pageSize:100" for retrieve the first 100 items
        //also we pass "properties" for retrieve only needed fields of todo item
        TodoStorage.find(todosQuery, new Backendless.Async(function (result:Backendless.CollectionResultI):void {
            for (var i = 0; i < result.data.length; i++) {
                self.renderItem(<Todo>result.data[i]);
                self.appView.updateState();
            }
        }));
    }

    createItem(todo:TodoI):void {
        var todoModel:Todo = new Todo(todo);

        TodoStorage.save(todoModel, new Backendless.Async(function (newItem:TodoI) {
            todoModel.objectId = newItem.objectId;
        }));

        this.renderItem(todoModel);
    }

    renderItem(todo:Todo):void {
        var todoView = new TodoView(todo, this);

        this.todosViews.push(todoView);
        this.el.appendChild(todoView.el);
    }

    removeItem(todoView:TodoView):void {
        this.el.removeChild(todoView.el);
        this.todosViews.splice(this.todosViews.indexOf(todoView), 1);
    }

    removeCompleted():void {
        var toRemove:TodoView[] = [];

        for (var i:number = 0; i < this.todosViews.length; i++) {
            if (this.todosViews[i].data.completed) {
                toRemove.push(this.todosViews[i]);
            }
        }

        for (var j:number = 0; j < toRemove.length; j++) {
            toRemove[j].destroy();
        }
    }

    getCounts():todosCountsI {
        var total:number = this.todosViews.length;
        var remains:number = 0;

        for (var i:number = 0; i < this.todosViews.length; i++) {
            if (!this.todosViews[i].data.completed) {
                remains++;
            }
        }

        return {total: total, remains: remains}
    }

    setFilter(filter:string):void {
        this.filter = filter;

        for (var j:number = 0; j < this.todosViews.length; j++) {
            this.todosViews[j].toggle();
        }
    }

    toggleAll(completed:boolean):void {
        for (var i:number = 0; i < this.todosViews.length; i++) {
            this.todosViews[i].updateCompleted(completed);
        }
    }

    onTodoCompleteChange():void {
        this.appView.updateState();
    }

    onTodoDestroy(todoView:TodoView):void {
        this.removeItem(todoView);

        this.appView.updateState();
    }

}