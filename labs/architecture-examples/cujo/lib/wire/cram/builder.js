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

define([], function() {

	var defaultModuleRegex;
	// default dependency regex
	defaultModuleRegex = /\.(module|create)$/;

	function cramAnalyze(myId, api, addDep, config) {
		// Track all modules seen in wire spec, so we only include them once
		var seenModules, specs, spec, i, childSpecRegex, moduleRegex;

		seenModules = {};
		moduleRegex = defaultModuleRegex;

		// Get config values
		if(config) {
			if(config.moduleRegex) moduleRegex = new RegExp(config.moduleRegex);
			if(config.childSpecRegex) childSpecRegex = new RegExp(config.childSpecRegex);
		}

		function addAbsoluteDep(absoluteId) {
			// Only add the moduleId if we haven't already
			if (absoluteId in seenModules) return;

			seenModules[absoluteId] = 1;
			addDep(absoluteId);
		}

		function addDependency(moduleId) {
			addAbsoluteDep(api.toAbsMid(moduleId));
		}

		function addChildSpec(specId) {
			addAbsoluteDep('wire' + '!' + api.toAbsMid(specId));
		}

		function scanObj(obj, path) {
			// Scan all keys.  This might be the spec itself, or any sub-object-literal
			// in the spec.
			for (var name in obj) {
				scanItem(obj[name], path ? ([path, name].join('.')) : name);
			}
		}

		function scanItem(it, path) {
			// Determine the kind of thing we're looking at
			// 1. If it's a string, and the key is module or create, then assume it
			//    is a moduleId, and add it as a dependency.
			// 2. If it's an object or an array, scan it recursively
			if (typeof it === 'string') {
				// If it's a regular module, add it as a dependency
				// If it's child spec, add it as a wire! dependency
				if (isDep(path)) {
					addDependency(it);
				} else if (isWireDep(path)) {
					addChildSpec(it);
				}
			}
			if (isDep(path) && typeof it === 'string') {
				// Get module def
				addDependency(it);

			} else if (isStrictlyObject(it)) {
				// Descend into subscope
				scanObj(it, path);

			} else if (isArray(it)) {
				// Descend into array
				var arrayPath = path + '[]';
				for (var i = 0, len = it.length; i < len; i++) {
					scanItem(it[i], arrayPath);
				}

			}
		}

		function isWireDep(path) {
			return childSpecRegex && childSpecRegex.test(path);
		}

		function isDep(path) {
			return moduleRegex.test(path);
		}

		// Grab the spec module id, *or comma separated list of spec module ids*
		// Split in case it's a comma separated list of spec ids
		specs = myId.split(',');

		// For each spec id, add the spec itself as a dependency, and then
		// scan the spec contents to find all modules that it needs (e.g.
		// "module" and "create")
		for (i = 0; (spec = specs[i++]);) {
			scanObj(api.load(spec));
			addDependency(spec);
		}

	}

	function isStrictlyObject(it) {
		return (it && Object.prototype.toString.call(it) == '[object Object]');
	}

	return {
		analyze: cramAnalyze
	};

});
