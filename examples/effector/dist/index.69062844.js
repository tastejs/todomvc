// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x) {
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"lVHAe":[function(require,module,exports) {
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "4a236f9275d0a351";
module.bundle.HMR_BUNDLE_ID = "b884aa5669062844";
"use strict";
function _createForOfIteratorHelper(o, allowArrayLike) {
    var it;
    if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
        if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
            if (it) o = it;
            var i = 0;
            var F = function F() {
            };
            return {
                s: F,
                n: function n() {
                    if (i >= o.length) return {
                        done: true
                    };
                    return {
                        done: false,
                        value: o[i++]
                    };
                },
                e: function e(_e) {
                    throw _e;
                },
                f: F
            };
        }
        throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var normalCompletion = true, didErr = false, err;
    return {
        s: function s() {
            it = o[Symbol.iterator]();
        },
        n: function n() {
            var step = it.next();
            normalCompletion = step.done;
            return step;
        },
        e: function e(_e2) {
            didErr = true;
            err = _e2;
        },
        f: function f() {
            try {
                if (!normalCompletion && it.return != null) it.return();
            } finally{
                if (didErr) throw err;
            }
        }
    };
}
function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
/* global HMR_HOST, HMR_PORT, HMR_ENV_HASH, HMR_SECURE */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: mixed;
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
*/ var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData,
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function accept(fn) {
            this._acceptCallbacks.push(fn || function() {
            });
        },
        dispose: function dispose(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData = undefined;
}
module.bundle.Module = Module;
var checkedAssets, acceptedAssets, assetsToAccept;
function getHostname() {
    return HMR_HOST || (location.protocol.indexOf('http') === 0 ? location.hostname : 'localhost');
}
function getPort() {
    return HMR_PORT || location.port;
} // eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
    var hostname = getHostname();
    var port = getPort();
    var protocol = HMR_SECURE || location.protocol == 'https:' && !/localhost|127.0.0.1|0.0.0.0/.test(hostname) ? 'wss' : 'ws';
    var ws = new WebSocket(protocol + '://' + hostname + (port ? ':' + port : '') + '/'); // $FlowFixMe
    ws.onmessage = function(event) {
        checkedAssets = {
        };
        acceptedAssets = {
        };
        assetsToAccept = [];
        var data = JSON.parse(event.data);
        if (data.type === 'update') {
            // Remove error overlay if there is one
            if (typeof document !== 'undefined') removeErrorOverlay();
            var assets = data.assets.filter(function(asset) {
                return asset.envHash === HMR_ENV_HASH;
            }); // Handle HMR Update
            var handled = assets.every(function(asset) {
                return asset.type === 'css' || asset.type === 'js' && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
            });
            if (handled) {
                console.clear();
                assets.forEach(function(asset) {
                    hmrApply(module.bundle.root, asset);
                });
                for(var i = 0; i < assetsToAccept.length; i++){
                    var id = assetsToAccept[i][1];
                    if (!acceptedAssets[id]) hmrAcceptRun(assetsToAccept[i][0], id);
                }
            } else window.location.reload();
        }
        if (data.type === 'error') {
            // Log parcel errors to console
            var _iterator = _createForOfIteratorHelper(data.diagnostics.ansi), _step;
            try {
                for(_iterator.s(); !(_step = _iterator.n()).done;){
                    var ansiDiagnostic = _step.value;
                    var stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
                    console.error('🚨 [parcel]: ' + ansiDiagnostic.message + '\n' + stack + '\n\n' + ansiDiagnostic.hints.join('\n'));
                }
            } catch (err) {
                _iterator.e(err);
            } finally{
                _iterator.f();
            }
            if (typeof document !== 'undefined') {
                // Render the fancy html overlay
                removeErrorOverlay();
                var overlay = createErrorOverlay(data.diagnostics.html); // $FlowFixMe
                document.body.appendChild(overlay);
            }
        }
    };
    ws.onerror = function(e) {
        console.error(e.message);
    };
    ws.onclose = function() {
        console.warn('[parcel] 🚨 Connection to the HMR server was lost');
    };
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log('[parcel] ✨ Error resolved');
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    var errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    var _iterator2 = _createForOfIteratorHelper(diagnostics), _step2;
    try {
        for(_iterator2.s(); !(_step2 = _iterator2.n()).done;){
            var diagnostic = _step2.value;
            var stack = diagnostic.codeframe ? diagnostic.codeframe : diagnostic.stack;
            errorHTML += "\n      <div>\n        <div style=\"font-size: 18px; font-weight: bold; margin-top: 20px;\">\n          \uD83D\uDEA8 ".concat(diagnostic.message, "\n        </div>\n        <pre>").concat(stack, "</pre>\n        <div>\n          ").concat(diagnostic.hints.map(function(hint) {
                return '<div>💡 ' + hint + '</div>';
            }).join(''), "\n        </div>\n        ").concat(diagnostic.documentation ? "<div>\uD83D\uDCDD <a style=\"color: violet\" href=\"".concat(diagnostic.documentation, "\" target=\"_blank\">Learn more</a></div>") : '', "\n      </div>\n    ");
        }
    } catch (err) {
        _iterator2.e(err);
    } finally{
        _iterator2.f();
    }
    errorHTML += '</div>';
    overlay.innerHTML = errorHTML;
    return overlay;
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute('href', link.getAttribute('href').split('?')[0] + '?' + Date.now()); // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout) return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href = links[i].getAttribute('href');
            var hostname = getHostname();
            var servedFromHMRServer = hostname === 'localhost' ? new RegExp('^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):' + getPort()).test(href) : href.indexOf(hostname + ':' + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(window.location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrApply(bundle, asset) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === 'css') reloadCSS();
    else if (asset.type === 'js') {
        var deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
        if (deps) {
            var fn = new Function('require', 'module', 'exports', asset.output);
            modules[asset.id] = [
                fn,
                deps
            ];
        } else if (bundle.parent) hmrApply(bundle.parent, asset);
    }
}
function hmrAcceptCheck(bundle, id, depsByBundle) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) return true;
        return hmrAcceptCheck(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return true;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    assetsToAccept.push([
        bundle,
        id
    ]);
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) return true;
    var parents = getParents(module.bundle.root, id); // If no parents, the asset is new. Prevent reloading the page.
    if (!parents.length) return true;
    return parents.some(function(v) {
        return hmrAcceptCheck(v[0], v[1], null);
    });
}
function hmrAcceptRun(bundle, id) {
    var cached = bundle.cache[id];
    bundle.hotData = {
    };
    if (cached && cached.hot) cached.hot.data = bundle.hotData;
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData);
    });
    delete bundle.cache[id];
    bundle(id);
    cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) cached.hot._acceptCallbacks.forEach(function(cb) {
        var assetsToAlsoAccept = cb(function() {
            return getParents(module.bundle.root, id);
        });
        if (assetsToAlsoAccept && assetsToAccept.length) // $FlowFixMe[method-unbinding]
        assetsToAccept.push.apply(assetsToAccept, assetsToAlsoAccept);
    });
    acceptedAssets[id] = true;
}

},{}],"hOJOi":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "App", ()=>App
);
var _effectorDom = require("effector-dom");
var _header = require("./header");
var _main = require("./main");
var _footer = require("./footer");
const App = ()=>{
    // создадим section элемент
    _effectorDom.h('section', ()=>{
        // и укажем ему класс
        _effectorDom.spec({
            attr: {
                class: 'todoapp'
            }
        });
        // также выведем остальные части приложения
        _header.Header();
        _main.Main();
        _footer.Footer();
    });
};
_effectorDom.using(document.body, ()=>{
    App();
});

},{"effector-dom":"bckam","./header":"aey4A","./main":"l5eIm","./footer":"eovH7","@parcel/transformer-js/src/esmodule-helpers.js":"ciiiV"}],"bckam":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "attr", ()=>q
);
parcelHelpers.export(exports, "combine", ()=>Q
);
parcelHelpers.export(exports, "data", ()=>G
);
parcelHelpers.export(exports, "explicitUnmount", ()=>F
);
parcelHelpers.export(exports, "focus", ()=>J
);
parcelHelpers.export(exports, "h", ()=>_
);
parcelHelpers.export(exports, "handler", ()=>H
);
parcelHelpers.export(exports, "list", ()=>V
);
parcelHelpers.export(exports, "map", ()=>K
);
parcelHelpers.export(exports, "node", ()=>X
);
parcelHelpers.export(exports, "nodeMethod", ()=>L
);
parcelHelpers.export(exports, "remap", ()=>O
);
parcelHelpers.export(exports, "signalOwn", ()=>M
);
parcelHelpers.export(exports, "spec", ()=>Y
);
parcelHelpers.export(exports, "storeField", ()=>R
);
parcelHelpers.export(exports, "style", ()=>Z
);
parcelHelpers.export(exports, "text", ()=>B
);
parcelHelpers.export(exports, "transform", ()=>W
);
parcelHelpers.export(exports, "tree", ()=>P
);
parcelHelpers.export(exports, "using", ()=>o1
);
parcelHelpers.export(exports, "variant", ()=>ee
);
parcelHelpers.export(exports, "visible", ()=>U
);
var _effector = require("effector");
var process = require("process");
function e2(e, t) {
    const n = de(e);
    for(let e1 = 0; e1 < t.length; e1++){
        const s = de(t[e1]);
        s.family.type = 'crosslink';
        const i = ge(s), l = me(n);
        i.includes(n) || i.push(n), l.includes(s) || l.push(s);
    }
}
function t1(e, t) {
    n1(e, t), s1(t, e);
}
function n1(e, t) {
    e && e !== t && (e.locality.sibling.right.ref = t);
}
function s1(e, t) {
    e && e !== t && (e.locality.sibling.left.ref = t);
}
function i1() {
    const e = {
        stack: null
    }, t = pe.get(), n = _effector.createNode({
        node: [
            ye,
            ve
        ],
        parent: [
            t && t.signal
        ].filter(Boolean),
        meta: {
            unit: 'signal'
        },
        scope: e
    });
    return e.self = n, n;
}
function l1(e) {
    switch(e = String(e)){
        case '__proto__':
        case '__defineGetter__':
        case '__defineSetter__':
        case 'constructor':
        case 'prototype':
        case 'hasOwnProperty':
        case 'toString':
        case 'valueOf':
            return 'blacklisted';
        default:
            return e.replace(ke, '');
    }
}
function r1(e) {
    return String(e).replace(we, '');
}
function o1(e, t) {
    const n = e.namespaceURI, s = e.tagName.toLowerCase(), l = 'http://www.w3.org/2000/svg' === n ? 'svg' : 'foreignObject' === s ? 'foreignObject' : 'html', r = pe.get(), o = {
        parent: r,
        signal: r && r.signal ? r.signal : i1(),
        namespace: l,
        targetElement: e,
        svgRoot: 'svg' === s ? e : r ? r.svgRoot : null,
        child: [],
        locality: {
            sibling: {
                left: {
                    ref: null
                },
                right: {
                    ref: null
                }
            },
            child: {
                first: {
                    ref: null
                },
                last: {
                    ref: null
                }
            }
        },
        node: {
            type: 'using',
            pure: 0,
            attr: [],
            data: [],
            visible: [],
            text: [],
            styleVar: [],
            styleProp: [],
            handler: [],
            transform: [],
            focus: [],
            blur: []
        },
        mountStatus: 'initial',
        visible: 1
    };
    pe.replace(o), ue.push({
        node: e,
        append: [],
        reverse: 0
    });
    try {
        _effector.withRegion(o.signal, t);
    } finally{
        a1(ue.pop()), pe.replace(r);
    }
}
function a1({ node: e , append: t , reverse: n = 0  }) {
    if (0 === t.length) return;
    const s = Ce.createDocumentFragment();
    if (n) {
        for(let e3 = t.length - 1; e3 >= 0; e3--)s.appendChild(t[e3]);
        e.prepend(s);
    } else {
        for(let e4 = 0; e4 < t.length; e4++)s.appendChild(t[e4]);
        e.appendChild(s);
    }
}
function c1(e, t) {
    t.parent = e, t.signal.seq.push(Ie), t.signal.scope.stack = t, e.child.push(t);
}
function f1(e, t) {
    return _effector.createNode({
        node: [
            Ne
        ],
        parent: e,
        meta: {
            op: 'watch'
        },
        scope: {
            fn: t
        },
        family: {
            type: 'crosslink',
            owners: [
                e
            ]
        }
    });
}
function u1() {
    Pe = 0, Oe();
}
function h1(t, n, s) {
    const i = ++Xe, l = _effector.createEvent(), r = _effector.is.store(t) ? t.updates : t, o = {
        type: 'crosslink',
        owners: [
            r,
            l
        ]
    };
    return _effector.createNode({
        node: [
            Ue
        ],
        parent: [
            r
        ],
        scope: {
            taskID: i
        },
        family: o
    }), e2(t, [
        l
    ]), Fe.set(i, _effector.createNode({
        node: [
            Ze
        ],
        child: [
            _effector.createNode({
                node: [
                    We,
                    Be,
                    Ue
                ],
                scope: {
                    taskID: i
                },
                family: o
            }),
            _effector.createNode({
                node: [
                    Ge,
                    Be
                ],
                child: [
                    l
                ],
                family: o
            })
        ],
        scope: {
            fn: n
        },
        family: o
    })), Le.set(i, s), l;
}
function p1({ trigger: e5 = _effector.createEvent() , fn: t , priority: n2 = "low" , timeout: s = 1 / 0 , batchWindow: i = 0 , retries: l2 = 1 / 0 , mark: r2 = e5.shortName  }) {
    const o2 = e5.map((e)=>[
            {
                inserted: Ae(),
                retry: 0,
                value: e
            }
        ]
    );
    return {
        trigger: e5,
        processed: h1(o2, (e, n)=>{
            let r, o = 0;
            const a = [], c = [];
            for(r = 0; r < e.length; r++){
                const l = e[r], f = Ae();
                if (l.inserted + i > f) {
                    c.push(l);
                    continue;
                }
                if (l.inserted + s < f) continue;
                if (f - n >= 10) {
                    o = 1;
                    break;
                }
                const u = t(l.value);
                void 0 !== u && a.push(u);
            }
            if (o) for(let t2 = r; t2 < e.length; t2++){
                const n = e[t2];
                n.retry += 1, n.retry >= l2 || c.push(n);
            }
            return {
                done: a,
                fail: c
            };
        }, n2)
    };
}
function d1({ trigger: e6 = _effector.createEvent() , fn: t3 , priority: n3 = "low" , timeout: s2 = 1 / 0 , batchWindow: i2 = 0 , retries: l3 = 1 / 0 , mark: r3 = e6.shortName , flatten: o3  }) {
    const a2 = e6.map((e)=>{
        const t = [], n = Ae();
        for(let s = 0; s < e.length; s++){
            const i = o3(e[s]);
            for(let e7 = 0; e7 < i.length; e7++)t.push({
                inserted: n,
                retry: 0,
                value: i[e7]
            });
        }
        return t;
    });
    return {
        trigger: e6,
        processed: h1(a2, (e, n)=>{
            let r, o = 0;
            const a = [], c = [];
            for(r = 0; r < e.length; r++){
                const l = e[r], f = Ae();
                if (l.inserted + i2 > f) {
                    c.push(l);
                    continue;
                }
                if (l.inserted + s2 < f) continue;
                if (f - n >= 10) {
                    o = 1;
                    break;
                }
                const u = t3(l.value);
                void 0 !== u && a.push(u);
            }
            if (o) for(let t = r; t < e.length; t++){
                const n = e[t];
                n.retry += 1, n.retry >= l3 || c.push(n);
            }
            return {
                done: a,
                fail: c
            };
        }, n3)
    };
}
function g1(e, t, n) {
    f1(e, t.watch(n));
}
function m1(e, t, n) {
    _effector.createNode({
        node: [
            He
        ],
        parent: t,
        child: [
            Je
        ],
        family: {
            type: 'crosslink',
            owners: e
        },
        scope: {
            handler: n
        },
        meta: {
            op: 'debounceRaf'
        }
    }), _effector.is.store(t) && _effector.launch(Je, {
        data: t.getState(),
        handler: n
    }, 1);
}
function b(e, t, n, s) {
    _effector.is.unit(n) ? (e ? g1 : m1)(t, n, s) : s(n);
}
function y1(e, t = e.child.length - 1) {
    for(let n = t; n >= 0; n--){
        const t = e.child[n];
        switch(t.node.type){
            case 'element':
            case 'using':
                if (!t.visible) continue;
                return t;
        }
        const s = y1(t);
        if (s) return s;
    }
    return null;
}
function v(e) {
    if (!e.parent) return null;
    switch(e.parent.node.type){
        case 'element':
        case 'using':
            {
                const t = y1(e.parent, e.parent.child.indexOf(e) - 1);
                if (t) return t;
                break;
            }
        case 'list':
        case 'listItem':
            {
                let t = e, n = e.parent;
                for(; n;){
                    const e = y1(n, n.child.indexOf(t) - 1);
                    if (e) return e;
                    t = n, n = n.parent;
                }
                break;
            }
    }
    return null;
}
function k(e) {
    return '' !== e && 0 !== e && '0' !== e && (0 == e || null == e);
}
function w(e, t, n) {
    k(n) ? delete e[t] : e[t] = `${n}`;
}
function x(e, t, n, s) {
    if (n.visible = s, s) {
        if (!t.contains(e)) {
            const s = v(n);
            s && t.contains(s.targetElement) ? s.targetElement.after(e) : t.prepend(e);
        }
    } else e.remove();
}
function S(e, t, n) {
    if (null === n) return;
    const s = pe.get();
    m1(t, n, x.bind(null, e, s.parent.targetElement, s));
}
function E(e, t, n) {
    if (k(n)) {
        switch(t){
            case 'value':
                delete e.value;
                break;
            case 'checked':
                e.checked = 0;
                break;
            case 'spellcheck':
                if (0 == n) return void e.setAttribute('spellcheck', 'false');
        }
        e.removeAttribute(t);
    } else {
        switch(t){
            case 'value':
                e.value = `${n}`;
                break;
            case 'checked':
                e.checked = `${n}`;
        }
        e.setAttribute(t, `${n}`);
    }
}
function C(e8, t, n, s, i, l) {
    const r = e8.createSVGTransform();
    switch(l){
        case 'translate':
        case 'scale':
            s = ((e)=>_effector.is.store(e) ? e : _effector.is.store(e.x) ? _effector.is.store(e.y) ? _effector.combine({
                    x: e.x,
                    y: e.y
                }) : e.x.map(tt.bind(null, e.y)) : _effector.is.store(e.y) ? e.y.map(nt.bind(null, e.x)) : e
            )(s);
    }
    b(0, t, s, i.bind(null, r)), n.appendItem(r);
}
function I(e, t) {
    e.replaceData(0, (e.textContent || '').length, String(t));
}
function N(e) {
    e.focus();
}
function $(e) {
    e.blur();
}
function _(e9, t4, n4) {
    'function' == typeof t4 && (n4 = t4, t4 = {
    }), void 0 === t4 && (t4 = {
    });
    const { noAppend: s3 = 0  } = t4, l4 = pe.get(), r = l4 ? l4.namespace : 'html';
    let o = r, u = 'html';
    'type' in t4 ? (u = t4.type, o = t4.type) : o = u = 'svg' === r ? 'svg' : 'html', 'svg' === e9 && (u = 'svg', o = 'svg');
    const h = 'svg' === u ? Ce.createElementNS('http://www.w3.org/2000/svg', e9) : Ce.createElement(e9);
    'foreignObject' === r ? (h.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml'), o = 'html') : 'svg' === e9 ? (h.setAttribute('xmlns', 'http://www.w3.org/2000/svg'), o = 'svg') : 'foreignObject' === e9 && (o = 'foreignObject');
    const p = i1(), d = {
        type: 'element',
        pure: 0,
        tag: e9,
        attr: [],
        data: [],
        visible: [],
        text: [],
        styleVar: [],
        styleProp: [],
        handler: [],
        transform: [],
        focus: [],
        blur: []
    }, g = {
        parent: null,
        signal: p,
        namespace: o,
        targetElement: h,
        svgRoot: null,
        child: [],
        locality: {
            sibling: {
                left: {
                    ref: null
                },
                right: {
                    ref: null
                }
            },
            child: {
                first: {
                    ref: null
                },
                last: {
                    ref: null
                }
            }
        },
        node: d,
        mountStatus: 'initial',
        visible: 1
    };
    l4 && c1(l4, g), 'svg' === e9 ? g.svgRoot = h : l4 && (g.svgRoot = l4.svgRoot), pe.replace(g), n4 ? ((e, t, n, s)=>{
        let i = 0;
        ue.push({
            node: t,
            append: [],
            reverse: 0
        });
        try {
            _effector.withRegion(e, s), i = 1;
        } finally{
            a1(ue.pop()), i || pe.replace(n);
        }
    })(p, h, l4, n4) : (d.pure = 1, Y(t4));
    const y = (()=>{
        const e10 = (()=>{
            const e12 = pe.getElementNode(), t = {
                attr: {
                },
                data: {
                },
                visible: null,
                text: [],
                styleVar: {
                },
                styleProp: {
                },
                handler: [],
                transform: e12.transform,
                focus: e12.focus,
                blur: e12.blur
            };
            for(let n = 0; n < e12.handler.length; n++){
                const { options: s , map: i  } = e12.handler[n];
                s.passive = s.prevent ? 0 : s.passive;
                for(const e11 in i){
                    const t = i[e11];
                    i[e11] = (e)=>{
                        s.prevent && e.preventDefault(), s.stop && e.stopPropagation(), t(e);
                    };
                }
                t.handler.push({
                    options: s,
                    map: i
                });
            }
            for(let n5 = 0; n5 < e12.attr.length; n5++){
                const s = e12.attr[n5];
                for(const e in s)'xlink:href' === e ? t.attr.href = s[e] : t.attr[e] = s[e];
            }
            for(let n6 = 0; n6 < e12.data.length; n6++){
                const s = e12.data[n6];
                for(const e in s)t.data[e] = s[e];
            }
            e12.visible.length > 0 && (t.visible = e12.visible[e12.visible.length - 1]), t.text = e12.text;
            for(let n7 = 0; n7 < e12.styleVar.length; n7++){
                const s = e12.styleVar[n7];
                for(const e in s)t.styleVar[e] = s[e];
            }
            for(let n8 = 0; n8 < e12.styleProp.length; n8++){
                const s = e12.styleProp[n8];
                for(const e in s)t.styleProp[e] = s[e];
            }
            return t;
        })(), t5 = pe.get(), n9 = t5.targetElement, s4 = t5.signal;
        return ((e, t, n)=>{
            for(const s in n)b('value' !== s && 'checked' !== s && 'min' !== s && 'max' !== s, t, n[s], E.bind(null, e, s));
        })(n9, s4, e10.attr), ((e, t, n)=>{
            for(const s in n)b(0, t, n[s], w.bind(null, e.dataset, s));
        })(n9, s4, e10.data), ((e, t, n)=>{
            for(let s = 0; s < n.length; s++){
                const { options: i , map: l  } = n[s];
                for(const t6 in l)e.addEventListener(t6, l[t6], i);
                f1(t, Ke.bind(null, e, n[s]));
            }
        })(n9, s4, e10.handler), ((e, t, n)=>{
            const s = e.style;
            for(const e13 in n)b(0, t, n[e13], Qe.bind(null, s, e13));
        })(n9, s4, e10.styleProp), ((e, t, n)=>{
            const s = e.style;
            for(const e14 in n)b(0, t, n[e14], et.bind(null, s, `--${e14}`));
        })(n9, s4, e10.styleVar), ((e, t, n)=>{
            const s = pe.get();
            if ('svg' !== s.namespace) return;
            if (0 === n.length) return;
            const i = e.transform.baseVal, l = s.svgRoot;
            for(let e15 = 0; e15 < n.length; e15++){
                const s = n[e15];
                for(const e in s)C(l, t, i, s[e], st[e], e);
            }
        })(n9, s4, e10.transform), ((e, t, n)=>{
            for(let s = 0; s < n.length; s++){
                const i = n[s];
                if (null === i) continue;
                const l = Ce.createTextNode('');
                e.appendChild(l), _effector.is.unit(i) ? m1(t, i, I.bind(null, l)) : I(l, i);
            }
        })(n9, s4, e10.text), S(n9, s4, e10.visible), ((e, t, n)=>{
            for(let s = 0; s < n.length; s++)b(1, t, n[s], N.bind(null, e));
        })(n9, s4, e10.focus), ((e, t, n)=>{
            for(let s = 0; s < n.length; s++)b(1, t, n[s], $.bind(null, e));
        })(n9, s4, e10.blur), e10;
    })();
    pe.replace(l4), g.visible = !y.visible || y.visible.getState(), s3 || ue.length > 0 && g.visible && ue[ue.length - 1].append.push(h);
}
function A(e, t) {
    return e.bind(null, t);
}
function O(t, n) {
    const s = pe.get();
    if (Array.isArray(n)) {
        const i = [];
        for(let e = 0; e < n.length; e++)i[e] = t.map(A(D, n[e]));
        return s && e2(s.signal, i), i;
    }
    if ('object' == typeof n && null !== n) {
        const i = [], l = {
        };
        for(const e in n)l[e] = t.map(A(D, n[e])), i.push(l[e]);
        return s && e2(s.signal, i), l;
    }
    const i = t.map(A(D, n));
    return s && e2(s.signal, i), i;
}
function R(t, n) {
    const s = t.map(A(D, n)), i = pe.get();
    return i && e2(i.signal, [
        s
    ]), s;
}
function D(e, t) {
    return t[e];
}
function P({ key: e , child: t , source: n10  }, s) {
    V({
        source: n10,
        key: e
    }, ({ store: n , key: i , signal: l  })=>{
        const r = O(n, t);
        s({
            store: n,
            key: i,
            signal: l
        }, ()=>{
            P({
                key: e,
                child: t,
                source: r
            }, s);
        });
    });
}
function V(t, n = ()=>{
}) {
    let s;
    n = t.fn ? t.fn : n;
    let l, r = 0;
    _effector.is.store(t) ? (l = ot, s = t) : (l = A(at, t.key), s = t.source, r = !!t.reverse);
    const o = pe.get(), a = i1(), u = {
        parent: o,
        signal: a,
        namespace: o.namespace,
        targetElement: o.targetElement,
        svgRoot: o.svgRoot,
        child: [],
        locality: {
            sibling: {
                left: {
                    ref: null
                },
                right: {
                    ref: null
                }
            },
            child: {
                first: {
                    ref: null
                },
                last: {
                    ref: null
                }
            }
        },
        node: {
            type: 'list',
            pure: 0,
            reverse: r,
            key: _effector.is.store(t) ? {
                type: 'index'
            } : {
                type: 'key',
                key: t.key
            },
            store: s,
            cb: n
        },
        mountStatus: 'initial',
        visible: 1
    };
    c1(o, u), pe.replace(u);
    const h = {
        parentNode: o.targetElement,
        cb: n,
        shortName: s.shortName,
        reverse: r,
        parentStack: u,
        getID: l,
        fields: t.fields ? t.fields : null,
        visible: t.visible ? t.visible : null
    }, p = _effector.createStore(T(h, [], s.getState()));
    e2(a, [
        p
    ]), f1(a, A(ft, p)), _effector.sample({
        source: p,
        clock: s,
        fn: A(T, h),
        target: p
    }), pe.replace(o);
}
function T(l, r, o) {
    const a = Array(o.length).fill(0), f = o.map(l.getID), u = [], h = [], p = [];
    for(let e = 0; e < r.length; e++){
        const t = r[e], n = t.node, s = f.indexOf(n.key);
        -1 !== s ? (h.push(t), a[s] = 1, n.store.getState() !== o[s] && _effector.launch({
            target: n.store,
            params: o[s],
            defer: 1
        })) : p.push(t);
    }
    if (p.length > 0) {
        for(let e = 0; e < p.length; e++){
            const i = p[e], { node: l , locality: r  } = i;
            l.active = 0, l.store = null, t1(r.sibling.left.ref, r.sibling.right.ref), n1(i, null), s1(i, null);
        }
        _effector.launch({
            target: ct,
            params: p,
            defer: 1
        });
    }
    let d = h.length > 0 ? h[h.length - 1] : null;
    for(let n = 0; n < o.length; n++){
        if (a[n]) continue;
        const s = o[n], r = _effector.createStore(s), f = i1(), p = l.fields ? O(r, l.fields) : null;
        e2(f, [
            r
        ]);
        const g = l.getID(s, n), m = {
            parent: l.parentStack,
            signal: f,
            namespace: l.parentStack.namespace,
            targetElement: l.parentStack.targetElement,
            svgRoot: l.parentStack.svgRoot,
            child: [],
            locality: {
                sibling: {
                    left: {
                        ref: null
                    },
                    right: {
                        ref: null
                    }
                },
                child: {
                    first: {
                        ref: null
                    },
                    last: {
                        ref: null
                    }
                }
            },
            node: {
                type: 'listItem',
                pure: 0,
                key: g,
                index: g,
                store: r,
                signal: f,
                active: 1,
                nodes: [],
                fields: p,
                visible: l.visible ? [
                    r.map(l.visible)
                ] : []
            },
            mountStatus: 'initial',
            visible: 1
        };
        t1(d, m), d = m, c1(l.parentStack, m), u.push(m), h.push(m);
    }
    return u.length > 0 && _effector.launch({
        target: rt,
        params: {
            context: l,
            list: u
        },
        defer: 1
    }), h;
}
function j(e, t, n, s) {
    const i = v(e);
    i && s.contains(i.targetElement) ? n ? i.targetElement.before(t) : i.targetElement.after(t) : s.appendChild(t);
}
function F(e) {
    const t = pe.get();
    t && _effector.createNode({
        node: [],
        parent: e,
        child: t.signal,
        family: {
            type: 'crosslink',
            owners: [
                t.signal,
                e
            ]
        }
    });
}
function M(t) {
    const n = pe.get();
    return n && e2(n.signal, [
        t
    ]), t;
}
function z(e) {
    const t = pe.get();
    if ('element' !== t.node.type && 'using' !== t.node.type) throw Error(`"${e}" extension can be used only with element nodes, got "${t.node.type}"`);
}
function L(e16) {
    let t;
    return X((e)=>{
        t = e;
    }), (...n)=>{
        if (t) return t[e16](...n);
    };
}
function X(e) {
    const t = pe.get();
    t.targetElement.__STATIC__ || e(t.targetElement);
}
function Y(e) {
    e.attr && q(e.attr), e.data && G(e.data), e.transform && W(e.transform), 'text' in e && B(e.text), 'visible' in e && U(e.visible), (e.style || e.styleVar) && Z({
        prop: e.style,
        val: e.styleVar
    }), e.focus && J(e.focus), e.handler && H(e.handler);
}
function q(e) {
    z('attr'), pe.getElementNode().attr.push(e);
}
function G(e) {
    z('data'), pe.getElementNode().data.push(e);
}
function W(e) {
    z('transform'), pe.getElementNode().transform.push(e);
}
function B(e) {
    z('text'), pe.getElementNode().text.push(e);
}
function U(e) {
    const t = pe.get();
    if ('element' !== t.node.type && 'using' !== t.node.type && 'listItem' !== t.node.type) throw Error(`"visible" extension can be used only with element or listItem nodes, got "${t.node.type}"`);
    pe.getElementNode().visible.push(e);
}
function Z({ prop: e , val: t  }) {
    z('style'), e && pe.getElementNode().styleProp.push(e), t && pe.getElementNode().styleVar.push(t);
}
function H(e, t) {
    z('handler'), void 0 === t && (t = e, e = {
    });
    const { passive: n = 1 , capture: s = 0 , prevent: i = 0 , stop: l = 0  } = e;
    pe.getElementNode().handler.push({
        options: {
            passive: n,
            capture: s,
            prevent: i,
            stop: l
        },
        map: t
    });
}
function J({ focus: e , blur: t  }) {
    z('focus');
    const n = pe.getElementNode();
    e && n.focus.push(e), t && n.blur.push(t);
}
function K(e, { fn: t  }) {
    return console.error('separate map method is deprecated, use store.map as usual'), M(e.map(t));
}
function Q({ source: e , fn: t  }) {
    return console.error('separate combine method is deprecated, use common combine method as usual'), M(_effector.combine(e, t));
}
function ee(e17, t7) {
    const n = _effector.createStore(Object.entries(t7).map(([e, t])=>({
            key: e,
            val: t
        })
    )), s = _effector.combine(n, e17, (e18, t)=>e18.map((e)=>({
                key: e.key,
                val: e.val,
                visible: e.key === t
            })
        )
    );
    V({
        source: s,
        key: 'key',
        visible: ({ visible: e  })=>e
        ,
        fn ({ store: e  }) {
            e.getState().val();
        }
    });
}
const ue = [];
let he;
const pe = {
    get: ()=>he
    ,
    replace (e) {
        he = e;
    },
    getElementNode: ()=>he.node
}, de = (e)=>e.graphite || e
, ge = (e)=>e.family.owners
, me = (e)=>e.family.links
, be = _effector.createNode({
    node: [
        _effector.step.run({
            fn (e) {
                _effector.clearNode(e);
            }
        })
    ]
}), ye = _effector.step.compute({
    fn (e, i) {
        i.self.next.push(be);
        const { stack: l  } = i, { parent: r  } = l, { left: o , right: a  } = l.locality.sibling;
        r && (r.locality.child.last.ref === l && (r.locality.child.last.ref = o.ref), r.locality.child.first.ref === l && (r.locality.child.first.ref = a.ref)), o.ref && o.ref.locality.sibling.right.ref === l && a.ref && a.ref.locality.sibling.left.ref === l ? t1(o.ref, a.ref) : o.ref && o.ref.locality.sibling.right.ref === l ? n1(o.ref, null) : a.ref && a.ref.locality.sibling.left.ref === l && s1(a.ref, null);
    }
}), ve = _effector.step.compute({
    fn: (e, { self: t  })=>t
}), ke = /[^a-zA-Z0-9\-]/g, we = /[\\<>"]/g;
class xe {
    constructor(){
        this.properties = Object.create(null);
    }
    setProperty(e26, t11) {
        this.properties[l1(e26)] = r1(t11);
    }
    removeProperty(e19) {
        delete this.properties[l1(e19)];
    }
}
class Se {
    constructor(){
        this.items = [];
    }
    appendItem(e20) {
        this.items.push(e20);
    }
}
class Ee {
    constructor(){
        this.value = '';
    }
    setTranslate(e21, t8) {
        this.value = `translate(${e21} ${t8})`;
    }
    setScale(e22, t9) {
        this.value = `scale(${e22} ${t9})`;
    }
    setRotate(e23, t10, n11) {
        this.value = 0 !== t10 || 0 !== n11 ? `rotate(${e23} ${t10} ${n11})` : `rotate(${e23})`;
    }
    setSkewX(e24) {
        this.value = `skewX(${e24})`;
    }
    setSkewY(e25) {
        this.value = `skewY(${e25})`;
    }
}
(new class {
    constructor(){
        this.child = {
            first: null,
            last: null
        }, this.sibling = {
            left: null,
            right: null
        }, this.parent = null, this.tagName = '', this.namespaceURI = 'http://www.w3.org/1999/xhtml', this.dataset = Object.create(null), this.style = new xe, this.firstChild = null, this.transform = {
            baseVal: new Se
        }, this.isFragment = 1, this.attributes = Object.create(null), this.textContent = null, this.__STATIC__ = 1;
    }
    appendChild(e) {
        if (e.parent && e.remove(), e.isFragment && null === e.textContent) {
            let t, n = e.firstChild;
            for(; n;)t = n.sibling.right, this.appendChild(n), n = t;
        } else this.child.last ? (this.child.last.sibling.right = e, e.sibling.left = this.child.last) : (this.child.first = e, this.firstChild = e), this.child.last = e, e.parent = this;
    }
    prepend(e27) {
        e27.parent && e27.remove(), this.child.last ? (this.child.first.sibling.left = e27, e27.sibling.right = this.child.first) : (this.child.first = e27, this.child.last = e27), this.child.first = e27, this.firstChild = e27, e27.parent = this;
    }
    contains(e28) {
        let t = e28;
        for(; t;){
            if (t === this) return 1;
            t = t.parent;
        }
        return 0;
    }
    remove() {
        if (!this.parent) return;
        const { parent: e  } = this;
        e.child.first === this && e.child.last === this ? (e.firstChild = null, e.child.first = null, e.child.last = null) : e.child.first === this ? (e.child.first = this.sibling.right, e.firstChild = this.sibling.right, this.sibling.right.sibling.left = null) : e.child.last === this ? (e.child.last = this.sibling.left, this.sibling.left.sibling.right = null) : (this.sibling.right.sibling.left = this.sibling.left, this.sibling.left.sibling.right = this.sibling.right), this.sibling.left = null, this.sibling.right = null, this.parent = null;
    }
    addEventListener(e29, t, n) {
    }
    removeEventListener(e30, t12, n12) {
    }
    setAttribute(e31, t13) {
        this.attributes[l1(e31)] = r1(t13);
    }
    removeAttribute(e32) {
        delete this.attributes[l1(e32)];
    }
    replaceWith(e33) {
        if (!this.parent) return;
        const { parent: t  } = this;
        e33.parent && e33.remove(), t.child.first === this && t.child.last === this ? (t.firstChild = e33, t.child.first = e33, t.child.last = e33) : t.child.first === this ? (t.child.first = e33, t.firstChild = e33, this.sibling.right.sibling.left = e33) : t.child.last === this ? (t.child.last = e33, this.sibling.left.sibling.right = e33) : (this.sibling.right.sibling.left = e33, this.sibling.left.sibling.right = e33), e33.sibling.left = this.sibling.left, e33.sibling.right = this.sibling.right, e33.parent = t, this.sibling.left = null, this.sibling.right = null, this.parent = null;
    }
    focus() {
    }
    blur() {
    }
    createSVGTransform() {
        return new Ee;
    }
    replaceData(e34, t14, n13) {
        'string' == typeof this.textContent && (this.textContent = `${this.textContent.slice(0, e34)}${n13}${this.textContent.slice(e34 + t14)}`);
    }
}).isBody = 1;
let Ce = 'undefined' != typeof document ? document : null;
const Ie = _effector.step.compute({
    fn (e, t) {
        if (!t.stack) return e;
        const { stack: n  } = t;
        t.stack = null;
        const s = n.parent.child.indexOf(n);
        return -1 !== s && n.parent.child.splice(s, 1), n.parent = null, e;
    }
}), Ne = _effector.step.run({
    fn (e, { fn: t  }) {
        t(e);
    }
});
let $e, _e, Ae;
$e = ()=>{
}, _e = ()=>{
}, Ae = 'undefined' != typeof performance && performance.now ? ()=>performance.now()
 : 'undefined' != typeof process && process.hrtime ? ()=>{
    const e = process.hrtime();
    return (1000000000 * e[0] + e[1]) / 1000000;
} : ()=>Date.now()
;
const Oe = _effector.createEvent();
let Re, De = 0, Pe = 0;
const Ve = 'undefined' != typeof requestAnimationFrame ? requestAnimationFrame : (e)=>setTimeout(e, 0)
, Te = 'undefined' != typeof cancelAnimationFrame ? cancelAnimationFrame : clearTimeout, je = ()=>{
    Pe || (Pe = 1, Re = Ve(u1));
}, Fe = new Map, Me = new Map, ze = new Map, Le = new Map;
let Xe = 0, Ye = 0;
const qe = _effector.createNode({
    node: [
        _effector.step.run({
            fn: ()=>{
            }
        }),
        _effector.step.filter({
            fn: ()=>0 === Me.size && 0 === ze.size ? 0 : Ae() - Ye >= 10 ? 0 : (Te(Re), De = 1, Pe = 0, 1)
        })
    ],
    child: [
        Oe
    ]
});
Oe.watch(()=>{
    if (Pe) return;
    if (0 === Me.size && 0 === ze.size) return void (De = 0);
    let e = 0;
    De || (Ye = Ae()), De = 0;
    for (const [t, n] of Me){
        if (Ae() - Ye >= 10) {
            je(), e = 1;
            break;
        }
        Me.delete(t), _effector.launch({
            target: Fe.get(t),
            params: n,
            defer: 1
        });
    }
    if (!e) for (const [t15, n14] of ze){
        if (Ae() - Ye >= 10) {
            je(), e = 1;
            break;
        }
        ze.delete(t15), _effector.launch({
            target: Fe.get(t15),
            params: n14,
            defer: 1
        });
    }
    _effector.launch({
        target: qe,
        params: null,
        defer: 1
    });
});
const Ge = _effector.step.compute({
    fn: ({ done: e  })=>e
}), We = _effector.step.compute({
    fn: ({ fail: e  })=>e
}), Be = _effector.step.filter({
    fn: (e)=>e.length > 0
}), Ue = _effector.step.compute({
    fn (e, { taskID: t  }) {
        const n = 'high' === Le.get(t) ? Me : ze;
        let s = n.get(t);
        s || (s = [], n.set(t, s));
        for(let t16 = 0; t16 < e.length; t16++)s.push(e[t16]);
        je();
    }
}), Ze = _effector.step.run({
    fn: (e, { fn: t  })=>t(e, Ye)
}), He = _effector.step.run({
    fn: (e, { handler: t  })=>({
            data: e,
            handler: t
        })
}), { trigger: Je  } = p1({
    priority: 'high',
    mark: 'domOperation',
    fn ({ handler: e , data: t  }) {
        e(t);
    }
}), Ke = (e, { map: t , options: n  })=>{
    for(const s in t)e.removeEventListener(s, t[s], n);
}, Qe = (e, t, n)=>{
    k(n) ? delete e[t] : e[t] = n;
}, et = (e, t, n)=>{
    k(n) ? e.removeProperty(t) : e.setProperty(t, n);
}, tt = (e, t)=>({
        x: t,
        y: e
    })
, nt = (e, t)=>({
        x: e,
        y: t
    })
, st = {
    translate (e, { x: t = 0 , y: n = 0  }) {
        e.setTranslate(t, n);
    },
    scale (e, { x: t = 0 , y: n = 0  }) {
        e.setScale(t, n);
    },
    rotate (e, t) {
        'number' == typeof t ? e.setRotate(t, 0, 0) : e.setRotate(t.angle || 0, t.x || 0, t.y || 0);
    },
    skewX (e, t) {
        e.setSkewX(t);
    },
    skewY (e, t) {
        e.setSkewY(t);
    }
}, { trigger: lt  } = p1({
    mark: 'append DOM nodes',
    fn: (e)=>{
        for(let t = 0; t < e.append.length; t++){
            const n = e.append[t];
            if (0 == n.listItem.active) continue;
            if (0 === n.appended.length) continue;
            const s = Ce.createDocumentFragment();
            if (e.reverse) for(let e36 = n.appended.length - 1; e36 >= 0; e36--)s.appendChild(n.appended[e36]);
            else for(let e35 = 0; e35 < n.appended.length; e35++)s.appendChild(n.appended[e35]);
            j(n.listItemStack, s, e.reverse, e.node);
        }
    }
}), { trigger: rt  } = p1({
    mark: 'addRecords',
    fn: ({ context: e39 , list: t18  })=>{
        const { parentStack: n , parentNode: s , cb: i , reverse: l  } = e39, r = pe.get();
        pe.replace(n);
        const o = [], a = [];
        ue.push({
            node: s,
            append: a,
            reverse: l
        });
        for(let e37 = 0; e37 < t18.length; e37++){
            const n = t18[e37], r = n.node;
            if (r.active) {
                pe.replace(n), _effector.withRegion(n.signal, A(i, r));
                for(let e38 = 0; e38 < a.length; e38++)r.nodes.push(a[e38]);
                r.visible.length > 0 ? _effector.withRegion(n.signal, ()=>{
                    const e40 = r.visible[r.visible.length - 1];
                    e40.updates.watch((e)=>{
                        if (0 != r.active) {
                            if (e) {
                                const e = Ce.createDocumentFragment();
                                if (l) for(let t = r.nodes.length - 1; t >= 0; t--)e.appendChild(r.nodes[t]);
                                else for(let t17 = 0; t17 < r.nodes.length; t17++)e.appendChild(r.nodes[t17]);
                                j(n, e, l, s);
                            } else for(let e41 = 0; e41 < r.nodes.length; e41++)r.nodes[e41].remove();
                        }
                    }), e40.getState() && o.push({
                        listItemStack: n,
                        appended: a.slice(),
                        listItem: r
                    });
                }) : o.push({
                    listItemStack: n,
                    appended: a.slice(),
                    listItem: r
                }), a.length = 0;
            }
        }
        ue.pop(), o.length > 0 && _effector.launch({
            target: lt,
            params: {
                node: s,
                append: o,
                reverse: l
            },
            defer: 1
        }), pe.replace(r);
    }
}), ot = (e, t)=>t
, at = (e, t)=>t[e]
, ct = _effector.createEvent();
d1({
    trigger: ct,
    priority: 'high',
    mark: 'runSignals',
    flatten: ({ signal: e  })=>[
            e
        ]
    ,
    fn: (e)=>{
        e.scope && _effector.launch({
            target: e,
            params: null,
            defer: 0
        });
    }
}), d1({
    trigger: ct,
    priority: 'high',
    mark: 'remove DOM nodes',
    flatten ({ node: e  }) {
        const { nodes: t  } = e;
        return t;
    },
    fn: (e)=>(e.remove(), e)
});
const ft = (e)=>{
    const t = e.getState();
    for(let e42 = 0; e42 < t.length; e42++){
        const n = t[e42].node;
        n.active = 0, n.store = null;
    }
    _effector.launch({
        target: ct,
        params: t,
        defer: 1
    });
};

},{"process":"lDnB8","effector":"6OH3Z","@parcel/transformer-js/src/esmodule-helpers.js":"ciiiV"}],"lDnB8":[function(require,module,exports) {
// shim for using process in browser
var process = module.exports = {
};
// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.
var cachedSetTimeout;
var cachedClearTimeout;
function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout() {
    throw new Error('clearTimeout has not been defined');
}
(function() {
    try {
        if (typeof setTimeout === 'function') cachedSetTimeout = setTimeout;
        else cachedSetTimeout = defaultSetTimout;
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') cachedClearTimeout = clearTimeout;
        else cachedClearTimeout = defaultClearTimeout;
    } catch (e1) {
        cachedClearTimeout = defaultClearTimeout;
    }
})();
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) //normal enviroments in sane situations
    return setTimeout(fun, 0);
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }
}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) //normal enviroments in sane situations
    return clearTimeout(marker);
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;
function cleanUpNextTick() {
    if (!draining || !currentQueue) return;
    draining = false;
    if (currentQueue.length) queue = currentQueue.concat(queue);
    else queueIndex = -1;
    if (queue.length) drainQueue();
}
function drainQueue() {
    if (draining) return;
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;
    var len = queue.length;
    while(len){
        currentQueue = queue;
        queue = [];
        while(++queueIndex < len)if (currentQueue) currentQueue[queueIndex].run();
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}
process.nextTick = function(fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) for(var i = 1; i < arguments.length; i++)args[i - 1] = arguments[i];
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) runTimeout(drainQueue);
};
// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function() {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {
};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {
};
function noop() {
}
process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;
process.listeners = function(name) {
    return [];
};
process.binding = function(name) {
    throw new Error('process.binding is not supported');
};
process.cwd = function() {
    return '/';
};
process.chdir = function(dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() {
    return 0;
};

},{}],"6OH3Z":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "allSettled", ()=>A
);
parcelHelpers.export(exports, "attach", ()=>y1
);
parcelHelpers.export(exports, "clearNode", ()=>lt
);
parcelHelpers.export(exports, "combine", ()=>p1
);
parcelHelpers.export(exports, "createApi", ()=>b
);
parcelHelpers.export(exports, "createDomain", ()=>v
);
parcelHelpers.export(exports, "createEffect", ()=>h1
);
parcelHelpers.export(exports, "createEvent", ()=>u1
);
parcelHelpers.export(exports, "createNode", ()=>a1
);
parcelHelpers.export(exports, "createStore", ()=>d1
);
parcelHelpers.export(exports, "createStoreObject", ()=>m1
);
parcelHelpers.export(exports, "fork", ()=>$
);
parcelHelpers.export(exports, "forward", ()=>ct
);
parcelHelpers.export(exports, "fromObservable", ()=>k
);
parcelHelpers.export(exports, "guard", ()=>C
);
parcelHelpers.export(exports, "hydrate", ()=>N
);
parcelHelpers.export(exports, "is", ()=>W
);
parcelHelpers.export(exports, "launch", ()=>o1
);
parcelHelpers.export(exports, "merge", ()=>w
);
parcelHelpers.export(exports, "restore", ()=>M
);
parcelHelpers.export(exports, "sample", ()=>x
);
parcelHelpers.export(exports, "scopeBind", ()=>F
);
parcelHelpers.export(exports, "serialize", ()=>O
);
parcelHelpers.export(exports, "setStoreName", ()=>s1
);
parcelHelpers.export(exports, "split", ()=>j
);
parcelHelpers.export(exports, "step", ()=>pe
);
parcelHelpers.export(exports, "version", ()=>Mt
);
parcelHelpers.export(exports, "withFactory", ()=>De
);
parcelHelpers.export(exports, "withRegion", ()=>n1
);
function e1(e, t) {
    for(let r in e)t(e[r], r);
}
function t1(e, t) {
    e.forEach(t);
}
function r1(e, t) {
    if (!e) throw Error(t);
}
function n1(e, t) {
    Ne = {
        parent: Ne,
        value: e,
        template: Ie(e, 'template') || Fe(),
        sidRoot: Ie(e, 'sidRoot') || Ne && Ne.sidRoot
    };
    try {
        return t();
    } finally{
        Ne = je(Ne);
    }
}
function a1({ node: e2 = [] , from: r , source: n , parent: a = r || n , to: o , target: l , child: s = o || l , scope: i = {
} , meta: f = {
} , family: c = {
    type: 'regular'
} , regional: u  } = {
}) {
    let d = Re(a), p = Re(c.links), m = Re(c.owners), g = [];
    t1(e2, (e)=>e && G(g, e)
    );
    let h = {
        id: ae(),
        seq: g,
        next: Re(s),
        meta: f,
        scope: i,
        family: {
            type: c.type || "crosslink",
            links: p,
            owners: m
        }
    };
    return t1(p, (e)=>G(we(e), h)
    ), t1(m, (e)=>G(Se(e), h)
    ), t1(d, (e)=>G(e.next, h)
    ), u && Ne && $e(Ce(Ne), [
        h
    ]), h;
}
function o1(e, r, n) {
    let a = Je, o = null, l = Ue;
    if (e.target && (r = e.params, n = e.defer, a = 'page' in e ? e.page : a, e.stack && (o = e.stack), l = Ae(e) || l, e = e.target), l && Ue && l !== Ue && (Ue = null), Array.isArray(e)) for(let t3 = 0; t3 < e.length; t3++)Le('pure', a, ke(e[t3]), o, r[t3], l);
    else Le('pure', a, ke(e), o, r, l);
    if (n && !He) return;
    let s, i, f, c, u, d, p = {
        isRoot: He,
        currentPage: Je,
        scope: Ue,
        isWatch: Ge
    };
    He = 0;
    e: for(; c = Ee();){
        let { idx: e , stack: r , type: n  } = c;
        f = r.node, Je = u = r.page, Ue = Ae(r), u ? d = u.reg : Ue && (d = Ue.reg);
        let a = !!u, o = !!Ue, l = {
            fail: 0,
            scope: f.scope
        };
        s = i = 0;
        for(let t2 = e; t2 < f.seq.length && !s; t2++){
            let c = f.seq[t2];
            if (c.order) {
                let { priority: a , barrierID: o  } = c.order, l = o ? u ? `${u.fullID}_${o}` : o : 0;
                if (t2 !== e || n !== a) {
                    o ? We.has(l) || (We.add(l), Be(t2, r, a, o)) : Be(t2, r, a);
                    continue e;
                }
                o && We.delete(l);
            }
            switch(c.type){
                case 'mov':
                    {
                        let e, t = c.data;
                        switch(t.from){
                            case z:
                                e = Ce(r);
                                break;
                            case "a":
                            case 'b':
                                e = r[t.from];
                                break;
                            case "value":
                                e = t.store;
                                break;
                            case "store":
                                if (d && !d[t.store.id]) {
                                    if (a) {
                                        let e = Xe(u, t.store.id);
                                        r.page = u = e, e ? d = e.reg : o ? (Ze(Ue, t.store, 0, 1, t.softRead), d = Ue.reg) : d = void 0;
                                    } else o && Ze(Ue, t.store, 0, 1, t.softRead);
                                }
                                e = ge(d && d[t.store.id] || t.store);
                        }
                        switch(t.to){
                            case z:
                                r.value = e;
                                break;
                            case "a":
                            case 'b':
                                r[t.to] = e;
                                break;
                            case "store":
                                Ye(u, Ue, f, t.target).current = e;
                        }
                        break;
                    }
                case 'compute':
                    let e = c.data;
                    if (e.fn) {
                        Ge = 'watch' === Ie(f, 'op');
                        let t = e.safe ? (0, e.fn)(Ce(r), l.scope, r) : et(l, e.fn, r);
                        e.filter ? i = !t : r.value = t, Ge = p.isWatch;
                    }
            }
            s = l.fail || i;
        }
        if (!s) {
            let e = Ce(r);
            t1(f.next, (t)=>{
                Le('child', u, t, r, e, Ae(r));
            });
            let n = Ae(r);
            if (n) {
                Ie(f, 'needFxCounter') && Le('child', u, n.fxCount, r, e, n), Ie(f, 'storeChange') && Le('child', u, n.storeChange, r, e, n);
                let a = n.additionalLinks[f.id];
                a && t1(a, (t)=>{
                    Le('child', u, t, r, e, n);
                });
            }
        }
    }
    He = p.isRoot, Je = p.currentPage, Ue = Ae(p);
}
function l1(t, r = "combine") {
    let n = r + '(', a = '', o = 0;
    return e1(t, (e)=>{
        o < 25 && (null != e && (n += a, n += _(e) ? tt(e).fullName : e.toString()), o += 1, a = ', ');
    }), n + ')';
}
function s1(e, t) {
    e.shortName = t, Object.assign(tt(e), i1(t, je(e)));
}
function i1(e, t) {
    let r, n, a = e;
    if (t) {
        let a = tt(t);
        0 === e.length ? (r = a.path, n = a.fullName) : (r = a.path.concat([
            e
        ]), n = 0 === a.fullName.length ? e : a.fullName + '/' + e);
    } else r = 0 === e.length ? [] : [
        e
    ], n = e;
    return {
        shortName: a,
        fullName: n,
        path: r
    };
}
function f1(e, t) {
    let r = t ? e : e[0];
    return Y(r), r.and && (e = r.and), [
        e,
        r.or
    ];
}
function c1(e, ...t) {
    let r = Fe();
    if (r) {
        let n = r.handlers[e];
        if (n) return n(r, ...t);
    }
}
function u1(e3, t4) {
    let r2 = (e4, ...t5)=>(J(!Ie(r2, 'derived'), 'call of derived event', 'createEvent'), Je ? ((e, t, r, n)=>{
            let a = Je, o = null;
            if (t) for(o = Je; o && o.template !== t;)o = je(o);
            Qe(o);
            let l = e.create(r, n);
            return Qe(a), l;
        })(r2, n2, e4, t5) : r2.create(e4, t5))
    , n2 = Fe();
    return Object.assign(r2, {
        graphite: a1({
            meta: pt("event", r2, e3, t4),
            regional: 1
        }),
        create: (e)=>(o1({
                target: r2,
                params: e,
                scope: Ue
            }), e)
        ,
        watch: (e)=>ut(r2, e)
        ,
        map: (e)=>gt(r2, R, e, [
                ie({
                    fn: ve
                })
            ])
        ,
        filter: (e)=>gt(r2, "filter", e.fn ? e : e.fn, [
                fe({
                    fn: ve
                })
            ])
        ,
        filterMap: (e5)=>gt(r2, 'filterMap', e5, [
                ie({
                    fn: ve
                }),
                ue((e)=>!X(e)
                , 1)
            ])
        ,
        prepend (e) {
            let t = u1('* \u2192 ' + r2.shortName, {
                parent: je(r2)
            });
            return c1('eventPrepend', ke(t)), ft(t, r2, [
                ie({
                    fn: ve
                })
            ], 'prepend', e), dt(r2, t), t;
        }
    });
}
function d1(e6, n3) {
    let l = me(e6), s2 = mt('updates');
    c1('storeBase', l);
    let i = l.id, f = {
        subscribers: new Map,
        updates: s2,
        defaultState: e6,
        stateRef: l,
        getState () {
            let e, t = l;
            if (Je) {
                let t = Je;
                for(; t && !t.reg[i];)t = je(t);
                t && (e = t);
            }
            return !e && Ue && (Ze(Ue, l, 1), e = Ue), e && (t = e.reg[i]), ge(t);
        },
        setState: (e)=>o1({
                target: f,
                params: e,
                defer: 1,
                scope: Ue
            })
        ,
        reset: (...e7)=>(t1(e7, (e)=>f.on(e, ()=>f.defaultState
                )
            ), f)
        ,
        on: (e8, r)=>(ee(e8, '.on', 'first argument'), J(!Ie(f, 'derived'), '.on in derived store', 'createStore'), t1(Array.isArray(e8) ? e8 : [
                e8
            ], (e)=>{
                f.off(e), Me(f).set(e, st(ht(e, f, 'on', be, r)));
            }), f)
        ,
        off (e) {
            let t = Me(f).get(e);
            return t && (t(), Me(f).delete(e)), f;
        },
        map (e, t) {
            let r, n;
            K(e) && (r = e, e = e.fn), J(X(t), 'second argument of store.map', 'updateFilter');
            let a = f.getState();
            Fe() ? n = null : X(a) || (n = e(a, t));
            let o = d1(n, {
                name: `${f.shortName} \u2192 *`,
                derived: 1,
                and: r
            }), s = ht(f, o, R, ye, e);
            return he(xe(o), {
                type: R,
                fn: e,
                from: l
            }), xe(o).noInit = 1, c1('storeMap', l, s), o;
        },
        watch (e9, t) {
            if (!t || !_(e9)) {
                let t = ut(f, e9);
                return c1('storeWatch', l, e9) || e9(f.getState()), t;
            }
            return r1(Q(t), 'second argument should be a function'), e9.watch((e)=>t(f.getState(), e)
            );
        }
    }, u = pt("store", f, n3), p = f.defaultConfig.updateFilter;
    f.graphite = a1({
        scope: {
            state: l,
            fn: p
        },
        node: [
            ue((e, t, r)=>(r.scope && !r.scope.reg[l.id] && (r.b = 1), e)
            ),
            de(l),
            ue((e, t, { a: r , b: n  })=>!X(e) && (e !== r || n)
            , 1),
            p && fe({
                fn: ye
            }),
            se({
                from: z,
                target: l
            })
        ],
        child: s2,
        meta: u,
        regional: 1
    });
    let m = Ie(f, 'sid');
    return m && ('ignore' !== Ie(f, 'serialize') && qe(f, 'storeChange', 1), l.sid = m), r1(Ie(f, 'derived') || !X(e6), "current state can't be undefined, use null instead"), $e(f, [
        s2
    ]), f;
}
function p1(...e) {
    let t6, n, a;
    [e, a] = f1(e);
    let o, l, s, i = e[e.length - 1];
    if (Q(i) ? (n = e.slice(0, -1), t6 = i) : n = e, 1 === n.length) {
        let e = n[0];
        V(e) || (o = e, l = 1);
    }
    if (!l && (o = n, t6)) {
        s = 1;
        let e = t6;
        t6 = (t)=>e(...t)
        ;
    }
    return r1(K(o), 'shape should be an object'), yt(Array.isArray(o), !s, o, a, t6);
}
function m1(...e) {
    return J(0, 'createStoreObject', 'combine'), p1(...e);
}
function g1() {
    let e = {
    };
    return e.req = new Promise((t, r)=>{
        e.rs = t, e.rj = r;
    }), e.req.catch(()=>{
    }), e;
}
function h1(e10, t7) {
    let n4 = u1(Q(e10) ? {
        handler: e10
    } : e10, t7), l2 = ke(n4);
    qe(l2, 'op', n4.kind = "effect"), n4.use = (e)=>(r1(Q(e), '.use argument should be a function'), m.scope.handler = e, n4)
    , n4.use.getCurrent = ()=>m.scope.handler
    ;
    let s = n4.finally = mt('finally'), i2 = n4.done = s.filterMap({
        named: 'done',
        fn ({ status: e , params: t , result: r  }) {
            if ('done' === e) return {
                params: t,
                result: r
            };
        }
    }), f2 = n4.fail = s.filterMap({
        named: 'fail',
        fn ({ status: e , params: t , error: r  }) {
            if ('fail' === e) return {
                params: t,
                error: r
            };
        }
    }), c2 = n4.doneData = i2.map({
        named: 'doneData',
        fn: ({ result: e  })=>e
    }), p = n4.failData = f2.map({
        named: 'failData',
        fn: ({ error: e  })=>e
    }), m = a1({
        scope: {
            handlerId: Ie(l2, 'sid'),
            handler: n4.defaultConfig.handler || (()=>r1(0, `no handler used in ${n4.getType()}`)
            )
        },
        node: [
            ue((e, t, r)=>{
                let n = t, a = n.handler;
                if (Ae(r)) {
                    let e = Ae(r).handlers[n.handlerId];
                    e && (a = e);
                }
                return e.handler = a, e;
            }, 0, 1),
            ue(({ params: e , req: t , handler: r , args: n = [
                e
            ]  }, a, o)=>{
                let l = vt(e, t, 1, s, o), i = vt(e, t, 0, s, o), [f, c] = bt(r, i, n);
                f && (K(c) && Q(c.then) ? c.then(l, i) : l(c));
            }, 0, 1)
        ],
        meta: {
            op: 'fx',
            fx: 'runner'
        }
    });
    l2.scope.runner = m, G(l2.seq, ue((e, { runner: t  }, r)=>{
        let n = je(r) ? {
            params: e,
            req: {
                rs (e) {
                },
                rj (e) {
                }
            }
        } : e;
        return o1({
            target: t,
            params: n,
            defer: 1,
            scope: Ae(r)
        }), n.params;
    }, 0, 1)), n4.create = (e)=>{
        let t = g1(), r = {
            params: e,
            req: t
        };
        if (Ue) {
            if (!Ge) {
                let e = Ue;
                t.req.finally(()=>{
                    Ke(e);
                }).catch(()=>{
                });
            }
            o1({
                target: n4,
                params: r,
                scope: Ue
            });
        } else o1(n4, r);
        return t.req;
    };
    let h = n4.inFlight = d1(0, {
        named: 'inFlight'
    }).on(n4, (e)=>e + 1
    ).on(s, (e)=>e - 1
    );
    qe(s, 'needFxCounter', 'dec'), qe(n4, 'needFxCounter', 1);
    let y = n4.pending = h.map({
        fn: (e)=>e > 0
        ,
        named: 'pending'
    });
    return $e(n4, [
        s,
        i2,
        f2,
        c2,
        p,
        y,
        h
    ]), n4;
}
function y1(e11) {
    let t;
    [e11, t] = f1(e11, 1);
    let { source: r , effect: n5 , mapParams: a  } = e11, l = h1(e11, t);
    qe(l, 'attached', 1);
    let s3, { runner: i3  } = ke(l).scope, c3 = ue((e, t, n)=>{
        let s, { params: i , req: f , handler: c  } = e, u = l.finally, d = vt(i, f, 0, u, n), p = n.a, m = L(c), g = 1;
        if (a ? [g, s] = bt(a, d, [
            i,
            p
        ]) : s = r && m ? p : i, g) {
            if (!m) return e.args = [
                p,
                s
            ], 1;
            o1({
                target: c,
                params: {
                    params: s,
                    req: {
                        rs: vt(i, f, 1, u, n),
                        rj: d
                    }
                },
                page: n.page,
                defer: 1
            });
        }
    }, 1, 1);
    if (r) {
        let e;
        V(r) ? (e = r, $e(e, [
            l
        ])) : (e = p1(r), $e(l, [
            e
        ])), s3 = [
            de(xe(e)),
            c3
        ];
    } else s3 = [
        c3
    ];
    return i3.seq.splice(1, 0, ...s3), l.use(n5), dt(n5, l, "effect"), l;
}
function b(...t8) {
    let [[r, n6], a] = f1(t8), o = {
    };
    return e1(n6, (e, t)=>{
        let n = o[t] = u1(t, {
            parent: je(r),
            config: a
        });
        r.on(n, e), dt(r, n);
    }), o;
}
function v(r3, n) {
    let l3 = a1({
        family: {
            type: "domain"
        },
        regional: 1
    }), s = {
        history: {
        },
        graphite: l3,
        hooks: {
        }
    };
    l3.meta = pt("domain", s, r3, n), e1({
        Event: u1,
        Effect: h1,
        Store: d1,
        Domain: v
    }, (e12, r4)=>{
        let n = r4.toLowerCase(), a = mt(`on${r4}`);
        s.hooks[n] = a;
        let l = new Set;
        s.history[`${n}s`] = l, a.create = (e)=>(o1(a, e), e)
        , G(ke(a).seq, ue((e, t, r)=>(r.scope = null, e)
        )), a.watch((e)=>{
            $e(s, [
                e
            ]), l.add(e), e.ownerSet || (e.ownerSet = l), je(e) || (e.parent = s);
        }), $e(s, [
            a
        ]), s[`onCreate${r4}`] = (e)=>(t1(l, e), a.watch(e))
        , s[`create${r4}`] = s[n] = (t, r)=>a(e12(t, {
                parent: s,
                or: r
            }))
        ;
    });
    let i = je(s);
    return i && e1(s.hooks, (e, t)=>ft(e, i.hooks[t])
    ), s;
}
function k(e) {
    Y(e);
    let t = D in e ? e[D]() : e;
    r1(t.subscribe, 'expect observable to have .subscribe');
    let n = u1(), a = st(n);
    return t.subscribe({
        next: n,
        error: a,
        complete: a
    }), n;
}
function w(e, t) {
    let r = u1(t || l1(e, 'merge'));
    return ee(e, 'merge', 'first argument'), ft(e, r, [], 'merge'), r;
}
function S(e, n) {
    let a = 0;
    return t1(wt, (t)=>{
        t in e && (r1(null != e[t], St(n, t)), a = 1);
    }), a;
}
function x(...e) {
    let t, r, n, [[o, l, s], i] = f1(e), p = 1;
    X(l) && K(o) && S(o, 'sample') && (l = o.clock, s = o.fn, p = !o.greedy, t = o.target, r = o.name, n = o.sid, o = o.source), [o, l] = xt(o, l, 'sample'), X(l) && (l = o), ee(l, 'sample', 'clock'), i || r || (r = o.shortName);
    let m = !!t;
    if (t || (V(o) && V(l) ? t = d1(s ? s(ge(xe(o)), ge(xe(l))) : ge(xe(o)), {
        name: r,
        sid: n,
        or: i
    }) : (t = u1(r, i), c1('sampleTarget', ke(t)))), V(o)) {
        let e = xe(o);
        $e(o, [
            ft(l, t, [
                c1('sampleSourceLoader'),
                de(e, !s, p),
                s && ie({
                    fn: be
                }),
                c1('sampleSourceUpward', m)
            ], "sample", s)
        ]), c1('sampleStoreSource', e);
    } else {
        let e13 = me(0), r = me(), n = me();
        c1('sampleNonStoreSource', e13, r, n), a1({
            parent: o,
            node: [
                se({
                    from: z,
                    target: r
                }),
                se({
                    from: "value",
                    store: 1,
                    target: e13
                })
            ],
            family: {
                owners: [
                    o,
                    t,
                    l
                ],
                links: t
            },
            meta: {
                op: "sample"
            },
            regional: 1
        }), $e(o, [
            ft(l, t, [
                c1('sampleSourceLoader'),
                se({
                    from: z,
                    target: n
                }),
                de(e13, 1),
                ue((e)=>e
                , 1),
                de(r, 1, p),
                de(n),
                s && ie({
                    fn: ye
                }),
                c1('sampleSourceUpward', m)
            ], "sample", s)
        ]);
    }
    return t;
}
function C(...e14) {
    let t9 = 'guard', [[n, o], l] = f1(e14);
    o || (o = n, n = o.source), S(o, t9);
    let { filter: s , greedy: i , clock: c , name: d = l && l.name ? l.name : t9  } = o, p = o.target || u1(d, l), m = _(s);
    return [n, c] = xt(n, c, t9), c && (ee(c, t9, 'clock'), n = x({
        source: n,
        clock: c,
        greedy: i,
        fn: m ? null : (e, t)=>({
                source: e,
                clock: t
            })
    })), ee(p, t9, 'target'), m ? x({
        source: s,
        clock: n,
        target: a1({
            node: [
                ue(({ guard: e  })=>e
                , 1),
                ue(({ data: e  })=>e
                )
            ],
            child: p,
            meta: {
                op: t9
            },
            family: {
                owners: [
                    n,
                    s,
                    p,
                    ...[].concat(c || [])
                ],
                links: p
            },
            regional: 1
        }),
        fn: (e, t)=>({
                guard: e,
                data: t
            })
        ,
        greedy: i,
        name: d
    }) : (r1(Q(s), '`filter` should be function or unit'), ft(n, p, c ? [
        fe({
            fn: ({ source: e , clock: t  }, { fn: r  })=>r(e, t)
        }),
        ue(({ source: e  })=>e
        )
    ] : [
        fe({
            fn: ve
        })
    ], t9, s)), p;
}
function M(t10, r, n) {
    if (V(t10)) return t10;
    if (E(t10) || L(t10)) {
        let e = je(t10), a = d1(r, {
            parent: e,
            name: t10.shortName,
            and: n
        });
        return ft(L(t10) ? t10.doneData : t10, a), e && e.hooks.store(a), a;
    }
    let a = Array.isArray(t10) ? [] : {
    };
    return e1(t10, (e, t)=>a[t] = V(e) ? e : d1(e, {
            name: t
        })
    ), a;
}
function j(...t11) {
    let n7, [[o2, l], s] = f1(t11), i = !l;
    i && (n7 = o2.cases, l = o2.match, o2 = o2.source);
    let d = V(l), p = !_(l) && Q(l), m = !d && !p && K(l);
    n7 || (n7 = {
    }), i || (r1(m, 'match should be an object'), e1(l, (e, t)=>n7[t] = u1(s)
    ), n7.__ = u1(s));
    let g, h = new Set([].concat(o2, Object.values(n7))), y = Object.keys(d || p ? n7 : l);
    if (d || p) d && h.add(l), g = [
        d && de(xe(l), 0, 1),
        ie({
            safe: d,
            filter: 1,
            fn (e, t, r) {
                let n = String(d ? r.a : l(e));
                Ct(t, U(y, n) ? n : '__', e, r);
            }
        })
    ];
    else if (m) {
        let t12 = me({
        });
        t12.type = 'shape';
        let r5, n = [];
        e1(l, (e15, a)=>{
            if (_(e15)) {
                r5 = 1, G(n, a), h.add(e15);
                let o = ft(e15, [], [
                    de(t12),
                    ue((e, t, { a: r  })=>r[a] = e
                    )
                ]);
                if (V(e15)) {
                    t12.current[a] = e15.getState();
                    let r = xe(e15);
                    he(t12, {
                        from: r,
                        field: a,
                        type: 'field'
                    }), c1('splitMatchStore', r, o);
                }
            }
        }), r5 && c1('splitBase', t12), g = [
            r5 && de(t12, 0, 1),
            fe({
                fn (e, t, r) {
                    for(let a = 0; a < y.length; a++){
                        let o = y[a];
                        if (U(n, o) ? r.a[o] : l[o](e)) return void Ct(t, o, e, r);
                    }
                    Ct(t, '__', e, r);
                }
            })
        ];
    } else r1(0, 'expect match to be unit, function or object');
    if (a1({
        meta: {
            op: 'split'
        },
        parent: o2,
        scope: n7,
        node: g,
        family: {
            owners: Array.from(h)
        },
        regional: 1
    }), !i) return n7;
}
function A(e16, { scope: t , params: r  }) {
    if (!_(e16)) return Promise.reject(Error('first argument should be unit'));
    let n = g1();
    n.parentFork = Ue;
    let { fxCount: a  } = t;
    G(a.scope.defers, n);
    let l = [
        e16
    ], s = [];
    return G(s, L(e16) ? {
        params: r,
        req: {
            rs (e) {
                n.value = {
                    status: 'done',
                    value: e
                };
            },
            rj (e) {
                n.value = {
                    status: 'fail',
                    value: e
                };
            }
        }
    } : r), G(l, a), G(s, null), o1({
        target: l,
        params: s,
        scope: t
    }), n.req;
}
function I(e17, r) {
    let n = [];
    (function e(a) {
        U(n, a) || (G(n, a), "store" === Ie(a, 'op') && Ie(a, 'sid') && r(a, Ie(a, 'sid')), t1(a.next, e), t1(we(a), e), t1(Se(a), e));
    })(e17);
}
function q(e18, n) {
    if (Array.isArray(e18) && (e18 = new Map(e18)), e18 instanceof Map) {
        let a = {
        };
        return t1(e18, (e, t)=>{
            r1(_(t), 'Map key should be a unit'), n && n(t, e), r1(t.sid, 'unit should have a sid'), r1(!(t.sid in a), 'duplicate sid found'), a[t.sid] = e;
        }), a;
    }
    return e18;
}
function $(e19, n8) {
    let o3, l = e19;
    B(e19) && (o3 = e19, l = n8);
    let s = ((e20)=>{
        let r6 = a1({
            scope: {
                defers: [],
                inFlight: 0,
                fxID: 0
            },
            node: [
                ue((e, t, r)=>{
                    je(r) ? 'dec' === Ie(je(r).node, 'needFxCounter') ? t.inFlight -= 1 : (t.inFlight += 1, t.fxID += 1) : t.fxID += 1;
                }),
                ie({
                    priority: "sampler",
                    batch: 1
                }),
                ue((e21, r)=>{
                    let { defers: n , fxID: a  } = r;
                    r.inFlight > 0 || 0 === n.length || Promise.resolve().then(()=>{
                        r.fxID === a && t1(n.splice(0, n.length), (e)=>{
                            Ke(e.parentFork), e.rs(e.value);
                        });
                    });
                }, 0, 1)
            ]
        }), n9 = a1({
            node: [
                ue((e, t, r)=>{
                    let n = je(r);
                    if (n && je(n)) {
                        let t = n.node;
                        if (!Ie(t, 'isCombine') || 'combine' !== Ie(je(n).node, 'op')) {
                            let n = Ae(r), a = t.scope.state.id, o = Ie(t, 'sid');
                            n.sidIdMap[o] = a, n.sidValuesMap[o] = e;
                        }
                    }
                })
            ]
        }), o = {
            cloneOf: e20,
            reg: {
            },
            sidValuesMap: {
            },
            sidIdMap: {
            },
            getState (e) {
                if ('current' in e) return Ye(Je, o, null, e).current;
                let t = ke(e);
                return Ye(Je, o, t, t.scope.state, 1).current;
            },
            kind: "scope",
            graphite: a1({
                family: {
                    type: "domain",
                    links: [
                        r6,
                        n9
                    ]
                },
                meta: {
                    unit: 'fork'
                },
                scope: {
                    forkInFlightCounter: r6
                }
            }),
            additionalLinks: {
            },
            handlers: {
            },
            fxCount: r6,
            storeChange: n9
        };
        return o;
    })(o3);
    if (l) {
        if (l.values) {
            let e22 = q(l.values, (e)=>r1(V(e), 'Values map can contain only stores as keys')
            );
            Object.assign(s.sidValuesMap, e22);
        }
        l.handlers && (s.handlers = q(l.handlers, (e)=>r1(L(e), "Handlers map can contain only effects as keys")
        ));
    }
    return s;
}
function N(e23, { values: t13  }) {
    r1(K(t13), 'values property should be an object');
    let n, a, l, s = q(t13), i = Object.getOwnPropertyNames(s), f = [], c = [];
    T(e23) ? (n = e23, l = 1, r1(n.cloneOf, 'scope should be created from domain'), a = ke(n.cloneOf)) : B(e23) ? a = ke(e23) : r1(0, 'first argument of hydrate should be domain or scope'), I(a, (e, t)=>{
        U(i, t) && (G(f, e), G(c, s[t]));
    }), o1({
        target: f,
        params: c,
        scope: n
    }), l && Object.assign(n.sidValuesMap, s);
}
function F(e, { scope: t14  } = {
}) {
    r1(t14 || Ue, 'scopeBind cannot be called outside of forked .watch');
    let n = t14 || Ue;
    return L(e) ? (t)=>{
        let r = g1();
        return o1({
            target: e,
            params: {
                params: t,
                req: r
            },
            scope: n
        }), r.req;
    } : (t)=>(o1({
            target: e,
            params: t,
            scope: n
        }), t)
    ;
}
function O(t, n10 = {
}) {
    let a = n10.ignore ? n10.ignore.map(({ sid: e  })=>e
    ) : [], o = {
    };
    return e1(t.sidValuesMap, (e, r)=>{
        if (U(a, r)) return;
        let n = t.sidIdMap[r];
        o[r] = n && n in t.reg ? t.reg[n].current : e;
    }), 'onlyChanges' in n10 && !n10.onlyChanges && (r1(t.cloneOf, 'scope should be created from domain'), I(ke(t.cloneOf), (e, r)=>{
        r in o || U(a, r) || Ie(e, 'isCombine') || 'ignore' === Ie(e, 'serialize') || (o[r] = t.getState(e));
    })), o;
}
let D = 'undefined' != typeof Symbol && Symbol.observable || '@@observable', R = 'map', z = 'stack', _ = (e)=>(Q(e) || K(e)) && 'kind' in e
;
const P = (e)=>(t)=>_(t) && t.kind === e
;
let V = P("store"), E = P("event"), L = P("effect"), B = P("domain"), T = P("scope");
var W = {
    __proto__: null,
    unit: _,
    store: V,
    event: E,
    effect: L,
    domain: B,
    scope: T
};
let U = (e, t)=>e.includes(t)
, H = (e, t)=>{
    let r = e.indexOf(t);
    -1 !== r && e.splice(r, 1);
}, G = (e, t)=>e.push(t)
, J = (e, t, r)=>!e && console.error(`${t} is deprecated, use ${r} instead`)
, K = (e)=>'object' == typeof e && null !== e
, Q = (e)=>'function' == typeof e
, X = (e)=>void 0 === e
, Y = (e)=>r1(K(e) || Q(e), 'expect first argument be an object')
;
const Z = (e, t, n, a)=>r1(!(!K(e) && !Q(e) || !('family' in e) && !('graphite' in e)), `${t}: expect ${n} to be a unit (store, event or effect)${a}`)
;
let ee = (e24, r, n)=>{
    Array.isArray(e24) ? t1(e24, (e, t)=>Z(e, r, `${t} item of ${n}`, '')
    ) : Z(e24, r, n, ' or array of units');
};
const te = ()=>{
    let e = 0;
    return ()=>"" + ++e
    ;
};
let re = te(), ne = te(), ae = te();
const oe = (e, t, r, n)=>{
    let a = {
        id: ne(),
        type: e,
        data: t
    };
    return r && (a.order = {
        priority: r
    }, n && (a.order.barrierID = ++le)), a;
};
let le = 0, se = ({ from: e = "store" , store: t , target: r , to: n = r ? "store" : z , batch: a , priority: o  })=>oe('mov', {
        from: e,
        store: t,
        to: n,
        target: r
    }, o, a)
