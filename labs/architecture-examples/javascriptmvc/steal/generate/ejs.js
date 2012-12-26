//@documentjs-ignore
steal.then(function( steal ) {


	var rsplit = function( string, regex ) {
		var result = regex.exec(string),
			retArr = [],
			first_idx, last_idx, first_bit;
		while ( result !== null ) {
			first_idx = result.index;
			last_idx = regex.lastIndex;
			if ((first_idx) !== 0 ) {
				first_bit = string.substring(0, first_idx);
				retArr.push(string.substring(0, first_idx));
				string = string.slice(first_idx);
			}
			retArr.push(result[0]);
			string = string.slice(result[0].length);
			result = regex.exec(string);
		}
		if (!string == '' ) {
			retArr.push(string);
		}
		return retArr;
	},
		chop = function( string ) {
			return string.substr(0, string.length - 1);
		},
		extend = function( d, s ) {
			for ( var n in s ) {
				if ( s.hasOwnProperty(n) ) {
					d[n] = s[n];
				}
			}
		};

		steal.EJS = function( options ) {
			options = typeof options === "string" ? {
				view: options
			} : options;
			
			this.set_options(options);
			if ( options.precompiled ) {
				this.template = {};
				this.template.process = options.precompiled;
				vEJS.update(this.name, this);
				return;
			}
			if ( options.element ) {
				if ( typeof options.element === 'string' ) {
					var name = options.element;
					options.element = document.getElementById(options.element);
					
					if ( options.element == null ){
						throw name + 'does not exist!';
					}
				}
				if ( options.element.value ) {
					this.text = options.element.value;
				} else {
					this.text = options.element.innerHTML;
				}
				this.name = options.element.id;
				this.type = '[';
			} else if ( options.url ) {
				options.url = vEJS.endExt(options.url, this.extMatch);
				this.name = this.name ? this.name : options.url;
				var url = options.url;
				//options.view = options.absolute_url || options.view || options.;
				var template = vEJS.get(this.name
				/*url*/
				, this.cache);
				
				if ( template ){
					return template;
				}
				
				if ( template === vEJS.INVALID_PATH ){
					return null;
				}
				
				try {
					this.text = vEJS.request(url + (this.cache ? '' : '?' + Math.random()));
				} catch (e) {}

				if ( this.text == null ) {
					throw ('There is no template at ' + url);
				}
				//this.name = url;
			}
			
			var template = new vEJS.Compiler(this.text, this.type);

			template.compile(options, this.name);

			vEJS.update(this.name, this);
			this.template = template;
		};
	var vEJS = steal.EJS;
	/* @Prototype*/
	vEJS.prototype = {
		/**
		 * Renders an object with extra view helpers attached to the view.
		 * @param {Object} object data to be rendered
		 * @param {Object} extra_helpers an object with additonal view helpers
		 * @return {String} returns the result of the string
		 */
		render: function( object, extra_helpers ) {
			object = object || {};
			this._extra_helpers = extra_helpers;
			var v = new vEJS.Helpers(object, extra_helpers || {});
			return this.template.process.call(object, object, v);
		},
		update: function( element, options ) {
			if ( typeof element === 'string' ) {
				element = document.getElementById(element);
			}
			if ( options == null ) {
				_template = this;
				return function( object ) {
					vEJS.prototype.update.call(_template, element, object);
				};
			}
			if ( typeof options === 'string' ) {
				params = {};
				params.url = options;
				_template = this;
				
				params.onComplete = function( request ) {
					var object = eval(request.responseText);
					vEJS.prototype.update.call(_template, element, object);
				};
				
				vEJS.ajax_request(params);
			} else {
				element.innerHTML = this.render(options);
			}
		},
		out: function() {
			return this.template.out;
		},
		/**
		 * Sets options on this view to be rendered with.
		 * @param {Object} options
		 */
		set_options: function( options ) {
			this.type = options.type || vEJS.type;
			this.cache = options.cache != null ? options.cache : vEJS.cache;
			this.text = options.text || null;
			this.name = options.name || null;
			this.ext = options.ext || vEJS.ext;
			this.extMatch = new RegExp(this.ext.replace(/\./, '\.'));
		}
	};
	vEJS.endExt = function( path, match ) {
		if (!path ){
			return null;
		}
		match.lastIndex = 0;
		return path + (match.test(path) ? '' : this.ext);
	};

	/* @Static*/
	vEJS.Scanner = function( source, left, right ) {

		extend(this, {
			left_delimiter: left + '%',
			right_delimiter: '%' + right,
			double_left: left + '%%',
			double_right: '%%' + right,
			left_equal: left + '%=',
			left_comment: left + '%#'
		});

		this.SplitRegexp = left === '[' 
							? /(\[%%)|(%%\])|(\[%=)|(\[%#)|(\[%)|(%\]\n)|(%\])|(\n)/ 
							: new RegExp('(' + this.double_left + ')|(%%' + this.double_right + ')|(' + this.left_equal + ')|(' + this.left_comment + ')|(' + this.left_delimiter + ')|(' + this.right_delimiter + '\n)|(' + this.right_delimiter + ')|(\n)');

		this.source = source;
		this.stag = null;
		this.lines = 0;
	};

	vEJS.Scanner.to_text = function( input ) {
		if ( input == null || input === undefined ){
			return '';
		}
		
		if ( input instanceof Date ) {
			return input.toDateString();
		}
		
		if ( input.toString ) {
			return input.toString();
		}
		
		return '';
	};

	vEJS.Scanner.prototype = {
		scan: function( block ) {
			scanline = this.scanline;
			regex = this.SplitRegexp;
			if ( !this.source == '' ) {
				var source_split = rsplit(this.source, /\n/);
				for ( var i = 0; i < source_split.length; i++ ) {
					var item = source_split[i];
					this.scanline(item, regex, block);
				}
			}
		},
		scanline: function( line, regex, block ) {
			this.lines++;
			var line_split = rsplit(line, regex);
			for ( var i = 0; i < line_split.length; i++ ) {
				var token = line_split[i];
				if ( token != null ) {
					try {
						block(token, this);
					} catch (e) {
						throw {
							type: 'vEJS.Scanner',
							line: this.lines
						};
					}
				}
			}
		}
	};


	vEJS.Buffer = function( pre_cmd, post_cmd ) {
		this.line = [];
		this.script = "";
		this.pre_cmd = pre_cmd;
		this.post_cmd = post_cmd;
		for ( var i = 0; i < this.pre_cmd.length; i++ ) {
			this.push(pre_cmd[i]);
		}
	};
	vEJS.Buffer.prototype = {

		push: function( cmd ) {
			this.line.push(cmd);
		},

		cr: function() {
			this.script = this.script + this.line.join('; ');
			this.line = [];
			this.script = this.script + "\n";
		},

		close: function() {
			if ( this.line.length > 0 ) {
				for ( var i = 0; i < this.post_cmd.length; i++ ) {
					this.push(pre_cmd[i]);
				}
				this.script = this.script + this.line.join('; ');
				line = null;
			}
		}

	};


	vEJS.Compiler = function( source, left ) {
		this.pre_cmd = ['var ___ViewO = [];'];
		this.post_cmd = [];
		this.source = ' ';
		if ( source != null ) {
			if ( typeof source === 'string' ) {
				source = source.replace(/\r\n/g, "\n");
				source = source.replace(/\r/g, "\n");
				this.source = source;
			} else if ( source.innerHTML ) {
				this.source = source.innerHTML;
			}
			if ( typeof this.source !== 'string' ) {
				this.source = "";
			}
		}
		left = left || '<';
		var right = '>';
		switch ( left ) {
		case '[':
			right = ']';
			break;
		case '<':
			break;
		default:
			throw left + ' is not a supported deliminator';
			//break;
		}
		this.scanner = new vEJS.Scanner(this.source, left, right);
		this.out = '';
	};
	vEJS.Compiler.prototype = {
		compile: function( options, name ) {
			options = options || {};
			this.out = '';
			var put_cmd = "___ViewO.push(";
			var insert_cmd = put_cmd;
			var buff = new vEJS.Buffer(this.pre_cmd, this.post_cmd);
			var content = '';
			var clean = function( content ) {
				content = content.replace(/\\/g, '\\\\');
				content = content.replace(/\n/g, '\\n');
				content = content.replace(/"/g, '\\"');
				return content;
			};
			this.scanner.scan(function( token, scanner ) {
				if ( scanner.stag == null ) {
					switch ( token ) {
					case '\n':
						content = content + "\n";
						buff.push(put_cmd + '"' + clean(content) + '");');
						buff.cr();
						content = '';
						break;
					case scanner.left_delimiter:
					case scanner.left_equal:
					case scanner.left_comment:
						scanner.stag = token;
						if ( content.length > 0 ) {
							buff.push(put_cmd + '"' + clean(content) + '")');
						}
						content = '';
						break;
					case scanner.double_left:
						content = content + scanner.left_delimiter;
						break;
					default:
						content = content + token;
						break;
					}
				}
				else {
					switch ( token ) {
					case scanner.right_delimiter:
						switch ( scanner.stag ) {
						case scanner.left_delimiter:
							if ( content[content.length - 1] === '\n' ) {
								content = chop(content);
								buff.push(content);
								buff.cr();
							}
							else {
								buff.push(content);
							}
							break;
						case scanner.left_equal:
							buff.push(insert_cmd + "(vEJS.Scanner.to_text(" + content + ")))");
							break;
						}
						scanner.stag = null;
						content = '';
						break;
					case scanner.double_right:
						content = content + scanner.right_delimiter;
						break;
					default:
						content = content + token;
						break;
					}
				}
			});
			if ( content.length > 0 ) {
				// Chould be content.dump in Ruby
				buff.push(put_cmd + '"' + clean(content) + '")');
			}
			buff.close();
			this.out = buff.script + ";";
			var to_be_evaled = '/*' + name + '*/this.process = function(_CONTEXT,_VIEW) { try { with(_VIEW) { with (_CONTEXT) {' + this.out + " return ___ViewO.join('');}}}catch(e){e.lineNumber=null;throw e;}};";

			try {
				eval(to_be_evaled);
			} catch (e) {
				if ( typeof JSLINT !== 'undefined' ) {
					JSLINT(this.out);
					for ( var i = 0; i < JSLINT.errors.length; i++ ) {
						var error = JSLINT.errors[i];
						if ( error.reason !== "Unnecessary semicolon." ) {
							error.line++;
							e = new Error();
							e.lineNumber = error.line;
							e.message = error.reason;
							if ( options.view ){
								e.fileName = options.view;
							}
							throw e;
						}
					}
				} else {
					throw e;
				}
			}
		}
	};


	//type, cache, folder
	vEJS.config = function( options ) {
		vEJS.cache = options.cache != null ? options.cache : vEJS.cache;
		vEJS.type = options.type != null ? options.type : vEJS.type;
		vEJS.ext = options.ext != null ? options.ext : vEJS.ext;

		var templates_directory = vEJS.templates_directory || {}; //nice and private container
		vEJS.templates_directory = templates_directory;
		vEJS.get = function( path, cache ) {
			if ( cache == false ){
				return null;
			}
			
			if ( templates_directory[path] ){ 
				return templates_directory[path];
			}
			
			return null;
		};

		vEJS.update = function( path, template ) {
			if ( path == null ) {
				return;
			}
			
			templates_directory[path] = template;
		};

		vEJS.INVALID_PATH = -1;
	};
	vEJS.config({
		cache: true,
		type: '<',
		ext: '.ejs'
	});




	vEJS.Helpers = function( data, extras ) {
		this._data = data;
		this._extras = extras;
		extend(this, extras);
	};
	/* @prototype*/
	vEJS.Helpers.prototype = {
		view: function( options, data, helpers ) {
			if ( !helpers ){
				helpers = this._extras;
			}
			if ( !data ){
				data = this._data;
			}
			
			return new vEJS(options).render(data, helpers);
		},
		to_text: function( input, null_text ) {
			if ( input == null || input === undefined ) {
				return null_text || '';
			}
			
			if ( input instanceof Date ) {
				return input.toDateString();
			}
			
			if ( input.toString ) {
				return input.toString().replace(/\n/g, '<br />').replace(/''/g, "'");
			}
			
			return '';
		}
	};
	vEJS.newRequest = function() {
		var factories = [function() {
			return new ActiveXObject("Msxml2.XMLHTTP");
		}, function() {
			return new XMLHttpRequest();
		}, function() {
			return new ActiveXObject("Microsoft.XMLHTTP");
		}];
		for ( var i = 0; i < factories.length; i++ ) {
			try {
				var request = factories[i]();
				if ( request != null ) {
					return request;
				} 
			}
			catch (e) {
				continue;
			}
		}
	};

	vEJS.request = function( path ) {
		var request = new vEJS.newRequest();
		
		request.open("GET", path, false);

		try {
			request.send(null);
		}
		catch (e) {
			return null;
		}

		if ( request.status == 404 || request.status == 2 || (request.status == 0 && request.responseText == '') ){
			return null;
		} 

		return request.responseText;
	};
	
	vEJS.ajax_request = function( params ) {
		params.method = (params.method ? params.method : 'GET');

		var request = new vEJS.newRequest();
		
		request.onreadystatechange = function() {
			if ( request.readyState == 4 ) {
				if ( request.status == 200 ) {
					params.onComplete(request);
				} else {
					params.onComplete(request);
				}
			}
		};
		
		request.open(params.method, params.url);
		request.send(null);
	};
});