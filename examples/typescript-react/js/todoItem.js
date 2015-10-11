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
/// <reference path="../typings/react/react-global.d.ts" />
/// <reference path="./interfaces.d.ts"/>
var app;
(function (app) {
    var components;
    (function (components) {
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
                if (event.which === app.constants.ESCAPE_KEY) {
                    this.setState({ editText: this.props.todo.title });
                    this.props.onCancel(event);
                }
                else if (event.which === app.constants.ENTER_KEY) {
                    this.handleSubmit(event);
                }
            };
            TodoItem.prototype.handleChange = function (event) {
                this.setState({ editText: event.target.value });
            };
            /**
             * This is a completely optional performance enhancement that you can
             * implement on any React component. If you were to delete this method
             * the app would still work correctly (and still be very performant!), we
             * just use it as an example of how little code it takes to get an order
             * of magnitude performance improvement.
             */
            TodoItem.prototype.shouldComponentUpdate = function (nextProps, nextState) {
                return (nextProps.todo !== this.props.todo ||
                    nextProps.editing !== this.props.editing ||
                    nextState.editText !== this.state.editText);
            };
            /**
             * Safely manipulate the DOM after updating the state when invoking
             * `this.props.onEdit()` in the `handleEdit` method above.
             * For more info refer to notes at https://facebook.github.io/react/docs/component-api.html#setstate
             * and https://facebook.github.io/react/docs/component-specs.html#updating-componentdidupdate
             */
            TodoItem.prototype.componentDidUpdate = function (prevProps) {
                if (!prevProps.editing && this.props.editing) {
                    var node = React.findDOMNode(this.refs["editField"]);
                    node.focus();
                    node.setSelectionRange(node.value.length, node.value.length);
                }
            };
            TodoItem.prototype.render = function () {
                var _this = this;
                return (React.createElement("li", {"className": React.addons.classSet({
                    completed: this.props.todo.completed,
                    editing: this.props.editing
                })}, React.createElement("div", {"className": "view"}, React.createElement("input", {"className": "toggle", "type": "checkbox", "checked": this.props.todo.completed, "onChange": this.props.onToggle}), React.createElement("label", {"onDoubleClick": function (e) { return _this.handleEdit(); }}, this.props.todo.title), React.createElement("button", {"className": "destroy", "onClick": this.props.onDestroy})), React.createElement("input", {"ref": "editField", "className": "edit", "value": this.state.editText, "onBlur": function (e) { return _this.handleSubmit(e); }, "onChange": function (e) { return _this.handleChange(e); }, "onKeyDown": function (e) { return _this.handleKeyDown(e); }})));
            };
            return TodoItem;
        })(React.Component);
        components.TodoItem = TodoItem;
    })(components = app.components || (app.components = {}));
})(app || (app = {}));