, ie = ({ fn: e , batch: t , priority: r , safe: n = 0 , filter: a = 0  })=>oe('compute', {
        fn: e,
        safe: n,
        filter: a
    }, r, t)
, fe = ({ fn: e  })=>ie({
        fn: e,
        filter: 1
    })
, ce = ({ fn: e  })=>ie({
        fn: e,
        priority: "effect"
    })
, ue = (e, t, r)=>ie({
        fn: e,
        safe: 1,
        filter: t,
        priority: r && "effect"
    })
, de = (e, t, r)=>se({
        store: e,
        to: t ? z : "a",
        priority: r && "sampler",
        batch: 1
    })
, pe = {
    mov: se,
    compute: ie,
    filter: fe,
    run: ce
}, me = (e)=>({
        id: ne(),
        current: e
    })
, ge = ({ current: e  })=>e
, he = (e, t)=>{
    e.before || (e.before = []), G(e.before, t);
}, ye = (e, { fn: t  }, { a: r  })=>t(e, r)
, be = (e, { fn: t  }, { a: r  })=>t(r, e)
, ve = (e, { fn: t  })=>t(e)
, ke = (e)=>e.graphite || e
, we = (e)=>e.family.owners
, Se = (e)=>e.family.links
, xe = (e)=>e.stateRef
, Ce = (e)=>e.value
, Me = (e)=>e.subscribers
, je = (e)=>e.parent
, Ae = (e)=>e.scope
, Ie = (e, t)=>ke(e).meta[t]
, qe = (e, t, r)=>ke(e).meta[t] = r
, $e = (e25, r)=>{
    let n = ke(e25);
    t1(r, (e)=>{
        let t = ke(e);
        "domain" !== n.family.type && (t.family.type = "crosslink"), G(we(t), n), G(Se(n), t);
    });
}, Ne = null, Fe = ()=>Ne && Ne.template
, Oe = (e)=>(e && Ne && Ne.sidRoot && (e = `${Ne.sidRoot}|${e}`), e)
, De = ({ sid: e , name: t , loc: r , method: o , fn: l  })=>n1(a1({
        meta: {
            sidRoot: Oe(e),
            name: t,
            loc: r,
            method: o
        }
    }), l)
