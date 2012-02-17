;
(function( steal ) {

	var extend = steal.extend;

	if (!steal.File ) {
		steal.File = function( path ) {
			if ( this.constructor != steal.File ) {
				return new steal.File(path)
			}
			this.path = path;
		}
	}
	var copy = function( jFile1, jFile2 ) {
		var fin = new java.io.FileInputStream(jFile1);
		var fout = new java.io.FileOutputStream(jFile2);

		// Transfer bytes from in to out
		var data = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 1024);
		var len = 0;
		while ((len = fin.read(data)) > 0 ) {
			fout.write(data, 0, len);
		}
		fin.close();
		fout.close();
	}
	var addDir = function( dirObj, out, replacePath ) {
		var files = dirObj.listFiles();
		var tmpBuf = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 1024);

		for ( var i = 0; i < files.length; i++ ) {
			if ( files[i].isDirectory() ) {
				addDir(files[i], out, replacePath);
				continue;
			}
			var inarr = new java.io.FileInputStream(files[i].getAbsolutePath());
			var zipPath = files[i].getPath().replace(replacePath, "").replace("\\", "/")
			if (/\.git|\.zip/.test(zipPath) ) continue;
			print(zipPath)
			out.putNextEntry(new java.util.zip.ZipEntry(zipPath));
			var len;
			while ((len = inarr.read(tmpBuf)) > 0 ) {
				out.write(tmpBuf, 0, len);
			}
			out.closeEntry();
			inarr.close();
		}
	}
	extend(steal.File.prototype, {
		/**
		 * Removes hash and params
		 * @return {String}
		 */
		clean: function() {
			return this.path.match(/([^\?#]*)/)[1];
		},
		/**
		 * Returns everything before the last /
		 */
		dir: function() {
			var last = this.clean().lastIndexOf('/'),
				dir = (last != -1) ? this.clean().substring(0, last) : '',
				parts = dir != '' && dir.match(/^(https?:\/|file:\/)$/);
			return parts && parts[1] ? this.clean() : dir;
		},
		/**
		 * Returns the domain for the current path.
		 * Returns null if the domain is a file.
		 */
		domain: function() {
			if ( this.path.indexOf('file:') == 0 ) return null;
			var http = this.path.match(/^(?:https?:\/\/)([^\/]*)/);
			return http ? http[1] : null;
		},
		protocol: function() {
			return this.path.match(/^(https?:|file:)/)[1]
		},
		/**
		 * Joins url onto path
		 * @param {Object} url
		 */
		join: function( url ) {
			return new steal.File(url).joinFrom(this.path);
		},
		/**
		 * Returns the path of this file referenced form another url.
		 * @codestart
		 * new steal.File('a/b.c').joinFrom('/d/e')//-> /d/e/a/b.c
		 * @codeend
		 * @param {Object} url
		 * @param {Object} expand
		 * @return {String} 
		 */
		joinFrom: function( url, expand ) {
			if ( this.isDomainAbsolute() ) {
				var u = new File(url);
				if ( this.domain() && this.domain() == u.domain() ) return this.afterDomain();
				else if ( this.domain() == u.domain() ) { // we are from a file
					return this.toReferenceFromSameDomain(url);
				} else return this.path;
			} else if ( url == steal.pageDir && !expand ) {
				return this.path;
			} else if ( this.isLocalAbsolute() ) {
				var u = new File(url);
				if (!u.domain() ) return this.path;
				return u.protocol() + "//" + u.domain() + this.path;
			}
			else {

				if ( url == '' ) return this.path.replace(/\/$/, '');
				var urls = url.split('/'),
					paths = this.path.split('/'),
					path = paths[0];
				if ( url.match(/\/$/) ) urls.pop();
				while ( path == '..' && paths.length > 0 ) {
					paths.shift();
					urls.pop();
					path = paths[0];
				}
				return urls.concat(paths).join('/');
			}
		},
		/**
		 * Returns true if the file is relative
		 */
		relative: function() {
			return this.path.match(/^(https?:|file:|\/)/) == null;
		},
		/**
		 * Returns the part of the path that is after the domain part
		 */
		after_domain: function() {
			return this.path.match(/(?:https?:\/\/[^\/]*)(.*)/)[1];
		},
		/**
		 * 
		 * @param {Object} url
		 */
		toReferenceFromSameDomain: function( url ) {
			var parts = this.path.split('/'),
				other_parts = url.split('/'),
				result = '';
			while ( parts.length > 0 && other_parts.length > 0 && parts[0] == other_parts[0] ) {
				parts.shift();
				other_parts.shift();
			}
			for ( var i = 0; i < other_parts.length; i++ ) result += '../';
			return result + parts.join('/');
		},
		/**
		 * Is the file on the same domain as our page.
		 */
		is_cross_domain: function() {
			if ( this.isLocalAbsolute() ) return false;
			return this.domain() != new steal.File(location.href).domain();
		},
		isLocalAbsolute: function() {
			return this.path.indexOf('/') === 0
		},
		isDomainAbsolute: function() {
			return this.path.match(/^(https?:|file:)/) != null
		},
		/**
		 * For a given path, a given working directory, and file location, update the path so 
		 * it points to the right location.
		 */


		mkdir: function() {
			var out = new java.io.File(this.path)
			out.mkdir();
		},
		mkdirs: function() {
			var out = new java.io.File(this.path)
			out.mkdirs();
		},
		exists: function() {
			var exists = (new java.io.File(this.path)).exists();
			return exists;
		},
		copyTo: function( dest, ignore ) {
			var me = new java.io.File(this.path)
			var you = new java.io.File(dest);
			if ( me.isDirectory() ) {
				var children = me.list();
				for ( var i = 0; i < children.length; i++ ) {
					var newMe = new java.io.File(me, children[i]);
					var newYou = new java.io.File(you, children[i]);
					if ( ignore && ignore.indexOf("" + newYou.getName()) != -1 ) {
						continue;
					}
					if ( newMe.isDirectory() ) {
						newYou.mkdir();
						new steal.File(newMe.path).copyTo(newYou.path, ignore)
					} else {
						copy(newMe, newYou)
					}
				}
				return this;
			}
			copy(me, you)
			return this;
		},
		setExecutable: function(){
			var me = new java.io.File(this.path)
			me.setExecutable(true);
			return this;
		},
		save: function( src, encoding ) {
			var fout = new java.io.FileOutputStream(new java.io.File(this.path));

			var out = new java.io.OutputStreamWriter(fout, "UTF-8");
			var s = new java.lang.String(src || "");

			var text = new java.lang.String((s).getBytes(), encoding || "UTF-8");
			out.write(text, 0, text.length());
			out.flush();
			out.close();
		},
		download_from: function( address ) {
			var input =
			new java.io.BufferedInputStream(
			new java.net.URL(address).openStream());

			bout = new java.io.BufferedOutputStream(
			new java.io.FileOutputStream(this.path), 1024);
			var data = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 1024);
			var num_read = 0;
			while ((num_read = input.read(data, 0, 1024)) >= 0 ) {
				bout.write(data, 0, num_read);
			}
			bout.close();
		},
		basename: function() {
			return this.path.match(/\/?([^\/]*)\/?$/)[1];
		},
		remove: function() {
			var file = new java.io.File(this.path);
			file["delete"]();
		},
		removeDir: function() {
			var me = new java.io.File(this.path)
			if ( me.exists() ) {
				var files = me.listFiles();
				for ( var i = 0; i < files.length; i++ ) {
					if ( files[i].isDirectory() ) {
						new steal.File(files[i]).removeDir();
					} else {
						files[i]["delete"]();
					}
				}
			}
			me["delete"]()
		},
		zipDir: function( name, replacePath ) {
			var dirObj = new java.io.File(this.path);
			var out = new java.util.zip.ZipOutputStream(new java.io.FileOutputStream(name));
			addDir(dirObj, out, replacePath);
			out.close();
		},
		contents: function( func, current ) {
			
			var me = new java.io.File(this.path),
				listOfFiles = me.listFiles();
				
			if ( listOfFiles == null ) {
				//print("there is nothing in " + this.path)
				return;
			}
			for ( var i = 0; i < listOfFiles.length; i++ ) {
				func(listOfFiles[i].getName(), listOfFiles[i].isFile() ? "file" : "directory", current)
			}
			return listOfFiles;
		},
		/**
		 * Returns the path to the root jmvc folder
		 */
		pathToRoot: function( isFile ) {
			var root = steal.File.getRoot(),
				rootFolders = root.split(/\/|\\/),
				targetDir = rootFolders[rootFolders.length-1]
				i = 0,
				adjustedPath = (targetDir? this.path.replace(new RegExp(".*"+targetDir+"\/?"),""): 
					this.path),
				myFolders = adjustedPath.split(/\/|\\/);

			//for each .. in loc folders, replace with steal folder
			if ( myFolders[i] == ".." ) {
				while ( myFolders[i] == ".." ) {
					myFolders[i] = rootFolders.pop();
					i++;
				}
			} else {
				for ( i = 0; i < myFolders.length - 1; i++ ) {
					myFolders[i] = ".."
				}
			}
			myFolders.pop();

			if (!isFile ) {
				myFolders.push('..')
			}
			return myFolders.join("/")
		}
	});

	/**
	 * If there's a CMD system variable (like "documentjs/document.bat"), 
	 * assumes the root is the folder one below the scripts folder.
	 * 
	 * Otherwise, assumes the current directory IS the root jmvc folder (framework)
	 * 
	 */
	steal.File.getRoot = function() {
		var cwd = steal.File.cwd(),
			cmd = ""+java.lang.System.getProperty("cmd"),
			root = cwd,
			relativeRoot;
		
		if(cmd) {
			relativeRoot = cmd.replace(/\/?[^\/]*\/[^\/]*$/, "")
			root = cwd+'/'+relativeRoot;
		} 
		return root;
	}
	steal.File.cwdURL = function() {
		return new java.io.File("").toURL().toString();
	}
	steal.File.cwd = function() {
		return String(new java.io.File('').getAbsoluteFile().toString());
	}

})(steal);