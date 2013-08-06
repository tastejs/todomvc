(function() {
  window.Todo = {};

  Todo.log = function(status) {
    if (typeof console !== "undefined" && console !== null) {
      return console.log("LOG:", status);
    }
  };

  Todo.warn = function(status) {
    if (typeof console !== "undefined" && console !== null) {
      return console.log("WARNING:", status);
    }
  };

  Todo.title = function(title) {
    if (typeof window !== "undefined" && window !== null) {
      return window.title = title;
    }
  };

}).call(this);

(function() {

  Todo.Item = Mozart.Model.create({
    modelName: 'TodoItem'
  });

  Todo.Item.attributes({
    'title': 'string',
    'completed': 'boolean'
  });

  Todo.Item.index('completed');

  Todo.Item.localStorage({
    prefix: 'todos-mozart'
  });

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Todo.AppController = (function(_super) {

    __extends(AppController, _super);

    function AppController() {
      this.clearCompleted = __bind(this.clearCompleted, this);

      this.createItem = __bind(this.createItem, this);

      this.itemsChanged = __bind(this.itemsChanged, this);

      this.setMode = __bind(this.setMode, this);

      this.modeChanged = __bind(this.modeChanged, this);
      return AppController.__super__.constructor.apply(this, arguments);
    }

    AppController.prototype.init = function() {
      Todo.Item.loadAllLocalStorage();
      this.set('items', Todo.Item);
      this.set('completedfilter', null);
      this.bind('change:mode', this.modeChanged);
      this.set('mode', 'all');
      Todo.Item.bind('change', this.itemsChanged);
      return this.itemsChanged();
    };

    AppController.prototype.modeChanged = function() {
      switch (this.mode) {
        case 'completed':
          return this.set('completedfilter', 'true');
        case 'active':
          return this.set('completedfilter', 'false');
        default:
          return this.set('completedfilter', '');
      }
    };

    AppController.prototype.setMode = function(mode) {
      return this.set('mode', mode);
    };

    AppController.prototype.itemsChanged = function() {
      this.set('displayItems', Todo.Item.count() !== 0);
      this.set('itemCount', Todo.Item.findByAttribute('completed', false).length);
      this.set('completedItemCount', Todo.Item.count() - this.itemCount);
      return this.set('allChecked', this.itemCount === 0);
    };

    AppController.prototype.createItem = function(title) {
      if (!((title != null) && title.length > 0)) {
        return;
      }
      Todo.Item.createFromValues({
        title: title.trim(),
        completed: false
      });
      return this.itemsChanged();
    };

    AppController.prototype.clearCompleted = function() {
      var item, _i, _len, _ref, _results;
      _ref = Todo.Item.all();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        if (item.completed) {
          _results.push(item.destroy());
        }
      }
      return _results;
    };

    AppController.prototype.setCheckAll = function(view, checked) {
      var item, _i, _len, _ref, _results;
      _ref = Todo.Item.all();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        item.set('completed', checked);
        _results.push(item.save());
      }
      return _results;
    };

    return AppController;

  })(Mozart.Controller);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Todo.AppView = (function(_super) {

    __extends(AppView, _super);

    function AppView() {
      return AppView.__super__.constructor.apply(this, arguments);
    }

    AppView.prototype.templateName = 'app/templates/todo_app_view';

    AppView.prototype.tag = 'section';

    AppView.prototype.id = 'todoapp';

    return AppView;

  })(Mozart.View);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Todo.FiltersView = (function(_super) {

    __extends(FiltersView, _super);

    function FiltersView() {
      this.modeChanged = __bind(this.modeChanged, this);

      this.afterRender = __bind(this.afterRender, this);
      return FiltersView.__super__.constructor.apply(this, arguments);
    }

    FiltersView.prototype.templateName = 'app/templates/todo_filters_view';

    FiltersView.prototype.tag = 'ul';

    FiltersView.prototype.id = 'filters';

    FiltersView.prototype.init = function() {
      FiltersView.__super__.init.apply(this, arguments);
      return this.bind('change:mode', this.modeChanged);
    };

    FiltersView.prototype.afterRender = function() {
      return this.modeChanged();
    };

    FiltersView.prototype.modeChanged = function() {
      if (this.element == null) {
        return;
      }
      this.element.find("a").removeClass('selected');
      switch (this.mode) {
        case 'completed':
          return this.element.find("#" + this.id + "-completed").addClass('selected');
        case 'active':
          return this.element.find("#" + this.id + "-active").addClass('selected');
        default:
          return this.element.find("#" + this.id + "-all").addClass('selected');
      }
    };

    return FiltersView;

  })(Mozart.View);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Todo.InfoView = (function(_super) {

    __extends(InfoView, _super);

    function InfoView() {
      return InfoView.__super__.constructor.apply(this, arguments);
    }

    InfoView.prototype.templateName = 'app/templates/todo_info_view';

    InfoView.prototype.tag = 'footer';

    InfoView.prototype.id = 'info';

    return InfoView;

  })(Mozart.View);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Todo.ItemLabelView = (function(_super) {

    __extends(ItemLabelView, _super);

    function ItemLabelView() {
      this.dblClick = __bind(this.dblClick, this);

      this.itemChanged = __bind(this.itemChanged, this);

      this.afterRender = __bind(this.afterRender, this);
      return ItemLabelView.__super__.constructor.apply(this, arguments);
    }

    ItemLabelView.prototype.skipTemplate = true;

    ItemLabelView.prototype.tag = "label";

    ItemLabelView.prototype.init = function() {
      ItemLabelView.__super__.init.apply(this, arguments);
      return this.bind('change:value', this.itemChanged);
    };

    ItemLabelView.prototype.afterRender = function() {
      return this.itemChanged();
    };

    ItemLabelView.prototype.itemChanged = function() {
      if (!this.element) {
        return;
      }
      return this.element.html(this.value);
    };

    ItemLabelView.prototype.dblClick = function(e) {
      if (this.parent.editItem != null) {
        return this.parent.editItem();
      }
    };

    return ItemLabelView;

  })(Mozart.View);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  Todo.ItemView = (function(_super) {

    __extends(ItemView, _super);

    function ItemView() {
      this.save = __bind(this.save, this);

      this.load = __bind(this.load, this);

      this.isDirty = __bind(this.isDirty, this);

      this.checkKey = __bind(this.checkKey, this);

      this.removeItem = __bind(this.removeItem, this);

      this.itemChanged = __bind(this.itemChanged, this);

      this.focusOut = __bind(this.focusOut, this);

      this.editItem = __bind(this.editItem, this);

      this.afterRender = __bind(this.afterRender, this);
      return ItemView.__super__.constructor.apply(this, arguments);
    }

    ItemView.prototype.templateName = 'app/templates/todo_item_view';

    ItemView.prototype.tag = 'li';

    ItemView.prototype.init = function() {
      ItemView.__super__.init.apply(this, arguments);
      this.content.bind('change', this.itemChanged);
      return this.bind('change:completed', this.focusOut);
    };

    ItemView.prototype.afterRender = function() {
      return this.itemChanged();
    };

    ItemView.prototype.editItem = function() {
      this.element.addClass('editing');
      return this.childView('textBox').focus();
    };

    ItemView.prototype.focusOut = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (this.element == null) {
        return;
      }
      this.element.removeClass('editing');
      if (this.title.length === 0) {
        return this.removeItem();
      } else {
        if (this.isDirty()) {
          return this.save();
        }
      }
    };

    ItemView.prototype.itemChanged = function() {
      if (!((this.content != null) && (this.element != null))) {
        return;
      }
      this.load();
      if (this.completed) {
        return this.element.addClass('completed');
      } else {
        return this.element.removeClass('completed');
      }
    };

    ItemView.prototype.removeItem = function() {
      return this.content.destroy();
    };

    ItemView.prototype.checkKey = function(e) {
      switch (e.keyCode) {
        case 13:
          return this.childView('textBox').blur();
        case 27:
          this.load();
          return this.childView('textBox').blur();
      }
    };

    ItemView.prototype.isDirty = function() {
      return this.content.title !== this.title || this.content.completed !== this.completed;
    };

    ItemView.prototype.load = function() {
      this.set('title', this.content.title);
      return this.set('completed', this.content.completed);
    };

    ItemView.prototype.save = function() {
      this.content.set('title', this.title);
      this.content.set('completed', this.completed);
      return this.content.save();
    };

    return ItemView;

  })(Mozart.View);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Todo.CheckboxControl = (function(_super) {

    __extends(CheckboxControl, _super);

    function CheckboxControl() {
      this.updateValue = __bind(this.updateValue, this);

      this.afterRender = __bind(this.afterRender, this);
      return CheckboxControl.__super__.constructor.apply(this, arguments);
    }

    CheckboxControl.prototype.tag = 'input';

    CheckboxControl.prototype.typeHtml = 'checkbox';

    CheckboxControl.prototype.skipTemplate = true;

    CheckboxControl.prototype.init = function() {
      var method, target, _ref,
        _this = this;
      CheckboxControl.__super__.init.apply(this, arguments);
      this.bind('change:value', this.updateValue);
      if (this.checkAction) {
        _ref = Mozart.parsePath(this.checkAction), target = _ref[0], method = _ref[1];
        if (target != null) {
          target = Mozart.getPath(this.parent, target);
        } else {
          target = this.parent;
        }
        return this.bind('check', function(data) {
          return target[method](_this, data);
        });
      }
    };

    CheckboxControl.prototype.afterRender = function() {
      return this.updateValue();
    };

    CheckboxControl.prototype.updateValue = function() {
      if (this.element == null) {
        return;
      }
      return this.element[0].checked = this.value;
    };

    CheckboxControl.prototype.setValue = function() {
      if (this.element == null) {
        return;
      }
      this.trigger('check', this.element[0].checked);
      return this.set('value', this.element[0].checked);
    };

    CheckboxControl.prototype.change = function() {
      return this.setValue();
    };

    return CheckboxControl;

  })(Mozart.Control);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Todo.TextControl = (function(_super) {

    __extends(TextControl, _super);

    function TextControl() {
      this.keyUp = __bind(this.keyUp, this);

      this.updateInputValue = __bind(this.updateInputValue, this);

      this.afterRender = __bind(this.afterRender, this);
      return TextControl.__super__.constructor.apply(this, arguments);
    }

    TextControl.prototype.tag = "input";

    TextControl.prototype.skipTemplate = true;

    TextControl.prototype.init = function() {
      TextControl.__super__.init.apply(this, arguments);
      return this.bind('change:value', this.updateInputValue);
    };

    TextControl.prototype.afterRender = function() {
      if (this.typeHtml != null) {
        this.element.type = this.typeHtml;
      }
      this.updateInputValue();
      return this.element;
    };

    TextControl.prototype.updateInputValue = function() {
      if (this.element == null) {
        return;
      }
      return this.element.val(this.value);
    };

    TextControl.prototype.focus = function() {
      if (this.element == null) {
        return;
      }
      return this.element.focus();
    };

    TextControl.prototype.blur = function() {
      if (this.element == null) {
        return;
      }
      return this.element.blur();
    };

    TextControl.prototype.keyUp = function(e) {
      var _base, _name;
      this.set('value', this.element.val());
      if (this.keyUpAction != null) {
        return typeof (_base = this.parent)[_name = this.keyUpAction] === "function" ? _base[_name](e) : void 0;
      }
    };

    return TextControl;

  })(Mozart.Control);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Todo.ClearCompletedControl = (function(_super) {

    __extends(ClearCompletedControl, _super);

    function ClearCompletedControl() {
      this.click = __bind(this.click, this);

      this.beforeRender = __bind(this.beforeRender, this);
      return ClearCompletedControl.__super__.constructor.apply(this, arguments);
    }

    ClearCompletedControl.prototype.templateName = 'app/templates/controls/todo_clear_completed_control';

    ClearCompletedControl.prototype.tag = 'button';

    ClearCompletedControl.prototype.id = "clear-completed";

    ClearCompletedControl.prototype.init = function() {
      ClearCompletedControl.__super__.init.apply(this, arguments);
      return this.bind('change:value', this.redraw);
    };

    ClearCompletedControl.prototype.beforeRender = function() {
      return this.display = this.value !== 0;
    };

    ClearCompletedControl.prototype.click = function() {
      return Todo.appController.clearCompleted();
    };

    return ClearCompletedControl;

  })(Mozart.View);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Todo.NewItemControl = (function(_super) {

    __extends(NewItemControl, _super);

    function NewItemControl() {
      this.keyUp = __bind(this.keyUp, this);
      return NewItemControl.__super__.constructor.apply(this, arguments);
    }

    NewItemControl.prototype.placeholderHtml = i18n.todo.whatNeedsDone();

    NewItemControl.prototype.autofocusHtml = '';

    NewItemControl.prototype.id = 'new-todo';

    NewItemControl.prototype.keyUp = function(e) {
      if (e.keyCode === 13) {
        Todo.appController.createItem(this.value);
        return this.set('value', null);
      } else {
        return NewItemControl.__super__.keyUp.apply(this, arguments);
      }
    };

    return NewItemControl;

  })(Todo.TextControl);

}).call(this);