;
const Re = (e = [])=>(Array.isArray(e) ? e : [
        e
    ]).flat().map(ke)
;
let ze = null;
const _e = (e, t)=>{
    if (!e) return t;
    if (!t) return e;
    let r;
    return (e.v.type === t.v.type && e.v.id > t.v.id || Te(e.v.type) > Te(t.v.type)) && (r = e, e = t, t = r), r = _e(e.r, t), e.r = e.l, e.l = r, e;
}, Pe = [];
let Ve = 0;
for(; Ve < 6;)G(Pe, {
    first: null,
    last: null,
    size: 0
}), Ve += 1;
const Ee = ()=>{
    for(let e = 0; e < 6; e++){
        let t = Pe[e];
        if (t.size > 0) {
            if (3 === e || 4 === e) {
                t.size -= 1;
                let e = ze.v;
                return ze = _e(ze.l, ze.r), e;
            }
            1 === t.size && (t.last = null);
            let r = t.first;
            return t.first = r.r, t.size -= 1, r.v;
        }
    }
}, Le = (e, t, r, n, a, o)=>Be(0, {
        a: null,
        b: null,
        node: r,
        parent: n,
        value: a,
        page: t,
        scope: o
    }, e)
, Be = (e, t, r, n = 0)=>{
    let a = Te(r), o = Pe[a], l = {
        v: {
            idx: e,
            stack: t,
            type: r,
            id: n
        },
        l: null,
        r: null
    };
    3 === a || 4 === a ? ze = _e(ze, l) : (0 === o.size ? o.first = l : o.last.r = l, o.last = l), o.size += 1;
}, Te = (e)=>{
    switch(e){
        case 'child':
            return 0;
        case 'pure':
            return 1;
        case 'read':
            return 2;
        case "barrier":
            return 3;
        case "sampler":
            return 4;
        case "effect":
            return 5;
        default:
            return -1;
    }
}, We = new Set;
let Ue, He = 1, Ge = 0, Je = null, Ke = (e)=>{
    Ue = e;
}, Qe = (e)=>{
    Je = e;
};
const Xe = (e, t)=>{
    if (e) {
        for(; e && !e.reg[t];)e = je(e);
        if (e) return e;
    }
    return null;
};
let Ye = (e, t, r, n, a)=>{
    let o = Xe(e, n.id);
    return o ? o.reg[n.id] : t ? (Ze(t, n, a), t.reg[n.id]) : n;
}, Ze = (e, r7, n, a, o5)=>{
    let l = e.reg, s = r7.sid;
    if (l[r7.id]) return;
    let i = {
        id: r7.id,
        current: r7.current
    };
    if (s && s in e.sidValuesMap && !(s in e.sidIdMap)) i.current = e.sidValuesMap[s];
    else if (r7.before && !o5) {
        let o4 = 0, s = n || !r7.noInit || a;
        t1(r7.before, (t)=>{
            switch(t.type){
                case R:
                    {
                        let r = t.from;
                        if (r || t.fn) {
                            r && Ze(e, r, n, a);
                            let o = r && l[r.id].current;
                            s && (i.current = t.fn ? t.fn(o) : o);
                        }
                        break;
                    }
                case 'field':
                    o4 || (o4 = 1, i.current = Array.isArray(i.current) ? [
                        ...i.current
                    ] : {
                        ...i.current
                    }), Ze(e, t.from, n, a), s && (i.current[t.field] = l[l[t.from.id].id].current);
            }
        });
    }
    s && (e.sidIdMap[s] = r7.id), l[r7.id] = i;
};
const et = (e, t, r)=>{
    try {
        return t(Ce(r), e.scope, r);
    } catch (t15) {
        console.error(t15), e.fail = 1;
    }
}, tt = (e)=>e.compositeName
;
let rt = (t16, r = {
})=>(K(t16) && (rt(t16.or, r), e1(t16, (e, t)=>{
        X(e) || 'or' === t || 'and' === t || (r[t] = e);
    }), rt(t16.and, r)), r)
