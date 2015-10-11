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
/// <reference path="../typings/react/react-global.d.ts" />
var TodoModel = app.models.TodoModel;
var TodoFooter = app.components.TodoFooter;
var TodoItem = app.components.TodoItem;
var app;
(function (app) {
    var components;
    (function (components) {
        var TodoApp = (function (_super) {
            __extends(TodoApp, _super);
            function TodoApp(props) {
                _super.call(this, props);
                this.state = {
                    nowShowing: app.constants.ALL_TODOS,
                    editing: null
                };
            }
            TodoApp.prototype.componentDidMount = function () {
                var setState = this.setState;
                var router = Router({
                    '/': setState.bind(this, { nowShowing: app.constants.ALL_TODOS }),
                    '/active': setState.bind(this, { nowShowing: app.constants.ACTIVE_TODOS }),
                    '/completed': setState.bind(this, { nowShowing: app.constants.COMPLETED_TODOS })
                });
                router.init('/');
            };
            TodoApp.prototype.handleNewTodoKeyDown = function (event) {
                if (event.keyCode !== app.constants.ENTER_KEY) {
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
                var checked = event.target.checked;
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
                    switch (this.state.nowShowing) {
                        case app.constants.ACTIVE_TODOS:
                            return !todo.completed;
                        case app.constants.COMPLETED_TODOS:
                            return todo.completed;
                        default:
                            return true;
                    }
                }, this);
                var todoItems = shownTodos.map(function (todo) {
                    var _this = this;
                    return (React.createElement(components.TodoItem, {"key": todo.id, "todo": todo, "onToggle": this.toggle.bind(this, todo), "onDestroy": this.destroy.bind(this, todo), "onEdit": this.edit.bind(this, todo), "editing": this.state.editing === todo.id, "onSave": this.save.bind(this, todo), "onCancel": function (e) { return _this.cancel(); }}));
                }, this);
                var activeTodoCount = todos.reduce(function (accum, todo) {
                    return todo.completed ? accum : accum + 1;
                }, 0);
                var completedCount = todos.length - activeTodoCount;
                if (activeTodoCount || completedCount) {
                    footer =
                        React.createElement(components.TodoFooter, {"count": activeTodoCount, "completedCount": completedCount, "nowShowing": this.state.nowShowing, "onClearCompleted": function (e) { return _this.clearCompleted(); }});
                }
                if (todos.length) {
                    main = (React.createElement("section", {"className": "main"}, React.createElement("input", {"className": "toggle-all", "type": "checkbox", "onChange": function (e) { return _this.toggleAll(e); }, "checked": activeTodoCount === 0}), React.createElement("ul", {"className": "todo-list"}, todoItems)));
                }
                return (React.createElement("div", null, React.createElement("header", {"className": "header"}, React.createElement("h1", null, "todos"), React.createElement("input", {"ref": "newField", "className": "new-todo", "placeholder": "What needs to be done?", "onKeyDown": function (e) { return _this.handleNewTodoKeyDown(e); }, "autoFocus": true})), main, footer));
            };
            return TodoApp;
        })(React.Component);
        components.TodoApp = TodoApp;
    })(components = app.components || (app.components = {}));
})(app || (app = {}));
var model = new TodoModel('react-todos');
var TodoApp = app.components.TodoApp;
function render() {
    React.render(React.createElement(TodoApp, {"model": model}), document.getElementsByClassName('todoapp')[0]);
}
model.subscribe(render);
render();
