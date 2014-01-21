'use strict';

function routes(models) {
    $.route(function(hash) {
        models.todo.trigger("reload", hash.slice(2));
    });
}
