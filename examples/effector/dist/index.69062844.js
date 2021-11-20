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
parcelHelpers.export(exports, "combine", ()=>ee
);
parcelHelpers.export(exports, "data", ()=>G
);
parcelHelpers.export(exports, "explicitUnmount", ()=>M
);
parcelHelpers.export(exports, "focus", ()=>K
);
parcelHelpers.export(exports, "h", ()=>A
);
parcelHelpers.export(exports, "handler", ()=>J
);
parcelHelpers.export(exports, "list", ()=>T
);
parcelHelpers.export(exports, "map", ()=>Q
);
parcelHelpers.export(exports, "node", ()=>X
);
parcelHelpers.export(exports, "nodeMethod", ()=>W
);
parcelHelpers.export(exports, "remap", ()=>R
);
parcelHelpers.export(exports, "signalOwn", ()=>z
);
parcelHelpers.export(exports, "spec", ()=>Y
);
parcelHelpers.export(exports, "storeField", ()=>D
);
parcelHelpers.export(exports, "style", ()=>H
);
parcelHelpers.export(exports, "text", ()=>U
);
parcelHelpers.export(exports, "transform", ()=>B
);
parcelHelpers.export(exports, "tree", ()=>V
);
parcelHelpers.export(exports, "using", ()=>o1
);
parcelHelpers.export(exports, "variant", ()=>te
);
parcelHelpers.export(exports, "visible", ()=>Z
);
var _effector = require("effector");
var process = require("process");
function e2(e, t) {
    const n = ge(e);
    for(let e1 = 0; e1 < t.length; e1++){
        const s = ge(t[e1]);
        s.family.type = 'crosslink';
        const l = me(s), i = be(n);
        l.includes(n) || l.push(n), i.includes(s) || i.push(s);
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
function l1() {
    const e = {
        stack: null
    }, t = de.get(), n = _effector.createNode({
        node: [
            ve,
            ke
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
function i1(e) {
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
            return e.replace(we, '');
    }
}
function r1(e) {
    return String(e).replace(xe, '');
}
function o1(e, t) {
    const n = e.namespaceURI, s = e.tagName.toLowerCase(), i = 'http://www.w3.org/2000/svg' === n ? 'svg' : 'foreignObject' === s ? 'foreignObject' : 'html', r = de.get(), o = {
        parent: r,
        signal: r && r.signal ? r.signal : l1(),
        namespace: i,
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
    de.replace(o), he.push({
        node: e,
        append: [],
        reverse: 0
    });
    try {
        _effector.withRegion(o.signal, t);
    } finally{
        a1(he.pop()), de.replace(r);
    }
}
function a1({ node: e , append: t , reverse: n = 0  }) {
    if (0 === t.length) return;
    const s = Ie.createDocumentFragment();
    if (n) {
        for(let e3 = t.length - 1; e3 >= 0; e3--)s.appendChild(t[e3]);
        e.prepend(s);
    } else {
        for(let e4 = 0; e4 < t.length; e4++)s.appendChild(t[e4]);
        e.appendChild(s);
    }
}
function c1(e, t) {
    t.parent = e, t.signal.seq.push(Ne), t.signal.scope.stack = t, e.child.push(t);
}
function f1(e, t) {
    return _effector.createNode({
        node: [
            _e
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
    Ve = 0, Re();
}
function h1(e6, t, n) {
    const s = ((e)=>'high' === We.get(e) ? ze : Le
    )(e6);
    let l = s.get(e6);
    if (l || (l = [], s.set(e6, l)), t) for(let e5 = 0; e5 < n.length; e5++)l.push(n[e5]);
    else l.push(n);
    Fe();
}
function p1(t, n, s = 0, l = "low") {
    const i = ++Xe, r = _effector.createEvent(), o = _effector.is.store(a = t) ? a.updates : a;
    var a;
    const c = {
        type: 'crosslink',
        owners: [
            o,
            r
        ]
    };
    return _effector.createNode({
        node: [
            He
        ],
        parent: [
            o
        ],
        scope: {
            taskID: i,
            flat: s
        },
        family: c
    }), e2(t, [
        r
    ]), Me.set(i, _effector.createNode({
        node: [
            Je
        ],
        child: [
            _effector.createNode({
                node: [
                    Be,
                    Ue,
                    Ze
                ],
                scope: {
                    taskID: i
                },
                family: c
            }),
            _effector.createNode({
                node: [
                    Ge,
                    Ue
                ],
                child: [
                    r
                ],
                family: c
            })
        ],
        scope: {
            fn: n
        },
        family: c
    })), We.set(i, l), r;
}
function d1({ trigger: e7 = _effector.createEvent() , fn: t3 , priority: n2 = "low" , timeout: s = 1 / 0 , batchWindow: l = 0 , retries: i2 = 1 / 0 , mark: r2 = e7.shortName  }) {
    const o2 = p1(e7.map((e)=>[
            {
                inserted: Oe(),
                retry: 0,
                value: e
            }
        ]
    ), (e, n)=>{
        let r, o = 0;
        const a = [], c = [];
        for(r = 0; r < e.length; r++){
            const i = e[r], f = Oe();
            if (i.inserted + l > f) {
                c.push(i);
                continue;
            }
            if (i.inserted + s < f) continue;
            if (f - n >= 10) {
                o = 1;
                break;
            }
            const u = t3(i.value);
            void 0 !== u && a.push(u);
        }
        if (o) for(let t2 = r; t2 < e.length; t2++){
            const n = e[t2];
            n.retry += 1, n.retry >= i2 || c.push(n);
        }
        return {
            done: a,
            fail: c
        };
    }, 1, n2);
    return {
        trigger: e7,
        processed: o2,
        connect: (t)=>{
            _effector.createNode({
                node: [],
                parent: t,
                child: e7,
                family: {
                    type: 'crosslink',
                    owners: [
                        t,
                        e7
                    ]
                }
            });
        }
    };
}
function g1({ trigger: e8 = _effector.createEvent() , fn: t4 , priority: n3 = "low" , timeout: s2 = 1 / 0 , batchWindow: l2 = 0 , retries: i3 = 1 / 0 , mark: r3 = e8.shortName , flatten: o3  }) {
    const a2 = p1(e8.map((e)=>{
        const t = [], n = Oe();
        for(let s = 0; s < e.length; s++){
            const l = o3(e[s]);
            for(let e9 = 0; e9 < l.length; e9++)t.push({
                inserted: n,
                retry: 0,
                value: l[e9]
            });
        }
        return t;
    }), (e, n)=>{
        let r, o = 0;
        const a = [], c = [];
        for(r = 0; r < e.length; r++){
            const i = e[r], f = Oe();
            if (i.inserted + l2 > f) {
                c.push(i);
                continue;
            }
            if (i.inserted + s2 < f) continue;
            if (f - n >= 10) {
                o = 1;
                break;
            }
            const u = t4(i.value);
            void 0 !== u && a.push(u);
        }
        if (o) for(let t = r; t < e.length; t++){
            const n = e[t];
            n.retry += 1, n.retry >= i3 || c.push(n);
        }
        return {
            done: a,
            fail: c
        };
    }, 1, n3);
    return {
        trigger: e8,
        processed: a2,
        connect: (t)=>{
            _effector.createNode({
                node: [
                    Ke
                ],
                parent: t,
                child: e8,
                family: {
                    type: 'crosslink',
                    owners: [
                        t,
                        e8
                    ]
                }
            });
        }
    };
}
function m1(e, t, n) {
    f1(e, t.watch(n));
}
function b(e, t, n) {
    _effector.createNode({
        node: [
            Qe
        ],
        parent: t,
        child: [
            et
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
    }), _effector.is.store(t) && _effector.launch(et, {
        data: t.getState(),
        handler: n
    }, 1);
}
function y(e, t, n, s) {
    _effector.is.unit(n) ? (e ? m1 : b)(t, n, s) : s(n);
}
function v(e, t = e.child.length - 1) {
    for(let n = t; n >= 0; n--){
        const t = e.child[n];
        switch(t.node.type){
            case 'element':
            case 'using':
                if (!t.visible) continue;
                return t;
        }
        const s = v(t);
        if (s) return s;
    }
    return null;
}
function k(e) {
    if (!e.parent) return null;
    switch(e.parent.node.type){
        case 'element':
        case 'using':
            {
                const t = v(e.parent, e.parent.child.indexOf(e) - 1);
                if (t) return t;
                break;
            }
        case 'list':
        case 'listItem':
            {
                let t = e, n = e.parent;
                for(; n;){
                    const e = v(n, n.child.indexOf(t) - 1);
                    if (e) return e;
                    t = n, n = n.parent;
                }
                break;
            }
    }
    return null;
}
function w(e) {
    return '' !== e && 0 !== e && (0 == e || null == e);
}
function x(e, t, n) {
    w(n) ? delete e[t] : e[t] = `${n}`;
}
function S(e, t, n, s) {
    if (n.visible = s, s) {
        if (!t.contains(e)) {
            const s = k(n);
            s && t.contains(s.targetElement) ? s.targetElement.after(e) : t.appendChild(e);
        }
    } else e.remove();
}
function E(e, t, n) {
    if (null === n) return;
    const s = de.get().parent.targetElement;
    b(t, n, S.bind(null, e, s, de.get()));
}
function C(e, t, n) {
    if (w(n)) {
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
function I(e10, t, n, s, l, i) {
    const r = e10.createSVGTransform();
    switch(i){
        case 'translate':
        case 'scale':
            s = ((e)=>_effector.is.store(e) ? e : _effector.is.store(e.x) ? _effector.is.store(e.y) ? _effector.combine({
                    x: e.x,
                    y: e.y
                }) : e.x.map(lt.bind(null, e.y)) : _effector.is.store(e.y) ? e.y.map(rt.bind(null, e.x)) : e
            )(s);
    }
    y(0, t, s, l.bind(null, r)), n.appendItem(r);
}
function N(e, t) {
    const n = Ie.createTextNode(`${t}`), s = e.firstChild;
    s ? s.replaceWith(n) : e.appendChild(n);
}
function _(e) {
    e.focus();
}
function $(e) {
    e.blur();
}
function A(e11, t5, n4) {
    'function' == typeof t5 && (n4 = t5, t5 = {
    }), void 0 === t5 && (t5 = {
    });
    const { noAppend: s3 = 0  } = t5, i4 = de.get(), r = i4 ? i4.namespace : 'html';
    let o = r, u = 'html';
    'type' in t5 ? (u = t5.type, o = t5.type) : o = u = 'svg' === r ? 'svg' : 'html', 'svg' === e11 && (u = 'svg', o = 'svg');
    const h = 'svg' === u ? Ie.createElementNS('http://www.w3.org/2000/svg', e11) : Ie.createElement(e11);
    'foreignObject' === r ? (h.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml'), o = 'html') : 'svg' === e11 ? (h.setAttribute('xmlns', 'http://www.w3.org/2000/svg'), o = 'svg') : 'foreignObject' === e11 && (o = 'foreignObject');
    const p = l1(), d = {
        type: 'element',
        pure: 0,
        tag: e11,
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
    i4 && c1(i4, g), 'svg' === e11 ? g.svgRoot = h : i4 && (g.svgRoot = i4.svgRoot), de.replace(g), n4 ? ((e, t, n, s)=>{
        let l = 0;
        he.push({
            node: t,
            append: [],
            reverse: 0
        });
        try {
            _effector.withRegion(e, s), l = 1;
        } finally{
            a1(he.pop()), l || de.replace(n);
        }
    })(p, h, i4, n4) : (d.pure = 1, Y(t5));
    const m = (()=>{
        const e12 = (()=>{
            const e14 = de.getElementNode(), t = {
                attr: {
                },
                data: {
                },
                visible: null,
                text: null,
                styleVar: {
                },
                styleProp: {
                },
                handler: [],
                transform: e14.transform,
                focus: e14.focus,
                blur: e14.blur
            };
            for(let n = 0; n < e14.handler.length; n++){
                const { options: s , map: l  } = e14.handler[n];
                s.passive = s.prevent ? 0 : s.passive;
                for(const e13 in l){
                    const t = l[e13];
                    l[e13] = (e)=>{
                        s.prevent && e.preventDefault(), s.stop && e.stopPropagation(), t(e);
                    };
                }
                t.handler.push({
                    options: s,
                    map: l
                });
            }
            for(let n5 = 0; n5 < e14.attr.length; n5++){
                const s = e14.attr[n5];
                for(const e in s)t.attr[e] = s[e];
            }
            for(let n6 = 0; n6 < e14.data.length; n6++){
                const s = e14.data[n6];
                for(const e in s)t.data[e] = s[e];
            }
            e14.visible.length > 0 && (t.visible = e14.visible[e14.visible.length - 1]), e14.text.length > 0 && (t.text = e14.text[e14.text.length - 1]);
            for(let n7 = 0; n7 < e14.styleVar.length; n7++){
                const s = e14.styleVar[n7];
                for(const e in s)t.styleVar[e] = s[e];
            }
            for(let n8 = 0; n8 < e14.styleProp.length; n8++){
                const s = e14.styleProp[n8];
                for(const e in s)t.styleProp[e] = s[e];
            }
            return t;
        })(), t6 = de.get(), n9 = t6.targetElement, s4 = t6.signal;
        return ((e, t, n)=>{
            for(const s in n)y('value' !== s && 'checked' !== s && 'min' !== s && 'max' !== s, t, n[s], C.bind(null, e, s));
        })(n9, s4, e12.attr), ((e, t, n)=>{
            for(const s in n)y(0, t, n[s], x.bind(null, e.dataset, s));
        })(n9, s4, e12.data), ((e, t, n)=>{
            for(let s = 0; s < n.length; s++){
                const { options: l , map: i  } = n[s];
                for(const t7 in i)e.addEventListener(t7, i[t7], l);
                f1(t, tt.bind(null, e, n[s]));
            }
        })(n9, s4, e12.handler), ((e, t, n)=>{
            const s = e.style;
            for(const e15 in n)y(0, t, n[e15], nt.bind(null, s, e15));
        })(n9, s4, e12.styleProp), ((e, t, n)=>{
            const s = e.style;
            for(const e16 in n)y(0, t, n[e16], st.bind(null, s, `--${e16}`));
        })(n9, s4, e12.styleVar), ((e, t, n)=>{
            const s = de.get();
            if ('svg' !== s.namespace) return;
            if (0 === n.length) return;
            const l = e.transform.baseVal, i = s.svgRoot;
            for(let e17 = 0; e17 < n.length; e17++){
                const s = n[e17];
                for(const e in s)I(i, t, l, s[e], ot[e], e);
            }
        })(n9, s4, e12.transform), ((e, t, n)=>{
            null !== n && (_effector.is.unit(n) ? b(t, n, N.bind(null, e)) : N(e, n));
        })(n9, s4, e12.text), E(n9, s4, e12.visible), ((e, t, n)=>{
            for(let s = 0; s < n.length; s++)y(1, t, n[s], _.bind(null, e));
        })(n9, s4, e12.focus), ((e, t, n)=>{
            for(let s = 0; s < n.length; s++)y(1, t, n[s], $.bind(null, e));
        })(n9, s4, e12.blur), e12;
    })();
    de.replace(i4), g.visible = !m.visible || m.visible.getState(), s3 || he.length > 0 && g.visible && he[he.length - 1].append.push(h);
}
function O(e, t) {
    return e.bind(null, t);
}
function R(t, n) {
    const s = de.get();
    if (Array.isArray(n)) {
        const l = [];
        for(let e = 0; e < n.length; e++)l[e] = t.map(O(P, n[e]));
        return s && e2(s.signal, l), l;
    }
    if ('object' == typeof n && null !== n) {
        const l = [], i = {
        };
        for(const e in n)i[e] = t.map(O(P, n[e])), l.push(i[e]);
        return s && e2(s.signal, l), i;
    }
    const l = t.map(O(P, n));
    return s && e2(s.signal, l), l;
}
function D(t, n) {
    const s = t.map(O(P, n)), l = de.get();
    return l && e2(l.signal, [
        s
    ]), s;
}
function P(e, t) {
    return t[e];
}
function V({ key: e , child: t , source: n10  }, s) {
    T({
        source: n10,
        key: e
    }, ({ store: n , key: l , signal: i  })=>{
        const r = R(n, t);
        s({
            store: n,
            key: l,
            signal: i
        }, ()=>{
            V({
                key: e,
                child: t,
                source: r
            }, s);
        });
    });
}
function T(t, n) {
    let s, i, r = 0;
    _effector.is.store(t) ? (i = ft, s = t) : (i = O(ut, t.key), s = t.source, r = !!t.reverse);
    const o = de.get(), a = l1(), u = {
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
    c1(o, u), de.replace(u);
    const h = {
        parentNode: o.targetElement,
        cb: n,
        shortName: s.shortName,
        reverse: r,
        parentStack: u,
        getID: i,
        fields: t.fields ? t.fields : null
    }, p = _effector.createStore(j(h, [], s.getState()));
    e2(a, [
        p
    ]), f1(a, O(pt, p)), _effector.sample({
        source: p,
        clock: s,
        fn: O(j, h),
        target: p
    }), de.replace(o);
}
function j(i, r, o) {
    const a = Array(o.length).fill(0), f = o.map(i.getID), u = [], h = [], p = [];
    for(let e = 0; e < r.length; e++){
        const t = r[e], n = t.node, s = f.indexOf(n.key);
        -1 !== s ? (h.push(t), a[s] = 1, n.store.getState() !== o[s] && _effector.launch(n.store, o[s], 1)) : p.push(t);
    }
    if (p.length > 0) {
        for(let e = 0; e < p.length; e++){
            const l = p[e], { node: i , locality: r  } = l;
            i.active = 0, i.store = null, t1(r.sibling.left.ref, r.sibling.right.ref), n1(l, null), s1(l, null);
        }
        _effector.launch(ht, p, 1);
    }
    let d = h.length > 0 ? h[h.length - 1] : null;
    for(let n = 0; n < o.length; n++){
        if (a[n]) continue;
        const s = o[n], r = _effector.createStore(s), f = l1(), p = i.fields ? R(r, i.fields) : null;
        e2(f, [
            r
        ]);
        const g = i.getID(s, n), m = {
            parent: i.parentStack,
            signal: f,
            namespace: i.parentStack.namespace,
            targetElement: i.parentStack.targetElement,
            svgRoot: i.parentStack.svgRoot,
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
                visible: []
            },
            mountStatus: 'initial',
            visible: 1
        };
        t1(d, m), d = m, c1(i.parentStack, m), u.push(m), h.push(m);
    }
    return u.length > 0 && _effector.launch(ct, {
        context: i,
        list: u
    }, 1), h;
}
function F(e, t, n, s) {
    const l = k(e);
    l && s.contains(l.targetElement) ? n ? l.targetElement.before(t) : l.targetElement.after(t) : s.appendChild(t);
}
function M(e) {
    const t = de.get();
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
function z(t) {
    const n = de.get();
    return n && e2(n.signal, [
        t
    ]), t;
}
function L(e) {
    const t = de.get();
    if ('element' !== t.node.type && 'using' !== t.node.type) throw Error(`"${e}" extension can be used only with element nodes, got "${t.node.type}"`);
}
function W(e18) {
    let t;
    return X((e)=>{
        t = e;
    }), (...n)=>{
        if (t) return t[e18](...n);
    };
}
function X(e) {
    const t = de.get();
    t.targetElement.__STATIC__ || e(t.targetElement);
}
function Y(e) {
    e.attr && q(e.attr), e.data && G(e.data), e.transform && B(e.transform), 'text' in e && U(e.text), 'visible' in e && Z(e.visible), (e.style || e.styleVar) && H({
        prop: e.style,
        val: e.styleVar
    }), e.focus && K(e.focus), e.handler && J(e.handler);
}
function q(e) {
    L('attr'), de.getElementNode().attr.push(e);
}
function G(e) {
    L('data'), de.getElementNode().data.push(e);
}
function B(e) {
    L('transform'), de.getElementNode().transform.push(e);
}
function U(e) {
    L('text'), de.getElementNode().text.push(e);
}
function Z(e) {
    const t = de.get();
    if ('element' !== t.node.type && 'using' !== t.node.type && 'listItem' !== t.node.type) throw Error(`"visible" extension can be used only with element or listItem nodes, got "${t.node.type}"`);
    de.getElementNode().visible.push(e);
}
function H({ prop: e , val: t  }) {
    L('style'), e && de.getElementNode().styleProp.push(e), t && de.getElementNode().styleVar.push(t);
}
function J(e, t) {
    L('handler'), void 0 === t && (t = e, e = {
    });
    const { passive: n = 1 , capture: s = 0 , prevent: l = 0 , stop: i = 0  } = e;
    de.getElementNode().handler.push({
        options: {
            passive: n,
            capture: s,
            prevent: l,
            stop: i
        },
        map: t
    });
}
function K({ focus: e , blur: t  }) {
    L('focus');
    const n = de.getElementNode();
    e && n.focus.push(e), t && n.blur.push(t);
}
function Q(e, { fn: t  }) {
    return console.error('separate map method is deprecated, use store.map as usual'), z(e.map(t));
}
function ee({ source: e , fn: t  }) {
    return console.error('separate combine method is deprecated, use common combine method as usual'), z(_effector.combine(e, t));
}
function te(e19, t8) {
    T({
        source: _effector.createStore(Object.entries(t8).map(([e, t])=>({
                key: e,
                val: t
            })
        )),
        key: 'key',
        fields: [
            'key',
            'val'
        ]
    }, ({ fields: [t9, n]  })=>{
        Y({
            visible: _effector.combine(t9, e19, (e, t)=>e === t
            )
        }), n.getState()();
    });
}
const he = [];
let pe;
const de = {
    get: ()=>pe
    ,
    replace (e) {
        pe = e;
    },
    getElementNode: ()=>pe.node
}, ge = (e)=>e.graphite || e
, me = (e)=>e.family.owners
, be = (e)=>e.family.links
, ye = _effector.createNode({
    node: [
        _effector.step.run({
            fn (e) {
                _effector.clearNode(e);
            }
        })
    ]
}), ve = _effector.step.compute({
    fn (e, l) {
        l.self.next.push(ye);
        const { stack: i  } = l, { parent: r  } = i, { left: o , right: a  } = i.locality.sibling;
        r && (r.locality.child.last.ref === i && (r.locality.child.last.ref = o.ref), r.locality.child.first.ref === i && (r.locality.child.first.ref = a.ref)), o.ref && o.ref.locality.sibling.right.ref === i && a.ref && a.ref.locality.sibling.left.ref === i ? t1(o.ref, a.ref) : o.ref && o.ref.locality.sibling.right.ref === i ? n1(o.ref, null) : a.ref && a.ref.locality.sibling.left.ref === i && s1(a.ref, null);
    }
}), ke = _effector.step.compute({
    fn: (e, { self: t  })=>t
}), we = /[^a-zA-Z0-9\-]/g, xe = /[\\<>"]/g;
class Se {
    constructor(){
        this.properties = Object.create(null);
    }
    setProperty(e27, t13) {
        this.properties[i1(e27)] = r1(t13);
    }
    removeProperty(e20) {
        delete this.properties[i1(e20)];
    }
}
class Ee {
    constructor(){
        this.items = [];
    }
    appendItem(e21) {
        this.items.push(e21);
    }
}
class Ce {
    constructor(){
        this.value = '';
    }
    setTranslate(e22, t10) {
        this.value = `translate(${e22} ${t10})`;
    }
    setScale(e23, t11) {
        this.value = `scale(${e23} ${t11})`;
    }
    setRotate(e24, t12, n11) {
        this.value = 0 !== t12 || 0 !== n11 ? `rotate(${e24} ${t12} ${n11})` : `rotate(${e24})`;
    }
    setSkewX(e25) {
        this.value = `skewX(${e25})`;
    }
    setSkewY(e26) {
        this.value = `skewY(${e26})`;
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
        }, this.parent = null, this.tagName = '', this.namespaceURI = 'http://www.w3.org/1999/xhtml', this.dataset = Object.create(null), this.style = new Se, this.firstChild = null, this.transform = {
            baseVal: new Ee
        }, this.isFragment = 1, this.attributes = Object.create(null), this.textContent = null, this.__STATIC__ = 1;
    }
    appendChild(e) {
        if (e.parent && e.remove(), e.isFragment && null === e.textContent) {
            let t, n = e.firstChild;
            for(; n;)t = n.sibling.right, this.appendChild(n), n = t;
        } else this.child.last ? (this.child.last.sibling.right = e, e.sibling.left = this.child.last) : (this.child.first = e, this.firstChild = e), this.child.last = e, e.parent = this;
    }
    prepend(e28) {
        e28.parent && e28.remove(), this.child.last ? (this.child.first.sibling.left = e28, e28.sibling.right = this.child.first) : (this.child.first = e28, this.child.last = e28), this.child.first = e28, this.firstChild = e28, e28.parent = this;
    }
    contains(e29) {
        let t = e29;
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
    addEventListener(e30, t, n) {
    }
    removeEventListener(e31, t14, n12) {
    }
    setAttribute(e32, t15) {
        this.attributes[i1(e32)] = r1(t15);
    }
    removeAttribute(e33) {
        delete this.attributes[i1(e33)];
    }
    replaceWith(e34) {
        if (!this.parent) return;
        const { parent: t  } = this;
        e34.parent && e34.remove(), t.child.first === this && t.child.last === this ? (t.firstChild = e34, t.child.first = e34, t.child.last = e34) : t.child.first === this ? (t.child.first = e34, t.firstChild = e34, this.sibling.right.sibling.left = e34) : t.child.last === this ? (t.child.last = e34, this.sibling.left.sibling.right = e34) : (this.sibling.right.sibling.left = e34, this.sibling.left.sibling.right = e34), e34.sibling.left = this.sibling.left, e34.sibling.right = this.sibling.right, e34.parent = t, this.sibling.left = null, this.sibling.right = null, this.parent = null;
    }
    focus() {
    }
    blur() {
    }
    createSVGTransform() {
        return new Ce;
    }
}).isBody = 1;
let Ie = 'undefined' != typeof document ? document : null;
const Ne = _effector.step.compute({
    fn (e, t) {
        if (!t.stack) return e;
        const { stack: n  } = t;
        t.stack = null;
        const s = n.parent.child.indexOf(n);
        return -1 !== s && n.parent.child.splice(s, 1), n.parent = null, e;
    }
}), _e = _effector.step.run({
    fn (e, { fn: t  }) {
        t(e);
    }
});
let $e, Ae, Oe;
$e = ()=>{
}, Ae = ()=>{
}, Oe = 'undefined' != typeof performance && performance.now ? ()=>performance.now()
 : 'undefined' != typeof process && process.hrtime ? ()=>{
    const e = process.hrtime();
    return (1000000000 * e[0] + e[1]) / 1000000;
} : ()=>Date.now()
;
const Re = _effector.createEvent();
let De, Pe = 0, Ve = 0;
const Te = 'undefined' != typeof requestAnimationFrame ? requestAnimationFrame : (e)=>setTimeout(e, 0)
, je = 'undefined' != typeof cancelAnimationFrame ? cancelAnimationFrame : clearTimeout, Fe = ()=>{
    Ve || (Ve = 1, De = Te(u1));
}, Me = new Map, ze = new Map, Le = new Map, We = new Map;
let Xe = 0, Ye = 0;
const qe = _effector.createNode({
    node: [
        _effector.step.run({
            fn: ()=>{
            }
        }),
        _effector.step.filter({
            fn: ()=>0 === ze.size && 0 === Le.size ? 0 : Oe() - Ye >= 10 ? 0 : (je(De), Pe = 1, Ve = 0, 1)
        })
    ],
    child: [
        Re
    ]
});
Re.watch(()=>{
    if (Ve) return;
    if (0 === ze.size && 0 === Le.size) return void (Pe = 0);
    let e = 0;
    Pe || (Ye = Oe()), Pe = 0;
    for (const [t, n] of ze){
        if (Oe() - Ye >= 10) {
            Fe(), e = 1;
            break;
        }
        ze.delete(t), _effector.launch({
            target: Me.get(t),
            params: n,
            defer: 1
        });
    }
    if (!e) for (const [t16, n13] of Le){
        if (Oe() - Ye >= 10) {
            Fe(), e = 1;
            break;
        }
        Le.delete(t16), _effector.launch({
            target: Me.get(t16),
            params: n13,
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
}), Be = _effector.step.compute({
    fn: ({ fail: e  })=>e
}), Ue = _effector.step.filter({
    fn: (e)=>e.length > 0
}), Ze = _effector.step.compute({
    fn (e, { taskID: t  }) {
        h1(t, 1, e);
    }
}), He = _effector.step.compute({
    fn (e, { taskID: t , flat: n  }) {
        h1(t, n, e);
    }
}), Je = _effector.step.run({
    fn: (e, { fn: t  })=>t(e, Ye)
}), Ke = _effector.step.compute({
    fn: (e)=>[
            e
        ]
}), Qe = _effector.step.run({
    fn: (e, { handler: t  })=>({
            data: e,
            handler: t
        })
}), { trigger: et  } = d1({
    priority: 'high',
    mark: 'domOperation',
    fn ({ handler: e , data: t  }) {
        e(t);
    }
}), tt = (e, { map: t , options: n  })=>{
    for(const s in t)e.removeEventListener(s, t[s], n);
}, nt = (e, t, n)=>{
    w(n) ? delete e[t] : e[t] = n;
}, st = (e, t, n)=>{
    w(n) ? e.removeProperty(t) : e.setProperty(t, n);
}, lt = (e, t)=>({
        x: t,
        y: e
    })
, rt = (e, t)=>({
        x: e,
        y: t
    })
, ot = {
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
}, { trigger: at  } = d1({
    mark: 'append DOM nodes',
    fn: (e)=>{
        for(let t = 0; t < e.append.length; t++){
            const n = e.append[t];
            if (0 == n.listItem.active) continue;
            if (0 === n.appended.length) continue;
            const s = Ie.createDocumentFragment();
            if (e.reverse) for(let e36 = n.appended.length - 1; e36 >= 0; e36--)s.appendChild(n.appended[e36]);
            else for(let e35 = 0; e35 < n.appended.length; e35++)s.appendChild(n.appended[e35]);
            F(n.listItemStack, s, e.reverse, e.node);
        }
    }
}), { trigger: ct  } = d1({
    mark: 'addRecords',
    fn: ({ context: e39 , list: t18  })=>{
        const { parentStack: n , parentNode: s , cb: l , reverse: i  } = e39, r = de.get();
        de.replace(n);
        const o = [], a = [];
        he.push({
            node: s,
            append: a,
            reverse: i
        });
        for(let e37 = 0; e37 < t18.length; e37++){
            const n = t18[e37], r = n.node;
            if (r.active) {
                de.replace(n), _effector.withRegion(n.signal, O(l, r));
                for(let e38 = 0; e38 < a.length; e38++)r.nodes.push(a[e38]);
                r.visible.length > 0 ? _effector.withRegion(n.signal, ()=>{
                    const e40 = r.visible[r.visible.length - 1];
                    e40.updates.watch((e)=>{
                        if (0 != r.active) {
                            if (e) {
                                const e = Ie.createDocumentFragment();
                                if (i) for(let t = r.nodes.length - 1; t >= 0; t--)e.appendChild(r.nodes[t]);
                                else for(let t17 = 0; t17 < r.nodes.length; t17++)e.appendChild(r.nodes[t17]);
                                F(n, e, i, s);
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
        he.pop(), o.length > 0 && _effector.launch({
            target: at,
            params: {
                node: s,
                append: o,
                reverse: i
            },
            defer: 1
        }), de.replace(r);
    }
}), ft = (e, t)=>t
, ut = (e, t)=>t[e]
, ht = _effector.createEvent();
g1({
    trigger: ht,
    priority: 'high',
    mark: 'runSignals',
    flatten: ({ signal: e  })=>[
            e
        ]
    ,
    fn: (e)=>{
        e.scope && _effector.launch(e, null, 0);
    }
}), g1({
    trigger: ht,
    priority: 'high',
    mark: 'remove DOM nodes',
    flatten ({ node: e  }) {
        const { nodes: t  } = e;
        return t;
    },
    fn: (e)=>(e.remove(), e)
});
const pt = (e)=>{
    const t = e.getState();
    for(let e42 = 0; e42 < t.length; e42++){
        const n = t[e42].node;
        n.active = 0, n.store = null;
    }
    _effector.launch(ht, t, 1);
};

},{"process":"lDnB8","effector":"55tTI","@parcel/transformer-js/src/esmodule-helpers.js":"ciiiV"}],"lDnB8":[function(require,module,exports) {
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

},{}],"55tTI":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Kind", ()=>w
);
parcelHelpers.export(exports, "blocks", ()=>Le
);
parcelHelpers.export(exports, "clearNode", ()=>Ne
);
parcelHelpers.export(exports, "combine", ()=>l1
);
parcelHelpers.export(exports, "createApi", ()=>b1
);
parcelHelpers.export(exports, "createDomain", ()=>g
);
parcelHelpers.export(exports, "createEffect", ()=>h1
);
parcelHelpers.export(exports, "createEvent", ()=>a1
);
parcelHelpers.export(exports, "createNode", ()=>e4
);
parcelHelpers.export(exports, "createStore", ()=>c1
);
parcelHelpers.export(exports, "createStoreObject", ()=>l1
);
parcelHelpers.export(exports, "forward", ()=>Ee
);
parcelHelpers.export(exports, "fromObservable", ()=>d1
);
parcelHelpers.export(exports, "guard", ()=>v1
);
parcelHelpers.export(exports, "is", ()=>q
);
parcelHelpers.export(exports, "launch", ()=>pe
);
parcelHelpers.export(exports, "merge", ()=>m1
);
parcelHelpers.export(exports, "restore", ()=>y1
);
parcelHelpers.export(exports, "restoreEffect", ()=>y1
);
parcelHelpers.export(exports, "restoreEvent", ()=>y1
);
parcelHelpers.export(exports, "restoreObject", ()=>y1
);
parcelHelpers.export(exports, "sample", ()=>u1
);
parcelHelpers.export(exports, "setStoreName", ()=>r1
);
parcelHelpers.export(exports, "split", ()=>p1
);
parcelHelpers.export(exports, "step", ()=>G
);
parcelHelpers.export(exports, "version", ()=>Je
);
parcelHelpers.export(exports, "withRegion", ()=>o1
);
var _symbolObservable = require("symbol-observable");
var _symbolObservableDefault = parcelHelpers.interopDefault(_symbolObservable);
function e4({ node: e = [] , from: t , source: r , parent: n = t || r , to: o , target: a , child: s = o || a , scope: c = {
} , meta: i = {
} , family: f = {
    type: 'regular'
}  }) {
    const l = ee(n), u = ee(f.links), p = ee(f.owners), m = [], d = {
    };
    for(let t2 = 0; t2 < e.length; t2++){
        const r = e[t2];
        r && (m.push(r), te(r, d));
    }
    const h = {
        seq: m,
        next: ee(s),
        meta: i,
        scope: c,
        family: {
            type: f.type || 'crosslink',
            links: u,
            owners: p
        },
        reg: d
    };
    for(let e1 = 0; e1 < u.length; e1++)L(u[e1]).push(h);
    for(let e2 = 0; e2 < p.length; e2++)Q(p[e2]).push(h);
    for(let e3 = 0; e3 < l.length; e3++)l[e3].next.push(h);
    return h;
}
function t1(e, t = "combine") {
    let r = t + '(', n = '', o = 0;
    for(const t3 in e){
        const a = e[t3];
        if (null != a && (r += n, r += N(a) ? a.compositeName.fullName : a.toString()), o += 1, 25 === o) break;
        n = ', ';
    }
    return r += ')', r;
}
function r1(e, t) {
    const r = n1(t, e.parent);
    e.shortName = t, e.compositeName ? (e.compositeName.path = r.path, e.compositeName.shortName = r.shortName, e.compositeName.fullName = r.fullName) : e.compositeName = r;
}
function n1(e, t) {
    let r, n, o;
    const a = e;
    return t ? (o = t.compositeName, 0 === e.length ? (r = o.path, n = o.fullName) : (r = o.path.concat([
        e
    ]), n = 0 === o.fullName.length ? e : o.fullName + '/' + e)) : (r = 0 === e.length ? [] : [
        e
    ], n = e), {
        shortName: a,
        fullName: n,
        path: r
    };
}
function o1(e, t) {
    je = {
        parent: je,
        value: e
    };
    try {
        return t();
    } finally{
        je = je.parent;
    }
}
function a1(t4, r2) {
    const n = (e, ...t)=>n.create(e, t, t)
    ;
    return n.graphite = e4({
        meta: Oe('event', n, r2, t4)
    }), n.create = (e)=>(pe(n, e), e)
    , n.watch = C(qe, n), n.map = (e)=>{
        let t, r;
        'object' == typeof e && (t = e, r = e.name, e = e.fn);
        const o = a1(ye(n, r), t);
        return De(n, o, 'map', e), o;
    }, n.filter = (e)=>'function' == typeof e ? (console.error('.filter(fn) is deprecated, use .filterMap instead'), s1(n, e)) : Re(n, 'filter', e.fn, [
            T({
                fn: $
            })
        ])
    , n.filterMap = C(s1, n), n.prepend = (e)=>{
        const t = a1('* → ' + n.shortName, {
            parent: n.parent
        });
        return De(t, n, 'prepend', e), Ce(n, t), t;
    }, n.subscribe = (e)=>qe(n, (t)=>e.next(t)
        )
    , n[_symbolObservableDefault.default] = ()=>n
    , _e(n);
}
function s1(e, t) {
    return Re(e, 'filterMap', t, [
        P({
            fn: $
        }),
        I.defined()
    ]);
}
function c1(t5, r3) {
    const n2 = W(t5), o2 = W(t5), a2 = ze('updates'), s = {
        subscribers: new Map,
        updates: a2,
        defaultState: t5,
        stateRef: n2,
        getState: C(X, n2),
        setState (e) {
            pe({
                target: s,
                params: e,
                defer: 1
            });
        }
    };
    if (s.graphite = e4({
        scope: {
            state: n2
        },
        node: [
            I.defined(),
            B({
                store: n2
            }),
            I.changed({
                store: o2
            }),
            B({
                store: o2
            })
        ],
        child: a2,
        meta: Oe('store', s, r3)
    }), Ae && void 0 === t5) throw Error("current state can't be undefined, use null instead");
    return s.watch = s.subscribe = C(f1, s), s.reset = (...e)=>{
        for (const t of e)s.on(t, ()=>s.defaultState
        );
        return s;
    }, s.on = (e, t)=>(s.off(e), s.subscribers.set(e, Se(Me(e, s, 'on', 1, t))), s)
    , s.off = C(i1, s), s.map = (e, t)=>{
        let r, n, o;
        'object' == typeof e && (r = e, n = e.name, t = e.firstState, e = e.fn);
        const a = s.getState();
        void 0 !== a && (o = e(a, t));
        const i = c1(o, {
            name: ye(s, n),
            config: r,
            strict: 0
        });
        return Me(s, i, 'map', 0, e), i;
    }, s[_symbolObservableDefault.default] = ()=>({
            subscribe (e) {
                if (e !== Object(e)) throw Error('expect observer to be an object');
                return f1(s, (t)=>{
                    e.next && e.next(t);
                });
            },
            [_symbolObservableDefault.default] () {
                return this;
            }
        })
    , V(s, [
        a2
    ]), _e(s);
}
function i1(e, t) {
    const r = e.subscribers.get(t);
    return void 0 !== r && (r(), e.subscribers.delete(t)), e;
}
function f1(e, t6, r) {
    if (!r || !N(t6)) {
        if ('function' != typeof t6) throw Error('watch requires function handler');
        return t6(e.getState()), qe(e, t6);
    }
    if ('function' != typeof r) throw Error('second argument should be a function');
    return t6.watch((t)=>r(e.getState(), t)
    );
}
function l1(...e5) {
    if (0 === e5.length) throw Error('at least one argument required');
    let t, r, n, o, a;
    'ɔ' in e5[0] && (n = e5[0].config, e5 = e5[0].ɔ);
    {
        const n = e5[e5.length - 1];
        'function' == typeof n ? (r = e5.slice(0, -1), t = n) : r = e5;
    }
    if (1 === r.length) {
        const e = r[0];
        x(e) || (o = e, a = 1);
    }
    return a || (o = r, t && (t = He(t))), Array.isArray(o) ? Ie(o, (e)=>e.slice()
    , [], n, t) : Ie(o, (e)=>Object.assign({
        }, e)
    , {
    }, n, t);
}
function u1(...t) {
    let r, n, o;
    'ɔ' in t[0] && (o = t[0].config, t = t[0].ɔ);
    let [s, i, f, l = 0] = t;
    if (void 0 === i && 'source' in s) {
        if ('clock' in s && null == s.clock) throw Error('config.clock should be defined');
        i = s.clock, f = s.fn, l = s.greedy, r = s.target, n = s.name, s = s.source;
    }
    if (void 0 === i && (i = s), n = o || n || s.shortName, s = Pe(s), i = Pe(i), 'boolean' == typeof f && (l = f, f = null), r || (r = x(s) && x(i) ? c1(f ? f(X(U(s)), X(U(i))) : X(U(s)), {
        name: n
    }) : a1(n)), x(s)) V(s, [
        _e(xe(i, r, {
            scope: {
                fn: f
            },
            node: [
                !l && F({
                    priority: 'sampler'
                }),
                H({
                    store: U(s),
                    to: f ? 'a' : 'stack'
                }),
                f && P({
                    fn: Z
                })
            ],
            meta: {
                op: 'sample',
                sample: 'store'
            }
        }))
    ]);
    else {
        const t = W(0), n = W(), o = W();
        _e(e4({
            parent: s,
            node: [
                B({
                    store: n
                }),
                H({
                    from: 'value',
                    store: 1,
                    target: t
                })
            ],
            family: {
                owners: [
                    s,
                    r,
                    i
                ],
                links: r
            },
            meta: {
                op: 'sample',
                sample: 'source'
            }
        })), V(s, [
            _e(xe(i, r, {
                scope: {
                    fn: f
                },
                node: [
                    B({
                        store: o
                    }),
                    H({
                        store: t
                    }),
                    T({
                        fn: (e)=>e
                    }),
                    !l && F({
                        priority: 'sampler'
                    }),
                    H({
                        store: n
                    }),
                    H({
                        store: o,
                        to: 'a'
                    }),
                    f && P({
                        fn: Y
                    })
                ],
                meta: {
                    op: 'sample',
                    sample: 'clock'
                }
            }))
        ]);
    }
    return r;
}
function p1(e, t) {
    const r = {
    };
    let n = x(e) ? e.updates : e;
    for(const e6 in t)r[e6] = n.filter({
        fn: t[e6]
    }), n = n.filter({
        fn: C(Te, t[e6])
    });
    return r.__ = n, r;
}
function m1(e) {
    const r = a1(t1(e, 'merge'));
    return Ee({
        from: e,
        to: r,
        meta: {
            op: 'merge'
        }
    }), r;
}
function d1(e) {
    if (e !== Object(e)) throw Error('expect observable to be an object');
    const t = _symbolObservableDefault.default in e ? e[_symbolObservableDefault.default]() : e;
    if (!t.subscribe) throw Error('expect observable to have .subscribe');
    const r = a1(), n = A(Ne, r, void 0);
    return t.subscribe({
        next: r,
        error: n,
        complete: n
    }), r;
}
function h1(t7, r4) {
    const n3 = a1(t7, r4);
    let o3 = n3.defaultConfig.handler || (()=>(console.error("no handler used in " + n3.getType()), Promise.resolve())
    );
    J(n3).meta.onCopy = [
        'runner'
    ], J(n3).meta.unit = 'effect';
    const s2 = ze('done'), i = ze('fail'), f = ze('finally');
    n3.done = s2, n3.fail = i, n3.finally = f, n3.use = (e)=>(o3 = e, n3)
    ;
    const l = ()=>o3
    ;
    n3.use.getCurrent = l, n3.kind = 'effect';
    const u = e4({
        scope: {
            done: s2,
            fail: i,
            anyway: f,
            getHandler: l
        },
        node: [
            K({
                fn: ({ params: e7 , req: t8  }, { getHandler: r5 , done: n4 , fail: o4 , anyway: a3  })=>(((e, t, r, n)=>{
                        let o, a, s = 0;
                        try {
                            a = e(t);
                        } catch (e8) {
                            s = 1, o = e8;
                        }
                        s ? n(o) : Object(a) !== a || 'function' != typeof a.then ? r(a) : a.then(r, n);
                    })(r5(), e7, C(Ke, {
                        event: n4,
                        anyway: a3,
                        params: e7,
                        fn: t8.rs,
                        ok: 1
                    }), C(Ke, {
                        event: o4,
                        anyway: a3,
                        params: e7,
                        fn: t8.rj,
                        ok: 0
                    })), e7)
            })
        ],
        meta: {
            op: 'fx',
            fx: 'runner',
            onCopy: [
                'done',
                'fail',
                'anyway'
            ]
        }
    });
    J(n3).scope.runner = u, J(n3).seq.push(P({
        fn: (e, t, r)=>r.parent ? {
                params: e,
                req: {
                    rs (e) {
                    },
                    rj (e) {
                    }
                }
            } : e
    }), K({
        fn: (e, { runner: t  })=>(pe({
                target: t,
                params: e,
                defer: 1
            }), e.params)
    })), n3.create = (e9)=>{
        const t9 = (()=>{
            const e = {
            };
            return e.req = new Promise((t, r)=>{
                e.rs = t, e.rj = r;
            }), e.req.catch(()=>{
            }), e;
        })();
        return pe(n3, {
            params: e9,
            req: t9
        }), t9.req;
    };
    const p = c1(0, {
        named: 'inFlight'
    }).on(n3, (e)=>e + 1
    ).on(s2, (e)=>e - 1
    ).on(i, (e)=>e - 1
    ), m = p.map({
        fn: (e)=>e > 0
        ,
        named: 'pending'
    });
    return n3.inFlight = p, n3.pending = m, V(n3, [
        s2,
        i,
        f,
        m,
        p,
        u
    ]), n3;
}
function g(t10, r) {
    const n = new Set, o = new Set, s = new Set, i = new Set, f = {
        domains: n,
        stores: o,
        effects: s,
        events: i
    }, l = e4({
        family: {
            type: 'domain'
        }
    }), u = {
        history: f,
        graphite: l
    };
    l.meta = Oe('domain', u, r, t10);
    const p = ze('onEvent'), m = ze('onEffect'), d = ze('onStore'), y = ze('onDomain'), b = {
        event: p,
        effect: m,
        store: d,
        domain: y
    };
    u.hooks = b, u.onCreateEvent = Ge(p, i, l), u.onCreateEffect = Ge(m, s, l), u.onCreateStore = Ge(d, o, l), u.onCreateDomain = Ge(y, n, l), u.createEvent = u.event = (e, t)=>p(a1(e, {
            parent: u,
            config: t
        }))
    , u.createEffect = u.effect = (e, t)=>m(h1(e, {
            parent: u,
            config: t
        }))
    , u.createDomain = u.domain = (e, t)=>g({
            name: e,
            parent: u,
            config: t
        })
    , u.createStore = u.store = (e, t)=>d(c1(e, {
            parent: u,
            config: t
        }))
    , _e(u);
    const v = u.parent;
    if (v) {
        for(const e in b)Ee({
            from: b[e],
            to: v.hooks[e]
        });
        v.hooks.domain(u);
    }
    return u;
}
function y1(e, t12, r) {
    if (x(e)) return e;
    if (N(e)) {
        const n = e.parent;
        let o;
        return E(e) && (o = c1(t12, {
            parent: n,
            name: e.shortName,
            "ɔ": r
        }).on(e, (e, t)=>t
        )), _(e) && (o = c1(t12, {
            parent: n,
            name: e.shortName,
            "ɔ": r
        }).on(e.done, (e, { result: t  })=>t
        )), n && n.hooks.store(o), o;
    }
    const n = {
    };
    for(const t11 in e){
        const r = e[t11];
        n[t11] = x(r) ? r : c1(r, {
            name: t11
        });
    }
    return n;
}
function b1(e, t) {
    const r = {
    };
    for(const n in t){
        const o = r[n] = a1(n, {
            parent: e.parent
        });
        e.on(o, t[n]), Ce(e, o);
    }
    return r;
}
function v1(t13, r) {
    r || (t13 = (r = t13).source);
    const { filter: n , greedy: o , name: s = "guard"  } = r, c = r.target || a1(s);
    N(t13) || (t13 = l1(t13));
    const i = {
        op: 'guard'
    };
    if (N(n)) u1({
        source: n,
        clock: t13,
        target: e4({
            node: [
                T({
                    fn: ({ guard: e  })=>e
                }),
                P({
                    fn: ({ data: e  })=>e
                })
            ],
            child: c,
            meta: i,
            family: {
                owners: [
                    t13,
                    n,
                    c
                ],
                links: c
            }
        }),
        fn: (e, t)=>({
                guard: e,
                data: t
            })
        ,
        greedy: o,
        name: s
    });
    else {
        if ('function' != typeof n) throw Error('`filter` should be function or unit');
        xe(t13, c, {
            scope: {
                fn: n
            },
            node: [
                T({
                    fn: $
                })
            ],
            meta: i
        });
    }
    return c;
}
var w = {
    __proto__: null,
    store: "store",
    event: "event",
    effect: "effect",
    domain: "domain"
};
const N = (e)=>('function' == typeof e || 'object' == typeof e && null !== e) && 'kind' in e
, S = (e)=>(t)=>N(t) && t.kind === e
, x = S("store"), E = S("event"), _ = S("effect"), j = S("domain");
var q = {
    __proto__: null,
    unit: N,
    store: x,
    event: E,
    effect: _,
    domain: j
};
const C = (e, t)=>e.bind(null, t)
, A = (e, t, r)=>e.bind(null, t, r)
, O = ()=>{
    let e = 0;
    return ()=>(++e).toString(36)
    ;
}, z = O(), D = O(), R = (e, t, r)=>({
        id: D(),
        type: e,
        data: r,
        hasRef: t
    })
;
let M = 0;
const F = ({ priority: e = "barrier"  })=>R('barrier', 0, {
        barrierID: ++M,
        priority: e
    })
, H = ({ from: e = "store" , store: t , target: r , to: n = r ? 'store' : 'stack'  })=>R('mov', 'store' === e, {
        from: e,
        store: t,
        to: n,
        target: r
    })
, I = {
    defined: ()=>R('check', 0, {
            type: 'defined'
        })
    ,
    changed: ({ store: e  })=>R('check', 1, {
            type: 'changed',
            store: e
        })
}, P = A(R, 'compute', 0), T = A(R, 'filter', 0), K = A(R, 'run', 0), B = ({ store: e  })=>H({
        from: 'stack',
        target: e
    })
;
var G = {
    __proto__: null,
    barrier: F,
    mov: H,
    check: I,
    compute: P,
    filter: T,
    run: K,
    update: B
};
const J = (e)=>e.graphite || e
, L = (e)=>e.family.owners
, Q = (e)=>e.family.links
, U = (e)=>e.stateRef
, V = (e, t)=>{
    const r = J(e);
    for(let e10 = 0; e10 < t.length; e10++){
        const n = J(t[e10]);
        'domain' !== r.family.type && (n.family.type = 'crosslink'), L(n).push(r), Q(r).push(n);
    }
}, W = (e)=>({
        id: D(),
        current: e
    })
, X = ({ current: e  })=>e
, Y = (e, { fn: t  }, { a: r  })=>t(e, r)
, Z = (e, { fn: t  }, { a: r  })=>t(r, e)
, $ = (e, { fn: t  })=>t(e)
, ee = (e = [])=>{
    const t = [];
    if (Array.isArray(e)) for(let r = 0; r < e.length; r++)Array.isArray(e[r]) ? t.push(...e[r]) : t.push(e[r]);
    else t.push(e);
    return t.map(J);
}, te = ({ hasRef: e , type: t , data: r  }, n)=>{
    let o;
    e && (o = r.store, n[o.id] = o), 'mov' === t && 'store' === r.to && (o = r.target, n[o.id] = o);
};
let re = null;
const ne = (e, t)=>{
    if (!e) return t;
    if (!t) return e;
    let r;
    const n = e.v.type === t.v.type;
    return (n && e.v.id > t.v.id || !n && 'sampler' === e.v.type) && (r = e, e = t, t = r), r = ne(e.r, t), e.r = e.l, e.l = r, e;
}, oe = [];
let ae = 0;
for(; ae < 5;)oe.push({
    first: null,
    last: null,
    size: 0
}), ae += 1;
const se = ()=>{
    for(let e = 0; e < 5; e++){
        const t = oe[e];
        if (t.size > 0) {
            if (2 === e || 3 === e) {
                t.size -= 1;
                const e = re.v;
                return re = ne(re.l, re.r), e;
            }
            1 === t.size && (t.last = null);
            const r = t.first;
            return t.first = r.right, t.size -= 1, r.value;
        }
    }
}, ce = (e, t, r, n)=>ie(0, {
        a: null,
        b: null,
        node: t,
        parent: r,
        value: n
    }, e)
, ie = (e, t, r, n = 0)=>{
    const o = fe(r), a = oe[o], s = {
        idx: e,
        stack: t,
        type: r,
        id: n
    };
    if (2 === o || 3 === o) re = ne(re, {
        v: s,
        l: 0,
        r: 0
    });
    else {
        const e = {
            right: null,
            value: s
        };
        0 === a.size ? a.first = e : a.last.right = e, a.last = e;
    }
    a.size += 1;
}, fe = (e)=>{
    switch(e){
        case 'child':
            return 0;
        case 'pure':
            return 1;
        case 'barrier':
            return 2;
        case 'sampler':
            return 3;
        case 'effect':
            return 4;
        default:
            return -1;
    }
}, le = new Set;
let ue = 0;
const pe = (e12, t14, r7)=>{
    if (e12.target && (t14 = e12.params, r7 = e12.defer, e12 = e12.target), Array.isArray(e12)) for(let r6 = 0; r6 < e12.length; r6++)ce('pure', J(e12[r6]), null, t14[r6]);
    else ce('pure', J(e12), null, t14);
    r7 && ue || (()=>{
        const e = ue;
        ue = 1;
        const t = {
            stop: 0
        };
        let r, n;
        e: for(; n = se();){
            const { idx: e , stack: o , type: a  } = n;
            r = o.node;
            const s = {
                skip: 0,
                fail: 0,
                ref: '',
                scope: r.scope
            };
            for(let n5 = e; n5 < r.seq.length && !t.stop; n5++){
                const c = r.seq[n5], i = c.data;
                switch(c.type){
                    case 'barrier':
                        {
                            const t = i.barrierID, r = i.priority;
                            if (n5 !== e || a !== r) {
                                le.has(t) || (le.add(t), ie(n5, o, r, t));
                                continue e;
                            }
                            le.delete(t);
                            break;
                        }
                    case 'mov':
                        {
                            let e;
                            switch(i.from){
                                case 'stack':
                                    e = o.value;
                                    break;
                                case 'a':
                                    e = o.a;
                                    break;
                                case 'b':
                                    e = o.b;
                                    break;
                                case 'value':
                                    e = i.store;
                                    break;
                                case 'store':
                                    e = X(r.reg[i.store.id]);
                            }
                            switch(i.to){
                                case 'stack':
                                    o.value = e;
                                    break;
                                case 'a':
                                    o.a = e;
                                    break;
                                case 'b':
                                    o.b = e;
                                    break;
                                case 'store':
                                    r.reg[i.target.id].current = e;
                            }
                            break;
                        }
                    case 'check':
                        switch(i.type){
                            case 'defined':
                                s.skip = void 0 === o.value;
                                break;
                            case 'changed':
                                s.skip = o.value === X(r.reg[i.store.id]);
                        }
                        break;
                    case 'filter':
                        s.skip = !me(s, i, o);
                        break;
                    case 'run':
                        if (n5 !== e || 'effect' !== a) {
                            ie(n5, o, 'effect');
                            continue e;
                        }
                    case 'compute':
                        o.value = me(s, i, o);
                }
                t.stop = s.fail || s.skip;
            }
            if (!t.stop) for(let e11 = 0; e11 < r.next.length; e11++)ce('child', r.next[e11], o, o.value);
            t.stop = 0;
        }
        ue = e;
    })();
}, me = (e, { fn: t  }, r)=>{
    try {
        return t(r.value, e.scope, r);
    } catch (t15) {
        console.error(t15), e.fail = 1;
    }
}, de = (e, t = {
})=>(Object(e) === e && (de(e.config, t), null != e.name && ('object' == typeof e.name ? de(e.name, t) : t.name = e.name), e.loc && (t.loc = e.loc), e.sid && (t.sid = e.sid), e.handler && (t.handler = e.handler), e.parent && (t.parent = e.parent), 'strict' in e && (t.strict = e.strict), e.named && (t.named = e.named), de(e.ɔ, t)), t)
, he = de, ge = (e, t)=>'' + e.shortName + t
, ye = (e, t)=>null == t ? ge(e, ' → *') : t
, be = (e, t)=>{
    const r = e.indexOf(t);
    -1 !== r && e.splice(r, 1);
}, ve = (e, t)=>{
    be(e.next, t), be(L(e), t), be(Q(e), t);
}, ke = (e, t, r)=>{
    let n;
    e.next.length = 0, e.seq.length = 0, e.scope = null;
    let o = Q(e);
    for(; n = o.pop();)ve(n, e), (t || r && !e.meta.sample || 'crosslink' === n.family.type) && ke(n, t, r);
    for(o = L(e); n = o.pop();)ve(n, e), r && 'crosslink' === n.family.type && ke(n, t, r);
}, we = (e)=>e.clear()
, Ne = (e, { deep: t  } = {
})=>{
    let r = 0;
    if (x(e)) we(e.subscribers);
    else if (j(e)) {
        r = 1;
        const t = e.history;
        we(t.events), we(t.effects), we(t.stores), we(t.domains);
    }
    ke(J(e), !!t, r);
}, Se = (e)=>{
    const t = A(Ne, e, void 0);
    return t.unsubscribe = t, t;
}, xe = (t, r, { node: n , scope: o , meta: a  })=>e4({
        node: n,
        parent: t,
        child: r,
        scope: o,
        meta: a,
        family: {
            owners: [
                t,
                r
            ],
            links: r
        }
    })
, Ee = ({ from: t , to: r , meta: n = {
    op: 'forward'
}  })=>{
    if (!t || !r) throw Error('from and to fields should be defined');
    return Se(e4({
        parent: t,
        child: r,
        meta: n,
        family: {
        }
    }));
}, _e = (e)=>(je && V(je.value, [
        e
    ]), e)
;
let je = null;
const qe = (t, r)=>Se(_e(e4({
        scope: {
            fn: r
        },
        node: [
            K({
                fn: $
            })
        ],
        parent: t,
        meta: {
            op: 'watch'
        },
        family: {
            owners: t
        }
    })))
, Ce = ({ parent: e  }, t)=>{
    e && e.hooks.event(t);
};
let Ae;
const Oe = (e, t, r, o)=>{
    const a = he({
        name: o,
        config: r
    }), s = z(), { parent: c = null , sid: i = null , strict: f = 1 , named: l = null  } = a, u = l || a.name || ('domain' === e ? '' : s), p = n1(u, c);
    return t.kind = e, t.id = s, t.sid = i, t.shortName = u, t.parent = c, t.compositeName = p, t.defaultConfig = a, t.thru = C(Fe, t), t.getType = ()=>p.fullName
    , Ae = f, {
        unit: e,
        name: u,
        sid: i,
        named: l
    };
}, ze = (e)=>a1({
        named: e
    })
, De = (e, t, r, n)=>xe(e, t, {
        scope: {
            fn: n
        },
        node: [
            P({
                fn: $
            })
        ],
        meta: {
            op: r
        }
    })
, Re = (e, t, r, n)=>{
    const o = a1(ge(e, ' →? *'));
    return xe(e, o, {
        scope: {
            fn: r
        },
        node: n,
        meta: {
            op: t
        }
    }), o;
}, Me = (e, { graphite: t , stateRef: r  }, n, o, a)=>xe(e, t, {
        scope: {
            fn: a
        },
        node: [
            H({
                store: r,
                to: 'a'
            }),
            P({
                fn: o ? Z : Y
            }),
            I.defined(),
            I.changed({
                store: r
            }),
            B({
                store: r
            })
        ],
        meta: {
            op: n
        }
    })
, Fe = (e, t)=>t(e)
, He = (e)=>(t)=>e(...t)
, Ie = (e13, r8, n6, o, a)=>{
    const s = r8(n6), i = c1(s, {
        name: o || t1(e13)
    }), f = W(s), l = W(1), u = [
        I.defined(),
        H({
            store: f,
            to: 'a'
        }),
        T({
            fn: (e, { key: t  }, { a: r  })=>e !== r[t]
        }),
        H({
            store: l,
            to: 'b'
        }),
        P({
            fn (e, { clone: t , key: r  }, n) {
                n.b && (n.a = t(n.a)), n.a[r] = e;
            }
        }),
        H({
            from: 'a',
            target: f
        }),
        H({
            from: 'value',
            store: 0,
            target: l
        }),
        F({
            priority: 'barrier'
        }),
        H({
            from: 'value',
            store: 1,
            target: l
        }),
        H({
            store: f
        }),
        a && P({
            fn: a
        }),
        I.changed({
            store: U(i)
        })
    ];
    for(const t16 in e13){
        const o = e13[t16];
        x(o) ? (n6[t16] = o.defaultState, s[t16] = o.getState(), xe(o, i, {
            scope: {
                key: t16,
                clone: r8
            },
            node: u,
            meta: {
                op: 'combine'
            }
        })) : s[t16] = n6[t16] = o;
    }
    return i.defaultShape = e13, i.defaultState = a ? U(i).current = a(s) : n6, i;
}, Pe = (e)=>N(e) ? e : l1(e)
, Te = (e, t)=>!e(t)
, Ke = ({ event: e , anyway: t , params: r , fn: n , ok: o  }, a)=>{
    pe({
        target: [
            t,
            e,
            Be
        ],
        params: o ? [
            {
                status: 'done',
                params: r,
                result: a
            },
            {
                params: r,
                result: a
            },
            {
                fn: n,
                value: a
            }
        ] : [
            {
                status: 'fail',
                params: r,
                error: a
            },
            {
                params: r,
                error: a
            },
            {
                fn: n,
                value: a
            }
        ],
        defer: 1
    });
}, Be = e4({
    node: [
        K({
            fn ({ fn: e , value: t  }) {
                e(t);
            }
        })
    ],
    meta: {
        op: 'fx',
        fx: 'sidechain'
    }
}), Ge = (e14, t, r9)=>(e14.watch((e)=>{
        V(r9, [
            e
        ]), t.add(e);
    }), V(r9, [
        e14
    ]), (r)=>(t.forEach(r), e14.watch(r))
    )
, Je = "20.11.5";
var Le = {
    __proto__: null,
    filterChanged: T({
        fn: (e, { state: t  })=>void 0 !== e && e !== X(t)
    }),
    noop: P({
        fn: (e)=>e
    })
};

},{"symbol-observable":"bdAOc","@parcel/transformer-js/src/esmodule-helpers.js":"ciiiV"}],"bdAOc":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/* global window */ var _ponyfillJs = require("./ponyfill.js");
var _ponyfillJsDefault = parcelHelpers.interopDefault(_ponyfillJs);
var global = arguments[3];
var root;
if (typeof self !== 'undefined') root = self;
else if (typeof window !== 'undefined') root = window;
else if (typeof global !== 'undefined') root = global;
else if (typeof module !== 'undefined') root = module;
else root = Function('return this')();
var result = _ponyfillJsDefault.default(root);
exports.default = result;

},{"./ponyfill.js":"jGIpP","@parcel/transformer-js/src/esmodule-helpers.js":"ciiiV"}],"jGIpP":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
function symbolObservablePonyfill(root) {
    var result;
    var Symbol = root.Symbol;
    if (typeof Symbol === 'function') {
        if (Symbol.observable) result = Symbol.observable;
        else {
            result = Symbol('observable');
            Symbol.observable = result;
        }
    } else result = '@@observable';
    return result;
}
exports.default = symbolObservablePonyfill;

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

},{"effector-dom":"bckam","effector":"55tTI","./title":"eRfoS","./model":"l19vq","@parcel/transformer-js/src/esmodule-helpers.js":"ciiiV"}],"eRfoS":[function(require,module,exports) {
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

},{"effector":"55tTI","@parcel/transformer-js/src/esmodule-helpers.js":"ciiiV","effector-localstorage/sync":"jUOwr"}],"jUOwr":[function(require,module,exports) {
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
