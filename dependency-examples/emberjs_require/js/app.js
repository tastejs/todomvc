// Define libraries
require.config({
  baseUrl: 'js/',
  paths: {
    jquery: 'libs/jquery-1.7.1.min',
    ember: 'libs/ember-0.9.min',
    text: 'libs/require/text'
  }
});

// Load our app
define('app', [
  'jquery',
  'app/models/store',
  'app/controllers/main',
  'ember',
  ], function($, Store, Main) {
    var App = Ember.Application.create({
      VERSION: '0.1-omfg',
      Views: Ember.Namespace.create(),
      Models: Ember.Namespace.create(),
      Controllers: Ember.Namespace.create(),
      init: function() {
        this._super();
        this.Models.set('store', new Store('todos-emberjs'));
        this.Controllers.set('main', Main.create());

        var items = this.Models.get('store').findAll();
        if (items.length > 0) {
          this.Controllers.get('main').set('[]', items);
        };

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
