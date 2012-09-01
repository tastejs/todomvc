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
        NAME : 'TodoMVC',
        
        // Notifications 
        STARTUP :                  'startup',
        VIEW_READY :               'view_ready',
        LOAD_TODOS :               'load_todos',
        SAVE_TODOS :               'save_todos',
        ADD_TODO :                 'add_todo',
        COMPUTE_STATS :            'compute_stats',
        GET_TEMPLATE :             'get_template',
        REFRESH_DATA :             'refresh_data',
        TEMPLATE_RETURNED :        'template_returned',
        TODOS_RETURNED :           'todos_returned',
        REMOVE_TODOS_COMPLETED :   'remove_todos_completed',
        DELETE_TODO :              'delete_todo',
        UPDATE_TODO :              'update_todo',
        STATS_UPDATED :            'stats_updated',
        TOGGLE_TODO_STATUS :       'toggle_todo_status'

    }
};
