/*jshint strict:false */
/*global enyo:false */
// This is the notepad area
enyo.kind({
	name: 'ToDo.NotepadView',
	id: 'todoapp',
	tag: 'section',
	// Break the notepad into three easily handled components by purpose.
	components: [{
		name: 'ToDo.notepadviewheader',
		kind: 'ToDo.NotepadHeaderView'
	}, {
		name: 'ToDo.notepadviewmain',
		kind: 'ToDo.NotepadMainView'
	}, {
		name: 'ToDo.notepadviewfooter',
		kind: 'ToDo.NotepadFooterView'
	}]
});