(function() {

  Todo.appController = Todo.AppController.create();

  Mozart.root = window;

  Todo.Application = Mozart.MztObject.create();

  Todo.Application.set('appLayout', Mozart.Layout.create({
    rootElement: '#todoapp',
    states: [
      Mozart.Route.create({
        viewClass: Todo.AppView,
        path: "/"
      })
    ]
  }));

  Todo.Application.set('infoLayout', Mozart.Layout.create({
    rootElement: '#info',
    states: [
      Mozart.Route.create({
        viewClass: Todo.InfoView,
        path: "/"
      })
    ]
  }));

  Todo.Application.ready = function() {
    Todo.Application.set('domManager', Mozart.DOMManager.create({
      rootElement: 'body',
      layouts: [Todo.Application.appLayout, Todo.Application.infoLayout]
    }));
    Todo.Application.appLayout.bindRoot();
    Todo.Application.appLayout.navigateRoute('/');
    Todo.Application.infoLayout.bindRoot();
    Todo.Application.infoLayout.navigateRoute('/');
    Todo.Application.set('router', Mozart.Router.create({
      useHashRouting: true
    }));
    Todo.Application.router.register('/', Todo.appController.setMode, 'all');
    Todo.Application.router.register('/active', Todo.appController.setMode, 'active');
    Todo.Application.router.register('/completed', Todo.appController.setMode, 'completed');
    Todo.Application.router.start();
    return $(document).trigger('Mozart:loaded');
  };

  $(document).ready(Todo.Application.ready);

}).call(this);

