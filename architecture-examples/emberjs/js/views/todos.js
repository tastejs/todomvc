(function( app ) {
	'use strict';

	var TodosView = Ember.CollectionView.extend({
		contentBinding: 'controller.entries',
		tagName: 'ul',
		elementId: 'todo-list',
		itemViewClass: Ember.View.extend({
			templateName: 'todosTemplate',
			classNames: [ 'view' ],
			classNameBindings: ['content.completed', 'content.editing'],
			doubleClick: function() {
				this.get( 'content' ).set( 'editing', true );
			},
			removeItem: function() {
				this.getPath( 'controller.content' ).removeObject(
					this.get( 'content' )
				);
			},
			ItemEditorView: Ember.TextField.extend({
				valueBinding: 'content.title',
				classNames: [ 'edit' ],
				change: function() {
					if ( Ember.empty( this.getPath( 'content.title' ) ) ) {
						this.getPath( 'controller.content' ).removeObject(
							this.get( 'content' )
						);
					}else{
						this.get('content').set('title', this.getPath('content.title').trim());
					}
				},
				whenDone: function() {
					this.get( 'content' ).set( 'editing', false );
				},
				focusOut: function() {
					this.whenDone();
				},
				didInsertElement: function() {
					this.$().focus();
				},
				insertNewline: function() {
					this.whenDone();
				}
			})
		})
	});

	app.TodosView = TodosView;

})( window.Todos);
