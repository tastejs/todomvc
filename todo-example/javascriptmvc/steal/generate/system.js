//gets system info (mostly if windows and where FF is
steal(function( steal ) {

	var get_browser_location = function( browser_name ) {
		var is = java.lang.Runtime.getRuntime().exec(["sh", "-c", "which " + browser_name]).getInputStream(),
			isr = new java.io.InputStreamReader(is),
			br = new java.io.BufferedReader(isr),
			line = br.readLine();

		return line;
	};
	
	// am i non-windows?
	var windows = true,
		firefox_location = "*firefox",
		filesystemPath = new java.io.File(".").getCanonicalPath();

	if ( java.lang.System.getProperty("os.name").indexOf("Windows") === -1 ) {
		windows = false;
		// does current browser config have a path?
		var path = get_browser_location("firefox");
		if ( path ) {
			firefox_location = "*firefox " + path;
		}
	}

	steal.system = {
		windows: windows,
		firefox: firefox_location,
		filesystemPath: filesystemPath
	};
});