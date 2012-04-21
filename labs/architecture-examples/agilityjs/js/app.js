(function( $, $$ ) {
	'use strict';
	var ENTER_KEY = 13;

	// Hack of taking out html elements from DOM so that agility's view can use it.
	// We need 'outerhtml' also, as agilityjs will append DOM, so removing it.
	var drawHtml = function( selector ) {
		return $(selector).remove().wrap( '<div>' ).parent().html();
	};

	// Simple Two layer composition:
	// individual 'todoitem' and 'app'lication which holds multiple todoitems.
	$(function() {
		// todo item
		var todoitem = $$({
			model: {
				title: 'no name',
				complete: false
			},
			view: {
				format: drawHtml( '#todo-list li' ),
				style: '.hidden { display: none }'
			},
			controller: {
				'change:complete': function() {
					this.view.$().toggleClass( 'complete', this.model.get( 'complete' ));
					app.updateStatus();
				},
				'dblclick .view': function() {
					this.view.$().addClass( 'editing' );
					this.view.$('.edit').select();
				},
				'click .destroy': function() {
					this.destroy();
				},
				'create': function() {
					this.view.$().toggleClass( 'complete', this.model.get( 'complete' ));
				},
				'change': function() {
					this.save();
				},
				'destroy': function() {
					this.erase();
				},
				'change:title': function() {
					this.view.$().removeClass( 'editing' );
					var title = this.model.get( 'title' ).trim();
					if ( title ) {
						this.model.set({
							title: title
						});
					} else {
						this.destroy();
					}
				}
			}
		}).persist( $$.adapter.localStorage, {
			collection: 'todos-agilityjs'
		});

		// The main application which holds todo items.
		var app = $$({
			model: {
				todoCount: '0',
				pluralizer: '',
				completeCount: '0',
				newtitle: '',
				mainStyle: '',
				clearBtnStyle: ''
			},
			view: {
				format: drawHtml( '#todoapp' ),
				style: '.hidden { display: none }'
			},
			controller: {
				'remove': function() {
					this.updateStatus();
				},
				'append': function() {
					this.updateStatus();
				},
				'keyup #new-todo': function( event ) {
					var title;
					if ( event.which === ENTER_KEY && (title = $('#new-todo').val().trim()) ) {
						var item = $$(todoitem, {
							title: title
						}).save();
						this.append( item, '#todo-list' );
						event.target.value = '';  // clear input field
					}
				},
				'click #toggle-all': function() {
					var ischecked = this.view.$('#toggle-all').prop('checked');
					this.each(function( id, item ) {
						item.model.set({
							complete: ischecked
						});
					});
				},
				'click #clear-completed': function() {
					this.each(function( id, item ) {
						if ( item.model.get( 'complete' ) ) {
							item.destroy();
						}
					});
				}
			},
			// utility functions
			updateStatus: function() {
				// update counts
				var count = this.size(),
					completeCount = 0;
				this.each(function( id, item ) {
					if ( item.model.get( 'complete' ) ) {
						completeCount++;
					}
				});
				this.model.set({
					todoCount: count - completeCount + '',
					pluralizer: (count > 1 ? 's' : ''),
					completeCount: completeCount + '',
					mainStyle: (count === 0 ? 'hidden' : ''),
					clearBtnStyle: (completeCount === 0 ? 'hidden' : '')
				});
				// update toggle-all checked status
				$('#toggle-all').prop( 'checked', completeCount === count );
			},
			// filter handler
			filters: {
				'#/': function( item ) {
					return true;
				},
				'#/active': function( item ) {
					return !item.model.get( 'complete' );
				},
				'#/completed': function( item ) {
					return item.model.get( 'complete' );
				}
			},
			applyFilter: function( hash ) {
				var isVisible = this.filters[hash];
				this.each(function( id, item ) {
					item.view.$().toggleClass( 'hidden', !isVisible( item ));
				});
			}
		}).persist();
		$$.document.prepend( app );

		// load from localStorage
		app.gather( todoitem, 'append', '#todo-list' ).updateStatus();

		// manual routing  (not supported by agilityjs)
		$(window).on( 'hashchange', function() {
			var hash = location.hash;
			app.applyFilter( hash );
			$('#filters a').each(function() {
				if ( hash === $(this).attr( 'href' ) ) {
					$(this).addClass( 'selected' );
				} else {
					$(this).removeClass( 'selected' );
				}
			});
		});
		if ( location.hash ) {
			$(window).trigger( 'hashchange' );
		}
	});

})( window.jQuery, window.agility );
