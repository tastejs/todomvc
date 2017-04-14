'use strict';

(function ($) {
    var todo = new Todo();
    routes({todo: todo});

    // Binds the Todo Presenter
    todoPresenter($("#todoapp"), {
        model: todo,
        template: $('#task-template').html(),
    });

    // Binds the Footer Presenter
    footerPresenter($("#footer"), {
        model: todo,
        template: $('#footer-template').html(),
    });
})(jQuery);
