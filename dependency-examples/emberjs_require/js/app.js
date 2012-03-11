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
  'ember',
  'app/models/store',
  'app/controllers/main',
  ], function($, Ember, Store, Main) {
    var App = Em.Application.create({
      VERSION: '0.1-omfg',
      Views: {},
      Models: {},
      Controllers: {},
      init: function() {
        this._super();
        this.Models.Store = new Store('todos-emberjs');
        this.Controllers.Main = Main.create();

        var items = this.Models.Store.findAll();
        if (items.length > 1){
          this.Controllers.Main.set('[]', items);
        };

        if (typeof(mocha) !== 'undefined') {
          window.expect = chai.expect;
          mocha.setup('bdd');
          require([
            'app/specs/models/store',
            'app/specs/views/basic_acceptance',
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
