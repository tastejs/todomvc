'use strict';

function routes(models) {
    $.route(function(hash) {
        models.todo.trigger("reload", models.todo.items(hash.slice(2)));
    });
}
