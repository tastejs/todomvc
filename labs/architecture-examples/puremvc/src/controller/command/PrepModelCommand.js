/**
 * @author Mike Britton
 * 
 * @class ModelPrepCommand
 * @link https://github.com/PureMVC/puremvc-js-demo-todomvc.git
 * 
 */

puremvc.define
(
    // CLASS INFO
    {
        name:'todomvc.controller.command.PrepModelCommand',
        parent:puremvc.SimpleCommand
    },
  
    // INSTANCE MEMBERS
    {
        /** @override */
        execute: function (note)
        {
            this.facade.registerProxy( new todomvc.model.proxy.TodoProxy );
            
            this.sendNotification(todomvc.AppConstants.LOAD_TODOS);
            this.sendNotification(todomvc.AppConstants.COMPUTE_STATS);
        }
    }    
);
