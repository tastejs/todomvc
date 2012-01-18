//a steal for the filesystem
(function() {
	var oldWindow = function() {
		return (function() {
			return this
		}).call(null, 0);
	},
		oldSteal = oldWindow().steal;
	var steal = (oldWindow().steal = function() {
		for ( var i = 0; i < arguments.length; i++ ) {
			var inc = arguments[i];
			if ( typeof inc == 'string' ) {
				load(inc.substr(2) + ".js")
			} else {
				inc(steal)
			}
		}
		return steal;
	});
	steal.plugins = function() {
		for ( var i = 0; i < arguments.length; i++ ) {
			var inc = arguments[i];
			if ( typeof inc == 'string' ) {
				// print(inc + "/" + inc.match(/\w+$/)[0] + ".js")
				load(inc + "/" + inc.match(/\w+$/)[0] + ".js")
			} else {
				inc(steal)
			}
		}
		return steal;
	}
	steal.extend = function( d, s ) {
		for ( var p in s ) d[p] = s[p];
		return d;
	};

	steal.isArray = function( arr ) {
		return Object.prototype.toString.call(arr) === "[object Array]"
	}
	steal.then = steal;
	steal.inArray = function( item, arr ) {
		var len = arr.length;
		for ( var i = 0; i < len; i++ ) {
			if ( arr[i] == item ) {
				return i;
			}
		}
		return -1;
	};
	steal.cleanId = function( id ) {
		return id.replace(/[\/\.]/g, "_");
	};
	steal.win = oldWindow;
	if ( oldSteal ) {
		steal._steal = oldSteal;
	}
	/**
	 * Converts args or a string into options
	 * @param {Object} args
	 * @param {Object} options something like 
	 * {
	 * name : {
	 * 	shortcut : "-n",
	 * 	args: ["first","second"]
	 * },
	 * other : 1
	 * }
	 */
	steal.opts = function( args, options ) {
		if ( typeof args == 'string' ) {
			args = args.split(' ')
		}
		if (!steal.isArray(args) ) {
			return args
		}

		var opts = {};
		//normalizes options
		(function() {
			var name, val, helper
			for ( name in options ) {
				val = options[name];
				if ( steal.isArray(val) || typeof val == 'number' ) {
					options[name] = {
						args: val
					};
				}
				options[name].name = name;
				//move helper
				helper = options[name].helper || name.substr(0, 1);

				options[helper] = options[name]
			}
		})();
		var latest, def;
		for ( var i = 0; i < args.length; i++ ) {
			if ( args[i].indexOf('-') == 0 && (def = options[args[i].substr(1)]) ) {
				latest = def.name;
				opts[latest] = true;
				//opts[latest] = []
			} else {
				if ( opts[latest] === true ) {
					opts[latest] = args[i]
				} else {
					if (!steal.isArray(opts[latest]) ) {
						opts[latest] = [opts[latest]]
					}
					opts[latest].push(args[i])
				}

			}
		}

		return opts;
	}
	steal.clear = function() {
		var win = steal.win();
		for ( var n in win ) {
			if ( n != "_S" ) {
				//this[n] = null;
				delete win[n];
			}
		}
		return steal;
	}
	// a way to turn off printing (mostly for testing purposes)
	steal.print = function(){

		if(typeof STEALPRINT == "undefined" || STEALPRINT !== false){
			print.apply(null, arguments)
		}
	}
})()


load('steal/rhino/file.js')