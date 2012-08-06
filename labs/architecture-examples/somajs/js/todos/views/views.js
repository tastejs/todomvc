var todo = window.todo || {};

(function( window ) {
	'use strict';

	var ENTER_KEY = 13;

	todo.TodoListView = soma.View.extend({
		template: null,

		init: function() {
			this.template = Handlebars.compile( $( '#' + this.domElement.id + '-template' ).html() );
			$( this.domElement ).on( 'click', '.destroy', this.destroy.bind( this ) );
			$( this.domElement ).on( 'click', '.toggle', this.toggle.bind( this ) );
			$( this.domElement ).on( 'dblclick', 'label', this.edit );
			$( this.domElement ).on( 'blur', '.edit', this.update.bind( this ) );
			$( this.domElement ).on( 'keypress', '.edit', this.blurInput );
			$('#toggle-all').click( this.toggleAll );
		},

		render: function( data, activeCount ) {
			$(this.domElement).html( this.template( data ) );
			$('#toggle-all').prop( 'checked', !activeCount );
			$('#main').toggle( !!data.length );
		},

		destroy: function( event ) {
			var id = $(event.target).closest('li').attr('data-id');
			this.dispatchEvent( new todo.TodoEvent( todo.TodoEvent.DELETE, null, id ) );
		},

		toggle: function( event ) {
			var id = $(event.target).closest('li').attr('data-id');
			this.dispatchEvent( new todo.TodoEvent( todo.TodoEvent.TOGGLE, null, id ) );
		},

		toggleAll: function() {
			this.dispatchEvent( new todo.TodoEvent( todo.TodoEvent.TOGGLE_ALL, null, null, $( this ).prop('checked') ) );
		},

		edit: function( event ) {
			$( this ).closest('li').addClass('editing').find('.edit').focus();
		},

		update: function( event ) {
			var li = $( event.target ).closest('li').removeClass('editing'),
				id = li.data('id'),
				val = li.find('.edit').val().trim();

			if ( val ) {
				this.dispatchEvent( new todo.TodoEvent( todo.TodoEvent.UPDATE, val, id ) );
			}
			else {
				this.dispatchEvent( new todo.TodoEvent( todo.TodoEvent.DELETE, null, id ) );
			}
		},

		blurInput: function( event ) {
			if ( event.which === ENTER_KEY ) {
				event.target.blur();
			}
		}
	});

	todo.TodoListView.NAME = 'TodoListView';

	todo.TodoInputView = soma.View.extend({

		init: function() {
			$( this.domElement ).keypress( this.keyPressHandler.bind( this ) );
			$( this.domElement ).blur( this.blur );
		},

		keyPressHandler: function( event ) {
			if ( event.which === ENTER_KEY ) {
				this.createItem();
			}
		},

		createItem: function() {
			var value = this.domElement.value.trim();

			if ( value ) {
				this.dispatchEvent( new todo.TodoEvent( todo.TodoEvent.CREATE, value ) );
			}

			this.domElement.value = '';
		},

		blur: function( event ) {
			if ( !this.value.trim() ) {
				this.value = '';
			}
		}

	});

	todo.TodoInputView.NAME = 'TodoInputView';

	todo.FooterView = soma.View.extend({
		template: null,

		init: function() {
			this.template = Handlebars.compile( $( '#' + this.domElement.id + '-template' ).html() );
			$( this.domElement ).on( 'click', '#clear-completed', this.clearCompleted.bind( this ) );
		},

		render: function( data ) {
			$( this.domElement ).html( this.template( data ) );
			$( this.domElement ).toggle( !!data.length );
			$('#clear-completed').toggle( !!data.completed );
		},

		clearCompleted: function( event ) {
			this.dispatchEvent( new todo.TodoEvent( todo.TodoEvent.CLEAR_COMPLETED ) );
		}
	});

	todo.FooterView.NAME = 'FooterView';

})( window );
