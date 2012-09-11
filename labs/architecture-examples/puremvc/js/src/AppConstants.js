/**
 * @author Mike Britton
 *
 * @class TodoProxy
 * @link https://github.com/PureMVC/puremvc-js-demo-todomvc.git
 *
 */

/**
 * Create the application namespace.
 */
window.todomvc = 
{
    /**
     * Define the core and notification constants.
     * 
     * PureMVC JS is multi-core, meaning you may have multiple,
     * named and isolated PureMVC cores. This app only has one.
     */
    AppConstants : 
    {
        // The name of the PureMVC core
        APP_NAME :                 'TodoMVC',
        
        // Notifications 
        STARTUP :                  'startup',
        ADD_TODO :                 'add_todo',
        DELETE_TODO :              'delete_todo',
        UPDATE_TODO :              'update_todo',
        TOGGLE_TODO_STATUS :       'toggle_todo_status',
        REMOVE_TODOS_COMPLETED :   'remove_todos_completed',
        FILTER_TODOS:              'filter_todos',
        TODOS_FILTERED:            'todos_filtered',

        // Filter routes
        FILTER_ALL:                 'all',
        FILTER_ACTIVE:              'active',
        FILTER_COMPLETED:           'completed'

    }
};
