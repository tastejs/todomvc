/** @license MIT License (c) copyright B Cavalier & J Hann */

/**
 * wire/cram/builder plugin
 * Builder plugin for cram
 * https://github.com/cujojs/cram
 *
 * wire is part of the cujo.js family of libraries (http://cujojs.com/)
 *
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */
(function(define) {
define(function(require) {

	var when, unfold, defaultModuleRegex, defaultSpecRegex, replaceIdsRegex,
		removeCommentsRx, splitSpecsRegex;

	when = require('when');
	unfold = require('when/unfold');

	// default dependency regex
	defaultModuleRegex = /\.(module|create)$/;
	defaultSpecRegex = /\.(wire\.spec|wire)$/;
	// adapted from cram's scan function:
	//replaceIdsRegex = /(define)\s*\(\s*(?:\s*["']([^"']*)["']\s*,)?(?:\s*\[([^\]]+)\]\s*,)?\s*(function)?\s*(?:\(([^)]*)\))?/g;
	replaceIdsRegex = /(define)\s*\(\s*(?:\s*["']([^"']*)["']\s*,)?(?:\s*\[([^\]]*)\]\s*,)?/;
	removeCommentsRx = /\/\*[\s\S]*?\*\/|\/\/.*?[\n\r]/g;
	splitSpecsRegex = /\s*,\s*/;

	return {
		normalize: normalize,
		compile: compile
	};

	function normalize(resourceId, toAbsId) {
		return resourceId ? toAbsId(resourceId.split("!")[0]) : resourceId;
	}

	function compile(wireId, resourceId, require, io, config) {
		// Track all modules seen in wire spec, so we only include them once
		var specIds, defines, seenModules, childSpecRegex,
			moduleRegex;

		defines = [];
		seenModules = {};
		moduleRegex = defaultModuleRegex;
		childSpecRegex = defaultSpecRegex;

		// Get config values
		if(config) {
			if(config.moduleRegex) moduleRegex = new RegExp(config.moduleRegex);
			if(config.childSpecRegex) childSpecRegex = new RegExp(config.childSpecRegex);
		}

		// Grab the spec module id, *or comma separated list of spec module ids*
		// Split in case it's a comma separated list of spec ids
		specIds = resourceId.split(splitSpecsRegex);

		return when.map(specIds, function(specId) {
			return processSpec(specId);
		}).then(write, io.error);

		// For each spec id, add the spec itself as a dependency, and then
		// scan the spec contents to find all modules that it needs (e.g.
		// "module" and "create")
		function processSpec(specId) {
			var dependencies, ids;

			dependencies = [];
			ids = [specId];

			addDep(wireId);

			return unfold(fetchNextSpec, endOfList, scanSpec, ids)
				.then(function() {
					return generateDefine(specId, dependencies);
				}
			);


			function fetchNextSpec() {
				var id, dfd;

				id = ids.shift();
				dfd = when.defer();

				require(
					[id],
					function(spec) { dfd.resolve([spec, ids]); },
					dfd.reject
				);

				return dfd.promise;
			}

			function scanSpec(spec) {
				scanPlugins(spec);
				scanObj(spec);
			}

			function scanObj(obj, path) {
				// Scan all keys.  This might be the spec itself, or any sub-object-literal
				// in the spec.
				for (var name in obj) {
					scanItem(obj[name], createPath(path, name));
				}
			}

			function scanItem(it, path) {
				// Determine the kind of thing we're looking at
				// 1. If it's a string, and the key is module or create, then assume it
				//    is a moduleId, and add it as a dependency.
				// 2. If it's an object or an array, scan it recursively
				// 3. If it's a wire spec, add it to the list of spec ids
				if (isSpec(path) && typeof it === 'string') {
					addSpec(it);

				} else if (isDep(path) && typeof it === 'string') {
					// Get module def
					addDep(it);

				} else if (isStrictlyObject(it)) {
					// Descend into subscope
					scanObj(it, path);

				} else if (Array.isArray(it)) {
					// Descend into array
					var arrayPath = path + '[]';
					it.forEach(function(arrayItem) {
						scanItem(arrayItem, arrayPath);
					});
				}
			}

			function scanPlugins(spec) {
				var plugins = spec.$plugins || spec.plugins;

				if(Array.isArray(plugins)) {
					plugins.forEach(addPlugin);
				} else if(typeof plugins === 'object') {
					Object.keys(plugins).forEach(function(key) {
						addPlugin(plugins[key]);
					});
				}
			}

			function addPlugin(plugin) {
				if(typeof plugin === 'string') {
					addDep(plugin);
				} else if(typeof plugin === 'object' && plugin.module) {
					addDep(plugin.module);
				}
			}

			function addDep(moduleId) {
				if(!(moduleId in seenModules)) {
					dependencies.push(moduleId);
					seenModules[moduleId] = moduleId;
				}
			}

			function addSpec(specId) {
				if(!(specId in seenModules)) {
					ids.push(specId);
				}
				addDep(specId);
			}
		}

		function generateDefine(specId, dependencies) {
			var dfd, buffer;

			dfd = when.defer();

			io.read(ensureExtension(specId, 'js'), function(specText) {
				buffer = injectIds(specText, specId, dependencies);

				defines.push(buffer);
				dfd.resolve();

			}, dfd.reject);

			return dfd.promise;
		}

		function write() {
			// protect against prior code that may have omitted a semi-colon
			io.write('\n;' + defines.join('\n'));
		}

		function isDep(path) {
			return moduleRegex.test(path);
		}

		function isSpec(path) {
			return childSpecRegex.test(path);
		}
	}

	function createPath(path, name) {
		return path ? (path + '.' + name) : name
	}

	function isStrictlyObject(it) {
		return (it && Object.prototype.toString.call(it) == '[object Object]');
	}

	function ensureExtension(id, ext) {
		return id.lastIndexOf('.') <= id.lastIndexOf('/')
			? id + '.' + ext
			: id;
	}

	function injectIds (moduleText, absId, moduleIds) {
		// note: replaceIdsRegex removes commas, parens, and brackets
		return moduleText.replace(removeCommentsRx, '').replace(replaceIdsRegex, function (m, def, mid, depIds) {

			// merge deps, but not args since they're not referenced in module
			if (depIds) moduleIds = moduleIds.concat(depIds);

			moduleIds = moduleIds.map(quoted).join(', ');
			if (moduleIds) moduleIds = '[' + moduleIds + '], ';

			return def + '(' + quoted(absId) + ', ' + moduleIds;
		});
	}

	function quoted (id) {
		return '"' + id + '"';
	}

	function endOfList(ids) {
		return !ids.length;
	}

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); }));
