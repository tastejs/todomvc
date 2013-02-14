exports.path = function() {   return __dirname;};
var YUI = require("./yui-nodejs/yui-nodejs-debug").YUI;
YUI.applyConfig({ debug: true, filter: "debug" });
exports.YUI = YUI;