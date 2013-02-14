var inst = require("../index").getInstance();
inst.applyConfig({ debug: true, filter: "debug" });
module.exports = inst.use("editor-para-ie");
