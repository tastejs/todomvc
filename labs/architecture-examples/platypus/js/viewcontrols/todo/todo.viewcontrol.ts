module todoapp.viewcontrols {
    'use strict';

    var clonedTodo: models.ITodo = { id: '-1', title: '', completed: false };
        
    export class TodoMainVC extends plat.ui.ViewControl {
        /**
         * All injectable dependencies defined during control registration will be 
         * passed into the constructor.
         */
        constructor(private todoFactory: models.ITodoFactory, private state: models.State, private utils: plat.IUtils) {
            super();
        }

        /**
         * The context variable on a control corresponds to what can be used 
         * for data binding in the view.
         */
        context = {
            completedCount: 0,
            filterBy: 'all',
            allCompleted: false,
            newTodo: '',
            editedTodo: <models.ITodo>{ title: 'not set', completed: false },
            todos: <Array<models.ITodo>>[],
            remainingCount: 0
        };

        /**
         * This is the initialize event method for a control. In this method a control 
         * should initialize all the necessary variables. This method is typically only 
         * necessary for view controls. If a control does not implement plat.ui.IViewControl 
         * then it is not safe to access, observe, or modify the context property in this 
         * method. A view control should call services/set context in this method in order 
         * to fire the loaded event. No control will be loaded until the view control has 
         * specified a context.
         */
        initialize() {
            this.context.todos = this.todoFactory.getTodos();
        }

        /**
         * This is the property that indicates where the template HTML for this control exists. 
         * It is best practice to use a relative path for the templateUrl.
         */
        templateUrl: string = 'js/viewcontrols/todo/todo.viewcontrol.template.html';

        /**
         * This event is fired after all of the child controls of this control have loaded.
         * Since this is a view control, setting its context kicks off the binding and loading 
         * phases.
         */
        loaded() {
            // Observes an array for when one of its mutable methods are called
            this.observeArray(this.context, 'todos', this.updateStatus);

            this.updateStatus();
        }

        /**
         * Since we are using routes to navigate, our navigator is of type IRoutingNavigator. 
         * There are 2 types of navigation, with or without routing. The type of navigation 
         * used is determined by the type of base port (either plat-routeport or plat-viewport) 
         * used.
         */
        navigator: plat.navigation.IRoutingNavigator;

        /**
         * The navigatedTo event is fired when this control is navigated to directly using the 
         * navigator.navigate method on a view control, or when a url is matched. The parameter 
         * corresponds to the matched URL route. The route can have named parameters from when the route 
         * was registered, and it can also have a query object representing the query string as 
         * key/value pairs. Notice that this IRoute is of type IStatusParameters, which means route.parameter
         * will implement IStatusParameters (i.e. { status: string; }).
         */
        navigatedTo(route?: plat.web.IRoute<IStatusParameters>) {
            if (this.utils.isNull(route)) {
                this.filter('all');
                return;
            }

            this.filter(route.parameters.status || 'all');
        }

        updateStatus() {
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
        }

        removeTodo(index: number) {
            this.context.todos.splice(index, 1);
        }

        storeTodos() {
            this.todoFactory.setTodos(this.context.todos);
        }

        addTodo() {
            if (this.utils.isNull(this.context.newTodo)) {
                return;
            }

            var title = this.context.newTodo.trim();

            if (this.utils.isEmpty(title)) {
                return;
            }

            this.context.todos.push(this.todoFactory.createTodo(title, false));
            this.context.newTodo = '';
        }

        toggleAll() {
            var toggle = !this.context.allCompleted;

            this.utils.forEach(this.context.todos, function (value) {
                value.completed = toggle;
            });

            this.updateStatus();
            this.storeTodos();
        }

        filter(state: any) {
            this.context.filterBy = state;
            this.state.setState(state);
        }

        editTodo(todo: models.ITodo) {
            clonedTodo = { id: '-1', title: '', completed: false };
            this.utils.deepExtend(clonedTodo, todo);
            this.context.editedTodo = todo;
        }

        commitTodo() {
            var editedTodo = this.context.editedTodo;

            if (this.utils.isNull(editedTodo)) {
                return;
            } else if (this.utils.isEmpty(editedTodo.title)) {
                this.removeTodo(this.context.todos.indexOf(editedTodo));
            }
            this.context.editedTodo.title = this.context.editedTodo.title.trim();
            this.context.editedTodo = null;

            this.storeTodos();
        }

        revert(todo: models.ITodo) {
            var todos = this.context.todos;

            this.context.editedTodo = null;
            todos[todos.indexOf(todo)] = clonedTodo;
        }

        clearCompletedTodos() {
            this.context.todos = this.utils.where(this.context.todos, { completed: false });

            this.updateStatus();
        }
    }

    /**
     * IStatusParameters provides an interface for IRoute parameters. During route navigation
     * parameters can be sent in the form of the url path. The Router will form a plat.web.IRoute 
     * and pass it through to the corresponding View Control. The IRoute will contain the path, 
     * url parameters, and query object (key/value pairs for the query string).
     */
    export interface IStatusParameters {
        /**
         * Every IRoute<IStatusParameters> will have a status string, corresponding to the 
         * status parameter registered with the route.
         */
        status: string;
    }

    /**
     * This is how you register a view control. You can define routes for the navigator to 
     * match when the url changes. You can also define injectable dependencies that will be 
     * passed to the constructor of the control when it is instantiated.
     */
    plat.register.viewControl('main', TodoMainVC, [
        models.TodoFactoryStatic,
        models.State,
        plat.Utils
    ], ['', ':status']);
}
