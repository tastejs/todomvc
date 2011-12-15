(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.Tasks = (function() {
    var ENTER_KEY, ESCAPE_KEY;

    __extends(Tasks, Spine.Controller);

    ENTER_KEY = 13;

    ESCAPE_KEY = 27;

    Tasks.prototype.elements = {
      'form.edit': 'form'
    };

    Tasks.prototype.events = {
      'click a.destroy': 'remove',
      'click input[type=checkbox]': 'toggleStatus',
      'dblclick .view': 'edit',
      'keypress input[type=text]': 'finishEditOnEnter',
      'blur input[type=text]': 'finishEdit'
    };

    function Tasks() {
      this.render = __bind(this.render, this);      Tasks.__super__.constructor.apply(this, arguments);
      this.task.bind('update', this.render);
      this.task.bind('destroy', this.release);
    }

    Tasks.prototype.render = function() {
      this.replace($('#task-template').tmpl(this.task));
      return this;
    };

    Tasks.prototype.remove = function() {
      return this.task.destroy();
    };

    Tasks.prototype.toggleStatus = function() {
      return this.task.updateAttribute('done', !this.task.done);
    };

    Tasks.prototype.edit = function() {
      this.el.addClass('editing');
      return this.$('input[name=name]').focus();
    };

    Tasks.prototype.finishEdit = function() {
      this.el.removeClass('editing');
      return this.task.fromForm(this.form).save();
    };

    Tasks.prototype.finishEditOnEnter = function(e) {
      var _ref;
      if ((_ref = e.keyCode) === ENTER_KEY || _ref === ESCAPE_KEY) {
        return this.finishEdit();
      }
    };

    return Tasks;

  })();

}).call(this);
