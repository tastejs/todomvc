;
void

function(w, d) {

	var cfg = {},
		bin = {},
		isWeb = !! (w.location && w.location.protocol && /^https?:/.test(w.location.protocol)),
		handler = {},
		regexp = {
			name: new RegExp('\\{name\\}', 'g')
		},
		helper = { /** TODO: improve url handling*/
			uri: {
				getDir: function(url) {
					var index = url.lastIndexOf('/');
					return index == -1 ? '' : url.substring(index + 1, -index);
				},
				/** @obsolete */
				resolveCurrent: function() {
					var scripts = d.querySelectorAll('script');
					return scripts[scripts.length - 1].getAttribute('src');
				},
				resolveUrl: function(url, parent) {
					if (cfg.path && url[0] == '/') {
						url = cfg.path + url.substring(1);
					}
					if (url[0] == '/') {
						if (isWeb == false || cfg.lockedToFolder == true) return url.substring(1);
						return url;
					}
					switch (url.substring(0, 4)) {
					case 'file':
					case 'http':
						return url;
					}

					if (parent != null && parent.location != null) return parent.location + url;
					return url;
				}
			},
			extend: function(target, source) {
				for (var key in source) target[key] = source[key];
				return target;
			},
			/**
			 *	@arg x :
			 *	1. string - URL to resource
			 *	2. array - URLs to resources
			 *	3. object - {route: x} - route defines the route template to resource,
			 *		it must be set before in include.cfg.
			 *		example:
			 *			include.cfg('net','scripts/net/{name}.js')
			 *			include.js({net: 'downloader'}) // -> will load scipts/net/downloader.js
			 *	@arg namespace - route in case of resource url template, or namespace in case of LazyModule
			 *
			 *	@arg fn - callback function, which receives namespace|route, url to resource and ?id in case of not relative url
			 *	@arg xpath - xpath string of a lazy object 'object.sub.and.othersub';
			 */
			eachIncludeItem: function(type, x, fn, namespace, xpath) {
				if (x == null) {
					console.error('Include Item has no Data', type, namespace);
					return;
				}

				if (type == 'lazy' && xpath == null) {
					for (var key in x) this.eachIncludeItem(type, x[key], fn, null, key);
					return;
				}
				if (x instanceof Array) {
					for (var i = 0; i < x.length; i++) this.eachIncludeItem(type, x[i], fn, namespace, xpath);
					return;
				}
				if (typeof x === 'object') {
					for (var key in x) this.eachIncludeItem(type, x[key], fn, key, xpath);
					return;
				}

				if (typeof x === 'string') {
					var route = namespace && cfg[namespace];
					if (route) {
						namespace += '.' + x;
						x = route.replace(regexp.name, x);
					}
					fn(namespace, x, xpath);
					return;
				}

				console.error('Include Package is invalid', arguments);
			},
			invokeEach: function(arr, args) {
				if (arr == null) return;
				if (arr instanceof Array) {
					for (var i = 0, x, length = arr.length; x = arr[i], i < length; i++) {
						if (typeof x === 'function')(args != null ? x.apply(this, args) : x());
					}
				}
			},
			doNothing: function(fn) {
				typeof fn == 'function' && fn()
			},
			reportError: function(e) {
				console.error('IncludeJS Error:', e, e.message, e.url);
				typeof handler.onerror == 'function' && handler.onerror(e);
			},
			ensureArray: function(obj, xpath) {
				if (!xpath) return obj;
				var arr = xpath.split('.');
				while (arr.length - 1) {
					var key = arr.shift();
					obj = obj[key] || (obj[key] = {});
				}
				return (obj[arr.shift()] = []);
			},
			xhr: function(url, callback) {
				var xhr = new XMLHttpRequest(),
					s = Date.now();
				xhr.onreadystatechange = function() {
					xhr.readyState == 4 && callback && callback(url, xhr.responseText);
				}
				xhr.open('GET', url, true);
				xhr.send();
			}
		},

		events = (function(w, d) {
			if (d == null) {
				return {
					ready: helper.doNothing,
					load: helper.doNothing
				};
			}
			var readycollection = [],
				loadcollection = null,
				readyqueue = null,
				timer = Date.now();

			d.onreadystatechange = function() {
				if (/complete|interactive/g.test(d.readyState) == false) return;

				if (timer) console.log('DOMContentLoader', d.readyState, Date.now() - timer, 'ms');
				events.ready = (events.readyQueue = helper.doNothing);
				
				
				helper.invokeEach(readyqueue);
				
				helper.invokeEach(readycollection);				
				readycollection = null;
				readyqueue = null;
				
				
				if (d.readyState == 'complete') {
					events.load = helper.doNothing;
					helper.invokeEach(loadcollection);
					loadcollection = null;
				}
			};

			return {
				ready: function(callback) {
					readycollection.unshift(callback);
				},
				readyQueue: function(callback){
					(readyqueue || (readyqueue = [])).push(callback);
				},
				load: function(callback) {
					(loadcollection || (loadcollection = [])).unshift(callback);
				}
			}
		})(w, d);


	var IncludeDeferred = Class({
		ready: function(callback) {
			return this.on(4, function() {
				events.ready(this.resolve.bind(this, callback)); 
			}.bind(this));
		},
		/** assest loaded and window is loaded */
		loaded: function(callback) {
			return this.on(4, function() {
				events.load(callback);
			});
		},
		/** assest loaded */
		done: function(callback) {
			return this.on(4, this.resolve.bind(this, callback));
		},
		resolve: function(callback) {
			var r = callback(this.response);
			if (r != null) this.obj = r;
		}
	});


	var StateObservable = Class({
		Construct: function() {
			this.callbacks = [];
		},
		on: function(state, callback) {
			state <= this.state ? callback(this) : this.callbacks.unshift({
				state: state,
				callback: callback
			});
			return this;
		},
		readystatechanged: function(state) {
			this.state = state;
			for (var i = 0, x, length = this.callbacks.length; x = this.callbacks[i], i < length; i++) {
				if (x.state > this.state || x.callback == null) continue;
				x.callback(this);
				x.callback = null;
			}
		}
	});


	var currentParent;
	var Include = Class({
		setCurrent: function(data) {
			currentParent = data;
		},
		incl: function(type, pckg) {
			if (this instanceof Resource) return this.include(type, pckg);

			var r = new Resource;

			if (currentParent) {
				r.id = currentParent.id;
				r.url = currentParent.url;
				r.namespace = currentParent.namespace;
				r.location = helper.uri.getDir(r.url)
				//-currentParent = null;
			}
			return r.include(type, pckg);
			//-return (this instanceof Resource ? this : new Resource).include(type, pckg);
		},
		js: function(pckg) {
			return this.incl('js', pckg);
		},
		css: function(pckg) {
			return this.incl('css', pckg);
		},
		load: function(pckg) {
			return this.incl('load', pckg);
		},
		ajax: function(pckg) {
			return this.incl('ajax', pckg);
		},
		embed: function(pckg) {
			return this.incl('embed', pckg);
		},
		lazy: function(pckg) {
			return this.incl('lazy', pckg);
		},

		cfg: function(arg) {
			switch (typeof arg) {
			case 'object':
				for (var key in arg) cfg[key] = arg[key];
				break;
			case 'string':
				if (arguments.length == 1) return cfg[arg];
				if (arguments.length == 2) cfg[arg] = arguments[1];
				break;
			case 'undefined':
				return cfg;
			}
			return this;
		},
		promise: function(namespace) {
			var arr = namespace.split('.'),
				obj = w;
			while (arr.length) {
				var key = arr.shift();
				obj = obj[key] || (obj[key] = {});
			}
			return obj;
		},
		register: function(_bin) {
			var onready = [];
			for (var key in _bin) {
				for (var i = 0; i < _bin[key].length; i++) {
					var id = _bin[key][i].id,
						url = _bin[key][i].url,
						namespace = _bin[key][i].namespace,
						resource = new Resource;

					resource.state = 4;
					resource.namespace = namespace;
					resource.type = key;
					
					if (url) {
						if (url[0] == '/') url = url.substring(1);
						resource.location = helper.uri.getDir(url);
					}

					switch (key) {
					case 'load':
					case 'lazy':
						resource.state = 0;
						events.readyQueue(function(_r, _id) {
							var container = d.querySelector('script[data-id="' + _id + '"]');
							if (container == null) {
								console.error('"%s" Data was not embedded into html', _id);
								return;
							}
							_r.obj = container.innerHTML;
							_r.readystatechanged(4);
						}.bind(this, resource, id));
						break;
					};
					(bin[key] || (bin[key] = {}))[id] = resource;
				}
			}			
		}
	});


	var hasRewrites = typeof IncludeRewrites != 'undefined',
		rewrites = hasRewrites ? IncludeRewrites : null;


	var Resource = Class({
		Base: Include,
		Extends: [IncludeDeferred, StateObservable],
		Construct: function(type, url, namespace, xpath, parent, id) {

			if (type == null) {
				return this;
			}



			this.namespace = namespace;
			this.type = type;
			this.xpath = xpath;
			this.url = url;

			if (url != null) {
				this.url = helper.uri.resolveUrl(url, parent);
			}


			if (id) void(0);
			else if (namespace) id = namespace;
			else if (url[0] == '/') id = url;
			else if (parent && parent.namespace) id = parent.namespace + '/' + url;
			else if (parent && parent.location) id = '/' + parent.location.replace(/^[\/]+/, '') + url;
			else if (parent && parent.id) id = parent.id + '/' + url;
			else id = '/' + url;

			if (bin[type] && bin[type][id]) {
				return bin[type][id];
			}


			if (hasRewrites == true && rewrites[id] != null) {
				url = rewrites[id];
			} else {
				url = this.url;
			}

			this.location = helper.uri.getDir(url);

			//-console.log('includejs. Load Resource:', id, url);


			;
			(bin[type] || (bin[type] = {}))[id] = this;


			var tag;
			switch (type) {
			case 'js':
				helper.xhr(url, this.onload.bind(this));
				if (d != null) {
					tag = d.createElement('script');
					tag.type = "application/x-included-placeholder";
					tag.src = url;
				}
				break;
			case 'ajax':
			case 'load':
			case 'lazy':
				helper.xhr(url, this.onload.bind(this));
				break;
			case 'css':
				this.state = 4;

				tag = d.createElement('link');
				tag.href = url;
				tag.rel = "stylesheet";
				tag.type = "text/css";
				break;
			case 'embed':
				tag = d.createElement('script');
				tag.type = 'application/javascript';
				tag.src = url;
				tag.onload = function() {
					this.readystatechanged(4);
				}.bind(this);
				tag.onerror = tag.onload;
				break;
			}
			if (tag != null) {
				d.querySelector('head').appendChild(tag);
				tag = null;
			}
			return this;
		},
		include: function(type, pckg) {
			this.state = 0;
			if (this.includes == null) this.includes = [];

			helper.eachIncludeItem(type, pckg, function(namespace, url, xpath) {

				var resource = new Resource(type, url, namespace, xpath, this);


				this.includes.push(resource);

				resource.index = this.calcIndex(type, namespace);
				resource.on(4, this.resourceLoaded.bind(this));
			}.bind(this));

			return this;
		},
		calcIndex: function(type, namespace) {
			if (this.response == null) this.response = {};
			switch (type) {
			case 'js':
			case 'load':
			case 'ajax':
				if (this.response[type + 'Index'] == null) this.response[type + 'Index'] = -1;
				return ++this.response[type + 'Index'];
			}
			return -1;
		},
		wait: function() {
			if (this.waits == null) this.waits = [];
			if (this._include == null) this._include = this.include;

			var data;

			this.waits.push((data = []));
			this.include = function(type, pckg) {
				data.push({
					type: type,
					pckg: pckg
				});
				return this;
			}
			return this;
		},
		resourceLoaded: function(resource) {
			if (this.parsing) return;


			if (resource != null && resource.obj != null && resource.obj instanceof Include === false) {
				switch (resource.type) {
				case 'js':
				case 'load':
				case 'ajax':
					var obj = (this.response[resource.type] || (this.response[resource.type] = []));

					if (resource.namespace != null) {
						obj = helper.ensureArray(obj, resource.namespace);
					}
					obj[resource.index] = resource.obj;
					break;
				}
			}

			if (this.includes != null && this.includes.length) {
				for (var i = 0; i < this.includes.length; i++) if (this.includes[i].state != 4) return;
			}


			if (this.waits && this.waits.length) {

				var data = this.waits.shift();
				this.include = this._include;
				for (var i = 0; i < data.length; i++) this.include(data[i].type, data[i].pckg);
				return;
			}

			this.readystatechanged((this.state = 4));

		},

		onload: function(url, response) {
			if (!response) {
				console.warn('Resource cannt be loaded', this.url);
				this.readystatechanged(4);
				return;
			}

			switch (this.type) {
			case 'load':
			case 'ajax':
				this.obj = response;
				break;
			case 'lazy':
				LazyModule.create(this.xpath, response);
				break;
			case 'js':
				this.parsing = true;
				try {
					__includeEval(response, this);
				} catch (error) {
					error.url = this.url;
					helper.reportError(error);
				}
				break;
			};

			this.parsing = false;

			this.resourceLoaded(null);

		}

	});


	var LazyModule = {
		create: function(xpath, code) {
			var arr = xpath.split('.'),
				obj = window,
				module = arr[arr.length - 1];
			while (arr.length > 1) {
				var prop = arr.shift();
				obj = obj[prop] || (obj[prop] = {});
			}
			arr = null;
			obj.__defineGetter__(module, function() {

				delete obj[module];
				try {
					var r = __includeEval(code, window.include);
					if (r != null && r instanceof Resource == false) obj[module] = r;
				} catch (error) {
					error.xpath = xpath;
					helper.reportError(e);
				} finally {
					code = null;
					xpath = null;

					return obj[module];
				}
			});
		}
	}


	w.include = new Include();
	w.include.helper = helper;
	w.IncludeResource = Resource;


}(window, window.document);

window.__includeEval = function(source, include) {
	return eval(source);
}