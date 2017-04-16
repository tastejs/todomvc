/*global define */
/*jshint unused:false */
define(['lazoApp'], function (LazoApp) {

    'use strict';

    return LazoApp.extend({

        initialize: function (callback) {
            // set the html tag for initial page load
            // alternatively use https://github.com/walmartlabs/lazojs/wiki/Page-Template
            this.setHtmlTag('<html lang="en" data-framework="lazojs">');
            // set the default page title
            this.setDefaultTitle('LazoJS • TodoMVC');
            // constants used across component views
            this.ENTER_KEY = 13;
            this.ESC_KEY = 27;

            return callback();
        }

    });

});