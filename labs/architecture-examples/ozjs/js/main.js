/*global require, define*/
'use strict';

require.config({
    baseUrl: 'bower_components/',
    aliases: {
        'dollar': './dollar/dollar/',
        'mo': 'mo/',
        'moui': 'moui/',
        'todomvc': '../js/todomvc/'
    }
});

define('eventmaster', 'eventmaster/eventmaster.js');
define('nerv', 'nerv/nerv.js');
define('soviet', 'soviet/soviet.js');
define('urlkit', 'urlkit/urlkit.js');

define('dollar', ['dollar/origin'], function ($) {
    return $;
});

define('jquery', ['dollar'], function ($) {
    return $;
});

define('mo/lang/es5', [], function () {});

require([
    'todomvc/app'
], function (app) {

    app.init();

    app.load(); //view.confirm('Restore last data ?', app.load, { title: 'Prompt' });

});
