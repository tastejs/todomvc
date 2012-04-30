(function() {
  /*
  	knockback-todos.js
  	(c) 2011 Kevin Malakoff.
  	Knockback-Todos is freely distributable under the MIT license.
  	See the following for full license details:
  		https:#github.com/kmalakoff/knockback-todos/blob/master/LICENSE
  */
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  $(function() {
    var todos;
    ko.bindingHandlers.dblclick = {
      init: function(element, value_accessor) {
        return $(element).dblclick(ko.utils.unwrapObservable(value_accessor()));
      }
    };
    ko.bindingHandlers.block = {
      update: function(element, value_accessor) {
        return element.style.display = ko.utils.unwrapObservable(value_accessor()) ? 'block' : 'none';
      }
    };
    ko.bindingHandlers.selectAndFocus = {
      init: function(element, value_accessor, all_bindings_accessor) {
        ko.bindingHandlers.hasfocus.init(element, value_accessor, all_bindings_accessor);
        return ko.utils.registerEventHandler(element, 'focus', function() {
          return element.select();
        });
      },
      update: function(element, value_accessor) {
        ko.utils.unwrapObservable(value_accessor());
        return _.defer(__bind(function() {
          return ko.bindingHandlers.hasfocus.update(element, value_accessor);
        }, this));
      }
    };
    window.app_settings_view_model = new AppSettingsViewModel();
    todos = new TodosCollection();
    window.app_view_model = new AppViewModel(todos);
    ko.applyBindings(app_view_model, $('#todoapp')[0]);
    new AppRouter();
    Backbone.history.start();
    return todos.fetch();
  });
}).call(this);
