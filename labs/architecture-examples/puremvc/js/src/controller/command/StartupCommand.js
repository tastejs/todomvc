/**
 * @author Mike Britton
 * 
 * @class StartupCommand
 * @link https://github.com/PureMVC/puremvc-js-demo-todomvc.git
 */
puremvc.define
(
    // CLASS INFO
    {
        name: 'todomvc.controller.command.StartupCommand',
        parent: puremvc.MacroCommand
    },

    // INSTANCE MEMBERS 
    {
        /** @override */
        initializeMacroCommand: function ()
        {
            // Register Commands with the Facade
            this.addSubCommand( todomvc.controller.command.PrepControllerCommand );
            this.addSubCommand( todomvc.controller.command.PrepModelCommand );
            this.addSubCommand( todomvc.controller.command.PrepViewCommand );  
        }
    }    
);
