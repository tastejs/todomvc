'use strict';

(function ($) {
  var todo = new Todo();
  routes({todo: todo});

  todoPresenter($("#todoapp"), {
      model: todo,
      template: $('template[name="task"]').html(),
  });

  filtersPresenter($("#filters a"));
  footerPresenter($("#footer"), {model: todo});
})(jQuery);