;
const nt = (e, t)=>{
    H(e.next, t), H(we(e), t), H(Se(e), t);
}, at = (e, t, r)=>{
    let n;
    e.next.length = 0, e.seq.length = 0, e.scope = null;
    let a = Se(e);
    for(; n = a.pop();)nt(n, e), (t || r && 'sample' !== Ie(e, 'op') || "crosslink" === n.family.type) && at(n, t, 'on' !== Ie(n, 'op') && r);
    for(a = we(e); n = a.pop();)nt(n, e), r && "crosslink" === n.family.type && at(n, t, 'on' !== Ie(n, 'op') && r);
}, ot = (e)=>e.clear()
;
let lt = (e, { deep: t  } = {
})=>{
    let r = 0;
    if (e.ownerSet && e.ownerSet.delete(e), V(e)) ot(Me(e));
    else if (B(e)) {
        r = 1;
        let t = e.history;
        ot(t.events), ot(t.effects), ot(t.stores), ot(t.domains);
    }
    at(ke(e), !!t, r);
}, st = (e)=>{
    let t = ()=>lt(e)
    ;
    return t.unsubscribe = t, t;
}, ft = (e, t, r, n, o)=>a1({
        node: r,
        parent: e,
        child: t,
        scope: {
            fn: o
        },
        meta: {
            op: n
        },
        family: {
            owners: [
                e,
                t
            ],
            links: t
        },
        regional: 1
    })
