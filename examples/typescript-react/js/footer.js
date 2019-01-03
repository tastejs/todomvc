"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var classNames = require("classnames");
var React = require("react");
var constants_1 = require("./constants");
var utils_1 = require("./utils");
var TodoFooter = (function (_super) {
    __extends(TodoFooter, _super);
    function TodoFooter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TodoFooter.prototype.render = function () {
        var activeTodoWord = utils_1.Utils.pluralize(this.props.count, 'item');
        var clearButton = null;
        if (this.props.completedCount > 0) {
            clearButton = (React.createElement("button", { className: "clear-completed", onClick: this.props.onClearCompleted }, "Clear completed"));
        }
        var nowShowing = this.props.nowShowing;
        return (React.createElement("footer", { className: "footer" },
            React.createElement("span", { className: "todo-count" },
                React.createElement("strong", null, this.props.count),
                " ",
                activeTodoWord,
                " left"),
            React.createElement("ul", { className: "filters" },
                React.createElement("li", null,
                    React.createElement("a", { href: "#/", className: classNames({ selected: nowShowing === constants_1.ALL_TODOS }) }, "All")),
                ' ',
                React.createElement("li", null,
                    React.createElement("a", { href: "#/active", className: classNames({ selected: nowShowing === constants_1.ACTIVE_TODOS }) }, "Active")),
                ' ',
                React.createElement("li", null,
                    React.createElement("a", { href: "#/completed", className: classNames({ selected: nowShowing === constants_1.COMPLETED_TODOS }) }, "Completed"))),
            clearButton));
    };
    return TodoFooter;
}(React.Component));
exports.TodoFooter = TodoFooter;
