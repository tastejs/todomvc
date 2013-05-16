/*!
* CanJS - 1.1.5 (2013-03-27)
* http://canjs.us/
* Copyright (c) 2013 Bitovi
* Licensed MIT
*/
define(['can/util/library', 'can/util/string'], function (can) {

    // ## deparam.js  
    // `can.deparam`  
    // _Takes a string of name value pairs and returns a Object literal that represents those params._
    var digitTest = /^\d+$/,
        keyBreaker = /([^\[\]]+)|(\[\])/g,
        paramTest = /([^?#]*)(#.*)?$/,
        prep = function (str) {
            return decodeURIComponent(str.replace(/\+/g, " "));
        };


    can.extend(can, {

        deparam: function (params) {

            var data = {},
                pairs, lastPart;

            if (params && paramTest.test(params)) {

                pairs = params.split('&'),

                can.each(pairs, function (pair) {

                    var parts = pair.split('='),
                        key = prep(parts.shift()),
                        value = prep(parts.join("=")),
                        current = data;

                    if (key) {
                        parts = key.match(keyBreaker);

                        for (var j = 0, l = parts.length - 1; j < l; j++) {
                            if (!current[parts[j]]) {
                                // If what we are pointing to looks like an `array`
                                current[parts[j]] = digitTest.test(parts[j + 1]) || parts[j + 1] == "[]" ? [] : {};
                            }
                            current = current[parts[j]];
                        }
                        lastPart = parts.pop();
                        if (lastPart == "[]") {
                            current.push(value);
                        } else {
                            current[lastPart] = value;
                        }
                    }
                });
            }
            return data;
        }
    });
    return can;
});