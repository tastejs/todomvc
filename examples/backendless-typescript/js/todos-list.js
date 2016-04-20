/// <reference path="../node_modules/backendless/libs/backendless.d.ts" />
/// <reference path="./todo-model.ts" />
/// <reference path="./app-view.ts" />
/// <reference path="./todo-view.ts" />
var todosQuery = {
    properties: ['objectId', 'title', 'completed'],
    options: { pageSize: 100, sortBy: 'order asc' }
};
var TodosList = (function () {
    function TodosList(appView) {
        this.appView = appView;
        var self = this;
        this.el = document.querySelector('.todo-list');
        this.todosViews = [];
        this.filter = null;
        //retrieve todos items from the backendless server
        //code below load only todos items of current logged user
        //by default backendless server return only 10 items, we pass "options.pageSize:100" for retrieve the first 100 items
        //also we pass "properties" for retrieve only needed fields of todo item
        TodoStorage.find(todosQuery, new Backendless.Async(function (result) {
            for (var i = 0; i < result.data.length; i++) {
                self.renderItem(result.data[i]);
                self.appView.updateState();
            }
        }));
    }
    TodosList.prototype.createItem = function (todo) {
        var todoModel = new Todo(todo);
        this.renderItem(todoModel);
        TodoStorage.save(todoModel, new Backendless.Async(function (newItem) {
            todoModel.objectId = newItem.objectId;
        }));
    };
    TodosList.prototype.renderItem = function (todo) {
        var todoView = new TodoView(todo, this);
        this.todosViews.push(todoView);
        this.el.appendChild(todoView.el);
    };
    TodosList.prototype.removeItem = function (todoView) {
        this.el.removeChild(todoView.el);
        this.todosViews.splice(this.todosViews.indexOf(todoView), 1);
    };
    TodosList.prototype.removeCompleted = function () {
        var toRemove = [];
        for (var i = 0; i < this.todosViews.length; i++) {
            if (this.todosViews[i].data.completed) {
                toRemove.push(this.todosViews[i]);
            }
        }
        for (var j = 0; j < toRemove.length; j++) {
            toRemove[j].destroy();
        }
    };
    TodosList.prototype.getCounts = function () {
        var total = this.todosViews.length;
        var remains = 0;
        for (var i = 0; i < this.todosViews.length; i++) {
            if (!this.todosViews[i].data.completed) {
                remains++;
            }
        }
        return { total: total, remains: remains };
    };
    TodosList.prototype.setFilter = function (filter) {
        this.filter = filter;
        for (var j = 0; j < this.todosViews.length; j++) {
            this.todosViews[j].toggle();
        }
    };
    TodosList.prototype.toggleAll = function (completed) {
        for (var i = 0; i < this.todosViews.length; i++) {
            this.todosViews[i].updateCompleted(completed);
        }
    };
    TodosList.prototype.onTodoCompleteChange = function () {
        this.appView.updateState();
    };
    TodosList.prototype.onTodoDestroy = function (todoView) {
        this.removeItem(todoView);
        this.appView.updateState();
    };
    return TodosList;
}());
