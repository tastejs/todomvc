(function (rivets) {
    'use strict';

    rivets.formatters['length'] = function (value) {
        return value.length;
    };

    rivets.formatters['equals'] = function (value, arg) {
        return value == arg;
    };

    rivets.formatters['not'] = function (value) {
        return !value;
    };

    rivets.formatters['filterTodos'] = function (value, arg) {
        return $.grep(value, function (todo) {
            if (arg == 'active') {
                return !todo.completed;
            } else if (arg == 'completed') {
                return todo.completed;
            } else if (arg == '') {
                return true;
            }
            return false;
        });
    };
    
})(rivets);

