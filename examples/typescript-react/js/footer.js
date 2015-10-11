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
/// <reference path="../typings/react/react-global.d.ts" />
/// <reference path="./interfaces.d.ts"/>
var app;
(function (app) {
    var components;
    (function (components) {
        var TodoFooter = (function (_super) {
            __extends(TodoFooter, _super);
            function TodoFooter() {
                _super.apply(this, arguments);
            }
            TodoFooter.prototype.render = function () {
                var activeTodoWord = app.miscelanious.Utils.pluralize(this.props.count, 'item');
                var clearButton = null;
                if (this.props.completedCount > 0) {
                    clearButton = (React.createElement("button", {"className": "clear-completed", "onClick": this.props.onClearCompleted}, "Clear completed"));
                }
                // React idiom for shortcutting to `classSet` since it'll be used often
                var cx = React.addons.classSet;
                var nowShowing = this.props.nowShowing;
                return (React.createElement("footer", {"className": "footer"}, React.createElement("span", {"className": "todo-count"}, React.createElement("strong", null, this.props.count), " ", activeTodoWord, " left"), React.createElement("ul", {"className": "filters"}, React.createElement("li", null, React.createElement("a", {"href": "#/", "className": cx({ selected: nowShowing === app.constants.ALL_TODOS })}, "All")), ' ', React.createElement("li", null, React.createElement("a", {"href": "#/active", "className": cx({ selected: nowShowing === app.constants.ACTIVE_TODOS })}, "Active")), ' ', React.createElement("li", null, React.createElement("a", {"href": "#/completed", "className": cx({ selected: nowShowing === app.constants.COMPLETED_TODOS })}, "Completed"))), clearButton));
            };
            return TodoFooter;
        })(React.Component);
        components.TodoFooter = TodoFooter;
    })(components = app.components || (app.components = {}));
})(app || (app = {}));
