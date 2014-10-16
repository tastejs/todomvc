
// enyo.js

(function() {
var e = "enyo.js";
enyo = window.enyo || {}, enyo.locateScript = function(e) {
var t = document.getElementsByTagName("script");
for (var n = t.length - 1, r, i, s = e.length; n >= 0 && (r = t[n]); n--) if (!r.located) {
i = r.getAttribute("src") || "";
if (i.slice(-s) == e) return r.located = !0, {
path: i.slice(0, Math.max(0, i.lastIndexOf("/"))),
node: r
};
}
}, enyo.args = enyo.args || {};
var t = enyo.locateScript(e);
if (t) {
enyo.args.root = (enyo.args.root || t.path).replace("/source", "");
for (var n = 0, r = t.node.attributes.length, i; n < r && (i = t.node.attributes.item(n)); n++) enyo.args[i.nodeName] = i.value;
}
})();

// ready.js

(function(e) {
var t = e.document, n = [], r = "complete" === t.readyState, i, s, o, u, a;
enyo.ready = function(e, t) {
r ? i(e, t) : n.push([ e, t ]);
}, i = function(e, t) {
e.call(t || enyo.global);
}, s = function(e) {
if (r = "interactive" === t.readyState) ~[ "DOMContentLoaded", "readystatechange" ].indexOf(e.type) || (o(e.type, s), a());
if (r = "complete" === t.readyState) o(e.type, s), a();
}, u = function(e, n) {
var r = t.addEventListener ? "addEventListener" : "attachEvent", i = r === "attachEvent" ? "on" : "";
t[r](i + e, n, !1);
}, o = function(e, n) {
var r = t.addEventListener ? "removeEventListener" : "detachEvent", i = r === "detachEvent" ? "on" : "";
t[r](i + e, n, !1);
}, a = function() {
if (r && n.length) while (n.length) i.apply(e, n.shift());
}, u("DOMContentLoaded", s), u("readystatechange", s);
})(window);

// ../../loader.js

