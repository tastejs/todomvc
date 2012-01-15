/**
 * Rhino utilities
 */
(function(){
	//convert readFile and load
	var oldLoad = load,
		oldReadFile = readFile,
		basePath = java.lang.System.getProperty("basepath");
	
	var pathFromRoot = function(path){
		if(!basePath){
			return path;
		}
		
		if (!/^\/\//.test(path) && !/^\w\:\\/.test(path) && !/^http/.test(path) && basePath) {
			path = basePath + "../" + path
		}
		return path;
	}
		
	var oldRunCommand = runCommand;
	/**
	 * @param {Object} cmd something like java bla/here/something.jar -userExtensions something/here.js
	 * @param {Object} transformPath if true, this will take relative paths and add the basePath to it, it will 
	 * also fix the slashes for your OS
	 */
	runCommand = function(shell, shellCmd, cmd){
		var fileRegex = /([^\s]|\/)+\.\w+/g // anything with a slash, no space, and a period
		cmd = cmd.replace(fileRegex, pathFromRoot);
		oldRunCommand(shell, shellCmd, cmd);
	}
		
	load = function( path ) {
		oldLoad(pathFromRoot(path))
	}
	readFile = function( path ) {
		return oldReadFile(pathFromRoot(path))
	}
})();
