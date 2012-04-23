// Define libraries
require.config({
  baseUrl: 'js/',
  paths: {
    jquery: '../../../assets/jquery.min',
    ember: 'libs/ember-0.9.7.1.min',
    text: 'libs/require/text'
  }
});

// Load our app
define('app', [
  'jquery',
  'app/models/store',
  'app/controllers/todos',
  'ember',
  ], function($, Store, TodosController) {
    var App = Ember.Application.create({
      VERSION: '0.2-omfg',
      init: function() {
        this._super();

        this.set(
          'store',
          new Store('todos-emberjs')
        );

        this.set(
          'todosController',
          TodosController.create({
            store: this.get('store')
          })
        );

        if (typeof(mocha) !== 'undefined') {
          window.expect = chai.expect;
          mocha.setup('bdd');
          require([
            'app/specs/models/store',
            'app/specs/views/basic_acceptance',
            'app/specs/controllers/main'
          ], function(){
            mocha
              .run()
              .globals(['$', 'Ember', 'Todos'])
          });
        }
      }
    });
    return window.Todos = App;
  }
);
