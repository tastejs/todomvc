/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('stylesheet', function (Y, NAME) {

/**
 * The StyleSheet component is a module for creating and modifying CSS
 * stylesheets.
 *
 * @module stylesheet
 */
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
_unsetOpacity = (OPACITY in workerStyle) ?
    function (style) { style.opacity = EMPTY; } :
    function (style) { style.filter = EMPTY; };

// Normalizes the removal of an assigned style for a given property.  Expands
// shortcut properties if necessary and handles the various names for the float
// property.
workerStyle.border = "1px solid red";
workerStyle.border = EMPTY; // IE doesn't unset child properties
_unsetProperty = workerStyle.borderLeft ?
    function (style,prop) {
        var p;
        if (prop !== floatAttr && prop.toLowerCase().indexOf(FLOAT) != -1) {
            prop = floatAttr;
        }
        if (isString(style[prop])) {
            switch (prop) {
                case OPACITY:
                case 'filter' : _unsetOpacity(style); break;
                case 'font'   :
                    style.font       = style.fontStyle = style.fontVariant =
                    style.fontWeight = style.fontSize  = style.lineHeight  =
                    style.fontFamily = EMPTY;
                    break;
                default       :
                    for (p in style) {
                        if (p.indexOf(prop) === 0) {
                            style[p] = EMPTY;
                        }
                    }
            }
        }
    } :
    function (style,prop) {
        if (prop !== floatAttr && prop.toLowerCase().indexOf(FLOAT) != -1) {
            prop = floatAttr;
        }
        if (isString(style[prop])) {
            if (prop === OPACITY) {
                _unsetOpacity(style);
            } else {
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
function StyleSheet(seed, name) {
    var head,
        node,
        sheet,
        cssRules = {},
        _rules,
        _insertRule,
        _deleteRule,
        i,r,sel;

    // Factory or constructor
    if (!(Y.instanceOf(this, StyleSheet))) {
        return new StyleSheet(seed,name);
    }

    // Extract the DOM node from Node instances
    if (seed) {
        if (Y.Node && seed instanceof Y.Node) {
            node = seed._node;
        } else if (seed.nodeName) {
            node = seed;
        // capture the DOM node if the string is an id
        } else if (isString(seed)) {
            if (seed && sheets[seed]) {
                return sheets[seed];
            }
            node = d.getElementById(seed.replace(/^#/,EMPTY));
        }

        // Check for the StyleSheet in the static registry
        if (node && sheets[Y.stamp(node)]) {
            return sheets[Y.stamp(node)];
        }
    }


    // Create a style node if necessary
    if (!node || !/^(?:style|link)$/i.test(node.nodeName)) {
        node = d.createElement('style');
        node.type = 'text/css';
    }

    if (isString(seed)) {
        // Create entire sheet from seed cssText
        if (seed.indexOf('{') != -1) {
            // Not a load-time fork because low run-time impact and IE fails
            // test for s.styleSheet at page load time (oddly)
            if (node.styleSheet) {
                node.styleSheet.cssText = seed;
            } else {
                node.appendChild(d.createTextNode(seed));
            }
        } else if (!name) {
            name = seed;
        }
    }

    // Make sure the node is attached to the appropriate head element
    if (!node.parentNode || node.parentNode.nodeName.toLowerCase() !== 'head') {
        head = (node.ownerDocument || d).getElementsByTagName('head')[0];
        // styleSheet isn't available on the style node in FF2 until appended
        // to the head element.  style nodes appended to body do not affect
        // change in Safari.
        head.appendChild(node);
    }

    // Begin setting up private aliases to the important moving parts
    // 1. The stylesheet object
    // IE stores StyleSheet under the "styleSheet" property
    // Safari doesn't populate sheet for xdomain link elements
    sheet = node.sheet || node.styleSheet;

    // 2. The style rules collection
    // IE stores the rules collection under the "rules" property
    _rules = sheet && ('cssRules' in sheet) ? 'cssRules' : 'rules';

    // 3. The method to remove a rule from the stylesheet
    // IE supports removeRule
    _deleteRule = ('deleteRule' in sheet) ?
        function (i) { sheet.deleteRule(i); } :
        function (i) { sheet.removeRule(i); };

    // 4. The method to add a new rule to the stylesheet
    // IE supports addRule with different signature
    _insertRule = ('insertRule' in sheet) ?
        function (sel,css,i) { sheet.insertRule(sel+' {'+css+'}',i); } :
        function (sel,css,i) { sheet.addRule(sel,css,i); };

    // 5. Initialize the cssRules map from the node
    // xdomain link nodes forbid access to the cssRules collection, so this
    // will throw an error.
    // TODO: research alternate stylesheet, @media
    for (i = sheet[_rules].length - 1; i >= 0; --i) {
        r   = sheet[_rules][i];
        sel = r.selectorText;

        if (cssRules[sel]) {
            cssRules[sel].style.cssText += ';' + r.style.cssText;
            _deleteRule(i);
        } else {
            cssRules[sel] = r;
        }
    }

    // Cache the instance by the generated Id
    StyleSheet.register(Y.stamp(node),this);

    // Register the instance by name if provided or defaulted from seed
    if (name) {
        StyleSheet.register(name,this);
    }

    // Public API
    Y.mix(this,{
        /**
         * Get the unique stamp for this StyleSheet instance
         *
         * @method getId
         * @return {Number} the static id
         */
        getId : function () { return Y.stamp(node); },

        /**
         * Enable all the rules in the sheet
         *
         * @method enable
         * @return {StyleSheet}
         * @chainable
         */
        enable : function () { sheet.disabled = false; return this; },

        /**
         * Disable all the rules in the sheet.  Rules may be changed while the
         * StyleSheet is disabled.
         *
         * @method disable
         * @return {StyleSheet}
         * @chainable
         */
        disable : function () { sheet.disabled = true; return this; },

        /**
         * Returns false if the StyleSheet is disabled.  Otherwise true.
         *
         * @method isEnabled
         * @return {Boolean}
         */
        isEnabled : function () { return !sheet.disabled; },

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
            var rule = cssRules[sel],
                multi = sel.split(/\s*,\s*/),i,
                idx;

            // IE's addRule doesn't support multiple comma delimited selectors
            if (multi.length > 1) {
                for (i = multi.length - 1; i >= 0; --i) {
                    this.set(multi[i], css);
                }
                return this;
            }

            // Some selector values can cause IE to hang
            if (!StyleSheet.isValidSelector(sel)) {
                return this;
            }

            // Opera throws an error if there's a syntax error in assigned
            // cssText. Avoid this using a worker style collection, then
            // assigning the resulting cssText.
            if (rule) {
                rule.style.cssText = StyleSheet.toCssText(css,rule.style.cssText);
            } else {
                idx = sheet[_rules].length;
                css = StyleSheet.toCssText(css);

                // IE throws an error when attempting to addRule(sel,'',n)
                // which would crop up if no, or only invalid values are used
                if (css) {
                    _insertRule(sel, css, idx);

                    // Safari replaces the rules collection, but maintains the
                    // rule instances in the new collection when rules are
                    // added/removed
                    cssRules[sel] = sheet[_rules][idx];
                }
            }
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
            var rule = cssRules[sel],
                multi = sel.split(/\s*,\s*/),
                remove = !css,
                rules, i;

            // IE's addRule doesn't support multiple comma delimited selectors
            // so rules are mapped internally by atomic selectors
            if (multi.length > 1) {
                for (i = multi.length - 1; i >= 0; --i) {
                    this.unset(multi[i], css);
                }
                return this;
            }

            if (rule) {
                if (!remove) {
                    css = Y.Array(css);

                    workerStyle.cssText = rule.style.cssText;
                    for (i = css.length - 1; i >= 0; --i) {
                        _unsetProperty(workerStyle,css[i]);
                    }

                    if (workerStyle.cssText) {
                        rule.style.cssText = workerStyle.cssText;
                    } else {
                        remove = true;
                    }
                }

                if (remove) { // remove the rule altogether
                    rules = sheet[_rules];
                    for (i = rules.length - 1; i >= 0; --i) {
                        if (rules[i] === rule) {
                            delete cssRules[sel];
                            _deleteRule(i);
                            break;
                        }
                    }
                }
            }
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
            var rule, css, selector;

            if (isString(sel)) {
                // IE's addRule doesn't support multiple comma delimited
                // selectors so rules are mapped internally by atomic selectors
                rule = cssRules[sel.split(/\s*,\s*/)[0]];

                return rule ? rule.style.cssText : null;
            } else {
                css = [];
                for (selector in cssRules) {
                    if (cssRules.hasOwnProperty(selector)) {
                        rule = cssRules[selector];
                        css.push(rule.selectorText+" {"+rule.style.cssText+"}");
                    }
                }
                return css.join("\n");
            }
        }
    });

}

_toCssText = function (css,base) {
    var f    = css.styleFloat || css.cssFloat || css[FLOAT],
        trim = Y.Lang.trim,
        prop;

    // A very difficult to repro/isolate IE 9 beta (and Platform Preview 7) bug
    // was reduced to this line throwing the error:
    // "Invalid this pointer used as target for method call"
    // It appears that the style collection is corrupted. The error is
    // catchable, so in a best effort to work around it, replace the
    // p and workerStyle and try the assignment again.
    try {
        workerStyle.cssText = base || EMPTY;
    } catch (e) {
        p = d.createElement('p');
        workerStyle = p.style;
        workerStyle.cssText = base || EMPTY;
    }

    if (f && !css[floatAttr]) {
        css = Y.merge(css);
        delete css.styleFloat; delete css.cssFloat; delete css[FLOAT];
        css[floatAttr] = f;
    }

    for (prop in css) {
        if (css.hasOwnProperty(prop)) {
            try {
                // IE throws Invalid Value errors and doesn't like whitespace
                // in values ala ' red' or 'red '
                workerStyle[prop] = trim(css[prop]);
            }
            catch (ex) {
            }
        }
    }
    return workerStyle.cssText;
};

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
            if (OPACITY in css) {
                css = Y.merge(css,{
                        filter: 'alpha(opacity='+(css.opacity*100)+')'
                      });
                delete css.opacity;
            }
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
        var valid = false;

        if (sel && isString(sel)) {

            if (!selectors.hasOwnProperty(sel)) {
                // TEST: there should be nothing but white-space left after
                // these destructive regexs
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

            valid = selectors[sel];
        }

        return valid;
    }
},true);

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
