define(['../lang/toString'], function(toString) {

    var ESCAPE_CHARS = /[\\.+*?\^$\[\](){}\/'#]/g;

    /**
     * Escape RegExp string chars.
     */
    function escapeRegExp(str) {
        str = toString(str);
        return str.replace(ESCAPE_CHARS,'\\$&');
    }

    return escapeRegExp;

});
