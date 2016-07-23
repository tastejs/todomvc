/*jshint strict:false */
/*global enyo:false */
// Top level window
enyo.kind({
	name: 'ToDo.WindowView',
	tag: 'body',
	fit: false, // Tell enyo not to manage screen size for us.  Fit true would tell enyo to adjust sizes to match the screen in a clean fashion.
	// Have 2 components divided by purpose
	components: [{
		name: 'ToDo.notepadview',
		kind: 'ToDo.NotepadView'
	}, {
		name: 'ToDo.footerview',
		kind: 'ToDo.FooterView'
	}]
});
