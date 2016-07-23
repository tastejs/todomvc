(function() {
	// enyo can use information from the script tag that loads this bootstrap file
	var thisScript = 'enyo.js';

	enyo = window.enyo || {};

	enyo.locateScript = function(inName) {
		var scripts = document.getElementsByTagName('script');
		for (var i=scripts.length-1, s, src, l=inName.length; (i>=0) && (s=scripts[i]); i--) {
			if (!s.located) {
				src = s.getAttribute('src') || '';
				if (src.slice(-l) == inName) {
					s.located = true;
					return {path: src.slice(0, Math.max(0, src.lastIndexOf('/'))), node: s};
				}
			}
		}
	};

	enyo.args = enyo.args || {};

	var tag = enyo.locateScript(thisScript);
	if (tag) {
		// infer the framework path from the document, unless the user has specified one explicitly
		enyo.args.root = (enyo.args.root || tag.path);
		// all attributes of the bootstrap script tag become enyo.args
		for (var i=0, al = tag.node.attributes.length, it; (i < al) && (it = tag.node.attributes.item(i)); i++) {
			enyo.args[it.nodeName] = it.value;
		}
	}

	var root = enyo.args.root;

	var script = function(inSrc) {
		document.write('<scri' + 'pt src="' + root + "/source/boot/" + inSrc + '"></scri' + 'pt>');
	};

	script('ready.js');
	script('../../loader.js');
	script('boot.js');
	script('../package.js');
})();
