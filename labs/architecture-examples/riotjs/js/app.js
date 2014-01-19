'use strict';

window.todo = new Todo();

todoPresenter($("#todoapp"), {
    model: todo,
    template: $('[type="html/todo"]').html(),
});

filtersPresenter($("#filters a"));

routes({todo: todo});
