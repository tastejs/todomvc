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