, ct = (e)=>{
    let [{ from: t , to: r  }, n] = f1(e, 1);
    return ee(t, 'forward', '"from"'), ee(r, 'forward', '"to"'), st(a1({
        parent: t,
        child: r,
        meta: {
            op: 'forward',
            config: n
        },
        family: {
        },
        regional: 1
    }));
}, ut = (e, t)=>(r1(Q(t), '.watch argument should be a function'), st(a1({
        scope: {
            fn: t
        },
        node: [
            ce({
                fn: ve
            })
        ],
        parent: e,
        meta: {
            op: 'watch'
        },
        family: {
            owners: e
        },
        regional: 1
    })))
, dt = (e, t, r = "event")=>{
    je(e) && je(e).hooks[r](t);
}, pt = (e26, t17, r, n)=>{
    let a = "domain" === e26, o = re(), l = rt({
        or: n,
        and: 'string' == typeof r ? {
            name: r
        } : r
    }), { parent: s = null , sid: f = null , named: c = null  } = l, u = c || l.name || (a ? '' : o), d = i1(u, s), p = {
        op: t17.kind = e26,
        name: t17.shortName = u,
        sid: t17.sid = Oe(f),
        named: c,
        unitId: t17.id = o,
        serialize: l.serialize,
        derived: l.derived
    };
    if (t17.parent = s, t17.compositeName = d, t17.defaultConfig = l, t17.thru = (e)=>(J(0, 'thru', 'js pipe'), e(t17))
    , t17.getType = ()=>d.fullName
    , !a) {
        t17.subscribe = (e)=>(Y(e), t17.watch(Q(e) ? e : (t)=>e.next && e.next(t)
            ))
        , t17[D] = ()=>t17
        ;
        let e27 = Fe();
        e27 && (p.nativeTemplate = e27);
    }
    return p;
}, mt = (e)=>u1({
        named: e
    })
