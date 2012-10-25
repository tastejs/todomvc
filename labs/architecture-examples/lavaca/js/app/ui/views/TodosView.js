/*
Lavaca 1.0.4
Copyright (c) 2012 Mutual Mobile

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
(function(ns, $, View) {

/**
 * @class app.ui.TodoView
 * @super app.ui.BaseView
 * A view that can be touch-scrolled
 */
ns.TodosView = View.extend(function() {
  View.apply(this, arguments);
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
});

})(Lavaca.resolve('app.ui.views', true), Lavaca.$, Lavaca.mvc.View);