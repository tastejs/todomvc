goog.provide('Todos.views.Application');

goog.require('Todos.views.Stats');
goog.require('Todos.views.Filters');
goog.require('Todos.views.ClearButton');

/**
 * Main application view
 *
 * Requires
 * Class StatsView, stats view class
 * Class FiltersView, filters view class
 * Class ClearBtnView, clear button view class
 * @returns Class
 */
Todos.views.Application = Ember.ContainerView.extend({
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
		childViews: [
			Todos.views.Stats.create(),
			Todos.views.Filters.create(),
			Todos.views.ClearButton.create()
		]
	})
});
