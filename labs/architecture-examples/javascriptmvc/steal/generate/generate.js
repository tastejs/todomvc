steal("steal/generate/ejs.js", 'steal/generate/inflector.js', 
	'steal/parse', 'steal/rhino/prompt.js', function( steal ) {

	var render = function( from, to, data ) {
		var text = readFile(from);

		var res = new steal.EJS({
			text: text,
			name: from
		}).render(data);
		var file = steal.File(to);
		//check if we are overwriting
		if ( data.force || !file.exists() || readFile(to) == res || steal.prompt.yesno("Overwrite " + to + "? [Yn]") ) {
			steal.File(to).save(res);
			return true;
		} else {
			return false;
		}

	},

		/**
		 * @plugin steal/generate
		 * @parent stealjs
		 * 
		 * The Generate plugin makes building code generators crazy easy.
		 * StealJS comes with its own app generator.  JavaScriptMVC has more complex generators.
		 * 
		 * ## Steal Generators
		 * 
		 * ### app
		 * 
		 * Creates an application structure, build and clean scripts.
		 * 
		 * @codestart text
		 * js steal/generate/app <i>path/to/app</i> [OPTIONS]
		 * @codeend
		 * 
		 *   - path/to/app - The lowercase path you want your application in. 
		 * 
		 * ## JavaScriptMVC Generators
		 * 
		 * ### app
		 * 
		 * Creates a JavaScriptMVC application structure.
		 * 
		 * @codestart text
		 * js jquery/generate/app <i>path/to/app</i> [OPTIONS]
		 * @codeend
		 * 
		 *   - path/to/app - The lowercase path you want your application 
		 *     in. Keep application names short because they 
		 *     are used as namespaces.  The last part of the path 
		 *     will be taken to be your application's name.
		 * 
		 * ### controller
		 * 
		 * Creates a [jQuery.Controller $.Controller] and test files.
		 * 
		 * @codestart text
		 * js jquery/generate/controller <i>App.Videos</i> [OPTIONS]
		 * @codeend
		 * 
		 *   - App.Videos - The namespaced name of your controller.  For 
		 *     example, if your controller is 
		 *     named <code>Cookbook.Recipes</code>, the generator will 
		 *     create  <code>cookbook/recipes.js</code>. 
		 * 
		 * ### model
		 * 
		 * Creates a [jQuery.Model] and test files.
		 * 
		 * @codestart text
		 * js jquery/generate/model <i>App.Models.Name</i> [TYPE] [OPTIONS]
		 * @codeend
		 * 
		 *   - App.Models.Name - The namespaced name of your 
		 *     model. For example, if your model is 
		 *     named <code>Cookbook.Models.Recipe</code>, the 
		 *     generator will 
		 *     create <code>cookbook/models/recipe.js</code>. 
		 * 
		 * ### page
		 * 
		 * Creates a page that loads steal.js and an application.
		 * 
		 * @codestart text
		 * js jquery/generate/model <i>path/to/app</i> <i>path/to/page.html</i>
		 * @codeend
		 * 
		 *   - path/to/app - The path to your apps folder. 
		 *   - path/to/page.html - The path to the page you want to create. 
		 * 
		 * ### plugin
		 * 
		 * Use plugin to create a file and 
		 * folder structure for basic jQuery plugins.
		 * 
		 * @codestart text
		 * js jquery/generate/plugin <i>path/to/plugin</i> [OPTIONS]
		 * @codeend
		 * 
		 *   - path/to/plugin - The path to where you want 
		 *   your plugin. 
		 *   
		 * 
		 * ### scaffold
		 * 
		 * Creates the controllers, models, and fixtures used
		 * to provide basic CRUD functionality..
		 * 
		 * @codestart text
		 * js jquery/generate/scaffold <i>App.Models.ModelName</i> [OPTIONS]
		 * @codeend
		 * 
		 *   - App.Models.ModelName - The model resource you want to add CRUD functionality to.
		 * 
		 * 
		 * <h2>The Generator Function</h2>
		 * <p>Renders a folders contents with EJS and data and then copies it to another folder.</p>
		 * @codestart
		 * steal.generate(
		 *   "path/to/my_template_folder",
		 *   "render/templates/here", 
		 *   {
		 *     data: "to be used"
		 *   })
		 * @codeend
		 * @param {String} path the folder to get templates from
		 * @param {String} where where to put the results of the rendered templates
		 * @param {Object} data data to render the templates with.  If force is true, it will overwrite everything
		 */
		generate = (steal.generate = function( path, where, data ) {
			//get all files in a folder
			var folder = new steal.File(path);

			//first make sure the folder exists
			new steal.File(where).mkdirs();

			folder.contents(function( name, type, current ) {
				var loc = (current ? current + "/" : "") + name,
					convert = loc.replace(/\(([^\)]+)\)/g, function( replace, inside ) {
						return data[inside];
					});

					if ( type === 'file' ) {
						//if it's ejs, draw it where it belongs
						if (/\.ignore/.test(name) ) {
							//do nothing
						} else if (/\.ejs$/.test(name) ) {
							var put = where + "/" + convert.replace(/\.ejs$/, "");



							if ( render(path + "/" + loc, put, data) ) {
								steal.print('      ' + put);
							}

						} else if (/\.link$/.test(name) ) {
							var copy = readFile(path + "/" + loc);
							//if points to a file, copy that one file; otherwise copy the folder
							steal.generate(copy, where + "/" + convert.replace(/\.link$/, ""), data);

						}
					} else if(!/^\.\w+$/.test(name)){

						//create file
						//steal.print('      ' + where + "/" + convert);
						new steal.File(where + "/" + convert).mkdirs();

						//recurse in new folder
						new steal.File(path + "/" + (current ? current + "/" : "") + name).contents(arguments.callee, (current ? current + "/" : "") + name);
					}
			});
		});
	steal.extend(generate, {
		regexps: {
			colons: /::/,
			words: /([A-Z]+)([A-Z][a-z])/g,
			lowerUpper: /([a-z\d])([A-Z])/g,
			dash: /([a-z\d])([A-Z])/g,
			undHash: /_|-/
		},
		underscore: function( s ) {
			var regs = this.regexps;
			return s.replace(regs.colons, '/')
				.replace(regs.words, '$1_$2')
				.replace(regs.lowerUpper, '$1_$2')
				.replace(regs.dash, '_').toLowerCase();
		},
		//converts a name to a bunch of useful things
		
		/**
		 * @hide
		 * FooBar.ZedTed ->
		 * {
		 *   appName : "foobar",
		 *   className : "ZedTed",
		 *   fullName : "FooBar.ZedTed",
		 *   name : "FooBar.ZedTed",
		 *   path : foo_bar,
		 *   underscore : "zed_ted"
		 * }
		 */
		convert: function( name ) {
			var className = name.match(/[^\.]*$/)[0], //Customer
				appName = name.split(".")[0]; //Customer
			return {
				underscore: generate.underscore(className),
				plugin : generate.underscore(name.replace(/\./g, "_")),
				path: generate.underscore(name).replace(/\./g, "/").replace(/\/[^\/]*$/, ""),
				name: name,
				fullName: name,
				className: className,
				plural: steal.Inflector.pluralize(generate.underscore(className)),
				appName: generate.underscore(appName)
			};
		},
		// creates a class-like name
		toClass : function(name, joiner){
			var upper = function(parts){
				for(var i =0; i < parts.length; i++){
					parts[i] = parts[i].charAt(0).toUpperCase()+parts[i].substr(1)
				}
				return parts
			}
			return upper(name.split('/') ).join(joiner || '.')
		},
		insertCode: function( destination, newCode ){
			// get file, parse it
			var fileTxt = readFile(destination),
				parser =  steal.parse(fileTxt),
				tokens = [],
				lastToken,
				token;

			// parse until function(){
			while (tokens = parser.until(["function", "(", ")"])) {
				if (tokens) {
					parser.partner("{", function(token){
						if (token.value == "}") {
							lastToken = token;
						}
						// print("TOKEN = " + token.value, token.type, token.from, token.to)
					})
				}
			}
			
			
			// insert steal
			if(lastToken){
				fileTxt = fileTxt.slice(0, lastToken.from) 
					+ newCode + "\n" + fileTxt.slice(lastToken.from);
				steal.File(destination).save(fileTxt);
				steal.print('      ' + destination + ' (code added)');
			} else {
				steal.print('      ' + destination + ' (error adding)');
			}
			
			
			// save back to original file destination
			
		},
		/**
		 * Inserts a new steal, like "foo/bar" into a file.  It can handle 4 cases:
		 * 
		 *   1. Page already looks like steal("a", function(){})
		 *   1. Page already looks like steal(function(){})
		 *   1. Page has no steals
		 *   1. Page already looks like steal("a")
		 *   
		 *   It will try to put the new steal before the last function first
		 *   
		 * @param {String} destination a path to the script we're inserting a steal into
		 * @param {String} newStealPath the new steal path to be inserted
		 */
		insertSteal: function( destination, newStealPath, newline ){
			// get file, parse it
			var fileTxt = readFile(destination),
				parser =  steal.parse(fileTxt),
				tokens = [],
				lastToken,
				token,
				duplicate = false,
				cur;

			// parse until steal(
			while (token = parser.until(["steal", "("], [".","then","("])) {
				//print("M = " + token.value, token.type, token.from, token.to)
				if (token) {
					while( (cur = parser.moveNext() ) && ( cur.value === "," || cur.type === "string" ) ) {
			      		//print("TOKEN = " + cur.value, cur.type, cur.from, cur.to);
						//if (cur.type == "name" || cur.type == "string") {
						//	lastToken = cur;
						//}
						if (cur.type === "string" && cur.value === newStealPath) { // duplicate
							duplicate = true;
						}
					}
					lastToken = cur;
					break;
				}
				if (duplicate) {
					throw "DUPLICATE "+newStealPath
				}
			}
			
			
			// insert steal
			if(lastToken){
				//print("TOKEN = " + lastToken.value, lastToken.type, lastToken.from, lastToken.to);
				if(lastToken.value == ")") {
					
					fileTxt = fileTxt.slice(0, lastToken.from) 
						+ ", "+(newline ? "\n\t" : "")+"'" + newStealPath + "'" + fileTxt.slice(lastToken.from)
					
				} else {
					fileTxt = fileTxt.slice(0, lastToken.from) 
					+ "'" + newStealPath + "'," +(newline ? "\n\t" : " ") + fileTxt.slice(lastToken.from)
				}
				
			} else { // no steal found
				fileTxt += "steal('" + newStealPath +"')"
			}
			
			steal.print('      ' + destination + ' (steal added)');
			// save back to original file destination
			steal.File(destination).save(fileTxt);
		},
		render: render
	});

});