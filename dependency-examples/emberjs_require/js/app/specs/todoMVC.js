/**
 * TodoMVC Project Specs
 *
 * Use `runs` and `waits` to make sure results are run synchroneously
 */

describe( 'TodoMVC features.', function(){

	var enterEvent = $.Event('keyup', { keyCode: 13 });
	var todoTitle = 'Foo Bar Todo';

	describe( 'Todo creation:', function() {

		beforeEach( function(){
			// Make sure we are always on the main screen
			window.location.hash = '#/';
		});

		it( 'should allow creating a new todo' , function() {
			runs( function(){
				$( '#new-todo' ).val( todoTitle ).trigger( enterEvent );
			});

			waits( 100 );

			runs( function() {
				!!$( '#todo-list li' ).text().match( todoTitle );
			});
		});

		it( 'should not allow adding an empty todo' , function() {
			var ourTodo,
				beforeCount = $( '#todo-list li' ).length;

			runs( function(){
				$( '#new-todo' ).val( '   ' ).trigger( enterEvent );
			});

			waits( 100 );

			runs( function(){
				expect( $( '#todo-list li' ).length ).toEqual( beforeCount );
			});
		});
	});

	describe( 'Todo completion:', function() {
		it( 'should allow marking a todo complete' , function() {
			var ourTodo,
				beforeCount = $( '#todo-list li.completed' ).length,
				postTitle = ' to be completed';

			runs( function(){
				$( '#new-todo' ).val( todoTitle + postTitle ).trigger( enterEvent );
			});

			waits( 100 );

			runs( function() {
				ourTodo = $( '#todo-list li:last-child' );

				expect( ourTodo.text() ).toMatch( postTitle );
				ourTodo.find( '.toggle' ).click();
				expect( $( '#todo-list li.completed' ).length ).toEqual( beforeCount + 1 );
			});
		});

		it( 'should allow clearing completed todos' , function() {
			var ourTodo,
				beforeCount = $( '#todo-list li.completed' ).length,
				postTitle = ' to be completed';

			runs( function(){
				$( '#new-todo' ).val( todoTitle + postTitle ).trigger( enterEvent );
			});

			waits( 100 );

			runs( function() {
				ourTodo = $( '#todo-list li:last-child' );

				expect( ourTodo.text() ).toMatch( postTitle );
				ourTodo.find( '.toggle' ).click();
				$( '#clear-completed' ).click();
				expect( $( '#todo-list li.completed' ).length ).toEqual( 0 );
			});
		});
	});

	describe( 'Todo deletion:', function() {
		it( 'should allow deleting a todo' , function() {
			var ourTodo,
				beforeCount = $( '#todo-list li' ).length,
				postTitle = ' to be deleted';

			runs( function(){
				$( '#new-todo' ).val( todoTitle + postTitle ).trigger( enterEvent );
			});

			waits( 100 );

			runs( function() {
				ourTodo = $( '#todo-list li:last-child' );

				expect( ourTodo.text() ).toMatch( postTitle );
				ourTodo.find( '.destroy' ).click();
				expect( $( '#todo-list li' ).length ).toEqual( beforeCount );
			});
		});
	});

});
