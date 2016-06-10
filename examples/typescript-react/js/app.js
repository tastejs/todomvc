/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global React, Router*/
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./interfaces.d.ts"/>
var TodoModel_1 = require("./TodoModel");
var footer_1 = require("./footer");
var todoItem_1 = require("./todoItem");
var constants_1 = require("./constants");
var TodoApp = (function (_super) {
    __extends(TodoApp, _super);
    function TodoApp(props) {
        _super.call(this, props);
        this.state = {
            nowShowing: constants_1.ALL_TODOS,
            editing: null
        };
    }
    TodoApp.prototype.componentDidMount = function () {
        var setState = this.setState;
        var router = Router({
            '/': setState.bind(this, { nowShowing: constants_1.ALL_TODOS }),
            '/active': setState.bind(this, { nowShowing: constants_1.ACTIVE_TODOS }),
            '/completed': setState.bind(this, { nowShowing: constants_1.COMPLETED_TODOS })
        });
        router.init('/');
    };
    TodoApp.prototype.handleNewTodoKeyDown = function (event) {
        if (event.keyCode !== constants_1.ENTER_KEY) {
            return;
        }
        event.preventDefault();
        var val = React.findDOMNode(this.refs["newField"]).value.trim();
        if (val) {
            this.props.model.addTodo(val);
            React.findDOMNode(this.refs["newField"]).value = '';
        }
    };
    TodoApp.prototype.toggleAll = function (event) {
        var target = event.target;
        var checked = target.checked;
        this.props.model.toggleAll(checked);
    };
    TodoApp.prototype.toggle = function (todoToToggle) {
        this.props.model.toggle(todoToToggle);
    };
    TodoApp.prototype.destroy = function (todo) {
        this.props.model.destroy(todo);
    };
    TodoApp.prototype.edit = function (todo) {
        this.setState({ editing: todo.id });
    };
    TodoApp.prototype.save = function (todoToSave, text) {
        this.props.model.save(todoToSave, text);
        this.setState({ editing: null });
    };
    TodoApp.prototype.cancel = function () {
        this.setState({ editing: null });
    };
    TodoApp.prototype.clearCompleted = function () {
        this.props.model.clearCompleted();
    };
    TodoApp.prototype.render = function () {
        var _this = this;
        var footer;
        var main;
        var todos = this.props.model.todos;
        var shownTodos = todos.filter(function (todo) {
            switch (_this.state.nowShowing) {
                case constants_1.ACTIVE_TODOS:
                    return !todo.completed;
                case constants_1.COMPLETED_TODOS:
                    return todo.completed;
                default:
                    return true;
            }
        });
        var todoItems = shownTodos.map(function (todo) {
            return (React.createElement(todoItem_1.TodoItem, {"key": todo.id, "todo": todo, "onToggle": _this.toggle.bind(_this, todo), "onDestroy": _this.destroy.bind(_this, todo), "onEdit": _this.edit.bind(_this, todo), "editing": _this.state.editing === todo.id, "onSave": _this.save.bind(_this, todo), "onCancel": function (e) { return _this.cancel(); }}));
        });
        var activeTodoCount = todos.reduce(function (accum, todo) {
            return todo.completed ? accum : accum + 1;
        }, 0);
        var completedCount = todos.length - activeTodoCount;
        if (activeTodoCount || completedCount) {
            footer =
                React.createElement(footer_1.TodoFooter, {"count": activeTodoCount, "completedCount": completedCount, "nowShowing": this.state.nowShowing, "onClearCompleted": function (e) { return _this.clearCompleted(); }});
        }
        if (todos.length) {
            main = (React.createElement("section", {"className": "main"}, React.createElement("input", {"className": "toggle-all", "type": "checkbox", "onChange": function (e) { return _this.toggleAll(e); }, "checked": activeTodoCount === 0}), React.createElement("ul", {"className": "todo-list"}, todoItems)));
        }
        return (React.createElement("div", null, React.createElement("header", {"className": "header"}, React.createElement("h1", null, "todos"), React.createElement("input", {"ref": "newField", "className": "new-todo", "placeholder": "What needs to be done?", "onKeyDown": function (e) { return _this.handleNewTodoKeyDown(e); }, "autoFocus": true})), main, footer));
    };
    return TodoApp;
})(React.Component);
var model = new TodoModel_1.TodoModel('react-todos');
function render() {
    React.render(React.createElement(TodoApp, {"model": model}), document.getElementsByClassName('todoapp')[0]);
}
model.subscribe(render);
render();
