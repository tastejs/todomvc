/**
 * curl (cujo resource loader)
 *
 * (c) copyright 2011, unscriptable.com / John Hann
 * Licensed under the MIT License at:
 * 		http://www.opensource.org/licenses/mit-license.php
 *
 */

(function (global, doc, userCfg) {

	/*
	 * Overall operation:
	 * When a dependency is encountered and it already exists, it's returned.
	 * If it doesn't already exist, it is created and the dependency's script
	 * is loaded. If there is a define call in the loaded script with a name,
	 * it is resolved asap (i.e. as soon as the dependency's dependencies are
	 * resolved). If there is a (single) define call with no name (anonymous),
	 * the resource in the resNet is resolved after the script's onload fires.
	 * IE requires a slightly different tactic. IE marks the readyState of the
	 * currently executing script to 'interactive'. If we can find this script
	 * while a define() is being called, we can match the define() to its name.
	 * Opera marks scripts as 'interactive' but at inopportune times so we
	 * have to handle it specifically.
	 */

	/*
	 * Paths in 0.6:
	 * Use cases (most common first):
	 * -  "my package is located at this url" (url / location or package)
	 * -  "I want all text! plugins to use the module named x/text" (module id)
	 * -  "I want calls to 'x/a' from one package to reference 'x1.5/x/a' but
	 *    calls to 'x/a' from another package to reference 'x1.6/x/a'"
	 *    (url/location)
	 * -  "I want to alias calls to a generic 'array' module to the module
	 *     named 'y/array'" (module id) (or vice versa. see chat with JD Dalton)
	 * -  "I want to alias calls to 'my/array' to 'y/array'" (module id)
	 * -  "I want to use root paths like in node.js ("/x/b" should be the same
	 *    as "x/b" unless we implement a way to have each package specify its
	 *    relative dependency paths)
	 */

	var
		version = '0.5.4',
		head = doc['head'] || doc.getElementsByTagName('head')[0],
		// configuration information
		baseUrl,
		pluginPath = 'curl/plugin',
		paths = {},
		// local cache of resource definitions (lightweight promises)
		cache = {},
		// net to catch anonymous define calls' arguments (non-IE browsers)
		argsNet,
		// this is the list of scripts that IE is loading. one of these will
		// be the "interactive" script. too bad IE doesn't send a readystatechange
		// event to tell us exactly which one.
		activeScripts = {},
		// these are always handy :)
		toString = ({}).toString,
		undef,
		aslice = [].slice,
		// RegExp's used later, "cached" here
		absUrlRx = /^\/|^[^:]+:\/\//,
		normalizeRx = /^(\.)(\.)?(\/|$)/,
		findSlashRx = /\//,
		dontAddExtRx = /\?/,
		pathSearchRx,
		// script ready states that signify it's loaded
		readyStates = { 'loaded': 1, 'interactive': 1, 'complete': 1 },
		orsc = 'onreadystatechange',
		// the defaults for a typical package descriptor
		defaultDescriptor = {
			main: './lib/main',
			lib: './lib'
		},
		debug;

	function isType (obj, type) {
		return toString.call(obj).indexOf('[object ' + type) == 0;
	}

	function normalizePkgDescriptor (descriptor, nameOrIndex) {
		// TODO: remove nameOrIndex param
		// we need to use strings for prop names to account for google closure

		// check for string shortcuts
		if (isType(descriptor, 'String')) {
			descriptor = removeEndSlash(descriptor);
			// fill in defaults
			descriptor = {
				name: descriptor,
				'path': descriptor,
				'main': defaultDescriptor.main,
				'lib': defaultDescriptor.lib
			};
		}

		descriptor.path = descriptor['path'] || ''; // (isNaN(nameOrIndex) ? nameOrIndex : descriptor.name);

		function normalizePkgPart (partName) {
			var path;
			if (partName in descriptor) {
				if (descriptor[partName].charAt(0) != '.') {
					// prefix with path
					path = joinPath(descriptor.path, descriptor[partName]);
				}
				else {
					// use normal . and .. path processing
					path = normalizeName(descriptor[partName], descriptor.path);
				}
				return removeEndSlash(path);
			}
		}
		descriptor.lib = normalizePkgPart('lib');
		descriptor.main = normalizePkgPart('main');

		return descriptor;
	}

	function extractCfg (cfg) {
		var p, pStrip, path, pathList = [];

		baseUrl = cfg['baseUrl'] || '';

		if (cfg['debug']) {
			debug = true;
			// add debugging aides
			_curl['cache'] = cache;
			_curl['cfg'] = cfg;
			_curl['undefine'] = function (moduleId) { delete cache[moduleId]; };
		}

		// fix all paths
		var cfgPaths = cfg['paths'];
		for (p in cfgPaths) {
			pStrip = removeEndSlash(p.replace('!', '!/'));
			path = paths[pStrip] = { path: removeEndSlash(cfgPaths[p]) };
			path.specificity = (path.path.match(findSlashRx) || []).length;
			pathList.push(pStrip);
		}

		var cfgPackages = cfg['packages'];
		for (p in cfgPackages) {
			pStrip = removeEndSlash(cfgPackages[p]['name'] || p);
			path = paths[pStrip] = normalizePkgDescriptor(cfgPackages[p], pStrip);
			path.specificity = (path.path.match(findSlashRx) || []).length;
			pathList.push(pStrip);
		}

		// create path matcher
		pathSearchRx = new RegExp('^(' +
			pathList.sort(function (a, b) { return paths[a].specificity < paths[b].specificity; } )
				.join('|')
				.replace(/\//g, '\\/') +
			')(?=\\/|$)'
		);

		pluginPath = cfg['pluginPath'] || pluginPath;

	}

	function noop () {}

	function begetCtx (name) {

		function toUrl (n) {
			return resolveUrl(resolvePath(normalizeName(n, baseName)), baseUrl);
		}

		var baseName = name.substr(0, name.lastIndexOf('/')),
			ctx = {
				baseName: baseName
			},
			exports = {},
			require = function (deps, callback) {
				return _require(deps, callback || noop, ctx);
			};
		// CommonJS Modules 1.1.1 compliance
		ctx.vars = {
			'exports': exports,
			'module': {
				'id': normalizeName(name, baseName),
				'uri': toUrl(name),
				'exports': exports
			}
		};
		if (debug) {
			require['curl'] = _curl;
		}
		ctx.require = ctx.vars['require'] = require;
		// using bracket property notation so closure won't clobber name
		require['toUrl'] = toUrl;

		return ctx;
	}

	function Begetter () {}

	function beget (parent) {
		Begetter.prototype = parent;
		var child = new Begetter();
		Begetter.prototype = undef;
		return child;
	}

	function begetCfg (absPluginId) {
		var root;
		root = absPluginId ?
			userCfg['plugins'] && userCfg['plugins'][absPluginId] :
			userCfg;
		return beget(root);
	}

	function Promise () {

		var self = this,
			thens = [];

		function then (resolved, rejected) {
			// capture calls to callbacks
			thens.push([resolved, rejected]);
		}

		function resolve (val) { complete(true, val); }

		function reject (ex) { complete(false, ex); }

		function complete (success, arg) {
			// switch over to sync then()
			then = success ?
				function (resolve, reject) { resolve && resolve(arg); } :
				function (resolve, reject) { reject && reject(arg); };
			// disallow multiple calls to resolve or reject
			resolve = reject =
				function () { throw new Error('Promise already completed.'); };
			// complete all callbacks
			var aThen, cb, i = 0;
			while ((aThen = thens[i++])) {
				cb = aThen[success ? 0 : 1];
				if (cb) cb(arg);
			}
		}

		this.then = function (resolved, rejected) {
			then(resolved, rejected);
			return self;
		};
		this.resolve = function (val) {
			self.resolved = val;
			resolve(val);
		};
		this.reject = function (ex) {
			self.rejected = ex;
			reject(ex);
		};

	}

	function ResourceDef (name) {
		Promise.apply(this);
		this.name = name;
	}

	function endsWithSlash (str) {
		return str.charAt(str.length - 1) == '/';
	}

	function joinPath (path, file) {
		return (!path || endsWithSlash(path) ? path : path + '/') + file;
	}

	function removeEndSlash (path) {
		return endsWithSlash(path) ? path.substr(0, path.length - 1) : path;
	}

	function resolvePath (name, prefix) {
		// TODO: figure out why this gets called so often for the same file
		// searches through the configured path mappings and packages
		// if the resulting module is part of a package, also return the main
		// module so it can be loaded.
		var pathInfo, path, found;

		function fixPath (name) {
			path = name.replace(pathSearchRx, function (match) {

				pathInfo = paths[match] || {};
				found = true;

				// if pathInfo.main and match == name, this is a main module
				if (pathInfo.main && match == name) {
					return pathInfo.main;
				}
				// if pathInfo.lib return pathInfo.lib
				else if (pathInfo.lib) {
					return pathInfo.lib;
				}
				else {
					return pathInfo.path || '';
				}

			});
		}

		// if this is a plugin-specific path to resolve
		if (prefix) {
			fixPath(prefix + '!/' + name);
		}
		if (!found) {
			fixPath(name);
		}

		return path;
	}

	function resolveUrl(path, baseUrl, addExt) {
		return (baseUrl && !absUrlRx.test(path) ? joinPath(baseUrl, path) : path) + (addExt && !dontAddExtRx.test(path) ? '.js' : '');
	}

	function loadScript (def, success, failure) {
		// script processing rules learned from RequireJS

		// insert script
		var el = doc.createElement('script');

		// initial script processing
		function process (ev) {
			ev = ev || global.event;
			// detect when it's done loading
			if (ev.type === 'load' || readyStates[this.readyState]) {
				delete activeScripts[def.name];
				// release event listeners
				this.onload = this[orsc] = this.onerror = null;
				success(el);
			}
		}

		function fail (e) {
			// some browsers send an event, others send a string,
			// but none of them send anything useful, so just say we failed:
			failure(new Error('Syntax error or http error: ' + def.url));
		}

		// set type first since setting other properties could
		// prevent us from setting this later
		el.type = 'text/javascript';
		// using dom0 event handlers instead of wordy w3c/ms
		el.onload = el[orsc] = process;
		el.onerror = fail;
		el.charset = def.charset || 'utf-8';
		el.async = true;
		el.src = def.url;

		// loading will start when the script is inserted into the dom.
		// IE will load the script sync if it's in the cache, so
		// indicate the current resource definition if this happens.
		activeScripts[def.name] = el;
		// use insertBefore to keep IE from throwing Operation Aborted (thx Bryan Forbes!)
		head.insertBefore(el, head.firstChild);

	}

	function fixArgs (args) {
		// resolve args
		// valid combinations for define:
		// (string, array, object|function) sax|saf
		// (array, object|function) ax|af
		// (string, object|function) sx|sf
		// (object|function) x|f

		var name, deps, definition, isDefFunc, len = args.length;

		definition = args[len - 1];
		isDefFunc = isType(definition, 'Function');

		if (len == 2) {
			if (isType(args[0], 'Array')) {
				deps = args[0];
			}
			else {
				name = args[0];
			}
		}
		else if (len == 3) {
			name = args[0];
			deps = args[1];
		}

		// mimic RequireJS's assumption that a definition function with zero
		// dependencies and non-zero arity is a wrapped CommonJS module
		if (!deps && isDefFunc && definition.length > 0) {
			deps = ['require', 'exports', 'module'];
		}

		return {
			name: name,
			deps: deps || [],
			res: isDefFunc ? definition : function () { return definition; }
		};
	}

	function resolveResDef (def, args, ctx) {

		if (debug && console) {
			console.log('curl: resolving', def.name);
		}

		// if a module id has been remapped, it will have a baseName
		var childCtx = begetCtx(def.baseName || def.name);

		// get the dependencies and then resolve/reject
		getDeps(def, args.deps, childCtx,
			function (deps) {
				try {
					// node.js assumes `this` === exports
					// anything returned overrides exports
					var res = args.res.apply(childCtx.vars['exports'], deps) || childCtx.vars['exports'];
					if (debug && console) {
						console.log('curl: defined', def.name, res.toString().substr(0, 50).replace(/\n/, ' '));
					}
				}
				catch (ex) {
					def.reject(ex);
				}
				def.resolve(res);
			},
			def.reject
		);

	}

	function fetchResDef (def, ctx) {

		loadScript(def,

			function () {
				var args = argsNet;
				argsNet = undef; // reset it before we get deps

				// if our resource was not explicitly defined with a name (anonymous)
				// Note: if it did have a name, it will be resolved in the define()
				if (def.useNet !== false) {

					if (!args) {
						// uh oh, nothing was added to the resource net
						def.reject(new Error('define() not found or duplicates found: ' + def.url));
					}
					else if (args.ex) {
						// the resNet resource was already rejected, but it didn't know
						// its name, so reject this def now with better information
						def.reject(new Error(args.ex.replace('${url}', def.url)));
					}
					else {
						resolveResDef(def, args, ctx);
					}
				}

			},

			def.reject

		);

		return def;

	}

	function normalizeName (name, baseName) {
		// if name starts with . then use parent's name as a base
		// if name starts with .. then use parent's parent
		return name.replace(normalizeRx, function (match, dot1, dot2) {
			return (dot2 ? baseName.substr(0, baseName.lastIndexOf('/')) : baseName) + '/';
		});
	}

	function fetchDep (depName, ctx) {
		var name, delPos, prefix, resName, def, cfg;

		// check for plugin prefix
		delPos = depName.indexOf('!');
		if (delPos >= 0) {

			prefix = depName.substr(0, delPos);
			resName = depName.substr(delPos + 1);

			// prepend plugin folder path, if it's missing and path isn't in paths
			var prefixPath = resolvePath(prefix);
			var slashPos = prefixPath.indexOf('/');
			if (slashPos < 0) {
				prefixPath = resolvePath(joinPath(pluginPath, prefixPath));
			}

			// fetch plugin
			var pluginDef = cache[prefix];
			if (!pluginDef) {
				pluginDef = cache[prefix] = new ResourceDef(prefix);
				pluginDef.url = resolveUrl(prefixPath, baseUrl, true);
				pluginDef.baseName = prefixPath;
				fetchResDef(pluginDef, ctx);
			}

			// alter the toUrl passed into the plugin so that it can
			// also find plugin-prefixed path specifiers. e.g.:
			// "js!resourceId": "path/to/js/resource"
			// TODO: make this more efficient by allowing toUrl to be
			// overridden more easily and detecting if there's a
			// plugin-specific path more efficiently
			ctx = begetCtx(ctx.baseName);
			ctx.require['toUrl'] = function toUrl (absId) {
				var prefixed, path;
				path = resolvePath(absId, prefix);
				return resolveUrl(path, baseUrl);
			};

			// get plugin config
			cfg = begetCfg(prefix) || {};

			function toAbsId (id) {
				return normalizeName(id, ctx.baseName);
			}

			// we need to use depName until plugin tells us normalized name
			// if the plugin may changes the name, we need to consolidate
			// def promises below
			def = new ResourceDef(depName);

			pluginDef.then(
				function (plugin) {
					var normalizedDef;

					resName = depName.substr(delPos + 1);
					// check if plugin supports the normalize method
					if ('normalize' in plugin) {
						resName = plugin['normalize'](resName, toAbsId, cfg);
					}
					else {
						resName = toAbsId(resName);
					}

					// the spec is unclear, so we're using the full name (prefix + name) to id resources
					// so multiple plugins could each process the same resource
					name = prefix + '!' + resName;
					normalizedDef = cache[name];

					// if this is our first time fetching this (normalized) def
					if (!normalizedDef) {

						normalizedDef = new ResourceDef(name);

						// resName could be blank if the plugin doesn't specify a name (e.g. "domReady!")
						// don't cache non-determinate "dynamic" resources (or non-existent resources)
						if (resName && !plugin['dynamic']) {
							cache[name] = normalizedDef;
						}

						// curl's plugins prefer to receive the back-side of a promise,
						// but to be compatible with commonjs's specification, we have to
						// piggy-back on the callback function parameter:
						var loaded = normalizedDef.resolve;
						// using bracket property notation so closure won't clobber name
						loaded['resolve'] = loaded;
						loaded['reject'] = normalizedDef.reject;

						// load the resource!
						plugin.load(resName, ctx.require, loaded, cfg);

					}

					// chain defs (resolve when plugin.load executes)
					normalizedDef.then(def.resolve, def.reject);

				},
				def.reject
			);

		}
		else {
			resName = name = normalizeName(depName, ctx.baseName);

			def = cache[resName];
			if (!def) {
				def = cache[resName] = new ResourceDef(resName);
				def.url = resolveUrl(resolvePath(resName), baseUrl, true);
				fetchResDef(def, ctx);
			}

		}

		return def;
	}

	function getDeps (def, names, ctx, success, failure) {

		var deps = [],
			count = names.length,
			len = count,
			completed = false;

		// obtain each dependency
		// Note: IE may have obtained the dependencies sync (stooooopid!) thus the completed flag
		for (var i = 0; i < len && !completed; i++) (function (index, depName) {
			if (depName in ctx.vars) {
				deps[index] = ctx.vars[depName];
				count--;
			}
			// check for blanks. fixes #32.
			// this could also help with the has! plugin (?)
			else if (!depName) {
				count--;
			}
			else {
				// hook into promise callbacks
				fetchDep(depName, ctx).then(
					function (dep) {
						deps[index] = dep; // got it!
						if (--count == 0) {
							completed = true;
							success(deps);
						}
					},
					function (ex) {
						completed = true;
						failure(ex);
					}
				);
			}
		}(i, names[i]));

		// were there none to fetch and did we not already complete the promise?
		if (count == 0 && !completed) {
			success(deps);
		}

	}

	function getCurrentDefName () {
		// Note: Opera lies about which scripts are "interactive", so we
		// just have to test for it. Opera provides a true browser test, not
		// a UA sniff thankfully.
		// TODO: find a way to remove this browser test
		var def;
		if (!isType(global.opera, 'Opera')) {
			for (var d in activeScripts) {
				if (activeScripts[d].readyState == 'interactive') {
					def = d;
					break;
				}
			}
		}
		return def;
	}

	function _require (deps, callback, ctx) {
		// Note: callback could be a promise

		// RValue require
		if (isType(deps, 'String')) {
			// return resource
			var def = cache[deps],
				res = def && def.resolved;
			if (res === undef) {
				throw new Error('Module is not already resolved: '  + deps);
			}
			return res;
		}

		// resolve dependencies
		getDeps(null, deps, ctx,
			function (deps) {
				// Note: deps are passed to a promise as an array, not as individual arguments
				callback.resolve ? callback.resolve(deps) : callback.apply(null, deps);
			},
			function (ex) {
				if (callback.reject) callback.reject(ex);
				else throw ex;
			}
		);

	}

	function _curl (/* various */) {

		var args = aslice.call(arguments), callback, names, ctx;

		// extract config, if it's specified
		if (isType(args[0], 'Object')) {
			userCfg = args.shift();
			extractCfg(userCfg);
		}

		// extract dependencies
		names = [].concat(args[0]); // force to array TODO: create unit test when this is official
		callback = args[1];

		// this must be after extractCfg
		ctx = begetCtx('');

		var promise = new Promise(),
			api = {};

			// return the dependencies as arguments, not an array
			// using bracket property notation so closure won't clobber name
			api['then'] = function (resolved, rejected) {
				promise.then(
					function (deps) { if (resolved) resolved.apply(null, deps); },
					function (ex) { if (rejected) rejected(ex); else throw ex; }
				);
				return api;
			};

			// promise chaining
			api['next'] = function (names, cb) {
				var origPromise = promise;
				promise = new Promise();
				// wait for the previous promise
				origPromise.then(
					// get dependencies and then resolve the current promise
					function () { ctx.require(names, promise, ctx); },
					// fail the current promise
					function (ex) { promise.reject(ex); }
				);
				// execute this callback after dependencies
				if (cb) {
					promise.then(function (deps) {
						cb.apply(this, deps)
					});
				}
				return api;
			};

			if (callback) api['then'](callback);

		ctx.require(names, promise, ctx);

		return api;

	}

	function _define (/* various */) {

		var args = fixArgs(arguments),
			name = args.name;

		if (name == null) {
			if (argsNet !== undef) {
				argsNet = {ex: 'Multiple anonymous defines found in ${url}.'};
			}
			else if (!(name = getCurrentDefName())/* intentional assignment */) {
				// anonymous define(), defer processing until after script loads
				argsNet = args;
			}
		}
		if (name != null) {
			// named define(), it is in the cache if we are loading a dependency
			// (could also be a secondary define() appearing in a built file, etc.)
			// if it's a secondary define(), grab the current def's context
			var def = cache[name];
			if (!def) {
				def = cache[name] = new ResourceDef(name);
			}
			def.useNet = false;
			// check if this resource has already been resolved (can happen if
			// a module was defined inside a built file and outside of it and
			// dev didn't coordinate it explicitly)
			if (!('resolved' in def)) {
				resolveResDef(def, args, begetCtx(name));
			}
		}

	}

	/***** grab any global configuration info *****/

	// if userCfg is a function, assume curl() exists already
	var conflict = isType(userCfg, 'Function');
	if (!conflict) {
		extractCfg(userCfg);
	}

	/***** define public API *****/

	// allow curl to be renamed and added to a specified context
	var apiName, apiContext;

	apiName = userCfg['apiName'] || 'curl';
	apiContext = userCfg['apiContext'] || global;

	apiContext[apiName] = _curl;
	cache[apiName] = new ResourceDef(apiName);
	cache[apiName].resolve(_curl);

	// using bracket property notation so closure won't clobber name
	global['define'] = _curl['define'] = _define;
	_curl['version'] = version;

	// indicate our capabilities:
	_define['amd'] = { 'plugins': true, 'jQuery': true };

}(
	this,
	document,
	// grab configuration
	this['curl'] || {}
));
