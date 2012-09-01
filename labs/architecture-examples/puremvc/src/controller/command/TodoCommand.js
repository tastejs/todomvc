/**
 * @author Mike Britton
 * 
 * @class TodoCommand
 * @link https://github.com/PureMVC/puremvc-js-demo-todomvc.git
 * 
 */

puremvc.define
(
    // CLASS INFO
    {
        name:'todomvc.controller.command.TodoCommand',
        parent:puremvc.SimpleCommand
    },
  
    // INSTANCE MEMBERS
    {
        /** @override */
        execute: function (note)
        {
            var proxy = this.facade.retrieveProxy(todomvc.model.proxy.TodoProxy.NAME);
            
            switch(note.getName()) 
            {
                case todomvc.AppConstants.LOAD_TODOS:
                    proxy.loadTodos();
                    break;
 
                case todomvc.AppConstants.SAVE_TODOS:
                    proxy.saveTodos();
                    break;
 
                case todomvc.AppConstants.COMPUTE_STATS:
                    proxy.computeStats();
                    break;
 
                case todomvc.AppConstants.ADD_TODO:
                    proxy.addTodo(note.getBody());
                    this.sendNotification(todomvc.AppConstants.REFRESH_DATA);
                    break;
 
                case todomvc.AppConstants.REFRESH_DATA:
                    proxy.computeStats();
                    proxy.saveTodos();
                    proxy.loadTodos();
                    break;
 
                case todomvc.AppConstants.REMOVE_TODOS_COMPLETED:
                    proxy.removeTodosCompleted();
                    this.sendNotification(todomvc.AppConstants.REFRESH_DATA);
                    break;
 
                case todomvc.AppConstants.DELETE_TODO:
                    proxy.deleteTodo(note.getBody());
                    this.sendNotification(todomvc.AppConstants.REFRESH_DATA);
                    break;
 
                case todomvc.AppConstants.UPDATE_TODO:
                    proxy.updateTodo(note.getBody());
                    this.sendNotification(todomvc.AppConstants.REFRESH_DATA);
                    break;
                
                case todomvc.AppConstants.STATS_UPDATED:
                    proxy.updateTodo(note.getBody());
                    this.sendNotification(todomvc.AppConstants.REFRESH_DATA);
                    break;
                
                case todomvc.AppConstants.TOGGLE_TODO_STATUS:
                    proxy.toggleCompleteStatus(note.getBody());
                    this.sendNotification(todomvc.AppConstants.REFRESH_DATA);
                    break;
               
                default:
                    console.log('TodoCommand received an unsupported Notification');
                    break;
            } 
        }
    }    
);
