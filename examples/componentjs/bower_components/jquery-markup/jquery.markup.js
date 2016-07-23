/*!
**  jQuery Markup -- jQuery Template Based Markup Generation
**  Copyright (c) 2013 Ralf S. Engelschall <rse@engelschall.com>
**
**  Permission is hereby granted, free of charge, to any person obtaining
**  a copy of this software and associated documentation files (the
**  "Software"), to deal in the Software without restriction, including
**  without limitation the rights to use, copy, modify, merge, publish,
**  distribute, sublicense, and/or sell copies of the Software, and to
**  permit persons to whom the Software is furnished to do so, subject to
**  the following conditions:
**
**  The above copyright notice and this permission notice shall be included
**  in all copies or substantial portions of the Software.
**
**  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
**  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
**  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
**  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
**  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
**  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
**  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/* global jQuery: true */
(function ($) {
    /* jshint -W014 */

    /*  the storage of all markup expansion functions  */
    var markup = {};

    /*  local context-sensitive markup-expansion API function  */
    $.fn.extend({
        markup: function (id, data) {
            var result = this;
            this.each(function () {
                var el = $.markup(id, data);
                $(this).append(el);
                result = el;
            });
            return result;
        }
    });

    /*  global context-free markup-expansion API function  */
    $.markup = function (id, data) {
        if (typeof markup[id] === "undefined")
            throw new Error("jquery: markup: ERROR: no such markup with id '" + id + "' found");
        return $($.parseHTML($.markup.render(id, data)));
    };

    /*  plugin version number  */
    $.markup.version = "1.0.26";

    /*  debug level  */
    $.markup.debug = 0;
    var debug = function (level, msg) {
        /* global console: true */
        if (   $.markup.debug >= level
            && typeof console !== "undefined"
            && typeof console.log === "function")
            console.log("jquery: markup: DEBUG[" + level + "]: " + msg);
    };
    var esctxt = function (txt) {
        return "\"" +
            txt.replace(/\r/g, "\\r")
            .replace(/\n/g, "\\n")
            .replace(/"/g, "\\\"") +
        "\"";
    };

    /*  template language registry  */
    var registry = {};
    $.markup.register = function (lang) {
        registry[lang.id] = lang;
    };

    /*  compile a markup into an expansion function  */
    $.markup.compile = function (type, id, txt) {
        debug(1, "compile: type=" + type + " id=" + id);
        debug(4, "compile: txt=" + esctxt(txt));

        /*  sanity check usage  */
        if (typeof registry[type] === "undefined")
            throw new Error("jquery: markup: ERROR: no template language registered under id '" + type + "'");
        if (!registry[type].available())
            throw new Error("jquery: markup: ERROR: template language '" +
                type + "' (" + registry[type].name + ", " + registry[type].url + ") " +
                "known but not found under run-time");

        /*  remove all leading and trailing whitespaces
            (as usually one wants a single DOM element back without any surrounding text elements!)  */
        txt = txt.replace(/^\s+/, "").replace(/\s+$/, "");

        /*  compile with registered template engine  */
        markup[id] = registry[type].compile(txt);
    };

    /*  parse a markup definition document  */
    $.markup.parse = function (txt, type) {
        if (typeof type === "undefined")
            type = "plain";
        debug(3, "parse: type=" + type + " txt=" + esctxt(txt));
        var section = [];
        section.push({ txt: "", attr: { id: "", type: type, include: "false" }});
        var m;
        while (txt !== "") {
            /*  section opening tag  */
            if ((m = txt.match(/^<markup((?:\s+(?:id|type|include|wrap|trim)="[^"]*")+)\s*>/)) !== null) {
                /*  parse key="value" attributes  */
                debug(4, "parse: section opening tag: " + esctxt(m[0]));
                var attr = {};
                var txt2 = m[1], m2;
                while ((m2 = txt2.match(/^\s+([a-z]+)="([^"]*)"/)) !== null) {
                    debug(4, "parse: section attribute: name=" + esctxt(m2[1]) + " value=" + esctxt(m2[2]));
                    attr[m2[1]] = m2[2].match(/^true|false$/) ? (m2[2] === "true") : m2[2];
                    txt2 = txt2.substr(m2[0].length);
                }
                if (typeof attr.id === "undefined")
                    throw new Error("jquery: markup: ERROR: missing required 'id' attribute");
                if (attr.id.match(/^[^\/]+$/) === null)
                    throw new Error("jquery: markup: ERROR: invalid 'id' attribute");
                if (section[section.length - 1].attr.id !== "")
                    attr.id = section[section.length - 1].attr.id + "/" + attr.id;
                if (typeof attr.type === "undefined")
                    attr.type = section[section.length - 1].attr.type;
                if (typeof attr.include === "undefined")
                    attr.include = false;
                if (typeof attr.wrap === "undefined")
                    attr.wrap = false;
                if (typeof attr.trim === "undefined")
                    attr.trim = false;

                /*  open new section  */
                section.push({ txt: "", attr: attr });
                txt = txt.substr(m[0].length);
            }

            /*  section closing tag  */
            else if ((m = txt.match(/^<\/markup\s*>/)) !== null) {
                /*  close current section  */
                debug(4, "parse: section closing tag: " + esctxt(m[0]));
                var s = section.pop();
                if (s.attr.wrap) {
                    /*  optionally wrap markup with a root element and
                        a CSS class which is derived from the section id  */
                    var clazz = s.attr.id.replace(/\//g, "-").replace(/[^a-zA-Z0-9_-]/g, "_");
                    s.txt = "<div class=\"" + clazz + "\">" + s.txt + "</div>";
                    debug(4, "post-process: wrapped markup: " + esctxt(s.txt));
                }
                if (s.attr.trim) {
                    /*  optionally trim all whitespaces around tags  */
                    var src = s.txt, dst = "", m3, i, matched;
                    var spec = [
                        /^\s*(<!--.+?-->)\s*/,
                        /^\s*(<[a-zA-Z_][a-zA-Z0-9_:-]*(?:\s+[a-z]+="[^"]*")*\s*\/?\s*>)\s*/,
                        /^\s*(<\/[a-zA-Z_][a-zA-Z0-9_:-]*\s*>)\s*/,
                        /^([^\s<]+)/,
                        /^(\s+)/
                    ];
                    while (src !== "") {
                        matched = false;
                        for (i = 0; i < spec.length; i++) {
                            if ((m3 = src.match(spec[i])) !== null) {
                                dst += m3[1];
                                src = src.substr(m3[0].length);
                                matched = true;
                                break;
                            }
                        }
                        if (!matched)
                            throw new Error("jquery: markup: ERROR: during markup trimming: " +
                                "unrecognized next token at " + esctxt(src));
                    }
                    s.txt = dst;
                    debug(4, "post-process: trimmed markup: " + esctxt(s.txt));
                }
                $.markup.compile(s.attr.type, s.attr.id, s.txt);
                if (s.attr.include)
                    section[section.length - 1].txt += s.txt;
                txt = txt.substr(m[0].length);
            }

            /*  plain-text between tags (arbitray long)  */
            else if ((m = txt.match(/^((?:.|\r?\n)+?)(?=<\/?markup|$)/)) !== null) {
                /*  append plain-text to current section  */
                debug(4, "parse: plain-text (arbitrary long): " + esctxt(m[0]));
                section[section.length - 1].txt += m[1];
                txt = txt.substr(m[0].length);
            }

            /*  plain-text between tags (single character fallback)  */
            else {
                /*  append plain-text to current section  */
                debug(4, "parse: plain-text (single character fallback): " + esctxt(txt.substr(0, 1)));
                section[section.length - 1].txt += txt.substr(0, 1);
                txt = txt.substr(1);
            }
        }
    };

    /*  queue markup loading requests  */
    var queue = [];
    $.markup.queue = function (url, type) {
        debug(2, "queue: url=" + url + " type=" + type);
        queue.push({ url: url, type: type });
    };

    /*  asynchronously load all queued markup  */
    $.markup.load = function (onDone) {
        debug(1, "load: loading all queued markup requests");
        var todo = queue; queue = [];
        var done = 0;
        for (var i = 0; i < todo.length; i++) {
            var type = todo[i].type;
            debug(2, "load: url=" + todo[i].url + " type=" + type);
            $.get(todo[i].url, function (txt) {
                $.markup.parse(txt, type);
                done += 1;
                if (done >= todo.length)
                    onDone();
            });
        }
    };

    /*  render a compiled markup and return the textual result  */
    $.markup.render = function (id, data) {
        if (typeof markup[id] === "undefined")
            throw new Error("jquery: markup: ERROR: no such markup with id '" + id + "' found");
        return markup[id](data);
    };

    /*  automatically process all <link> tags  */
    /* global document: true */
    $(document).ready(function () {
        debug(1, "ready: processing all <link> tags");
        $("head > link").each(function () {
            var h = $(this).attr("href");
            var r = $(this).attr("rel");
            var t = $(this).attr("type");
            if (typeof h !== "undefined" && h !== "" &&
                typeof r !== "undefined" && r !== "" &&
                typeof t !== "undefined" && t !== ""   ) {
                var mr = r.match(/^markup(?:\/([a-z]+))?$/);
                var mt = t.match(/^text\/(?:html|x-markup-([a-z]+))$/);
                if (mr !== null && mt !== null) {
                    var type = (typeof mr[1] === "string" && mr[1] !== "") ? mr[1] :
                               (typeof mt[1] === "string" && mt[1] !== "") ? mt[1] : "plain";
                    $.markup.queue(h, type);
                }
            }
        });
    });

    /*  helper function for checking that a function is available  */
    var isfn = function (path) {
        /* global window: true */
        var p = path.split(/\./);
        var o = window;
        for (var i = 0; i < p.length; i++) {
            o = o[p[i]];
            if (   (i <   p.length - 1 && typeof o === "undefined")
                || (i === p.length - 1 && typeof o !== "function" ))
                return false;
        }
        return true;
    };

    /*  helper function for simple templating (structured value derefering only)  */
    var simple = function (txt) {
        var func = "";
        var outside = true;
        var expr, m;
        while (txt !== "") {
            if (outside && txt.substr(0, 1) === "\"") {
                func += "\\\"";
                txt = txt.substr(1);
            }
            else if (outside && (m = txt.match(/^[\r\n]/)) !== null) {
                func += "\\" + (m[0] === "\r" ? "r" : "n");
                txt = txt.substr(m[0].length);
            }
            else if (outside && txt.substr(0, 2) === "{{") {
                outside = false;
                expr = "data";
                txt = txt.substr(2);
            }
            else if (!outside && (m = txt.match(/^\s+/)) !== null) {
                txt = txt.substr(m[0].length);
            }
            else if (!outside && (m = txt.match(/^(?:\.)?([a-zA-Z_][a-zA-Z0-9_]*)/)) !== null) {
                expr = "deref(" + expr + ", \"" + m[1] + "\")";
                txt = txt.substr(m[0].length);
            }
            else if (!outside && (m = txt.match(/^\[(\d+)\]/)) !== null) {
                expr = "deref(" + expr + ", " + m[1] + ")";
                txt = txt.substr(m[0].length);
            }
            else if (!outside && (m = txt.match(/^\["((?:\\"|.)*)"\]/)) !== null) {
                expr = "deref(" + expr + ", \"" + m[1] + "\")";
                txt = txt.substr(m[0].length);
            }
            else if (!outside && (m = txt.match(/^\['((?:\\'|.)*)'\]/)) !== null) {
                expr = "deref(" + expr + ", '" + m[1] + "')";
                txt = txt.substr(m[0].length);
            }
            else if (!outside && txt.substr(0, 2) === "}}") {
                func += "\" + " + expr + " + \"";
                outside = true;
                txt = txt.substr(2);
            }
            else if (outside && (m = txt.match(/^(.+?)(?=\r|\n|"|\{\{|$)/)) !== null) {
                func += m[1];
                txt = txt.substr(m[0].length);
            }
            else {
                func += txt.substr(0, 1);
                txt = txt.substr(1);
            }
        }
        /* jshint -W054 */
        return new Function("data",
            "var deref = function (obj, sel) {" +
                "return (typeof obj === \"object\" ? obj[sel] : undefined);" +
            "};" +
            "return \"" + func + "\";"
        );
    };

    /*  helper function for registering a template engine  */
    var reg = function (id, name, url, func, comp) {
        $.markup.register({
            id: id,
            name: name,
            url: url,
            available: (typeof func === "function" ? func : function () { return isfn(func); }),
            compile: comp
        });
    };

    /*  Plain HTML (efficient: pass-through only, incomplete: no data)  */
    reg("plain", "Plain HTML", "-", function () { return true; },
        function (txt) { return function (/* data */) { return txt; }; });

    /*  Simple HTML (efficient: pre-compilation, complete: data support)  */
    reg("simple", "Simple HTML", "-", function () { return true; },
        function (txt) { return simple(txt); });

    /*  Handlebars (efficient: pre-compilation, complete: data support)  */
    reg("handlebars", "Handlebars", "http://handlebarsjs.com/", "Handlebars.compile",
        function (txt) { /* global Handlebars: true */ return Handlebars.compile(txt); });

    /*  Emblem (indented Handlebars) (efficient: pre-compilation, complete: data support)  */
    reg("emblem", "Emblem", "http://emblemjs.com/", function () { return isfn("Handlebars") && isfn("Emblem.compile"); },
        function (txt) { /* global Emblem: true */ return Emblem.compile(Handlebars, txt); });

    /*  DUST (efficient: pre-compilation, complete: data support)  */
    reg("dust", "DUST", "http://linkedin.github.io/dustjs/", "dust.compile",
        function (txt) { /* global dust: true */ return dust.compile(txt); });

    /*  Jade (efficient: pre-compilation, complete: data support)  */
    reg("jade", "Jade", "http://jade-lang.com/", "jade.compile",
        function (txt) { /* global jade: true */ return jade.compile(txt); });

    /*  Mustache (efficient: pre-compilation, complete: data support)  */
    reg("mustache", "Mustache", "http://mustache.github.io/", "Mustache.compile",
        function (txt) { /* global Mustache: true */ return Mustache.compile(txt); });

    /*  Walrus (efficient: pre-compilation, complete: data support)  */
    reg("walrus", "Walrus", "http://documentup.com/jeremyruppel/walrus/", "Walrus.Parser.parse",
        function (txt) { /* global Walrus: true */ var tmpl = Walrus.Parser.parse(txt);
                         return function (data) { return tmpl.compile(data); }; });

    /*  HAML-JS (efficient: pre-compilation, complete: data support)  */
    reg("haml", "HAML-JS", "https://github.com/creationix/haml-js", "Haml",
        function (txt) { /* global Haml: true */ return Haml(txt); });

    /*  doT (efficient: pre-compilation, complete: data support)  */
    reg("dot", "doT", "http://olado.github.io/doT/", "doT.template",
        function (txt) { /* global doT: true */ return doT.template(txt); });

    /*  rssi (efficient: pre-compilation, complete: data support)  */
    reg("rssi", "rssi", "https://github.com/mvasilkov/rssi", "fmt",
        function (txt) { /* global fmt: true */ return fmt(txt); });

    /*  Hogan (efficient: pre-compilation, complete: data support)  */
    reg("hogan", "Twitter Hogan", "http://twitter.github.io/hogan.js/", "hogan.compile",
        function (txt) { /* global hogan: true */ var tmpl = hogan.compile(txt);
                         return function (data) { return tmpl.render(data); }; });

    /*  Underscore Template (efficient: pre-compilation, complete: data support)  */
    reg("underscore", "Underscore Template", "http://underscorejs.org/", "_.template",
        function (txt) { /* global _: true */ return _.template(txt); });

    /*  Jiko (efficient: on-the-fly compilation, complete: data support)  */
    reg("jiko", "Jiko", "http://jiko.neoname.eu/", "jiko.loadTemplate",
        function (txt) { /* global jiko: true */ return jiko.loadTemplate(txt); });

    /*  Qatrix Template (efficient: cached on-the-fly compilation, complete: data support)  */
    reg("qatrix", "Qatrix Template", "http://qatrix.com/", "Qatrix.$template",
        function (txt) { return function (data) { /* global Qatrix: true */ return Qatrix.template(txt, data); }; });

    /*  Teddy (efficient: pre-compilation, complete: data support)  */
    reg("teddy", "Teddy", "https://github.com/kethinov/teddy", "teddy.compile",
        function (txt) { /* global teddy: true */ var name = txt /* hack */; teddy.compile(txt, name);
                         return function (data) { return teddy.render(teddy.compiledTemplates[name], data); }; });

    /*  EJS (efficient: pre-compilation, complete: data support)  */
    reg("ejs", "EJS", "http://embeddedjs.com/", "EJS",
        function (txt) { /* global EJS: true */ var tmpl = EJS({ text: txt });
                         return function (data) { return tmpl.render(data); }; });

    /*  JST (efficient: pre-compilation, complete: data support)  */
    reg("jst", "JST", "http://code.google.com/p/trimpath/wiki/JavaScriptTemplates", "TrimPath.parseTemplate",
        function (txt) { /* global TrimPath: true */ var tmpl = TrimPath.parseTemplate(txt);
                         return function (data) { return tmpl.process(data); }; });

    /*  Nunjucks (efficient: on-the-fly compilation, complete: data support)  */
    reg("nunjucks", "Nunjucks", "http://nunjucks.jlongster.com/", "nunjucks.Template",
        function (txt) { /* global nunjucks: true */ var tmpl = new nunjucks.Template(txt);
                         return function (data) { return tmpl.render(data); }; });

    /*  Markup.js (inefficient: on-the-fly compilation, complete: data support)  */
    reg("markup", "Markup.js", "https://github.com/adammark/Markup.js/", "Mark.up",
        function (txt) { return function (data) { /* global Mark: true */ return Mark.up(txt, data); }; });

    /*  Plates (inefficient: on-the-fly compilation, complete: data support)  */
    reg("plates", "Plates", "https://github.com/flatiron/plates", "Plates.bind",
        function (txt) { return function (data) { /* global Plates: true */ return Plates.bind(txt, data); }; });

    /*  Emmet markup (inefficient: on-the-fly compilation, incomplete: no data support)  */
    reg("markup", "Markup.js", "http://emmet.io/", "emmet.expandAbbreviation",
        function (txt) { return function (/* data */) { /* global emmet: true */ return emmet.expandAbbreviation(txt); }; });

})(jQuery);
