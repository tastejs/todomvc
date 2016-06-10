/**
 * Adapted from the official plugin text.js
 *
 * Uses UnderscoreJS micro-templates : http://documentcloud.github.com/underscore/#template
 * @author Julien Cabanès <julien@zeeagency.com>
 * @version 0.2
 * 
 * @license RequireJS text 0.24.0 Copyright (c) 2010-2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */
/*jslint regexp: false, nomen: false, plusplus: false, strict: false */
/*global require: false, XMLHttpRequest: false, ActiveXObject: false,
  define: false, window: false, process: false, Packages: false,
  java: false */

(function () {
//>>excludeStart('excludeTpl', pragmas.excludeTpl)
	var progIds = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'],
	
		xmlRegExp = /^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im,
		
		bodyRegExp = /<body[^>]*>\s*([\s\S]+)\s*<\/body>/im,
		
		buildMap = [],
		
		templateSettings = {
			evaluate	: /<%([\s\S]+?)%>/g,
			interpolate : /<%=([\s\S]+?)%>/g
		},

		/**
		 * JavaScript micro-templating, similar to John Resig's implementation.
		 * Underscore templating handles arbitrary delimiters, preserves whitespace,
		 * and correctly escapes quotes within interpolated code.
		 */
		template = function(str, data) {
			var c  = templateSettings;
			var tmpl = 'var __p=[],print=function(){__p.push.apply(__p,arguments);};' +
				'with(obj||{}){__p.push(\'' +
				str.replace(/\\/g, '\\\\')
					.replace(/'/g, "\\'")
					.replace(c.interpolate, function(match, code) {
					return "'," + code.replace(/\\'/g, "'") + ",'";
					})
					.replace(c.evaluate || null, function(match, code) {
					return "');" + code.replace(/\\'/g, "'")
										.replace(/[\r\n\t]/g, ' ') + "; __p.push('";
					})
					.replace(/\r/g, '')
					.replace(/\n/g, '')
					.replace(/\t/g, '')
					+ "');}return __p.join('');";
			return tmpl;
			
			/** /
			var func = new Function('obj', tmpl);
			return data ? func(data) : func;
			/**/
		};
//>>excludeEnd('excludeTpl')

	define(function () {
//>>excludeStart('excludeTpl', pragmas.excludeTpl)
		var tpl;

		var get, fs;
		if (typeof window !== "undefined" && window.navigator && window.document) {
			get = function (url, callback) {
				
				var xhr = tpl.createXhr();
				xhr.open('GET', url, true);
				xhr.onreadystatechange = function (evt) {
					//Do not explicitly handle errors, those should be
					//visible via console output in the browser.
					if (xhr.readyState === 4) {
						callback(xhr.responseText);
					}
				};
				xhr.send(null);
			};
		} else if (typeof process !== "undefined" &&
 				process.versions &&
 				!!process.versions.node) {
			//Using special require.nodeRequire, something added by r.js.
			fs = require.nodeRequire('fs');

			get = function (url, callback) {
				
				callback(fs.readFileSync(url, 'utf8'));
			};
		}
		return tpl = {
			version: '0.24.0',
			strip: function (content) {
				//Strips <?xml ...?> declarations so that external SVG and XML
				//documents can be added to a document without worry. Also, if the string
				//is an HTML document, only the part inside the body tag is returned.
				if (content) {
					content = content.replace(xmlRegExp, "");
					var matches = content.match(bodyRegExp);
					if (matches) {
						content = matches[1];
					}
				} else {
					content = "";
				}
				
				return content;
			},

			jsEscape: function (content) {
				return content.replace(/(['\\])/g, '\\$1')
					.replace(/[\f]/g, "\\f")
					.replace(/[\b]/g, "\\b")
					.replace(/[\n]/g, "")
					.replace(/[\t]/g, "")
					.replace(/[\r]/g, "");
			},

			createXhr: function () {
				//Would love to dump the ActiveX crap in here. Need IE 6 to die first.
				var xhr, i, progId;
				if (typeof XMLHttpRequest !== "undefined") {
					return new XMLHttpRequest();
				} else {
					for (i = 0; i < 3; i++) {
						progId = progIds[i];
						try {
							xhr = new ActiveXObject(progId);
						} catch (e) {}

						if (xhr) {
							progIds = [progId];  // so faster next time
							break;
						}
					}
				}

				if (!xhr) {
					throw new Error("require.getXhr(): XMLHttpRequest not available");
				}

				return xhr;
			},

			get: get,

			load: function (name, req, onLoad, config) {
				
				//Name has format: some.module.filext!strip
				//The strip part is optional.
				//if strip is present, then that means only get the string contents
				//inside a body tag in an HTML string. For XML/SVG content it means
				//removing the <?xml ...?> declarations so the content can be inserted
				//into the current doc without problems.

				var strip = false, url, index = name.indexOf("."),
					modName = name.substring(0, index),
					ext = name.substring(index + 1, name.length);

				index = ext.indexOf("!");
				
				if (index !== -1) {
					//Pull off the strip arg.
					strip = ext.substring(index + 1, ext.length);
					strip = strip === "strip";
					ext = ext.substring(0, index);
				}

				//Load the tpl.
				url = 'nameToUrl' in req ? req.nameToUrl(modName, "." + ext) : req.toUrl(modName + "." + ext);
				
				tpl.get(url, function (content) {
					content = template(content);
					
					if(!config.isBuild) {
					//if(typeof window !== "undefined" && window.navigator && window.document) {
						content = new Function('obj', content);
					}
					content = strip ? tpl.strip(content) : content;
					
					if (config.isBuild && config.inlineText) {
						buildMap[name] = content;
					}
					onLoad(content);
				});

			},

			write: function (pluginName, moduleName, write) {
				if (moduleName in buildMap) {
					var content = tpl.jsEscape(buildMap[moduleName]);
					write("define('" + pluginName + "!" + moduleName  +
  						"', function() {return function(obj) { " +
  							content.replace(/(\\')/g, "'").replace(/(\\\\)/g, "\\")+
  						"}});\n");
				}
			}
		};
//>>excludeEnd('excludeTpl')
		return function() {};	
	});
//>>excludeEnd('excludeTpl')
}());
