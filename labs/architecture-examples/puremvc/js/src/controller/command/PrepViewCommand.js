/**
 * @author Mike Britton
 * 
 * @class PrepViewCommand
 * @link https://github.com/PureMVC/puremvc-js-demo-todomvc.git
 */
puremvc.define 
(
    // CLASS INFO
    {
        name:'todomvc.controller.command.PrepViewCommand',
        parent:puremvc.SimpleCommand
    },
 
    // INSTANCE MEMBERS
    {
        /** @override */
        execute: function (note) {
            this.facade.registerMediator( new todomvc.view.mediator.TodoFormMediator );
            this.facade.registerMediator( new todomvc.view.mediator.RoutesMediator );
        }
    }     
);
