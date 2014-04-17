/* global plat, __extends */
/* jshint unused:false */
/* jshint ignore:start */
/* jshint -W004 */
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/* jshint ignore:end */
var todoapp;
(function (todoapp) {
    'use strict';
    (function (viewcontrols) {

        var clonedTodo = { id: '-1', title: '', completed: false };

        var TodoMainVC = (function (_super) {
            __extends(TodoMainVC, _super);
            /**
            * All injectable dependencies defined during control registration will be
            * passed into the constructor.
            */
            function TodoMainVC(todoFactory, state, utils) {
                _super.call(this);
                this.todoFactory = todoFactory;
                this.state = state;
                this.utils = utils;
                /**
                * The context variable on a control corresponds to what can be used
                * for data binding in the view.
                */
                this.context = {
                    completedCount: 0,
                    filterBy: 'all',
                    allCompleted: false,
                    newTodo: '',
                    editedTodo: { title: 'not set', completed: false },
                    todos: [],
                    remainingCount: 0
                };
                /**
                * This is the property that indicates where the template HTML for this control exists.
                * It is best practice to use a relative path for the templateUrl.
                */
                this.templateUrl = 'js/viewcontrols/todo/todo.viewcontrol.template.html';
            }
            /**
            * This is the initialize event method for a control. In this method a control
            * should initialize all the necessary variables. This method is typically only
            * necessary for view controls. If a control does not implement plat.ui.IViewControl
            * then it is not safe to access, observe, or modify the context property in this
            * method. A view control should call services/set context in this method in order
            * to fire the loaded event. No control will be loaded until the view control has
            * specified a context.
            */
            TodoMainVC.prototype.initialize = function () {
                this.context.todos = this.todoFactory.getTodos();
            };

            /**
            * This event is fired after all of the child controls of this control have loaded.
            * Since this is a view control, setting its context kicks off the binding and loading
            * phases.
            */
            TodoMainVC.prototype.loaded = function () {
                // Observes an array for when one of its mutable methods are called
                this.observeArray(this.context, 'todos', this.updateStatus);

                this.updateStatus();
            };

            /**
            * The navigatedTo event is fired when this control is navigated to directly using the
            * navigator.navigate method on a view control, or when a url is matched. The parameter
            * corresponds to the matched URL route. The route can have named parameters from when the route
            * was registered, and it can also have a query object representing the query string as
            * key/value pairs. Notice that this IRoute is of type IStatusParameters, which means route.parameter
            * will implement IStatusParameters (i.e. { status: string; }).
            */
            TodoMainVC.prototype.navigatedTo = function (route) {
                if (this.utils.isNull(route)) {
                    this.filter('all');
                    return;
                }

                this.filter(route.parameters.status || 'all');
            };

            TodoMainVC.prototype.updateStatus = function () {
                var remaining = 0;
                var completed = 0;

                // plat.utils contains a number of useful methods
                this.utils.forEach(this.context.todos, function (value) {
                    if (!value.completed) {
                        remaining++;
                    } else {
                        completed++;
                    }
                });

                this.context.completedCount = completed;
                this.context.remainingCount = remaining;
                this.context.allCompleted = remaining === 0;
                this.storeTodos();
            };

            TodoMainVC.prototype.removeTodo = function (index) {
                this.context.todos.splice(index, 1);
            };

            TodoMainVC.prototype.storeTodos = function () {
                this.todoFactory.setTodos(this.context.todos);
            };

            TodoMainVC.prototype.addTodo = function () {
                if (this.utils.isNull(this.context.newTodo)) {
                    return;
                }

                var title = this.context.newTodo.trim();

                if (this.utils.isEmpty(title)) {
                    return;
                }

                this.context.todos.push(this.todoFactory.createTodo(title, false));
                this.context.newTodo = '';
            };

            TodoMainVC.prototype.toggleAll = function () {
                var toggle = !this.context.allCompleted;

                this.utils.forEach(this.context.todos, function (value) {
                    value.completed = toggle;
                });

                this.updateStatus();
                this.storeTodos();
            };

            TodoMainVC.prototype.filter = function (state) {
                this.context.filterBy = state;
                this.state.setState(state);
            };

            TodoMainVC.prototype.editTodo = function (todo) {
                clonedTodo = { id: '-1', title: '', completed: false };
                this.utils.deepExtend(clonedTodo, todo);
                this.context.editedTodo = todo;
            };

            TodoMainVC.prototype.commitTodo = function () {
                var editedTodo = this.context.editedTodo;

                if (this.utils.isNull(editedTodo)) {
                    return;
                } else if (this.utils.isEmpty(editedTodo.title)) {
                    this.removeTodo(this.context.todos.indexOf(editedTodo));
                }
                this.context.editedTodo.title = this.context.editedTodo.title.trim();
                this.context.editedTodo = null;

                this.storeTodos();
            };

            TodoMainVC.prototype.revert = function (todo) {
                var todos = this.context.todos;

                this.context.editedTodo = null;
                todos[todos.indexOf(todo)] = clonedTodo;
            };

            TodoMainVC.prototype.clearCompletedTodos = function () {
                this.context.todos = this.utils.where(this.context.todos, { completed: false });

                this.updateStatus();
            };
            return TodoMainVC;
        })(plat.ui.ViewControl);
        viewcontrols.TodoMainVC = TodoMainVC;

        

        /**
        * This is how you register a view control. You can define routes for the navigator to
        * match when the url changes. You can also define injectable dependencies that will be
        * passed to the constructor of the control when it is instantiated.
        */
        plat.register.viewControl('main', TodoMainVC, [
            todoapp.models.TodoFactoryStatic,
            todoapp.models.State,
            plat.Utils
        ], ['', ':status']);
    })(todoapp.viewcontrols || (todoapp.viewcontrols = {}));
    var viewcontrols = todoapp.viewcontrols;
})(todoapp || (todoapp = {}));
//# sourceMappingURL=todo.viewcontrol.js.map
