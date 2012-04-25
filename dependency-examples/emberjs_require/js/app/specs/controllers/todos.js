/**
 * Some smoke tests
 */
describe( 'controllers/todos', function() {

	var controller = Todos.get( 'todosController' );
	var title = 'Another title...';

	it( 'should have a view for entering new entry', function() {
		expect( controller.inputView ).to.be.a( 'object' );
		expect(
			$( controller.inputView.get( 'element' ) ).attr( 'placeholder' )
		).to.equal( controller.inputView.get( 'placeholder' ) );
	});

	it( 'should not allow empty values on edits', function() {
		var editorField = controller.todoEditor.create({ value: title });
		editorField.whenDone();
		expect( editorField.get( 'value' ) ).to.equal( title );
	});

	it( 'should create new entry on newline', function() {
		controller.inputView.set( 'value', title );
		controller.inputView.insertNewline();
		expect( controller.get( 'lastObject' ).title ).to.equal( title );
		controller.removeObject( controller.get( 'lastObject' ) );
	});

	it( 'should not allow empty values on entry changes', function() {
		controller.createNew( title );
		var entry = controller.get( 'lastObject' );
		entry.set( 'title', '  ' );
		expect( entry.title ).to.equal( title );
	});

	it( 'should reflect the same number of items as in store', function() {
		controller.createNew( 'value', title );
		var visibles = controller.todosView.
			get( 'childViews' )[ 0 ].get( 'childViews' ).length;
		expect( controller.get( 'content' ).length ).to.equal( visibles );
		controller.removeObject( controller.get( 'lastObject' ) );
	});

	it( 'should allow removing entries', function( done ) {
		controller.createNew( 'value', title );
		setTimeout( function(){
			controller.allDoneCheckbox.set( 'value', true );
		}, 100 );
		setTimeout( function(){
			controller.clearCompletedButton.triggerAction();
		}, 200 );
		setTimeout( function(){
			expect( controller.get( 'content' ).length ).to.equal( 0 );
		}, 300 );
		done();
	});

});
