goog.provide('todomvc.listmodel');

goog.require('mvc.Collection');
goog.require('todomvc.listsync');
goog.require('todomvc.todocontrol');


/**
 * @constructor
 * @extends {mvc.Collection}
 */
todomvc.listmodel = function() {
  var todosSchema = {
    'completed': {
      get: function() {
        return this.getModels(function(mod) {
          return mod.get('completed');
        });
      },
      models: true
    }
  };

  goog.base(this, {
    'id': 'todos-plastronjs',
    'sync': new todomvc.listsync(),
    'schema': todosSchema
  });

  this.returnState_ = todomvc.listmodel.ReturnState.DEFAULT;
};
goog.inherits(todomvc.listmodel, mvc.Collection);


/**
 * @enum {Function}
 * @return {boolean} filter.
 */
todomvc.listmodel.ReturnState = {
  DEFAULT: function() {return true},
  ACTIVE: function(model) {return !model.get('completed')},
  COMPLETED: function(model) {return model.get('completed')}
};


/**
 * @return {Object} todos as json.
 */
todomvc.listmodel.prototype.toJson = function() {
  return goog.array.map(this.getModels(), function(mod) {
    return mod.toJson();
  });
};


/**
 * @param {todomvc.listmodel.ReturnState} state to decide models returned.
 */
todomvc.listmodel.prototype.setReturnState = function(state) {
  this.returnState_ = state;
};


/**
 * @inheritDoc
 */
todomvc.listmodel.prototype.getModels = function(opt_filter) {
  return goog.base(this, 'getModels', opt_filter || this.returnState_);
};

