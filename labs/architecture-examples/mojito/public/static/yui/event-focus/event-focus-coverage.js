/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/event-focus/event-focus.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/event-focus/event-focus.js",
    code: []
};
_yuitest_coverage["build/event-focus/event-focus.js"].code=["YUI.add('event-focus', function (Y, NAME) {","","/**"," * Adds bubbling and delegation support to DOM events focus and blur."," * "," * @module event"," * @submodule event-focus"," */","var Event    = Y.Event,","","    YLang    = Y.Lang,","","    isString = YLang.isString,","","    arrayIndex = Y.Array.indexOf,","","    useActivate = (function() {","","        // Changing the structure of this test, so that it doesn't use inline JS in HTML,","        // which throws an exception in Win8 packaged apps, due to additional security restrictions:","        // http://msdn.microsoft.com/en-us/library/windows/apps/hh465380.aspx#differences","","        var p = Y.config.doc.createElement(\"p\"),","            listener;","","        p.setAttribute(\"onbeforeactivate\", \";\");","        listener = p.onbeforeactivate;","","        // listener is a function in IE8+.","        // listener is a string in IE6,7 (unfortunate, but that's not going to change. Otherwise we could have just checked for function).","        // listener is a function in IE10, in a Win8 App environment (no exception running the test).","","        // listener is undefined in Webkit/Gecko.","        // listener is a function in Webkit/Gecko if it's a supported event (e.g. onclick).","","        return (listener !== undefined);","    }());","","function define(type, proxy, directEvent) {","    var nodeDataKey = '_' + type + 'Notifiers';","","    Y.Event.define(type, {","","        _useActivate : useActivate,","","        _attach: function (el, notifier, delegate) {","            if (Y.DOM.isWindow(el)) {","                return Event._attach([type, function (e) {","                    notifier.fire(e);","                }, el]);","            } else {","                return Event._attach(","                    [proxy, this._proxy, el, this, notifier, delegate],","                    { capture: true });","            }","        },","","        _proxy: function (e, notifier, delegate) {","            var target        = e.target,","                currentTarget = e.currentTarget,","                notifiers     = target.getData(nodeDataKey),","                yuid          = Y.stamp(currentTarget._node),","                defer         = (useActivate || target !== currentTarget),","                directSub;","                ","            notifier.currentTarget = (delegate) ? target : currentTarget;","            notifier.container     = (delegate) ? currentTarget : null;","","            // Maintain a list to handle subscriptions from nested","            // containers div#a>div#b>input #a.on(focus..) #b.on(focus..),","            // use one focus or blur subscription that fires notifiers from","            // #b then #a to emulate bubble sequence.","            if (!notifiers) {","                notifiers = {};","                target.setData(nodeDataKey, notifiers);","","                // only subscribe to the element's focus if the target is","                // not the current target (","                if (defer) {","                    directSub = Event._attach(","                        [directEvent, this._notify, target._node]).sub;","                    directSub.once = true;","                }","            } else {","                // In old IE, defer is always true.  In capture-phase browsers,","                // The delegate subscriptions will be encountered first, which","                // will establish the notifiers data and direct subscription","                // on the node.  If there is also a direct subscription to the","                // node's focus/blur, it should not call _notify because the","                // direct subscription from the delegate sub(s) exists, which","                // will call _notify.  So this avoids _notify being called","                // twice, unnecessarily.","                defer = true;","            }","","            if (!notifiers[yuid]) {","                notifiers[yuid] = [];","            }","","            notifiers[yuid].push(notifier);","","            if (!defer) {","                this._notify(e);","            }","        },","","        _notify: function (e, container) {","            var currentTarget = e.currentTarget,","                notifierData  = currentTarget.getData(nodeDataKey),","                axisNodes     = currentTarget.ancestors(),","                doc           = currentTarget.get('ownerDocument'),","                delegates     = [],","                                // Used to escape loops when there are no more","                                // notifiers to consider","                count         = notifierData ?","                                    Y.Object.keys(notifierData).length :","                                    0,","                target, notifiers, notifier, yuid, match, tmp, i, len, sub, ret;","","            // clear the notifications list (mainly for delegation)","            currentTarget.clearData(nodeDataKey);","","            // Order the delegate subs by their placement in the parent axis","            axisNodes.push(currentTarget);","            // document.get('ownerDocument') returns null","            // which we'll use to prevent having duplicate Nodes in the list","            if (doc) {","                axisNodes.unshift(doc);","            }","","            // ancestors() returns the Nodes from top to bottom","            axisNodes._nodes.reverse();","","            if (count) {","                // Store the count for step 2","                tmp = count;","                axisNodes.some(function (node) {","                    var yuid      = Y.stamp(node),","                        notifiers = notifierData[yuid],","                        i, len;","","                    if (notifiers) {","                        count--;","                        for (i = 0, len = notifiers.length; i < len; ++i) {","                            if (notifiers[i].handle.sub.filter) {","                                delegates.push(notifiers[i]);","                            }","                        }","                    }","","                    return !count;","                });","                count = tmp;","            }","","            // Walk up the parent axis, notifying direct subscriptions and","            // testing delegate filters.","            while (count && (target = axisNodes.shift())) {","                yuid = Y.stamp(target);","","                notifiers = notifierData[yuid];","","                if (notifiers) {","                    for (i = 0, len = notifiers.length; i < len; ++i) {","                        notifier = notifiers[i];","                        sub      = notifier.handle.sub;","                        match    = true;","","                        e.currentTarget = target;","","                        if (sub.filter) {","                            match = sub.filter.apply(target,","                                [target, e].concat(sub.args || []));","","                            // No longer necessary to test against this","                            // delegate subscription for the nodes along","                            // the parent axis.","                            delegates.splice(","                                arrayIndex(delegates, notifier), 1);","                        }","","                        if (match) {","                            // undefined for direct subs","                            e.container = notifier.container;","                            ret = notifier.fire(e);","                        }","","                        if (ret === false || e.stopped === 2) {","                            break;","                        }","                    }","                    ","                    delete notifiers[yuid];","                    count--;","                }","","                if (e.stopped !== 2) {","                    // delegates come after subs targeting this specific node","                    // because they would not normally report until they'd","                    // bubbled to the container node.","                    for (i = 0, len = delegates.length; i < len; ++i) {","                        notifier = delegates[i];","                        sub = notifier.handle.sub;","","                        if (sub.filter.apply(target,","                            [target, e].concat(sub.args || []))) {","","                            e.container = notifier.container;","                            e.currentTarget = target;","                            ret = notifier.fire(e);","                        }","","                        if (ret === false || e.stopped === 2) {","                            break;","                        }","                    }","                }","","                if (e.stopped) {","                    break;","                }","            }","        },","","        on: function (node, sub, notifier) {","            sub.handle = this._attach(node._node, notifier);","        },","","        detach: function (node, sub) {","            sub.handle.detach();","        },","","        delegate: function (node, sub, notifier, filter) {","            if (isString(filter)) {","                sub.filter = function (target) {","                    return Y.Selector.test(target._node, filter,","                        node === target ? null : node._node);","                };","            }","","            sub.handle = this._attach(node._node, notifier, true);","        },","","        detachDelegate: function (node, sub) {","            sub.handle.detach();","        }","    }, true);","}","","// For IE, we need to defer to focusin rather than focus because","// `el.focus(); doSomething();` executes el.onbeforeactivate, el.onactivate,","// el.onfocusin, doSomething, then el.onfocus.  All others support capture","// phase focus, which executes before doSomething.  To guarantee consistent","// behavior for this use case, IE's direct subscriptions are made against","// focusin so subscribers will be notified before js following el.focus() is","// executed.","if (useActivate) {","    //     name     capture phase       direct subscription","    define(\"focus\", \"beforeactivate\",   \"focusin\");","    define(\"blur\",  \"beforedeactivate\", \"focusout\");","} else {","    define(\"focus\", \"focus\", \"focus\");","    define(\"blur\",  \"blur\",  \"blur\");","}","","","}, '3.7.3', {\"requires\": [\"event-synthetic\"]});"];
_yuitest_coverage["build/event-focus/event-focus.js"].lines = {"1":0,"9":0,"23":0,"26":0,"27":0,"36":0,"39":0,"40":0,"42":0,"47":0,"48":0,"49":0,"52":0,"59":0,"66":0,"67":0,"73":0,"74":0,"75":0,"79":0,"80":0,"82":0,"93":0,"96":0,"97":0,"100":0,"102":0,"103":0,"108":0,"121":0,"124":0,"127":0,"128":0,"132":0,"134":0,"136":0,"137":0,"138":0,"142":0,"143":0,"144":0,"145":0,"146":0,"151":0,"153":0,"158":0,"159":0,"161":0,"163":0,"164":0,"165":0,"166":0,"167":0,"169":0,"171":0,"172":0,"178":0,"182":0,"184":0,"185":0,"188":0,"189":0,"193":0,"194":0,"197":0,"201":0,"202":0,"203":0,"205":0,"208":0,"209":0,"210":0,"213":0,"214":0,"219":0,"220":0,"226":0,"230":0,"234":0,"235":0,"236":0,"241":0,"245":0,"257":0,"259":0,"260":0,"262":0,"263":0};
_yuitest_coverage["build/event-focus/event-focus.js"].functions = {"(anonymous 2):17":0,"(anonymous 3):48":0,"_attach:46":0,"_proxy:58":0,"(anonymous 4):137":0,"_notify:107":0,"on:225":0,"detach:229":0,"filter:235":0,"delegate:233":0,"detachDelegate:244":0,"define:39":0,"(anonymous 1):1":0};
_yuitest_coverage["build/event-focus/event-focus.js"].coveredLines = 88;
_yuitest_coverage["build/event-focus/event-focus.js"].coveredFunctions = 13;
_yuitest_coverline("build/event-focus/event-focus.js", 1);
YUI.add('event-focus', function (Y, NAME) {

/**
 * Adds bubbling and delegation support to DOM events focus and blur.
 * 
 * @module event
 * @submodule event-focus
 */
_yuitest_coverfunc("build/event-focus/event-focus.js", "(anonymous 1)", 1);
_yuitest_coverline("build/event-focus/event-focus.js", 9);
var Event    = Y.Event,

    YLang    = Y.Lang,

    isString = YLang.isString,

    arrayIndex = Y.Array.indexOf,

    useActivate = (function() {

        // Changing the structure of this test, so that it doesn't use inline JS in HTML,
        // which throws an exception in Win8 packaged apps, due to additional security restrictions:
        // http://msdn.microsoft.com/en-us/library/windows/apps/hh465380.aspx#differences

        _yuitest_coverfunc("build/event-focus/event-focus.js", "(anonymous 2)", 17);
_yuitest_coverline("build/event-focus/event-focus.js", 23);
var p = Y.config.doc.createElement("p"),
            listener;

        _yuitest_coverline("build/event-focus/event-focus.js", 26);
p.setAttribute("onbeforeactivate", ";");
        _yuitest_coverline("build/event-focus/event-focus.js", 27);
listener = p.onbeforeactivate;

        // listener is a function in IE8+.
        // listener is a string in IE6,7 (unfortunate, but that's not going to change. Otherwise we could have just checked for function).
        // listener is a function in IE10, in a Win8 App environment (no exception running the test).

        // listener is undefined in Webkit/Gecko.
        // listener is a function in Webkit/Gecko if it's a supported event (e.g. onclick).

        _yuitest_coverline("build/event-focus/event-focus.js", 36);
return (listener !== undefined);
    }());

_yuitest_coverline("build/event-focus/event-focus.js", 39);
function define(type, proxy, directEvent) {
    _yuitest_coverfunc("build/event-focus/event-focus.js", "define", 39);
_yuitest_coverline("build/event-focus/event-focus.js", 40);
var nodeDataKey = '_' + type + 'Notifiers';

    _yuitest_coverline("build/event-focus/event-focus.js", 42);
Y.Event.define(type, {

        _useActivate : useActivate,

        _attach: function (el, notifier, delegate) {
            _yuitest_coverfunc("build/event-focus/event-focus.js", "_attach", 46);
_yuitest_coverline("build/event-focus/event-focus.js", 47);
if (Y.DOM.isWindow(el)) {
                _yuitest_coverline("build/event-focus/event-focus.js", 48);
return Event._attach([type, function (e) {
                    _yuitest_coverfunc("build/event-focus/event-focus.js", "(anonymous 3)", 48);
_yuitest_coverline("build/event-focus/event-focus.js", 49);
notifier.fire(e);
                }, el]);
            } else {
                _yuitest_coverline("build/event-focus/event-focus.js", 52);
return Event._attach(
                    [proxy, this._proxy, el, this, notifier, delegate],
                    { capture: true });
            }
        },

        _proxy: function (e, notifier, delegate) {
            _yuitest_coverfunc("build/event-focus/event-focus.js", "_proxy", 58);
_yuitest_coverline("build/event-focus/event-focus.js", 59);
var target        = e.target,
                currentTarget = e.currentTarget,
                notifiers     = target.getData(nodeDataKey),
                yuid          = Y.stamp(currentTarget._node),
                defer         = (useActivate || target !== currentTarget),
                directSub;
                
            _yuitest_coverline("build/event-focus/event-focus.js", 66);
notifier.currentTarget = (delegate) ? target : currentTarget;
            _yuitest_coverline("build/event-focus/event-focus.js", 67);
notifier.container     = (delegate) ? currentTarget : null;

            // Maintain a list to handle subscriptions from nested
            // containers div#a>div#b>input #a.on(focus..) #b.on(focus..),
            // use one focus or blur subscription that fires notifiers from
            // #b then #a to emulate bubble sequence.
            _yuitest_coverline("build/event-focus/event-focus.js", 73);
if (!notifiers) {
                _yuitest_coverline("build/event-focus/event-focus.js", 74);
notifiers = {};
                _yuitest_coverline("build/event-focus/event-focus.js", 75);
target.setData(nodeDataKey, notifiers);

                // only subscribe to the element's focus if the target is
                // not the current target (
                _yuitest_coverline("build/event-focus/event-focus.js", 79);
if (defer) {
                    _yuitest_coverline("build/event-focus/event-focus.js", 80);
directSub = Event._attach(
                        [directEvent, this._notify, target._node]).sub;
                    _yuitest_coverline("build/event-focus/event-focus.js", 82);
directSub.once = true;
                }
            } else {
                // In old IE, defer is always true.  In capture-phase browsers,
                // The delegate subscriptions will be encountered first, which
                // will establish the notifiers data and direct subscription
                // on the node.  If there is also a direct subscription to the
                // node's focus/blur, it should not call _notify because the
                // direct subscription from the delegate sub(s) exists, which
                // will call _notify.  So this avoids _notify being called
                // twice, unnecessarily.
                _yuitest_coverline("build/event-focus/event-focus.js", 93);
defer = true;
            }

            _yuitest_coverline("build/event-focus/event-focus.js", 96);
if (!notifiers[yuid]) {
                _yuitest_coverline("build/event-focus/event-focus.js", 97);
notifiers[yuid] = [];
            }

            _yuitest_coverline("build/event-focus/event-focus.js", 100);
notifiers[yuid].push(notifier);

            _yuitest_coverline("build/event-focus/event-focus.js", 102);
if (!defer) {
                _yuitest_coverline("build/event-focus/event-focus.js", 103);
this._notify(e);
            }
        },

        _notify: function (e, container) {
            _yuitest_coverfunc("build/event-focus/event-focus.js", "_notify", 107);
_yuitest_coverline("build/event-focus/event-focus.js", 108);
var currentTarget = e.currentTarget,
                notifierData  = currentTarget.getData(nodeDataKey),
                axisNodes     = currentTarget.ancestors(),
                doc           = currentTarget.get('ownerDocument'),
                delegates     = [],
                                // Used to escape loops when there are no more
                                // notifiers to consider
                count         = notifierData ?
                                    Y.Object.keys(notifierData).length :
                                    0,
                target, notifiers, notifier, yuid, match, tmp, i, len, sub, ret;

            // clear the notifications list (mainly for delegation)
            _yuitest_coverline("build/event-focus/event-focus.js", 121);
currentTarget.clearData(nodeDataKey);

            // Order the delegate subs by their placement in the parent axis
            _yuitest_coverline("build/event-focus/event-focus.js", 124);
axisNodes.push(currentTarget);
            // document.get('ownerDocument') returns null
            // which we'll use to prevent having duplicate Nodes in the list
            _yuitest_coverline("build/event-focus/event-focus.js", 127);
if (doc) {
                _yuitest_coverline("build/event-focus/event-focus.js", 128);
axisNodes.unshift(doc);
            }

            // ancestors() returns the Nodes from top to bottom
            _yuitest_coverline("build/event-focus/event-focus.js", 132);
axisNodes._nodes.reverse();

            _yuitest_coverline("build/event-focus/event-focus.js", 134);
if (count) {
                // Store the count for step 2
                _yuitest_coverline("build/event-focus/event-focus.js", 136);
tmp = count;
                _yuitest_coverline("build/event-focus/event-focus.js", 137);
axisNodes.some(function (node) {
                    _yuitest_coverfunc("build/event-focus/event-focus.js", "(anonymous 4)", 137);
_yuitest_coverline("build/event-focus/event-focus.js", 138);
var yuid      = Y.stamp(node),
                        notifiers = notifierData[yuid],
                        i, len;

                    _yuitest_coverline("build/event-focus/event-focus.js", 142);
if (notifiers) {
                        _yuitest_coverline("build/event-focus/event-focus.js", 143);
count--;
                        _yuitest_coverline("build/event-focus/event-focus.js", 144);
for (i = 0, len = notifiers.length; i < len; ++i) {
                            _yuitest_coverline("build/event-focus/event-focus.js", 145);
if (notifiers[i].handle.sub.filter) {
                                _yuitest_coverline("build/event-focus/event-focus.js", 146);
delegates.push(notifiers[i]);
                            }
                        }
                    }

                    _yuitest_coverline("build/event-focus/event-focus.js", 151);
return !count;
                });
                _yuitest_coverline("build/event-focus/event-focus.js", 153);
count = tmp;
            }

            // Walk up the parent axis, notifying direct subscriptions and
            // testing delegate filters.
            _yuitest_coverline("build/event-focus/event-focus.js", 158);
while (count && (target = axisNodes.shift())) {
                _yuitest_coverline("build/event-focus/event-focus.js", 159);
yuid = Y.stamp(target);

                _yuitest_coverline("build/event-focus/event-focus.js", 161);
notifiers = notifierData[yuid];

                _yuitest_coverline("build/event-focus/event-focus.js", 163);
if (notifiers) {
                    _yuitest_coverline("build/event-focus/event-focus.js", 164);
for (i = 0, len = notifiers.length; i < len; ++i) {
                        _yuitest_coverline("build/event-focus/event-focus.js", 165);
notifier = notifiers[i];
                        _yuitest_coverline("build/event-focus/event-focus.js", 166);
sub      = notifier.handle.sub;
                        _yuitest_coverline("build/event-focus/event-focus.js", 167);
match    = true;

                        _yuitest_coverline("build/event-focus/event-focus.js", 169);
e.currentTarget = target;

                        _yuitest_coverline("build/event-focus/event-focus.js", 171);
if (sub.filter) {
                            _yuitest_coverline("build/event-focus/event-focus.js", 172);
match = sub.filter.apply(target,
                                [target, e].concat(sub.args || []));

                            // No longer necessary to test against this
                            // delegate subscription for the nodes along
                            // the parent axis.
                            _yuitest_coverline("build/event-focus/event-focus.js", 178);
delegates.splice(
                                arrayIndex(delegates, notifier), 1);
                        }

                        _yuitest_coverline("build/event-focus/event-focus.js", 182);
if (match) {
                            // undefined for direct subs
                            _yuitest_coverline("build/event-focus/event-focus.js", 184);
e.container = notifier.container;
                            _yuitest_coverline("build/event-focus/event-focus.js", 185);
ret = notifier.fire(e);
                        }

                        _yuitest_coverline("build/event-focus/event-focus.js", 188);
if (ret === false || e.stopped === 2) {
                            _yuitest_coverline("build/event-focus/event-focus.js", 189);
break;
                        }
                    }
                    
                    _yuitest_coverline("build/event-focus/event-focus.js", 193);
delete notifiers[yuid];
                    _yuitest_coverline("build/event-focus/event-focus.js", 194);
count--;
                }

                _yuitest_coverline("build/event-focus/event-focus.js", 197);
if (e.stopped !== 2) {
                    // delegates come after subs targeting this specific node
                    // because they would not normally report until they'd
                    // bubbled to the container node.
                    _yuitest_coverline("build/event-focus/event-focus.js", 201);
for (i = 0, len = delegates.length; i < len; ++i) {
                        _yuitest_coverline("build/event-focus/event-focus.js", 202);
notifier = delegates[i];
                        _yuitest_coverline("build/event-focus/event-focus.js", 203);
sub = notifier.handle.sub;

                        _yuitest_coverline("build/event-focus/event-focus.js", 205);
if (sub.filter.apply(target,
                            [target, e].concat(sub.args || []))) {

                            _yuitest_coverline("build/event-focus/event-focus.js", 208);
e.container = notifier.container;
                            _yuitest_coverline("build/event-focus/event-focus.js", 209);
e.currentTarget = target;
                            _yuitest_coverline("build/event-focus/event-focus.js", 210);
ret = notifier.fire(e);
                        }

                        _yuitest_coverline("build/event-focus/event-focus.js", 213);
if (ret === false || e.stopped === 2) {
                            _yuitest_coverline("build/event-focus/event-focus.js", 214);
break;
                        }
                    }
                }

                _yuitest_coverline("build/event-focus/event-focus.js", 219);
if (e.stopped) {
                    _yuitest_coverline("build/event-focus/event-focus.js", 220);
break;
                }
            }
        },

        on: function (node, sub, notifier) {
            _yuitest_coverfunc("build/event-focus/event-focus.js", "on", 225);
_yuitest_coverline("build/event-focus/event-focus.js", 226);
sub.handle = this._attach(node._node, notifier);
        },

        detach: function (node, sub) {
            _yuitest_coverfunc("build/event-focus/event-focus.js", "detach", 229);
_yuitest_coverline("build/event-focus/event-focus.js", 230);
sub.handle.detach();
        },

        delegate: function (node, sub, notifier, filter) {
            _yuitest_coverfunc("build/event-focus/event-focus.js", "delegate", 233);
_yuitest_coverline("build/event-focus/event-focus.js", 234);
if (isString(filter)) {
                _yuitest_coverline("build/event-focus/event-focus.js", 235);
sub.filter = function (target) {
                    _yuitest_coverfunc("build/event-focus/event-focus.js", "filter", 235);
_yuitest_coverline("build/event-focus/event-focus.js", 236);
return Y.Selector.test(target._node, filter,
                        node === target ? null : node._node);
                };
            }

            _yuitest_coverline("build/event-focus/event-focus.js", 241);
sub.handle = this._attach(node._node, notifier, true);
        },

        detachDelegate: function (node, sub) {
            _yuitest_coverfunc("build/event-focus/event-focus.js", "detachDelegate", 244);
_yuitest_coverline("build/event-focus/event-focus.js", 245);
sub.handle.detach();
        }
    }, true);
}

// For IE, we need to defer to focusin rather than focus because
// `el.focus(); doSomething();` executes el.onbeforeactivate, el.onactivate,
// el.onfocusin, doSomething, then el.onfocus.  All others support capture
// phase focus, which executes before doSomething.  To guarantee consistent
// behavior for this use case, IE's direct subscriptions are made against
// focusin so subscribers will be notified before js following el.focus() is
// executed.
_yuitest_coverline("build/event-focus/event-focus.js", 257);
if (useActivate) {
    //     name     capture phase       direct subscription
    _yuitest_coverline("build/event-focus/event-focus.js", 259);
define("focus", "beforeactivate",   "focusin");
    _yuitest_coverline("build/event-focus/event-focus.js", 260);
define("blur",  "beforedeactivate", "focusout");
} else {
    _yuitest_coverline("build/event-focus/event-focus.js", 262);
define("focus", "focus", "focus");
    _yuitest_coverline("build/event-focus/event-focus.js", 263);
define("blur",  "blur",  "blur");
}


}, '3.7.3', {"requires": ["event-synthetic"]});
