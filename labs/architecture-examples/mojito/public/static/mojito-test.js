/*
 * Copyright (c) 2011-2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */


/*jslint anon:true, sloppy:true, nomen:true, node:true*/
/*global YUI,YUITest*/


/*
 * Utilities to help with creating Mocks for user mojit testing.
 */
YUI.add('mojito-test', function(Y, NAME) {

    function EasyMock() {
        var mock = YUITest.Mock();

        mock.expect = function() {
            Y.Array.each(arguments, function(expectation) {
                YUITest.Mock.expect(mock, expectation);
            });
            return mock;
        };
        mock.verify = function() {
            YUITest.Mock.verify(mock);
        };
        return mock;
    }


    function createMockAddon(source, name) {
        source._addons.push(name);
        source[name] = new EasyMock();
    }


    function createMockModel(source, name) {
        source.models[name] = new EasyMock();
    }


    function createMockExtra(source, ns, name) {
        var mock = new EasyMock();

        if (!source[ns]) {
            source[ns] = {};
        }
        if (!source._extras[ns]) {
            source._extras[ns] = {};
        }
        source._extras[ns][name] = mock;
        source[ns][name] = mock;
    }


    function MockActionContext(opts) {
        var mock = YUITest.Mock();

        opts = opts || {};
        mock._addons = [];
        mock.models = {};
        mock._extras = {};

        if (opts.addons) {
            Y.Array.each(opts.addons, function(addon) {
                createMockAddon(mock, addon);
            });
        }
        if (opts.models) {
            Y.Array.each(opts.models, function(model) {
                createMockModel(mock, model);
            });
        }
        if (opts.extras) {
            Y.Object.each(opts.extras, function(extras, namespace) {
                if (Y.Lang.isArray(extras)) {
                    Y.Array.each(extras, function(extra) {
                        createMockExtra(mock, namespace, extra);
                    });
                } else {
                    createMockExtra(mock, namespace, extras);
                }
            });
        }

        mock.expect = function() {
            Y.Array.each(arguments, function(expectation) {
                YUITest.Mock.expect(mock, expectation);
            });
            return mock;
        };
        mock.verify = function() {
            var i,
                j,
                mockAddon;

            YUITest.Mock.verify(mock);
            for (i = 0; i < mock._addons.length; i += 1) {
                mockAddon = mock[mock._addons[i]];
                mockAddon.verify();
            }
            for (i in mock.models) {
                if (mock.models.hasOwnProperty(i)) {
                    mock.models[i].verify();
                }
            }
            for (i in mock._extras) {
                if (mock._extras.hasOwnProperty(i)) {
                    for (j in mock._extras[i]) {
                        if (mock._extras[i].hasOwnProperty(j)) {
                            mock._extras[i][j].verify();
                        }
                    }
                }
            }
        };
        return mock;
    }

    Y.namespace('mojito').MockActionContext = MockActionContext;
    Y.namespace('mojito').EasyMock = EasyMock;

}, '0.1.0', {requires: [
    'mojito'
]});
