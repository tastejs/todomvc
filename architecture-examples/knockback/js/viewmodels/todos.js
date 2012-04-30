(function() {
  var TodoViewModel;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  TodoViewModel = function(model) {
    this.editing = ko.observable(false);
    this.completed = kb.observable(model, {
      key: 'completed',
      write: (function(completed) {
        return model.save({
          completed: completed
        });
      })
    }, this);
    this.visible = ko.computed(__bind(function() {
      switch (app_settings_view_model.list_filter_mode()) {
        case 'active':
          return !this.completed();
        case 'completed':
          return this.completed();
        default:
          return true;
      }
    }, this));
    this.title = kb.observable(model, {
      key: 'title',
      write: (__bind(function(title) {
        if ($.trim(title)) {
          model.save({
            title: $.trim(title)
          });
        } else {
          model.save({
            completed: true
          });
        }
        return this.editing(false);
      }, this))
    }, this);
    this.onDestroyTodo = __bind(function() {
      return model.destroy();
    }, this);
    this.onCheckEditBegin = __bind(function() {
      if (!this.editing() && !this.completed()) {
        this.editing(true);
        return $('.todo-input').focus();
      }
    }, this);
    this.onCheckEditEnd = __bind(function(view_model, event) {
      if ((event.keyCode === 13) || (event.type === 'blur')) {
        $('.todo-input').blur();
        return this.editing(false);
      }
    }, this);
    return this;
  };
  window.TodosViewModel = function(todos) {
    this.todos = ko.observableArray([]);
    this.collection_observable = kb.collectionObservable(todos, this.todos, {
      view_model: TodoViewModel
    });
    this.tasks_exist = ko.computed(__bind(function() {
      return this.collection_observable().length;
    }, this));
    this.all_completed = ko.computed({
      read: __bind(function() {
        return !this.collection_observable.collection().remainingCount();
      }, this),
      write: __bind(function(completed) {
        return this.collection_observable.collection().completeAll(completed);
      }, this)
    });
    return this;
  };
}).call(this);
