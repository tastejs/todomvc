/**
 * Some integration tests
 */
describe( 'models/store', function() {

	var title = 'Testing title...';
	var store = Todos.todosController.get( 'store' );

	it( 'should allow creating and removing items', function() {
		var count = store.findAll().length;
		var todo = store.createFromTitle( title );
		expect( store.findAll().length ).to.equal( count + 1 );
		expect( todo ).to.have.property( 'title', title );
		expect( todo ).to.have.property( 'completed', false );
		expect( todo ).to.have.property( 'store', store );
		store.remove( todo );
		expect( store.findAll().length ).to.equal( count );
	});

	it( 'should allow finding and changing items', function() {
		var todo = store.createFromTitle( title );
		expect( store.find( todo ).id ).to.equal( todo.id );
		expect( store.find( todo ).title ).to.equal( todo.title );
		expect( store.find( todo ).completed ).to.equal( false );
		todo.set( 'completed', true );
		expect( store.find( todo ).id ).to.equal( todo.id );
		expect( store.find( todo ).completed ).to.equal( true );
		store.remove( todo );
	});

});
