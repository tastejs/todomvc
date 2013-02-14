exports.path = function() {
    return __dirname;
};

exports.YUI = require("./yui-nodejs/yui-nodejs").YUI;

//A little setup needed to make a SS Dom work with our onload event detection
exports.YUI.config.doc = { documentElement: {} };
exports.YUI.Env._ready = exports.YUI.Env.DOMReady = exports.YUI.Env.windowLoaded = true;

var inst,
    getInstance = function() {
        if (!inst) {
            inst = exports.YUI({ useSync: true });
        }
        return inst;
    };

exports.getInstance = getInstance;
exports.use = exports.useSync = function() {
      var inst = getInstance();
      return inst.use.apply(inst, arguments);
};

