/*
Sets up defaults for all the Template methods such as a default template

@constructor
*/


(function() {
  var Template;

  Template = (function() {
    function Template() {
      this.defaultTemplate = "<li data-id=\"{{id}}\" class=\"{{completed}}\">\n       <div class=\"view\">\n           <input class=\"toggle\" type=\"checkbox\" {{checked}}>\n           <label>{{title}}</label>\n           <button class=\"destroy\"></button>\n      </div>\n</li>";
    }

    /*
    Creates an <li> HTML string and returns it for placement in your app.
    
    NOTE: In real life you should be using a templating engine such as Mustache
    or Handlebars, however, this is a vanilla JS example.
    
    @param {object} data The object containing keys you want to find in the
                         template to replace.
    @returns {string} HTML String of an <li> element
    
    @example
    view.show({
     id: 1,
     title: "Hello World",
     completed: 0,
    });
    */


    Template.prototype.show = function(data) {
      var checked, completed, item, template, view, _i, _len;
      view = '';
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        item = data[_i];
        template = this.defaultTemplate;
        completed = '';
        checked = '';
        if (item.completed) {
          completed = 'completed';
          checked = 'checked';
        }
        template = template.replace('{{id}}', item.id);
        template = template.replace('{{title}}', item.title);
        template = template.replace('{{completed}}', completed);
        template = template.replace('{{checked}}', checked);
        view = view + template;
      }
      return view;
    };

    /*
    Displays a counter of how many to dos are left to complete
    
    @param {number} activeTodos The number of active todos.
    @returns {string} String containing the count
    */


    Template.prototype.itemCounter = function(activeTodos) {
      var plural;
      plural = activeTodos === 1 ? '' : 's';
      return '<strong>' + activeTodos + '</strong> item' + plural + ' left';
    };

    /*
    Updates the text within the "Clear completed" button
    
    @param  {[type]} completedTodos The number of completed todos.
    @returns {string} String containing the count
    */


    Template.prototype.clearCompletedButton = function(completedTodos) {
      if (completedTodos > 0) {
        return 'Clear completed (' + completedTodos + ')';
      } else {
        return '';
      }
    };

    return Template;

  })();

  window.app = window.app || {};

  window.app.Template = Template;

}).call(this);
