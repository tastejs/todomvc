(function( app ) {
	'use strict';

	var Store = function( name ) {
		this.name = name;
		var store = localStorage.getItem( this.name );
		this.data = ( store && JSON.parse( store ) ) || {};

		// Save the current state of the **Store** to *localStorage*.
		this.save = function() {
			localStorage.setItem( this.name, JSON.stringify( this.data ) );
		};

		// Wrapper around `this.create`
		// Creates a `Todo` model object out of the title
		this.createFromTitle = function( title ) {
			var todo = app.Todo.create({
				title: title,
				store: this
			});
			this.create( todo );
			return todo;
		};

		// Store the model inside the `Store`
		this.create = function ( model ) {
			if ( !model.get( 'id' ) )
				model.set( 'id', Date.now() );
			return this.update( model );
		};

		// Update a model by replacing its copy in `this.data`.
		this.update = function( model ) {
			this.data[ model.get( 'id' ) ] = model.getProperties(
				'id', 'title', 'completed'
			);
			this.save();
			return model;
		};

		// Retrieve a model from `this.data` by id.
		this.find = function( model ) {
			var todo = app.Todo.create( this.data[ model.get( 'id' ) ] );
			todo.set( 'store', this );
			return todo;
		};

		// Return the array of all models currently in storage.
		this.findAll = function() {
			var result = [],
			key;

			for ( key in this.data ) {
				var todo = app.Todo.create( this.data[ key ] );
				todo.set( 'store', this );
				result.push( todo );
			}

			return result;
		};

		// Delete a model from `this.data`, returning it.
		this.remove = function( model ) {
			delete this.data[ model.get( 'id' ) ];
			this.save();
			return model;
		};
	};

	app.Store = Store;

})( window.Todos );
