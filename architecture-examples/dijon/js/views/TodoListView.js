/**
 * @author Camille Reynders
 * Date: 03/02/12
 * Time: 13:39
 */
( function ( ns ) {
	ns.views.TodoListView = function () {
		var _template = Handlebars.compile( $( '#todo-template' ).html() );
		var $toggleAll = $( '#toggle-all' );
		var $todoList = $( '#todo-list' );
		var $main = $( '#main' );
		var $count = $( '#todo-count' );
		return {
			system:undefined, //inject
			enterKey:undefined,
			todosModel : undefined, //inject
			setup:function () {
				var self = this;
				$todoList.on( 'change', '.toggle', function () {
					var id = $( this ).closest( 'li' ).data( 'id' );
					self.system.notify( 'TodoListView:toggleDoneOfTodo', id );
				} );
				$todoList.on( 'dblclick', '.view', function () {
					$( this )
						.closest( 'li' )
						.addClass( 'editing' )
						.find( '.edit' )
						.focus();
				} );
				$todoList.on( 'keypress', '.edit', function ( e ) {
					if ( e.keyCode === self.enterKey ) {
						e.target.blur();
					}
				} );
				$todoList.on( 'blur', '.edit', function () {
					var id = $( this ).closest( 'li' ).data( 'id' ),
						val = $.trim( $( this ).removeClass( 'editing' ).val() );
					if( val ){
						self.system.notify( 'TodoListView:setTitleOfTodo', id, val );
					}else{
						self.system.notify( 'TodoListView:removeTodo', id );
					}
				} );
				$todoList.on( 'click', '.destroy', function () {
					var id = $( this ).closest( 'li' ).data( 'id' );
					self.system.notify( 'TodoListView:removeTodo', id );
				} );

				$toggleAll.on( 'change', function () {
					var isChecked = !!$( this ).attr( 'checked' );
					self.system.notify( 'TodoListView:setDoneForAllTodos', isChecked );
				} );

			},

			render:function () {
				var todoList = this.todosModel.getList();
				$todoList.html( _template( todoList ) );
				$main.toggle( !!todoList.length );
				$toggleAll.prop( 'checked', !this.todosModel.getNumActive() );
			}
		}
	}
}( dijondemo ))