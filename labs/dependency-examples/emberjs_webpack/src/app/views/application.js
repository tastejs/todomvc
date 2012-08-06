var StatsView = require('./stats'); // stats view class
var FiltersView = require('./filters'); // filters view class
var ClearBtnView = require('./clear_button'); // clear button view class

module.exports = Ember.ContainerView.extend({
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
			StatsView.create(),
			FiltersView.create(),
			ClearBtnView.create()
		]
	})
})
