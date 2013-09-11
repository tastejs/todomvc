/*!
* CanJS - 1.1.5 (2013-03-27)
* http://canjs.us/
* Copyright (c) 2013 Bitovi
* Licensed MIT
*/
define(['can/util/library', 'can/view', 'can/util/string', 'can/observe/compute', 'can/view/scanner', 'can/view/render'], function (can) {
    // ## ejs.js
    // `can.EJS`  
    // _Embedded JavaScript Templates._
    // Helper methods.
    var extend = can.extend,
        EJS = function (options) {
            // Supports calling EJS without the constructor
            // This returns a function that renders the template.
            if (this.constructor != EJS) {
                var ejs = new EJS(options);
                return function (data, helpers) {
                    return ejs.render(data, helpers);
                };
            }
            // If we get a `function` directly, it probably is coming from
            // a `steal`-packaged view.
            if (typeof options == "function") {
                this.template = {
                    fn: options
                };
                return;
            }
            // Set options on self.
            extend(this, options);
            this.template = this.scanner.scan(this.text, this.name);
        };


    can.EJS = EJS;


    EJS.prototype.

    render = function (object, extraHelpers) {
        object = object || {};
        return this.template.fn.call(object, object, new EJS.Helpers(object, extraHelpers || {}));
    };

    extend(EJS.prototype, {

        scanner: new can.view.Scanner({

            tokens: [
                ["templateLeft", "<%%"], // Template
                ["templateRight", "%>"], // Right Template
                ["returnLeft", "<%=="], // Return Unescaped
                ["escapeLeft", "<%="], // Return Escaped
                ["commentLeft", "<%#"], // Comment
                ["left", "<%"], // Run --- this is hack for now
                ["right", "%>"], // Right -> All have same FOR Mustache ...
                ["returnRight", "%>"]
            ]
        })
    });


    EJS.Helpers = function (data, extras) {
        this._data = data;
        this._extras = extras;
        extend(this, extras);
    };

    EJS.Helpers.prototype = {

        // TODO Deprecated!!
        list: function (list, cb) {
            can.each(list, function (item, i) {
                cb(item, i, list)
            })
        }
    };

    // Options for `steal`'s build.
    can.view.register({
        suffix: "ejs",
        // returns a `function` that renders the view.
        script: function (id, src) {
            return "can.EJS(function(_CONTEXT,_VIEW) { " + new EJS({
                text: src,
                name: id
            }).template.out + " })";
        },
        renderer: function (id, text) {
            return EJS({
                text: text,
                name: id
            });
        }
    });

    return can;
});