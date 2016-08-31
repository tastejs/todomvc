define(['require', './normalize'], function(req, normalize) {
  var cssAPI = {};

  var isWindows = !!process.platform.match(/^win/);

  function compress(css) {
    if (config.optimizeCss == 'none') {
      return css;
    }
    
    if (typeof process !== "undefined" && process.versions && !!process.versions.node && require.nodeRequire) {
      try {
        var csso = require.nodeRequire('csso');
      }
      catch(e) {
        console.log('Compression module not installed. Use "npm install csso -g" to enable.');
        return css;
      }
      var csslen = css.length;
      try {
        css =  csso.justDoIt(css);
      }
      catch(e) {
        console.log('Compression failed due to a CSS syntax error.');
        return css;
      }
      console.log('Compressed CSS output to ' + Math.round(css.length / csslen * 100) + '%.');
      return css;
    }
    console.log('Compression not supported outside of nodejs environments.');
    return css;
  }

  //load file code - stolen from text plugin
  function loadFile(path) {
    if (typeof process !== "undefined" && process.versions && !!process.versions.node && require.nodeRequire) {
      var fs = require.nodeRequire('fs');
      var file = fs.readFileSync(path, 'utf8');
      if (file.indexOf('\uFEFF') === 0)
        return file.substring(1);
      return file;
    }
    else {
      var file = new java.io.File(path),
        lineSeparator = java.lang.System.getProperty("line.separator"),
        input = new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(file), 'utf-8')),
        stringBuffer, line;
      try {
        stringBuffer = new java.lang.StringBuffer();
        line = input.readLine();
        if (line && line.length() && line.charAt(0) === 0xfeff)
          line = line.substring(1);
        stringBuffer.append(line);
        while ((line = input.readLine()) !== null) {
          stringBuffer.append(lineSeparator).append(line);
        }
        return String(stringBuffer.toString());
      }
      finally {
        input.close();
      }
    }
  }


  function saveFile(path, data) {
    if (typeof process !== "undefined" && process.versions && !!process.versions.node && require.nodeRequire) {
      var fs = require.nodeRequire('fs');
      fs.writeFileSync(path, data, 'utf8');
    }
    else {
      var content = new java.lang.String(data);
      var output = new java.io.BufferedWriter(new java.io.OutputStreamWriter(new java.io.FileOutputStream(path), 'utf-8'));

      try {
        output.write(content, 0, content.length());
        output.flush();
      }
      finally {
        output.close();
      }
    }
  }

  //when adding to the link buffer, paths are normalised to the baseUrl
  //when removing from the link buffer, paths are normalised to the output file path
  function escape(content) {
    return content.replace(/(["'\\])/g, '\\$1')
      .replace(/[\f]/g, "\\f")
      .replace(/[\b]/g, "\\b")
      .replace(/[\n]/g, "\\n")
      .replace(/[\t]/g, "\\t")
      .replace(/[\r]/g, "\\r");
  }

  // NB add @media query support for media imports
  var importRegEx = /@import\s*(url)?\s*(('([^']*)'|"([^"]*)")|\(('([^']*)'|"([^"]*)"|([^\)]*))\))\s*;?/g;
  var absUrlRegEx = /^([^\:\/]+:\/)?\//;
  
  // Write Css module definition
  var writeCSSDefinition = "define('@writecss', function() {return function writeCss(c) {var d=document,a='appendChild',i='styleSheet',s=d.createElement('style');s.type='text/css';d.getElementsByTagName('head')[0][a](s);s[i]?s[i].cssText=c:s[a](d.createTextNode(c));};});";

  var siteRoot;

  var baseParts = req.toUrl('base_url').split('/');
  baseParts[baseParts.length - 1] = '';
  var baseUrl = baseParts.join('/');

  var curModule = 0;
  var config;

  var writeCSSForLayer = true;
  var layerBuffer = [];
  var cssBuffer = {};

  cssAPI.load = function(name, req, load, _config) {
    //store config
    config = config || _config;

    if (!siteRoot) {
      siteRoot = path.resolve(config.dir || path.dirname(config.out), config.siteRoot || '.') + '/';
      if (isWindows)
        siteRoot = siteRoot.replace(/\\/g, '/');
    }

    //external URLS don't get added (just like JS requires)
    if (name.match(absUrlRegEx))
      return load();

    var fileUrl = req.toUrl(name + '.css');
    if (isWindows)
      fileUrl = fileUrl.replace(/\\/g, '/');

    // rebase to the output directory if based on the source directory;
    // baseUrl points always to the output directory, fileUrl only if
    // it is not prefixed by a computed path (relative too)
    var fileSiteUrl = fileUrl;
    if (fileSiteUrl.indexOf(baseUrl) < 0) {
      var appRoot = req.toUrl(config.appDir);
      if (isWindows)
        appRoot = appRoot.replace(/\\/g, '/');
      if (fileSiteUrl.indexOf(appRoot) == 0)
        fileSiteUrl = siteRoot + fileSiteUrl.substring(appRoot.length);
    }

    //add to the buffer
    cssBuffer[name] = normalize(loadFile(fileUrl), fileSiteUrl, siteRoot);

    load();
  }

  cssAPI.normalize = function(name, normalize) {
    if (name.substr(name.length - 4, 4) == '.css')
      name = name.substr(0, name.length - 4);
    return normalize(name);
  }

  cssAPI.write = function(pluginName, moduleName, write, parse) {
    var cssModule;
    
    //external URLS don't get added (just like JS requires)
    if (moduleName.match(absUrlRegEx))
      return;

    layerBuffer.push(cssBuffer[moduleName]);
    
    if (!global._requirejsCssData) {
      global._requirejsCssData = {
        usedBy: {css: true},
        css: ''
      }
    } else {
      global._requirejsCssData.usedBy.css = true;
    }

    if (config.buildCSS != false) {
      var style = cssBuffer[moduleName];

      if (config.writeCSSModule && style) {
 	    if (writeCSSForLayer) {
    	  writeCSSForLayer = false;
          write(writeCSSDefinition);
        }

        cssModule = 'define(["@writecss"], function(writeCss){\n writeCss("'+ escape(compress(style)) +'");\n})';
      }
      else {
		cssModule = 'define(function(){})';
      }

      write.asModule(pluginName + '!' + moduleName, cssModule);
    }
  }

  cssAPI.onLayerEnd = function(write, data) {
    if (config.separateCSS && config.IESelectorLimit)
      throw 'RequireCSS: separateCSS option is not compatible with ensuring the IE selector limit';

    if (config.separateCSS) {
      var outPath = data.path.replace(/(\.js)?$/, '.css');
      console.log('Writing CSS! file: ' + outPath + '\n');

      var css = layerBuffer.join('');

      process.nextTick(function() {
        if (global._requirejsCssData) {
          css = global._requirejsCssData.css = css + global._requirejsCssData.css;
          delete global._requirejsCssData.usedBy.css;
          if (Object.keys(global._requirejsCssData.usedBy).length === 0) {
            delete global._requirejsCssData;
          }
        }
        
        saveFile(outPath, compress(css));
      });

    }
    else if (config.buildCSS != false && config.writeCSSModule != true) {
      var styles = config.IESelectorLimit ? layerBuffer : [layerBuffer.join('')];
      for (var i = 0; i < styles.length; i++) {
        if (styles[i] == '')
          return;
        write(
          "(function(c){var d=document,a='appendChild',i='styleSheet',s=d.createElement('style');s.type='text/css';d.getElementsByTagName('head')[0][a](s);s[i]?s[i].cssText=c:s[a](d.createTextNode(c));})\n"
          + "('" + escape(compress(styles[i])) + "');\n"
        );
      }
    }
    //clear layer buffer for next layer
    layerBuffer = [];
    writeCSSForLayer = true;
  }

  return cssAPI;
});
