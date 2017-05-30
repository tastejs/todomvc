/**
 * Some smoke tests
 */
describe( 'controllers/todos', function() {

	var controller = Todos.get( 'todosController' );
	var title = 'Another title...';

	it( 'should have an input for entering new entry', function() {
		expect( controller.inputView ).to.be.a( 'object' );
		expect(
			$( controller.inputView.get( 'element' ) ).attr( 'placeholder' )
		).to.equal( controller.inputView.get( 'placeholder' ) );
	});

	it( 'should not create new entry on empty-ish input', function() {
		var counted = controller.get( 'remaining' );
		controller.inputView.set( 'value', '  ' );
		controller.inputView.insertNewline();
		expect( controller.get( 'remaining' ) ).to.equal( counted )
	});

	it( 'should create new entry on newline', function() {
		controller.inputView.set( 'value', title );
		controller.inputView.insertNewline();
		expect( controller.get( 'lastObject' ).title ).to.equal( title );
		controller.removeObject( controller.get( 'lastObject' ) );
	});

	it( 'should delete item if title is empty-ish', function() {
		controller.createNew( title );
		var counted = controller.get( 'remaining' );
		var entry = controller.get( 'lastObject' );
		entry.set( 'title', '  ' );
		var editor = controller.todoEditor.create({
			todo: entry,
			storage: controller
		});
		editor.whenDone();
		expect( controller.get( 'remaining' ) ).to.equal( counted - 1 );
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
