/*
Lavaca 1.0.4
Copyright (c) 2012 Mutual Mobile

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
(function(ns, $, ScrollableView) {

/**
 * @class app.ui.TodoView
 * @super app.ui.BaseView
 * A view that can be touch-scrolled
 */
ns.TodosView = ScrollableView.extend(function() {
  ScrollableView.apply(this, arguments);
  this.mapEvent({
    '#new-todo': {keypress: this.updateInput},
    'input[type=checkbox]': {tap: this.toggleDone},
    '.todo': {
      dblclick: this.toggleEdit,
      swipe: this.toggleEdit
    },
    '.text-edit': {
      keypress: this.editTodo,
      blur: this.editTodo
    },
    model: {
      addItem: this.drawTodo,
      removeItem: this.redrawTodo,
      changeItem: this.redrawTodo
    }
  });
}, {
  /**
   * @field {Number} column
   * @default 0
   * The horizontal column in which the view should live
   */
  column: 0,
  /**
   * @field {String} template
   * @default 'todos'
   * The name of the template used by the view
   */
  template: 'todos',
  /**
   * @field {String} className
   * @default 'todos'
   * A class name added to the view container
   */
  className: 'todos',
  /**
   * @method updateScroll
   * Updates the scroll widget
   */
  updateScroll: function() {
    var id,
        widget;
    for (id in this.widgets) {
      widget = this.widgets[id];
      if (widget instanceof Lavaca.ui.Scrollable) {
        widget.refresh();
      }
    }
  },
  /**
   * @method updateInput
   * Adds a new todo to the collections
   */
  updateInput: function(e) {
    if (e.keyCode == 13) {
      var input = $(e.currentTarget);
      app.router
        .exec('/todo/add', null, {text: input.val()})
        .then(function() {
          input.val('');
        });
    }
  },
  /**
   * @method redrawMeta
   * Re-renders the todo list meta data
   * @param {Lavaca.mvc.ItemEvent} e  The data event
   */
  redrawMeta: function(e) {
    var meta = this.el.find('.todo-meta'),
        self = this;
    Lavaca.ui.Template
      .render('footer', e.currentTarget.toObject())
      .then(function(html) {
        meta.html(html);
        self.updateScroll();
      });
  },
  /**
   * @method redrawTodo
   * Re-renders a todo list item
   * @param {Lavaca.mvc.ItemEvent} e  The data event
   */
  redrawTodo: function(e) {
    var cid = e.model.get('cid'),
        li = this.el.find('li[data-cid="' + cid + '"]'),
        self = this;
    if (e.type == 'removeItem') {
      li.remove();
    } else {
      Lavaca.ui.Template
        .render('todo', e.model.toObject())
        .then(function(html) {
          li.replaceWith(html);
          self.updateScroll();
        });
    }
    this.redrawMeta(e);
  },
  /**
   * @method drawTodo
   * Renders a todo list item
   * @param {Lavaca.mvc.ItemEvent} e  The data event
   */
  drawTodo: function(e) {
    var ul = this.el.find('.todo-list'),
        self = this;
    Lavaca.ui.Template
      .render('todo', e.model.toObject())
      .then(function(html) {
        ul.append(html);
        self.updateScroll();
      });
    this.redrawMeta(e);
  },
  /**
   * @method toggleDone
   * Toggles the todo done
   * @param {MouseEvent} e  The click event
   */
  toggleDone: function(e) {
    var checkbox = $(e.currentTarget),
        li = checkbox.parent(),
        cid = li.attr('data-cid'),
        done = li.hasClass('done');
    app.router.exec('/todo/mark/' + cid, null, {done: !done});
  },
  /**
   * @method editTodo
   * Toggles the edit mode
   * @param {MouseEvent} e  The click event
   */
  editTodo: function(e) {
    if (e.which && e.which != 13) {
      return;
    } else if (e.which == 13){
      $(e.currentTarget).blur();
      return;
    }
    var input = $(e.currentTarget),
        li = input.parent().toggleClass('edit'),
        cid = li.attr('data-cid'),
        text = input.val();
    input.remove();
    app.router.exec('/todo/edit/' + cid, null, {text: text})
  },
  /**
   * @method toggleEdit
   * Toggles the edit mode
   * @param {MouseEvent} e  The click event
   */
  toggleEdit: function(e) {
    var li = $(e.currentTarget).toggleClass('edit'),
        text;
    if (li.hasClass('edit')) {
      text = li.find('label').text();
      li.append('<input type="text" class="text-edit" value="' + text + '">');
      li.find('.text-edit').focus();
    }
  }
});

})(app.ui.views, Lavaca.$, app.ui.views.ScrollableView);