this["HandlebarsTemplates"] = this["HandlebarsTemplates"] || {};

this["HandlebarsTemplates"]["app/templates/controls/todo_clear_completed_control"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, stack2, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, functionType="function";


  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.i18n),stack1 ? stack1.call(depth0, "todo.clearCompleted", options) : helperMissing.call(depth0, "i18n", "todo.clearCompleted", options)))
    + " (";
  if (stack2 = helpers.value) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.value; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + ")";
  return buffer;
  });

this["HandlebarsTemplates"]["app/templates/todo_app_view"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, stack2, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, options;
  buffer += "\n  ";
  options = {hash:{
    'id': ("toggle-all"),
    'valueObserveBinding': ("Todo.appController.allChecked"),
    'checkAction': ("Todo.appController.setCheckAll")
  },data:data};
  buffer += escapeExpression(((stack1 = helpers.view),stack1 ? stack1.call(depth0, "Todo.CheckboxControl", options) : helperMissing.call(depth0, "view", "Todo.CheckboxControl", options)))
    + "\n  <label for=\"toggle-all\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.i18n),stack1 ? stack1.call(depth0, "todo.markAllAsComplete", options) : helperMissing.call(depth0, "i18n", "todo.markAllAsComplete", options)))
    + "</label>\n  ";
  options = {hash:{
    'collectionObserveBinding': ("Todo.appController.items"),
    'id': ("todo-list"),
    'filterAttribute': ("completed"),
    'filterTextObserveBinding': ("Todo.appController.completedfilter")
  },data:data};
  buffer += escapeExpression(((stack1 = helpers.collection),stack1 ? stack1.call(depth0, "Todo.ItemView", options) : helperMissing.call(depth0, "collection", "Todo.ItemView", options)))
    + "\n";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1, options;
  buffer += "\n  <span id=\"todo-count\">";
  options = {hash:{
    'ITEMSObserveBinding': ("Todo.appController.itemCount"),
    'tag': ("strong")
  },data:data};
  buffer += escapeExpression(((stack1 = helpers.bindI18n),stack1 ? stack1.call(depth0, "todo.itemCount", options) : helperMissing.call(depth0, "bindI18n", "todo.itemCount", options)))
    + "</span>\n  ";
  options = {hash:{
    'modeObserveBinding': ("Todo.appController.mode")
  },data:data};
  buffer += escapeExpression(((stack1 = helpers.view),stack1 ? stack1.call(depth0, "Todo.FiltersView", options) : helperMissing.call(depth0, "view", "Todo.FiltersView", options)))
    + "\n  ";
  options = {hash:{
    'valueObserveBinding': ("Todo.appController.completedItemCount")
  },data:data};
  buffer += escapeExpression(((stack1 = helpers.view),stack1 ? stack1.call(depth0, "Todo.ClearCompletedControl", options) : helperMissing.call(depth0, "view", "Todo.ClearCompletedControl", options)))
    + "\n";
  return buffer;
  }

  buffer += "<header id=\"header\">\n  <h1>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.i18n),stack1 ? stack1.call(depth0, "todo.todos", options) : helperMissing.call(depth0, "i18n", "todo.todos", options)))
    + "</h1>\n  ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.view),stack1 ? stack1.call(depth0, "Todo.NewItemControl", options) : helperMissing.call(depth0, "view", "Todo.NewItemControl", options)))
    + "\n</header>\n\n";
  options = {hash:{
    'id': ("main"),
    'tag': ("section"),
    'displayObserveBinding': ("Todo.appController.displayItems")
  },inverse:self.noop,fn:self.program(1, program1, data),data:data};
  stack2 = ((stack1 = helpers.view),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "view", options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n\n";
  options = {hash:{
    'id': ("footer"),
    'tag': ("footer"),
    'displayObserveBinding': ("Todo.appController.displayItems")
  },inverse:self.noop,fn:self.program(3, program3, data),data:data};
  stack2 = ((stack1 = helpers.view),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "view", options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  return buffer;
  });

