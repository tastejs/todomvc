var ENTER_KEY = 13;

var TodoListView = soma.View.extend({

	template: null,

	init: function() {
		this.template = Handlebars.compile( $('#' + this.domElement.id + '-template').html() );
		$(this.domElement).on( 'click', '.destroy', this.destroy.bind(this) );
		$(this.domElement).on( 'click', '.toggle', this.toggle.bind(this) );
		$(this.domElement).on( 'dblclick', '.view', this.edit );
		$(this.domElement).on( 'blur', '.edit', this.update.bind(this) );
		$(this.domElement).on( 'keypress', '.edit', this.blurInput );
		$('#toggle-all').click( this.toggleAll );
	},

	render: function( data ) {
		this.domElement.innerHTML = this.template( data );
	},

	destroy: function( event ) {
		var id = $(event.target).closest('li').attr('data-id');
		this.dispatchEvent( new TodoEvent( TodoEvent.DELETE, null, id ) );
	},

	toggle: function( event ) {
		var id = $(event.target).closest('li').attr('data-id');
		this.dispatchEvent( new TodoEvent( TodoEvent.TOGGLE, null, id ) );
	},

	toggleAll: function() {
		this.dispatchEvent( new TodoEvent( TodoEvent.TOGGLE_ALL, null, null, $(this).prop('checked') ) );
	},

	edit: function( event ) {
		$(this).closest('li').addClass('editing').find('.edit').select();
	},

	update: function( event ) {
		var li = $(event.target).closest('li').removeClass('editing');
		var id = li.attr('data-id');
		var val = li.find('.edit').val().trim();
		if ( val ) {
			this.dispatchEvent( new TodoEvent( TodoEvent.UPDATE, val, id ) );
		}
		else {
			this.dispatchEvent( new TodoEvent( TodoEvent.DELETE, null, id ) );
		}
	},

	blurInput: function( event ) {
		if (event.which === ENTER_KEY) {
			event.target.blur();
		}
	}

});

TodoListView.NAME = 'TodoListView';

var TodoInputView = soma.View.extend({

	init: function() {
		$(this.domElement).keypress( this.keyPressHandler.bind(this) );
		$(this.domElement).blur( this.blur );
	},

	keyPressHandler: function( event ) {
		if (event.which === ENTER_KEY) {
			this.createItem();
		}
	},

	createItem: function() {
		var value = this.domElement.value.trim();
		if (value) {
			this.dispatchEvent( new TodoEvent( TodoEvent.CREATE, value ) );
		}
		this.domElement.value = '';
	},

	blur: function( event ) {
		if (!this.value.trim()) {
			this.value = '';
		}
	}

});

TodoInputView.NAME = 'TodoInputView';

var FooterView = soma.View.extend({

	template: null,

	init: function() {
		this.template = Handlebars.compile( $('#' + this.domElement.id + '-template').html() );
		$(this.domElement).on( 'click', '#clear-completed', this.clearCompleted.bind(this) );
	},

	render: function( data ) {
		this.domElement.innerHTML = this.template( data );
		$(this.domElement).toggle( !!data.length );
		$('#clear-completed').toggle( !!data.completed );
	},

	clearCompleted: function(event) {
		this.dispatchEvent( new TodoEvent( TodoEvent.CLEAR_COMPLETED ) );
	}

});

FooterView.NAME = 'FooterView';