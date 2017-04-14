'use strict';

function assertMatch(text, expression) {
    var msg = '"' + text + '" do not contain "' + expression + '"';
    assert(new RegExp(expression).test(text), msg);
}
