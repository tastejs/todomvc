/*global dijondemo, $, Handlebars */
/**
 * @author Camille Reynders
 * Date: 03/02/12
 * Time: 13:39
 */
(function( ns ) {
	'use strict';

	ns.views.TodoListView = function() {
		var _template = Handlebars.compile( $('#todo-template').html() ),
			$toggleAll = $('.toggle-all'),
			$todoList = $('.todo-list'),
			$main = $('.main'),
			$count = $('.todo-count');
		return {
			system: undefined, //inject
			enterKey: undefined,
			escapeKey: undefined,
			todosModel: undefined, //inject
			setup: function() {
				var self = this;
				$todoList.on( 'change', '.toggle', function() {
					var id = $( this ).closest('li').data('id');
					self.system.notify( 'TodoListView:toggleDoneOfTodo', id );
				});
				$todoList.on( 'dblclick', 'label', function() {
					$( this ).closest('li').addClass('editing').find('.edit').focus();
				} );
				$todoList.on( 'keydown', '.edit', function( e ) {
					if ( e.which === self.enterKey ) {
						e.target.blur();
					} else if ( e.which === self.escapeKey ) {
						var todoEl = $( this ).closest('li'),
							id = todoEl.data('id'),
							val = $.trim( todoEl.find('label').html());
						todoEl.removeClass('editing');
						self.system.notify( 'TodoListView:setTitleOfTodo', id, val);
					}
				});
				$todoList.on( 'blur', '.edit', function() {
					var id = $( this ).closest('li').data('id'),
						val = $.trim( $( this ).removeClass('editing').val() );
					if ( val ){
						self.system.notify( 'TodoListView:setTitleOfTodo', id, val );
					} else {
						self.system.notify( 'TodoListView:removeTodo', id );
					}
				});
				$todoList.on( 'click', '.destroy', function() {
					var id = $( this ).closest('li').data('id');
					self.system.notify( 'TodoListView:removeTodo', id );
				});
				$toggleAll.on( 'change', function() {
					var isChecked = !!$( this ).prop('checked');
					self.system.notify( 'TodoListView:setDoneForAllTodos', isChecked );
				});
			},
			render: function() {
				var todoList = this.todosModel.getList();
				$todoList.html( _template( todoList ) );
				$main.toggle( !!todoList.length );
				$toggleAll.prop( 'checked', !this.todosModel.getNumActive() );
			}
		};
	};

}( dijondemo ));
