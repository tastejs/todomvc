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
_yuitest_coverage["build/stylesheet/stylesheet.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/stylesheet/stylesheet.js",
    code: []
};
_yuitest_coverage["build/stylesheet/stylesheet.js"].code=["YUI.add('stylesheet', function (Y, NAME) {","","/**"," * The StyleSheet component is a module for creating and modifying CSS"," * stylesheets."," *"," * @module stylesheet"," */","var d      = Y.config.doc,","    p      = d.createElement('p'), // Have to hold the node (see notes)","    workerStyle = p.style, // worker style collection","    isString = Y.Lang.isString,","    selectors = {},","    sheets = {},","    floatAttr = ('cssFloat' in workerStyle) ? 'cssFloat' : 'styleFloat',","    _toCssText,","    _unsetOpacity,","    _unsetProperty,","    OPACITY = 'opacity',","    FLOAT   = 'float',","    EMPTY   = '';","","// Normalizes the removal of an assigned style for opacity.  IE uses the filter","// property.","_unsetOpacity = (OPACITY in workerStyle) ?","    function (style) { style.opacity = EMPTY; } :","    function (style) { style.filter = EMPTY; };","","// Normalizes the removal of an assigned style for a given property.  Expands","// shortcut properties if necessary and handles the various names for the float","// property.","workerStyle.border = \"1px solid red\";","workerStyle.border = EMPTY; // IE doesn't unset child properties","_unsetProperty = workerStyle.borderLeft ?","    function (style,prop) {","        var p;","        if (prop !== floatAttr && prop.toLowerCase().indexOf(FLOAT) != -1) {","            prop = floatAttr;","        }","        if (isString(style[prop])) {","            switch (prop) {","                case OPACITY:","                case 'filter' : _unsetOpacity(style); break;","                case 'font'   :","                    style.font       = style.fontStyle = style.fontVariant =","                    style.fontWeight = style.fontSize  = style.lineHeight  =","                    style.fontFamily = EMPTY;","                    break;","                default       :","                    for (p in style) {","                        if (p.indexOf(prop) === 0) {","                            style[p] = EMPTY;","                        }","                    }","            }","        }","    } :","    function (style,prop) {","        if (prop !== floatAttr && prop.toLowerCase().indexOf(FLOAT) != -1) {","            prop = floatAttr;","        }","        if (isString(style[prop])) {","            if (prop === OPACITY) {","                _unsetOpacity(style);","            } else {","                style[prop] = EMPTY;","            }","        }","    };","","/**"," * Create an instance of StyleSheet to encapsulate a css stylesheet."," * The constructor can be called using function or constructor syntax."," * <pre><code>var sheet = Y.StyleSheet(..);</pre></code>"," * or"," * <pre><code>var sheet = new Y.StyleSheet(..);</pre></code>"," *"," * The first parameter passed can be any of the following things:"," * <ul>"," *   <li>The desired string name to register a new empty sheet</li>"," *   <li>The string name of an existing StyleSheet instance</li>"," *   <li>The unique guid generated for an existing StyleSheet instance</li>"," *   <li>The id of an existing <code>&lt;link&gt;</code> or <code>&lt;style&gt;</code> node</li>"," *   <li>The node reference for an existing <code>&lt;link&gt;</code> or <code>&lt;style&gt;</code> node</li>"," *   <li>The Y.Node instance wrapping an existing <code>&lt;link&gt;</code> or <code>&lt;style&gt;</code> node</li>"," *   <li>A chunk of css text to create a new stylesheet from</li>"," * </ul>"," *"," * <p>If a string is passed, StyleSheet will first look in its static name"," * registry for an existing sheet, then in the DOM for an element with that id."," * If neither are found and the string contains the { character, it will be"," * used as a the initial cssText for a new StyleSheet.  Otherwise, a new empty"," * StyleSheet is created, assigned the string value as a name, and registered"," * statically by that name.</p>"," *"," * <p>The optional second parameter is a string name to register the sheet as."," * This param is largely useful when providing a node id/ref or chunk of css"," * text to create a populated instance.</p>"," *"," * @class StyleSheet"," * @constructor"," * @param seed {String|HTMLElement|Node} a style or link node, its id, or a"," *              name or guid of a StyleSheet, or a string of css text"," * @param name {String} (optional) name to register instance for future static"," *              access"," */","function StyleSheet(seed, name) {","    var head,","        node,","        sheet,","        cssRules = {},","        _rules,","        _insertRule,","        _deleteRule,","        i,r,sel;","","    // Factory or constructor","    if (!(Y.instanceOf(this, StyleSheet))) {","        return new StyleSheet(seed,name);","    }","","    // Extract the DOM node from Node instances","    if (seed) {","        if (Y.Node && seed instanceof Y.Node) {","            node = seed._node;","        } else if (seed.nodeName) {","            node = seed;","        // capture the DOM node if the string is an id","        } else if (isString(seed)) {","            if (seed && sheets[seed]) {","                return sheets[seed];","            }","            node = d.getElementById(seed.replace(/^#/,EMPTY));","        }","","        // Check for the StyleSheet in the static registry","        if (node && sheets[Y.stamp(node)]) {","            return sheets[Y.stamp(node)];","        }","    }","","","    // Create a style node if necessary","    if (!node || !/^(?:style|link)$/i.test(node.nodeName)) {","        node = d.createElement('style');","        node.type = 'text/css';","    }","","    if (isString(seed)) {","        // Create entire sheet from seed cssText","        if (seed.indexOf('{') != -1) {","            // Not a load-time fork because low run-time impact and IE fails","            // test for s.styleSheet at page load time (oddly)","            if (node.styleSheet) {","                node.styleSheet.cssText = seed;","            } else {","                node.appendChild(d.createTextNode(seed));","            }","        } else if (!name) {","            name = seed;","        }","    }","","    // Make sure the node is attached to the appropriate head element","    if (!node.parentNode || node.parentNode.nodeName.toLowerCase() !== 'head') {","        head = (node.ownerDocument || d).getElementsByTagName('head')[0];","        // styleSheet isn't available on the style node in FF2 until appended","        // to the head element.  style nodes appended to body do not affect","        // change in Safari.","        head.appendChild(node);","    }","","    // Begin setting up private aliases to the important moving parts","    // 1. The stylesheet object","    // IE stores StyleSheet under the \"styleSheet\" property","    // Safari doesn't populate sheet for xdomain link elements","    sheet = node.sheet || node.styleSheet;","","    // 2. The style rules collection","    // IE stores the rules collection under the \"rules\" property","    _rules = sheet && ('cssRules' in sheet) ? 'cssRules' : 'rules';","","    // 3. The method to remove a rule from the stylesheet","    // IE supports removeRule","    _deleteRule = ('deleteRule' in sheet) ?","        function (i) { sheet.deleteRule(i); } :","        function (i) { sheet.removeRule(i); };","","    // 4. The method to add a new rule to the stylesheet","    // IE supports addRule with different signature","    _insertRule = ('insertRule' in sheet) ?","        function (sel,css,i) { sheet.insertRule(sel+' {'+css+'}',i); } :","        function (sel,css,i) { sheet.addRule(sel,css,i); };","","    // 5. Initialize the cssRules map from the node","    // xdomain link nodes forbid access to the cssRules collection, so this","    // will throw an error.","    // TODO: research alternate stylesheet, @media","    for (i = sheet[_rules].length - 1; i >= 0; --i) {","        r   = sheet[_rules][i];","        sel = r.selectorText;","","        if (cssRules[sel]) {","            cssRules[sel].style.cssText += ';' + r.style.cssText;","            _deleteRule(i);","        } else {","            cssRules[sel] = r;","        }","    }","","    // Cache the instance by the generated Id","    StyleSheet.register(Y.stamp(node),this);","","    // Register the instance by name if provided or defaulted from seed","    if (name) {","        StyleSheet.register(name,this);","    }","","    // Public API","    Y.mix(this,{","        /**","         * Get the unique stamp for this StyleSheet instance","         *","         * @method getId","         * @return {Number} the static id","         */","        getId : function () { return Y.stamp(node); },","","        /**","         * Enable all the rules in the sheet","         *","         * @method enable","         * @return {StyleSheet}","         * @chainable","         */","        enable : function () { sheet.disabled = false; return this; },","","        /**","         * Disable all the rules in the sheet.  Rules may be changed while the","         * StyleSheet is disabled.","         *","         * @method disable","         * @return {StyleSheet}","         * @chainable","         */","        disable : function () { sheet.disabled = true; return this; },","","        /**","         * Returns false if the StyleSheet is disabled.  Otherwise true.","         *","         * @method isEnabled","         * @return {Boolean}","         */","        isEnabled : function () { return !sheet.disabled; },","","        /**","         * <p>Set style properties for a provided selector string.","         * If the selector includes commas, it will be split into individual","         * selectors and applied accordingly.  If the selector string does not","         * have a corresponding rule in the sheet, it will be added.</p>","         *","         * <p>The object properties in the second parameter must be the JavaScript","         * names of style properties.  E.g. fontSize rather than font-size.</p>","         *","         * <p>The float style property will be set by any of &quot;float&quot;,","         * &quot;styleFloat&quot;, or &quot;cssFloat&quot;.</p>","         *","         * @method set","         * @param sel {String} the selector string to apply the changes to","         * @param css {Object} Object literal of style properties and new values","         * @return {StyleSheet}","         * @chainable","         */","        set : function (sel,css) {","            var rule = cssRules[sel],","                multi = sel.split(/\\s*,\\s*/),i,","                idx;","","            // IE's addRule doesn't support multiple comma delimited selectors","            if (multi.length > 1) {","                for (i = multi.length - 1; i >= 0; --i) {","                    this.set(multi[i], css);","                }","                return this;","            }","","            // Some selector values can cause IE to hang","            if (!StyleSheet.isValidSelector(sel)) {","                return this;","            }","","            // Opera throws an error if there's a syntax error in assigned","            // cssText. Avoid this using a worker style collection, then","            // assigning the resulting cssText.","            if (rule) {","                rule.style.cssText = StyleSheet.toCssText(css,rule.style.cssText);","            } else {","                idx = sheet[_rules].length;","                css = StyleSheet.toCssText(css);","","                // IE throws an error when attempting to addRule(sel,'',n)","                // which would crop up if no, or only invalid values are used","                if (css) {","                    _insertRule(sel, css, idx);","","                    // Safari replaces the rules collection, but maintains the","                    // rule instances in the new collection when rules are","                    // added/removed","                    cssRules[sel] = sheet[_rules][idx];","                }","            }","            return this;","        },","","        /**","         * <p>Unset style properties for a provided selector string, removing","         * their effect from the style cascade.</p>","         *","         * <p>If the selector includes commas, it will be split into individual","         * selectors and applied accordingly.  If there are no properties","         * remaining in the rule after unsetting, the rule is removed.</p>","         *","         * <p>The style property or properties in the second parameter must be the","         * JavaScript style property names. E.g. fontSize rather than font-size.</p>","         *","         * <p>The float style property will be unset by any of &quot;float&quot;,","         * &quot;styleFloat&quot;, or &quot;cssFloat&quot;.</p>","         *","         * @method unset","         * @param sel {String} the selector string to apply the changes to","         * @param css {String|Array} style property name or Array of names","         * @return {StyleSheet}","         * @chainable","         */","        unset : function (sel,css) {","            var rule = cssRules[sel],","                multi = sel.split(/\\s*,\\s*/),","                remove = !css,","                rules, i;","","            // IE's addRule doesn't support multiple comma delimited selectors","            // so rules are mapped internally by atomic selectors","            if (multi.length > 1) {","                for (i = multi.length - 1; i >= 0; --i) {","                    this.unset(multi[i], css);","                }","                return this;","            }","","            if (rule) {","                if (!remove) {","                    css = Y.Array(css);","","                    workerStyle.cssText = rule.style.cssText;","                    for (i = css.length - 1; i >= 0; --i) {","                        _unsetProperty(workerStyle,css[i]);","                    }","","                    if (workerStyle.cssText) {","                        rule.style.cssText = workerStyle.cssText;","                    } else {","                        remove = true;","                    }","                }","","                if (remove) { // remove the rule altogether","                    rules = sheet[_rules];","                    for (i = rules.length - 1; i >= 0; --i) {","                        if (rules[i] === rule) {","                            delete cssRules[sel];","                            _deleteRule(i);","                            break;","                        }","                    }","                }","            }","            return this;","        },","","        /**","         * Get the current cssText for a rule or the entire sheet.  If the","         * selector param is supplied, only the cssText for that rule will be","         * returned, if found.  If the selector string targets multiple","         * selectors separated by commas, the cssText of the first rule only","         * will be returned.  If no selector string, the stylesheet's full","         * cssText will be returned.","         *","         * @method getCssText","         * @param sel {String} Selector string","         * @return {String}","         */","        getCssText : function (sel) {","            var rule, css, selector;","","            if (isString(sel)) {","                // IE's addRule doesn't support multiple comma delimited","                // selectors so rules are mapped internally by atomic selectors","                rule = cssRules[sel.split(/\\s*,\\s*/)[0]];","","                return rule ? rule.style.cssText : null;","            } else {","                css = [];","                for (selector in cssRules) {","                    if (cssRules.hasOwnProperty(selector)) {","                        rule = cssRules[selector];","                        css.push(rule.selectorText+\" {\"+rule.style.cssText+\"}\");","                    }","                }","                return css.join(\"\\n\");","            }","        }","    });","","}","","_toCssText = function (css,base) {","    var f    = css.styleFloat || css.cssFloat || css[FLOAT],","        trim = Y.Lang.trim,","        prop;","","    // A very difficult to repro/isolate IE 9 beta (and Platform Preview 7) bug","    // was reduced to this line throwing the error:","    // \"Invalid this pointer used as target for method call\"","    // It appears that the style collection is corrupted. The error is","    // catchable, so in a best effort to work around it, replace the","    // p and workerStyle and try the assignment again.","    try {","        workerStyle.cssText = base || EMPTY;","    } catch (e) {","        p = d.createElement('p');","        workerStyle = p.style;","        workerStyle.cssText = base || EMPTY;","    }","","    if (f && !css[floatAttr]) {","        css = Y.merge(css);","        delete css.styleFloat; delete css.cssFloat; delete css[FLOAT];","        css[floatAttr] = f;","    }","","    for (prop in css) {","        if (css.hasOwnProperty(prop)) {","            try {","                // IE throws Invalid Value errors and doesn't like whitespace","                // in values ala ' red' or 'red '","                workerStyle[prop] = trim(css[prop]);","            }","            catch (ex) {","            }","        }","    }","    return workerStyle.cssText;","};","","Y.mix(StyleSheet, {","    /**","     * <p>Converts an object literal of style properties and values into a string","     * of css text.  This can then be assigned to el.style.cssText.</p>","     *","     * <p>The optional second parameter is a cssText string representing the","     * starting state of the style prior to alterations.  This is most often","     * extracted from the eventual target's current el.style.cssText.</p>","     *","     * @method toCssText","     * @param css {Object} object literal of style properties and values","     * @param cssText {String} (optional) starting cssText value","     * @return {String} the resulting cssText string","     * @static","     */","    toCssText : ((OPACITY in workerStyle) ? _toCssText :","        // Wrap IE's toCssText to catch opacity.  The copy/merge is to preserve","        // the input object's integrity, but if float and opacity are set, the","        // input will be copied twice in IE.  Is there a way to avoid this","        // without increasing the byte count?","        function (css, cssText) {","            if (OPACITY in css) {","                css = Y.merge(css,{","                        filter: 'alpha(opacity='+(css.opacity*100)+')'","                      });","                delete css.opacity;","            }","            return _toCssText(css,cssText);","        }),","","    /**","     * Registers a StyleSheet instance in the static registry by the given name","     *","     * @method register","     * @param name {String} the name to assign the StyleSheet in the registry","     * @param sheet {StyleSheet} The StyleSheet instance","     * @return {Boolean} false if no name or sheet is not a StyleSheet","     *              instance. true otherwise.","     * @static","     */","    register : function (name,sheet) {","        return !!(name && sheet instanceof StyleSheet &&","                  !sheets[name] && (sheets[name] = sheet));","    },","","    /**","     * <p>Determines if a selector string is safe to use.  Used internally","     * in set to prevent IE from locking up when attempting to add a rule for a","     * &quot;bad selector&quot;.</p>","     *","     * <p>Bad selectors are considered to be any string containing unescaped","     * `~!@$%^&()+=|{}[];'\"?< or space. Also forbidden are . or # followed by","     * anything other than an alphanumeric.  Additionally -abc or .-abc or","     * #_abc or '# ' all fail.  There are likely more failure cases, so","     * please file a bug if you encounter one.</p>","     *","     * @method isValidSelector","     * @param sel {String} the selector string","     * @return {Boolean}","     * @static","     */","    isValidSelector : function (sel) {","        var valid = false;","","        if (sel && isString(sel)) {","","            if (!selectors.hasOwnProperty(sel)) {","                // TEST: there should be nothing but white-space left after","                // these destructive regexs","                selectors[sel] = !/\\S/.test(","                    // combinators","                    sel.replace(/\\s+|\\s*[+~>]\\s*/g,' ').","                    // attribute selectors (contents not validated)","                    replace(/([^ ])\\[.*?\\]/g,'$1').","                    // pseudo-class|element selectors (contents of parens","                    // such as :nth-of-type(2) or :not(...) not validated)","                    replace(/([^ ])::?[a-z][a-z\\-]+[a-z](?:\\(.*?\\))?/ig,'$1').","                    // element tags","                    replace(/(?:^| )[a-z0-6]+/ig,' ').","                    // escaped characters","                    replace(/\\\\./g,EMPTY).","                    // class and id identifiers","                    replace(/[.#]\\w[\\w\\-]*/g,EMPTY));","            }","","            valid = selectors[sel];","        }","","        return valid;","    }","},true);","","Y.StyleSheet = StyleSheet;","","/*","","NOTES"," * Style node must be added to the head element.  Safari does not honor styles","   applied to StyleSheet objects on style nodes in the body."," * StyleSheet object is created on the style node when the style node is added","   to the head element in Firefox 2 (and maybe 3?)"," * The cssRules collection is replaced after insertRule/deleteRule calls in","   Safari 3.1.  Existing Rules are used in the new collection, so the collection","   cannot be cached, but the rules can be."," * Opera requires that the index be passed with insertRule."," * Same-domain restrictions prevent modifying StyleSheet objects attached to","   link elements with remote href (or \"about:blank\" or \"javascript:false\")"," * Same-domain restrictions prevent reading StyleSheet cssRules/rules","   collection of link elements with remote href (or \"about:blank\" or","   \"javascript:false\")"," * Same-domain restrictions result in Safari not populating node.sheet property","   for link elements with remote href (et.al)"," * IE names StyleSheet related properties and methods differently (see code)"," * IE converts tag names to upper case in the Rule's selectorText"," * IE converts empty string assignment to complex properties to value settings","   for all child properties.  E.g. style.background = '' sets non-'' values on","   style.backgroundPosition, style.backgroundColor, etc.  All else clear","   style.background and all child properties."," * IE assignment style.filter = '' will result in style.cssText == 'FILTER:'"," * All browsers support Rule.style.cssText as a read/write property, leaving","   only opacity needing to be accounted for."," * Benchmarks of style.property = value vs style.cssText += 'property: value'","   indicate cssText is slightly slower for single property assignment.  For","   multiple property assignment, cssText speed stays relatively the same where","   style.property speed decreases linearly by the number of properties set.","   Exception being Opera 9.27, where style.property is always faster than","   style.cssText."," * Opera 9.5b throws a syntax error when assigning cssText with a syntax error."," * Opera 9.5 doesn't honor rule.style.cssText = ''.  Previous style persists.","   You have to remove the rule altogether."," * Stylesheet properties set with !important will trump inline style set on an","   element or in el.style.property."," * Creating a worker style collection like document.createElement('p').style;","   will fail after a time in FF (~5secs of inactivity).  Property assignments","   will not alter the property or cssText.  It may be the generated node is","   garbage collected and the style collection becomes inert (speculation)."," * IE locks up when attempting to add a rule with a selector including at least","   characters {[]}~`!@%^&*()+=|? (unescaped) and leading _ or -","   such as addRule('-foo','{ color: red }') or addRule('._abc','{...}')"," * IE's addRule doesn't support comma separated selectors such as","   addRule('.foo, .bar','{..}')"," * IE throws an error on valid values with leading/trailing white space."," * When creating an entire sheet at once, only FF2/3 & Opera allow creating a","   style node, setting its innerHTML and appending to head."," * When creating an entire sheet at once, Safari requires the style node to be","   created with content in innerHTML of another element."," * When creating an entire sheet at once, IE requires the style node content to","   be set via node.styleSheet.cssText"," * When creating an entire sheet at once in IE, styleSheet.cssText can't be","   written until node.type = 'text/css'; is performed."," * When creating an entire sheet at once in IE, load-time fork on","   var styleNode = d.createElement('style'); _method = styleNode.styleSheet ?..","   fails (falsey).  During run-time, the test for .styleSheet works fine"," * Setting complex properties in cssText will SOMETIMES allow child properties","   to be unset","   set         unset              FF2  FF3  S3.1  IE6  IE7  Op9.27  Op9.5","   ----------  -----------------  ---  ---  ----  ---  ---  ------  -----","   border      -top               NO   NO   YES   YES  YES  YES     YES","               -top-color         NO   NO   YES             YES     YES","               -color             NO   NO   NO              NO      NO","   background  -color             NO   NO   YES             YES     YES","               -position          NO   NO   YES             YES     YES","               -position-x        NO   NO   NO              NO      NO","   font        line-height        YES  YES  NO    NO   NO   NO      YES","               -style             YES  YES  NO              YES     YES","               -size              YES  YES  NO              YES     YES","               -size-adjust       ???  ???  n/a   n/a  n/a  ???     ???","   padding     -top               NO   NO   YES             YES     YES","   margin      -top               NO   NO   YES             YES     YES","   list-style  -type              YES  YES  YES             YES     YES","               -position          YES  YES  YES             YES     YES","   overflow    -x                 NO   NO   YES             n/a     YES","","   ??? - unsetting font-size-adjust has the same effect as unsetting font-size"," * FireFox and WebKit populate rule.cssText as \"SELECTOR { CSSTEXT }\", but","   Opera and IE do not."," * IE6 and IE7 silently ignore the { and } if passed into addRule('.foo','{","   color:#000}',0).  IE8 does not and creates an empty rule."," * IE6-8 addRule('.foo','',n) throws an error.  Must supply *some* cssText","*/","","","","}, '3.7.3', {\"requires\": [\"yui-base\"]});"];
_yuitest_coverage["build/stylesheet/stylesheet.js"].lines = {"1":0,"9":0,"25":0,"26":0,"27":0,"32":0,"33":0,"34":0,"36":0,"37":0,"38":0,"40":0,"41":0,"43":0,"45":0,"48":0,"50":0,"51":0,"52":0,"59":0,"60":0,"62":0,"63":0,"64":0,"66":0,"107":0,"108":0,"118":0,"119":0,"123":0,"124":0,"125":0,"126":0,"127":0,"129":0,"130":0,"131":0,"133":0,"137":0,"138":0,"144":0,"145":0,"146":0,"149":0,"151":0,"154":0,"155":0,"157":0,"159":0,"160":0,"165":0,"166":0,"170":0,"177":0,"181":0,"185":0,"186":0,"187":0,"191":0,"192":0,"193":0,"199":0,"200":0,"201":0,"203":0,"204":0,"205":0,"207":0,"212":0,"215":0,"216":0,"220":0,"227":0,"236":0,"246":0,"254":0,"275":0,"280":0,"281":0,"282":0,"284":0,"288":0,"289":0,"295":0,"296":0,"298":0,"299":0,"303":0,"304":0,"309":0,"312":0,"336":0,"343":0,"344":0,"345":0,"347":0,"350":0,"351":0,"352":0,"354":0,"355":0,"356":0,"359":0,"360":0,"362":0,"366":0,"367":0,"368":0,"369":0,"370":0,"371":0,"372":0,"377":0,"393":0,"395":0,"398":0,"400":0,"402":0,"403":0,"404":0,"405":0,"406":0,"409":0,"416":0,"417":0,"427":0,"428":0,"430":0,"431":0,"432":0,"435":0,"436":0,"437":0,"438":0,"441":0,"442":0,"443":0,"446":0,"452":0,"455":0,"476":0,"477":0,"480":0,"482":0,"496":0,"517":0,"519":0,"521":0,"524":0,"540":0,"543":0,"547":0};
_yuitest_coverage["build/stylesheet/stylesheet.js"].functions = {"(anonymous 2):26":0,"}:27":0,"(anonymous 3):35":0,"}:58":0,"(anonymous 4):186":0,"}:187":0,"(anonymous 5):192":0,"}:193":0,"getId:227":0,"enable:236":0,"disable:246":0,"isEnabled:254":0,"set:274":0,"unset:335":0,"getCssText:392":0,"StyleSheet:107":0,"_toCssText:416":0,"_toCssText:475":0,"register:495":0,"isValidSelector:516":0,"(anonymous 1):1":0};
_yuitest_coverage["build/stylesheet/stylesheet.js"].coveredLines = 152;
_yuitest_coverage["build/stylesheet/stylesheet.js"].coveredFunctions = 21;
_yuitest_coverline("build/stylesheet/stylesheet.js", 1);
YUI.add('stylesheet', function (Y, NAME) {

/**
 * The StyleSheet component is a module for creating and modifying CSS
 * stylesheets.
 *
 * @module stylesheet
 */
_yuitest_coverfunc("build/stylesheet/stylesheet.js", "(anonymous 1)", 1);
_yuitest_coverline("build/stylesheet/stylesheet.js", 9);
var d      = Y.config.doc,
    p      = d.createElement('p'), // Have to hold the node (see notes)
    workerStyle = p.style, // worker style collection
    isString = Y.Lang.isString,
    selectors = {},
    sheets = {},
    floatAttr = ('cssFloat' in workerStyle) ? 'cssFloat' : 'styleFloat',
    _toCssText,
    _unsetOpacity,
    _unsetProperty,
    OPACITY = 'opacity',
    FLOAT   = 'float',
    EMPTY   = '';

// Normalizes the removal of an assigned style for opacity.  IE uses the filter
// property.
_yuitest_coverline("build/stylesheet/stylesheet.js", 25);
_unsetOpacity = (OPACITY in workerStyle) ?
    function (style) { _yuitest_coverfunc("build/stylesheet/stylesheet.js", "(anonymous 2)", 26);
_yuitest_coverline("build/stylesheet/stylesheet.js", 26);
style.opacity = EMPTY; } :
    function (style) { _yuitest_coverfunc("build/stylesheet/stylesheet.js", "}", 27);
_yuitest_coverline("build/stylesheet/stylesheet.js", 27);
style.filter = EMPTY; };

// Normalizes the removal of an assigned style for a given property.  Expands
// shortcut properties if necessary and handles the various names for the float
// property.
_yuitest_coverline("build/stylesheet/stylesheet.js", 32);
workerStyle.border = "1px solid red";
_yuitest_coverline("build/stylesheet/stylesheet.js", 33);
workerStyle.border = EMPTY; // IE doesn't unset child properties
_yuitest_coverline("build/stylesheet/stylesheet.js", 34);
_unsetProperty = workerStyle.borderLeft ?
    function (style,prop) {
        _yuitest_coverfunc("build/stylesheet/stylesheet.js", "(anonymous 3)", 35);
_yuitest_coverline("build/stylesheet/stylesheet.js", 36);
var p;
        _yuitest_coverline("build/stylesheet/stylesheet.js", 37);
if (prop !== floatAttr && prop.toLowerCase().indexOf(FLOAT) != -1) {
            _yuitest_coverline("build/stylesheet/stylesheet.js", 38);
prop = floatAttr;
        }
        _yuitest_coverline("build/stylesheet/stylesheet.js", 40);
if (isString(style[prop])) {
            _yuitest_coverline("build/stylesheet/stylesheet.js", 41);
switch (prop) {
                case OPACITY:
                case 'filter' : _yuitest_coverline("build/stylesheet/stylesheet.js", 43);
_unsetOpacity(style); break;
                case 'font'   :
                    _yuitest_coverline("build/stylesheet/stylesheet.js", 45);
style.font       = style.fontStyle = style.fontVariant =
                    style.fontWeight = style.fontSize  = style.lineHeight  =
                    style.fontFamily = EMPTY;
                    _yuitest_coverline("build/stylesheet/stylesheet.js", 48);
break;
                default       :
                    _yuitest_coverline("build/stylesheet/stylesheet.js", 50);
for (p in style) {
                        _yuitest_coverline("build/stylesheet/stylesheet.js", 51);
if (p.indexOf(prop) === 0) {
                            _yuitest_coverline("build/stylesheet/stylesheet.js", 52);
style[p] = EMPTY;
                        }
                    }
            }
        }
    } :
    function (style,prop) {
        _yuitest_coverfunc("build/stylesheet/stylesheet.js", "}", 58);
_yuitest_coverline("build/stylesheet/stylesheet.js", 59);
if (prop !== floatAttr && prop.toLowerCase().indexOf(FLOAT) != -1) {
            _yuitest_coverline("build/stylesheet/stylesheet.js", 60);
prop = floatAttr;
        }
        _yuitest_coverline("build/stylesheet/stylesheet.js", 62);
if (isString(style[prop])) {
            _yuitest_coverline("build/stylesheet/stylesheet.js", 63);
if (prop === OPACITY) {
                _yuitest_coverline("build/stylesheet/stylesheet.js", 64);
_unsetOpacity(style);
            } else {
                _yuitest_coverline("build/stylesheet/stylesheet.js", 66);
style[prop] = EMPTY;
            }
        }
    };

/**
 * Create an instance of StyleSheet to encapsulate a css stylesheet.
 * The constructor can be called using function or constructor syntax.
 * <pre><code>var sheet = Y.StyleSheet(..);</pre></code>
 * or
 * <pre><code>var sheet = new Y.StyleSheet(..);</pre></code>
 *
 * The first parameter passed can be any of the following things:
 * <ul>
 *   <li>The desired string name to register a new empty sheet</li>
 *   <li>The string name of an existing StyleSheet instance</li>
 *   <li>The unique guid generated for an existing StyleSheet instance</li>
 *   <li>The id of an existing <code>&lt;link&gt;</code> or <code>&lt;style&gt;</code> node</li>
 *   <li>The node reference for an existing <code>&lt;link&gt;</code> or <code>&lt;style&gt;</code> node</li>
 *   <li>The Y.Node instance wrapping an existing <code>&lt;link&gt;</code> or <code>&lt;style&gt;</code> node</li>
 *   <li>A chunk of css text to create a new stylesheet from</li>
 * </ul>
 *
 * <p>If a string is passed, StyleSheet will first look in its static name
 * registry for an existing sheet, then in the DOM for an element with that id.
 * If neither are found and the string contains the { character, it will be
 * used as a the initial cssText for a new StyleSheet.  Otherwise, a new empty
 * StyleSheet is created, assigned the string value as a name, and registered
 * statically by that name.</p>
 *
 * <p>The optional second parameter is a string name to register the sheet as.
 * This param is largely useful when providing a node id/ref or chunk of css
 * text to create a populated instance.</p>
 *
 * @class StyleSheet
 * @constructor
 * @param seed {String|HTMLElement|Node} a style or link node, its id, or a
 *              name or guid of a StyleSheet, or a string of css text
 * @param name {String} (optional) name to register instance for future static
 *              access
 */
_yuitest_coverline("build/stylesheet/stylesheet.js", 107);
function StyleSheet(seed, name) {
    _yuitest_coverfunc("build/stylesheet/stylesheet.js", "StyleSheet", 107);
_yuitest_coverline("build/stylesheet/stylesheet.js", 108);
var head,
        node,
        sheet,
        cssRules = {},
        _rules,
        _insertRule,
        _deleteRule,
        i,r,sel;

    // Factory or constructor
    _yuitest_coverline("build/stylesheet/stylesheet.js", 118);
if (!(Y.instanceOf(this, StyleSheet))) {
        _yuitest_coverline("build/stylesheet/stylesheet.js", 119);
return new StyleSheet(seed,name);
    }

    // Extract the DOM node from Node instances
    _yuitest_coverline("build/stylesheet/stylesheet.js", 123);
if (seed) {
        _yuitest_coverline("build/stylesheet/stylesheet.js", 124);
if (Y.Node && seed instanceof Y.Node) {
            _yuitest_coverline("build/stylesheet/stylesheet.js", 125);
node = seed._node;
        } else {_yuitest_coverline("build/stylesheet/stylesheet.js", 126);
if (seed.nodeName) {
            _yuitest_coverline("build/stylesheet/stylesheet.js", 127);
node = seed;
        // capture the DOM node if the string is an id
        } else {_yuitest_coverline("build/stylesheet/stylesheet.js", 129);
if (isString(seed)) {
            _yuitest_coverline("build/stylesheet/stylesheet.js", 130);
if (seed && sheets[seed]) {
                _yuitest_coverline("build/stylesheet/stylesheet.js", 131);
return sheets[seed];
            }
            _yuitest_coverline("build/stylesheet/stylesheet.js", 133);
node = d.getElementById(seed.replace(/^#/,EMPTY));
        }}}

        // Check for the StyleSheet in the static registry
        _yuitest_coverline("build/stylesheet/stylesheet.js", 137);
if (node && sheets[Y.stamp(node)]) {
            _yuitest_coverline("build/stylesheet/stylesheet.js", 138);
return sheets[Y.stamp(node)];
        }
    }


    // Create a style node if necessary
    _yuitest_coverline("build/stylesheet/stylesheet.js", 144);
if (!node || !/^(?:style|link)$/i.test(node.nodeName)) {
        _yuitest_coverline("build/stylesheet/stylesheet.js", 145);
node = d.createElement('style');
        _yuitest_coverline("build/stylesheet/stylesheet.js", 146);
node.type = 'text/css';
    }

    _yuitest_coverline("build/stylesheet/stylesheet.js", 149);
if (isString(seed)) {
        // Create entire sheet from seed cssText
        _yuitest_coverline("build/stylesheet/stylesheet.js", 151);
if (seed.indexOf('{') != -1) {
            // Not a load-time fork because low run-time impact and IE fails
            // test for s.styleSheet at page load time (oddly)
            _yuitest_coverline("build/stylesheet/stylesheet.js", 154);
if (node.styleSheet) {
                _yuitest_coverline("build/stylesheet/stylesheet.js", 155);
node.styleSheet.cssText = seed;
            } else {
                _yuitest_coverline("build/stylesheet/stylesheet.js", 157);
node.appendChild(d.createTextNode(seed));
            }
        } else {_yuitest_coverline("build/stylesheet/stylesheet.js", 159);
if (!name) {
            _yuitest_coverline("build/stylesheet/stylesheet.js", 160);
name = seed;
        }}
    }

    // Make sure the node is attached to the appropriate head element
    _yuitest_coverline("build/stylesheet/stylesheet.js", 165);
if (!node.parentNode || node.parentNode.nodeName.toLowerCase() !== 'head') {
        _yuitest_coverline("build/stylesheet/stylesheet.js", 166);
head = (node.ownerDocument || d).getElementsByTagName('head')[0];
        // styleSheet isn't available on the style node in FF2 until appended
        // to the head element.  style nodes appended to body do not affect
        // change in Safari.
        _yuitest_coverline("build/stylesheet/stylesheet.js", 170);
head.appendChild(node);
    }

    // Begin setting up private aliases to the important moving parts
    // 1. The stylesheet object
    // IE stores StyleSheet under the "styleSheet" property
    // Safari doesn't populate sheet for xdomain link elements
    _yuitest_coverline("build/stylesheet/stylesheet.js", 177);
sheet = node.sheet || node.styleSheet;

    // 2. The style rules collection
    // IE stores the rules collection under the "rules" property
    _yuitest_coverline("build/stylesheet/stylesheet.js", 181);
_rules = sheet && ('cssRules' in sheet) ? 'cssRules' : 'rules';

    // 3. The method to remove a rule from the stylesheet
    // IE supports removeRule
    _yuitest_coverline("build/stylesheet/stylesheet.js", 185);
_deleteRule = ('deleteRule' in sheet) ?
        function (i) { _yuitest_coverfunc("build/stylesheet/stylesheet.js", "(anonymous 4)", 186);
_yuitest_coverline("build/stylesheet/stylesheet.js", 186);
sheet.deleteRule(i); } :
        function (i) { _yuitest_coverfunc("build/stylesheet/stylesheet.js", "}", 187);
_yuitest_coverline("build/stylesheet/stylesheet.js", 187);
sheet.removeRule(i); };

    // 4. The method to add a new rule to the stylesheet
    // IE supports addRule with different signature
    _yuitest_coverline("build/stylesheet/stylesheet.js", 191);
_insertRule = ('insertRule' in sheet) ?
        function (sel,css,i) { _yuitest_coverfunc("build/stylesheet/stylesheet.js", "(anonymous 5)", 192);
_yuitest_coverline("build/stylesheet/stylesheet.js", 192);
sheet.insertRule(sel+' {'+css+'}',i); } :
        function (sel,css,i) { _yuitest_coverfunc("build/stylesheet/stylesheet.js", "}", 193);
_yuitest_coverline("build/stylesheet/stylesheet.js", 193);
sheet.addRule(sel,css,i); };

    // 5. Initialize the cssRules map from the node
    // xdomain link nodes forbid access to the cssRules collection, so this
    // will throw an error.
    // TODO: research alternate stylesheet, @media
    _yuitest_coverline("build/stylesheet/stylesheet.js", 199);
for (i = sheet[_rules].length - 1; i >= 0; --i) {
        _yuitest_coverline("build/stylesheet/stylesheet.js", 200);
r   = sheet[_rules][i];
        _yuitest_coverline("build/stylesheet/stylesheet.js", 201);
sel = r.selectorText;

        _yuitest_coverline("build/stylesheet/stylesheet.js", 203);
if (cssRules[sel]) {
            _yuitest_coverline("build/stylesheet/stylesheet.js", 204);
cssRules[sel].style.cssText += ';' + r.style.cssText;
            _yuitest_coverline("build/stylesheet/stylesheet.js", 205);
_deleteRule(i);
        } else {
            _yuitest_coverline("build/stylesheet/stylesheet.js", 207);
cssRules[sel] = r;
        }
    }

    // Cache the instance by the generated Id
    _yuitest_coverline("build/stylesheet/stylesheet.js", 212);
StyleSheet.register(Y.stamp(node),this);

    // Register the instance by name if provided or defaulted from seed
    _yuitest_coverline("build/stylesheet/stylesheet.js", 215);
if (name) {
        _yuitest_coverline("build/stylesheet/stylesheet.js", 216);
StyleSheet.register(name,this);
    }

    // Public API
    _yuitest_coverline("build/stylesheet/stylesheet.js", 220);
Y.mix(this,{
        /**
         * Get the unique stamp for this StyleSheet instance
         *
         * @method getId
         * @return {Number} the static id
         */
        getId : function () { _yuitest_coverfunc("build/stylesheet/stylesheet.js", "getId", 227);
_yuitest_coverline("build/stylesheet/stylesheet.js", 227);
return Y.stamp(node); },

        /**
         * Enable all the rules in the sheet
         *
         * @method enable
         * @return {StyleSheet}
         * @chainable
         */
        enable : function () { _yuitest_coverfunc("build/stylesheet/stylesheet.js", "enable", 236);
_yuitest_coverline("build/stylesheet/stylesheet.js", 236);
sheet.disabled = false; return this; },

        /**
         * Disable all the rules in the sheet.  Rules may be changed while the
         * StyleSheet is disabled.
         *
         * @method disable
         * @return {StyleSheet}
         * @chainable
         */
        disable : function () { _yuitest_coverfunc("build/stylesheet/stylesheet.js", "disable", 246);
_yuitest_coverline("build/stylesheet/stylesheet.js", 246);
sheet.disabled = true; return this; },

        /**
         * Returns false if the StyleSheet is disabled.  Otherwise true.
         *
         * @method isEnabled
         * @return {Boolean}
         */
        isEnabled : function () { _yuitest_coverfunc("build/stylesheet/stylesheet.js", "isEnabled", 254);
_yuitest_coverline("build/stylesheet/stylesheet.js", 254);
return !sheet.disabled; },

        /**
         * <p>Set style properties for a provided selector string.
         * If the selector includes commas, it will be split into individual
         * selectors and applied accordingly.  If the selector string does not
         * have a corresponding rule in the sheet, it will be added.</p>
         *
         * <p>The object properties in the second parameter must be the JavaScript
         * names of style properties.  E.g. fontSize rather than font-size.</p>
         *
         * <p>The float style property will be set by any of &quot;float&quot;,
         * &quot;styleFloat&quot;, or &quot;cssFloat&quot;.</p>
         *
         * @method set
         * @param sel {String} the selector string to apply the changes to
         * @param css {Object} Object literal of style properties and new values
         * @return {StyleSheet}
         * @chainable
         */
        set : function (sel,css) {
            _yuitest_coverfunc("build/stylesheet/stylesheet.js", "set", 274);
_yuitest_coverline("build/stylesheet/stylesheet.js", 275);
var rule = cssRules[sel],
                multi = sel.split(/\s*,\s*/),i,
                idx;

            // IE's addRule doesn't support multiple comma delimited selectors
            _yuitest_coverline("build/stylesheet/stylesheet.js", 280);
if (multi.length > 1) {
                _yuitest_coverline("build/stylesheet/stylesheet.js", 281);
for (i = multi.length - 1; i >= 0; --i) {
                    _yuitest_coverline("build/stylesheet/stylesheet.js", 282);
this.set(multi[i], css);
                }
                _yuitest_coverline("build/stylesheet/stylesheet.js", 284);
return this;
            }

            // Some selector values can cause IE to hang
            _yuitest_coverline("build/stylesheet/stylesheet.js", 288);
if (!StyleSheet.isValidSelector(sel)) {
                _yuitest_coverline("build/stylesheet/stylesheet.js", 289);
return this;
            }

            // Opera throws an error if there's a syntax error in assigned
            // cssText. Avoid this using a worker style collection, then
            // assigning the resulting cssText.
            _yuitest_coverline("build/stylesheet/stylesheet.js", 295);
if (rule) {
                _yuitest_coverline("build/stylesheet/stylesheet.js", 296);
rule.style.cssText = StyleSheet.toCssText(css,rule.style.cssText);
            } else {
                _yuitest_coverline("build/stylesheet/stylesheet.js", 298);
idx = sheet[_rules].length;
                _yuitest_coverline("build/stylesheet/stylesheet.js", 299);
css = StyleSheet.toCssText(css);

                // IE throws an error when attempting to addRule(sel,'',n)
                // which would crop up if no, or only invalid values are used
                _yuitest_coverline("build/stylesheet/stylesheet.js", 303);
if (css) {
                    _yuitest_coverline("build/stylesheet/stylesheet.js", 304);
_insertRule(sel, css, idx);

                    // Safari replaces the rules collection, but maintains the
                    // rule instances in the new collection when rules are
                    // added/removed
                    _yuitest_coverline("build/stylesheet/stylesheet.js", 309);
cssRules[sel] = sheet[_rules][idx];
                }
            }
            _yuitest_coverline("build/stylesheet/stylesheet.js", 312);
return this;
        },

        /**
         * <p>Unset style properties for a provided selector string, removing
         * their effect from the style cascade.</p>
         *
         * <p>If the selector includes commas, it will be split into individual
         * selectors and applied accordingly.  If there are no properties
         * remaining in the rule after unsetting, the rule is removed.</p>
         *
         * <p>The style property or properties in the second parameter must be the
         * JavaScript style property names. E.g. fontSize rather than font-size.</p>
         *
         * <p>The float style property will be unset by any of &quot;float&quot;,
         * &quot;styleFloat&quot;, or &quot;cssFloat&quot;.</p>
         *
         * @method unset
         * @param sel {String} the selector string to apply the changes to
         * @param css {String|Array} style property name or Array of names
         * @return {StyleSheet}
         * @chainable
         */
        unset : function (sel,css) {
            _yuitest_coverfunc("build/stylesheet/stylesheet.js", "unset", 335);
_yuitest_coverline("build/stylesheet/stylesheet.js", 336);
var rule = cssRules[sel],
                multi = sel.split(/\s*,\s*/),
                remove = !css,
                rules, i;

            // IE's addRule doesn't support multiple comma delimited selectors
            // so rules are mapped internally by atomic selectors
            _yuitest_coverline("build/stylesheet/stylesheet.js", 343);
if (multi.length > 1) {
                _yuitest_coverline("build/stylesheet/stylesheet.js", 344);
for (i = multi.length - 1; i >= 0; --i) {
                    _yuitest_coverline("build/stylesheet/stylesheet.js", 345);
this.unset(multi[i], css);
                }
                _yuitest_coverline("build/stylesheet/stylesheet.js", 347);
return this;
            }

            _yuitest_coverline("build/stylesheet/stylesheet.js", 350);
if (rule) {
                _yuitest_coverline("build/stylesheet/stylesheet.js", 351);
if (!remove) {
                    _yuitest_coverline("build/stylesheet/stylesheet.js", 352);
css = Y.Array(css);

                    _yuitest_coverline("build/stylesheet/stylesheet.js", 354);
workerStyle.cssText = rule.style.cssText;
                    _yuitest_coverline("build/stylesheet/stylesheet.js", 355);
for (i = css.length - 1; i >= 0; --i) {
                        _yuitest_coverline("build/stylesheet/stylesheet.js", 356);
_unsetProperty(workerStyle,css[i]);
                    }

                    _yuitest_coverline("build/stylesheet/stylesheet.js", 359);
if (workerStyle.cssText) {
                        _yuitest_coverline("build/stylesheet/stylesheet.js", 360);
rule.style.cssText = workerStyle.cssText;
                    } else {
                        _yuitest_coverline("build/stylesheet/stylesheet.js", 362);
remove = true;
                    }
                }

                _yuitest_coverline("build/stylesheet/stylesheet.js", 366);
if (remove) { // remove the rule altogether
                    _yuitest_coverline("build/stylesheet/stylesheet.js", 367);
rules = sheet[_rules];
                    _yuitest_coverline("build/stylesheet/stylesheet.js", 368);
for (i = rules.length - 1; i >= 0; --i) {
                        _yuitest_coverline("build/stylesheet/stylesheet.js", 369);
if (rules[i] === rule) {
                            _yuitest_coverline("build/stylesheet/stylesheet.js", 370);
delete cssRules[sel];
                            _yuitest_coverline("build/stylesheet/stylesheet.js", 371);
_deleteRule(i);
                            _yuitest_coverline("build/stylesheet/stylesheet.js", 372);
break;
                        }
                    }
                }
            }
            _yuitest_coverline("build/stylesheet/stylesheet.js", 377);
return this;
        },

        /**
         * Get the current cssText for a rule or the entire sheet.  If the
         * selector param is supplied, only the cssText for that rule will be
         * returned, if found.  If the selector string targets multiple
         * selectors separated by commas, the cssText of the first rule only
         * will be returned.  If no selector string, the stylesheet's full
         * cssText will be returned.
         *
         * @method getCssText
         * @param sel {String} Selector string
         * @return {String}
         */
        getCssText : function (sel) {
            _yuitest_coverfunc("build/stylesheet/stylesheet.js", "getCssText", 392);
_yuitest_coverline("build/stylesheet/stylesheet.js", 393);
var rule, css, selector;

            _yuitest_coverline("build/stylesheet/stylesheet.js", 395);
if (isString(sel)) {
                // IE's addRule doesn't support multiple comma delimited
                // selectors so rules are mapped internally by atomic selectors
                _yuitest_coverline("build/stylesheet/stylesheet.js", 398);
rule = cssRules[sel.split(/\s*,\s*/)[0]];

                _yuitest_coverline("build/stylesheet/stylesheet.js", 400);
return rule ? rule.style.cssText : null;
            } else {
                _yuitest_coverline("build/stylesheet/stylesheet.js", 402);
css = [];
                _yuitest_coverline("build/stylesheet/stylesheet.js", 403);
for (selector in cssRules) {
                    _yuitest_coverline("build/stylesheet/stylesheet.js", 404);
if (cssRules.hasOwnProperty(selector)) {
                        _yuitest_coverline("build/stylesheet/stylesheet.js", 405);
rule = cssRules[selector];
                        _yuitest_coverline("build/stylesheet/stylesheet.js", 406);
css.push(rule.selectorText+" {"+rule.style.cssText+"}");
                    }
                }
                _yuitest_coverline("build/stylesheet/stylesheet.js", 409);
return css.join("\n");
            }
        }
    });

}

_yuitest_coverline("build/stylesheet/stylesheet.js", 416);
_toCssText = function (css,base) {
    _yuitest_coverfunc("build/stylesheet/stylesheet.js", "_toCssText", 416);
_yuitest_coverline("build/stylesheet/stylesheet.js", 417);
var f    = css.styleFloat || css.cssFloat || css[FLOAT],
        trim = Y.Lang.trim,
        prop;

    // A very difficult to repro/isolate IE 9 beta (and Platform Preview 7) bug
    // was reduced to this line throwing the error:
    // "Invalid this pointer used as target for method call"
    // It appears that the style collection is corrupted. The error is
    // catchable, so in a best effort to work around it, replace the
    // p and workerStyle and try the assignment again.
    _yuitest_coverline("build/stylesheet/stylesheet.js", 427);
try {
        _yuitest_coverline("build/stylesheet/stylesheet.js", 428);
workerStyle.cssText = base || EMPTY;
    } catch (e) {
        _yuitest_coverline("build/stylesheet/stylesheet.js", 430);
p = d.createElement('p');
        _yuitest_coverline("build/stylesheet/stylesheet.js", 431);
workerStyle = p.style;
        _yuitest_coverline("build/stylesheet/stylesheet.js", 432);
workerStyle.cssText = base || EMPTY;
    }

    _yuitest_coverline("build/stylesheet/stylesheet.js", 435);
if (f && !css[floatAttr]) {
        _yuitest_coverline("build/stylesheet/stylesheet.js", 436);
css = Y.merge(css);
        _yuitest_coverline("build/stylesheet/stylesheet.js", 437);
delete css.styleFloat; delete css.cssFloat; delete css[FLOAT];
        _yuitest_coverline("build/stylesheet/stylesheet.js", 438);
css[floatAttr] = f;
    }

    _yuitest_coverline("build/stylesheet/stylesheet.js", 441);
for (prop in css) {
        _yuitest_coverline("build/stylesheet/stylesheet.js", 442);
if (css.hasOwnProperty(prop)) {
            _yuitest_coverline("build/stylesheet/stylesheet.js", 443);
try {
                // IE throws Invalid Value errors and doesn't like whitespace
                // in values ala ' red' or 'red '
                _yuitest_coverline("build/stylesheet/stylesheet.js", 446);
workerStyle[prop] = trim(css[prop]);
            }
            catch (ex) {
            }
        }
    }
    _yuitest_coverline("build/stylesheet/stylesheet.js", 452);
return workerStyle.cssText;
};

_yuitest_coverline("build/stylesheet/stylesheet.js", 455);
Y.mix(StyleSheet, {
    /**
     * <p>Converts an object literal of style properties and values into a string
     * of css text.  This can then be assigned to el.style.cssText.</p>
     *
     * <p>The optional second parameter is a cssText string representing the
     * starting state of the style prior to alterations.  This is most often
     * extracted from the eventual target's current el.style.cssText.</p>
     *
     * @method toCssText
     * @param css {Object} object literal of style properties and values
     * @param cssText {String} (optional) starting cssText value
     * @return {String} the resulting cssText string
     * @static
     */
    toCssText : ((OPACITY in workerStyle) ? _toCssText :
        // Wrap IE's toCssText to catch opacity.  The copy/merge is to preserve
        // the input object's integrity, but if float and opacity are set, the
        // input will be copied twice in IE.  Is there a way to avoid this
        // without increasing the byte count?
        function (css, cssText) {
            _yuitest_coverfunc("build/stylesheet/stylesheet.js", "_toCssText", 475);
_yuitest_coverline("build/stylesheet/stylesheet.js", 476);
if (OPACITY in css) {
                _yuitest_coverline("build/stylesheet/stylesheet.js", 477);
css = Y.merge(css,{
                        filter: 'alpha(opacity='+(css.opacity*100)+')'
                      });
                _yuitest_coverline("build/stylesheet/stylesheet.js", 480);
delete css.opacity;
            }
            _yuitest_coverline("build/stylesheet/stylesheet.js", 482);
return _toCssText(css,cssText);
        }),

    /**
     * Registers a StyleSheet instance in the static registry by the given name
     *
     * @method register
     * @param name {String} the name to assign the StyleSheet in the registry
     * @param sheet {StyleSheet} The StyleSheet instance
     * @return {Boolean} false if no name or sheet is not a StyleSheet
     *              instance. true otherwise.
     * @static
     */
    register : function (name,sheet) {
        _yuitest_coverfunc("build/stylesheet/stylesheet.js", "register", 495);
_yuitest_coverline("build/stylesheet/stylesheet.js", 496);
return !!(name && sheet instanceof StyleSheet &&
                  !sheets[name] && (sheets[name] = sheet));
    },

    /**
     * <p>Determines if a selector string is safe to use.  Used internally
     * in set to prevent IE from locking up when attempting to add a rule for a
     * &quot;bad selector&quot;.</p>
     *
     * <p>Bad selectors are considered to be any string containing unescaped
     * `~!@$%^&()+=|{}[];'"?< or space. Also forbidden are . or # followed by
     * anything other than an alphanumeric.  Additionally -abc or .-abc or
     * #_abc or '# ' all fail.  There are likely more failure cases, so
     * please file a bug if you encounter one.</p>
     *
     * @method isValidSelector
     * @param sel {String} the selector string
     * @return {Boolean}
     * @static
     */
    isValidSelector : function (sel) {
        _yuitest_coverfunc("build/stylesheet/stylesheet.js", "isValidSelector", 516);
_yuitest_coverline("build/stylesheet/stylesheet.js", 517);
var valid = false;

        _yuitest_coverline("build/stylesheet/stylesheet.js", 519);
if (sel && isString(sel)) {

            _yuitest_coverline("build/stylesheet/stylesheet.js", 521);
if (!selectors.hasOwnProperty(sel)) {
                // TEST: there should be nothing but white-space left after
                // these destructive regexs
                _yuitest_coverline("build/stylesheet/stylesheet.js", 524);
selectors[sel] = !/\S/.test(
                    // combinators
                    sel.replace(/\s+|\s*[+~>]\s*/g,' ').
                    // attribute selectors (contents not validated)
                    replace(/([^ ])\[.*?\]/g,'$1').
                    // pseudo-class|element selectors (contents of parens
                    // such as :nth-of-type(2) or :not(...) not validated)
                    replace(/([^ ])::?[a-z][a-z\-]+[a-z](?:\(.*?\))?/ig,'$1').
                    // element tags
                    replace(/(?:^| )[a-z0-6]+/ig,' ').
                    // escaped characters
                    replace(/\\./g,EMPTY).
                    // class and id identifiers
                    replace(/[.#]\w[\w\-]*/g,EMPTY));
            }

            _yuitest_coverline("build/stylesheet/stylesheet.js", 540);
valid = selectors[sel];
        }

        _yuitest_coverline("build/stylesheet/stylesheet.js", 543);
return valid;
    }
},true);

_yuitest_coverline("build/stylesheet/stylesheet.js", 547);
Y.StyleSheet = StyleSheet;

/*

NOTES
 * Style node must be added to the head element.  Safari does not honor styles
   applied to StyleSheet objects on style nodes in the body.
 * StyleSheet object is created on the style node when the style node is added
   to the head element in Firefox 2 (and maybe 3?)
 * The cssRules collection is replaced after insertRule/deleteRule calls in
   Safari 3.1.  Existing Rules are used in the new collection, so the collection
   cannot be cached, but the rules can be.
 * Opera requires that the index be passed with insertRule.
 * Same-domain restrictions prevent modifying StyleSheet objects attached to
   link elements with remote href (or "about:blank" or "javascript:false")
 * Same-domain restrictions prevent reading StyleSheet cssRules/rules
   collection of link elements with remote href (or "about:blank" or
   "javascript:false")
 * Same-domain restrictions result in Safari not populating node.sheet property
   for link elements with remote href (et.al)
 * IE names StyleSheet related properties and methods differently (see code)
 * IE converts tag names to upper case in the Rule's selectorText
 * IE converts empty string assignment to complex properties to value settings
   for all child properties.  E.g. style.background = '' sets non-'' values on
   style.backgroundPosition, style.backgroundColor, etc.  All else clear
   style.background and all child properties.
 * IE assignment style.filter = '' will result in style.cssText == 'FILTER:'
 * All browsers support Rule.style.cssText as a read/write property, leaving
   only opacity needing to be accounted for.
 * Benchmarks of style.property = value vs style.cssText += 'property: value'
   indicate cssText is slightly slower for single property assignment.  For
   multiple property assignment, cssText speed stays relatively the same where
   style.property speed decreases linearly by the number of properties set.
   Exception being Opera 9.27, where style.property is always faster than
   style.cssText.
 * Opera 9.5b throws a syntax error when assigning cssText with a syntax error.
 * Opera 9.5 doesn't honor rule.style.cssText = ''.  Previous style persists.
   You have to remove the rule altogether.
 * Stylesheet properties set with !important will trump inline style set on an
   element or in el.style.property.
 * Creating a worker style collection like document.createElement('p').style;
   will fail after a time in FF (~5secs of inactivity).  Property assignments
   will not alter the property or cssText.  It may be the generated node is
   garbage collected and the style collection becomes inert (speculation).
 * IE locks up when attempting to add a rule with a selector including at least
   characters {[]}~`!@%^&*()+=|? (unescaped) and leading _ or -
   such as addRule('-foo','{ color: red }') or addRule('._abc','{...}')
 * IE's addRule doesn't support comma separated selectors such as
   addRule('.foo, .bar','{..}')
 * IE throws an error on valid values with leading/trailing white space.
 * When creating an entire sheet at once, only FF2/3 & Opera allow creating a
   style node, setting its innerHTML and appending to head.
 * When creating an entire sheet at once, Safari requires the style node to be
   created with content in innerHTML of another element.
 * When creating an entire sheet at once, IE requires the style node content to
   be set via node.styleSheet.cssText
 * When creating an entire sheet at once in IE, styleSheet.cssText can't be
   written until node.type = 'text/css'; is performed.
 * When creating an entire sheet at once in IE, load-time fork on
   var styleNode = d.createElement('style'); _method = styleNode.styleSheet ?..
   fails (falsey).  During run-time, the test for .styleSheet works fine
 * Setting complex properties in cssText will SOMETIMES allow child properties
   to be unset
   set         unset              FF2  FF3  S3.1  IE6  IE7  Op9.27  Op9.5
   ----------  -----------------  ---  ---  ----  ---  ---  ------  -----
   border      -top               NO   NO   YES   YES  YES  YES     YES
               -top-color         NO   NO   YES             YES     YES
               -color             NO   NO   NO              NO      NO
   background  -color             NO   NO   YES             YES     YES
               -position          NO   NO   YES             YES     YES
               -position-x        NO   NO   NO              NO      NO
   font        line-height        YES  YES  NO    NO   NO   NO      YES
               -style             YES  YES  NO              YES     YES
               -size              YES  YES  NO              YES     YES
               -size-adjust       ???  ???  n/a   n/a  n/a  ???     ???
   padding     -top               NO   NO   YES             YES     YES
   margin      -top               NO   NO   YES             YES     YES
   list-style  -type              YES  YES  YES             YES     YES
               -position          YES  YES  YES             YES     YES
   overflow    -x                 NO   NO   YES             n/a     YES

   ??? - unsetting font-size-adjust has the same effect as unsetting font-size
 * FireFox and WebKit populate rule.cssText as "SELECTOR { CSSTEXT }", but
   Opera and IE do not.
 * IE6 and IE7 silently ignore the { and } if passed into addRule('.foo','{
   color:#000}',0).  IE8 does not and creates an empty rule.
 * IE6-8 addRule('.foo','',n) throws an error.  Must supply *some* cssText
*/



}, '3.7.3', {"requires": ["yui-base"]});