;
const gt = (e, t, r, n)=>{
    let a;
    K(r) && (a = r, r = r.fn);
    let o = u1({
        name: `${e.shortName} \u2192 *`,
        derived: 1,
        and: a
    });
    return ft(e, o, n, t, r), o;
}, ht = (e, t, r, n, a)=>{
    let o = xe(t), l = se({
        store: o,
        to: "a",
        priority: 'read'
    });
    r === R && (l.data.softRead = 1);
    let s = [
        l,
        ie({
            fn: n
        })
    ];
    return c1('storeOnMap', o, s, V(e) && xe(e)), ft(e, t, s, r, a);
}, yt = (t18, n11, a2, o, s)=>{
    let i = t18 ? (e)=>e.slice()
     : (e)=>({
            ...e
        })
    , f = t18 ? [] : {
    }, u = i(f), p = me(u), m = me(1);
    p.type = t18 ? 'list' : 'shape', p.noInit = 1, c1('combineBase', p, m);
    let g = d1(u, {
        name: l1(a2),
        derived: 1,
        and: o
    }), h = xe(g);
    h.noInit = 1, qe(g, 'isCombine', 1);
    let y = [
        ue((e, t, r)=>(r.scope && !r.scope.reg[p.id] && (r.c = 1), e)
        ),
        de(p),
        se({
            store: m,
            to: 'b'
        }),
        ue((e, { key: t  }, r)=>{
            if (r.c || e !== r.a[t]) return n11 && r.b && (r.a = i(r.a)), r.a[t] = e, 1;
        }, 1),
        se({
            from: "a",
            target: p
        }),
        se({
            from: "value",
            store: 0,
            target: m
        }),
        se({
            from: "value",
            store: 1,
            target: m,
            priority: "barrier",
            batch: 1
        }),
        de(p, 1),
        s && ie({
            fn: ve
        })
    ];
    return e1(a2, (e, t)=>{
        if (!V(e)) return r1(!_(e) && !X(e), `combine expects a store in a field ${t}`), void (u[t] = f[t] = e);
        f[t] = e.defaultState, u[t] = e.getState();
        let n = ft(e, g, y, 'combine', s);
        n.scope.key = t;
        let a = xe(e);
        he(p, {
            type: 'field',
            field: t,
            from: a
        }), c1('combineField', a, n);
    }), g.defaultShape = a2, he(h, {
        type: R,
        from: p,
        fn: s
    }), Fe() || (g.defaultState = s ? h.current = s(u) : f), g;
};
let bt = (e, t, r)=>{
    try {
        return [
            1,
            e(...r)
        ];
    } catch (e28) {
        return t(e28), [
            0,
            null
        ];
    }
}, vt = (e, t, r, n, a)=>(l)=>o1({
            target: [
                n,
                kt
            ],
            params: [
                r ? {
                    status: 'done',
                    params: e,
                    result: l
                } : {
                    status: 'fail',
                    params: e,
                    error: l
                },
                {
                    value: l,
                    fn: r ? t.rs : t.rj
                }
            ],
            defer: 1,
            page: a.page,
            scope: Ae(a)
        })
