/*jshint strict:false */
/*global enyo:false */
// Base component.  This is the app that holds everything.  An app can be as big as the whole app or as big as a single module.
enyo.kind({
	name: 'ToDo.Application',
	kind: 'enyo.Application',
	view: 'ToDo.WindowView',
	// start up the controllers.  By giving them names and starting them at the app level, the instances become global singletons.
	controllers: [{
		name: 'ToDo.notepadcontroller',
		kind: 'ToDo.NotepadController'
	}, {
		name: 'ToDo.routes',
		kind: 'ToDo.Routes'
	}]
});
