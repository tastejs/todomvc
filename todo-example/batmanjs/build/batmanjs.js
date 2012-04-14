(function() {
  var Batmanjs;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Batmanjs = (function() {
    __extends(Batmanjs, Batman.App);
    function Batmanjs() {
      Batmanjs.__super__.constructor.apply(this, arguments);
    }
    Batmanjs.global(true);
    Batmanjs.model('todo');
    Batmanjs.controller('todos');
    Batmanjs.root('todos#index');
    return Batmanjs;
  })();
}).call(this);
