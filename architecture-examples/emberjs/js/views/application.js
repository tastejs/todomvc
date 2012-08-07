(function( app ) {
	'use strict';

	var ApplicationView = Ember.ContainerView.extend({
		childViews: [ 'headerView', 'mainView', 'footerView' ],
		headerView: Ember.ContainerView.create({
			childViews: [ 'titleView', 'createTodoView' ],
			elementId: 'header',
			tagName: 'header',
			titleView: Ember.View.create({
				tagName: 'h1',
				template: function() {
					return 'todos';
				}
			}),
			createTodoView: Ember.TextField.create({
				entriesBinding: 'controller.namespace.entriesController',
				placeholder: 'What needs to be done?',
				elementId: 'new-todo',
				insertNewline: function() {
					var value = this.get( 'value' );
					if ( value ) {
						this.get( 'entries' ).createNew( value );
						this.set( 'value', '' );
					}
				}
			}),
		}),
		mainView: Em.ContainerView.create({
			elementId: 'main',
			tagName: 'section',
			visibilityBinding: 'controller.namespace.entriesController.noneLeft',
			classNameBindings: [ 'visibility:hidden' ],
			childViews: [ 'outletView', 'markAllChkbox' ],
			outletView: Ember.View.create({
				template: Ember.Handlebars.compile( '{{outlet}}' ),
			}),
			markAllChkbox: Ember.Checkbox.create({
				entriesBinding: 'controller.namespace.entriesController',
				elementId: 'toggle-all',
				checkedBinding: 'entries.allAreDone'
			})
		}),
		footerView: Ember.ContainerView.create({
			elementId: 'footer',
			tagName: 'footer',
			visibilityBinding: 'controller.namespace.entriesController.noneLeft',
			classNameBindings: [ 'visibility:hidden' ],
			childViews: [ 'statsView', 'filtersView', 'clearBtnView' ],
			statsView: Ember.View.create({
				entriesBinding: 'controller.namespace.entriesController',
				elementId: 'todo-count',
				tagName: 'span',
				templateName: 'statsTemplate',
				oneLeft: function() {
					return this.getPath( 'entries.remaining' ) === 1;
				}.property( 'entries.remaining' )
			}),
			filtersView: Ember.View.create({
				templateName: 'filtersTemplate',
				filterBinding: 'controller.namespace.entriesController.filterBy',
				isAll: function() {
					return Ember.empty( this.get('filter') );
				}.property( 'filter' ),
				isActive: function() {
					return this.get('filter') === 'active';
				}.property('filter'),
				isCompleted: function() {
					return this.get('filter') === 'completed';
				}.property('filter')
			}),
			clearBtnView: Ember.View.create({
				entriesBinding: 'controller.namespace.entriesController',
				templateName: 'clearBtnTemplate',
				elementId: 'clear-completed',
				buttonClass: function () {
					return !this.getPath( 'entries.completed' );
				}.property( 'entries.completed' )
			})
		})
	});

	app.ApplicationView = ApplicationView;

})( window.Todos);
