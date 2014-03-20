'use strict';

var scope, pages = {};

function route() {
    var addr = location.hash;
    if (pages[addr] && typeof pages[addr] === 'function') {
        pages[addr]();
    } else if (pages.__defaults && typeof pages.__defaults === 'function') {
        pages.__defaults();
    }
}

window.addEventListener('hashchange', function () {
    route();
    if (scope) {
        scope.apply();
    }
});

exports.nav = function () {
    route();
};

exports.when = function (id, fn) {
    pages[id] = fn;
    return this;
};

exports.others = function (fn) {
    pages.__defaults = fn;
    return this;
};

exports.look = function (s) {
    scope = s;
    return this;
};
