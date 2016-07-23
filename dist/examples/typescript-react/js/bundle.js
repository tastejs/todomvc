(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./interfaces.d.ts"/>
var utils_1 = require("./utils");
var TodoModel = (function () {
    function TodoModel(key) {
        this.key = key;
        this.todos = utils_1.Utils.store(key);
        this.onChanges = [];
    }
    TodoModel.prototype.subscribe = function (onChange) {
        this.onChanges.push(onChange);
    };
    TodoModel.prototype.inform = function () {
        utils_1.Utils.store(this.key, this.todos);
        this.onChanges.forEach(function (cb) { cb(); });
    };
    TodoModel.prototype.addTodo = function (title) {
        this.todos = this.todos.concat({
            id: utils_1.Utils.uuid(),
            title: title,
            completed: false
        });
        this.inform();
    };
    TodoModel.prototype.toggleAll = function (checked) {
        this.todos = this.todos.map(function (todo) {
            return utils_1.Utils.extend({}, todo, { completed: checked });
        });
        this.inform();
    };
    TodoModel.prototype.toggle = function (todoToToggle) {
        this.todos = this.todos.map(function (todo) {
            return todo !== todoToToggle ?
                todo :
                utils_1.Utils.extend({}, todo, { completed: !todo.completed });
        });
        this.inform();
    };
    TodoModel.prototype.destroy = function (todo) {
        this.todos = this.todos.filter(function (candidate) {
            return candidate !== todo;
        });
        this.inform();
    };
    TodoModel.prototype.save = function (todoToSave, text) {
        this.todos = this.todos.map(function (todo) {
            return todo !== todoToSave ? todo : utils_1.Utils.extend({}, todo, { title: text });
        });
        this.inform();
    };
    TodoModel.prototype.clearCompleted = function () {
        this.todos = this.todos.filter(function (todo) {
            return !todo.completed;
        });
        this.inform();
    };
    return TodoModel;
})();
exports.TodoModel = TodoModel;

},{"./utils":6}],2:[function(require,module,exports){
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

},{"./TodoModel":1,"./constants":3,"./footer":4,"./todoItem":5}],3:[function(require,module,exports){
var ALL_TODOS = 'all';
exports.ALL_TODOS = ALL_TODOS;
var ACTIVE_TODOS = 'active';
exports.ACTIVE_TODOS = ACTIVE_TODOS;
var COMPLETED_TODOS = 'completed';
exports.COMPLETED_TODOS = COMPLETED_TODOS;
var ENTER_KEY = 13;
exports.ENTER_KEY = ENTER_KEY;
var ESCAPE_KEY = 27;
exports.ESCAPE_KEY = ESCAPE_KEY;

},{}],4:[function(require,module,exports){
/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global React */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./interfaces.d.ts"/>
var constants_1 = require("./constants");
var utils_1 = require("./utils");
var TodoFooter = (function (_super) {
    __extends(TodoFooter, _super);
    function TodoFooter() {
        _super.apply(this, arguments);
    }
    TodoFooter.prototype.render = function () {
        var activeTodoWord = utils_1.Utils.pluralize(this.props.count, 'item');
        var clearButton = null;
        if (this.props.completedCount > 0) {
            clearButton = (React.createElement("button", {"className": "clear-completed", "onClick": this.props.onClearCompleted}, "Clear completed"));
        }
        var nowShowing = this.props.nowShowing;
        return (React.createElement("footer", {"className": "footer"}, React.createElement("span", {"className": "todo-count"}, React.createElement("strong", null, this.props.count), " ", activeTodoWord, " left"), React.createElement("ul", {"className": "filters"}, React.createElement("li", null, React.createElement("a", {"href": "#/", "className": classNames({ selected: nowShowing === constants_1.ALL_TODOS })}, "All")), ' ', React.createElement("li", null, React.createElement("a", {"href": "#/active", "className": classNames({ selected: nowShowing === constants_1.ACTIVE_TODOS })}, "Active")), ' ', React.createElement("li", null, React.createElement("a", {"href": "#/completed", "className": classNames({ selected: nowShowing === constants_1.COMPLETED_TODOS })}, "Completed"))), clearButton));
    };
    return TodoFooter;
})(React.Component);
exports.TodoFooter = TodoFooter;

},{"./constants":3,"./utils":6}],5:[function(require,module,exports){
/*jshint quotmark: false */
/*jshint white: false */
/*jshint trailing: false */
/*jshint newcap: false */
/*global React */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./interfaces.d.ts"/>
var constants_1 = require("./constants");
var TodoItem = (function (_super) {
    __extends(TodoItem, _super);
    function TodoItem(props) {
        _super.call(this, props);
        this.state = { editText: this.props.todo.title };
    }
    TodoItem.prototype.handleSubmit = function (event) {
        var val = this.state.editText.trim();
        if (val) {
            this.props.onSave(val);
            this.setState({ editText: val });
        }
        else {
            this.props.onDestroy();
        }
    };
    TodoItem.prototype.handleEdit = function () {
        this.props.onEdit();
        this.setState({ editText: this.props.todo.title });
    };
    TodoItem.prototype.handleKeyDown = function (event) {
        if (event.keyCode === constants_1.ESCAPE_KEY) {
            this.setState({ editText: this.props.todo.title });
            this.props.onCancel(event);
        }
        else if (event.keyCode === constants_1.ENTER_KEY) {
            this.handleSubmit(event);
        }
    };
    TodoItem.prototype.handleChange = function (event) {
        var input = event.target;
        this.setState({ editText: input.value });
    };
    TodoItem.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        return (nextProps.todo !== this.props.todo ||
            nextProps.editing !== this.props.editing ||
            nextState.editText !== this.state.editText);
    };
    TodoItem.prototype.componentDidUpdate = function (prevProps) {
        if (!prevProps.editing && this.props.editing) {
            var node = React.findDOMNode(this.refs["editField"]);
            node.focus();
            node.setSelectionRange(node.value.length, node.value.length);
        }
    };
    TodoItem.prototype.render = function () {
        var _this = this;
        return (React.createElement("li", {"className": classNames({
            completed: this.props.todo.completed,
            editing: this.props.editing
        })}, React.createElement("div", {"className": "view"}, React.createElement("input", {"className": "toggle", "type": "checkbox", "checked": this.props.todo.completed, "onChange": this.props.onToggle}), React.createElement("label", {"onDoubleClick": function (e) { return _this.handleEdit(); }}, this.props.todo.title), React.createElement("button", {"className": "destroy", "onClick": this.props.onDestroy})), React.createElement("input", {"ref": "editField", "className": "edit", "value": this.state.editText, "onBlur": function (e) { return _this.handleSubmit(e); }, "onChange": function (e) { return _this.handleChange(e); }, "onKeyDown": function (e) { return _this.handleKeyDown(e); }})));
    };
    return TodoItem;
})(React.Component);
exports.TodoItem = TodoItem;

},{"./constants":3}],6:[function(require,module,exports){
var Utils = (function () {
    function Utils() {
    }
    Utils.uuid = function () {
        var i, random;
        var uuid = '';
        for (i = 0; i < 32; i++) {
            random = Math.random() * 16 | 0;
            if (i === 8 || i === 12 || i === 16 || i === 20) {
                uuid += '-';
            }
            uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
                .toString(16);
        }
        return uuid;
    };
    Utils.pluralize = function (count, word) {
        return count === 1 ? word : word + 's';
    };
    Utils.store = function (namespace, data) {
        if (data) {
            return localStorage.setItem(namespace, JSON.stringify(data));
        }
        var store = localStorage.getItem(namespace);
        return (store && JSON.parse(store)) || [];
    };
    Utils.extend = function () {
        var objs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            objs[_i - 0] = arguments[_i];
        }
        var newObj = {};
        for (var i = 0; i < objs.length; i++) {
            var obj = objs[i];
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    newObj[key] = obj[key];
                }
            }
        }
        return newObj;
    };
    return Utils;
})();
exports.Utils = Utils;

},{}]},{},[2]);
