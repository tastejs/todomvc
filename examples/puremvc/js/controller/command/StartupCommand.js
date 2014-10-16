/**
 * @author Mike Britton
 *
 * @class StartupCommand
 * @link https://github.com/PureMVC/puremvc-js-demo-todomvc.git
 */
puremvc.define({
		name: 'todomvc.controller.command.StartupCommand',
		parent: puremvc.MacroCommand
	},

	// INSTANCE MEMBERS
	{
		/**
		 * Add the sub-commands for this MacroCommand
		 * @override
		 */
		initializeMacroCommand: function () {
			this.addSubCommand( todomvc.controller.command.PrepControllerCommand );
			this.addSubCommand( todomvc.controller.command.PrepModelCommand );
			this.addSubCommand( todomvc.controller.command.PrepViewCommand );
		}
	}
);