this["HandlebarsTemplates"]["app/templates/todo_filters_view"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


  buffer += "<li>\n  <a id=\"";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "-all\" href=\"#/\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.i18n),stack1 ? stack1.call(depth0, "todo.all", options) : helperMissing.call(depth0, "i18n", "todo.all", options)))
    + "</a>\n</li>\n<li>\n  <a id=\"";
  if (stack2 = helpers.id) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.id; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "-active\" href=\"#/active\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.i18n),stack1 ? stack1.call(depth0, "todo.active", options) : helperMissing.call(depth0, "i18n", "todo.active", options)))
    + "</a>\n</li>\n<li>\n  <a id=\"";
  if (stack2 = helpers.id) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.id; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "-completed\" href=\"#/completed\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.i18n),stack1 ? stack1.call(depth0, "todo.complete", options) : helperMissing.call(depth0, "i18n", "todo.complete", options)))
    + "</a>\n</li>";
  return buffer;
  });

this["HandlebarsTemplates"]["app/templates/todo_info_view"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  buffer += "<p>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.i18n),stack1 ? stack1.call(depth0, "todo.doubleClickEdit", options) : helperMissing.call(depth0, "i18n", "todo.doubleClickEdit", options)))
    + "</p>\n<p>";
  options = {hash:{
    'NAME': ("Tom Cully"),
    'URL': ("http://mozart.io")
  },data:data};
  buffer += escapeExpression(((stack1 = helpers.i18n),stack1 ? stack1.call(depth0, "todo.createdBy", options) : helperMissing.call(depth0, "i18n", "todo.createdBy", options)))
    + " - <a href=\"http://github.com/tomcully/todomvc-mozart\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.i18n),stack1 ? stack1.call(depth0, "todo.fullSource", options) : helperMissing.call(depth0, "i18n", "todo.fullSource", options)))
    + "</a></p>\n<p>";
  options = {hash:{
    'NAME': ("TodoMVC"),
    'URL': ("http://todomvc.com")
  },data:data};
  buffer += escapeExpression(((stack1 = helpers.i18n),stack1 ? stack1.call(depth0, "todo.partOf", options) : helperMissing.call(depth0, "i18n", "todo.partOf", options)))
    + "</p>";
  return buffer;
  });

