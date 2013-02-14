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
_yuitest_coverage["build/node-screen/node-screen.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/node-screen/node-screen.js",
    code: []
};
_yuitest_coverage["build/node-screen/node-screen.js"].code=["YUI.add('node-screen', function (Y, NAME) {","","/**"," * Extended Node interface for managing regions and screen positioning."," * Adds support for positioning elements and normalizes window size and scroll detection. "," * @module node"," * @submodule node-screen"," */","","// these are all \"safe\" returns, no wrapping required","Y.each([","    /**","     * Returns the inner width of the viewport (exludes scrollbar). ","     * @config winWidth","     * @for Node","     * @type {Int}","     */","    'winWidth',","","    /**","     * Returns the inner height of the viewport (exludes scrollbar). ","     * @config winHeight","     * @type {Int}","     */","    'winHeight',","","    /**","     * Document width ","     * @config docWidth","     * @type {Int}","     */","    'docWidth',","","    /**","     * Document height ","     * @config docHeight","     * @type {Int}","     */","    'docHeight',","","    /**","     * Pixel distance the page has been scrolled horizontally ","     * @config docScrollX","     * @type {Int}","     */","    'docScrollX',","","    /**","     * Pixel distance the page has been scrolled vertically ","     * @config docScrollY","     * @type {Int}","     */","    'docScrollY'","    ],","    function(name) {","        Y.Node.ATTRS[name] = {","            getter: function() {","                var args = Array.prototype.slice.call(arguments);","                args.unshift(Y.Node.getDOMNode(this));","","                return Y.DOM[name].apply(this, args);","            }","        };","    }",");","","Y.Node.ATTRS.scrollLeft = {","    getter: function() {","        var node = Y.Node.getDOMNode(this);","        return ('scrollLeft' in node) ? node.scrollLeft : Y.DOM.docScrollX(node);","    },","","    setter: function(val) {","        var node = Y.Node.getDOMNode(this);","        if (node) {","            if ('scrollLeft' in node) {","                node.scrollLeft = val;","            } else if (node.document || node.nodeType === 9) {","                Y.DOM._getWin(node).scrollTo(val, Y.DOM.docScrollY(node)); // scroll window if win or doc","            }","        } else {","        }","    }","};","","Y.Node.ATTRS.scrollTop = {","    getter: function() {","        var node = Y.Node.getDOMNode(this);","        return ('scrollTop' in node) ? node.scrollTop : Y.DOM.docScrollY(node);","    },","","    setter: function(val) {","        var node = Y.Node.getDOMNode(this);","        if (node) {","            if ('scrollTop' in node) {","                node.scrollTop = val;","            } else if (node.document || node.nodeType === 9) {","                Y.DOM._getWin(node).scrollTo(Y.DOM.docScrollX(node), val); // scroll window if win or doc","            }","        } else {","        }","    }","};","","Y.Node.importMethod(Y.DOM, [","/**"," * Gets the current position of the node in page coordinates. "," * @method getXY"," * @for Node"," * @return {Array} The XY position of the node","*/","    'getXY',","","/**"," * Set the position of the node in page coordinates, regardless of how the node is positioned."," * @method setXY"," * @param {Array} xy Contains X & Y values for new position (coordinates are page-based)"," * @chainable"," */","    'setXY',","","/**"," * Gets the current position of the node in page coordinates. "," * @method getX"," * @return {Int} The X position of the node","*/","    'getX',","","/**"," * Set the position of the node in page coordinates, regardless of how the node is positioned."," * @method setX"," * @param {Int} x X value for new position (coordinates are page-based)"," * @chainable"," */","    'setX',","","/**"," * Gets the current position of the node in page coordinates. "," * @method getY"," * @return {Int} The Y position of the node","*/","    'getY',","","/**"," * Set the position of the node in page coordinates, regardless of how the node is positioned."," * @method setY"," * @param {Int} y Y value for new position (coordinates are page-based)"," * @chainable"," */","    'setY',","","/**"," * Swaps the XY position of this node with another node. "," * @method swapXY"," * @param {Node | HTMLElement} otherNode The node to swap with."," * @chainable"," */","    'swapXY'","]);","","/**"," * @module node"," * @submodule node-screen"," */","","/**"," * Returns a region object for the node"," * @config region"," * @for Node"," * @type Node"," */","Y.Node.ATTRS.region = {","    getter: function() {","        var node = this.getDOMNode(),","            region;","","        if (node && !node.tagName) {","            if (node.nodeType === 9) { // document","                node = node.documentElement;","            }","        }","        if (Y.DOM.isWindow(node)) {","            region = Y.DOM.viewportRegion(node);","        } else {","            region = Y.DOM.region(node);","        }","        return region;","    }","};","","/**"," * Returns a region object for the node's viewport"," * @config viewportRegion"," * @type Node"," */","Y.Node.ATTRS.viewportRegion = {","    getter: function() {","        return Y.DOM.viewportRegion(Y.Node.getDOMNode(this));","    }","};","","Y.Node.importMethod(Y.DOM, 'inViewportRegion');","","// these need special treatment to extract 2nd node arg","/**"," * Compares the intersection of the node with another node or region"," * @method intersect"," * @for Node"," * @param {Node|Object} node2 The node or region to compare with."," * @param {Object} altRegion An alternate region to use (rather than this node's)."," * @return {Object} An object representing the intersection of the regions."," */","Y.Node.prototype.intersect = function(node2, altRegion) {","    var node1 = Y.Node.getDOMNode(this);","    if (Y.instanceOf(node2, Y.Node)) { // might be a region object","        node2 = Y.Node.getDOMNode(node2);","    }","    return Y.DOM.intersect(node1, node2, altRegion);","};","","/**"," * Determines whether or not the node is within the giving region."," * @method inRegion"," * @param {Node|Object} node2 The node or region to compare with."," * @param {Boolean} all Whether or not all of the node must be in the region."," * @param {Object} altRegion An alternate region to use (rather than this node's)."," * @return {Object} An object representing the intersection of the regions."," */","Y.Node.prototype.inRegion = function(node2, all, altRegion) {","    var node1 = Y.Node.getDOMNode(this);","    if (Y.instanceOf(node2, Y.Node)) { // might be a region object","        node2 = Y.Node.getDOMNode(node2);","    }","    return Y.DOM.inRegion(node1, node2, all, altRegion);","};","","","}, '3.7.3', {\"requires\": [\"dom-screen\", \"node-base\"]});"];
_yuitest_coverage["build/node-screen/node-screen.js"].lines = {"1":0,"11":0,"56":0,"58":0,"59":0,"61":0,"67":0,"69":0,"70":0,"74":0,"75":0,"76":0,"77":0,"78":0,"79":0,"86":0,"88":0,"89":0,"93":0,"94":0,"95":0,"96":0,"97":0,"98":0,"105":0,"172":0,"174":0,"177":0,"178":0,"179":0,"182":0,"183":0,"185":0,"187":0,"196":0,"198":0,"202":0,"213":0,"214":0,"215":0,"216":0,"218":0,"229":0,"230":0,"231":0,"232":0,"234":0};
_yuitest_coverage["build/node-screen/node-screen.js"].functions = {"getter:57":0,"(anonymous 2):55":0,"getter:68":0,"setter:73":0,"getter:87":0,"setter:92":0,"getter:173":0,"getter:197":0,"intersect:213":0,"inRegion:229":0,"(anonymous 1):1":0};
_yuitest_coverage["build/node-screen/node-screen.js"].coveredLines = 47;
_yuitest_coverage["build/node-screen/node-screen.js"].coveredFunctions = 11;
_yuitest_coverline("build/node-screen/node-screen.js", 1);
YUI.add('node-screen', function (Y, NAME) {

/**
 * Extended Node interface for managing regions and screen positioning.
 * Adds support for positioning elements and normalizes window size and scroll detection. 
 * @module node
 * @submodule node-screen
 */

// these are all "safe" returns, no wrapping required
_yuitest_coverfunc("build/node-screen/node-screen.js", "(anonymous 1)", 1);
_yuitest_coverline("build/node-screen/node-screen.js", 11);
Y.each([
    /**
     * Returns the inner width of the viewport (exludes scrollbar). 
     * @config winWidth
     * @for Node
     * @type {Int}
     */
    'winWidth',

    /**
     * Returns the inner height of the viewport (exludes scrollbar). 
     * @config winHeight
     * @type {Int}
     */
    'winHeight',

    /**
     * Document width 
     * @config docWidth
     * @type {Int}
     */
    'docWidth',

    /**
     * Document height 
     * @config docHeight
     * @type {Int}
     */
    'docHeight',

    /**
     * Pixel distance the page has been scrolled horizontally 
     * @config docScrollX
     * @type {Int}
     */
    'docScrollX',

    /**
     * Pixel distance the page has been scrolled vertically 
     * @config docScrollY
     * @type {Int}
     */
    'docScrollY'
    ],
    function(name) {
        _yuitest_coverfunc("build/node-screen/node-screen.js", "(anonymous 2)", 55);
_yuitest_coverline("build/node-screen/node-screen.js", 56);
Y.Node.ATTRS[name] = {
            getter: function() {
                _yuitest_coverfunc("build/node-screen/node-screen.js", "getter", 57);
_yuitest_coverline("build/node-screen/node-screen.js", 58);
var args = Array.prototype.slice.call(arguments);
                _yuitest_coverline("build/node-screen/node-screen.js", 59);
args.unshift(Y.Node.getDOMNode(this));

                _yuitest_coverline("build/node-screen/node-screen.js", 61);
return Y.DOM[name].apply(this, args);
            }
        };
    }
);

_yuitest_coverline("build/node-screen/node-screen.js", 67);
Y.Node.ATTRS.scrollLeft = {
    getter: function() {
        _yuitest_coverfunc("build/node-screen/node-screen.js", "getter", 68);
_yuitest_coverline("build/node-screen/node-screen.js", 69);
var node = Y.Node.getDOMNode(this);
        _yuitest_coverline("build/node-screen/node-screen.js", 70);
return ('scrollLeft' in node) ? node.scrollLeft : Y.DOM.docScrollX(node);
    },

    setter: function(val) {
        _yuitest_coverfunc("build/node-screen/node-screen.js", "setter", 73);
_yuitest_coverline("build/node-screen/node-screen.js", 74);
var node = Y.Node.getDOMNode(this);
        _yuitest_coverline("build/node-screen/node-screen.js", 75);
if (node) {
            _yuitest_coverline("build/node-screen/node-screen.js", 76);
if ('scrollLeft' in node) {
                _yuitest_coverline("build/node-screen/node-screen.js", 77);
node.scrollLeft = val;
            } else {_yuitest_coverline("build/node-screen/node-screen.js", 78);
if (node.document || node.nodeType === 9) {
                _yuitest_coverline("build/node-screen/node-screen.js", 79);
Y.DOM._getWin(node).scrollTo(val, Y.DOM.docScrollY(node)); // scroll window if win or doc
            }}
        } else {
        }
    }
};

_yuitest_coverline("build/node-screen/node-screen.js", 86);
Y.Node.ATTRS.scrollTop = {
    getter: function() {
        _yuitest_coverfunc("build/node-screen/node-screen.js", "getter", 87);
_yuitest_coverline("build/node-screen/node-screen.js", 88);
var node = Y.Node.getDOMNode(this);
        _yuitest_coverline("build/node-screen/node-screen.js", 89);
return ('scrollTop' in node) ? node.scrollTop : Y.DOM.docScrollY(node);
    },

    setter: function(val) {
        _yuitest_coverfunc("build/node-screen/node-screen.js", "setter", 92);
_yuitest_coverline("build/node-screen/node-screen.js", 93);
var node = Y.Node.getDOMNode(this);
        _yuitest_coverline("build/node-screen/node-screen.js", 94);
if (node) {
            _yuitest_coverline("build/node-screen/node-screen.js", 95);
if ('scrollTop' in node) {
                _yuitest_coverline("build/node-screen/node-screen.js", 96);
node.scrollTop = val;
            } else {_yuitest_coverline("build/node-screen/node-screen.js", 97);
if (node.document || node.nodeType === 9) {
                _yuitest_coverline("build/node-screen/node-screen.js", 98);
Y.DOM._getWin(node).scrollTo(Y.DOM.docScrollX(node), val); // scroll window if win or doc
            }}
        } else {
        }
    }
};

_yuitest_coverline("build/node-screen/node-screen.js", 105);
Y.Node.importMethod(Y.DOM, [
/**
 * Gets the current position of the node in page coordinates. 
 * @method getXY
 * @for Node
 * @return {Array} The XY position of the node
*/
    'getXY',

/**
 * Set the position of the node in page coordinates, regardless of how the node is positioned.
 * @method setXY
 * @param {Array} xy Contains X & Y values for new position (coordinates are page-based)
 * @chainable
 */
    'setXY',

/**
 * Gets the current position of the node in page coordinates. 
 * @method getX
 * @return {Int} The X position of the node
*/
    'getX',

/**
 * Set the position of the node in page coordinates, regardless of how the node is positioned.
 * @method setX
 * @param {Int} x X value for new position (coordinates are page-based)
 * @chainable
 */
    'setX',

/**
 * Gets the current position of the node in page coordinates. 
 * @method getY
 * @return {Int} The Y position of the node
*/
    'getY',

/**
 * Set the position of the node in page coordinates, regardless of how the node is positioned.
 * @method setY
 * @param {Int} y Y value for new position (coordinates are page-based)
 * @chainable
 */
    'setY',

/**
 * Swaps the XY position of this node with another node. 
 * @method swapXY
 * @param {Node | HTMLElement} otherNode The node to swap with.
 * @chainable
 */
    'swapXY'
]);

/**
 * @module node
 * @submodule node-screen
 */

/**
 * Returns a region object for the node
 * @config region
 * @for Node
 * @type Node
 */
_yuitest_coverline("build/node-screen/node-screen.js", 172);
Y.Node.ATTRS.region = {
    getter: function() {
        _yuitest_coverfunc("build/node-screen/node-screen.js", "getter", 173);
_yuitest_coverline("build/node-screen/node-screen.js", 174);
var node = this.getDOMNode(),
            region;

        _yuitest_coverline("build/node-screen/node-screen.js", 177);
if (node && !node.tagName) {
            _yuitest_coverline("build/node-screen/node-screen.js", 178);
if (node.nodeType === 9) { // document
                _yuitest_coverline("build/node-screen/node-screen.js", 179);
node = node.documentElement;
            }
        }
        _yuitest_coverline("build/node-screen/node-screen.js", 182);
if (Y.DOM.isWindow(node)) {
            _yuitest_coverline("build/node-screen/node-screen.js", 183);
region = Y.DOM.viewportRegion(node);
        } else {
            _yuitest_coverline("build/node-screen/node-screen.js", 185);
region = Y.DOM.region(node);
        }
        _yuitest_coverline("build/node-screen/node-screen.js", 187);
return region;
    }
};

/**
 * Returns a region object for the node's viewport
 * @config viewportRegion
 * @type Node
 */
_yuitest_coverline("build/node-screen/node-screen.js", 196);
Y.Node.ATTRS.viewportRegion = {
    getter: function() {
        _yuitest_coverfunc("build/node-screen/node-screen.js", "getter", 197);
_yuitest_coverline("build/node-screen/node-screen.js", 198);
return Y.DOM.viewportRegion(Y.Node.getDOMNode(this));
    }
};

_yuitest_coverline("build/node-screen/node-screen.js", 202);
Y.Node.importMethod(Y.DOM, 'inViewportRegion');

// these need special treatment to extract 2nd node arg
/**
 * Compares the intersection of the node with another node or region
 * @method intersect
 * @for Node
 * @param {Node|Object} node2 The node or region to compare with.
 * @param {Object} altRegion An alternate region to use (rather than this node's).
 * @return {Object} An object representing the intersection of the regions.
 */
_yuitest_coverline("build/node-screen/node-screen.js", 213);
Y.Node.prototype.intersect = function(node2, altRegion) {
    _yuitest_coverfunc("build/node-screen/node-screen.js", "intersect", 213);
_yuitest_coverline("build/node-screen/node-screen.js", 214);
var node1 = Y.Node.getDOMNode(this);
    _yuitest_coverline("build/node-screen/node-screen.js", 215);
if (Y.instanceOf(node2, Y.Node)) { // might be a region object
        _yuitest_coverline("build/node-screen/node-screen.js", 216);
node2 = Y.Node.getDOMNode(node2);
    }
    _yuitest_coverline("build/node-screen/node-screen.js", 218);
return Y.DOM.intersect(node1, node2, altRegion);
};

/**
 * Determines whether or not the node is within the giving region.
 * @method inRegion
 * @param {Node|Object} node2 The node or region to compare with.
 * @param {Boolean} all Whether or not all of the node must be in the region.
 * @param {Object} altRegion An alternate region to use (rather than this node's).
 * @return {Object} An object representing the intersection of the regions.
 */
_yuitest_coverline("build/node-screen/node-screen.js", 229);
Y.Node.prototype.inRegion = function(node2, all, altRegion) {
    _yuitest_coverfunc("build/node-screen/node-screen.js", "inRegion", 229);
_yuitest_coverline("build/node-screen/node-screen.js", 230);
var node1 = Y.Node.getDOMNode(this);
    _yuitest_coverline("build/node-screen/node-screen.js", 231);
if (Y.instanceOf(node2, Y.Node)) { // might be a region object
        _yuitest_coverline("build/node-screen/node-screen.js", 232);
node2 = Y.Node.getDOMNode(node2);
    }
    _yuitest_coverline("build/node-screen/node-screen.js", 234);
return Y.DOM.inRegion(node1, node2, all, altRegion);
};


}, '3.7.3', {"requires": ["dom-screen", "node-base"]});
