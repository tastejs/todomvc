/*istanbul ignore next*/"use strict";

exports.__esModule = true;
exports.transformFileSync = exports.transformFile = exports.transformFromAst = exports.transform = exports.analyse = exports.Pipeline = exports.Plugin = exports.OptionManager = exports.traverse = exports.types = exports.messages = exports.util = exports.version = exports.template = exports.buildExternalHelpers = exports.options = exports.File = undefined;

var /*istanbul ignore next*/_node = require("./node");

/*istanbul ignore next*/Object.defineProperty(exports, "File", {
  enumerable: true,
  get: function get() {
    return _node.File;
  }
});
/*istanbul ignore next*/Object.defineProperty(exports, "options", {
  enumerable: true,
  get: function get() {
    return _node.options;
  }
});
/*istanbul ignore next*/Object.defineProperty(exports, "buildExternalHelpers", {
  enumerable: true,
  get: function get() {
    return _node.buildExternalHelpers;
  }
});
/*istanbul ignore next*/Object.defineProperty(exports, "template", {
  enumerable: true,
  get: function get() {
    return _node.template;
  }
});
/*istanbul ignore next*/Object.defineProperty(exports, "version", {
  enumerable: true,
  get: function get() {
    return _node.version;
  }
});
/*istanbul ignore next*/Object.defineProperty(exports, "util", {
  enumerable: true,
  get: function get() {
    return _node.util;
  }
});
/*istanbul ignore next*/Object.defineProperty(exports, "messages", {
  enumerable: true,
  get: function get() {
    return _node.messages;
  }
});
/*istanbul ignore next*/Object.defineProperty(exports, "types", {
  enumerable: true,
  get: function get() {
    return _node.types;
  }
});
/*istanbul ignore next*/Object.defineProperty(exports, "traverse", {
  enumerable: true,
  get: function get() {
    return _node.traverse;
  }
});
/*istanbul ignore next*/Object.defineProperty(exports, "OptionManager", {
  enumerable: true,
  get: function get() {
    return _node.OptionManager;
  }
});
/*istanbul ignore next*/Object.defineProperty(exports, "Plugin", {
  enumerable: true,
  get: function get() {
    return _node.Plugin;
  }
});
/*istanbul ignore next*/Object.defineProperty(exports, "Pipeline", {
  enumerable: true,
  get: function get() {
    return _node.Pipeline;
  }
});
/*istanbul ignore next*/Object.defineProperty(exports, "analyse", {
  enumerable: true,
  get: function get() {
    return _node.analyse;
  }
});
/*istanbul ignore next*/Object.defineProperty(exports, "transform", {
  enumerable: true,
  get: function get() {
    return _node.transform;
  }
});
/*istanbul ignore next*/Object.defineProperty(exports, "transformFromAst", {
  enumerable: true,
  get: function get() {
    return _node.transformFromAst;
  }
});
/*istanbul ignore next*/Object.defineProperty(exports, "transformFile", {
  enumerable: true,
  get: function get() {
    return _node.transformFile;
  }
});
/*istanbul ignore next*/Object.defineProperty(exports, "transformFileSync", {
  enumerable: true,
  get: function get() {
    return _node.transformFileSync;
  }
});
/*istanbul ignore next*/exports.run = run;
/*istanbul ignore next*/exports.load = load;
function run(code) {
  /*istanbul ignore next*/var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return new Function( /*istanbul ignore next*/(0, _node.transform)(code, opts).code)();
}

function load(url, callback) {
  /*istanbul ignore next*/var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
  /*istanbul ignore next*/var hold = arguments[3];

  opts.filename = opts.filename || url;

  var xhr = global.ActiveXObject ? new global.ActiveXObject("Microsoft.XMLHTTP") : new global.XMLHttpRequest();
  xhr.open("GET", url, true);
  if ("overrideMimeType" in xhr) xhr.overrideMimeType("text/plain");

  xhr.onreadystatechange = function () {
    if (xhr.readyState !== 4) return;

    var status = xhr.status;
    if (status === 0 || status === 200) {
      var param = [xhr.responseText, opts];
      if (!hold) run(param);
      if (callback) callback(param);
    } else {
      throw new Error( /*istanbul ignore next*/"Could not load " + url);
    }
  };

  xhr.send(null);
}

function runScripts() {
  var scripts = [];
  var types = ["text/ecmascript-6", "text/6to5", "text/babel", "module"];
  var index = 0;

  /**
   * Transform and execute script. Ensures correct load order.
   */

  function exec() {
    var param = scripts[index];
    if (param instanceof Array) {
      run(param, index);
      index++;
      exec();
    }
  }

  /**
   * Load, transform, and execute all scripts.
   */

  function run(script, i) {
    var opts = {};

    if (script.src) {
      load(script.src, function (param) {
        scripts[i] = param;
        exec();
      }, opts, true);
    } else {
      opts.filename = "embedded";
      scripts[i] = [script.innerHTML, opts];
    }
  }

  // Collect scripts with Babel `types`.

  var _scripts = global.document.getElementsByTagName("script");

  for (var i = 0; i < _scripts.length; ++i) {
    var _script = _scripts[i];
    if (types.indexOf(_script.type) >= 0) scripts.push(_script);
  }

  for (var _i = 0; _i < scripts.length; _i++) {
    run(scripts[_i], _i);
  }

  exec();
}

/**
 * Register load event to transform and execute scripts.
 */

if (global.addEventListener) {
  global.addEventListener("DOMContentLoaded", runScripts, false);
} else if (global.attachEvent) {
  global.attachEvent("onload", runScripts);
}