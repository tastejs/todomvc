/// <reference path="typings/knockout.d.ts" />
var Model;
(function (Model) {
    'use strict';

    var TodoItem = (function () {
        function TodoItem(title, completed) {
            this.title = ko.observable(title);
            this.completed = ko.observable(!!completed);
            this.editing = ko.observable(false);
        }
        return TodoItem;
    })();
    Model.TodoItem = TodoItem;
})(Model || (Model = {}));