(function() {
enyo = window.enyo || {}, enyo.pathResolverFactory = function() {
this.paths = {};
}, enyo.pathResolverFactory.prototype = {
addPath: function(e, t) {
return this.paths[e] = t;
},
addPaths: function(e) {
if (e) for (var t in e) this.addPath(t, e[t]);
},
includeTrailingSlash: function(e) {
return e && e.slice(-1) !== "/" ? e + "/" : e;
},
rewritePattern: /\$([^\/\\]*)(\/)?/g,
rewrite: function(e) {
var t, n = this.includeTrailingSlash, r = this.paths, i = function(e, i) {
return t = !0, n(r[i]) || "";
}, s = e;
do t = !1, s = s.replace(this.rewritePattern, i); while (t);
return s;
}
}, enyo.path = new enyo.pathResolverFactory, enyo.loaderFactory = function(e, t) {
this.machine = e, this.packages = [], this.modules = [], this.sheets = [], this.stack = [], this.pathResolver = t || enyo.path, this.packageName = "", this.packageFolder = "", this.finishCallbacks = {};
}, enyo.loaderFactory.prototype = {
verbose: !1,
loadScript: function(e) {
this.machine.script(e);
},
loadSheet: function(e) {
this.machine.sheet(e);
},
loadPackage: function(e) {
this.machine.script(e);
},
report: function() {},
load: function() {
this.more({
index: 0,
depends: arguments || []
});
},
more: function(e) {
if (e && this.continueBlock(e)) return;
var t = this.stack.pop();
t ? (this.verbose && console.groupEnd("* finish package (" + (t.packageName || "anon") + ")"), this.packageFolder = t.folder, this.packageName = "", this.more(t)) : this.finish();
},
finish: function() {
this.packageFolder = "", this.verbose && console.log("-------------- fini");
for (var e in this.finishCallbacks) this.finishCallbacks[e] && (this.finishCallbacks[e](), this.finishCallbacks[e] = null);
},
continueBlock: function(e) {
while (e.index < e.depends.length) {
var t = e.depends[e.index++];
if (t) if (typeof t == "string") {
if (this.require(t, e)) return !0;
} else this.pathResolver.addPaths(t);
}
},
require: function(e, t) {
var n = this.pathResolver.rewrite(e), r = this.getPathPrefix(e);
n = r + n;
if (n.slice(-4) == ".css" || n.slice(-5) == ".less") this.verbose && console.log("+ stylesheet: [" + r + "][" + e + "]"), this.requireStylesheet(n); else {
if (n.slice(-3) != ".js" || n.slice(-10) == "package.js") return this.requirePackage(n, t), !0;
this.verbose && console.log("+ module: [" + r + "][" + e + "]"), this.requireScript(e, n);
}
},
getPathPrefix: function(e) {
var t = e.slice(0, 1);
return t != "/" && t != "\\" && t != "$" && !/^https?:/i.test(e) ? this.packageFolder : "";
},
requireStylesheet: function(e) {
this.sheets.push(e), this.loadSheet(e);
},
requireScript: function(e, t) {
this.modules.push({
packageName: this.packageName,
rawPath: e,
path: t
}), this.loadScript(t);
},
decodePackagePath: function(e) {
var t = "", n = "", r = "", i = "package.js", s = e.replace(/\\/g, "/").replace(/\/\//g, "/").replace(/:\//, "://").split("/"), o, u;
if (s.length) {
var a = s.pop() || s.pop() || "";
a.slice(-i.length) !== i ? s.push(a) : i = a, r = s.join("/"), r = r ? r + "/" : "", i = r + i;
for (o = s.length - 1; o >= 0; o--) if (s[o] == "source") {
s.splice(o, 1);
break;
}
n = s.join("/");
for (o = s.length - 1; u = s[o]; o--) if (u == "lib" || u == "enyo") {
s = s.slice(o + 1);
break;
}
for (o = s.length - 1; u = s[o]; o--) (u == ".." || u == ".") && s.splice(o, 1);
t = s.join("-");
}
return {
alias: t,
target: n,
folder: r,
manifest: i
};
},
aliasPackage: function(e) {
var t = this.decodePackagePath(e);
this.manifest = t.manifest, t.alias && (this.pathResolver.addPath(t.alias, t.target), this.packageName = t.alias, this.packages.push({
name: t.alias,
folder: t.folder
})), this.packageFolder = t.folder;
},
requirePackage: function(e, t) {
t.folder = this.packageFolder, this.aliasPackage(e), t.packageName = this.packageName, this.stack.push(t), this.report("loading package", this.packageName), this.verbose && console.group("* start package [" + this.packageName + "]"), this.loadPackage(this.manifest);
}
};
})();

// boot.js

enyo.execUnsafeLocalFunction = function(e) {
typeof MSApp == "undefined" ? e() : MSApp.execUnsafeLocalFunction(e);
}, enyo.machine = {
sheet: function(e) {
var t = "text/css", n = "stylesheet", r = e.slice(-5) == ".less";
r && (window.less ? (t = "text/less", n = "stylesheet/less") : e = e.slice(0, e.length - 4) + "css");
var i;
enyo.runtimeLoading || r ? (i = document.createElement("link"), i.href = e, i.media = "screen", i.rel = n, i.type = t, document.getElementsByTagName("head")[0].appendChild(i)) : (i = function() {
document.write('<link href="' + e + '" media="screen" rel="' + n + '" type="' + t + '" />');
}, enyo.execUnsafeLocalFunction(i)), r && window.less && (less.sheets.push(i), enyo.loader.finishCallbacks.lessRefresh || (enyo.loader.finishCallbacks.lessRefresh = function() {
less.refresh(!0);
}));
},
script: function(e, t, n) {
if (!enyo.runtimeLoading) document.write('<script src="' + e + '"' + (t ? ' onload="' + t + '"' : "") + (n ? ' onerror="' + n + '"' : "") + "></scri" + "pt>"); else {
var r = document.createElement("script");
r.src = e, r.onload = t, r.onerror = n, document.getElementsByTagName("head")[0].appendChild(r);
}
},
inject: function(e) {
document.write('<script type="text/javascript">' + e + "</scri" + "pt>");
}
}, enyo.loader = new enyo.loaderFactory(enyo.machine), enyo.depends = function() {
var e = enyo.loader;
if (!e.packageFolder) {
var t = enyo.locateScript("package.js");
t && t.path && (e.aliasPackage(t.path), e.packageFolder = t.path + "/");
}
e.load.apply(e, arguments);
}, function() {
function n(r) {
r && r();
if (t.length) {
var i = t.shift(), s = i[0], o = e.isArray(s) ? s : [ s ], u = i[1];
e.loader.finishCallbacks.runtimeLoader = function(e) {
n(function() {
u && u(e);
});
}, e.loader.packageFolder = "./", e.depends.apply(this, o);
} else e.runtimeLoading = !1, e.loader.packageFolder = "";
}
var e = window.enyo, t = [];
e.load = function(r, i) {
t.push(arguments), e.runtimeLoading || (e.runtimeLoading = !0, n());
};
}(), enyo.path.addPaths({
enyo: enyo.args.root,
lib: "$enyo/../lib"
});

// enyo.js

(function() {
var e = "enyo.js";
enyo = window.enyo || {}, enyo.locateScript = function(e) {
var t = document.getElementsByTagName("script");
for (var n = t.length - 1, r, i, s = e.length; n >= 0 && (r = t[n]); n--) if (!r.located) {
i = r.getAttribute("src") || "";
if (i.slice(-s) == e) return r.located = !0, {
path: i.slice(0, Math.max(0, i.lastIndexOf("/"))),
node: r
};
}
}, enyo.args = enyo.args || {};
var t = enyo.locateScript(e);
if (t) {
enyo.args.root = (enyo.args.root || t.path).replace("/source", "");
for (var n = 0, r = t.node.attributes.length, i; n < r && (i = t.node.attributes.item(n)); n++) enyo.args[i.nodeName] = i.value;
}
})(), function(e) {
var t = e.document, n = [], r = "complete" === t.readyState, i, s, o, u, a;
enyo.ready = function(e, t) {
r ? i(e, t) : n.push([ e, t ]);
}, i = function(e, t) {
e.call(t || enyo.global);
}, s = function(e) {
if (r = "interactive" === t.readyState) ~[ "DOMContentLoaded", "readystatechange" ].indexOf(e.type) || (o(e.type, s), a());
if (r = "complete" === t.readyState) o(e.type, s), a();
}, u = function(e, n) {
var r = t.addEventListener ? "addEventListener" : "attachEvent", i = r === "attachEvent" ? "on" : "";
t[r](i + e, n, !1);
}, o = function(e, n) {
var r = t.addEventListener ? "removeEventListener" : "detachEvent", i = r === "detachEvent" ? "on" : "";
t[r](i + e, n, !1);
}, a = function() {
if (r && n.length) while (n.length) i.apply(e, n.shift());
}, u("DOMContentLoaded", s), u("readystatechange", s);
}(window), function() {
enyo = window.enyo || {}, enyo.pathResolverFactory = function() {
this.paths = {};
}, enyo.pathResolverFactory.prototype = {
addPath: function(e, t) {
return this.paths[e] = t;
},
addPaths: function(e) {
if (e) for (var t in e) this.addPath(t, e[t]);
},
includeTrailingSlash: function(e) {
return e && e.slice(-1) !== "/" ? e + "/" : e;
},
rewritePattern: /\$([^\/\\]*)(\/)?/g,
rewrite: function(e) {
var t, n = this.includeTrailingSlash, r = this.paths, i = function(e, i) {
return t = !0, n(r[i]) || "";
}, s = e;
do t = !1, s = s.replace(this.rewritePattern, i); while (t);
return s;
}
}, enyo.path = new enyo.pathResolverFactory, enyo.loaderFactory = function(e, t) {
this.machine = e, this.packages = [], this.modules = [], this.sheets = [], this.stack = [], this.pathResolver = t || enyo.path, this.packageName = "", this.packageFolder = "", this.finishCallbacks = {};
}, enyo.loaderFactory.prototype = {
verbose: !1,
loadScript: function(e) {
this.machine.script(e);
},
loadSheet: function(e) {
this.machine.sheet(e);
},
loadPackage: function(e) {
this.machine.script(e);
},
report: function() {},
load: function() {
this.more({
index: 0,
depends: arguments || []
});
},
more: function(e) {
if (e && this.continueBlock(e)) return;
var t = this.stack.pop();
t ? (this.verbose && console.groupEnd("* finish package (" + (t.packageName || "anon") + ")"), this.packageFolder = t.folder, this.packageName = "", this.more(t)) : this.finish();
},
finish: function() {
this.packageFolder = "", this.verbose && console.log("-------------- fini");
for (var e in this.finishCallbacks) this.finishCallbacks[e] && (this.finishCallbacks[e](), this.finishCallbacks[e] = null);
},
continueBlock: function(e) {
while (e.index < e.depends.length) {
var t = e.depends[e.index++];
if (t) if (typeof t == "string") {
if (this.require(t, e)) return !0;
} else this.pathResolver.addPaths(t);
}
},
require: function(e, t) {
var n = this.pathResolver.rewrite(e), r = this.getPathPrefix(e);
n = r + n;
if (n.slice(-4) == ".css" || n.slice(-5) == ".less") this.verbose && console.log("+ stylesheet: [" + r + "][" + e + "]"), this.requireStylesheet(n); else {
if (n.slice(-3) != ".js" || n.slice(-10) == "package.js") return this.requirePackage(n, t), !0;
this.verbose && console.log("+ module: [" + r + "][" + e + "]"), this.requireScript(e, n);
}
},
getPathPrefix: function(e) {
var t = e.slice(0, 1);
return t != "/" && t != "\\" && t != "$" && !/^https?:/i.test(e) ? this.packageFolder : "";
},
requireStylesheet: function(e) {
this.sheets.push(e), this.loadSheet(e);
},
requireScript: function(e, t) {
this.modules.push({
packageName: this.packageName,
rawPath: e,
path: t
}), this.loadScript(t);
},
decodePackagePath: function(e) {
var t = "", n = "", r = "", i = "package.js", s = e.replace(/\\/g, "/").replace(/\/\//g, "/").replace(/:\//, "://").split("/"), o, u;
if (s.length) {
var a = s.pop() || s.pop() || "";
a.slice(-i.length) !== i ? s.push(a) : i = a, r = s.join("/"), r = r ? r + "/" : "", i = r + i;
for (o = s.length - 1; o >= 0; o--) if (s[o] == "source") {
s.splice(o, 1);
break;
}
n = s.join("/");
for (o = s.length - 1; u = s[o]; o--) if (u == "lib" || u == "enyo") {
s = s.slice(o + 1);
break;
}
for (o = s.length - 1; u = s[o]; o--) (u == ".." || u == ".") && s.splice(o, 1);
t = s.join("-");
}
return {
alias: t,
target: n,
folder: r,
manifest: i
};
},
aliasPackage: function(e) {
var t = this.decodePackagePath(e);
this.manifest = t.manifest, t.alias && (this.pathResolver.addPath(t.alias, t.target), this.packageName = t.alias, this.packages.push({
name: t.alias,
folder: t.folder
})), this.packageFolder = t.folder;
},
requirePackage: function(e, t) {
t.folder = this.packageFolder, this.aliasPackage(e), t.packageName = this.packageName, this.stack.push(t), this.report("loading package", this.packageName), this.verbose && console.group("* start package [" + this.packageName + "]"), this.loadPackage(this.manifest);
}
};
}(), enyo.execUnsafeLocalFunction = function(e) {
typeof MSApp == "undefined" ? e() : MSApp.execUnsafeLocalFunction(e);
}, enyo.machine = {
sheet: function(e) {
var t = "text/css", n = "stylesheet", r = e.slice(-5) == ".less";
r && (window.less ? (t = "text/less", n = "stylesheet/less") : e = e.slice(0, e.length - 4) + "css");
var i;
enyo.runtimeLoading || r ? (i = document.createElement("link"), i.href = e, i.media = "screen", i.rel = n, i.type = t, document.getElementsByTagName("head")[0].appendChild(i)) : (i = function() {
document.write('<link href="' + e + '" media="screen" rel="' + n + '" type="' + t + '" />');
}, enyo.execUnsafeLocalFunction(i)), r && window.less && (less.sheets.push(i), enyo.loader.finishCallbacks.lessRefresh || (enyo.loader.finishCallbacks.lessRefresh = function() {
less.refresh(!0);
}));
},
script: function(e, t, n) {
if (!enyo.runtimeLoading) document.write('<script src="' + e + '"' + (t ? ' onload="' + t + '"' : "") + (n ? ' onerror="' + n + '"' : "") + "></scri" + "pt>"); else {
var r = document.createElement("script");
r.src = e, r.onload = t, r.onerror = n, document.getElementsByTagName("head")[0].appendChild(r);
}
},
inject: function(e) {
document.write('<script type="text/javascript">' + e + "</scri" + "pt>");
}
}, enyo.loader = new enyo.loaderFactory(enyo.machine), enyo.depends = function() {
var e = enyo.loader;
if (!e.packageFolder) {
var t = enyo.locateScript("package.js");
t && t.path && (e.aliasPackage(t.path), e.packageFolder = t.path + "/");
}
e.load.apply(e, arguments);
}, function() {
function e(r) {
r && r();
if (n.length) {
var i = n.shift(), s = i[0], o = t.isArray(s) ? s : [ s ], u = i[1];
t.loader.finishCallbacks.runtimeLoader = function() {
e(function() {
u && u(s);
});
}, t.loader.packageFolder = "./", t.depends.apply(this, o);
} else t.runtimeLoading = !1, t.loader.packageFolder = "";
}
var t = window.enyo, n = [];
t.load = function(r, i) {
n.push(arguments), t.runtimeLoading || (t.runtimeLoading = !0, e());
};
}(), enyo.path.addPaths({
enyo: enyo.args.root,
lib: "$enyo/../lib"
}), enyo.logging = {
level: 99,
levels: {
log: 20,
warn: 10,
error: 0
},
shouldLog: function(e) {
var t = parseInt(this.levels[e], 0);
return t <= this.level;
},
_log: function(e, t) {
if (typeof console == "undefined") return;
var n = enyo.isArray(t) ? t : enyo.cloneArray(t);
enyo.dumbConsole && (n = [ n.join(" ") ]);
var r = console[e];
r && r.apply ? r.apply(console, n) : console.log.apply ? console.log.apply(console, n) : console.log(n.join(" "));
},
log: function(e, t) {
typeof console != "undefined" && this.shouldLog(e) && this._log(e, t);
}
}, enyo.setLogLevel = function(e) {
var t = parseInt(e, 0);
isFinite(t) && (enyo.logging.level = t);
}, enyo.log = function() {
enyo.logging.log("log", arguments);
}, enyo.warn = function() {
enyo.logging.log("warn", arguments);
}, enyo.error = function() {
enyo.logging.log("error", arguments);
}, function() {
enyo.global = this;
var e = 0;
enyo.ready(function() {
var e = window.performance = window.performance || {};
e.now = e.now || e.mozNow || e.msNow || e.oNow || e.webkitNow || enyo.now, enyo.bench = function() {
return e.now();
};
});
var t = enyo.exists = function(e) {
return undefined !== e;
}, n = enyo.lastIndexOf = function(e, t, n) {
if (t.lastIndexOf) return t.lastIndexOf(e, n || t.length);
var r = "string" == typeof t, i = (r ? t.split("") : t).reverse(), s = i.length - 1, o = t.length, u;
return r && (i = i.join("")), u = enyo.indexOf(e, i, o - (n || o)), r || i.reverse(), -1 === u ? u : s - u;
}, r = function(e) {
var t = 0;
while ("." === e[t]) ++t;
return 0 !== t && (e = e.slice(t)), e;
}, i = function(e) {
return e && "function" == typeof e && !0 === e.isProperty;
}, s = function(e) {
return e && "function" == typeof e && !0 === e.overloaded;
};
enyo.getPath = function(e) {
if (!t(e) || null === e) return undefined;
var n = 0, i, o, u, a, f = "object" == typeof e && e.recursing ? !0 : !1, l = this === enyo && !0 !== f ? window : this;
if ("object" == typeof e) {
if (!e.path || "string" != typeof e.path) return undefined;
e = e.path;
}
e = r(e), n = e.indexOf(".");
if (this._check_hooks && !1 !== (i = this._check_hooks("get", e))) return i;
if (-1 === n) u = "get" + enyo.cap(e), i = s(l[u]) ? l[u].call(this) : l[e]; else {
o = e.substring(0, n), e = e.slice(n + 1);
if ("object" == typeof l[o]) i = enyo.getPath.call(l[o], {
path: e,
recursing: !0
}); else {
if ("function" != typeof l[o] || !l[o].isProperty) return undefined;
i = enyo.getPath.call(enyo.getPath.call(l, o), {
path: e,
recursing: !0
});
}
}
return "function" == typeof i && !0 === i.isProperty ? (a = enyo.toArray(arguments).slice(1), i.apply(this, a)) : i;
};
var o = enyo.proxyMethod = function(e, t) {
return function() {
return e.apply(t, arguments);
};
};
enyo.setPath = function(e, n, s) {
if (!t(e) || "string" != typeof e) return this;
var o = enyo === this ? enyo.global : this, u, a, f, l, c, h = !0 === s ? !0 : !1, p = "function" == typeof s ? s : undefined, d = enyo.getPath.call(o, e);
e = r(e);
if (this._check_hooks && !1 !== (l = this._check_hooks("set", e, n))) return l;
u = e.indexOf(".");
if (-1 === u) a = o[e], !0 === i(a) ? (f = enyo.toArray(arguments).slice(1), a.apply(o, f)) : o[e] = n; else {
c = e.split(".");
while (c.length) {
a = c.shift();
if ("enyo" === a && enyo === o) continue;
0 === c.length ? !0 === i(a) ? (f = enyo.toArray(arguments).slice(1), a.apply(o, f)) : o[a] = n : ("object" != typeof o[a] && (o[a] = {}), o = i(o[a]) ? enyo.getPath.call(o, a) : o[a]);
}
}
return !0 !== h && (p ? h = p(d, n) : h = d !== n), !0 === h && o.notifyObservers && (o.notifyObservers(e, d, n), o.notifyObservers("set:" + e, d, n)), o;
}, enyo.findAndInstance = function(e, n) {
var r, i, s;
return n = t(n) && "function" == typeof n ? n : enyo.nop, s = enyo.getPath.call(this, e), s ? ("string" == typeof s ? (r = enyo.getPath(s), t(r) && "function" != typeof r && (i = r, r = undefined)) : "function" == typeof s ? r = s : i = s, t(r) && !t(i) && (i = new r), t(i) && (this[e] = i), n(r, i)) : n();
};
var u = enyo.uid = function(t) {
return String((t ? t : "") + e++);
};
enyo.irand = function(e) {
return Math.floor(Math.random() * e);
}, enyo.cap = function(e) {
return e.slice(0, 1).toUpperCase() + e.slice(1);
}, enyo.uncap = function(e) {
return e.slice(0, 1).toLowerCase() + e.slice(1);
}, enyo.format = function(e) {
var t = /\%./g, n = 0, r = e, i = arguments, s = function(e) {
return i[++n];
};
return r.replace(t, s);
};
var a = Object.prototype.toString;
enyo.isString = function(e) {
return a.call(e) === "[object String]";
}, enyo.isFunction = function(e) {
return a.call(e) === "[object Function]";
}, enyo.isArray = Array.isArray || function(e) {
return a.call(e) === "[object Array]";
}, enyo.isTrue = function(e) {
return e !== "false" && e !== !1 && e !== 0 && e !== null && e !== undefined;
}, enyo.indexOf = function(e, t, n) {
if (t.indexOf) return t.indexOf(e, n);
if (n) {
n < 0 && (n = 0);
if (n > t.length) return -1;
}
for (var r = n || 0, i = t.length, s; (s = t[r]) || r < i; r++) if (s == e) return r;
return -1;
}, enyo.remove = function(e, t) {
var n = enyo.indexOf(e, t);
n >= 0 && t.splice(n, 1);
}, enyo.forEach = function(e, t, n) {
if (e) {
var r = n || this;
if (enyo.isArray(e) && e.forEach) e.forEach(t, r); else {
var i = Object(e), s = i.length >>> 0;
for (var o = 0; o < s; o++) o in i && t.call(r, i[o], o, i);
}
}
}, enyo.map = function(e, t, n) {
var r = n || this;
if (enyo.isArray(e) && e.map) return e.map(t, r);
var i = [], s = function(e, n, s) {
i.push(t.call(r, e, n, s));
};
return enyo.forEach(e, s, r), i;
};
var f = enyo.merge = function() {
var e = Array.prototype.concat.apply([], arguments);
return c(e);
}, l = enyo.union = function() {
var e = Array.prototype.concat.apply([], arguments), t = [], r = [], i = 0, s = e.length, o;
for (; i < s; ++i) o = e[i], ~t.indexOf(o) || (t.push(o), i === n(o, e) && r.push(o));
return r;
}, c = enyo.unique = l, h = enyo.reduce = f, p = enyo.only = function(e, n) {
var r = {}, i = 0, s, o;
if (!!t(e) && e instanceof Array) {
if (!t(n) || "object" != typeof n) return r;
e = c(e);
for (s = e.length; i < s; ++i) o = e[i], o in n && (r[o] = n[o]);
return r;
}
return r;
}, d = enyo.remap = function(e, t) {
var n = {}, r, i;
for (r in e) i = e[r], r in t && (n[i] = t[r]);
return n;
}, v = enyo.except = function(e, n) {
var r = {}, i, s = 0, o, u;
if (!!t(e) && e instanceof Array) {
if (!t(n) || "object" != typeof n) return r;
i = l(e, y(n));
for (o = i.length; s < o; ++s) {
u = i[s];
if (!(u in n)) continue;
r[u] = n[u];
}
return r;
}
return r;
}, m = enyo.indexBy = function(e, n, r) {
var i = {}, s, o, u = 0;
if (!!t(n) && n instanceof Array) {
if (!t(e) || "string" != typeof e) return i;
var a = enyo.clone(n);
r = t(r) && "function" == typeof r ? r : undefined;
for (o = n.length; u < o; ++u) s = n[u], t(s) && t(s[e]) && (r ? r(e, s, i, a) : i[s[e]] = s);
return i;
}
return i;
}, g = enyo.pluck = function(e, n) {
var r = [], i = 0, s;
if (!t(e) || !t(n)) return r;
if (n instanceof Array) {
if ("string" != typeof e) return r;
for (s = n.length; i < s; ++i) {
if (!t(n[i])) continue;
t(n[i][e]) && r.push(n[i][e]);
}
return r;
}
return r;
};
enyo.filter = function(e, t, n) {
var r = n || this;
if (enyo.isArray(e) && e.filter) return e.filter(t, r);
var i = [], s = function(e, n, s) {
var o = e;
t.call(r, e, n, s) && i.push(o);
};
return enyo.forEach(e, s, r), i;
};
var y = enyo.keys = Object.keys || function(e) {
var t = [], n = Object.prototype.hasOwnProperty;
for (var r in e) n.call(e, r) && t.push(r);
if (!{
toString: null
}.propertyIsEnumerable("toString")) {
var i = [ "toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor" ];
for (var s = 0, o; o = i[s]; s++) n.call(e, o) && t.push(o);
}
return t;
};
enyo.cloneArray = function(e, t, n) {
var r = n || [];
for (var i = t || 0, s = e.length; i < s; i++) r.push(e[i]);
return r;
}, enyo.toArray = enyo.cloneArray, enyo.clone = function(e) {
return enyo.isArray(e) ? enyo.cloneArray(e) : enyo.mixin({}, e);
};
var b = {};
enyo.mixin = function(e, t) {
e = e || {};
if (t) {
var n, r, i;
for (n in t) r = t[n], b[n] !== r && (e[n] = r);
}
return e;
}, enyo.bind = function(e, t) {
t || (t = e, e = null), e = e || enyo.global;
if (enyo.isString(t)) {
if (!e[t]) throw [ 'enyo.bind: scope["', t, '"] is null (scope="', e, '")' ].join("");
t = e[t];
}
if (enyo.isFunction(t)) {
var n = enyo.cloneArray(arguments, 2);
return t.bind ? t.bind.apply(t, [ e ].concat(n)) : function() {
var r = enyo.cloneArray(arguments);
return t.apply(e, n.concat(r));
};
}
throw [ 'enyo.bind: scope["', t, '"] is not a function (scope="', e, '")' ].join("");
}, enyo.asyncMethod = function(e, t) {
return setTimeout(enyo.bind.apply(enyo, arguments), 1);
}, enyo.call = function(e, t, n) {
var r = e || this;
if (t) {
var i = r[t] || t;
if (i && i.apply) return i.apply(r, n || []);
}
}, enyo.now = Date.now || function() {
return (new Date).getTime();
}, enyo.nop = function() {}, enyo.nob = {}, enyo.nar = [], enyo.instance = function() {}, enyo.setPrototype || (enyo.setPrototype = function(e, t) {
e.prototype = t;
}), enyo.delegate = function(e) {
return enyo.setPrototype(enyo.instance, e), new enyo.instance;
}, $L = function(e) {
return e;
};
}(), enyo.job = function(e, t, n) {
enyo.job.stop(e), enyo.job._jobs[e] = setTimeout(function() {
enyo.job.stop(e), t();
}, n);
}, enyo.job.stop = function(e) {
enyo.job._jobs[e] && (clearTimeout(enyo.job._jobs[e]), delete enyo.job._jobs[e]);
}, enyo.job._jobs = {}, enyo.macroize = function(e, t, n) {
var r, i, s = e, o = n || enyo.macroize.pattern, u = function(e, n) {
return r = enyo.getPath.call(t, n), r === undefined || r === null ? "{$" + n + "}" : (i = !0, r);
}, a = 0;
do {
i = !1, s = s.replace(o, u);
if (++a >= 20) throw "enyo.macroize: recursion too deep";
} while (i);
return s;
}, enyo.quickMacroize = function(e, t, n) {
var r, i, s = e, o = n || enyo.macroize.pattern, u = function(e, n) {
return n in t ? r = t[n] : r = enyo.getPath.call(t, n), r === undefined || r === null ? "{$" + n + "}" : r;
};
return s = s.replace(o, u), s;
}, enyo.macroize.pattern = /\{\$([^{}]*)\}/g, enyo.Observer = function(e) {
var t = enyo.toArray(arguments).slice(1);
if (!enyo.exists(e) || "function" != typeof e) throw "enyo.Observer: invalid observer, must have a function";
return e.isObserver = !0, e.events = (e.events ? e.events : []).concat(t), e;
}, enyo.Computed = function(e) {
var t = enyo.toArray(arguments).slice(1);
if (!enyo.exists(e) || "function" != typeof e) throw "enyo.Computed: invalid computed property, must have a function";
return e.isProperty = !0, e.properties = (e.properties ? e.properties : []).concat(t), e;
}, enyo.concat = [ "concat", "bindings", "mixins" ], enyo.handleConcatenatedProperties = function(e, t) {
var n = enyo.merge(e.concat || [], t.concat || []), r, i, s;
while (n.length) r = n.shift(), s = e[r], i = t[r], s instanceof Array && i instanceof Array && (e[r] = enyo.merge(s, i), delete t[r]);
}, enyo.kind = function(e) {
enyo._kindCtors = {};
var t = e.name || "";
delete e.name;
var n = "kind" in e, r = e.kind;
delete e.kind;
var i = enyo.constructorForKind(r), s = i && i.prototype || null;
if (n && r === undefined || i === undefined) {
var o = r === undefined ? "undefined kind" : "unknown kind (" + r + ")";
throw "enyo.kind: Attempt to subclass an " + o + ". Check dependencies for [" + (t || "<unnamed>") + "].";
}
var u = enyo.kind.makeCtor();
return e.hasOwnProperty("constructor") && (e._constructor = e.constructor, delete e.constructor), enyo.setPrototype(u, s ? enyo.delegate(s) : {}), enyo.handleConcatenatedProperties(u.prototype, e), enyo.mixin(u.prototype, e), u.prototype.kindName = t, u.prototype.base = i, u.prototype.ctor = u, enyo.forEach(enyo.kind.features, function(t) {
t(u, e);
}), enyo.setPath(t, u), u;
}, enyo.singleton = function(e, t) {
var n = e.name;
delete e.name;
var r = enyo.kind(e), i;
return enyo.setPath.call(t || enyo.global, n, i = new r), i;
}, enyo.kind.makeCtor = function() {
return function() {
if (!(this instanceof arguments.callee)) throw "enyo.kind: constructor called directly, not using 'new'";
var e;
this._constructor && (e = this._constructor.apply(this, arguments)), this.constructed && this.constructed.apply(this, arguments);
if (e) return e;
};
}, enyo.kind.defaultNamespace = "enyo", enyo.kind.features = [], enyo.kind.features.push(function(e, t) {
var n = e.prototype;
n.inherited || (n.inherited = enyo.kind.inherited);
if (n.base) for (var r in t) {
var i = t[r];
enyo.isFunction(i) && (i._inherited = n.base.prototype[r] || enyo.nop, i.nom = n.kindName + "." + r + "()");
}
}), enyo.kind.inherited = function(e, t) {
var n = e.callee, r = n._inherited;
if (!r || "function" != typeof r) n = n.caller, r = n ? n._inherited : undefined;
if ("function" == typeof r) return r.apply(this, t || e);
}, enyo.kind.features.push(function(e, t) {
enyo.mixin(e, enyo.kind.statics), t.statics && (enyo.mixin(e, t.statics), delete e.prototype.statics);
var n = e.prototype.base;
while (n) n.subclass(e, t), n = n.prototype.base;
}), enyo.kind.statics = {
subclass: function(e, t) {},
extend: function(e) {
enyo.mixin(this.prototype, e);
var t = this;
enyo.forEach(enyo.kind.features, function(n) {
n(t, e);
});
}
}, enyo._kindCtors = {}, enyo.constructorForKind = function(e) {
if (e === null || enyo.isFunction(e)) return e;
if (e) {
var t = enyo._kindCtors[e];
return t ? t : enyo._kindCtors[e] = enyo.Theme[e] || enyo[e] || enyo.getPath.call(enyo, e) || window[e] || enyo.getPath(e);
}
return enyo.defaultCtor;
}, enyo.Theme = {}, enyo.registerTheme = function(e) {
enyo.mixin(enyo.Theme, e);
}, function() {
function e(e, t) {
this.transformer = e, this.binding = t;
}
function t() {
var e = 0, t = arguments.length;
enyo.Binding.bindingCount++;
for (; e < t; ++e) enyo.mixin(this, arguments[e]);
this.id = enyo.uid("binding"), this.setup();
}
enyo.Binding = t, enyo.Transform = e, e.prototype = {
transform: function(e, t) {
var n = this.transformer, r = this.binding, i = r.owner || enyo.global;
return n.call(i, e, t, r);
},
destroy: function() {
this.transformer = null, this.binding = null;
}
};
var n = enyo.Binding.map = {}, r = function(e) {
n[e.id] = e;
}, i = function(e) {
e = e.isBinding ? e.id : e, n[e] && delete n[e];
};
enyo.Binding.bindingCount = 0;
var s = function(e, t) {
var n = e[(t || [])[0]];
if (enyo.exists(n)) return enyo.global === e ? "object" == typeof n ? e : undefined : e;
}, o = enyo.Binding.getParts = function(e, t) {
if (this.debug) debugger;
var n, r = 0, i = {}, o, u, a, f, l, c = this.owner, h = e[0] === "." ? !0 : !1;
e = e[0] === "." ? e.slice(1) : e, n = e.split("."), o = h ? t || c : t || s(enyo.global, n) || c, f = o, i.property = a = n.length > 1 ? n.pop() : e;
if (a === e || !h && t) i.base = f; else {
u = f;
for (; r < n.length; ++r) {
l = n[r];
if (!l) continue;
u = u[l];
if (!u || "string" == typeof u) return l !== a && (i.base = null), i;
}
l !== e && (f = u), i.base = f;
}
return i;
};
enyo.Binding.transform = function(e, t) {
var n = this.transform;
return n(e, t);
}, t.prototype = {
source: null,
target: null,
sourceProperty: null,
targetProperty: null,
sourceResponder: null,
targetResponder: null,
isConnected: !1,
isRefreshing: !1,
sourceConnected: !1,
targetConnected: !1,
to: null,
from: null,
owner: null,
autoConnect: !0,
autoSync: !0,
transform: null,
oneWay: !0,
isBinding: !0,
destroyed: !1,
synchronizing: !1,
setup: function() {
var e = this.debug;
if (!0 === e) debugger;
var t = this.autoConnect, n = this.autoSync, i = this.setupSource(), s = this.setupTarget(), o = this.isRefreshing;
r(this), this.setupTransform();
if (!i || !s) {
o && s && this.setTargetValue(null);
return;
}
try {
(t || o) && this.connect();
} catch (u) {
if ("binding-destroyed" === u) return;
throw u;
}
(n || o) && this.sync();
},
sync: function() {
!0 === this.isConnected && this.syncFromSource();
},
refresh: function() {
this.isRefreshing = !0, this.disconnect(), this.setup(), this.isRefreshing = !1;
},
connect: function() {
if (!0 === this.isConnected) return;
if (!0 === this.destroyed) return;
this.connectSource(), this.connectTarget(), this.sourceConnected && this.targetConnected ? this.isConnected = !0 : this.isConnected = !1;
},
disconnect: function() {
if (!1 === this.isConnected) return;
this.disconnectSource(), this.disconnectTarget(), this.isConnected = !1;
},
setupSource: function() {
var e, t, n = this.sourceProperty, r = this.source, i = this.from;
return r && n ? !0 : i ? (e = o.call(this, i, r), t = e.base, n = e.property, !t || "object" != typeof t ? !1 : (this.source = t, this.sourceProperty = n, !0)) : !1;
},
setupTarget: function() {
var e, t, n = this.targetProperty, r = this.target, i = this.to;
return r && n ? !0 : i ? (e = o.call(this, i, r), t = e.base, n = e.property, !t || "object" != typeof t ? !1 : (this.target = t, this.targetProperty = n, !0)) : !1;
},
stop: function() {
throw "stop-binding";
},
connectSource: function() {
var e = this.source, t = this.sourceProperty, n = this.sourceResponder;
if (e instanceof enyo.Object) {
if (!enyo.exists(n) || "function" != typeof n) n = enyo.bind(this, this.syncFromSource), this.sourceResponder = n;
if (!0 === e.destroyed) throw this.destroy(), "binding-destroyed";
return !0 === this.sourceConnected ? !0 : enyo.exists(e) ? (n.bindingId = this.id, e.addObserver(t, n), this.sourceConnected = !0) : this.sourceConnected = !1;
}
return this.sourceConnected = !1;
},
connectTarget: function() {
var e = this.target, t = this.targetProperty, n = this.targetResponder, r = this.oneWay;
if (e instanceof enyo.Object) {
if (!0 === e.destroyed) throw this.destroy(), "binding-destroyed";
if (!0 === r) return this.targetConnected = !0;
if (!enyo.exists(n) || "function" != typeof n) n = enyo.bind(this, this.syncFromTarget), this.targetResponder = n;
return !0 === this.targetConnected ? !0 : enyo.exists(e) ? (n.bindingId = this.id, e.addObserver(t, n), this.targetConnected = !0) : this.targetConnected = !1;
}
return this.targetConnected = !1;
},
syncFromSource: function() {
var e = !this.oneWay, t = this.getSourceValue(), n = this.transform;
try {
t = n.transform(t, "source");
} catch (r) {
if ("stop-binding" === r) return;
throw r;
}
e && (this.synchronizing = !0, this.disconnectTarget()), this.setTargetValue(t), e && (this.connectTarget(), this.synchronizing = !1);
},
syncFromTarget: function() {
var e = this.getTargetValue(), t = this.transform;
try {
e = t.transform(e, "target");
} catch (n) {
if ("stop-binding" === n) return;
throw n;
}
this.disconnectSource(), this.setSourceValue(e), this.connectSource();
},
disconnectSource: function() {
var e = this.source, t = this.sourceProperty, n = this.sourceResponder;
if (!enyo.exists(e)) return;
e.removeObserver(t, n), this.sourceConnected = !1;
},
disconnectTarget: function() {
var e = this.target, t = this.targetResponder, n = this.targetProperty;
if (!enyo.exists(e)) return;
"function" == typeof t && e.removeObserver(n, t), this.targetConnected = !1;
},
setSourceValue: function(e) {
var t = this.source, n = this.sourceProperty;
t.set(n, e, !0);
},
setTargetValue: function(e) {
var t = this.target, n = this.targetProperty;
t.set(n, e, !0);
},
getSourceValue: function() {
var e = this.source, t = this.sourceProperty;
return e.get(t);
},
getTargetValue: function() {
var e = this.target, t = this.targetProperty;
return e.get(t);
},
setupTransform: function() {
var t = this.transform, n = this.owner || {};
"string" == typeof t ? t = n[t] || enyo.getPath.call(n, t) || enyo.getPath.call(enyo.global, t) : "function" == typeof t && (t = this.transform), "function" != typeof t && (t = this.transform = function(e) {
return e;
}), t instanceof e || (this.transform = new e(t, this));
},
destroy: function() {
if (!0 === this.destroyed) return;
this.destroyed = !0, this.disconnect(), this.source = null, this.target = null, this.sourceResponder = null, this.targetResponder = null, enyo.Binding.bindingCount--, this.transform && (this.transform.destroy(), this.transform = null), this.owner && this.owner.removeBinding(this), i(this);
}
}, t.extend = function(e) {
e = e || {};
var n = function() {
t.apply(this, arguments);
}, r = e.name;
return delete e.name, n.prototype = enyo.mixin(Object.create(t.prototype), e), r && enyo.setPath(r, n), n;
};
}(), enyo.kind({
name: "enyo.Object",
kind: null,
concat: enyo.concat,
mixins: null,
initBindings: !0,
initMixins: !0,
initObservers: !0,
appliedMixins: null,
initComputed: !0,
bindings: null,
observers: null,
computed: null,
defaultBindingKind: "enyo.Binding",
constructor: function() {
enyo._objectCount++, this.setup();
},
constructed: function(e) {
if (e) for (var t in e) {
if (!e.hasOwnProperty(t)) continue;
this[t] = e[t];
}
},
destroyObject: function(e) {
this[e] && this[e].destroy && this[e].destroy(), this[e] = null;
},
log: function() {
var e = arguments.callee.caller, t = ((e ? e.nom : "") || "(instance method)") + ":";
enyo.logging.log("log", [ t ].concat(enyo.cloneArray(arguments)));
},
warn: function() {
this._log("warn", arguments);
},
error: function() {
this._log("error", arguments);
},
_log: function(e, t) {
if (enyo.logging.shouldLog(e)) try {
throw new Error;
} catch (n) {
enyo.logging._log(e, [ t.callee.caller.nom + ": " ].concat(enyo.cloneArray(t))), enyo.log(n.stack);
}
},
findAndInstance: function(e) {
if (!enyo.exists(e)) return;
var t = this[e + "FindAndInstance"];
return t = enyo.exists(t) && "function" == typeof t ? enyo.bind(this, t) : null, enyo.findAndInstance.call(this, e, t);
},
setupMixins: function(e) {
if (!1 === this.initMixins && !e) return;
this.initMixins = !1, this.appliedMixins || (this.appliedMixins = []), enyo.forEach(this.mixins || [], this.prepareMixin, this);
},
prepareMixin: function(e) {
"string" == typeof e && (e = enyo.getPath(e)), e && this.extend(e);
},
setup: function() {
this.setupHooks(), this.setupMixins(), this.setupObservers(), this.setupComputed(), this.setupBindings();
},
setupBindings: function(e) {
if (!1 === this.initBindings && !e) return;
this.initBindings = !1;
if (!0 === this.didSetupBindings) return this.refreshBindings();
var t = this.bindings || [], n = 0, r, i;
this.bindings = [];
for (r = t.length; n < r; ++n) i = t[n], this.binding(i);
this.didSetupBindings = !0, this.notifyObservers("didSetupBindings"), this.removeObserver("didSetupBindings");
},
binding: function() {
var e = arguments, t = 0, n = e.length, r, i = {}, s = this.bindings, o = enyo.getPath(this.defaultBindingKind), u, a;
for (; t < n; ++t) enyo.mixin(i, e[t]);
if (a = i.kind) "string" == typeof a ? u = enyo.getPath(i.kind) : "function" == typeof a && (u = a);
if (!u || "function" != typeof u) u = o;
return r = new u({
owner: this,
autoConnect: !0
}, i), s.push(r), r;
},
clearBindings: function(e) {
var t = enyo.cloneArray(e || this.bindings || []), n;
while (t.length) n = t.shift(), n instanceof enyo.Binding && n.destroy();
},
refreshBindings: function(e) {
var t = enyo.cloneArray(e || this.bindings || []), n;
while (t.length) n = t.shift(), n instanceof enyo.Binding && n.refresh();
},
removeBinding: function(e) {
if (!enyo.exists(e) || !(e instanceof enyo.Binding)) return;
var t = this.bindings || [], n = t.indexOf(e);
!~n || t.splice(n, 1);
},
setupComputed: function(e) {
if (!1 === this.initComputed && !e) return;
this.initComputed = !1;
var t, n, r, i, s, o, u, a = this.computed || (this.computed = {});
for (n in this) {
if (!enyo.exists(t = this[n])) continue;
if ("function" == typeof t && !0 === t.isProperty) {
a[n] = t, s = t.properties || [];
for (r = 0, i = s.length; r < i; ++r) o = s[r], u = enyo.bind(this, function(e) {
this.notifyObservers(e, null, this.get(e), !0);
}, n), this.addObserver(o, u);
}
}
},
setupObservers: function(e) {
if (!1 === this.initObservers && !e) return;
this.initObservers = !1, this.didSetupObservers = !0;
var t, n, r, i, s = this.observers || (this.observers = {}), o, u;
for (t in this) {
if (!enyo.exists(n = this[t])) continue;
if ("function" == typeof n && !0 === n.isObserver) {
o = n.events || [];
if (!o.length) continue;
for (r = 0, i = o.length; r < i; ++r) u = o[r], this.addObserver(u, n, this);
}
}
},
addObserver: function(e, t, n) {
var r = this.observers || (this.observers = {}), i;
return t = n ? enyo.bind(n, t) : t, enyo.exists(r[e]) ? i = r[e] : i = r[e] = [], ~i.indexOf(t) || i.push(t), t;
},
removeObserver: function(e, t) {
var n = this.observers, r, i;
if (!(i = n[e])) return this;
enyo.exists(t) && "function" == typeof t ? (r = i.indexOf(t), !~r || i.splice(r, 1)) : delete n[e];
},
removeAllObservers: function() {
var e = this.observers, t, n, r, i, s;
for (i in e) {
if (!e.hasOwnProperty(i)) continue;
t = e[i], e[i] = null;
for (s = 0, len = t.length; s < len; ++s) n = t[s], n.bindingId && (r = enyo.Binding.map[n.bindingId], r && r instanceof enyo.Binding && r.destroy());
}
return this.observers = {}, this;
},
notifyObservers: function(e, t, n) {
var r = this.observers || {}, i = r[e] || [], s = 0, o, u = enyo.uncap(e) + "Changed";
"*" !== e && (i = enyo.merge(i, r["*"] || []));
if (i) for (; s < i.length; ++s) {
o = i[s];
if (!enyo.exists(o) || "function" != typeof o) continue;
!1 === this.allowNotifications ? this.addNotificationToQueue(e, o, [ e, t, n ]) : o.call(this, e, t, n);
}
enyo.exists(this[u]) && "function" == typeof this[u] && (!1 === this.allowNotifications ? this.addNotificationToQueue(e, this[u], [ t, n ]) : this[u].call(this, t, n));
},
notificationQueue: null,
allowNotifications: !0,
allowNotificationQueue: !0,
addNotificationToQueue: function(e, t, n) {
var r = this.notificationQueue || (this.notificationQueue = {}), i = r[e];
n = n || [];
if (!1 === this.allowNotificationQueue) return;
enyo.exists(i) ? (i[0] !== n && i.splice(0, 1, n), ~i.indexOf(t) || i.push(t)) : r[e] = [ n, t ];
},
stopNotifications: function(e) {
this.allowNotifications = !1, this._stop_count += 1, !0 === e && this.disableNotificationQueue();
},
_stop_count: 0,
startNotifications: function(e) {
0 !== this._stop_count && --this._stop_count, 0 === this._stop_count && (this.allowNotifications = !0, this.flushNotifications()), !0 === e && this.enableNotificationQueue();
},
enableNotificationQueue: function() {
this.allowNotificationQueue = !0;
},
disableNotificationQueue: function() {
this.allowNotificationQueue = !1, this.notificationQueue = {};
},
flushNotifications: function() {
if (0 !== this._stop_count) return;
var e = this.notificationQueue, t, n, r, i;
if (!enyo.exists(e) || !1 === this.allowNotificationQueue) return;
for (n in e) {
if (!e.hasOwnProperty(n)) continue;
r = e[n], i = r.shift(), "function" == typeof i && (r.unshift(i), i = []);
while (r.length) t = r.shift(), t.apply(this, i);
}
},
_get_hooks: null,
_set_hooks: null,
_did_setup_hooks: !1,
setupHooks: function() {
if (!0 === this._did_setup_hooks) return;
this._get_hooks = [], this._set_hooks = [], this._did_setup_hooks = !0;
},
hook: function(e, t, n) {
var r = this["_" + e + "_hooks"];
r.push({
path: t,
method: n
});
},
_check_hooks: function(e, t, n) {
if (!this._did_setup_hooks) return !1;
var r = this["_" + e + "_hooks"], i = 0, s = r.length, o;
for (; i < s; ++i) {
o = r[i];
if ("string" == typeof o.path) {
if (t === o.path) return o.method.call(this, t, n);
} else if ("function" == typeof o.path) {
if (!0 === o.path(t)) return o.method.call(this, t, n);
} else if (o.path instanceof RegExp && o.path.test(t)) return o.method.call(this, t, n);
}
return !1;
},
get: function(e) {
return enyo.getPath.apply(this, arguments);
},
set: function(e, t) {
return enyo.setPath.apply(this, arguments);
},
extend: function() {
var e = enyo.toArray(arguments), t, n, r;
while (e.length && (t = e.shift())) if (t.isMixin || "function" == typeof t) this.extendMixin(t); else for (n in t) {
if (!t.hasOwnProperty(n)) continue;
r = t[n], "string" == typeof r ? this[n] = r : "function" == typeof r && this.extendMethod(n, r, t);
}
},
extendMethod: function(e, t, n) {
var r = this[e], i = !!t.isProperty, s = !!t.isObserver, o;
o = enyo.proxyMethod(t, this);
if (!enyo.exists(r) || "function" != typeof r) r = enyo.nop;
this[e] = o, o._inherited = r, !0 === i ? (o.isProperty = !0, o.properties = t.properties || []) : !0 === s && (o.isObserver = !0, o.events = t.events || []), o.isExtended = !0;
},
extendMixin: function(e) {
enyo.exists(e) && e.apply && e.apply(this);
},
destroy: function() {
this.clearBindings(), this.removeAllObservers(), this.destroyed = !0;
}
}), enyo._objectCount = 0, enyo.Object.subclass = function(e, t) {
this.publish(e, t);
}, enyo.Object.publish = function(e, t) {
var n = t.published;
if (n) {
var r = e.prototype;
for (var i in n) {
if (t[i] && enyo.isFunction(t[i]) && t[i].isProperty) continue;
enyo.Object.addGetterSetter(i, n[i], r);
}
}
}, enyo.Object.addGetterSetter = function(e, t, n) {
var r = "get" + enyo.cap(e), i = "set" + enyo.cap(e), s;
n[e] = t, s = n[r], "function" != typeof s ? (s = n[r] = function() {
return this.get(e);
}, s.overloaded = !1) : !1 !== s.overloaded && (s.overloaded = !0), s = n[i], "function" != typeof s ? (s = n[i] = function() {
return this.set(e, arguments[0]);
}, s.overloaded = !1) : !1 !== s.overloaded && (s.overloaded = !0);
}, enyo.kind({
name: "enyo.Component",
kind: enyo.Object,
published: {
name: "",
id: "",
owner: null
},
statics: {
_kindPrefixi: {},
_unnamedKindNumber: 0
},
defaultKind: "Component",
handlers: {},
initMixins: !1,
initComputed: !1,
toString: function() {
return this.kindName;
},
constructor: function(e) {
this._componentNameMap = {}, this.$ = {}, this.inherited(arguments);
},
constructed: function(e) {
this.importProps(e), this.initMixins = !0, this.setup(), this.create();
},
importProps: function(e) {
if (e) for (var t in e) this[t] = e[t];
this.handlers = enyo.mixin(enyo.clone(this.kindHandlers), this.handlers);
},
create: function() {
this.ownerChanged(), this.initComponents(), this.initComputed = !0, this.setup();
},
initComponents: function() {
this.createChrome(this.kindComponents), this.createClientComponents(this.components);
},
createChrome: function(e) {
this.createComponents(e, {
isChrome: !0
});
},
createClientComponents: function(e) {
this.createComponents(e, {
owner: this.getInstanceOwner()
});
},
getInstanceOwner: function() {
return !this.owner || this.owner.notInstanceOwner ? this : this.owner;
},
destroy: function() {
this.destroyComponents(), this.setOwner(null), this.inherited(arguments);
},
destroyComponents: function() {
enyo.forEach(this.getComponents(), function(e) {
e.destroyed || e.destroy();
});
},
makeId: function() {
var e = "_", t = this.owner && this.owner.getId(), n = this.name || "@@" + ++enyo.Component._unnamedKindNumber;
return (t ? t + e : "") + n;
},
ownerChanged: function(e) {
e && e.removeComponent && e.removeComponent(this), this.owner && this.owner.addComponent && this.owner.addComponent(this), this.id || (this.id = this.makeId());
},
nameComponent: function(e) {
var t = enyo.Component.prefixFromKindName(e.kindName), n, r = this._componentNameMap[t] || 0;
do n = t + (++r > 1 ? String(r) : ""); while (this.$[n]);
return this._componentNameMap[t] = Number(r), e.name = n;
},
addComponent: function(e) {
var t = e.getName();
t || (t = this.nameComponent(e)), this.$[t] && this.warn('Duplicate component name "' + t + '" in owner "' + this.id + '" violates ' + "unique-name-under-owner rule, replacing existing component in the hash and continuing, " + "but this is an error condition and should be fixed."), this.$[t] = e;
},
removeComponent: function(e) {
delete this.$[e.getName()];
},
getComponents: function() {
var e = [];
for (var t in this.$) e.push(this.$[t]);
return e;
},
adjustComponentProps: function(e) {
this.defaultProps && enyo.mixin(e, this.defaultProps), e.kind = e.kind || e.isa || this.defaultKind, e.owner = e.owner || this;
},
_createComponent: function(e, t) {
if (!e.kind && "kind" in e) throw "enyo.create: Attempt to create a null kind. Check dependencies for [" + e.name + "].";
var n = enyo.mixin(enyo.clone(t), e);
return this.adjustComponentProps(n), enyo.Component.create(n);
},
createComponent: function(e, t) {
return this._createComponent(e, t);
},
createComponents: function(e, t) {
if (e) {
var n = [];
for (var r = 0, i; i = e[r]; r++) n.push(this._createComponent(i, t));
return n;
}
},
getBubbleTarget: function() {
return this.owner;
},
bubble: function(e, t, n) {
if (this._silenced) return;
var r = t || {};
return "originator" in r || (r.originator = n || this), this.dispatchBubble(e, r, n);
},
bubbleUp: function(e, t, n) {
if (this._silenced) return;
var r = this.getBubbleTarget();
return r ? r.dispatchBubble(e, t, this) : !1;
},
dispatchEvent: function(e, t, n) {
if (this._silenced) return;
this.decorateEvent(e, t, n);
if (this.handlers && this.handlers[e] && this.dispatch(this.handlers[e], t, n)) return !0;
if (this[e]) return "function" == typeof this[e] ? this.dispatch(e, t, n) : this.dispatchBubble(this[e], t, n);
},
dispatchBubble: function(e, t, n) {
if (this._silenced) return;
return this.dispatchEvent(e, t, n) ? !0 : this.bubbleUp(e, t, n);
},
decorateEvent: function(e, t, n) {},
bubbleDelegation: function(e, t, n, r, i) {
if (this._silenced) return;
var s = this.getBubbleTarget();
if (s) return s.delegateEvent(e, t, n, r, i);
},
delegateEvent: function(e, t, n, r, i) {
if (this._silenced) return;
return this.decorateEvent(n, r, i), e == this ? this.dispatch(t, r, i) : this.bubbleDelegation(e, t, n, r, i);
},
dispatch: function(e, t, n) {
if (this._silenced) return;
var r = e && this[e];
if (r && "function" == typeof r) return r.call(this, n || this, t);
},
waterfall: function(e, t, n) {
if (this._silenced) return;
if (this.dispatchEvent(e, t, n)) return !0;
this.waterfallDown(e, t, n || this);
},
waterfallDown: function(e, t, n) {
if (this._silenced) return;
for (var r in this.$) this.$[r].waterfall(e, t, n);
},
_silenced: !1,
_silence_count: 0,
silence: function() {
this._silenced = !0, this._silence_count += 1;
},
unsilence: function() {
0 !== this._silence_count && --this._silence_count, 0 === this._silence_count && (this._silenced = !1);
}
}), enyo.defaultCtor = enyo.Component, enyo.create = enyo.Component.create = function(e) {
if (!e.kind && "kind" in e) throw "enyo.create: Attempt to create a null kind. Check dependencies for [" + (e.name || "") + "].";
var t = e.kind || e.isa || enyo.defaultCtor, n = enyo.constructorForKind(t);
return n || (enyo.error('no constructor found for kind "' + t + '"'), n = enyo.Component), new n(e);
}, enyo.Component.subclass = function(e, t) {
var n = e.prototype;
t.components && (n.kindComponents = t.components, delete n.components);
if (t.handlers) {
var r = n.kindHandlers;
n.kindHandlers = enyo.mixin(enyo.clone(r), n.handlers), n.handlers = null;
}
t.events && this.publishEvents(e, t);
}, enyo.Component.publishEvents = function(e, t) {
var n = t.events;
if (n) {
var r = e.prototype;
for (var i in n) this.addEvent(i, n[i], r);
}
}, enyo.Component.addEvent = function(e, t, n) {
var r, i;
enyo.isString(t) ? (e.slice(0, 2) != "on" && (enyo.warn("enyo.Component.addEvent: event names must start with 'on'. " + n.kindName + " event '" + e + "' was auto-corrected to 'on" + e + "'."), e = "on" + e), r = t, i = "do" + enyo.cap(e.slice(2))) : (r = t.value, i = t.caller), n[e] = r, n[i] || (n[i] = function(t) {
return this.bubble(e, t);
});
}, enyo.Component.prefixFromKindName = function(e) {
var t = enyo.Component._kindPrefixi[e];
if (!t) {
var n = e.lastIndexOf(".");
t = n >= 0 ? e.slice(n + 1) : e, t = t.charAt(0).toLowerCase() + t.slice(1), enyo.Component._kindPrefixi[e] = t;
}
return t;
}, enyo.kind({
name: "enyo.UiComponent",
kind: enyo.Component,
published: {
container: null,
parent: null,
controlParentName: "client",
layoutKind: ""
},
handlers: {
onresize: "resizeHandler"
},
addBefore: undefined,
statics: {
_resizeFlags: {
showingOnly: !0
}
},
create: function() {
this.controls = [], this.children = [], this.containerChanged(), this.inherited(arguments), this.layoutKindChanged();
},
destroy: function() {
this.destroyClientControls(), this.setContainer(null), this.inherited(arguments);
},
importProps: function(e) {
this.inherited(arguments), this.owner || (this.owner = enyo.master);
},
createComponents: function() {
var e = this.inherited(arguments);
return this.discoverControlParent(), e;
},
discoverControlParent: function() {
this.controlParent = this.$[this.controlParentName] || this.controlParent;
},
adjustComponentProps: function(e) {
e.container = e.container || this, this.inherited(arguments);
},
containerChanged: function(e) {
e && e.removeControl(this), this.container && this.container.addControl(this, this.addBefore);
},
parentChanged: function(e) {
e && e != this.parent && e.removeChild(this);
},
isDescendantOf: function(e) {
var t = this;
while (t && t != e) t = t.parent;
return e && t == e;
},
getControls: function() {
return this.controls;
},
getClientControls: function() {
var e = [];
for (var t = 0, n = this.controls, r; r = n[t]; t++) r.isChrome || e.push(r);
return e;
},
destroyClientControls: function() {
var e = this.getClientControls();
for (var t = 0, n; n = e[t]; t++) n.destroy();
},
addControl: function(e, t) {
this.controls.push(e), this.addChild(e, t);
},
removeControl: function(e) {
return e.setParent(null), enyo.remove(e, this.controls);
},
indexOfControl: function(e) {
return enyo.indexOf(e, this.controls);
},
indexOfClientControl: function(e) {
return enyo.indexOf(e, this.getClientControls());
},
indexInContainer: function() {
return this.container.indexOfControl(this);
},
clientIndexInContainer: function() {
return this.container.indexOfClientControl(this);
},
controlAtIndex: function(e) {
return this.controls[e];
},
addChild: function(e, t) {
if (this.controlParent) this.controlParent.addChild(e); else {
e.setParent(this);
if (t !== undefined) {
var n = t === null ? 0 : this.indexOfChild(t);
this.children.splice(n, 0, e);
} else this.children.push(e);
}
},
removeChild: function(e) {
return enyo.remove(e, this.children);
},
indexOfChild: function(e) {
return enyo.indexOf(e, this.children);
},
layoutKindChanged: function() {
this.layout && this.layout.destroy(), this.layout = enyo.createFromKind(this.layoutKind, this), this.generated && this.render();
},
flow: function() {
this.layout && this.layout.flow();
},
reflow: function() {
this.layout && this.layout.reflow();
},
resized: function() {
this.waterfall("onresize", enyo.UiComponent._resizeFlags), this.waterfall("onpostresize", enyo.UiComponent._resizeFlags);
},
resizeHandler: function() {
this.reflow();
},
waterfallDown: function(e, t, n) {
for (var r in this.$) this.$[r] instanceof enyo.UiComponent || this.$[r].waterfall(e, t, n);
for (var i = 0, s = this.children, o; o = s[i]; i++) (o.showing || !t || !t.showingOnly) && o.waterfall(e, t, n);
},
getBubbleTarget: function() {
return this.parent;
}
}), enyo.createFromKind = function(e, t) {
var n = e && enyo.constructorForKind(e);
if (n) return new n(t);
}, enyo.master = new enyo.Component({
name: "master",
notInstanceOwner: !0,
eventFlags: {
showingOnly: !0
},
getId: function() {
return "";
},
isDescendantOf: enyo.nop,
bubble: function(e, t, n) {
e == "onresize" ? (enyo.master.waterfallDown("onresize", this.eventFlags), enyo.master.waterfallDown("onpostresize", this.eventFlags)) : enyo.Signals.send(e, t);
}
}), enyo.kind({
name: "enyo.Layout",
kind: null,
layoutClass: "",
constructor: function(e) {
this.container = e, e && e.addClass(this.layoutClass);
},
destroy: function() {
this.container && this.container.removeClass(this.layoutClass);
},
flow: function() {},
reflow: function() {}
}), enyo.kind({
name: "enyo.Signals",
kind: enyo.Component,
create: function() {
this.inherited(arguments), enyo.Signals.addListener(this);
},
destroy: function() {
enyo.Signals.removeListener(this), this.inherited(arguments);
},
notify: function(e, t) {
this.dispatchEvent(e, t);
},
statics: {
listeners: [],
addListener: function(e) {
this.listeners.push(e);
},
removeListener: function(e) {
enyo.remove(e, this.listeners);
},
send: function(e, t) {
enyo.forEach(this.listeners, function(n) {
n.notify(e, t);
});
}
}
}), enyo.kind({
name: "enyo.Controller",
kind: "enyo.Component",
mixins: [ "enyo.MultipleDispatchMixin" ],
data: null,
create: function() {
this.inherited(arguments), this.id = this.makeId();
},
ownerChanged: function() {
this.refreshBindings();
},
controllerBubbleTarget: null,
getBubbleTarget: function() {
return this.get("bubbleTarget");
},
bubbleTarget: enyo.Computed(function() {
return this.get("controllerBubbleTarget");
}, "controllerBubbleTarget")
}), function() {
var e = [], t = function(t) {
var n = enyo.cloneArray(e), r;
while (n.length) r = n.shift(), r.hashChanged(t);
}, n = /\:[a-zA-Z0-9]*/g, r = function(e) {
return e[0] === "#" ? e.slice(1) : e;
};
enyo.ready(function() {
enyo.dispatcher.listen(window, "hashchange", t);
}), enyo.kind({
name: "enyo.Router",
kind: "enyo.Controller",
listening: !0,
internalOnly: !1,
staticRoutes: null,
dynamicRoutes: null,
defaultRoute: null,
triggerOnStart: !0,
current: "",
routes: null,
trigger: function(e) {
e ? "string" == typeof e && (e = {
location: e
}) : e = {
location: this.get("current")
};
var n = e.location, r = e.global, i = e.change;
i ? window.location.hash = n : r ? t(n) : this.hashChanged(n);
},
location: enyo.Computed(function(e) {
if (!e) return r(this.get("current"));
e = r(e), this.internalOnly ? this.set("current", e) : window.location.hash = e;
}, "current"),
constructor: function() {
this.staticRoutes = {}, this.dynamicRoutes = [], this.inherited(arguments);
},
create: function() {
this.inherited(arguments), this.setupRoutes(), this.set("current", r(window.location.hash)), e.push(this), this.triggerOnStart && this.trigger();
},
destroy: function() {
var t = e.indexOf(this);
~t || e.splice(t, 1), this.inherited(arguments);
},
hashChanged: function (hash) {
			hash = (function (prop) {
				if ("string" !== typeof hash) {
					// some browsers do not support the newUrl property
					// so we're forced to look at the current hash
					prop = hash.newUrl || window.location.hash;
				}
				return r(prop);
			})(hash || {});
			if (this.listening) {
				this.set("current", hash);
				this.handle(hash);
			}
		},
handle: function(e) {
if (this.handleStatic(e)) return;
this.handleDynamic(e) || this.handleDefault(e);
},
execHandler: function(e, t, n, r) {
var i = t;
return "string" == typeof t && (e ? "string" == typeof e && (e = enyo.getPath(e)) : e = this, i = this[t] || e[t], "function" == typeof i && (r.handler = i, r.context = e)), i && "function" == typeof i ? (i.apply(e, n), !0) : !1;
},
handleStatic: function(e) {
var t = this.staticRoutes, n, r, i;
return (n = t[e]) ? (r = n.handler, i = n.context, this.execHandler(i, r, [ e ], n)) : !1;
},
handleDynamic: function(e) {
var t = this.dynamicRoutes, n, r, i, s, o, u = 0, a = t.length;
for (; u < a; ++u) {
r = t[u], n = r.regex;
if (o = n.exec(e)) return o = o.slice(1), i = r.handler, s = r.context, this.execHandler(s, i, o, r);
}
return !1;
},
handleDefault: function(e) {
var t = this.defaultRoute || {}, n = t.context, r = t.handler;
return this.execHandler(n, r, [ e ], t);
},
setupRoutes: function() {
var e = this.routes, t = 0, n = e.length, r, i;
for (; t < n; ++t) {
r = e[t];
if (!r) continue;
this.addRoute(r);
}
},
addRoute: function(e) {
var t = this.staticRoutes, r = this.dynamicRoutes, i;
!0 === e.default ? this.defaultRoute = e : n.test(e.path) ? (i = new RegExp(e.path.replace(n, "([a-zA-Z0-9]*)")), e.regex = i, r.push(e)) : t[e.path] = e;
}
});
}(), enyo.kind({
name: "enyo.ArrayController",
kind: "enyo.Controller",
length: 0,
data: enyo.Computed(function(e) {
var t = this._modified, n = this._cached, r = this._store, i = 0, s = this.length;
if (!e) {
if (t > n || !r || s !== r.length) {
r = this._store = [];
for (; i < s; ++i) r[i] = this[i];
this._cached = enyo.bench();
}
return r;
}
this.reset(e);
}, "length"),
_modified: null,
_cached: null,
_store: null,
_init_values: null,
push: function() {
var e = arguments, t = this.length, n = e.length + t, r = 0, i = {}, s = this.get("data"), o = this.length;
if (n) {
for (; t < n; ++t, ++r) i[t] = this[t] = e[r];
return this.length = n, this._modified = enyo.bench(), this.notifyObservers("length", o, this.length), this.dispatchBubble("didadd", {
values: i
}, this), this.length;
}
return 0;
},
pop: function() {
if (this.length) {
var e = this.length - 1, t = this[e], n = {};
return delete this[e], this.length = e, n[e] = t, this._modified = enyo.bench(), this.notifyObservers("length", e + 1, e), this.dispatchBubble("didremove", {
values: n
}, this), t;
}
},
shift: function() {
if (this.length) {
var e = this[0], t = 1, n = this.length, r = {};
for (; t < n; ++t) this[t - 1] = this[t];
return delete this[n - 1], this.length = n - 1, r[0] = e, this._modified = enyo.bench(), this.notifyObservers("length", n, this.length), this.dispatchBubble("didremove", {
values: r
}, this), e;
}
},
unshift: function() {
if (arguments.length) {
var e = this.length, t = e - 1, n = arguments.length, r = t + n, i = {};
for (; r >= n; --r, --t) this[r] = this[t];
for (t = 0; t < n; ++t) i[t] = this[t] = arguments[t];
return this.length = e + arguments.length, this._modified = enyo.bench(), this.notifyObservers("length", e, this.length), this.dispatchBubble("didadd", {
values: i
}, this), this.length;
}
},
indexOf: function(e, t) {
return enyo.indexOf(e, this.get("data"), t);
},
lastIndexOf: function(e, t) {
return enyo.lastIndexOf(e, this.get("data"), t);
},
splice: function(e, t) {
var n = enyo.toArray(arguments).slice(2), r = n.length, i = this.length, s = i - 1, o = [], u = {
added: {
len: 0
},
removed: {
len: 0
},
changed: {
len: 0
}
}, a = 0, f, l, c, h, p;
e = e < 0 ? 0 : e >= i ? i : e, t = t && !isNaN(t) && t + e <= i ? t : 0;
if (t) {
c = e + t - r;
for (f = e, l = e + t - 1; f <= l; ++f, ++a) o[a] = this[f], r && r >= t ? (u.changed[f] = this[f], u.changed.len++) : r && r < t && f < c && (u.changed[f] = this[f], u.changed.len++), u.removed[f] = this[f], u.removed.len++;
}
if (r && r > t) {
h = r - t, a = s;
for (; a >= e && a < i; --a) this[a + h] = this[a];
this.length += h;
} else {
h = t - (r ? r : 0), a = e + t;
for (; a < i; ++a) this[a - h] = this[a], u.changed[a - h] = this[a - h], u.changed.len++;
f = this.length -= h;
for (; f < i; ++f) delete this[f];
}
if (r) {
a = 0, f = e, h = t ? t > r ? t - r : r - t : 0;
for (; a < r; ++f, ++a) {
this[f] = n[a], i && f < i && (u.changed[f] = this[f], u.changed.len++);
if (!i || h && a >= h || !t) u.added[i + a - h] = this[i + a - h], u.added.len++;
}
}
return i !== this.length && this.notifyObservers("length", i, this.length), u.removed.len && (delete u.removed.len, this.dispatchBubble("didremove", {
values: u.removed
}, this)), u.added.len && (delete u.added.len, this.dispatchBubble("didadd", {
values: u.added
}, this)), u.changed.len && (delete u.changed.len, this.dispatchBubble("didchange", {
values: u.changed
}, this)), o;
},
join: function(e) {
this.get("data").join(e);
},
map: function(e, t) {
return enyo.map(this.get("data"), e, t);
},
filter: function(e, t) {
return enyo.filter(this.get("data"), e, t);
},
add: function(e, t) {
var e = e.length ? e : [ e ], n = this.length, r = t && !isNaN(t) && t >= 0 && t < n ? t : n, i = [ r, 0 ].concat(e);
this.splice.apply(this, i);
},
remove: function(e, t) {
var n, r, i, s = 0;
if (e instanceof Array) {
n = {
removed: {},
changed: {}
}, r = 0, i = e.length, this.silence(), this.stopNotifications(!0);
for (; r < i; ++r) t = this.indexOf(e[r]), t < s && (s = t), n.removed[r] = e[r], this.remove(e[r], t);
for (r = s, i = this.length; r < i; ++r) n.changed[r] = this[r];
this.unsilence(), this.startNotifications(!0), this.dispatchBubble("didremove", {
values: n.removed
}, this), this.dispatchBubble("didchange", {
values: n.changed
}, this);
} else r = isNaN(t) ? this.indexOf(e) : t, !~r || this.splice(r, 1);
},
reset: function(e) {
this.silence(), this.stopNotifications(!0), e ? this.splice.apply(this, [ 0, this.length ].concat(e)) : this.splice(0, this.length), this.unsilence(), this.startNotifications(!0), this.dispatchBubble("didreset", {
values: this
}, this);
},
swap: function(e, t) {
var n = {}, r = this[e], i = this[t];
n[e] = this[e] = i, n[t] = this[t] = r, this.dispatchBubble("didchange", {
values: n
}, this);
},
move: function(e, t) {
var n, r = this.length, i = r - 1;
e = e < 0 ? 0 : e >= r ? i : e, t = t < 0 ? 0 : t >= r ? i : t;
if (e === t) return;
n = this[e], this.silence(), this.stopNotifications(!0), e === i ? this.pop() : this.splice(e, 1), this.unsilence(), this.startNotifications(!0), this.splice(t, 0, n);
},
contains: function(e) {
return ~enyo.indexOf(this.get("data"), e) ? !0 : !1;
},
at: function(e) {
return this[e];
},
find: function(e, t) {
var n = 0, r = this.length, i;
for (; n < r; ++n) {
i = this.at(n);
if (e.call(t || this, i)) return i;
}
return !1;
},
changed: function(e) {
var t = {}, n = 0, r, i, s, o, u;
if (e) e instanceof Array ? i = e.slice() : i = enyo.keys(e); else {
i = [], r = this.length, o = this.get("data");
for (; n < r; ++n) u = o[n], this.comparator(this[n], u) || (t[n] = this[n], i.push(n));
}
if (!i.length) return;
for (r = i.length; n < r; ++n) s = i[n], t[s] = this[s];
this._modified = enyo.bench(), this.dispatchBubble("didchange", {
values: t
}, this);
},
comparator: function(e, t) {
return e === t;
},
create: function() {
this._cached = this._modified = enyo.bench(), this._store = [], this.inherited(arguments), this._init_values && (this.push.apply(this, this._init_values), this._init_values = null);
},
constructor: function() {
this.inherited(arguments);
if (arguments.length) {
var e = [], t = 0, n = arguments.length;
for (; t < n; ++t) arguments[t] instanceof Array ? e = e.concat(arguments[t]) : e.push(arguments[t]);
this._init_values = e;
}
}
}), function() {
function e(t) {
var n = enyo.mixin(enyo.clone(e.defaults), t), r = enyo.union(e.ignore, enyo.keys(n)), i = t.name;
enyo.setPath(i, this), enyo.mixin(this, n), this.properties = r;
}
enyo.Mixin = function(t) {
return new e(t);
}, e.defaults = {
initMixin: null,
destroyMixin: null,
name: ""
}, e.ignore = [ "initMixin", "destroyMixin", "name" ], e.prototype = {
isMixin: !0,
apply: function(e) {
var t = e.appliedMixins || (e.appliedMixins = []), n;
if (!!~t.indexOf(this)) return;
t.push(this.name), e.extend(this.get("extension")), this.injectDestructor(e), !0 === e.didSetupObservers && e.setupObservers(!0), this.initMixin && (!0 === e.didSetupBindings ? this.initMixin.call(e) : (n = enyo.proxyMethod(this.initMixin, e), e.addObserver("didSetupBindings", n)));
},
get: function() {
return enyo.getPath.apply(this, arguments);
},
extension: enyo.Computed(function() {
var e = {}, t = this.properties;
return enyo.forEach(t, function(t) {
e[t] = this[t], "function" == typeof this[t] && (e[t].nom = this.name + "." + t);
}, this), e;
}),
injectDestructor: function(e) {
var t = e.destroy || enyo.nop, n = this.destroyMixin;
if ("function" != typeof n) return;
n = e.destroy = enyo.proxyMethod(n, e), n._inherited = t;
}
};
}(), enyo.Mixin({
name: "enyo.MultipleDispatchMixin",
dispatchTargets: null,
defaultDispatch: !1,
initMixin: function() {
this.dispatchTargets = [];
},
ownerChanged: function() {
this.inherited(arguments), this.owner && this.owner instanceof enyo.Control && (this.defaultDispatch = !0, this.controllerBubbleTarget = this.owner);
},
addDispatchTarget: function(e) {
var t = this.dispatchTargets;
t.indexOf(e) === -1 && e !== this && t.push(e), this.inherited(arguments);
},
dispatchFrom: function(e, t) {
if (t.dispatchedByController) {
if (t.dispatchController === this) return !0;
} else e === this && (t.dispatchedByController = !0, t.dispatchController = this);
return !1;
},
bubbleUp: function(e, t, n) {
var r;
if (this.defaultDispatch) return this.inherited(arguments);
r = this.get("dispatchTargets"), enyo.forEach(enyo.clone(r), function(r) {
r && (r.destroyed ? this.removeDispatchTarget(r) : r.dispatchBubble(e, t, n));
}, this);
},
dispatch: function(e, t, n) {
return this.inherited(arguments);
},
dispatchEvent: function(e, t, n) {
return this.dispatchFrom(n, t) ? !1 : this.inherited(arguments);
},
bubbleDelegation: function(e, t, n, r, i) {
this.defaultDispatch && this.inherited(arguments);
var s = this.get("dispatchTargets");
enyo.forEach(enyo.clone(s), function(s) {
s && (s.destroyed ? this.removeDispatchTarget(s) : s.delegateEvent(e, t, n, r, i));
});
},
removeDispatchTarget: function(e) {
var t = this.get("dispatchTargets"), n;
n = t.indexOf(e), n !== -1 && t.splice(n, 1);
}
}), enyo.kind({
name: "enyo.ViewController",
kind: "enyo.Controller",
view: null,
renderTarget: "document.body",
constructor: function() {
this.inherited(arguments);
},
create: function() {
var e = this.get("viewKind");
this.view = new e, this.inherited(arguments);
},
render: function() {
var e = this.get("target"), t = this.get("view");
t.renderInto(e);
},
renderInto: function(e) {
this.set("renderTarget", e), this.render();
},
target: enyo.Computed(function() {
var e = this.renderTarget;
"string" == typeof e && ("#" === e[0] ? (e = e.slice(1), e = enyo.dom.byId(e)) : e = enyo.getPath(e), e || (e = enyo.dom.byId(e)));
if (!e) throw "Cannot find requested render target!";
return e;
}, "renderTarget"),
viewKind: enyo.Computed(function() {
var e = this.view;
"string" == typeof e && (e = enyo.getPath(e));
if (!e) throw "Cannot find the requested view!";
return e;
}, "view")
}), function() {
var e = enyo.applications = {}, t = function(t) {
var n = t.kindName, r = e[n] || (e[n] = []);
r.push(t);
}, n = function(t) {
var n = t.kindName, r = e[n] || [], i = r.indexOf(t);
~i || r.splice(i, 1);
}, r = function(e) {
var t, n;
return "string" != typeof e || "" === e ? undefined : (t = e.split("."), 1 === t.length ? undefined : (n = t.shift(), n));
};
enyo.kind({
name: "enyo.Application",
kind: "enyo.ViewController",
autoStart: !0,
renderOnStart: !1,
controllers: null,
instanceName: "",
initBindings: !1,
concat: [ "controllers" ],
constructor: function(e) {
e && enyo.exists(e.name) && (enyo.setPath(e.name, this), this.instanceName = e.name), this.inherited(arguments);
},
create: function() {
this.initComponents(), this.inherited(arguments), !0 === this.autoStart && this.start();
},
initComponents: function() {
this.setupControllers();
},
start: function() {
t(this), this.initBindings = !0, this.setup(), !0 === this.renderOnStart && this.render();
},
setupControllers: function() {
var e = this.controllers, t, n = this.get("namespace"), i = "%..%.";
this.controllers = null, enyo.forEach(e, function(e) {
var s = e.name, o = Boolean(e.global), u, a;
delete e.name, delete e.global, a = r(s), u = enyo.kind(e), enyo.exists(a) ? n !== a && !0 !== o && (s = enyo.format(i, n, s)) : !0 !== o && (s = enyo.format(i, n, s)), t = new u, t.runtimePath = s, enyo.setPath(s, t);
});
},
namespace: enyo.Computed(function() {
return r(this.instanceName || this.kindName);
}),
destroy: function() {
this.inherited(arguments), n(this);
}
});
}(), enyo.kind({
name: "enyo.ObjectController",
kind: "enyo.Controller",
_getting: !1,
_listener: null,
_last: null,
get: function(e) {
var t;
return "data" === e ? this.inherited(arguments) : (!1 === (t = this.getDataProperty(e)) && (t = this.inherited(arguments)), t);
},
set: function(e, t) {
if (!this.setDataProperty(e, t)) return this.inherited(arguments);
},
setDataProperty: function(e, t) {
var n = this.get("data");
return n && this.isAttribute(e) ? (n instanceof enyo.Object || (this.stopNotifications(), this.notifyObservers(e, this.get(e), t)), enyo.setPath.call(n, e, t), this.startNotifications(), !0) : !1;
},
getDataProperty: function(e) {
var t = this.get("data");
return t && this.isAttribute(e) ? enyo.getPath.call(t, e) : !1;
},
isAttribute: function(e) {
var t = this.get("data");
if (t) {
if ("function" == typeof t.isAttribute) return t.isAttribute(e);
if (t.hasOwnProperty(e)) return !0;
}
return !1;
},
releaseData: function(e) {
var e = e || this.get("data");
if (!e || !(e instanceof enyo.Object)) return;
this._listener && e.removeObserver("*", this._listener), this._last = null;
},
sync: function() {
var e = this.observers, t, n, r, i = 0, s, o;
for (n in e) {
r = e[n];
if (!r || !r.length) continue;
for (i = 0, s = r.length; i < s; ++i) {
t = r[i];
if (t.bindingId) {
o = enyo.Binding.map[t.bindingId];
if (!o) continue;
o.sync();
}
}
}
},
initData: function(e) {
var e = e || this.get("data");
if (!e || !(e instanceof enyo.Object)) return;
this._listener = e.addObserver("*", this.notifyObservers, this), this._last = e;
},
create: function() {
this.inherited(arguments), this.dataDidChange();
},
notifyAll: function() {
var e = this.observers, t, n;
for (n in e) {
if (!e.hasOwnProperty(n)) continue;
if (!1 === this.isAttribute(n)) continue;
t = e[n], enyo.forEach(t, function(e) {
"function" == typeof e && e();
}, this);
}
},
dataDidChange: enyo.Observer(function() {
this._last && this.releaseData(this._last), this.initData(), this.notifyAll();
}, "data")
}), enyo.kind({
name: "enyo.Async",
kind: enyo.Object,
published: {
timeout: 0
},
failed: !1,
context: null,
constructor: function() {
this.responders = [], this.errorHandlers = [];
},
accumulate: function(e, t) {
var n = t.length < 2 ? t[0] : enyo.bind(t[0], t[1]);
e.push(n);
},
response: function() {
return this.accumulate(this.responders, arguments), this;
},
error: function() {
return this.accumulate(this.errorHandlers, arguments), this;
},
route: function(e, t) {
var n = enyo.bind(this, "respond");
e.response(function(e, t) {
n(t);
});
var r = enyo.bind(this, "fail");
e.error(function(e, t) {
r(t);
}), e.go(t);
},
handle: function(e, t) {
var n = t.shift();
if (n) if (n instanceof enyo.Async) this.route(n, e); else {
var r = enyo.call(this.context || this, n, [ this, e ]);
r = r !== undefined ? r : e, (this.failed ? this.fail : this.respond).call(this, r);
}
},
startTimer: function() {
this.startTime = enyo.now(), this.timeout && (this.timeoutJob = setTimeout(enyo.bind(this, "timeoutComplete"), this.timeout));
},
endTimer: function() {
this.timeoutJob && (this.endTime = enyo.now(), clearTimeout(this.timeoutJob), this.timeoutJob = null, this.latency = this.endTime - this.startTime);
},
timeoutComplete: function() {
this.timedout = !0, this.fail("timeout");
},
respond: function(e) {
this.failed = !1, this.endTimer(), this.handle(e, this.responders);
},
fail: function(e) {
this.failed = !0, this.endTimer(), this.handle(e, this.errorHandlers);
},
recover: function() {
this.failed = !1;
},
go: function(e) {
return enyo.asyncMethod(this, function() {
this.respond(e);
}), this;
}
}), enyo.json = {
stringify: function(e, t, n) {
return JSON.stringify(e, t, n);
},
parse: function(e, t) {
return e ? JSON.parse(e, t) : null;
}
}, enyo.getCookie = function(e) {
var t = document.cookie.match(new RegExp("(?:^|; )" + e + "=([^;]*)"));
return t ? decodeURIComponent(t[1]) : undefined;
}, enyo.setCookie = function(e, t, n) {
var r = e + "=" + encodeURIComponent(t), i = n || {}, s = i.expires;
if (typeof s == "number") {
var o = new Date;
o.setTime(o.getTime() + s * 24 * 60 * 60 * 1e3), s = o;
}
s && s.toUTCString && (i.expires = s.toUTCString());
var u, a;
for (u in i) r += "; " + u, a = i[u], a !== !0 && (r += "=" + a);
document.cookie = r;
}, enyo.xhr = {
request: function(e) {
var t = this.getXMLHttpRequest(e), n = enyo.path.rewrite(this.simplifyFileURL(e.url)), r = e.method || "GET", i = !e.sync;
e.username ? t.open(r, n, i, e.username, e.password) : t.open(r, n, i), enyo.mixin(t, e.xhrFields), e.callback && this.makeReadyStateHandler(t, e.callback), e.headers = e.headers || {}, r !== "GET" && enyo.platform.ios && enyo.platform.ios >= 6 && e.headers["cache-control"] !== null && (e.headers["cache-control"] = e.headers["cache-control"] || "no-cache");
if (t.setRequestHeader) for (var s in e.headers) e.headers[s] && t.setRequestHeader(s, e.headers[s]);
return typeof t.overrideMimeType == "function" && e.mimeType && t.overrideMimeType(e.mimeType), t.send(e.body || null), !i && e.callback && t.onreadystatechange(t), t;
},
cancel: function(e) {
e.onload && (e.onload = null), e.onreadystatechange && (e.onreadystatechange = null), e.abort && e.abort();
},
makeReadyStateHandler: function(e, t) {
window.XDomainRequest && e instanceof XDomainRequest && (e.onload = function() {
var n;
typeof e.responseText == "string" && (n = e.responseText), t.apply(null, [ n, e ]);
}), e.onreadystatechange = function() {
if (e.readyState == 4) {
var n;
typeof e.responseText == "string" && (n = e.responseText), t.apply(null, [ n, e ]);
}
};
},
inOrigin: function(e) {
var t = document.createElement("a"), n = !1;
t.href = e;
if (t.protocol === ":" || t.protocol === window.location.protocol && t.hostname === window.location.hostname && t.port === (window.location.port || (window.location.protocol === "https:" ? "443" : "80"))) n = !0;
return n;
},
simplifyFileURL: function(e) {
var t = document.createElement("a"), n = !1;
return t.href = e, t.protocol === "file:" || t.protocol === ":" && window.location.protocol === "file:" ? t.protocol + "//" + t.host + t.pathname : e;
},
getXMLHttpRequest: function(e) {
try {
if (enyo.platform.ie < 10 && window.XDomainRequest && !e.headers && !this.inOrigin(e.url) && !/^file:\/\//.test(window.location.href)) return new XDomainRequest;
} catch (t) {}
try {
return new XMLHttpRequest;
} catch (t) {}
return null;
}
}, function(e) {
function t() {
this.fake = !0, this._fields = [], this.boundary = "--------------------------";
for (var e = 0; e < 24; e++) this.boundary += Math.floor(Math.random() * 10).toString(16);
}
function n(e, t) {
this.name = t.name, this.type = t.type || "application/octet-stream";
if (!enyo.isArray(e)) throw new Error("enyo.Blob only handles Arrays of Strings");
if (e.length > 0 && typeof e[0] != "string") throw new Error("enyo.Blob only handles Arrays of Strings");
this._bufs = e;
}
if (e.FormData) try {
var r = new e.FormData, i = new e.Blob;
enyo.FormData = e.FormData, enyo.Blob = e.Blob;
return;
} catch (s) {}
t.prototype.getContentType = function() {
return "multipart/form-data; boundary=" + this.boundary;
}, t.prototype.append = function(e, t, n) {
this._fields.push([ e, t, n ]);
}, t.prototype.toString = function() {
var e = this.boundary, t = "";
return enyo.forEach(this._fields, function(n) {
t += "--" + e + "\r\n";
if (n[2] || n[1].name) {
var r = n[1], i = n[2] || r.name;
t += 'Content-Disposition: form-data; name="' + n[0] + '"; filename="' + i + '"\r\n', t += "Content-Type: " + r.type + "\r\n\r\n", t += r.getAsBinary() + "\r\n";
} else t += 'Content-Disposition: form-data; name="' + n[0] + '";\r\n\r\n', t += n[1] + "\r\n";
}), t += "--" + e + "--", t;
}, enyo.FormData = t, n.prototype.getAsBinary = function() {
var e = "", t = e.concat.apply(e, this._bufs);
return t;
}, enyo.Blob = n;
}(window), enyo.AjaxProperties = {
cacheBust: !0,
url: "",
method: "GET",
handleAs: "json",
contentType: "application/x-www-form-urlencoded",
sync: !1,
headers: null,
postBody: "",
username: "",
password: "",
xhrFields: null,
mimeType: null
}, enyo.kind({
name: "enyo.Ajax",
kind: enyo.Async,
published: enyo.AjaxProperties,
constructor: function(e) {
enyo.mixin(this, e), this.inherited(arguments);
},
go: function(e) {
return this.startTimer(), this.request(e), this;
},
request: function(e) {
var t = this.url.split("?"), n = t.shift() || "", r = t.length ? t.join("?").split("&") : [], i = null;
enyo.isString(e) ? i = e : e && (i = enyo.Ajax.objectToQuery(e)), i && (r.push(i), i = null), this.cacheBust && r.push(Math.random());
var s = r.length ? [ n, r.join("&") ].join("?") : n, o = {}, u;
this.method != "GET" && (u = this.postBody, this.method === "POST" && u instanceof enyo.FormData ? u.fake && (o["Content-Type"] = u.getContentType(), u = u.toString()) : (o["Content-Type"] = this.contentType, u instanceof Object && (this.contentType === "application/json" ? u = JSON.stringify(u) : this.contentType === "application/x-www-form-urlencoded" ? u = enyo.Ajax.objectToQuery(u) : u = u.toString()))), enyo.mixin(o, this.headers), enyo.keys(o).length === 0 && (o = undefined);
try {
this.xhr = enyo.xhr.request({
url: s,
method: this.method,
callback: enyo.bind(this, "receive"),
body: u,
headers: o,
sync: window.PalmSystem ? !1 : this.sync,
username: this.username,
password: this.password,
xhrFields: this.xhrFields,
mimeType: this.mimeType
});
} catch (a) {
this.fail(a);
}
},
receive: function(e, t) {
if (!this.failed && !this.destroyed) {
var n;
typeof t.responseText == "string" ? n = t.responseText : n = t.responseBody, this.xhrResponse = {
status: t.status,
headers: enyo.Ajax.parseResponseHeaders(t),
body: n
}, this.isFailure(t) ? this.fail(t.status) : this.respond(this.xhrToResponse(t));
}
},
fail: function(e) {
this.xhr && (enyo.xhr.cancel(this.xhr), this.xhr = null), this.inherited(arguments);
},
xhrToResponse: function(e) {
if (e) return this[(this.handleAs || "text") + "Handler"](e);
},
isFailure: function(e) {
try {
var t = "";
return typeof e.responseText == "string" && (t = e.responseText), e.status === 0 && t === "" ? !0 : e.status !== 0 && (e.status < 200 || e.status >= 300);
} catch (n) {
return !0;
}
},
xmlHandler: function(e) {
return e.responseXML;
},
textHandler: function(e) {
return e.responseText;
},
jsonHandler: function(e) {
var t = e.responseText;
try {
return t && enyo.json.parse(t);
} catch (n) {
return enyo.warn("Ajax request set to handleAs JSON but data was not in JSON format"), t;
}
},
statics: {
objectToQuery: function(e) {
var t = encodeURIComponent, n = [], r = {};
for (var i in e) {
var s = e[i];
if (s != r[i]) {
var o = t(i) + "=";
if (enyo.isArray(s)) for (var u = 0; u < s.length; u++) n.push(o + t(s[u])); else n.push(o + t(s));
}
}
return n.join("&");
},
parseResponseHeaders: function(e) {
var t = {}, n = [];
e.getAllResponseHeaders && (n = e.getAllResponseHeaders().split(/\r?\n/));
for (var r = 0; r < n.length; r++) {
var i = n[r], s = i.indexOf(": ");
if (s > 0) {
var o = i.substring(0, s).toLowerCase(), u = i.substring(s + 2);
t[o] = u;
}
}
return t;
}
}
}), enyo.kind({
name: "enyo.JsonpRequest",
kind: enyo.Async,
published: {
url: "",
charset: null,
callbackName: "callback",
cacheBust: !0
},
statics: {
nextCallbackID: 0
},
addScriptElement: function() {
var e = document.createElement("script");
e.src = this.src, e.async = "async", this.charset && (e.charset = this.charset), e.onerror = enyo.bind(this, function() {
this.fail(400);
});
var t = document.getElementsByTagName("script")[0];
t.parentNode.insertBefore(e, t), this.scriptTag = e;
},
removeScriptElement: function() {
var e = this.scriptTag;
this.scriptTag = null, e.onerror = null, e.parentNode && e.parentNode.removeChild(e);
},
constructor: function(e) {
enyo.mixin(this, e), this.inherited(arguments);
},
go: function(e) {
return this.startTimer(), this.jsonp(e), this;
},
jsonp: function(e) {
var t = "enyo_jsonp_callback_" + enyo.JsonpRequest.nextCallbackID++;
this.src = this.buildUrl(e, t), this.addScriptElement(), window[t] = enyo.bind(this, this.respond);
var n = enyo.bind(this, function() {
this.removeScriptElement(), window[t] = null;
});
this.response(n), this.error(n);
},
buildUrl: function(e, t) {
var n = this.url.split("?"), r = n.shift() || "", i = n.join("?").split("&"), s = this.bodyArgsFromParams(e, t);
return i.push(s), this.cacheBust && i.push(Math.random()), [ r, i.join("&") ].join("?");
},
bodyArgsFromParams: function(e, t) {
if (enyo.isString(e)) return e.replace("=?", "=" + t);
var n = enyo.mixin({}, e);
return n[this.callbackName] = t, enyo.Ajax.objectToQuery(n);
}
}), enyo.kind({
name: "enyo._AjaxComponent",
kind: enyo.Component,
published: enyo.AjaxProperties
}), enyo.kind({
name: "enyo.WebService",
kind: enyo._AjaxComponent,
published: {
jsonp: !1,
callbackName: "callback",
charset: null,
timeout: 0
},
events: {
onResponse: "",
onError: ""
},
constructor: function(e) {
this.inherited(arguments);
},
send: function(e, t) {
return this.jsonp ? this.sendJsonp(e, t) : this.sendAjax(e, t);
},
sendJsonp: function(e, t) {
var n = new enyo.JsonpRequest;
for (var r in {
url: 1,
callbackName: 1,
charset: 1,
timeout: 1
}) n[r] = this[r];
return enyo.mixin(n, t), this.sendAsync(n, e);
},
sendAjax: function(e, t) {
var n = new enyo.Ajax(t);
for (var r in enyo.AjaxProperties) n[r] = this[r];
return n.timeout = this.timeout, enyo.mixin(n, t), this.sendAsync(n, e);
},
sendAsync: function(e, t) {
return e.go(t).response(this, "response").error(this, "error");
},
response: function(e, t) {
this.doResponse({
ajax: e,
data: t
});
},
error: function(e, t) {
this.doError({
ajax: e,
data: t
});
}
}), enyo.requiresWindow = function(e) {
e();
}, enyo.dom = {
byId: function(e, t) {
return typeof e == "string" ? (t || document).getElementById(e) : e;
},
escape: function(e) {
return e !== null ? String(e).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : "";
},
getBounds: function(e) {
return e ? {
left: e.offsetLeft,
top: e.offsetTop,
width: e.offsetWidth,
height: e.offsetHeight
} : null;
},
getComputedStyle: function(e) {
return window.getComputedStyle && e && window.getComputedStyle(e, null);
},
getComputedStyleValue: function(e, t, n) {
var r = n || this.getComputedStyle(e);
return r ? r.getPropertyValue(t) : null;
},
getFirstElementByTagName: function(e) {
var t = document.getElementsByTagName(e);
return t && t[0];
},
applyBodyFit: function() {
var e = this.getFirstElementByTagName("html");
e && (e.className += " enyo-document-fit");
var t = this.getFirstElementByTagName("body");
t && (t.className += " enyo-body-fit"), enyo.bodyIsFitting = !0;
},
getWindowWidth: function() {
return window.innerWidth ? window.innerWidth : document.body && document.body.offsetWidth ? document.body.offsetWidth : document.compatMode == "CSS1Compat" && document.documentElement && document.documentElement.offsetWidth ? document.documentElement.offsetWidth : 320;
},
getWindowHeight: function() {
return window.innerHeight ? window.innerHeight : document.body && document.body.offsetHeight ? document.body.offsetHeight : document.compatMode == "CSS1Compat" && document.documentElement && document.documentElement.offsetHeight ? document.documentElement.offsetHeight : 480;
},
_ieCssToPixelValue: function(e, t) {
var n = t, r = e.style, i = r.left, s = e.runtimeStyle && e.runtimeStyle.left;
return s && (e.runtimeStyle.left = e.currentStyle.left), r.left = n, n = r.pixelLeft, r.left = i, s && (r.runtimeStyle.left = s), n;
},
_pxMatch: /px/i,
getComputedBoxValue: function(e, t, n, r) {
var i = r || this.getComputedStyle(e);
if (i) return parseInt(i.getPropertyValue(t + "-" + n), 0);
if (e && e.currentStyle) {
var s = e.currentStyle[t + enyo.cap(n)];
return s.match(this._pxMatch) || (s = this._ieCssToPixelValue(e, s)), parseInt(s, 0);
}
return 0;
},
calcBoxExtents: function(e, t) {
var n = this.getComputedStyle(e);
return {
top: this.getComputedBoxValue(e, t, "top", n),
right: this.getComputedBoxValue(e, t, "right", n),
bottom: this.getComputedBoxValue(e, t, "bottom", n),
left: this.getComputedBoxValue(e, t, "left", n)
};
},
calcPaddingExtents: function(e) {
return this.calcBoxExtents(e, "padding");
},
calcMarginExtents: function(e) {
return this.calcBoxExtents(e, "margin");
},
calcNodePosition: function(e, t) {
var n = 0, r = 0, i = e, s = i.offsetWidth, o = i.offsetHeight, u = enyo.dom.getStyleTransformProp(), a = /translateX\((-?\d+)px\)/i, f = /translateY\((-?\d+)px\)/i, l = 0, c = 0, h = 0, p = 0;
t ? (h = t.offsetHeight, p = t.offsetWidth) : (h = document.body.parentNode.offsetHeight > this.getWindowHeight() ? this.getWindowHeight() - document.body.parentNode.scrollTop : document.body.parentNode.offsetHeight, p = document.body.parentNode.offsetWidth > this.getWindowWidth() ? this.getWindowWidth() - document.body.parentNode.scrollLeft : document.body.parentNode.offsetWidth);
if (i.offsetParent) do r += i.offsetLeft - (i.offsetParent ? i.offsetParent.scrollLeft : 0), u && a.test(i.style[u]) && (r += parseInt(i.style[u].replace(a, "$1"), 10)), n += i.offsetTop - (i.offsetParent ? i.offsetParent.scrollTop : 0), u && f.test(i.style[u]) && (n += parseInt(i.style[u].replace(f, "$1"), 10)), i !== e && (i.currentStyle ? (l = parseInt(i.currentStyle.borderLeftWidth, 10), c = parseInt(i.currentStyle.borderTopWidth, 10)) : window.getComputedStyle ? (l = parseInt(window.getComputedStyle(i, "").getPropertyValue("border-left-width"), 10), c = parseInt(window.getComputedStyle(i, "").getPropertyValue("border-top-width"), 10)) : (l = parseInt(i.style.borderLeftWidth, 10), c = parseInt(i.style.borderTopWidth, 10)), l && (r += l), c && (n += c)); while ((i = i.offsetParent) && i !== t);
return {
top: n,
left: r,
bottom: h - n - o,
right: p - r - s,
height: o,
width: s
};
},
setInnerHtml: function(e, t) {
enyo.execUnsafeLocalFunction(function() {
e.innerHTML = t;
});
}
}, function() {
enyo.dom.calcCanAccelerate = function() {
if (enyo.platform.android <= 2) return !1;
var e = [ "perspective", "WebkitPerspective", "MozPerspective", "msPerspective", "OPerspective" ];
for (var t = 0, n; n = e[t]; t++) if (typeof document.body.style[n] != "undefined") return !0;
return !1;
};
var e = [ "transform", "-webkit-transform", "-moz-transform", "-ms-transform", "-o-transform" ], t = [ "transform", "webkitTransform", "MozTransform", "msTransform", "OTransform" ];
enyo.dom.getCssTransformProp = function() {
if (this._cssTransformProp) return this._cssTransformProp;
var n = enyo.indexOf(this.getStyleTransformProp(), t);
return this._cssTransformProp = e[n];
}, enyo.dom.getStyleTransformProp = function() {
if (this._styleTransformProp || !document.body) return this._styleTransformProp;
for (var e = 0, n; n = t[e]; e++) if (typeof document.body.style[n] != "undefined") return this._styleTransformProp = n;
}, enyo.dom.domTransformsToCss = function(e) {
var t, n, r = "";
for (t in e) n = e[t], n !== null && n !== undefined && n !== "" && (r += t + "(" + n + ") ");
return r;
}, enyo.dom.transformsToDom = function(e) {
var t = this.domTransformsToCss(e.domTransforms), n = e.hasNode() ? e.node.style : null, r = e.domStyles, i = this.getStyleTransformProp(), s = this.getCssTransformProp();
i && s && (r[s] = t, n ? n[i] = t : e.domStylesChanged());
}, enyo.dom.canTransform = function() {
return Boolean(this.getStyleTransformProp());
}, enyo.dom.canAccelerate = function() {
return this.accelerando !== undefined ? this.accelerando : document.body && (this.accelerando = this.calcCanAccelerate());
}, enyo.dom.transform = function(e, t) {
var n = e.domTransforms = e.domTransforms || {};
enyo.mixin(n, t), this.transformsToDom(e);
}, enyo.dom.transformValue = function(e, t, n) {
var r = e.domTransforms = e.domTransforms || {};
r[t] = n, this.transformsToDom(e);
}, enyo.dom.accelerate = function(e, t) {
var n = t == "auto" ? this.canAccelerate() : t;
this.transformValue(e, "translateZ", n ? 0 : null);
};
}(), enyo.kind({
name: "enyo.Control",
kind: enyo.UiComponent,
published: {
tag: "div",
attributes: null,
classes: "",
style: "",
content: "",
showing: !0,
allowHtml: !1,
src: "",
canGenerate: !0,
fit: null,
isContainer: !1,
controller: null
},
handlers: {
ontap: "tap"
},
defaultKind: "Control",
controlClasses: "",
node: null,
generated: !1,
initBindings: !1,
create: function() {
this.silence(), this.initStyles(), this.inherited(arguments), this.showingChanged(), this.addClass(this.kindClasses), this.addClass(this.classes), this.initProps([ "id", "content", "src", "controller" ]), this.initBindings = !0, this.setup(), this.unsilence();
},
destroy: function() {
this.controller && (this.controller.owner && this === this.controller.owner && this.controller.destroy(), this.controller = null), this.removeNodeFromDom(), enyo.Control.unregisterDomEvents(this.id), this.inherited(arguments);
},
importProps: function(e) {
this.inherited(arguments), this.attributes = enyo.mixin(enyo.clone(this.kindAttributes), this.attributes);
},
initProps: function(e) {
for (var t = 0, n, r; n = e[t]; t++) this[n] && (r = n + "Changed", this[r] && this[r]());
},
controllerChanged: function() {
this.findAndInstance("controller");
},
controllerFindAndInstance: function(e, t) {
if (!e && !t) return;
e ? t.set("owner", this) : t.addDispatchTarget(this), this.refreshBindings();
},
dispatchEvent: function(e, t, n) {
return this.controller && this.controller.dispatchEvent(e, t, n) ? !0 : this.strictlyInternalEvents[e] && this.isInternalEvent(t) ? !0 : this.inherited(arguments);
},
dispatch: function(e, t, n) {
var r = this.controller;
return r && r[e] && enyo.isFunction(r[e]) ? r[e].call(r, n || this, t) : this.inherited(arguments);
},
classesChanged: function(e) {
this.removeClass(e), this.addClass(this.classes);
},
addChild: function(e) {
e.addClass(this.controlClasses), this.inherited(arguments);
},
removeChild: function(e) {
this.inherited(arguments), e.removeClass(this.controlClasses);
},
strictlyInternalEvents: {
onenter: 1,
onleave: 1
},
isInternalEvent: function(e) {
var t = enyo.dispatcher.findDispatchTarget(e.relatedTarget);
return t && t.isDescendantOf(this);
},
hasNode: function() {
return this.generated && (this.node || this.findNodeById());
},
addContent: function(e) {
this.setContent(this.get("content") + e);
},
getAttribute: function(e) {
return this.hasNode() ? this.node.getAttribute(e) : this.attributes[e];
},
setAttribute: function(e, t) {
this.attributes[e] = t, this.hasNode() && this.attributeToNode(e, t), this.invalidateTags();
},
getNodeProperty: function(e, t) {
return this.hasNode() ? this.node[e] : t;
},
setNodeProperty: function(e, t) {
this.hasNode() && (this.node[e] = t);
},
setClassAttribute: function(e) {
this.setAttribute("class", e);
},
getClassAttribute: function() {
return this.attributes["class"] || "";
},
hasClass: function(e) {
return e && (" " + this.getClassAttribute() + " ").indexOf(" " + e + " ") >= 0;
},
addClass: function(e) {
if (e && !this.hasClass(e)) {
var t = this.getClassAttribute();
this.setClassAttribute(t + (t ? " " : "") + e);
}
},
removeClass: function(e) {
if (e && this.hasClass(e)) {
var t = this.getClassAttribute();
t = (" " + t + " ").replace(" " + e + " ", " ").slice(1, -1), this.setClassAttribute(t);
}
},
addRemoveClass: function(e, t) {
this[t ? "addClass" : "removeClass"](e);
},
initStyles: function() {
this.domStyles = this.domStyles || {}, enyo.Control.cssTextToDomStyles(this.kindStyle, this.domStyles), this.domCssText = enyo.Control.domStylesToCssText(this.domStyles);
},
styleChanged: function() {
this.invalidateTags(), this.renderStyles();
},
applyStyle: function(e, t) {
this.domStyles[e] = t, this.domStylesChanged();
},
addStyles: function(e) {
enyo.Control.cssTextToDomStyles(e, this.domStyles), this.domStylesChanged();
},
getComputedStyleValue: function(e, t) {
return this.hasNode() ? enyo.dom.getComputedStyleValue(this.node, e) : t;
},
domStylesChanged: function() {
this.domCssText = enyo.Control.domStylesToCssText(this.domStyles), this.invalidateTags(), this.renderStyles();
},
stylesToNode: function() {
this.node.style.cssText = this.style + (this.style[this.style.length - 1] == ";" ? " " : "; ") + this.domCssText;
},
setupBodyFitting: function() {
enyo.dom.applyBodyFit(), this.addClass("enyo-fit enyo-clip");
},
setupOverflowScrolling: function() {
if (enyo.platform.android || enyo.platform.androidChrome || enyo.platform.blackberry) return;
document.getElementsByTagName("body")[0].className += " webkitOverflowScrolling";
},
render: function() {
if (this.parent) {
this.parent.beforeChildRender(this);
if (!this.parent.generated) return this;
}
return this.hasNode() || this.renderNode(), this.hasNode() && (this.renderDom(), this.generated && this.rendered()), this;
},
renderInto: function(e) {
this.teardownRender();
var t = enyo.dom.byId(e), n = enyo.exists(this.fit) && this.fit === !1;
return t == document.body && !n ? this.setupBodyFitting() : this.fit && this.addClass("enyo-fit enyo-clip"), this.addClass("enyo-no-touch-action"), this.setupOverflowScrolling(), enyo.dom.setInnerHtml(t, this.generateHtml()), this.generated && this.rendered(), this;
},
write: function() {
return this.fit && this.setupBodyFitting(), this.addClass("enyo-no-touch-action"), this.setupOverflowScrolling(), document.write(this.generateHtml()), this.generated && this.rendered(), this;
},
rendered: function() {
this.reflow();
for (var e = 0, t; t = this.children[e]; e++) t.generated && t.rendered();
},
show: function() {
this.setShowing(!0);
},
hide: function() {
this.setShowing(!1);
},
getBounds: function() {
var e = this.node || this.hasNode(), t = enyo.dom.getBounds(e);
return t || {
left: undefined,
top: undefined,
width: undefined,
height: undefined
};
},
setBounds: function(e, t) {
var n = this.domStyles, r = t || "px", i = [ "width", "height", "left", "top", "right", "bottom" ];
for (var s = 0, o, u; u = i[s]; s++) {
o = e[u];
if (o || o === 0) n[u] = o + (enyo.isString(o) ? "" : r);
}
this.domStylesChanged();
},
findNodeById: function() {
return this.id && (this.node = enyo.dom.byId(this.id));
},
idChanged: function(e) {
e && enyo.Control.unregisterDomEvents(e), this.setAttribute("id", this.id), this.id && enyo.Control.registerDomEvents(this.id, this);
},
contentChanged: function() {
this.hasNode() && this.renderContent();
},
getSrc: function() {
return this.getAttribute("src");
},
srcChanged: function() {
if (!this.src) return;
this.setAttribute("src", enyo.path.rewrite(this.src));
},
attributesChanged: function() {
this.invalidateTags(), this.renderAttributes();
},
generateHtml: function() {
if (this.canGenerate === !1) return "";
var e = this.generateInnerHtml(), t = this.generateOuterHtml(e);
return this.generated = !0, t;
},
generateInnerHtml: function() {
return this.flow(), this.children.length ? this.generateChildHtml() : this.allowHtml ? this.get("content") : enyo.Control.escapeHtml(this.get("content"));
},
generateChildHtml: function() {
var e = "";
for (var t = 0, n; n = this.children[t]; t++) {
var r = n.generateHtml();
e += r;
}
return e;
},
generateOuterHtml: function(e) {
return this.tag ? (this.tagsValid || this.prepareTags(), this._openTag + e + this._closeTag) : e;
},
invalidateTags: function() {
this.tagsValid = !1;
},
prepareTags: function() {
var e = this.domCssText + this.style;
this._openTag = "<" + this.tag + (e ? ' style="' + e + '"' : "") + enyo.Control.attributesToHtml(this.attributes), enyo.Control.selfClosing[this.tag] ? (this._openTag += "/>", this._closeTag = "") : (this._openTag += ">", this._closeTag = "</" + this.tag + ">"), this.tagsValid = !0;
},
attributeToNode: function(e, t) {
t === null || t === !1 || t === "" ? this.node.removeAttribute(e) : this.node.setAttribute(e, t);
},
attributesToNode: function() {
for (var e in this.attributes) this.attributeToNode(e, this.attributes[e]);
},
getParentNode: function() {
return this.parentNode || this.parent && (this.parent.hasNode() || this.parent.getParentNode());
},
addNodeToParent: function() {
if (this.node) {
var e = this.getParentNode();
e && (this.addBefore !== undefined ? this.insertNodeInParent(e, this.addBefore && this.addBefore.hasNode()) : this.appendNodeToParent(e));
}
},
appendNodeToParent: function(e) {
e.appendChild(this.node);
},
insertNodeInParent: function(e, t) {
e.insertBefore(this.node, t || e.firstChild);
},
removeNodeFromDom: function() {
this.hasNode() && this.node.parentNode && this.node.parentNode.removeChild(this.node);
},
teardownRender: function() {
this.generated && this.teardownChildren(), this.node = null, this.generated = !1;
},
teardownChildren: function() {
for (var e = 0, t; t = this.children[e]; e++) t.teardownRender();
},
renderNode: function() {
this.teardownRender(), this.node = document.createElement(this.tag), this.addNodeToParent(), this.generated = !0;
},
renderDom: function() {
this.renderAttributes(), this.renderStyles(), this.renderContent();
},
renderContent: function() {
this.generated && this.teardownChildren(), enyo.dom.setInnerHtml(this.node, this.generateInnerHtml());
},
renderStyles: function() {
this.hasNode() && this.stylesToNode();
},
renderAttributes: function() {
this.hasNode() && this.attributesToNode();
},
beforeChildRender: function() {
this.generated && this.flow();
},
syncDisplayToShowing: function() {
var e = this.domStyles;
this.showing ? e.display == "none" && this.applyStyle("display", this._displayStyle || "") : (this._displayStyle = e.display == "none" ? "" : e.display, this.applyStyle("display", "none"));
},
showingChanged: function() {
this.syncDisplayToShowing();
},
getShowing: function() {
return this.showing = this.domStyles.display != "none";
},
fitChanged: function(e) {
this.parent.reflow();
},
statics: {
escapeHtml: function(e) {
return e != null ? String(e).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : "";
},
registerDomEvents: function(e, t) {
enyo.$[e] = t;
},
unregisterDomEvents: function(e) {
enyo.$[e] = null;
},
selfClosing: {
img: 1,
hr: 1,
br: 1,
area: 1,
base: 1,
basefont: 1,
input: 1,
link: 1,
meta: 1,
command: 1,
embed: 1,
keygen: 1,
wbr: 1,
param: 1,
source: 1,
track: 1,
col: 1
},
cssTextToDomStyles: function(e, t) {
if (e) {
var n = e.replace(/; /g, ";").split(";");
for (var r = 0, i, s, o, u; u = n[r]; r++) i = u.split(":"), s = i.shift(), o = i.join(":"), t[s] = o;
}
},
domStylesToCssText: function(e) {
var t, n, r = "";
for (t in e) n = e[t], n !== null && n !== undefined && n !== "" && (r += t + ":" + n + ";");
return r;
},
stylesToHtml: function(e) {
var t = enyo.Control.domStylesToCssText(e);
return t ? ' style="' + t + '"' : "";
},
escapeAttribute: function(e) {
return enyo.isString(e) ? String(e).replace(/&/g, "&amp;").replace(/\"/g, "&quot;") : e;
},
attributesToHtml: function(e) {
var t, n, r = "";
for (t in e) n = e[t], n !== null && n !== !1 && n !== "" && (r += " " + t + '="' + enyo.Control.escapeAttribute(n) + '"');
return r;
}
}
}), enyo.defaultCtor = enyo.Control, enyo.Control.subclass = function(e, t) {
var n = e.prototype;
if (n.classes) {
var r = n.kindClasses;
n.kindClasses = (r ? r + " " : "") + n.classes, n.classes = "";
}
if (n.style) {
var i = n.kindStyle;
n.kindStyle = (i ? i + ";" : "") + n.style, n.style = "";
}
if (t.attributes) {
var s = n.kindAttributes;
n.kindAttributes = enyo.mixin(enyo.clone(s), n.attributes), n.attributes = null;
}
}, enyo.View = enyo.Control, enyo.platform = {
touch: Boolean("ontouchstart" in window || window.navigator.msMaxTouchPoints),
gesture: Boolean("ongesturestart" in window || window.navigator.msMaxTouchPoints)
}, function() {
var e = navigator.userAgent, t = enyo.platform, n = [ {
platform: "androidChrome",
regex: /Android .* Chrome\/(\d+)[.\d]+/
}, {
platform: "android",
regex: /Android (\d+)/
}, {
platform: "android",
regex: /Silk\/1./,
forceVersion: 2,
extra: {
silk: 1
}
}, {
platform: "android",
regex: /Silk\/2./,
forceVersion: 4,
extra: {
silk: 2
}
}, {
platform: "ie",
regex: /MSIE (\d+)/
}, {
platform: "ios",
regex: /iP(?:hone|ad;(?: U;)? CPU) OS (\d+)/
}, {
platform: "webos",
regex: /(?:web|hpw)OS\/(\d+)/
}, {
platform: "safari",
regex: /Version\/(\d+)[.\d]+\s+Safari/
}, {
platform: "chrome",
regex: /Chrome\/(\d+)[.\d]+/
}, {
platform: "androidFirefox",
regex: /Android;.*Firefox\/(\d+)/
}, {
platform: "firefoxOS",
regex: /Mobile;.*Firefox\/(\d+)/
}, {
platform: "firefox",
regex: /Firefox\/(\d+)/
}, {
platform: "blackberry",
regex: /BB1\d;.*Version\/(\d+\.\d+)/
} ];
for (var r = 0, i, s, o; i = n[r]; r++) {
s = i.regex.exec(e);
if (s) {
i.forceVersion ? o = i.forceVersion : o = Number(s[1]), t[i.platform] = o, i.extra && enyo.mixin(t, i.extra);
break;
}
}
enyo.dumbConsole = Boolean(t.android || t.ios || t.webos);
}(), function() {
var e = Math.round(1e3 / 60), t = [ "webkit", "moz", "ms", "o", "" ], n = "requestAnimationFrame", r = "cancel" + enyo.cap(n), i = function(t) {
return window.setTimeout(t, e);
}, s = function(e) {
return window.clearTimeout(e);
};
for (var o = 0, u = t.length, a, f, l; (a = t[o]) || o < u; o++) {
if (enyo.platform.ios >= 6) break;
f = a ? a + enyo.cap(r) : r, l = a ? a + enyo.cap(n) : n;
if (window[f]) {
s = window[f], i = window[l], a == "webkit" && s(i(enyo.nop));
break;
}
}
enyo.requestAnimationFrame = function(e, t) {
return i(e, t);
}, enyo.cancelRequestAnimationFrame = function(e) {
return s(e);
};
}(), enyo.easing = {
cubicIn: function(e) {
return Math.pow(e, 3);
},
cubicOut: function(e) {
return Math.pow(e - 1, 3) + 1;
},
expoOut: function(e) {
return e == 1 ? 1 : -1 * Math.pow(2, -10 * e) + 1;
},
quadInOut: function(e) {
return e *= 2, e < 1 ? Math.pow(e, 2) / 2 : -1 * (--e * (e - 2) - 1) / 2;
},
linear: function(e) {
return e;
}
}, enyo.easedLerp = function(e, t, n, r) {
var i = (enyo.now() - e) / t;
return r ? i >= 1 ? 0 : 1 - n(1 - i) : i >= 1 ? 1 : n(i);
}, function() {
if (window.cordova || window.PhoneGap) {
var e = [ "deviceready", "pause", "resume", "online", "offline", "backbutton", "batterycritical", "batterylow", "batterystatus", "menubutton", "searchbutton", "startcallbutton", "endcallbutton", "volumedownbutton", "volumeupbutton" ];
for (var t = 0, n; n = e[t]; t++) document.addEventListener(n, enyo.bind(enyo.Signals, "send", "on" + n), !1);
}
}(), enyo.$ = {}, enyo.dispatcher = {
events: [ "mousedown", "mouseup", "mouseover", "mouseout", "mousemove", "mousewheel", "click", "dblclick", "change", "keydown", "keyup", "keypress", "input" ],
windowEvents: [ "resize", "load", "unload", "message", "hashchange" ],
cssEvents: [ "webkitTransitionEnd", "transitionend" ],
features: [],
connect: function() {
var e = enyo.dispatcher, t, n;
for (t = 0; n = e.events[t]; t++) e.listen(document, n);
for (t = 0; n = e.cssEvents[t]; t++) e.listen(document, n);
for (t = 0; n = e.windowEvents[t]; t++) {
if (n === "unload" && typeof window.chrome == "object" && window.chrome.app) continue;
e.listen(window, n);
}
for (t = 0; n = e.cssEvents[t]; t++) e.listen(document, n);
},
listen: function(e, t, n) {
var r = enyo.dispatch;
e.addEventListener ? this.listen = function(e, t, n) {
e.addEventListener(t, n || r, !1);
} : this.listen = function(e, t, n) {
e.attachEvent("on" + t, function(e) {
return e.target = e.srcElement, e.preventDefault || (e.preventDefault = enyo.iePreventDefault), (n || r)(e);
});
}, this.listen(e, t, n);
},
dispatch: function(e) {
var t = this.findDispatchTarget(e.target) || this.findDefaultTarget(e);
e.dispatchTarget = t;
for (var n = 0, r; r = this.features[n]; n++) if (r.call(this, e) === !0) return;
t && !e.preventDispatch && this.dispatchBubble(e, t);
},
findDispatchTarget: function(e) {
var t, n = e;
try {
while (n) {
if (t = enyo.$[n.id]) {
t.eventNode = n;
break;
}
n = n.parentNode;
}
} catch (r) {
enyo.log(r, n);
}
return t;
},
findDefaultTarget: function(e) {
return enyo.master;
},
dispatchBubble: function(e, t) {
return t.bubble("on" + e.type, e, t);
}
}, enyo.iePreventDefault = function() {
try {
this.returnValue = !1;
} catch (e) {}
}, enyo.dispatch = function(e) {
return enyo.dispatcher.dispatch(e);
}, enyo.bubble = function(e) {
var t = e || window.event;
t && (t.target || (t.target = t.srcElement), enyo.dispatch(t));
}, enyo.bubbler = "enyo.bubble(arguments[0])", function() {
var e = function() {
enyo.bubble(arguments[0]);
};
enyo.makeBubble = function() {
var t = Array.prototype.slice.call(arguments, 0), n = t.shift();
typeof n == "object" && typeof n.hasNode == "function" && enyo.forEach(t, function(t) {
this.hasNode() && enyo.dispatcher.listen(this.node, t, e);
}, n);
};
}(), enyo.requiresWindow(enyo.dispatcher.connect), enyo.dispatcher.features.push(function(e) {
if ("click" === e.type && e.clientX === 0 && e.clientY === 0) {
var t = enyo.clone(e);
t.type = "tap", enyo.dispatch(t);
}
}), function() {
var e = "previewDomEvent", t = {
feature: function(e) {
t.dispatch(e, e.dispatchTarget);
},
dispatch: function(t, n) {
var r = this.buildLineage(n);
for (var i = 0, s; s = r[i]; i++) if (s[e] && s[e](t) === !0) {
t.preventDispatch = !0;
return;
}
},
buildLineage: function(e) {
var t = [], n = e;
while (n) t.unshift(n), n = n.parent;
return t;
}
};
enyo.dispatcher.features.push(t.feature);
}(), enyo.dispatcher.features.push(function(e) {
var t = e.dispatchTarget, n = this.captureTarget && !this.noCaptureEvents[e.type], r = n && !(t && t.isDescendantOf && t.isDescendantOf(this.captureTarget));
if (r) {
var i = e.captureTarget = this.captureTarget, s = this.autoForwardEvents[e.type] || this.forwardEvents;
this.dispatchBubble(e, i), s || (e.preventDispatch = !0);
}
}), enyo.mixin(enyo.dispatcher, {
noCaptureEvents: {
load: 1,
unload: 1,
error: 1
},
autoForwardEvents: {
leave: 1,
resize: 1
},
captures: [],
capture: function(e, t) {
var n = {
target: e,
forward: t
};
this.captures.push(n), this.setCaptureInfo(n);
},
release: function() {
this.captures.pop(), this.setCaptureInfo(this.captures[this.captures.length - 1]);
},
setCaptureInfo: function(e) {
this.captureTarget = e && e.target, this.forwardEvents = e && e.forward;
}
}), enyo.gesture = {
eventProps: [ "target", "relatedTarget", "clientX", "clientY", "pageX", "pageY", "screenX", "screenY", "altKey", "ctrlKey", "metaKey", "shiftKey", "detail", "identifier", "dispatchTarget", "which", "srcEvent" ],
makeEvent: function(e, t) {
var n = {
type: e
};
for (var r = 0, i; i = this.eventProps[r]; r++) n[i] = t[i];
n.srcEvent = n.srcEvent || t, n.preventDefault = this.preventDefault, n.disablePrevention = this.disablePrevention;
if (enyo.platform.ie < 10) {
enyo.platform.ie == 8 && n.target && (n.pageX = n.clientX + n.target.scrollLeft, n.pageY = n.clientY + n.target.scrollTop);
var s = window.event && window.event.button;
n.which = s & 1 ? 1 : s & 2 ? 2 : s & 4 ? 3 : 0;
} else (enyo.platform.webos || window.PalmSystem) && n.which === 0 && (n.which = 1);
return n;
},
down: function(e) {
var t = this.makeEvent("down", e);
enyo.dispatch(t), this.downEvent = t;
},
move: function(e) {
var t = this.makeEvent("move", e);
t.dx = t.dy = t.horizontal = t.vertical = 0, t.which && this.downEvent && (t.dx = e.clientX - this.downEvent.clientX, t.dy = e.clientY - this.downEvent.clientY, t.horizontal = Math.abs(t.dx) > Math.abs(t.dy), t.vertical = !t.horizontal), enyo.dispatch(t);
},
up: function(e) {
var t = this.makeEvent("up", e), n = !1;
t.preventTap = function() {
n = !0;
}, enyo.dispatch(t), !n && this.downEvent && this.downEvent.which == 1 && this.sendTap(t), this.downEvent = null;
},
over: function(e) {
enyo.dispatch(this.makeEvent("enter", e));
},
out: function(e) {
enyo.dispatch(this.makeEvent("leave", e));
},
sendTap: function(e) {
var t = this.findCommonAncestor(this.downEvent.target, e.target);
if (t) {
var n = this.makeEvent("tap", e);
n.target = t, enyo.dispatch(n);
}
},
findCommonAncestor: function(e, t) {
var n = t;
while (n) {
if (this.isTargetDescendantOf(e, n)) return n;
n = n.parentNode;
}
},
isTargetDescendantOf: function(e, t) {
var n = e;
while (n) {
if (n == t) return !0;
n = n.parentNode;
}
}
}, enyo.gesture.preventDefault = function() {
this.srcEvent && this.srcEvent.preventDefault();
}, enyo.gesture.disablePrevention = function() {
this.preventDefault = enyo.nop, this.srcEvent && (this.srcEvent.preventDefault = enyo.nop);
}, enyo.dispatcher.features.push(function(e) {
if (enyo.gesture.events[e.type]) return enyo.gesture.events[e.type](e);
}), enyo.gesture.events = {
mousedown: function(e) {
enyo.gesture.down(e);
},
mouseup: function(e) {
enyo.gesture.up(e);
},
mousemove: function(e) {
enyo.gesture.move(e);
},
mouseover: function(e) {
enyo.gesture.over(e);
},
mouseout: function(e) {
enyo.gesture.out(e);
}
}, enyo.requiresWindow(function() {
document.addEventListener && document.addEventListener("DOMMouseScroll", function(e) {
var t = enyo.clone(e);
t.preventDefault = function() {
e.preventDefault();
}, t.type = "mousewheel";
var n = t.VERTICAL_AXIS == t.axis ? "wheelDeltaY" : "wheelDeltaX";
t[n] = t.detail * -40, enyo.dispatch(t);
}, !1);
}), enyo.dispatcher.features.push(function(e) {
if (enyo.gesture.drag[e.type]) return enyo.gesture.drag[e.type](e);
}), enyo.gesture.drag = {
hysteresisSquared: 16,
holdPulseDelay: 200,
trackCount: 5,
minFlick: .1,
minTrack: 8,
down: function(e) {
this.stopDragging(e), this.cancelHold(), this.target = e.target, this.startTracking(e), this.beginHold(e);
},
move: function(e) {
if (this.tracking) {
this.track(e);
if (!e.which) {
this.stopDragging(e), this.cancelHold(), this.tracking = !1;
return;
}
this.dragEvent ? this.sendDrag(e) : this.dy * this.dy + this.dx * this.dx >= this.hysteresisSquared && (this.sendDragStart(e), this.cancelHold());
}
},
up: function(e) {
this.endTracking(e), this.stopDragging(e), this.cancelHold();
},
leave: function(e) {
this.dragEvent && this.sendDragOut(e);
},
stopDragging: function(e) {
if (this.dragEvent) {
this.sendDrop(e);
var t = this.sendDragFinish(e);
return this.dragEvent = null, t;
}
},
makeDragEvent: function(e, t, n, r) {
var i = Math.abs(this.dx), s = Math.abs(this.dy), o = i > s, u = (o ? s / i : i / s) < .414, a = {
type: e,
dx: this.dx,
dy: this.dy,
ddx: this.dx - this.lastDx,
ddy: this.dy - this.lastDy,
xDirection: this.xDirection,
yDirection: this.yDirection,
pageX: n.pageX,
pageY: n.pageY,
clientX: n.clientX,
clientY: n.clientY,
horizontal: o,
vertical: !o,
lockable: u,
target: t,
dragInfo: r,
ctrlKey: n.ctrlKey,
altKey: n.altKey,
metaKey: n.metaKey,
shiftKey: n.shiftKey,
srcEvent: n.srcEvent
};
return enyo.platform.ie == 8 && a.target && (a.pageX = a.clientX + a.target.scrollLeft, a.pageY = a.clientY + a.target.scrollTop), a.preventDefault = enyo.gesture.preventDefault, a.disablePrevention = enyo.gesture.disablePrevention, a;
},
sendDragStart: function(e) {
this.dragEvent = this.makeDragEvent("dragstart", this.target, e), enyo.dispatch(this.dragEvent);
},
sendDrag: function(e) {
var t = this.makeDragEvent("dragover", e.target, e, this.dragEvent.dragInfo);
enyo.dispatch(t), t.type = "drag", t.target = this.dragEvent.target, enyo.dispatch(t);
},
sendDragFinish: function(e) {
var t = this.makeDragEvent("dragfinish", this.dragEvent.target, e, this.dragEvent.dragInfo);
t.preventTap = function() {
e.preventTap && e.preventTap();
}, enyo.dispatch(t);
},
sendDragOut: function(e) {
var t = this.makeDragEvent("dragout", e.target, e, this.dragEvent.dragInfo);
enyo.dispatch(t);
},
sendDrop: function(e) {
var t = this.makeDragEvent("drop", e.target, e, this.dragEvent.dragInfo);
t.preventTap = function() {
e.preventTap && e.preventTap();
}, enyo.dispatch(t);
},
startTracking: function(e) {
this.tracking = !0, this.px0 = e.clientX, this.py0 = e.clientY, this.flickInfo = {
startEvent: e,
moves: []
}, this.track(e);
},
track: function(e) {
this.lastDx = this.dx, this.lastDy = this.dy, this.dx = e.clientX - this.px0, this.dy = e.clientY - this.py0, this.xDirection = this.calcDirection(this.dx - this.lastDx, 0), this.yDirection = this.calcDirection(this.dy - this.lastDy, 0);
var t = this.flickInfo;
t.moves.push({
x: e.clientX,
y: e.clientY,
t: enyo.now()
}), t.moves.length > this.trackCount && t.moves.shift();
},
endTracking: function(e) {
this.tracking = !1;
var t = this.flickInfo, n = t && t.moves;
if (n && n.length > 1) {
var r = n[n.length - 1], i = enyo.now();
for (var s = n.length - 2, o = 0, u = 0, a = 0, f = 0, l = 0, c = 0, h = 0, p; p = n[s]; s--) {
o = i - p.t, u = (r.x - p.x) / o, a = (r.y - p.y) / o, c = c || (u < 0 ? -1 : u > 0 ? 1 : 0), h = h || (a < 0 ? -1 : a > 0 ? 1 : 0);
if (u * c > f * c || a * h > l * h) f = u, l = a;
}
var d = Math.sqrt(f * f + l * l);
d > this.minFlick && this.sendFlick(t.startEvent, f, l, d);
}
this.flickInfo = null;
},
calcDirection: function(e, t) {
return e > 0 ? 1 : e < 0 ? -1 : t;
},
beginHold: function(e) {
this.holdStart = enyo.now(), this.holdJob = setInterval(enyo.bind(this, "sendHoldPulse", e), this.holdPulseDelay);
},
cancelHold: function() {
clearInterval(this.holdJob), this.holdJob = null, this.sentHold && (this.sentHold = !1, this.sendRelease(this.holdEvent));
},
sendHoldPulse: function(e) {
this.sentHold || (this.sentHold = !0, this.sendHold(e));
var t = enyo.gesture.makeEvent("holdpulse", e);
t.holdTime = enyo.now() - this.holdStart, enyo.dispatch(t);
},
sendHold: function(e) {
this.holdEvent = e;
var t = enyo.gesture.makeEvent("hold", e);
enyo.dispatch(t);
},
sendRelease: function(e) {
var t = enyo.gesture.makeEvent("release", e);
enyo.dispatch(t);
},
sendFlick: function(e, t, n, r) {
var i = enyo.gesture.makeEvent("flick", e);
i.xVelocity = t, i.yVelocity = n, i.velocity = r, enyo.dispatch(i);
}
}, enyo.dom.transition = enyo.platform.ios || enyo.platform.android || enyo.platform.chrome || enyo.platform.androidChrome || enyo.platform.safari ? "-webkit-transition" : enyo.platform.firefox || enyo.platform.firefoxOS || enyo.platform.androidFirefox ? "-moz-transition" : "transition", enyo.requiresWindow(function() {
var e = enyo.gesture, t = e.events;
e.events.touchstart = function(t) {
e.events = n, e.events.touchstart(t);
};
var n = {
_touchCount: 0,
touchstart: function(t) {
this._touchCount += t.changedTouches.length, this.excludedTarget = null;
var n = this.makeEvent(t);
e.down(n), n = this.makeEvent(t), this.overEvent = n, e.over(n);
},
touchmove: function(t) {
enyo.job.stop("resetGestureEvents");
var n = e.drag.dragEvent;
this.excludedTarget = n && n.dragInfo && n.dragInfo.node;
var r = this.makeEvent(t);
e.move(r), enyo.bodyIsFitting && t.preventDefault(), this.overEvent && this.overEvent.target != r.target && (this.overEvent.relatedTarget = r.target, r.relatedTarget = this.overEvent.target, e.out(this.overEvent), e.over(r)), this.overEvent = r;
},
touchend: function(t) {
e.up(this.makeEvent(t)), e.out(this.overEvent), this._touchCount -= t.changedTouches.length;
},
mouseup: function(n) {
this._touchCount === 0 && (this.sawMousedown = !1, e.events = t);
},
makeEvent: function(e) {
var t = enyo.clone(e.changedTouches[0]);
return t.srcEvent = e, t.target = this.findTarget(t), t.which = 1, t;
},
calcNodeOffset: function(e) {
if (e.getBoundingClientRect) {
var t = e.getBoundingClientRect();
return {
left: t.left,
top: t.top,
width: t.width,
height: t.height
};
}
},
findTarget: function(e) {
return document.elementFromPoint(e.clientX, e.clientY);
},
findTargetTraverse: function(e, t, n) {
var r = e || document.body, i = this.calcNodeOffset(r);
if (i && r != this.excludedTarget) {
var s = t - i.left, o = n - i.top;
if (s > 0 && o > 0 && s <= i.width && o <= i.height) {
var u;
for (var a = r.childNodes, f = a.length - 1, l; l = a[f]; f--) {
u = this.findTargetTraverse(l, t, n);
if (u) return u;
}
return r;
}
}
},
connect: function() {
enyo.forEach([ "ontouchstart", "ontouchmove", "ontouchend", "ongesturestart", "ongesturechange", "ongestureend" ], function(e) {
document[e] = enyo.dispatch;
}), enyo.platform.androidChrome <= 18 || enyo.platform.silk === 2 ? this.findTarget = function(e) {
return document.elementFromPoint(e.screenX, e.screenY);
} : document.elementFromPoint || (this.findTarget = function(e) {
return this.findTargetTraverse(null, e.clientX, e.clientY);
});
}
};
n.connect();
}), function() {
var e = enyo.gesture;
if (window.navigator.msPointerEnabled) {
var t = [ "MSPointerDown", "MSPointerUp", "MSPointerMove", "MSPointerOver", "MSPointerOut", "MSPointerCancel", "MSGestureTap", "MSGestureDoubleTap", "MSGestureHold", "MSGestureStart", "MSGestureChange", "MSGestureEnd" ];
enyo.forEach(t, function(e) {
enyo.dispatcher.listen(document, e);
}), enyo.dispatcher.features.push(function(e) {
i[e.type] && e.isPrimary && i[e.type](e);
}), enyo.gesture.events = {};
}
var n = function(t, n) {
var r = enyo.clone(n);
return enyo.mixin(r, {
pageX: n.translationX || 0,
pageY: n.translationY || 0,
rotation: n.rotation * (180 / Math.PI) || 0,
type: t,
srcEvent: n,
preventDefault: e.preventDefault,
disablePrevention: e.disablePrevention
});
}, r = function(e) {
var t = enyo.clone(e);
return t.srcEvent = e, t.which = 1, t;
}, i = {
MSPointerDown: function(t) {
var n = r(t);
e.down(n);
},
MSPointerUp: function(t) {
var n = r(t);
e.up(n);
},
MSPointerMove: function(t) {
var n = r(t);
e.move(n);
},
MSPointerCancel: function(t) {
var n = r(t);
e.up(n);
},
MSPointerOver: function(t) {
var n = r(t);
e.over(n);
},
MSPointerOut: function(t) {
var n = r(t);
e.out(n);
}
};
}(), function() {
!enyo.platform.gesture && enyo.platform.touch && enyo.dispatcher.features.push(function(n) {
e[n.type] && t[n.type](n);
});
var e = {
touchstart: !0,
touchmove: !0,
touchend: !0
}, t = {
orderedTouches: [],
gesture: null,
touchstart: function(e) {
enyo.forEach(e.changedTouches, function(e) {
var t = e.identifier;
enyo.indexOf(t, this.orderedTouches) < 0 && this.orderedTouches.push(t);
}, this);
if (e.touches.length >= 2 && !this.gesture) {
var t = this.gesturePositions(e);
this.gesture = this.gestureVector(t), this.gesture.angle = this.gestureAngle(t), this.gesture.scale = 1, this.gesture.rotation = 0;
var n = this.makeGesture("gesturestart", e, {
vector: this.gesture,
scale: 1,
rotation: 0
});
enyo.dispatch(n);
}
},
touchend: function(e) {
enyo.forEach(e.changedTouches, function(e) {
enyo.remove(e.identifier, this.orderedTouches);
}, this);
if (e.touches.length <= 1 && this.gesture) {
var t = e.touches[0] || e.changedTouches[e.changedTouches.length - 1];
enyo.dispatch(this.makeGesture("gestureend", e, {
vector: {
xcenter: t.pageX,
ycenter: t.pageY
},
scale: this.gesture.scale,
rotation: this.gesture.rotation
})), this.gesture = null;
}
},
touchmove: function(e) {
if (this.gesture) {
var t = this.makeGesture("gesturechange", e);
this.gesture.scale = t.scale, this.gesture.rotation = t.rotation, enyo.dispatch(t);
}
},
findIdentifiedTouch: function(e, t) {
for (var n = 0, r; r = e[n]; n++) if (r.identifier === t) return r;
},
gesturePositions: function(e) {
var t = this.findIdentifiedTouch(e.touches, this.orderedTouches[0]), n = this.findIdentifiedTouch(e.touches, this.orderedTouches[this.orderedTouches.length - 1]), r = t.pageX, i = n.pageX, s = t.pageY, o = n.pageY, u = i - r, a = o - s, f = Math.sqrt(u * u + a * a);
return {
x: u,
y: a,
h: f,
fx: r,
lx: i,
fy: s,
ly: o
};
},
gestureAngle: function(e) {
var t = e, n = Math.asin(t.y / t.h) * (180 / Math.PI);
return t.x < 0 && (n = 180 - n), t.x > 0 && t.y < 0 && (n += 360), n;
},
gestureVector: function(e) {
var t = e;
return {
magnitude: t.h,
xcenter: Math.abs(Math.round(t.fx + t.x / 2)),
ycenter: Math.abs(Math.round(t.fy + t.y / 2))
};
},
makeGesture: function(e, t, n) {
var r, i, s;
if (n) r = n.vector, i = n.scale, s = n.rotation; else {
var o = this.gesturePositions(t);
r = this.gestureVector(o), i = r.magnitude / this.gesture.magnitude, s = (360 + this.gestureAngle(o) - this.gesture.angle) % 360;
}
var u = enyo.clone(t);
return enyo.mixin(u, {
type: e,
scale: i,
pageX: r.xcenter,
pageY: r.ycenter,
rotation: s
});
}
};
}(), enyo.kind({
name: "enyo.ScrollMath",
kind: enyo.Component,
published: {
vertical: !0,
horizontal: !0
},
events: {
onScrollStart: "",
onScroll: "",
onScrollStop: ""
},
kSpringDamping: .93,
kDragDamping: .5,
kFrictionDamping: .97,
kSnapFriction: .9,
kFlickScalar: 15,
kMaxFlick: enyo.platform.android > 2 ? 2 : 1e9,
kFrictionEpsilon: .01,
topBoundary: 0,
rightBoundary: 0,
bottomBoundary: 0,
leftBoundary: 0,
interval: 20,
fixedTime: !0,
x0: 0,
x: 0,
y0: 0,
y: 0,
destroy: function() {
this.stop(), this.inherited(arguments);
},
verlet: function(e) {
var t = this.x;
this.x += t - this.x0, this.x0 = t;
var n = this.y;
this.y += n - this.y0, this.y0 = n;
},
damping: function(e, t, n, r) {
var i = .5, s = e - t;
return Math.abs(s) < i ? t : e * r > t * r ? n * s + t : e;
},
boundaryDamping: function(e, t, n, r) {
return this.damping(this.damping(e, t, r, 1), n, r, -1);
},
constrain: function() {
var e = this.boundaryDamping(this.y, this.topBoundary, this.bottomBoundary, this.kSpringDamping);
e != this.y && (this.y0 = e - (this.y - this.y0) * this.kSnapFriction, this.y = e);
var t = this.boundaryDamping(this.x, this.leftBoundary, this.rightBoundary, this.kSpringDamping);
t != this.x && (this.x0 = t - (this.x - this.x0) * this.kSnapFriction, this.x = t);
},
friction: function(e, t, n) {
var r = this[e] - this[t], i = Math.abs(r) > this.kFrictionEpsilon ? n : 0;
this[e] = this[t] + i * r;
},
frame: 10,
simulate: function(e) {
while (e >= this.frame) e -= this.frame, this.dragging || this.constrain(), this.verlet(), this.friction("y", "y0", this.kFrictionDamping), this.friction("x", "x0", this.kFrictionDamping);
return e;
},
animate: function() {
this.stop();
var e = enyo.now(), t = 0, n, r, i = enyo.bind(this, function() {
var s = enyo.now();
this.job = enyo.requestAnimationFrame(i);
var o = s - e;
e = s, this.dragging && (this.y0 = this.y = this.uy, this.x0 = this.x = this.ux), t += Math.max(16, o), this.fixedTime && !this.isInOverScroll() && (t = this.interval), t = this.simulate(t), r != this.y || n != this.x ? this.scroll() : this.dragging || (this.stop(!0), this.scroll()), r = this.y, n = this.x;
});
this.job = enyo.requestAnimationFrame(i);
},
start: function() {
this.job || (this.animate(), this.doScrollStart());
},
stop: function(e) {
this.job = enyo.cancelRequestAnimationFrame(this.job), e && this.doScrollStop();
},
stabilize: function() {
this.start();
var e = Math.min(this.topBoundary, Math.max(this.bottomBoundary, this.y)), t = Math.min(this.leftBoundary, Math.max(this.rightBoundary, this.x));
this.y = this.y0 = e, this.x = this.x0 = t, this.scroll(), this.stop(!0);
},
startDrag: function(e) {
this.dragging = !0, this.my = e.pageY, this.py = this.uy = this.y, this.mx = e.pageX, this.px = this.ux = this.x;
},
drag: function(e) {
if (this.dragging) {
var t = this.vertical ? e.pageY - this.my : 0;
this.uy = t + this.py, this.uy = this.boundaryDamping(this.uy, this.topBoundary, this.bottomBoundary, this.kDragDamping);
var n = this.horizontal ? e.pageX - this.mx : 0;
return this.ux = n + this.px, this.ux = this.boundaryDamping(this.ux, this.leftBoundary, this.rightBoundary, this.kDragDamping), this.start(), !0;
}
},
dragDrop: function(e) {
if (this.dragging && !window.PalmSystem) {
var t = .5;
this.y = this.uy, this.y0 = this.y - (this.y - this.y0) * t, this.x = this.ux, this.x0 = this.x - (this.x - this.x0) * t;
}
this.dragFinish();
},
dragFinish: function() {
this.dragging = !1;
},
flick: function(e) {
var t;
this.vertical && (t = e.yVelocity > 0 ? Math.min(this.kMaxFlick, e.yVelocity) : Math.max(-this.kMaxFlick, e.yVelocity), this.y = this.y0 + t * this.kFlickScalar), this.horizontal && (t = e.xVelocity > 0 ? Math.min(this.kMaxFlick, e.xVelocity) : Math.max(-this.kMaxFlick, e.xVelocity), this.x = this.x0 + t * this.kFlickScalar), this.start();
},
mousewheel: function(e) {
var t = this.vertical ? e.wheelDeltaY || e.wheelDelta : 0;
if (t > 0 && this.y < this.topBoundary || t < 0 && this.y > this.bottomBoundary) return this.stop(!0), this.y = this.y0 = this.y0 + t, this.start(), !0;
},
scroll: function() {
this.doScroll();
},
scrollTo: function(e, t) {
t !== null && (this.y = this.y0 - (t + this.y0) * (1 - this.kFrictionDamping)), e !== null && (this.x = this.x0 - (e + this.x0) * (1 - this.kFrictionDamping)), this.start();
},
setScrollX: function(e) {
this.x = this.x0 = e;
},
setScrollY: function(e) {
this.y = this.y0 = e;
},
setScrollPosition: function(e) {
this.setScrollY(e);
},
isScrolling: function() {
return Boolean(this.job);
},
isInOverScroll: function() {
return this.job && (this.x > this.leftBoundary || this.x < this.rightBoundary || this.y > this.topBoundary || this.y < this.bottomBoundary);
}
}), enyo.kind({
name: "enyo.ScrollStrategy",
tag: null,
published: {
vertical: "default",
horizontal: "default",
scrollLeft: 0,
scrollTop: 0,
maxHeight: null
},
handlers: {
ondragstart: "dragstart",
ondragfinish: "dragfinish",
ondown: "down",
onmove: "move"
},
create: function() {
this.inherited(arguments), this.horizontalChanged(), this.verticalChanged(), this.maxHeightChanged();
},
rendered: function() {
this.inherited(arguments), enyo.makeBubble(this.container, "scroll"), this.scrollNode = this.calcScrollNode();
},
teardownRender: function() {
this.inherited(arguments), this.scrollNode = null;
},
calcScrollNode: function() {
return this.container.hasNode();
},
horizontalChanged: function() {
this.container.applyStyle("overflow-x", this.horizontal == "default" ? "auto" : this.horizontal);
},
verticalChanged: function() {
this.container.applyStyle("overflow-y", this.vertical == "default" ? "auto" : this.vertical);
},
maxHeightChanged: function() {
this.container.applyStyle("max-height", this.maxHeight);
},
scrollTo: function(e, t) {
this.scrollNode && (this.setScrollLeft(e), this.setScrollTop(t));
},
scrollToNode: function(e, t) {
if (this.scrollNode) {
var n = this.getScrollBounds(), r = e, i = {
height: r.offsetHeight,
width: r.offsetWidth,
top: 0,
left: 0
};
while (r && r.parentNode && r.id != this.scrollNode.id) i.top += r.offsetTop, i.left += r.offsetLeft, r = r.parentNode;
this.setScrollTop(Math.min(n.maxTop, t === !1 ? i.top - n.clientHeight + i.height : i.top)), this.setScrollLeft(Math.min(n.maxLeft, t === !1 ? i.left - n.clientWidth + i.width : i.left));
}
},
scrollIntoView: function(e, t) {
e.hasNode() && e.node.scrollIntoView(t);
},
isInView: function(e) {
var t = this.getScrollBounds(), n = e.offsetTop, r = e.offsetHeight, i = e.offsetLeft, s = e.offsetWidth;
return n >= t.top && n + r <= t.top + t.clientHeight && i >= t.left && i + s <= t.left + t.clientWidth;
},
setScrollTop: function(e) {
this.scrollTop = e, this.scrollNode && (this.scrollNode.scrollTop = this.scrollTop);
},
setScrollLeft: function(e) {
this.scrollLeft = e, this.scrollNode && (this.scrollNode.scrollLeft = this.scrollLeft);
},
getScrollLeft: function() {
return this.scrollNode ? this.scrollNode.scrollLeft : this.scrollLeft;
},
getScrollTop: function() {
return this.scrollNode ? this.scrollNode.scrollTop : this.scrollTop;
},
_getScrollBounds: function() {
var e = this.getScrollSize(), t = this.container.hasNode(), n = {
left: this.getScrollLeft(),
top: this.getScrollTop(),
clientHeight: t ? t.clientHeight : 0,
clientWidth: t ? t.clientWidth : 0,
height: e.height,
width: e.width
};
return n.maxLeft = Math.max(0, n.width - n.clientWidth), n.maxTop = Math.max(0, n.height - n.clientHeight), n;
},
getScrollSize: function() {
var e = this.scrollNode;
return {
width: e ? e.scrollWidth : 0,
height: e ? e.scrollHeight : 0
};
},
getScrollBounds: function() {
return this._getScrollBounds();
},
calcStartInfo: function() {
var e = this.getScrollBounds(), t = this.getScrollTop(), n = this.getScrollLeft();
this.canVertical = e.maxTop > 0 && this.vertical != "hidden", this.canHorizontal = e.maxLeft > 0 && this.horizontal != "hidden", this.startEdges = {
top: t === 0,
bottom: t === e.maxTop,
left: n === 0,
right: n === e.maxLeft
};
},
shouldDrag: function(e) {
var t = e.vertical;
return t && this.canVertical || !t && this.canHorizontal;
},
dragstart: function(e, t) {
this.dragging = this.shouldDrag(t);
if (this.dragging) return this.preventDragPropagation;
},
dragfinish: function(e, t) {
this.dragging && (this.dragging = !1, t.preventTap());
},
down: function(e, t) {
this.calcStartInfo();
},
move: function(e, t) {
t.which && (this.canVertical && t.vertical || this.canHorizontal && t.horizontal) && t.disablePrevention();
}
}), enyo.kind({
name: "enyo.ScrollThumb",
axis: "v",
minSize: 4,
cornerSize: 6,
classes: "enyo-thumb",
create: function() {
this.inherited(arguments);
var e = this.axis == "v";
this.dimension = e ? "height" : "width", this.offset = e ? "top" : "left", this.translation = e ? "translateY" : "translateX", this.positionMethod = e ? "getScrollTop" : "getScrollLeft", this.sizeDimension = e ? "clientHeight" : "clientWidth", this.addClass("enyo-" + this.axis + "thumb"), this.transform = enyo.dom.canTransform(), enyo.dom.canAccelerate() && enyo.dom.transformValue(this, "translateZ", 0);
},
sync: function(e) {
this.scrollBounds = e._getScrollBounds(), this.update(e);
},
update: function(e) {
if (this.showing) {
var t = this.dimension, n = this.offset, r = this.scrollBounds[this.sizeDimension], i = this.scrollBounds[t], s = 0, o = 0, u = 0;
if (r >= i) {
this.hide();
return;
}
e.isOverscrolling() && (u = e.getOverScrollBounds()["over" + n], s = Math.abs(u), o = Math.max(u, 0));
var a = e[this.positionMethod]() - u, f = r - this.cornerSize, l = Math.floor(r * r / i - s);
l = Math.max(this.minSize, l);
var c = Math.floor(f * a / i + o);
c = Math.max(0, Math.min(f - this.minSize, c)), this.needed = l < r, this.needed && this.hasNode() ? (this._pos !== c && (this._pos = c, this.transform ? enyo.dom.transformValue(this, this.translation, c + "px") : this.axis == "v" ? this.setBounds({
top: c + "px"
}) : this.setBounds({
left: c + "px"
})), this._size !== l && (this._size = l, this.node.style[t] = this.domStyles[t] = l + "px")) : this.hide();
}
},
setShowing: function(e) {
if (e && e != this.showing && this.scrollBounds[this.sizeDimension] >= this.scrollBounds[this.dimension]) return;
this.hasNode() && this.cancelDelayHide();
if (e != this.showing) {
var t = this.showing;
this.showing = e, this.showingChanged(t);
}
},
delayHide: function(e) {
this.showing && enyo.job(this.id + "hide", enyo.bind(this, "hide"), e || 0);
},
cancelDelayHide: function() {
enyo.job.stop(this.id + "hide");
}
}), enyo.kind({
name: "enyo.TouchScrollStrategy",
kind: "ScrollStrategy",
overscroll: !0,
preventDragPropagation: !0,
published: {
vertical: "default",
horizontal: "default",
thumb: !0,
scrim: !1,
dragDuringGesture: !0
},
events: {
onShouldDrag: ""
},
handlers: {
onscroll: "domScroll",
onflick: "flick",
onhold: "hold",
ondragstart: "dragstart",
onShouldDrag: "shouldDrag",
ondrag: "drag",
ondragfinish: "dragfinish",
onmousewheel: "mousewheel"
},
tools: [ {
kind: "ScrollMath",
onScrollStart: "scrollMathStart",
onScroll: "scrollMathScroll",
onScrollStop: "scrollMathStop"
}, {
name: "vthumb",
kind: "ScrollThumb",
axis: "v",
showing: !1
}, {
name: "hthumb",
kind: "ScrollThumb",
axis: "h",
showing: !1
} ],
scrimTools: [ {
name: "scrim",
classes: "enyo-fit",
style: "z-index: 1;",
showing: !1
} ],
components: [ {
name: "client",
classes: "enyo-touch-scroller"
} ],
listReordering: !1,
create: function() {
this.inherited(arguments), this.transform = enyo.dom.canTransform(), this.transform || this.overscroll && this.$.client.applyStyle("position", "relative"), this.accel = enyo.dom.canAccelerate();
var e = "enyo-touch-strategy-container";
enyo.platform.ios && this.accel && (e += " enyo-composite"), this.scrimChanged(), this.container.addClass(e), this.translation = this.accel ? "translate3d" : "translate";
},
initComponents: function() {
this.createChrome(this.tools), this.inherited(arguments);
},
destroy: function() {
this.container.removeClass("enyo-touch-strategy-container"), this.inherited(arguments);
},
rendered: function() {
this.inherited(arguments), enyo.makeBubble(this.$.client, "scroll"), this.calcBoundaries(), this.syncScrollMath(), this.thumb && this.alertThumbs();
},
scrimChanged: function() {
this.scrim && !this.$.scrim && this.makeScrim(), !this.scrim && this.$.scrim && this.$.scrim.destroy();
},
makeScrim: function() {
var e = this.controlParent;
this.controlParent = null, this.createChrome(this.scrimTools), this.controlParent = e;
var t = this.container.hasNode();
t && (this.$.scrim.parentNode = t, this.$.scrim.render());
},
isScrolling: function() {
var e = this.$.scrollMath;
return e ? e.isScrolling() : this.scrolling;
},
isOverscrolling: function() {
var e = this.$.scrollMath || this;
return this.overscroll ? e.isInOverScroll() : !1;
},
domScroll: function() {
this.isScrolling() || (this.calcBoundaries(), this.syncScrollMath(), this.thumb && this.alertThumbs());
},
horizontalChanged: function() {
this.$.scrollMath.horizontal = this.horizontal != "hidden";
},
verticalChanged: function() {
this.$.scrollMath.vertical = this.vertical != "hidden";
},
maxHeightChanged: function() {
this.$.client.applyStyle("max-height", this.maxHeight), this.$.client.addRemoveClass("enyo-scrollee-fit", !this.maxHeight);
},
thumbChanged: function() {
this.hideThumbs();
},
stop: function() {
this.isScrolling() && this.$.scrollMath.stop(!0);
},
stabilize: function() {
this.$.scrollMath && this.$.scrollMath.stabilize();
},
scrollTo: function(e, t) {
this.stop(), this.$.scrollMath.scrollTo(e, t || t === 0 ? t : null);
},
scrollIntoView: function() {
this.stop(), this.inherited(arguments);
},
setScrollLeft: function() {
this.stop(), this.inherited(arguments);
},
setScrollTop: function() {
this.stop(), this.inherited(arguments);
},
getScrollLeft: function() {
return this.isScrolling() ? this.scrollLeft : this.inherited(arguments);
},
getScrollTop: function() {
return this.isScrolling() ? this.scrollTop : this.inherited(arguments);
},
calcScrollNode: function() {
return this.$.client.hasNode();
},
calcAutoScrolling: function() {
var e = this.vertical == "auto", t = this.horizontal == "auto" || this.horizontal == "default";
if ((e || t) && this.scrollNode) {
var n = this.getScrollBounds();
e && (this.$.scrollMath.vertical = n.height > n.clientHeight), t && (this.$.scrollMath.horizontal = n.width > n.clientWidth);
}
},
shouldDrag: function(e, t) {
this.calcAutoScrolling();
var n = t.vertical, r = this.$.scrollMath.horizontal && !n, i = this.$.scrollMath.vertical && n, s = t.dy < 0, o = t.dx < 0, u = !s && this.startEdges.top || s && this.startEdges.bottom, a = !o && this.startEdges.left || o && this.startEdges.right;
!t.boundaryDragger && (r || i) && (t.boundaryDragger = this);
if (!u && i || !a && r) return t.dragger = this, !0;
},
flick: function(e, t) {
var n = Math.abs(t.xVelocity) > Math.abs(t.yVelocity) ? this.$.scrollMath.horizontal : this.$.scrollMath.vertical;
if (n && this.dragging) return this.$.scrollMath.flick(t), this.preventDragPropagation;
},
hold: function(e, t) {
if (this.isScrolling() && !this.isOverscrolling()) {
var n = this.$.scrollMath || this;
return n.stop(t), !0;
}
},
move: function(e, t) {},
dragstart: function(e, t) {
if (!this.dragDuringGesture && t.srcEvent.touches && t.srcEvent.touches.length > 1) return !0;
this.doShouldDrag(t), this.dragging = t.dragger == this || !t.dragger && t.boundaryDragger == this;
if (this.dragging) {
t.preventDefault(), this.syncScrollMath(), this.$.scrollMath.startDrag(t);
if (this.preventDragPropagation) return !0;
}
},
drag: function(e, t) {
if (this.listReordering) return !1;
this.dragging && (t.preventDefault(), this.$.scrollMath.drag(t), this.scrim && this.$.scrim.show());
},
dragfinish: function(e, t) {
this.dragging && (t.preventTap(), this.$.scrollMath.dragFinish(), this.dragging = !1, this.scrim && this.$.scrim.hide());
},
mousewheel: function(e, t) {
if (!this.dragging) {
this.calcBoundaries(), this.syncScrollMath(), this.stabilize();
if (this.$.scrollMath.mousewheel(t)) return t.preventDefault(), !0;
}
},
scrollMathStart: function(e) {
this.scrollNode && (this.calcBoundaries(), this.thumb && this.showThumbs());
},
scrollMathScroll: function(e) {
this.overscroll ? this.effectScroll(-e.x, -e.y) : this.effectScroll(-Math.min(e.leftBoundary, Math.max(e.rightBoundary, e.x)), -Math.min(e.topBoundary, Math.max(e.bottomBoundary, e.y))), this.thumb && this.updateThumbs();
},
scrollMathStop: function(e) {
this.effectScrollStop(), this.thumb && this.delayHideThumbs(100);
},
calcBoundaries: function() {
var e = this.$.scrollMath || this, t = this._getScrollBounds();
e.bottomBoundary = t.clientHeight - t.height, e.rightBoundary = t.clientWidth - t.width;
},
syncScrollMath: function() {
var e = this.$.scrollMath;
e && (e.setScrollX(-this.getScrollLeft()), e.setScrollY(-this.getScrollTop()));
},
effectScroll: function(e, t) {
this.scrollNode && (this.scrollLeft = this.scrollNode.scrollLeft = e, this.scrollTop = this.scrollNode.scrollTop = t, this.effectOverscroll(Math.round(e), Math.round(t)));
},
effectScrollStop: function() {
this.effectOverscroll(null, null);
},
effectOverscroll: function(e, t) {
var n = this.scrollNode, r = "0", i = "0", s = this.accel ? ",0" : "";
t !== null && Math.abs(t - n.scrollTop) > 1 && (i = n.scrollTop - t), e !== null && Math.abs(e - n.scrollLeft) > 1 && (r = n.scrollLeft - e), this.transform ? enyo.dom.transformValue(this.$.client, this.translation, r + "px, " + i + "px" + s) : this.$.client.setBounds({
left: r + "px",
top: i + "px"
});
},
getOverScrollBounds: function() {
var e = this.$.scrollMath || this;
return {
overleft: Math.min(e.leftBoundary - e.x, 0) || Math.max(e.rightBoundary - e.x, 0),
overtop: Math.min(e.topBoundary - e.y, 0) || Math.max(e.bottomBoundary - e.y, 0)
};
},
_getScrollBounds: function() {
var e = this.inherited(arguments);
return enyo.mixin(e, this.getOverScrollBounds()), e;
},
getScrollBounds: function() {
return this.stop(), this.inherited(arguments);
},
alertThumbs: function() {
this.showThumbs(), this.delayHideThumbs(500);
},
syncThumbs: function() {
this.$.vthumb.sync(this), this.$.hthumb.sync(this);
},
updateThumbs: function() {
this.$.vthumb.update(this), this.$.hthumb.update(this);
},
showThumbs: function() {
this.syncThumbs(), this.horizontal != "hidden" && this.$.hthumb.show(), this.vertical != "hidden" && this.$.vthumb.show();
},
hideThumbs: function() {
this.$.vthumb.hide(), this.$.hthumb.hide();
},
delayHideThumbs: function(e) {
this.$.vthumb.delayHide(e), this.$.hthumb.delayHide(e);
}
}), enyo.kind({
name: "enyo.TranslateScrollStrategy",
kind: "TouchScrollStrategy",
translateOptimized: !1,
components: [ {
name: "clientContainer",
classes: "enyo-touch-scroller",
components: [ {
name: "client"
} ]
} ],
rendered: function() {
this.inherited(arguments), enyo.makeBubble(this.$.clientContainer, "scroll");
},
getScrollSize: function() {
var e = this.$.client.hasNode();
return {
width: e ? e.scrollWidth : 0,
height: e ? e.scrollHeight : 0
};
},
create: function() {
this.inherited(arguments), enyo.dom.transformValue(this.$.client, this.translation, "0,0,0");
},
calcScrollNode: function() {
return this.$.clientContainer.hasNode();
},
maxHeightChanged: function() {
this.$.client.applyStyle("min-height", this.maxHeight ? null : "100%"), this.$.client.applyStyle("max-height", this.maxHeight), this.$.clientContainer.addRemoveClass("enyo-scrollee-fit", !this.maxHeight);
},
shouldDrag: function(e, t) {
return this.stop(), this.calcStartInfo(), this.inherited(arguments);
},
syncScrollMath: function() {
this.translateOptimized || this.inherited(arguments);
},
setScrollLeft: function(e) {
this.stop();
if (this.translateOptimized) {
var t = this.$.scrollMath;
t.setScrollX(-e), t.stabilize();
} else this.inherited(arguments);
},
setScrollTop: function(e) {
this.stop();
if (this.translateOptimized) {
var t = this.$.scrollMath;
t.setScrollY(-e), t.stabilize();
} else this.inherited(arguments);
},
getScrollLeft: function() {
return this.translateOptimized ? this.scrollLeft : this.inherited(arguments);
},
getScrollTop: function() {
return this.translateOptimized ? this.scrollTop : this.inherited(arguments);
},
scrollMathStart: function(e) {
this.inherited(arguments), this.scrollStarting = !0, this.startX = 0, this.startY = 0, !this.translateOptimized && this.scrollNode && (this.startX = this.getScrollLeft(), this.startY = this.getScrollTop());
},
scrollMathScroll: function(e) {
this.overscroll ? (this.scrollLeft = -e.x, this.scrollTop = -e.y) : (this.scrollLeft = -Math.min(e.leftBoundary, Math.max(e.rightBoundary, e.x)), this.scrollTop = -Math.min(e.topBoundary, Math.max(e.bottomBoundary, e.y))), this.isScrolling() && (this.$.scrollMath.isScrolling() && this.effectScroll(this.startX - this.scrollLeft, this.startY - this.scrollTop), this.thumb && this.updateThumbs());
},
effectScroll: function(e, t) {
var n = e + "px, " + t + "px" + (this.accel ? ",0" : "");
enyo.dom.transformValue(this.$.client, this.translation, n);
},
effectScrollStop: function() {
if (!this.translateOptimized) {
var e = "0,0" + (this.accel ? ",0" : ""), t = this.$.scrollMath, n = this._getScrollBounds(), r = Boolean(n.maxTop + t.bottomBoundary || n.maxLeft + t.rightBoundary);
enyo.dom.transformValue(this.$.client, this.translation, r ? null : e), this.setScrollLeft(this.scrollLeft), this.setScrollTop(this.scrollTop), r && enyo.dom.transformValue(this.$.client, this.translation, e);
}
},
twiddle: function() {
this.translateOptimized && this.scrollNode && (this.scrollNode.scrollTop = 1, this.scrollNode.scrollTop = 0);
},
down: enyo.nop
}), enyo.kind({
name: "enyo.TransitionScrollStrategy",
kind: "enyo.TouchScrollStrategy",
components: [ {
name: "clientContainer",
classes: "enyo-touch-scroller",
components: [ {
name: "client"
} ]
} ],
events: {
onScrollStart: "",
onScroll: "",
onScrollStop: ""
},
handlers: {
ondown: "down",
ondragfinish: "dragfinish",
onwebkitTransitionEnd: "transitionComplete"
},
tools: [ {
name: "vthumb",
kind: "ScrollThumb",
axis: "v",
showing: !0
}, {
name: "hthumb",
kind: "ScrollThumb",
axis: "h",
showing: !1
} ],
kFlickScalar: 600,
topBoundary: 0,
rightBoundary: 0,
bottomBoundary: 0,
leftBoundary: 0,
scrolling: !1,
listener: null,
boundaryX: 0,
boundaryY: 0,
stopTimeout: null,
stopTimeoutMS: 80,
scrollInterval: null,
scrollIntervalMS: 50,
transitions: {
none: "",
scroll: "3.8s cubic-bezier(.19,1,.28,1.0) 0s",
bounce: "0.5s cubic-bezier(0.06,.5,.5,.94) 0s"
},
setScrollLeft: function(e) {
var t = this.scrollLeft;
this.stop(), this.scrollLeft = e;
if (this.isInLeftOverScroll() || this.isInRightOverScroll()) this.scrollLeft = t;
this.effectScroll();
},
setScrollTop: function(e) {
var t = this.scrollTop;
this.stop(), this.scrollTop = e;
if (this.isInTopOverScroll() || this.isInBottomOverScroll()) this.scrollTop = t;
this.effectScroll();
},
setScrollX: function(e) {
this.scrollLeft = -1 * e;
},
setScrollY: function(e) {
this.scrollTop = -1 * e;
},
getScrollLeft: function() {
return this.scrollLeft;
},
getScrollTop: function() {
return this.scrollTop;
},
create: function() {
this.inherited(arguments), enyo.dom.transformValue(this.$.client, this.translation, "0,0,0");
},
destroy: function() {
this.clearCSSTransitionInterval(), this.inherited(arguments);
},
getScrollSize: function() {
var e = this.$.client.hasNode();
return {
width: e ? e.scrollWidth : 0,
height: e ? e.scrollHeight : 0
};
},
horizontalChanged: function() {
this.horizontal == "hidden" && (this.scrollHorizontal = !1);
},
verticalChanged: function() {
this.vertical == "hidden" && (this.scrollVertical = !1);
},
calcScrollNode: function() {
return this.$.clientContainer.hasNode();
},
calcBoundaries: function() {
var e = this._getScrollBounds();
this.bottomBoundary = e.clientHeight - e.height, this.rightBoundary = e.clientWidth - e.width;
},
maxHeightChanged: function() {
this.$.client.applyStyle("min-height", this.maxHeight ? null : "100%"), this.$.client.applyStyle("max-height", this.maxHeight), this.$.clientContainer.addRemoveClass("enyo-scrollee-fit", !this.maxHeight);
},
calcAutoScrolling: function() {
var e = this.getScrollBounds();
this.vertical && (this.scrollVertical = e.height > e.clientHeight), this.horizontal && (this.scrollHorizontal = e.width > e.clientWidth);
},
isInOverScroll: function() {
return this.isInTopOverScroll() || this.isInBottomOverScroll() || this.isInLeftOverScroll() || this.isInRightOverScroll();
},
isInLeftOverScroll: function() {
return this.getScrollLeft() < this.leftBoundary;
},
isInRightOverScroll: function() {
return this.getScrollLeft <= 0 ? !1 : this.getScrollLeft() * -1 < this.rightBoundary;
},
isInTopOverScroll: function() {
return this.getScrollTop() < this.topBoundary;
},
isInBottomOverScroll: function() {
return this.getScrollTop() <= 0 ? !1 : this.getScrollTop() * -1 < this.bottomBoundary;
},
calcStartInfo: function() {
var e = this.getScrollBounds(), t = this.getScrollTop(), n = this.getScrollLeft();
this.startEdges = {
top: t === 0,
bottom: t === e.maxTop,
left: n === 0,
right: n === e.maxLeft
};
},
mousewheel: function(e, t) {
if (!this.dragging) {
this.calcBoundaries(), this.syncScrollMath(), this.stabilize();
var n = this.vertical ? t.wheelDeltaY || t.wheelDelta : 0, r = parseFloat(this.getScrollTop()) + -1 * parseFloat(n);
return r = r * -1 < this.bottomBoundary ? -1 * this.bottomBoundary : r < this.topBoundary ? this.topBoundary : r, this.setScrollTop(r), this.doScroll(), t.preventDefault(), !0;
}
},
scroll: function(e, t) {
this.thumb && this.updateThumbs(), this.calcBoundaries(), this.doScroll();
},
start: function() {
this.startScrolling(), this.doScrollStart();
},
stop: function() {
this.isScrolling() && this.stopScrolling(), this.thumb && this.delayHideThumbs(100), this.doScrollStop();
},
updateX: function() {
var e = window.getComputedStyle(this.$.client.node, null).getPropertyValue(enyo.dom.getCssTransformProp()).split("(")[1];
return e = e == undefined ? 0 : e.split(")")[0].split(",")[4], -1 * parseFloat(e) === this.scrollLeft ? !1 : (this.scrollLeft = -1 * parseFloat(e), !0);
},
updateY: function() {
var e = window.getComputedStyle(this.$.client.node, null).getPropertyValue(enyo.dom.getCssTransformProp()).split("(")[1];
return e = e == undefined ? 0 : e.split(")")[0].split(",")[5], -1 * parseFloat(e) === this.scrollTop ? !1 : (this.scrollTop = -1 * parseFloat(e), !0);
},
effectScroll: function() {
var e = -1 * this.scrollLeft + "px, " + -1 * this.scrollTop + "px" + (this.accel ? ", 0" : "");
enyo.dom.transformValue(this.$.client, this.translation, e);
},
down: function(e, t) {
var n = this;
if (this.isScrolling() && !this.isOverscrolling()) return this.stopTimeout = setTimeout(function() {
n.stop();
}, this.stopTimeoutMS), !0;
},
dragstart: function(e, t) {
this.stopTimeout && clearTimeout(this.stopTimeout);
if (!this.dragDuringGesture && t.srcEvent.touches && t.srcEvent.touches.length > 1) return !0;
this.shouldDrag(t), this.dragging = t.dragger == this || !t.dragger && t.boundaryDragger == this;
if (this.dragging) {
this.isScrolling() && this.stopScrolling(), this.thumb && this.showThumbs(), t.preventDefault(), this.prevY = t.pageY, this.prevX = t.pageX;
if (this.preventDragPropagation) return !0;
}
},
shouldDrag: function(e) {
return this.calcStartInfo(), this.calcBoundaries(), this.calcAutoScrolling(), this.scrollHorizontal ? this.scrollVertical ? this.shouldDragVertical(e) || this.shouldDragHorizontal(e) : this.shouldDragHorizontal(e) : this.shouldDragVertical(e);
},
shouldDragVertical: function(e) {
var t = this.canDragVertical(e), n = this.oobVertical(e);
!e.boundaryDragger && t && (e.boundaryDragger = this);
if (!n && t) return e.dragger = this, !0;
},
shouldDragHorizontal: function(e) {
var t = this.canDragHorizontal(e), n = this.oobHorizontal(e);
!e.boundaryDragger && t && (e.boundaryDragger = this);
if (!n && t) return e.dragger = this, !0;
},
canDragVertical: function(e) {
return this.scrollVertical && e.vertical;
},
canDragHorizontal: function(e) {
return this.scrollHorizontal && !e.vertical;
},
oobVertical: function(e) {
var t = e.dy < 0;
return !t && this.startEdges.top || t && this.startEdges.bottom;
},
oobHorizontal: function(e) {
var t = e.dx < 0;
return !t && this.startEdges.left || t && this.startEdges.right;
},
drag: function(e, t) {
if (this.listReordering) return !1;
this.dragging && (t.preventDefault(), this.scrollLeft = this.scrollHorizontal ? this.calculateDragDistance(parseInt(this.getScrollLeft(), 10), -1 * (t.pageX - this.prevX), this.leftBoundary, this.rightBoundary) : this.getScrollLeft(), this.scrollTop = this.scrollVertical ? this.calculateDragDistance(this.getScrollTop(), -1 * (t.pageY - this.prevY), this.topBoundary, this.bottomBoundary) : this.getScrollTop(), this.effectScroll(), this.scroll(), this.prevY = t.pageY, this.prevX = t.pageX, this.resetBoundaryX(), this.resetBoundaryY());
},
calculateDragDistance: function(e, t, n, r) {
var i = e + t;
return this.overscrollDragDamping(e, i, t, n, r);
},
overscrollDragDamping: function(e, t, n, r, i) {
if (t < r || t * -1 < i) n /= 2, t = e + n;
return t;
},
resetBoundaryX: function() {
this.boundaryX = 0;
},
resetBoundaryY: function() {
this.boundaryY = 0;
},
dragfinish: function(e, t) {
this.dragging && (t.preventTap(), this.dragging = !1, this.isScrolling() || this.correctOverflow(), this.scrim && this.$.scrim.hide());
},
correctOverflow: function() {
if (this.isInOverScroll()) {
var e = this.scrollHorizontal ? this.correctOverflowX() : !1, t = this.scrollVertical ? this.correctOverflowY() : !1;
e !== !1 && t !== !1 ? (this.scrollLeft = e !== !1 ? e : this.getScrollLeft(), this.scrollTop = t !== !1 ? t : this.getScrollTop(), this.startOverflowScrolling()) : e !== !1 ? (this.scrollLeft = e, this.scrollTop = this.targetScrollTop || this.scrollTop, this.targetScrollLeft = this.getScrollLeft(), this.vertical ? this.startScrolling() : this.startOverflowScrolling()) : t !== !1 && (this.scrollTop = t, this.scrollLeft = this.targetScrollLeft || this.scrollLeft, this.targetScrollTop = this.getScrollTop(), this.scrollHorizontal ? this.startScrolling() : this.startOverflowScrolling());
}
},
correctOverflowX: function() {
if (this.isInLeftOverScroll()) {
if (this.beyondBoundary(this.getScrollLeft(), this.leftBoundary, this.boundaryX)) return this.leftBoundary;
} else if (this.isInRightOverScroll() && this.beyondBoundary(this.getScrollLeft(), this.rightBoundary, this.boundaryX)) return -1 * this.rightBoundary;
return !1;
},
correctOverflowY: function() {
if (this.isInTopOverScroll()) {
if (this.beyondBoundary(this.getScrollTop(), this.topBoundary, this.boundaryY)) return this.topBoundary;
} else if (this.isInBottomOverScroll() && this.beyondBoundary(this.getScrollTop(), this.bottomBoundary, this.boundaryY)) return -1 * this.bottomBoundary;
return !1;
},
beyondBoundary: function(e, t, n) {
return Math.abs(Math.abs(t) - Math.abs(e)) > Math.abs(n);
},
flick: function(e, t) {
if (this.dragging && this.flickOnEnabledAxis(t)) return this.scrollLeft = this.scrollHorizontal ? this.calculateFlickDistance(this.scrollLeft, -1 * t.xVelocity) : this.getScrollLeft(), this.scrollTop = this.scrollVertical ? this.calculateFlickDistance(this.scrollTop, -1 * t.yVelocity) : this.getScrollTop(), this.targetScrollLeft = this.scrollLeft, this.targetScrollTop = this.scrollTop, this.boundaryX = null, this.boundaryY = null, this.isInLeftOverScroll() ? this.boundaryX = this.figureBoundary(this.getScrollLeft()) : this.isInRightOverScroll() && (this.boundaryX = this.figureBoundary(-1 * this.bottomBoundary - this.getScrollLeft())), this.isInTopOverScroll() ? this.boundaryY = this.figureBoundary(this.getScrollTop()) : this.isInBottomOverScroll() && (this.boundaryY = this.figureBoundary(-1 * this.bottomBoundary - this.getScrollTop())), this.startScrolling(), this.preventDragPropagation;
},
flickOnEnabledAxis: function(e) {
return Math.abs(e.xVelocity) > Math.abs(e.yVelocity) ? this.scrollHorizontal : this.scrollVertical;
},
calculateFlickDistance: function(e, t) {
return e + t * this.kFlickScalar;
},
startScrolling: function() {
this.applyTransition("scroll"), this.effectScroll(), this.setCSSTransitionInterval(), this.scrolling = !0;
},
startOverflowScrolling: function() {
this.applyTransition("bounce"), this.effectScroll(), this.setOverflowTransitionInterval(), this.scrolling = !0;
},
applyTransition: function(e) {
var t = this.translation + ": " + this.transitions[e];
this.$.client.applyStyle("-webkit-transition", this.transitions[e]);
},
stopScrolling: function() {
this.resetCSSTranslationVals(), this.clearCSSTransitionInterval(), this.scrolling = !1;
},
setCSSTransitionInterval: function() {
this.clearCSSTransitionInterval(), this.scrollInterval = setInterval(enyo.bind(this, function() {
this.updateScrollPosition(), this.correctOverflow();
}), this.scrollIntervalMS);
},
setOverflowTransitionInterval: function() {
this.clearCSSTransitionInterval(), this.scrollInterval = setInterval(enyo.bind(this, function() {
this.updateScrollPosition();
}), this.scrollIntervalMS);
},
updateScrollPosition: function() {
var e = this.updateY(), t = this.updateX();
this.scroll(), !e && !t && this.stop();
},
clearCSSTransitionInterval: function() {
this.scrollInterval && (clearInterval(this.scrollInterval), this.scrollInterval = null);
},
resetCSSTranslationVals: function() {
var e = enyo.dom.getCssTransformProp(), t = window.getComputedStyle(this.$.client.node, null).getPropertyValue(e).split("(")[1].split(")")[0].split(",");
this.applyTransition("none"), this.scrollLeft = -1 * t[4], this.scrollTop = -1 * t[5], this.effectScroll();
},
figureBoundary: function(e) {
var t = Math.abs(e), n = t - t / Math.pow(t, .02);
return n = e < 0 ? -1 * n : n, n;
},
transitionComplete: function(e, t) {
if (t.originator !== this.$.client) return;
var n = !1;
this.isInTopOverScroll() ? (n = !0, this.scrollTop = this.topBoundary) : this.isInBottomOverScroll() && (n = !0, this.scrollTop = -1 * this.bottomBoundary), this.isInLeftOverScroll() ? (n = !0, this.scrollLeft = this.leftBoundary) : this.isInRightOverScroll() && (n = !0, this.scrollLeft = -1 * this.rightBoundary), n ? this.startOverflowScrolling() : this.stop();
},
scrollTo: function(e, t) {
this.setScrollTop(t), this.setScrollLeft(e), this.start();
},
getOverScrollBounds: function() {
return {
overleft: Math.min(this.leftBoundary + this.scrollLeft, 0) || Math.max(this.rightBoundary + this.scrollLeft, 0),
overtop: Math.min(this.topBoundary + this.scrollTop, 0) || Math.max(this.bottomBoundary + this.scrollTop, 0)
};
}
}), enyo.kind({
name: "enyo.Scroller",
published: {
horizontal: "default",
vertical: "default",
scrollTop: 0,
scrollLeft: 0,
maxHeight: null,
touch: !1,
strategyKind: "ScrollStrategy",
thumb: !0
},
events: {
onScrollStart: "",
onScroll: "",
onScrollStop: ""
},
touchOverscroll: !0,
preventDragPropagation: !0,
preventScrollPropagation: !0,
handlers: {
onscroll: "domScroll",
onScrollStart: "scrollStart",
onScroll: "scroll",
onScrollStop: "scrollStop"
},
classes: "enyo-scroller",
statics: {
osInfo: [ {
os: "android",
version: 3
}, {
os: "androidChrome",
version: 18
}, {
os: "androidFirefox",
version: 16
}, {
os: "firefoxOS",
version: 16
}, {
os: "ios",
version: 5
}, {
os: "webos",
version: 1e9
}, {
os: "blackberry",
version: 1e9
} ],
hasTouchScrolling: function() {
for (var e = 0, t, n; t = this.osInfo[e]; e++) if (enyo.platform[t.os]) return !0;
if (enyo.platform.ie >= 10 && enyo.platform.touch) return !0;
},
hasNativeScrolling: function() {
for (var e = 0, t, n; t = this.osInfo[e]; e++) if (enyo.platform[t.os] < t.version) return !1;
return !0;
},
getTouchStrategy: function() {
return enyo.platform.android >= 3 ? "TranslateScrollStrategy" : "TouchScrollStrategy";
}
},
controlParentName: "strategy",
create: function() {
this.inherited(arguments), this.horizontalChanged(), this.verticalChanged();
},
importProps: function(e) {
this.inherited(arguments), e && e.strategyKind === undefined && (enyo.Scroller.touchScrolling || this.touch) && (this.strategyKind = enyo.Scroller.getTouchStrategy());
},
initComponents: function() {
this.strategyKindChanged(), this.inherited(arguments);
},
teardownChildren: function() {
this.cacheScrollPosition(), this.inherited(arguments);
},
rendered: function() {
this.inherited(arguments), this.restoreScrollPosition();
},
strategyKindChanged: function() {
this.$.strategy && (this.$.strategy.destroy(), this.controlParent = null), this.createStrategy(), this.hasNode() && this.render();
},
createStrategy: function() {
this.createComponents([ {
name: "strategy",
maxHeight: this.maxHeight,
kind: this.strategyKind,
thumb: this.thumb,
preventDragPropagation: this.preventDragPropagation,
overscroll: this.touchOverscroll,
isChrome: !0
} ]);
},
getStrategy: function() {
return this.$.strategy;
},
maxHeightChanged: function() {
this.$.strategy.setMaxHeight(this.maxHeight);
},
showingChanged: function() {
this.showing || (this.cacheScrollPosition(), this.setScrollLeft(0), this.setScrollTop(0)), this.inherited(arguments), this.showing && this.restoreScrollPosition();
},
thumbChanged: function() {
this.$.strategy.setThumb(this.thumb);
},
cacheScrollPosition: function() {
this.cachedPosition = {
left: this.getScrollLeft(),
top: this.getScrollTop()
};
},
restoreScrollPosition: function() {
this.cachedPosition && (this.setScrollLeft(this.cachedPosition.left), this.setScrollTop(this.cachedPosition.top), this.cachedPosition = null);
},
horizontalChanged: function() {
this.$.strategy.setHorizontal(this.horizontal);
},
verticalChanged: function() {
this.$.strategy.setVertical(this.vertical);
},
setScrollLeft: function(e) {
this.scrollLeft = e, this.$.strategy.setScrollLeft(this.scrollLeft);
},
setScrollTop: function(e) {
this.scrollTop = e, this.$.strategy.setScrollTop(e);
},
getScrollLeft: function() {
return this.$.strategy.getScrollLeft();
},
getScrollTop: function() {
return this.$.strategy.getScrollTop();
},
getScrollBounds: function() {
return this.$.strategy.getScrollBounds();
},
scrollIntoView: function(e, t) {
this.$.strategy.scrollIntoView(e, t);
},
scrollTo: function(e, t) {
this.$.strategy.scrollTo(e, t);
},
scrollToControl: function(e, t) {
this.scrollToNode(e.hasNode(), t);
},
scrollToNode: function(e, t) {
this.$.strategy.scrollToNode(e, t);
},
domScroll: function(e, t) {
return this.$.strategy.domScroll && t.originator == this && this.$.strategy.scroll(e, t), this.doScroll(t), !0;
},
shouldStopScrollEvent: function(e) {
return this.preventScrollPropagation && e.originator.owner != this.$.strategy;
},
scrollStart: function(e, t) {
return this.shouldStopScrollEvent(t);
},
scroll: function(e, t) {
return t.dispatchTarget ? this.preventScrollPropagation && t.originator != this && t.originator.owner != this.$.strategy : this.shouldStopScrollEvent(t);
},
scrollStop: function(e, t) {
return this.shouldStopScrollEvent(t);
},
scrollToTop: function() {
this.setScrollTop(0);
},
scrollToBottom: function() {
this.setScrollTop(this.getScrollBounds().maxTop);
},
scrollToRight: function() {
this.setScrollLeft(this.getScrollBounds().maxLeft);
},
scrollToLeft: function() {
this.setScrollLeft(0);
},
stabilize: function() {
var e = this.getStrategy();
e.stabilize && e.stabilize();
}
}), enyo.Scroller.hasTouchScrolling() && (enyo.Scroller.prototype.strategyKind = enyo.Scroller.getTouchStrategy()), enyo.kind({
name: "enyo.Animator",
kind: "Component",
published: {
duration: 350,
startValue: 0,
endValue: 1,
node: null,
easingFunction: enyo.easing.cubicOut
},
events: {
onStep: "",
onEnd: "",
onStop: ""
},
constructed: function() {
this.inherited(arguments), this._next = enyo.bind(this, "next");
},
destroy: function() {
this.stop(), this.inherited(arguments);
},
play: function(e) {
return this.stop(), this.reversed = !1, e && enyo.mixin(this, e), this.t0 = this.t1 = enyo.now(), this.value = this.startValue, this.job = !0, this.next(), this;
},
stop: function() {
if (this.isAnimating()) return this.cancel(), this.fire("onStop"), this;
},
reverse: function() {
if (this.isAnimating()) {
this.reversed = !this.reversed;
var e = this.t1 = enyo.now(), t = e - this.t0;
this.t0 = e + t - this.duration;
var n = this.startValue;
return this.startValue = this.endValue, this.endValue = n, this;
}
},
isAnimating: function() {
return Boolean(this.job);
},
requestNext: function() {
this.job = enyo.requestAnimationFrame(this._next, this.node);
},
cancel: function() {
enyo.cancelRequestAnimationFrame(this.job), this.node = null, this.job = null;
},
shouldEnd: function() {
return this.dt >= this.duration;
},
next: function() {
this.t1 = enyo.now(), this.dt = this.t1 - this.t0;
var e = this.fraction = enyo.easedLerp(this.t0, this.duration, this.easingFunction, this.reversed);
this.value = this.startValue + e * (this.endValue - this.startValue), e >= 1 || this.shouldEnd() ? (this.value = this.endValue, this.fraction = 1, this.fire("onStep"), this.fire("onEnd"), this.cancel()) : (this.fire("onStep"), this.requestNext());
},
fire: function(e) {
var t = this[e];
enyo.isString(t) ? this.bubble(e) : t && t.call(this.context || window, this);
}
}), enyo.kind({
name: "enyo.BaseLayout",
kind: enyo.Layout,
layoutClass: "enyo-positioned",
reflow: function() {
enyo.forEach(this.container.children, function(e) {
e.fit !== null && e.addRemoveClass("enyo-fit", e.fit);
}, this);
}
}), enyo.kind({
name: "enyo.Image",
noEvents: !1,
tag: "img",
attributes: {
draggable: "false"
},
create: function() {
this.noEvents && (delete this.attributes.onload, delete this.attributes.onerror), this.inherited(arguments);
},
rendered: function() {
this.inherited(arguments), enyo.makeBubble(this, "load", "error");
}
}), enyo.kind({
name: "enyo.Input",
published: {
value: "",
placeholder: "",
type: "",
disabled: !1,
selectOnFocus: !1
},
events: {
onDisabledChange: ""
},
defaultFocus: !1,
tag: "input",
classes: "enyo-input",
handlers: {
onfocus: "focused",
oninput: "input",
onclear: "clear",
ondragstart: "dragstart"
},
create: function() {
enyo.platform.ie && (this.handlers.onkeyup = "iekeyup"), this.inherited(arguments), this.placeholderChanged(), this.type && this.typeChanged(), this.valueChanged();
},
rendered: function() {
this.inherited(arguments), enyo.makeBubble(this, "focus", "blur"), enyo.platform.ie == 8 && this.setAttribute("onchange", enyo.bubbler), this.disabledChanged(), this.defaultFocus && this.focus();
},
typeChanged: function() {
this.setAttribute("type", this.type);
},
placeholderChanged: function() {
this.setAttribute("placeholder", this.placeholder);
},
disabledChanged: function() {
this.setAttribute("disabled", this.disabled), this.bubble("onDisabledChange");
},
valueChanged: function() {
this.setAttribute("value", this.value), this.getNodeProperty("value", this.value) !== this.value && this.setNodeProperty("value", this.value);
},
iekeyup: function(e, t) {
var n = enyo.platform.ie, r = t.keyCode;
(n <= 8 || n == 9 && (r == 8 || r == 46)) && this.bubble("oninput", t);
},
clear: function() {
this.setValue("");
},
focus: function() {
this.hasNode() && this.node.focus();
},
hasFocus: function() {
if (this.hasNode()) return document.activeElement === this.node;
},
dragstart: function() {
return this.hasFocus();
},
focused: function() {
this.selectOnFocus && enyo.asyncMethod(this, "selectContents");
},
selectContents: function() {
var e = this.hasNode();
if (e && e.setSelectionRange) e.setSelectionRange(0, e.value.length); else if (e && e.createTextRange) {
var t = e.createTextRange();
t.expand("textedit"), t.select();
}
},
input: function() {
var e = this.getNodeProperty("value");
this.setValue(e);
}
}), enyo.kind({
name: "enyo.RichText",
classes: "enyo-richtext enyo-selectable",
published: {
allowHtml: !0,
disabled: !1,
value: ""
},
defaultFocus: !1,
statics: {
osInfo: [ {
os: "android",
version: 3
}, {
os: "ios",
version: 5
} ],
hasContentEditable: function() {
for (var e = 0, t, n; t = enyo.RichText.osInfo[e]; e++) if (enyo.platform[t.os] < t.version) return !1;
return !0;
}
},
kind: enyo.Input,
attributes: {
contenteditable: !0
},
handlers: {
onfocus: "focusHandler",
onblur: "blurHandler"
},
create: function() {
this.setTag(enyo.RichText.hasContentEditable() ? "div" : "textarea"), this.inherited(arguments);
},
focusHandler: function() {
this._value = this.getValue();
},
blurHandler: function() {
this._value !== this.getValue() && this.bubble("onchange");
},
valueChanged: function() {
this.hasFocus() ? (this.selectAll(), this.insertAtCursor(this.value)) : this.set("content", this.get("value"));
},
getValue: function() {
if (this.hasNode()) return this.node.innerHTML;
},
hasFocus: function() {
if (this.hasNode()) return document.activeElement === this.node;
},
getSelection: function() {
if (this.hasFocus()) return window.getSelection();
},
removeSelection: function(e) {
var t = this.getSelection();
t && t[e ? "collapseToStart" : "collapseToEnd"]();
},
modifySelection: function(e, t, n) {
var r = this.getSelection();
r && r.modify(e || "move", t, n);
},
moveCursor: function(e, t) {
this.modifySelection("move", e, t);
},
moveCursorToEnd: function() {
this.moveCursor("forward", "documentboundary");
},
moveCursorToStart: function() {
this.moveCursor("backward", "documentboundary");
},
selectAll: function() {
this.hasFocus() && document.execCommand("selectAll");
},
insertAtCursor: function(e) {
if (this.hasFocus()) {
var t = this.allowHtml ? e : enyo.Control.escapeHtml(e).replace(/\n/g, "<br/>");
document.execCommand("insertHTML", !1, t);
}
}
}), enyo.kind({
name: "enyo.TextArea",
kind: enyo.Input,
tag: "textarea",
classes: "enyo-textarea",
rendered: function() {
this.inherited(arguments), this.valueChanged();
}
}), enyo.kind({
name: "enyo.Select",
published: {
selected: 0
},
handlers: {
onchange: "change"
},
tag: "select",
defaultKind: "enyo.Option",
rendered: function() {
this.inherited(arguments), enyo.platform.ie == 8 && this.setAttribute("onchange", enyo.bubbler), this.selectedChanged();
},
getSelected: function() {
return Number(this.getNodeProperty("selectedIndex", this.selected));
},
selectedChanged: function() {
this.setNodeProperty("selectedIndex", this.selected);
},
change: function() {
this.selected = this.getSelected();
},
render: function() {
enyo.platform.ie ? this.parent.render() : this.inherited(arguments);
},
getValue: function() {
if (this.hasNode()) return this.node.value;
}
}), enyo.kind({
name: "enyo.Option",
published: {
value: ""
},
tag: "option",
create: function() {
this.inherited(arguments), this.valueChanged();
},
valueChanged: function() {
this.setAttribute("value", this.value);
}
}), enyo.kind({
name: "enyo.OptionGroup",
published: {
label: ""
},
tag: "optgroup",
defaultKind: "enyo.Option",
create: function() {
this.inherited(arguments), this.labelChanged();
},
labelChanged: function() {
this.setAttribute("label", this.label);
}
}), enyo.kind({
name: "enyo.Group",
published: {
highlander: !0,
active: null
},
handlers: {
onActivate: "activate"
},
activate: function(e, t) {
this.highlander && (t.originator.active ? this.setActive(t.originator) : t.originator == this.active && this.active.setActive(!0));
},
activeChanged: function(e) {
e && (e.setActive(!1), e.removeClass("active")), this.active && this.active.addClass("active");
}
}), enyo.kind({
name: "enyo.GroupItem",
published: {
active: !1
},
rendered: function() {
this.inherited(arguments), this.activeChanged();
},
activeChanged: function() {
this.bubble("onActivate");
}
}), enyo.kind({
name: "enyo.ToolDecorator",
kind: enyo.GroupItem,
classes: "enyo-tool-decorator"
}), enyo.kind({
name: "enyo.Button",
kind: enyo.ToolDecorator,
tag: "button",
attributes: {
type: "button"
},
published: {
disabled: !1
},
create: function() {
this.inherited(arguments), this.disabledChanged();
},
disabledChanged: function() {
this.setAttribute("disabled", this.disabled);
},
tap: function() {
if (this.disabled) return !0;
this.setActive(!0);
}
}), enyo.kind({
name: "enyo.Checkbox",
kind: enyo.Input,
classes: "enyo-checkbox",
events: {
onActivate: ""
},
published: {
checked: !1,
active: !1,
type: "checkbox"
},
kindClasses: "",
handlers: {
onchange: "change",
onclick: "click"
},
create: function() {
this.inherited(arguments);
},
rendered: function() {
this.inherited(arguments), this.active && this.activeChanged(), this.checkedChanged();
},
checkedChanged: function() {
this.setNodeProperty("checked", this.checked), this.setAttribute("checked", this.checked ? "checked" : ""), this.setActive(this.checked);
},
activeChanged: function() {
this.active = enyo.isTrue(this.active), this.setChecked(this.active), this.bubble("onActivate");
},
setValue: function(e) {
this.setChecked(enyo.isTrue(e));
},
getValue: function() {
return this.getChecked();
},
valueChanged: function() {},
change: function() {
var e = enyo.isTrue(this.getNodeProperty("checked"));
this.setActive(e);
},
click: function(e, t) {
enyo.platform.ie <= 8 && this.bubble("onchange", t);
}
}), enyo.kind({
name: "enyo.Repeater",
published: {
count: 0
},
events: {
onSetupItem: ""
},
create: function() {
this.inherited(arguments), this.countChanged();
},
initComponents: function() {
this.itemComponents = this.components || this.kindComponents, this.components = this.kindComponents = null, this.inherited(arguments);
},
countChanged: function() {
this.build();
},
itemAtIndex: function(e) {
return this.controlAtIndex(e);
},
build: function() {
this.destroyClientControls();
for (var e = 0, t; e < this.count; e++) t = this.createComponent({
kind: "enyo.OwnerProxy",
index: e
}), t.createComponents(this.itemComponents), this.doSetupItem({
index: e,
item: t
});
this.render();
},
renderRow: function(e) {
var t = this.itemAtIndex(e);
this.doSetupItem({
index: e,
item: t
});
}
}), enyo.kind({
name: "enyo.OwnerProxy",
tag: null,
decorateEvent: function(e, t, n) {
t && (t.index = this.index), this.inherited(arguments);
},
delegateEvent: function(e, t, n, r, i) {
return e == this && (e = this.owner.owner), this.inherited(arguments, [ e, t, n, r, i ]);
}
}), enyo.kind({
name: "enyo._DragAvatar",
style: "position: absolute; z-index: 10; pointer-events: none; cursor: move;",
showing: !1,
showingChanged: function() {
this.inherited(arguments), document.body.style.cursor = this.showing ? "move" : null;
}
}), enyo.kind({
name: "enyo.DragAvatar",
kind: enyo.Component,
published: {
showing: !1,
offsetX: 20,
offsetY: 30
},
initComponents: function() {
this.avatarComponents = this.components, this.components = null, this.inherited(arguments);
},
requireAvatar: function() {
this.avatar || (this.avatar = this.createComponent({
kind: enyo._DragAvatar,
parentNode: document.body,
showing: !1,
components: this.avatarComponents
}).render());
},
showingChanged: function() {
this.avatar.setShowing(this.showing), document.body.style.cursor = this.showing ? "move" : null;
},
drag: function(e) {
this.requireAvatar(), this.avatar.setBounds({
top: e.pageY - this.offsetY,
left: e.pageX + this.offsetX
}), this.show();
},
show: function() {
this.setShowing(!0);
},
hide: function() {
this.setShowing(!1);
}
}), enyo.kind({
name: "enyo.FloatingLayer",
create: function() {
this.inherited(arguments), this.setParent(null);
},
render: function() {
return this.parentNode = document.body, this.inherited(arguments);
},
generateInnerHtml: function() {
return "";
},
beforeChildRender: function() {
this.hasNode() || this.render();
},
teardownChildren: function() {}
}), enyo.floatingLayer = new enyo.FloatingLayer, enyo.kind({
name: "enyo.Popup",
classes: "enyo-popup enyo-no-touch-action",
published: {
modal: !1,
autoDismiss: !0,
floating: !1,
centered: !1
},
showing: !1,
handlers: {
ondown: "down",
onkeydown: "keydown",
ondragstart: "dragstart",
onfocus: "focus",
onblur: "blur",
onRequestShow: "requestShow",
onRequestHide: "requestHide"
},
captureEvents: !0,
events: {
onShow: "",
onHide: ""
},
tools: [ {
kind: "Signals",
onKeydown: "keydown"
} ],
create: function() {
this.inherited(arguments), this.canGenerate = !this.floating;
},
render: function() {
this.floating && (enyo.floatingLayer.hasNode() || enyo.floatingLayer.render(), this.parentNode = enyo.floatingLayer.hasNode()), this.inherited(arguments);
},
destroy: function() {
this.showing && this.release(), this.inherited(arguments);
},
reflow: function() {
this.updatePosition(), this.inherited(arguments);
},
calcViewportSize: function() {
if (window.innerWidth) return {
width: window.innerWidth,
height: window.innerHeight
};
var e = document.documentElement;
return {
width: e.offsetWidth,
height: e.offsetHeight
};
},
updatePosition: function() {
var e = this.calcViewportSize(), t = this.getBounds();
if (this.targetPosition) {
var n = this.targetPosition;
typeof n.left == "number" ? n.left + t.width > e.width ? (n.left - t.width >= 0 ? n.right = e.width - n.left : n.right = 0, n.left = null) : n.right = null : typeof n.right == "number" && (n.right + t.width > e.width ? (n.right - t.width >= 0 ? n.left = e.width - n.right : n.left = 0, n.right = null) : n.left = null), typeof n.top == "number" ? n.top + t.height > e.height ? (n.top - t.height >= 0 ? n.bottom = e.height - n.top : n.bottom = 0, n.top = null) : n.bottom = null : typeof n.bottom == "number" && (n.bottom + t.height > e.height ? (n.bottom - t.height >= 0 ? n.top = e.height - n.bottom : n.top = 0, n.bottom = null) : n.top = null), this.addStyles("left: " + (n.left !== null ? n.left + "px" : "initial") + "; right: " + (n.right !== null ? n.right + "px" : "initial") + "; top: " + (n.top !== null ? n.top + "px" : "initial") + "; bottom: " + (n.bottom !== null ? n.bottom + "px" : "initial") + ";");
} else this.centered && this.addStyles("top: " + Math.max((e.height - t.height) / 2, 0) + "px; left: " + Math.max((e.width - t.width) / 2, 0) + "px;");
},
showingChanged: function() {
this.floating && this.showing && !this.hasNode() && this.render();
if (this.centered || this.targetPosition) this.applyStyle("visibility", "hidden"), this.addStyles("top: 0px; left: 0px; right: initial; bottom: initial;");
this.inherited(arguments), this.showing ? (this.resized(), this.captureEvents && this.capture()) : this.captureEvents && this.release(), (this.centered || this.targetPosition) && this.applyStyle("visibility", null), this.hasNode() && this[this.showing ? "doShow" : "doHide"]();
},
capture: function() {
enyo.dispatcher.capture(this, !this.modal);
},
release: function() {
enyo.dispatcher.release();
},
down: function(e, t) {
this.downEvent = t, this.modal && !t.dispatchTarget.isDescendantOf(this) && t.preventDefault();
},
tap: function(e, t) {
if (this.autoDismiss && !t.dispatchTarget.isDescendantOf(this) && this.downEvent && !this.downEvent.dispatchTarget.isDescendantOf(this)) return this.downEvent = null, this.hide(), !0;
},
dragstart: function(e, t) {
var n = t.dispatchTarget === this || t.dispatchTarget.isDescendantOf(this);
return e.autoDismiss && !n && e.setShowing(!1), !0;
},
keydown: function(e, t) {
this.showing && this.autoDismiss && t.keyCode == 27 && this.hide();
},
blur: function(e, t) {
t.dispatchTarget.isDescendantOf(this) && (this.lastFocus = t.originator);
},
focus: function(e, t) {
var n = t.dispatchTarget;
if (this.modal && !n.isDescendantOf(this)) {
n.hasNode() && n.node.blur();
var r = this.lastFocus && this.lastFocus.hasNode() || this.hasNode();
r && r.focus();
}
},
requestShow: function(e, t) {
return this.show(), !0;
},
requestHide: function(e, t) {
return this.hide(), !0;
},
showAtEvent: function(e, t) {
var n = {
left: e.centerX || e.clientX || e.pageX,
top: e.centerY || e.clientY || e.pageY
};
t && (n.left += t.left || 0, n.top += t.top || 0), this.showAtPosition(n);
},
showAtPosition: function(e) {
this.targetPosition = e, this.show();
}
}), enyo.kind({
name: "enyo.Selection",
kind: enyo.Component,
published: {
multi: !1
},
events: {
onSelect: "",
onDeselect: "",
onChange: ""
},
create: function() {
this.clear(), this.inherited(arguments);
},
multiChanged: function() {
this.multi || this.clear(), this.doChange();
},
highlander: function(e) {
this.multi || this.deselect(this.lastSelected);
},
clear: function() {
this.selected = {};
},
isSelected: function(e) {
return this.selected[e];
},
setByKey: function(e, t, n) {
if (t) this.selected[e] = n || !0, this.lastSelected = e, this.doSelect({
key: e,
data: this.selected[e]
}); else {
var r = this.isSelected(e);
delete this.selected[e], this.doDeselect({
key: e,
data: r
});
}
this.doChange();
},
deselect: function(e) {
this.isSelected(e) && this.setByKey(e, !1);
},
select: function(e, t) {
this.multi ? this.setByKey(e, !this.isSelected(e), t) : this.isSelected(e) || (this.highlander(), this.setByKey(e, !0, t));
},
toggle: function(e, t) {
!this.multi && this.lastSelected != e && this.deselect(this.lastSelected), this.setByKey(e, !this.isSelected(e), t);
},
getSelected: function() {
return this.selected;
},
remove: function(e) {
var t = {};
for (var n in this.selected) n < e ? t[n] = this.selected[n] : n > e && (t[n - 1] = this.selected[n]);
this.selected = t;
}
}), enyo.kind({
name: "enyo.defaultRootView",
kind: "enyo.Control",
content: "No root view was passed to enyo.App"
});
