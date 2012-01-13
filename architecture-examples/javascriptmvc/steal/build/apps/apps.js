steal(function( steal ) {

	// recursively goes through steals and their dependencies.
	var addDependencies = function( steel, files, app ) {
		//add self to files
		if (!files[steel.path] ) {

			var source = readFile(steel.path);
			if ( steel.type && steal.build.types[steel.type] ) {

				source = steal.build.types[steel.type]({
					text: source,
					id: steal.cleanId(steel.path)
				});
				print(" converting " + steel.path + " ");
			} else {
				print(" compressing " + steel.path + " ");

			}
			source = steal.build.builders.scripts.clean(source);
			source = "" + steal.build.compressor(source, true);
			//need to convert to other types.

			files[steel.path] = {
				path: steel.path,
				apps: [],
				dependencies: {},
				size: source.length,
				packaged: false,
				source: source
			}
		}

		var data = files[steel.path];

		data.apps.push(app);
		for ( var d = 0; d < steel.dependencies.length; d++ ) {
			var dependency = steel.dependencies[d];
			if ( dependency.dependencies ) { //this dependency was actually loaded
				data.dependencies[dependency.path] = addDependencies(dependency, files, app);
			}
		}
		return data;
	},
		/**
		 * Adds an order to a directed acyclic graph 
		 * @param {Object} appFiles
		 */
		orderFiles = function( appFiles ) {
			var order = 0

			function visit(f) {
				if ( f.order === undefined ) {
					for ( var name in f.dependencies ) {
						visit(f.dependencies[name])
					}
					f.order = (order++);
				}
			}
			for ( var d = 0; d < appFiles.length; d++ ) {
				visit(appFiles[d])
			}
		},
		getMostShared = function( files ) {
			var shared = []; // count
			for ( var fileName in files ) {
				var file = files[fileName];
				if ( file.packaged ) {
					continue;
				}
				if (!shared[file.apps.length] ) {
					shared[file.apps.length] = {};
				}
				var level = shared[file.apps.length]; //how many apps it is shared in (5?)

				var appsName = file.apps.sort().join();



				if (!level[appsName] ) {
					level[appsName] = {
						totalSize: 0,
						files: [],
						apps: file.apps
					};
				}
				//add file, the count is how many files are shared among this many apps
				level[appsName].files.push(file);
				level[appsName].totalSize += file.size;
			}
			if (!shared.length ) {
				return null;
			}
			//get the most
			var mostShared = shared.pop(),
				mostSize = 0,
				most;
			for ( var apps in mostShared ) {
				if ( mostShared[apps].totalSize > mostSize ) {
					most = mostShared[apps];
					mostSize = most.totalSize;
				}
			}
			//mark files 
			for ( var i = 0; i < most.files.length; i++ ) {
				var f = most.files[i];
				f.packaged = true;
			}
			return most;
		}


		steal.build.apps = function( list, options ) {
			options = steal.opts(options || {}, {
				//compress everything, regardless of what you find
				depth: 1,
				//folder to build to, defaults to the folder the page is in
				to: 1
			});
			// set the compressor globally
			steal.build.compressor = steal.build.builders.scripts.compressors[options.compressor || "localClosure"]();

			//a list of files hashed by their path
			var files = {},

				//keeps track of the packages an app needs
				apps = {},

				//a list of the apps (top most dependencies)
				appFiles = [];

			//set defaults
			options.depth = options.depth || 2;
			options.to = options.to || "packages/"

			//go through, open each app, and make dependency graph
			for ( var i = 0; i < list.length; i++ ) {
				var startFile = list[i] + "/" + steal.File(list[i]).basename() + ".js"

				var opener = steal.build.open('steal/rhino/blank.html', {
					startFile: startFile
				})
				appFiles.push(addDependencies(opener.steal._start, files, list[i]));
				apps[list[i]] = [];

			}

			//add an order so we can sort them nicely
			orderFiles(appFiles);

			// will be set to the biggest group
			var pack,
			//the package number
			packageCount = 0;

			//while there are files left to be packaged, get the most shared and largest package
			while ((pack = getMostShared(files))) {

				print('\njoining shared by ' + pack.apps.join(", "))

				//the source of the package
				var src = [],

					//order the files, most base file first
					ordered = pack.files.sort(function( f1, f2 ) {
						return f1.order - f2.order;
					});

				// paths to files this package represents
				var paths = [];

				//go through files, put in src, and track
				for ( var i = 0; i < ordered.length; i++ ) {
					var f = ordered[i];
					src.push("/* " + f.path + " */\n" + f.source);
					print("  " + f.order + ":" + f.path);
					paths.push(f.path)
				}

				//the final source, includes a steal of all the files in this source
				var source = "steal('//" + paths.join("'\n,'//") + "');\nsteal.end();\n" + src.join(";steal.end();\n"),

					//the path to save
					saveFile = pack.apps.length == 1 ? pack.apps[0] + "/production.js" : "packages/" + packageCount + ".js";

				//if we are the top most, replace production file with the following
				if ( pack.apps.length == 1 ) {
					var packages = apps[pack.apps[0]];
					source = "steal.packs('" + packages.join("','") + "', function(){\n" + source + "\n});"
				}

				//save the file
				print("saving " + saveFile);
				steal.File(saveFile).save(source);

				//add this package to the app's packages list
				for ( var pa = 0; pa < pack.apps.length; pa++ ) {
					apps[pack.apps[pa]].push(packageCount);
				}
				packageCount++;
			}

		}
})