/* global _ */
(function ($) {
    'use strict';

    /* jshint ignore:start */
    // Underscore's Template Module
    // Courtesy of underscorejs.org
    var _ = (function (_) {
        _.defaults = function (object) {
            if (!object) {
                return object;
            }
            for (var argsIndex = 1, argsLength = arguments.length; argsIndex < argsLength; argsIndex++) {
                var iterable = arguments[argsIndex];
                if (iterable) {
                    for (var key in iterable) {
                        if (object[key] == null) {
                            object[key] = iterable[key];
                        }
                    }
                }
            }
            return object;
        };

        // By default, Underscore uses ERB-style template delimiters, change the
        // following template settings to use alternative delimiters.
        _.templateSettings = {
            evaluate    : /<%([\s\S]+?)%>/g,
            interpolate : /<%=([\s\S]+?)%>/g,
            escape      : /<%-([\s\S]+?)%>/g
        };

        // When customizing `templateSettings`, if you don't want to define an
        // interpolation, evaluation or escaping regex, we need one that is
        // guaranteed not to match.
        var noMatch = /(.)^/;

        // Certain characters need to be escaped so that they can be put into a
        // string literal.
        var escapes = {
            "'":      "'",
            '\\':     '\\',
            '\r':     'r',
            '\n':     'n',
            '\t':     't',
            '\u2028': 'u2028',
            '\u2029': 'u2029'
        };

        var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

        // JavaScript micro-templating, similar to John Resig's implementation.
        // Underscore templating handles arbitrary delimiters, preserves whitespace,
        // and correctly escapes quotes within interpolated code.
        _.template = function(text, data, settings) {
            var render;
            settings = _.defaults({}, settings, _.templateSettings);

            // Combine delimiters into one regular expression via alternation.
            var matcher = new RegExp([
                (settings.escape || noMatch).source,
                (settings.interpolate || noMatch).source,
                (settings.evaluate || noMatch).source
            ].join('|') + '|$', 'g');

            // Compile the template source, escaping string literals appropriately.
            var index = 0;
            var source = "__p+='";
            text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
                source += text.slice(index, offset)
                    .replace(escaper, function(match) { return '\\' + escapes[match]; });

                if (escape) {
                    source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
                }
                if (interpolate) {
                    source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
                }
                if (evaluate) {
                    source += "';\n" + evaluate + "\n__p+='";
                }
                index = offset + match.length;
                return match;
            });
            source += "';\n";

            // If a variable is not specified, place data values in local scope.
            if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

            source = "var __t,__p='',__j=Array.prototype.join," +
                "print=function(){__p+=__j.call(arguments,'');};\n" +
                source + "return __p;\n";

            try {
                render = new Function(settings.variable || 'obj', '_', source);
            } catch (e) {
                e.source = source;
                throw e;
            }

            if (data) return render(data, _);
            var template = function(data) {
                return render.call(this, data, _);
            };

            // Provide the compiled function source as a convenience for precompilation.
            template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

            return template;
        };

        return _;
    })({});
    /* jshint ignore:end */

    function redirect() {
        if (location.hostname === 'tastejs.github.io') {
            location.href = location.href.replace('tastejs.github.io/todomvc', 'todomvc.com');
        }
    }

    function findRoot() {
        var base = location.href.indexOf('examples/');
        return location.href.substr(0, base);
    }

    function getFile(file, callback) {
        if (!location.host) {
            return console.info('Miss the info bar? Run TodoMVC from a server to avoid a cross-origin error.');
        }

        var xhr = new XMLHttpRequest();

        xhr.open('GET', findRoot() + file, true);
        xhr.send();

        xhr.onload = function () {
            if (xhr.status === 200 && callback) {
                callback(xhr.responseText);
            }
        };
    }

    function Learn(learnJSON, config) {
        if (!(this instanceof Learn)) {
            return new Learn(learnJSON, config);
        }

        var template;

        if (typeof learnJSON !== 'object') {
            try {
                learnJSON = JSON.parse(learnJSON);
            } catch (e) {
                return;
            }
        }

        if (config) {
            template = config.template;
        }

        if (!template && learnJSON.templates) {
            template = learnJSON.templates['todomvc-home'];
            learnJSON.templates = undefined;
        }

        //transform to list of objects
        this.frameworksList = $.map(learnJSON, function(element, key) {
                var el = $.extend({}, element);
                el.issueLabel = key;
                return el;
            });

        this.contentContainer = document.getElementById('content');
        this.menuDrawer = document.getElementById('menu-drawer');
        this.template = template;
        this.processList();
    }
    Learn.prototype.processList = function(){
        this.frameworksList.forEach((function(el){
            this.append(el);
        }).bind(this));
    };
    Learn.prototype.append = function (el) {
        var contentSection = document.createElement('div');
        contentSection.id = el.issueLabel;
        contentSection.innerHTML = _.template(this.template, el);
        contentSection.className = 'learn';
        var linkToContent = document.createElement('a');
        linkToContent.href = '#' + el.issueLabel;
        linkToContent.innerHTML = el.name;
        // Localize demo links
        var demoLinks = contentSection.querySelectorAll('.demo-link');
        Array.prototype.forEach.call(demoLinks, function (demoLink) {
            if (demoLink.getAttribute('href').substr(0, 4) !== 'http') {
                demoLink.setAttribute('href', findRoot() + demoLink.getAttribute('href'));
            }
        });
        this.contentContainer.appendChild(contentSection);
        this.menuDrawer.appendChild(linkToContent);
    };

    redirect();
    getFile('learn.json', Learn);

    $( window ).on('hashchange', function() {
        var hash = location.hash;
        $( "nav a" ).each(function() {
            var element = $( this );
            element[ element.attr( "href" ) === hash ? "addClass" : "removeClass" ]( "selected" );
        });
    });
})($);
