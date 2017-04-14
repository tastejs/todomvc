'use strict';

function routes(models) {
    $.route(function(hash) {
        models.todo.trigger('load', hash.slice(2));
    });
}