this["HandlebarsTemplates"]["app/templates/todo_item_view"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  buffer += "<div class=\"view\">\n	";
  options = {hash:{
    'valueBinding': ("completed"),
    'classHtml': ("toggle")
  },data:data};
  buffer += escapeExpression(((stack1 = helpers.view),stack1 ? stack1.call(depth0, "Todo.CheckboxControl", options) : helperMissing.call(depth0, "view", "Todo.CheckboxControl", options)))
    + "\n	";
  options = {hash:{
    'valueObserveBinding': ("title")
  },data:data};
  buffer += escapeExpression(((stack1 = helpers.view),stack1 ? stack1.call(depth0, "Todo.ItemLabelView", options) : helperMissing.call(depth0, "view", "Todo.ItemLabelView", options)))
    + "\n	<button class=\"destroy\" ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.action),stack1 ? stack1.call(depth0, "removeItem", options) : helperMissing.call(depth0, "action", "removeItem", options)))
    + "></button>\n</div>\n";
  options = {hash:{
    'name': ("textBox"),
    'valueBinding': ("title"),
    'classHtml': ("edit"),
    'keyUpAction': ("checkKey")
  },data:data};
  buffer += escapeExpression(((stack1 = helpers.view),stack1 ? stack1.call(depth0, "Todo.TextControl", options) : helperMissing.call(depth0, "view", "Todo.TextControl", options)));
  return buffer;
  });