, kt = a1({
    node: [
        ce({
            fn: ({ fn: e , value: t  })=>e(t)
        })
    ],
    meta: {
        op: 'fx',
        fx: 'sidechain'
    }
});
const wt = [
    'source',
    'clock',
    'target'
], St = (e, t)=>e + `: ${t} should be defined`
;
let xt = (e, t, n)=>(r1(!X(e) || !X(t), St(n, 'either source or clock')), X(e) ? (ee(t, n, 'clock'), Array.isArray(t) && (t = w(t)), e = t) : _(e) || (e = p1(e)), [
        e,
        t
    ])
;
const Ct = (e, t, r, n)=>{
    let a = e[t];
    a && o1({
        target: a,
        params: Array.isArray(a) ? a.map(()=>r
        ) : r,
        defer: 1,
        stack: n
    });
}, Mt = "22.1.2";

},{"@parcel/transformer-js/src/esmodule-helpers.js":"ciiiV"}],"ciiiV":[function(require,module,exports) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, '__esModule', {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === 'default' || key === '__esModule' || dest.hasOwnProperty(key)) return;
        Object.defineProperty(dest, key, {
            enumerable: true,
            get: function() {
                return source[key];
            }
        });
    });
    return dest;
};
exports.export = function(dest, destName, get) {
    Object.defineProperty(dest, destName, {
        enumerable: true,
        get: get
    });
};

},{}],"aey4A":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Header", ()=>Header
);
var _effectorDom = require("effector-dom");
var _effector = require("effector");
var _title = require("./title");
var _model = require("./model");
const Header = ()=>{
    _effectorDom.h('header', ()=>{
        _title.Title();
        _effectorDom.h('input', ()=>{
            const keypress = _effector.createEvent();
            const input = _effector.createEvent();
            // создадим фильтруемое событие,
            const submit = keypress.filter({
                fn: (e)=>e.key === 'Enter'
            });
            // стор с текущим значением инпута
            const $value = _effector.createStore('').on(input, (_, e)=>e.target.value
            ).reset(_model.appended); // заодно очистим при отправке
            // для перенаправления события в другое в эффекторе есть forward({from, to})
            _effector.forward({
                // возьмем текущее значение $value по триггеру submit,
                // и сразу сделаем фильтрацию для проверки значения
                from: _effector.sample($value, submit).filter({
                    fn: Boolean
                }),
                to: _model.appended
            });
            _effectorDom.spec({
                attr: {
                    class: "new-todo",
                    placeholder: 'What needs to be done?',
                    value: $value
                },
                handler: {
                    keypress,
                    input
                }
            });
        });
    });
};

},{"effector-dom":"bckam","effector":"6OH3Z","./title":"eRfoS","./model":"l19vq","@parcel/transformer-js/src/esmodule-helpers.js":"ciiiV"}],"eRfoS":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Title", ()=>Title
);
var _effectorDom = require("effector-dom");
const Title = ()=>{
    _effectorDom.h('h1', {
        text: 'todos'
    });
};

},{"effector-dom":"bckam","@parcel/transformer-js/src/esmodule-helpers.js":"ciiiV"}],"l19vq":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "$todos", ()=>$todos
);
parcelHelpers.export(exports, "$activeFilter", ()=>$activeFilter
);
parcelHelpers.export(exports, "$filteredTodos", ()=>$filteredTodos
);
parcelHelpers.export(exports, "$isAllCompleted", ()=>$isAllCompleted
);
parcelHelpers.export(exports, "appended", ()=>appended
);
parcelHelpers.export(exports, "toggled", ()=>toggled
);
parcelHelpers.export(exports, "removed", ()=>removed
);
parcelHelpers.export(exports, "allCompleted", ()=>allCompleted
);
parcelHelpers.export(exports, "completedRemoved", ()=>completedRemoved
);
parcelHelpers.export(exports, "filtered", ()=>filtered
);
// src/model.js
var _effector = require("effector");
var _sync = require("effector-localstorage/sync");
var _syncDefault = parcelHelpers.interopDefault(_sync);
// сторы
const $todosLocalStorage = _syncDefault.default("todos").onError((err)=>console.log(err)
) // setup error callback
;
const $todos = _effector.createStore($todosLocalStorage.init([]));
$todos.watch($todosLocalStorage);
const $activeFilter = _effector.createStore(null);
const $filteredTodos = _effector.combine($todos, $activeFilter, (todos, filter)=>filter === null ? todos : todos.filter((todo)=>todo.completed === filter
    )
);
const $isAllCompleted = $todos.map((todos)=>todos.every((todo)=>todo.completed
    )
);
const appended = _effector.createEvent();
const toggled = _effector.createEvent();
const removed = _effector.createEvent();
const allCompleted = _effector.createEvent();
const completedRemoved = _effector.createEvent();
const filtered = _effector.createEvent();
$todos// добавление новой задачи
.on(appended, (state, title)=>[
        ...state,
        {
            title,
            completed: false
        }
    ]
)// удаление задачи. Для простоты будем проверять title
.on(removed, (state, title)=>state.filter((item)=>item.title !== title
    )
)// выполнение/снятие выполнения
.on(toggled, (state, title)=>state.map((item)=>item.title === title ? {
            ...item,
            completed: !item.completed
        } : item
    )
)// выполнение всех задач
.on(allCompleted, (state)=>{
    const val = !$isAllCompleted.getState();
    return state.map((item)=>item.completed === val ? item : {
            ...item,
            completed: val
        }
    );
})// удаление выполненных задач
.on(completedRemoved, (state)=>state.filter((item)=>!item.completed
    )
);
$activeFilter// фильтрация
.on(filtered, (_, filter)=>filter
);

},{"effector":"6OH3Z","@parcel/transformer-js/src/esmodule-helpers.js":"ciiiV","effector-localstorage/sync":"jUOwr"}],"jUOwr":[function(require,module,exports) {
function connectStorage(key) {
    var errorHandler;
    function holder(value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (err) {
            errorHandler && errorHandler(err);
        }
    }
    holder.onError = function(handler) {
        errorHandler = handler;
        return holder;
    };
    holder.onChange = function(event) {
        addEventListener('storage', function(e) {
            e.key === key && event(holder.init());
        });
        return holder;
    };
    holder.init = function(value) {
        try {
            var item = localStorage.getItem(key);
            return item === null ? value : JSON.parse(item);
        } catch (err) {
            errorHandler && errorHandler(err);
        }
        return value;
    };
    return holder;
}
module.exports = connectStorage;

},{}],"l5eIm":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Main", ()=>Main
);
// src/view/main.js
var _effectorDom = require("effector-dom");
var _todoItem = require("./todoItem");
var _model = require("./model");
const Main = (a)=>{
    _effectorDom.h('section', ()=>{
        _effectorDom.spec({
            attr: {
                class: 'main'
            }
        });
        // выбор всех задач
        _effectorDom.h('input', {
            attr: {
                id: 'toggle-all',
                class: 'toggle-all',
                type: 'checkbox',
                checked: _model.$isAllCompleted
            },
            handler: {
                change: _model.allCompleted
            }
        });
        _effectorDom.h('label', {
            attr: {
                for: 'toggle-all'
            }
        });
        // список задач
        _effectorDom.h('ul', ()=>{
            _effectorDom.spec({
                attr: {
                    class: "todo-list"
                }
            });
            _effectorDom.list({
                source: _model.$filteredTodos,
                key: 'title',
                fields: [
                    'title',
                    'completed'
                ]
            }, ({ fields: [title, completed] , key  })=>_todoItem.TodoItem({
                    title,
                    completed,
                    key
                })
            );
        });
    });
};

},{"effector-dom":"bckam","./todoItem":"hi47Q","./model":"l19vq","@parcel/transformer-js/src/esmodule-helpers.js":"ciiiV"}],"hi47Q":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "TodoItem", ()=>TodoItem
);
var _effectorDom = require("effector-dom");
var _model = require("./model");
const TodoItem = ({ title , completed , key  })=>{
    _effectorDom.h('li', ()=>{
        // новый наследуемый стор с классом по флагу
        _effectorDom.spec({
            attr: {
                class: completed.map((flag)=>flag ? 'completed' : false
                )
            }
        });
        _effectorDom.h('div', ()=>{
            _effectorDom.spec({
                attr: {
                    class: 'view'
                }
            });
            _effectorDom.h('input', {
                attr: {
                    class: 'toggle',
                    type: 'checkbox',
                    checked: completed
                },
                // новое событие с предустановкой параметров
                handler: {
                    click: _model.toggled.prepend(()=>key
                    )
                }
            });
            _effectorDom.h('label', {
                text: title
            });
            _effectorDom.h('button', {
                attr: {
                    class: 'destroy'
                },
                // новое событие с предустановкой параметров
                handler: {
                    click: _model.removed.prepend(()=>key
                    )
                }
            });
        });
    });
};

},{"effector-dom":"bckam","./model":"l19vq","@parcel/transformer-js/src/esmodule-helpers.js":"ciiiV"}],"eovH7":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Footer", ()=>Footer
);
var _effectorDom = require("effector-dom");
var _model = require("./model");
const Footer = ()=>{
    _effectorDom.h('footer', ()=>{
        _effectorDom.spec({
            attr: {
                class: 'footer'
            }
        });
        _effectorDom.h('span', ()=>{
            _effectorDom.spec({
                attr: {
                    class: 'todo-count'
                }
            });
            const $activeCount = _model.$todos.map((todos)=>todos.filter((todo)=>!todo.completed
                ).length
            );
            _effectorDom.h('strong', {
                text: $activeCount
            });
            _effectorDom.h('span', {
                text: $activeCount.map((count)=>count === 1 ? ' item left' : ' items left'
                )
            });
        });
        _effectorDom.h('ul', ()=>{
            _effectorDom.spec({
                attr: {
                    class: 'filters'
                }
            });
            _effectorDom.h('li', ()=>{
                _effectorDom.h('a', {
                    attr: {
                        class: _model.$activeFilter.map((active)=>active === null ? 'selected' : false
                        )
                    },
                    text: 'All',
                    handler: {
                        click: _model.filtered.prepend(()=>null
                        )
                    }
                });
            });
            _effectorDom.h('li', ()=>{
                _effectorDom.h('a', {
                    attr: {
                        class: _model.$activeFilter.map((completed)=>completed === false ? 'selected' : false
                        )
                    },
                    text: 'Active',
                    handler: {
                        click: _model.filtered.prepend(()=>false
                        )
                    }
                });
            });
            _effectorDom.h('li', ()=>{
                _effectorDom.h('a', {
                    attr: {
                        class: _model.$activeFilter.map((completed)=>completed === true ? 'selected' : false
                        )
                    },
                    text: 'Completed',
                    handler: {
                        click: _model.filtered.prepend(()=>true
                        )
                    }
                });
            });
        });
        _effectorDom.h('button', {
            attr: {
                class: 'clear-completed'
            },
            text: 'Clear completed',
            handler: {
                click: _model.completedRemoved
            }
        });
    });
};

},{"effector-dom":"bckam","./model":"l19vq","@parcel/transformer-js/src/esmodule-helpers.js":"ciiiV"}]},["lVHAe","hOJOi"], "hOJOi", "parcelRequire94c2")

//# sourceMappingURL=index.69062844.js.map
