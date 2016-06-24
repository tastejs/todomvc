/* global _ */
(function () {
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
		}

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

	if (location.hostname === 'todomvc.com') {
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
		ga('create', 'UA-31081062-1', 'auto');
		ga('send', 'pageview');
	}
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

		var template, framework;

		if (typeof learnJSON !== 'object') {
			try {
				learnJSON = JSON.parse(learnJSON);
			} catch (e) {
				return;
			}
		}

		if (config) {
			template = config.template;
			framework = config.framework;
		}

		if (!template && learnJSON.templates) {
			template = learnJSON.templates.todomvc;
		}

		if (!framework && document.querySelector('[data-framework]')) {
			framework = document.querySelector('[data-framework]').dataset.framework;
		}

		this.template = template;

		if (learnJSON.backend) {
			this.frameworkJSON = learnJSON.backend;
			this.frameworkJSON.issueLabel = framework;
			this.append({
				backend: true
			});
		} else if (learnJSON[framework]) {
			this.frameworkJSON = learnJSON[framework];
			this.frameworkJSON.issueLabel = framework;
			this.append();
		}

		this.fetchIssueCount();
	}

	Learn.prototype.append = function (opts) {
		var aside = document.createElement('aside');
		aside.innerHTML = _.template(this.template, this.frameworkJSON);
		aside.className = 'learn';

		if (opts && opts.backend) {
			// Remove demo link
			var sourceLinks = aside.querySelector('.source-links');
			var heading = sourceLinks.firstElementChild;
			var sourceLink = sourceLinks.lastElementChild;
			// Correct link path
			var href = sourceLink.getAttribute('href');
			sourceLink.setAttribute('href', href.substr(href.lastIndexOf('http')));
			sourceLinks.innerHTML = heading.outerHTML + sourceLink.outerHTML;
		} else {
			// Localize demo links
			var demoLinks = aside.querySelectorAll('.demo-link');
			Array.prototype.forEach.call(demoLinks, function (demoLink) {
				if (demoLink.getAttribute('href').substr(0, 4) !== 'http') {
					demoLink.setAttribute('href', findRoot() + demoLink.getAttribute('href'));
				}
			});
		}

		document.body.className = (document.body.className + ' learn-bar').trim();
		document.body.insertAdjacentHTML('afterBegin', aside.outerHTML);
	};

	Learn.prototype.fetchIssueCount = function () {
		var issueLink = document.getElementById('issue-count-link');
		if (issueLink) {
			var url = issueLink.href.replace('https://github.com', 'https://api.github.com/repos');
			var xhr = new XMLHttpRequest();
			xhr.open('GET', url, true);
			xhr.onload = function (e) {
				var parsedResponse = JSON.parse(e.target.responseText);
				if (parsedResponse instanceof Array) {
					var count = parsedResponse.length;
					if (count !== 0) {
						issueLink.innerHTML = 'This app has ' + count + ' open issues';
						document.getElementById('issue-count').style.display = 'inline';
					}
				}
			};
			xhr.send();
		}
	};

	redirect();
	getFile('learn.json', Learn);
})();
