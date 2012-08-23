define([
	'js/data/Collection',
	'app/model/Todo',
	'flow'
], function ( Collection, Todo, flow ) {
	return Collection.inherit( 'app.collection.TodoList', {
		$modelFactory: Todo,

		markAll: function( done ) {
			this.each(function (todo) {
				todo.setCompleted( done );
				todo.save();
			});
		},

		areAllComplete: function() {
			var i, l;

			if ( this.$items.length ) {
				return false;
			}

			for ( i = 0, l = this.$items.length; i < l; i++ ) {
				if ( !this.$items[ i ].isCompleted() ) {
					return false;
				}
			}

			return true;
		}.on('change', 'add', 'remove'),

		clearCompleted: function() {
			var self = this;

			// remove all completed todos in a sequence
			flow().seqEach( this.$items, function( todo, cb ) {

				if ( todo.isCompleted() ) {
					// remove the todo
					todo.remove( null, function( err ) {
						if ( !err ) {
							self.remove( todo );
						}
						cb( err );
					});
				} else {
					cb();
				}
			}).exec();
		},

		numOpenTodos: function() {
			var i, l,
				num = 0;

			for ( i = 0, l = this.$items.length; i < l; i++ ) {
				if ( !this.$items[ i ].isCompleted() ) {
					num++;
				}
			}

			return num;
		}.on('change', 'add', 'remove'),

		numCompletedTodos: function() {
			var i, l,
				num = 0;

			for ( i = 0, l = this.$items.length; i < l; i++ ) {
				if ( this.$items[ i ].isCompleted() ) {
					num++;
				}
			}

			return num;
		}.on('change', 'add', 'remove'),

		hasCompletedTodos: function() {
			return this.numCompletedTodos() > 0;
		}.on('change', 'add', 'remove')
	});
});
