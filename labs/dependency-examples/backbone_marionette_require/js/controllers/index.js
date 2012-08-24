/*global define*/

define(['vent'], function (vent) {
  "use strict";

  return {
    setFilter : function(param) {
      vent.trigger('todoList:filter', param.trim() || '');
    }
  };
});
