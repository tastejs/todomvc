(function () {
    var progIds = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'];
    var importRegEx = /((?:xaml!)?[a-z]+(\.[a-z]+[a-z0-9]*)*)/mgi;

    define(function () {
        return {
            version: '0.1.0',

            createXhr: function () {
                var xhr, i, progId;
                if (typeof XMLHttpRequest !== "undefined") {
                    return new XMLHttpRequest();
                } else {
                    for (i = 0; i < 3; i++) {
                        progId = progIds[i];
                        try {
                            xhr = new ActiveXObject(progId);
                        } catch (e) {
                        }

                        if (xhr) {
                            progIds = [progId];  // so faster next time
                            break;
                        }
                    }
                }

                if (!xhr) {
                    throw new Error("createXhr(): XMLHttpRequest not available");
                }

                return xhr;
            },

            get: function (url, callback) {
                var xhr;
                try {
                    xhr = this.createXhr();
                    xhr.open('GET', url, true);

                    xhr.onreadystatechange = function (evt) {
                        //Do not explicitly handle errors, those should be
                        //visible via console output in the browser.
                        if (xhr.readyState === 4) {
                            callback(null, xhr);
                        }
                    };
                    xhr.send(null);

                } catch (e) {
                    callback(e);
                }

            },

            load: function (name, req, onLoad, config) {

                var jsonParse = (typeof JSON !== 'undefined' && typeof JSON.parse === 'function') ? JSON.parse : function (val) {
                    return eval('(' + val + ')');
                };

                this.get(name, function (err, xhr) {
                    if (!err) {
                        onLoad(jsonParse(xhr.responseText));
                    } else {
                        throw err;
                    }
                });
            }
        };

    });
}());