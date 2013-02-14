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
_yuitest_coverage["build/imageloader/imageloader.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/imageloader/imageloader.js",
    code: []
};
_yuitest_coverage["build/imageloader/imageloader.js"].code=["YUI.add('imageloader', function (Y, NAME) {","","/**"," * The ImageLoader Utility is a framework to dynamically load images according to certain triggers,"," * enabling faster load times and a more responsive UI."," *"," * @module imageloader"," */","","","	/**","	 * A group for images. A group can have one time limit and a series of triggers. Thus the images belonging to this group must share these constraints.","	 * @class ImgLoadGroup","	 * @extends Base","	 * @constructor","	 */","	Y.ImgLoadGroup = function() {","		// call init first, because it sets up local vars for storing attribute-related info","		this._init();","		Y.ImgLoadGroup.superclass.constructor.apply(this, arguments);","	};","","	Y.ImgLoadGroup.NAME = 'imgLoadGroup';","","	Y.ImgLoadGroup.ATTRS = {","		","		/**","		 * Name for the group. Only used to identify the group in logging statements.","		 * @attribute name","		 * @type String","		 */","		name: {","			value: ''","		},","","		/**","		 * Time limit, in seconds, after which images are fetched regardless of trigger events.","		 * @attribute timeLimit","		 * @type Number","		 */","		timeLimit: {","			value: null","		},","","		/**","		 * Distance below the fold for which images are loaded. Images are not loaded until they are at most this distance away from (or above) the fold.","		 * This check is performed at page load (domready) and after any window scroll or window resize event (until all images are loaded).","		 * @attribute foldDistance","		 * @type Number","		 */","		foldDistance: {","			validator: Y.Lang.isNumber,","			setter: function(val) { this._setFoldTriggers(); return val; },","			lazyAdd: false","		},","","		/**","		 * Class name that will identify images belonging to the group. This class name will be removed from each element in order to fetch images.","		 * This class should have, in its CSS style definition, \"<code>background:none !important;</code>\".","		 * @attribute className","		 * @type String","		 */","		className: {","			value: null,","			setter: function(name) { this._className = name; return name; },","			lazyAdd: false","		}, ","        ","        /**","         * Determines how to act when className is used as the way to delay load images. The \"default\" action is to just","         * remove the class name. The \"enhanced\" action is to remove the class name and also set the src attribute if","         * the element is an img.","         * @attribute classNameAction","         * @type String","         */","        classNameAction: {","            value: \"default\"","        }","","	};","","	var groupProto = {","","		/**","		 * Initialize all private members needed for the group.","		 * @method _init","		 * @private","		 */","		_init: function() {","","			/**","			 * Collection of triggers for this group.","			 * Keeps track of each trigger's event handle, as returned from <code>Y.on</code>.","			 * @property _triggers","			 * @private","			 * @type Array","			 */","			this._triggers = [];","","			/**","			 * Collection of images (<code>Y.ImgLoadImgObj</code> objects) registered with this group, keyed by DOM id.","			 * @property _imgObjs","			 * @private","			 * @type Object","			 */","			this._imgObjs = {};","","			/**","			 * Timeout object to keep a handle on the time limit.","			 * @property _timeout","			 * @private","			 * @type Object","			 */","			this._timeout = null;","","			/**","			 * DOM elements having the class name that is associated with this group.","			 * Elements are stored during the <code>_foldCheck</code> function and reused later during any subsequent <code>_foldCheck</code> calls - gives a slight performance improvement when the page fold is repeatedly checked.","			 * @property _classImageEls","			 * @private","			 * @type Array","			 */","			this._classImageEls = null;","","			/**","			 * Keep the CSS class name in a member variable for ease and speed.","			 * @property _className","			 * @private","			 * @type String","			 */","			this._className = null;","","			/**","			 * Boolean tracking whether the window scroll and window resize triggers have been set if this is a fold group.","			 * @property _areFoldTriggersSet","			 * @private","			 * @type Boolean","			 */","			this._areFoldTriggersSet = false;","","			/**","			 * The maximum pixel height of the document that has been made visible.","			 * During fold checks, if the user scrolls up then there's no need to check for newly exposed images.","			 * @property _maxKnownHLimit","			 * @private","			 * @type Int","			 */","			this._maxKnownHLimit = 0;","","			// add a listener to domready that will start the time limit","			Y.on('domready', this._onloadTasks, this);","		},","","		/**","		 * Adds a trigger to the group. Arguments are passed to <code>Y.on</code>.","		 * @method addTrigger","		 * @chainable","		 * @param {Object} obj  The DOM object to attach the trigger event to","		 * @param {String} type  The event type","		 */","		addTrigger: function(obj, type) {","			if (! obj || ! type) {","				return this;","			}","","","			/* Need to wrap the fetch function. Event Util can't distinguish prototyped functions of different instantiations.","			 *   Leads to this scenario: groupA and groupZ both have window-scroll triggers. groupZ also has a 2-sec timeout (groupA has no timeout).","			 *   groupZ's timeout fires; we remove the triggers. The detach call finds the first window-scroll event with Y.ILG.p.fetch, which is groupA's. ","			 *   groupA's trigger is removed and never fires, leaving images unfetched.","			 */","			var wrappedFetch = function() {","				this.fetch();","			};","			this._triggers.push( Y.on(type, wrappedFetch, obj, this) );","","			return this;","		},","","		/**","		 * Adds a custom event trigger to the group.","		 * @method addCustomTrigger","		 * @chainable","		 * @param {String} name  The name of the event","		 * @param {Object} obj  The object on which to attach the event. <code>obj</code> is optional - by default the event is attached to the <code>Y</code> instance","		 */","		addCustomTrigger: function(name, obj) {","			if (! name) {","				return this;","			}","","","			// see comment in addTrigger()","			var wrappedFetch = function() {","				this.fetch();","			};","			if (Y.Lang.isUndefined(obj)) {","				this._triggers.push( Y.on(name, wrappedFetch, this) );","			}","			else {","				this._triggers.push( obj.on(name, wrappedFetch, this) );","			}","","			return this;","		},","","		/**","		 * Sets the window scroll and window resize triggers for any group that is fold-conditional (i.e., has a fold distance set).","		 * @method _setFoldTriggers","		 * @private","		 */","		_setFoldTriggers: function() {","			if (this._areFoldTriggersSet) {","				return;","			}","","","			var wrappedFoldCheck = function() {","				this._foldCheck();","			};","			this._triggers.push( Y.on('scroll', wrappedFoldCheck, window, this) );","			this._triggers.push( Y.on('resize', wrappedFoldCheck, window, this) );","			this._areFoldTriggersSet = true;","		},","","		/**","		 * Performs necessary setup at domready time.","		 * Initiates time limit for group; executes the fold check for the images.","		 * @method _onloadTasks","		 * @private","		 */","		_onloadTasks: function() {","			var timeLim = this.get('timeLimit');","			if (timeLim && timeLim > 0) {","				this._timeout = setTimeout(this._getFetchTimeout(), timeLim * 1000);","			}","","			if (! Y.Lang.isUndefined(this.get('foldDistance'))) {","				this._foldCheck();","			}","		},","","		/**","		 * Returns the group's <code>fetch</code> method, with the proper closure, for use with <code>setTimeout</code>.","		 * @method _getFetchTimeout","		 * @return {Function}  group's <code>fetch</code> method","		 * @private","		 */","		_getFetchTimeout: function() {","			var self = this;","			return function() { self.fetch(); };","		},","","		/**","		 * Registers an image with the group.","		 * Arguments are passed through to a <code>Y.ImgLoadImgObj</code> constructor; see that class' attribute documentation for detailed information. \"<code>domId</code>\" is a required attribute.","		 * @method registerImage","		 * @param {Object} *  A configuration object literal with attribute name/value pairs  (passed through to a <code>Y.ImgLoadImgObj</code> constructor)","		 * @return {Object}  <code>Y.ImgLoadImgObj</code> that was registered","		 */","		registerImage: function() {","			var domId = arguments[0].domId;","			if (! domId) {","				return null;","			}","","","			this._imgObjs[domId] = new Y.ImgLoadImgObj(arguments[0]);","			return this._imgObjs[domId];","		},","","		/**","		 * Displays the images in the group.","		 * This method is called when a trigger fires or the time limit expires; it shouldn't be called externally, but is not private in the rare event that it needs to be called immediately.","		 * @method fetch","		 */","		fetch: function() {","","			// done with the triggers","			this._clearTriggers();","","			// fetch whatever we need to by className","			this._fetchByClass();","","			// fetch registered images","			for (var id in this._imgObjs) {","				if (this._imgObjs.hasOwnProperty(id)) {","					this._imgObjs[id].fetch();","				}","			}","		},","","		/**","		 * Clears the timeout and all triggers associated with the group.","		 * @method _clearTriggers","		 * @private","		 */","		_clearTriggers: function() {","			clearTimeout(this._timeout);","			// detach all listeners","			for (var i=0, len = this._triggers.length; i < len; i++) {","				this._triggers[i].detach();","			}","		},","","		/**","		 * Checks the position of each image in the group. If any part of the image is within the specified distance (<code>foldDistance</code>) of the client viewport, the image is fetched immediately.","		 * @method _foldCheck","		 * @private","		 */","		_foldCheck: function() {","","			var allFetched = true,","			    viewReg = Y.DOM.viewportRegion(),","			    hLimit = viewReg.bottom + this.get('foldDistance'),","					id, imgFetched, els, i, len;","","			// unless we've uncovered new frontiers, there's no need to continue","			if (hLimit <= this._maxKnownHLimit) {","				return;","			}","			this._maxKnownHLimit = hLimit;","","			for (id in this._imgObjs) {","				if (this._imgObjs.hasOwnProperty(id)) {","					imgFetched = this._imgObjs[id].fetch(hLimit);","					allFetched = allFetched && imgFetched;","				}","			}","","			// and by class","			if (this._className) {","				if (this._classImageEls === null) {","					// get all the relevant elements and store them","					this._classImageEls = [];","					els = Y.all('.' + this._className);","					els.each( function(node) { this._classImageEls.push( { el: node, y: node.getY(), fetched: false } ); }, this);","				}","				els = this._classImageEls;","				for (i=0, len = els.length; i < len; i++) {","					if (els[i].fetched) {","						continue;","					}","					if (els[i].y && els[i].y <= hLimit) {","						//els[i].el.removeClass(this._className);","						this._updateNodeClassName(els[i].el);","                        els[i].fetched = true;","					}","					else {","						allFetched = false;","					}","				}","			}","			","			// if allFetched, remove listeners","			if (allFetched) {","				this._clearTriggers();","			}","		},","        ","        /**","         * Updates a given node, removing the ImageLoader class name. If the","         * node is an img and the classNameAction is \"enhanced\", then node","         * class name is removed and also the src attribute is set to the ","         * image URL as well as clearing the style background image.","         * @method _updateNodeClassName","         * @param node {Node} The node to act on.","         * @private","         */","        _updateNodeClassName: function(node){","            var url;","            ","            if (this.get(\"classNameAction\") == \"enhanced\"){","                ","                if (node.get(\"tagName\").toLowerCase() == \"img\"){","                    url = node.getStyle(\"backgroundImage\");","                    /url\\([\"']?(.*?)[\"']?\\)/.test(url);","                    url = RegExp.$1;","                    node.set(\"src\", url);","                    node.setStyle(\"backgroundImage\", \"\");","                }","            }","            ","            node.removeClass(this._className);        ","        },","","		/**","		 * Finds all elements in the DOM with the class name specified in the group. Removes the class from the element in order to let the style definitions trigger the image fetching.","		 * @method _fetchByClass","		 * @private","		 */","		_fetchByClass: function() {","			if (! this._className) {","				return;","			}","","","			Y.all('.' + this._className).each(Y.bind(this._updateNodeClassName, this));","		}","","	};","","","	Y.extend(Y.ImgLoadGroup, Y.Base, groupProto);","","","	//------------------------------------------------","","","	/**","	 * Image objects to be registered with the groups","	 * @class ImgLoadImgObj","	 * @extends Base","	 * @constructor","	 */","	Y.ImgLoadImgObj = function() {","		Y.ImgLoadImgObj.superclass.constructor.apply(this, arguments);","		this._init();","	};","		","	Y.ImgLoadImgObj.NAME = 'imgLoadImgObj';","","	Y.ImgLoadImgObj.ATTRS = {","		/**","		 * HTML DOM id of the image element.","		 * @attribute domId","		 * @type String","		 */","		domId: {","			value: null,","			writeOnce: true","		},","","		/**","		 * Background URL for the image.","		 * For an image whose URL is specified by \"<code>background-image</code>\" in the element's style.","		 * @attribute bgUrl","		 * @type String","		 */","		bgUrl: {","			value: null","		},","","		/**","		 * Source URL for the image.","		 * For an image whose URL is specified by a \"<code>src</code>\" attribute in the DOM element.","		 * @attribute srcUrl","		 * @type String","		 */","		srcUrl: {","			value: null","		},","","		/**","		 * Pixel width of the image. Will be set as a <code>width</code> attribute on the DOM element after the image is fetched.","		 * Defaults to the natural width of the image (no <code>width</code> attribute will be set).","		 * Usually only used with src images.","		 * @attribute width","		 * @type Int","		 */","		width: {","			value: null","		},","","		/**","		 * Pixel height of the image. Will be set as a <code>height</code> attribute on the DOM element after the image is fetched.","		 * Defaults to the natural height of the image (no <code>height</code> attribute will be set).","		 * Usually only used with src images.","		 * @attribute height","		 * @type Int","		 */","		height: {","			value: null","		},","","		/**","		 * Whether the image's <code>style.visibility</code> should be set to <code>visible</code> after the image is fetched.","		 * Used when setting images as <code>visibility:hidden</code> prior to image fetching.","		 * @attribute setVisible","		 * @type Boolean","		 */","		setVisible: {","			value: false","		},","","		/**","		 * Whether the image is a PNG.","		 * PNG images get special treatment in that the URL is specified through AlphaImageLoader for IE, versions 6 and earlier.","		 * Only used with background images.","		 * @attribute isPng","		 * @type Boolean","		 */","		isPng: {","			value: false","		},","","		/**","		 * AlphaImageLoader <code>sizingMethod</code> property to be set for the image.","		 * Only set if <code>isPng</code> value for this image is set to <code>true</code>.","		 * Defaults to <code>scale</code>.","		 * @attribute sizingMethod","		 * @type String","		 */","		sizingMethod: {","			value: 'scale'","		},","","		/**","		 * AlphaImageLoader <code>enabled</code> property to be set for the image.","		 * Only set if <code>isPng</code> value for this image is set to <code>true</code>.","		 * Defaults to <code>true</code>.","		 * @attribute enabled","		 * @type String","		 */","		enabled: {","			value: 'true'","		}","","	};","","	var imgProto = {","","		/**","		 * Initialize all private members needed for the group.","		 * @method _init","		 * @private","		 */","		_init: function() {","","			/**","			 * Whether this image has already been fetched.","			 * In the case of fold-conditional groups, images won't be fetched twice.","			 * @property _fetched","			 * @private","			 * @type Boolean","			 */","			this._fetched = false;","","			/**","			 * The Node object returned from <code>Y.one</code>, to avoid repeat calls to access the DOM.","			 * @property _imgEl","			 * @private","			 * @type Object","			 */","			this._imgEl = null;","","			/**","			 * The vertical position returned from <code>getY</code>, to avoid repeat calls to access the DOM.","			 * The Y position is checked only for images registered with fold-conditional groups. The position is checked first at page load (domready)","			 *   and this caching enhancement assumes that the image's vertical position won't change after that first check.","			 * @property _yPos","			 * @private","			 * @type Int","			 */","			this._yPos = null;","		},","","		/**","		 * Displays the image; puts the URL into the DOM.","		 * This method shouldn't be called externally, but is not private in the rare event that it needs to be called immediately.","		 * @method fetch","		 * @param {Int} withinY  The pixel distance from the top of the page, for which if the image lies within, it will be fetched. Undefined indicates that no check should be made, and the image should always be fetched","		 * @return {Boolean}  Whether the image has been fetched (either during this execution or previously)","		 */","		fetch: function(withinY) {","			if (this._fetched) {","				return true;","			}","","			var el = this._getImgEl(),","			    yPos;","			if (! el) {","				return false;","			}","","			if (withinY) {","				// need a distance check","				yPos = this._getYPos();","				if (! yPos || yPos > withinY) {","					return false;","				}","			}","","","			// apply url","			if (this.get('bgUrl') !== null) {","				// bg url","				if (this.get('isPng') && Y.UA.ie && Y.UA.ie <= 6) {","					// png for which to apply AlphaImageLoader","					el.setStyle('filter', 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\"' + this.get('bgUrl') + '\", sizingMethod=\"' + this.get('sizingMethod') + '\", enabled=\"' + this.get('enabled') + '\")');","				}","				else {","					// regular bg image","					el.setStyle('backgroundImage', \"url('\" + this.get('bgUrl') + \"')\");","				}","			}","			else if (this.get('srcUrl') !== null) {","				// regular src image","				el.setAttribute('src', this.get('srcUrl'));","			}","","			// apply attributes","			if (this.get('setVisible')) {","				el.setStyle('visibility', 'visible');","			}","			if (this.get('width')) {","				el.setAttribute('width', this.get('width'));","			}","			if (this.get('height')) {","				el.setAttribute('height', this.get('height'));","			}","","			this._fetched = true;","","			return true;","		},","","		/**","		 * Gets the object (as a <code>Y.Node</code>) of the DOM element indicated by \"<code>domId</code>\".","		 * @method _getImgEl","		 * @returns {Object} DOM element of the image as a <code>Y.Node</code> object","		 * @private","		 */","		_getImgEl: function() {","			if (this._imgEl === null) {","				this._imgEl = Y.one('#' + this.get('domId'));","			}","			return this._imgEl;","		},","","		/**","		 * Gets the Y position of the node in page coordinates.","		 * Expects that the page-coordinate position of the image won't change.","		 * @method _getYPos","		 * @returns {Object} The Y position of the image","		 * @private","		 */","		_getYPos: function() {","			if (this._yPos === null) {","				this._yPos = this._getImgEl().getY();","			}","			return this._yPos;","		}","","	};","","","	Y.extend(Y.ImgLoadImgObj, Y.Base, imgProto);","","","","","}, '3.7.3', {\"requires\": [\"base-base\", \"node-style\", \"node-screen\"]});"];
_yuitest_coverage["build/imageloader/imageloader.js"].lines = {"1":0,"17":0,"19":0,"20":0,"23":0,"25":0,"53":0,"65":0,"82":0,"98":0,"106":0,"114":0,"123":0,"131":0,"139":0,"148":0,"151":0,"162":0,"163":0,"172":0,"173":0,"175":0,"177":0,"188":0,"189":0,"194":0,"195":0,"197":0,"198":0,"201":0,"204":0,"213":0,"214":0,"218":0,"219":0,"221":0,"222":0,"223":0,"233":0,"234":0,"235":0,"238":0,"239":0,"250":0,"251":0,"262":0,"263":0,"264":0,"268":0,"269":0,"280":0,"283":0,"286":0,"287":0,"288":0,"299":0,"301":0,"302":0,"313":0,"319":0,"320":0,"322":0,"324":0,"325":0,"326":0,"327":0,"332":0,"333":0,"335":0,"336":0,"337":0,"339":0,"340":0,"341":0,"342":0,"344":0,"346":0,"347":0,"350":0,"356":0,"357":0,"371":0,"373":0,"375":0,"376":0,"377":0,"378":0,"379":0,"380":0,"384":0,"393":0,"394":0,"398":0,"404":0,"416":0,"417":0,"418":0,"421":0,"423":0,"521":0,"537":0,"545":0,"555":0,"566":0,"567":0,"570":0,"572":0,"573":0,"576":0,"578":0,"579":0,"580":0,"586":0,"588":0,"590":0,"594":0,"597":0,"599":0,"603":0,"604":0,"606":0,"607":0,"609":0,"610":0,"613":0,"615":0,"625":0,"626":0,"628":0,"639":0,"640":0,"642":0,"648":0};
_yuitest_coverage["build/imageloader/imageloader.js"].functions = {"ImgLoadGroup:17":0,"setter:53":0,"setter:65":0,"_init:89":0,"wrappedFetch:172":0,"addTrigger:161":0,"wrappedFetch:194":0,"addCustomTrigger:187":0,"wrappedFoldCheck:218":0,"_setFoldTriggers:212":0,"_onloadTasks:232":0,"(anonymous 2):251":0,"_getFetchTimeout:249":0,"registerImage:261":0,"fetch:277":0,"_clearTriggers:298":0,"(anonymous 3):337":0,"_foldCheck:311":0,"_updateNodeClassName:370":0,"_fetchByClass:392":0,"ImgLoadImgObj:416":0,"_init:528":0,"fetch:565":0,"_getImgEl:624":0,"_getYPos:638":0,"(anonymous 1):1":0};
_yuitest_coverage["build/imageloader/imageloader.js"].coveredLines = 133;
_yuitest_coverage["build/imageloader/imageloader.js"].coveredFunctions = 26;
_yuitest_coverline("build/imageloader/imageloader.js", 1);
YUI.add('imageloader', function (Y, NAME) {

/**
 * The ImageLoader Utility is a framework to dynamically load images according to certain triggers,
 * enabling faster load times and a more responsive UI.
 *
 * @module imageloader
 */


	/**
	 * A group for images. A group can have one time limit and a series of triggers. Thus the images belonging to this group must share these constraints.
	 * @class ImgLoadGroup
	 * @extends Base
	 * @constructor
	 */
	_yuitest_coverfunc("build/imageloader/imageloader.js", "(anonymous 1)", 1);
_yuitest_coverline("build/imageloader/imageloader.js", 17);
Y.ImgLoadGroup = function() {
		// call init first, because it sets up local vars for storing attribute-related info
		_yuitest_coverfunc("build/imageloader/imageloader.js", "ImgLoadGroup", 17);
_yuitest_coverline("build/imageloader/imageloader.js", 19);
this._init();
		_yuitest_coverline("build/imageloader/imageloader.js", 20);
Y.ImgLoadGroup.superclass.constructor.apply(this, arguments);
	};

	_yuitest_coverline("build/imageloader/imageloader.js", 23);
Y.ImgLoadGroup.NAME = 'imgLoadGroup';

	_yuitest_coverline("build/imageloader/imageloader.js", 25);
Y.ImgLoadGroup.ATTRS = {
		
		/**
		 * Name for the group. Only used to identify the group in logging statements.
		 * @attribute name
		 * @type String
		 */
		name: {
			value: ''
		},

		/**
		 * Time limit, in seconds, after which images are fetched regardless of trigger events.
		 * @attribute timeLimit
		 * @type Number
		 */
		timeLimit: {
			value: null
		},

		/**
		 * Distance below the fold for which images are loaded. Images are not loaded until they are at most this distance away from (or above) the fold.
		 * This check is performed at page load (domready) and after any window scroll or window resize event (until all images are loaded).
		 * @attribute foldDistance
		 * @type Number
		 */
		foldDistance: {
			validator: Y.Lang.isNumber,
			setter: function(val) { _yuitest_coverfunc("build/imageloader/imageloader.js", "setter", 53);
_yuitest_coverline("build/imageloader/imageloader.js", 53);
this._setFoldTriggers(); return val; },
			lazyAdd: false
		},

		/**
		 * Class name that will identify images belonging to the group. This class name will be removed from each element in order to fetch images.
		 * This class should have, in its CSS style definition, "<code>background:none !important;</code>".
		 * @attribute className
		 * @type String
		 */
		className: {
			value: null,
			setter: function(name) { _yuitest_coverfunc("build/imageloader/imageloader.js", "setter", 65);
_yuitest_coverline("build/imageloader/imageloader.js", 65);
this._className = name; return name; },
			lazyAdd: false
		}, 
        
        /**
         * Determines how to act when className is used as the way to delay load images. The "default" action is to just
         * remove the class name. The "enhanced" action is to remove the class name and also set the src attribute if
         * the element is an img.
         * @attribute classNameAction
         * @type String
         */
        classNameAction: {
            value: "default"
        }

	};

	_yuitest_coverline("build/imageloader/imageloader.js", 82);
var groupProto = {

		/**
		 * Initialize all private members needed for the group.
		 * @method _init
		 * @private
		 */
		_init: function() {

			/**
			 * Collection of triggers for this group.
			 * Keeps track of each trigger's event handle, as returned from <code>Y.on</code>.
			 * @property _triggers
			 * @private
			 * @type Array
			 */
			_yuitest_coverfunc("build/imageloader/imageloader.js", "_init", 89);
_yuitest_coverline("build/imageloader/imageloader.js", 98);
this._triggers = [];

			/**
			 * Collection of images (<code>Y.ImgLoadImgObj</code> objects) registered with this group, keyed by DOM id.
			 * @property _imgObjs
			 * @private
			 * @type Object
			 */
			_yuitest_coverline("build/imageloader/imageloader.js", 106);
this._imgObjs = {};

			/**
			 * Timeout object to keep a handle on the time limit.
			 * @property _timeout
			 * @private
			 * @type Object
			 */
			_yuitest_coverline("build/imageloader/imageloader.js", 114);
this._timeout = null;

			/**
			 * DOM elements having the class name that is associated with this group.
			 * Elements are stored during the <code>_foldCheck</code> function and reused later during any subsequent <code>_foldCheck</code> calls - gives a slight performance improvement when the page fold is repeatedly checked.
			 * @property _classImageEls
			 * @private
			 * @type Array
			 */
			_yuitest_coverline("build/imageloader/imageloader.js", 123);
this._classImageEls = null;

			/**
			 * Keep the CSS class name in a member variable for ease and speed.
			 * @property _className
			 * @private
			 * @type String
			 */
			_yuitest_coverline("build/imageloader/imageloader.js", 131);
this._className = null;

			/**
			 * Boolean tracking whether the window scroll and window resize triggers have been set if this is a fold group.
			 * @property _areFoldTriggersSet
			 * @private
			 * @type Boolean
			 */
			_yuitest_coverline("build/imageloader/imageloader.js", 139);
this._areFoldTriggersSet = false;

			/**
			 * The maximum pixel height of the document that has been made visible.
			 * During fold checks, if the user scrolls up then there's no need to check for newly exposed images.
			 * @property _maxKnownHLimit
			 * @private
			 * @type Int
			 */
			_yuitest_coverline("build/imageloader/imageloader.js", 148);
this._maxKnownHLimit = 0;

			// add a listener to domready that will start the time limit
			_yuitest_coverline("build/imageloader/imageloader.js", 151);
Y.on('domready', this._onloadTasks, this);
		},

		/**
		 * Adds a trigger to the group. Arguments are passed to <code>Y.on</code>.
		 * @method addTrigger
		 * @chainable
		 * @param {Object} obj  The DOM object to attach the trigger event to
		 * @param {String} type  The event type
		 */
		addTrigger: function(obj, type) {
			_yuitest_coverfunc("build/imageloader/imageloader.js", "addTrigger", 161);
_yuitest_coverline("build/imageloader/imageloader.js", 162);
if (! obj || ! type) {
				_yuitest_coverline("build/imageloader/imageloader.js", 163);
return this;
			}


			/* Need to wrap the fetch function. Event Util can't distinguish prototyped functions of different instantiations.
			 *   Leads to this scenario: groupA and groupZ both have window-scroll triggers. groupZ also has a 2-sec timeout (groupA has no timeout).
			 *   groupZ's timeout fires; we remove the triggers. The detach call finds the first window-scroll event with Y.ILG.p.fetch, which is groupA's. 
			 *   groupA's trigger is removed and never fires, leaving images unfetched.
			 */
			_yuitest_coverline("build/imageloader/imageloader.js", 172);
var wrappedFetch = function() {
				_yuitest_coverfunc("build/imageloader/imageloader.js", "wrappedFetch", 172);
_yuitest_coverline("build/imageloader/imageloader.js", 173);
this.fetch();
			};
			_yuitest_coverline("build/imageloader/imageloader.js", 175);
this._triggers.push( Y.on(type, wrappedFetch, obj, this) );

			_yuitest_coverline("build/imageloader/imageloader.js", 177);
return this;
		},

		/**
		 * Adds a custom event trigger to the group.
		 * @method addCustomTrigger
		 * @chainable
		 * @param {String} name  The name of the event
		 * @param {Object} obj  The object on which to attach the event. <code>obj</code> is optional - by default the event is attached to the <code>Y</code> instance
		 */
		addCustomTrigger: function(name, obj) {
			_yuitest_coverfunc("build/imageloader/imageloader.js", "addCustomTrigger", 187);
_yuitest_coverline("build/imageloader/imageloader.js", 188);
if (! name) {
				_yuitest_coverline("build/imageloader/imageloader.js", 189);
return this;
			}


			// see comment in addTrigger()
			_yuitest_coverline("build/imageloader/imageloader.js", 194);
var wrappedFetch = function() {
				_yuitest_coverfunc("build/imageloader/imageloader.js", "wrappedFetch", 194);
_yuitest_coverline("build/imageloader/imageloader.js", 195);
this.fetch();
			};
			_yuitest_coverline("build/imageloader/imageloader.js", 197);
if (Y.Lang.isUndefined(obj)) {
				_yuitest_coverline("build/imageloader/imageloader.js", 198);
this._triggers.push( Y.on(name, wrappedFetch, this) );
			}
			else {
				_yuitest_coverline("build/imageloader/imageloader.js", 201);
this._triggers.push( obj.on(name, wrappedFetch, this) );
			}

			_yuitest_coverline("build/imageloader/imageloader.js", 204);
return this;
		},

		/**
		 * Sets the window scroll and window resize triggers for any group that is fold-conditional (i.e., has a fold distance set).
		 * @method _setFoldTriggers
		 * @private
		 */
		_setFoldTriggers: function() {
			_yuitest_coverfunc("build/imageloader/imageloader.js", "_setFoldTriggers", 212);
_yuitest_coverline("build/imageloader/imageloader.js", 213);
if (this._areFoldTriggersSet) {
				_yuitest_coverline("build/imageloader/imageloader.js", 214);
return;
			}


			_yuitest_coverline("build/imageloader/imageloader.js", 218);
var wrappedFoldCheck = function() {
				_yuitest_coverfunc("build/imageloader/imageloader.js", "wrappedFoldCheck", 218);
_yuitest_coverline("build/imageloader/imageloader.js", 219);
this._foldCheck();
			};
			_yuitest_coverline("build/imageloader/imageloader.js", 221);
this._triggers.push( Y.on('scroll', wrappedFoldCheck, window, this) );
			_yuitest_coverline("build/imageloader/imageloader.js", 222);
this._triggers.push( Y.on('resize', wrappedFoldCheck, window, this) );
			_yuitest_coverline("build/imageloader/imageloader.js", 223);
this._areFoldTriggersSet = true;
		},

		/**
		 * Performs necessary setup at domready time.
		 * Initiates time limit for group; executes the fold check for the images.
		 * @method _onloadTasks
		 * @private
		 */
		_onloadTasks: function() {
			_yuitest_coverfunc("build/imageloader/imageloader.js", "_onloadTasks", 232);
_yuitest_coverline("build/imageloader/imageloader.js", 233);
var timeLim = this.get('timeLimit');
			_yuitest_coverline("build/imageloader/imageloader.js", 234);
if (timeLim && timeLim > 0) {
				_yuitest_coverline("build/imageloader/imageloader.js", 235);
this._timeout = setTimeout(this._getFetchTimeout(), timeLim * 1000);
			}

			_yuitest_coverline("build/imageloader/imageloader.js", 238);
if (! Y.Lang.isUndefined(this.get('foldDistance'))) {
				_yuitest_coverline("build/imageloader/imageloader.js", 239);
this._foldCheck();
			}
		},

		/**
		 * Returns the group's <code>fetch</code> method, with the proper closure, for use with <code>setTimeout</code>.
		 * @method _getFetchTimeout
		 * @return {Function}  group's <code>fetch</code> method
		 * @private
		 */
		_getFetchTimeout: function() {
			_yuitest_coverfunc("build/imageloader/imageloader.js", "_getFetchTimeout", 249);
_yuitest_coverline("build/imageloader/imageloader.js", 250);
var self = this;
			_yuitest_coverline("build/imageloader/imageloader.js", 251);
return function() { _yuitest_coverfunc("build/imageloader/imageloader.js", "(anonymous 2)", 251);
self.fetch(); };
		},

		/**
		 * Registers an image with the group.
		 * Arguments are passed through to a <code>Y.ImgLoadImgObj</code> constructor; see that class' attribute documentation for detailed information. "<code>domId</code>" is a required attribute.
		 * @method registerImage
		 * @param {Object} *  A configuration object literal with attribute name/value pairs  (passed through to a <code>Y.ImgLoadImgObj</code> constructor)
		 * @return {Object}  <code>Y.ImgLoadImgObj</code> that was registered
		 */
		registerImage: function() {
			_yuitest_coverfunc("build/imageloader/imageloader.js", "registerImage", 261);
_yuitest_coverline("build/imageloader/imageloader.js", 262);
var domId = arguments[0].domId;
			_yuitest_coverline("build/imageloader/imageloader.js", 263);
if (! domId) {
				_yuitest_coverline("build/imageloader/imageloader.js", 264);
return null;
			}


			_yuitest_coverline("build/imageloader/imageloader.js", 268);
this._imgObjs[domId] = new Y.ImgLoadImgObj(arguments[0]);
			_yuitest_coverline("build/imageloader/imageloader.js", 269);
return this._imgObjs[domId];
		},

		/**
		 * Displays the images in the group.
		 * This method is called when a trigger fires or the time limit expires; it shouldn't be called externally, but is not private in the rare event that it needs to be called immediately.
		 * @method fetch
		 */
		fetch: function() {

			// done with the triggers
			_yuitest_coverfunc("build/imageloader/imageloader.js", "fetch", 277);
_yuitest_coverline("build/imageloader/imageloader.js", 280);
this._clearTriggers();

			// fetch whatever we need to by className
			_yuitest_coverline("build/imageloader/imageloader.js", 283);
this._fetchByClass();

			// fetch registered images
			_yuitest_coverline("build/imageloader/imageloader.js", 286);
for (var id in this._imgObjs) {
				_yuitest_coverline("build/imageloader/imageloader.js", 287);
if (this._imgObjs.hasOwnProperty(id)) {
					_yuitest_coverline("build/imageloader/imageloader.js", 288);
this._imgObjs[id].fetch();
				}
			}
		},

		/**
		 * Clears the timeout and all triggers associated with the group.
		 * @method _clearTriggers
		 * @private
		 */
		_clearTriggers: function() {
			_yuitest_coverfunc("build/imageloader/imageloader.js", "_clearTriggers", 298);
_yuitest_coverline("build/imageloader/imageloader.js", 299);
clearTimeout(this._timeout);
			// detach all listeners
			_yuitest_coverline("build/imageloader/imageloader.js", 301);
for (var i=0, len = this._triggers.length; i < len; i++) {
				_yuitest_coverline("build/imageloader/imageloader.js", 302);
this._triggers[i].detach();
			}
		},

		/**
		 * Checks the position of each image in the group. If any part of the image is within the specified distance (<code>foldDistance</code>) of the client viewport, the image is fetched immediately.
		 * @method _foldCheck
		 * @private
		 */
		_foldCheck: function() {

			_yuitest_coverfunc("build/imageloader/imageloader.js", "_foldCheck", 311);
_yuitest_coverline("build/imageloader/imageloader.js", 313);
var allFetched = true,
			    viewReg = Y.DOM.viewportRegion(),
			    hLimit = viewReg.bottom + this.get('foldDistance'),
					id, imgFetched, els, i, len;

			// unless we've uncovered new frontiers, there's no need to continue
			_yuitest_coverline("build/imageloader/imageloader.js", 319);
if (hLimit <= this._maxKnownHLimit) {
				_yuitest_coverline("build/imageloader/imageloader.js", 320);
return;
			}
			_yuitest_coverline("build/imageloader/imageloader.js", 322);
this._maxKnownHLimit = hLimit;

			_yuitest_coverline("build/imageloader/imageloader.js", 324);
for (id in this._imgObjs) {
				_yuitest_coverline("build/imageloader/imageloader.js", 325);
if (this._imgObjs.hasOwnProperty(id)) {
					_yuitest_coverline("build/imageloader/imageloader.js", 326);
imgFetched = this._imgObjs[id].fetch(hLimit);
					_yuitest_coverline("build/imageloader/imageloader.js", 327);
allFetched = allFetched && imgFetched;
				}
			}

			// and by class
			_yuitest_coverline("build/imageloader/imageloader.js", 332);
if (this._className) {
				_yuitest_coverline("build/imageloader/imageloader.js", 333);
if (this._classImageEls === null) {
					// get all the relevant elements and store them
					_yuitest_coverline("build/imageloader/imageloader.js", 335);
this._classImageEls = [];
					_yuitest_coverline("build/imageloader/imageloader.js", 336);
els = Y.all('.' + this._className);
					_yuitest_coverline("build/imageloader/imageloader.js", 337);
els.each( function(node) { _yuitest_coverfunc("build/imageloader/imageloader.js", "(anonymous 3)", 337);
this._classImageEls.push( { el: node, y: node.getY(), fetched: false } ); }, this);
				}
				_yuitest_coverline("build/imageloader/imageloader.js", 339);
els = this._classImageEls;
				_yuitest_coverline("build/imageloader/imageloader.js", 340);
for (i=0, len = els.length; i < len; i++) {
					_yuitest_coverline("build/imageloader/imageloader.js", 341);
if (els[i].fetched) {
						_yuitest_coverline("build/imageloader/imageloader.js", 342);
continue;
					}
					_yuitest_coverline("build/imageloader/imageloader.js", 344);
if (els[i].y && els[i].y <= hLimit) {
						//els[i].el.removeClass(this._className);
						_yuitest_coverline("build/imageloader/imageloader.js", 346);
this._updateNodeClassName(els[i].el);
                        _yuitest_coverline("build/imageloader/imageloader.js", 347);
els[i].fetched = true;
					}
					else {
						_yuitest_coverline("build/imageloader/imageloader.js", 350);
allFetched = false;
					}
				}
			}
			
			// if allFetched, remove listeners
			_yuitest_coverline("build/imageloader/imageloader.js", 356);
if (allFetched) {
				_yuitest_coverline("build/imageloader/imageloader.js", 357);
this._clearTriggers();
			}
		},
        
        /**
         * Updates a given node, removing the ImageLoader class name. If the
         * node is an img and the classNameAction is "enhanced", then node
         * class name is removed and also the src attribute is set to the 
         * image URL as well as clearing the style background image.
         * @method _updateNodeClassName
         * @param node {Node} The node to act on.
         * @private
         */
        _updateNodeClassName: function(node){
            _yuitest_coverfunc("build/imageloader/imageloader.js", "_updateNodeClassName", 370);
_yuitest_coverline("build/imageloader/imageloader.js", 371);
var url;
            
            _yuitest_coverline("build/imageloader/imageloader.js", 373);
if (this.get("classNameAction") == "enhanced"){
                
                _yuitest_coverline("build/imageloader/imageloader.js", 375);
if (node.get("tagName").toLowerCase() == "img"){
                    _yuitest_coverline("build/imageloader/imageloader.js", 376);
url = node.getStyle("backgroundImage");
                    _yuitest_coverline("build/imageloader/imageloader.js", 377);
/url\(["']?(.*?)["']?\)/.test(url);
                    _yuitest_coverline("build/imageloader/imageloader.js", 378);
url = RegExp.$1;
                    _yuitest_coverline("build/imageloader/imageloader.js", 379);
node.set("src", url);
                    _yuitest_coverline("build/imageloader/imageloader.js", 380);
node.setStyle("backgroundImage", "");
                }
            }
            
            _yuitest_coverline("build/imageloader/imageloader.js", 384);
node.removeClass(this._className);        
        },

		/**
		 * Finds all elements in the DOM with the class name specified in the group. Removes the class from the element in order to let the style definitions trigger the image fetching.
		 * @method _fetchByClass
		 * @private
		 */
		_fetchByClass: function() {
			_yuitest_coverfunc("build/imageloader/imageloader.js", "_fetchByClass", 392);
_yuitest_coverline("build/imageloader/imageloader.js", 393);
if (! this._className) {
				_yuitest_coverline("build/imageloader/imageloader.js", 394);
return;
			}


			_yuitest_coverline("build/imageloader/imageloader.js", 398);
Y.all('.' + this._className).each(Y.bind(this._updateNodeClassName, this));
		}

	};


	_yuitest_coverline("build/imageloader/imageloader.js", 404);
Y.extend(Y.ImgLoadGroup, Y.Base, groupProto);


	//------------------------------------------------


	/**
	 * Image objects to be registered with the groups
	 * @class ImgLoadImgObj
	 * @extends Base
	 * @constructor
	 */
	_yuitest_coverline("build/imageloader/imageloader.js", 416);
Y.ImgLoadImgObj = function() {
		_yuitest_coverfunc("build/imageloader/imageloader.js", "ImgLoadImgObj", 416);
_yuitest_coverline("build/imageloader/imageloader.js", 417);
Y.ImgLoadImgObj.superclass.constructor.apply(this, arguments);
		_yuitest_coverline("build/imageloader/imageloader.js", 418);
this._init();
	};
		
	_yuitest_coverline("build/imageloader/imageloader.js", 421);
Y.ImgLoadImgObj.NAME = 'imgLoadImgObj';

	_yuitest_coverline("build/imageloader/imageloader.js", 423);
Y.ImgLoadImgObj.ATTRS = {
		/**
		 * HTML DOM id of the image element.
		 * @attribute domId
		 * @type String
		 */
		domId: {
			value: null,
			writeOnce: true
		},

		/**
		 * Background URL for the image.
		 * For an image whose URL is specified by "<code>background-image</code>" in the element's style.
		 * @attribute bgUrl
		 * @type String
		 */
		bgUrl: {
			value: null
		},

		/**
		 * Source URL for the image.
		 * For an image whose URL is specified by a "<code>src</code>" attribute in the DOM element.
		 * @attribute srcUrl
		 * @type String
		 */
		srcUrl: {
			value: null
		},

		/**
		 * Pixel width of the image. Will be set as a <code>width</code> attribute on the DOM element after the image is fetched.
		 * Defaults to the natural width of the image (no <code>width</code> attribute will be set).
		 * Usually only used with src images.
		 * @attribute width
		 * @type Int
		 */
		width: {
			value: null
		},

		/**
		 * Pixel height of the image. Will be set as a <code>height</code> attribute on the DOM element after the image is fetched.
		 * Defaults to the natural height of the image (no <code>height</code> attribute will be set).
		 * Usually only used with src images.
		 * @attribute height
		 * @type Int
		 */
		height: {
			value: null
		},

		/**
		 * Whether the image's <code>style.visibility</code> should be set to <code>visible</code> after the image is fetched.
		 * Used when setting images as <code>visibility:hidden</code> prior to image fetching.
		 * @attribute setVisible
		 * @type Boolean
		 */
		setVisible: {
			value: false
		},

		/**
		 * Whether the image is a PNG.
		 * PNG images get special treatment in that the URL is specified through AlphaImageLoader for IE, versions 6 and earlier.
		 * Only used with background images.
		 * @attribute isPng
		 * @type Boolean
		 */
		isPng: {
			value: false
		},

		/**
		 * AlphaImageLoader <code>sizingMethod</code> property to be set for the image.
		 * Only set if <code>isPng</code> value for this image is set to <code>true</code>.
		 * Defaults to <code>scale</code>.
		 * @attribute sizingMethod
		 * @type String
		 */
		sizingMethod: {
			value: 'scale'
		},

		/**
		 * AlphaImageLoader <code>enabled</code> property to be set for the image.
		 * Only set if <code>isPng</code> value for this image is set to <code>true</code>.
		 * Defaults to <code>true</code>.
		 * @attribute enabled
		 * @type String
		 */
		enabled: {
			value: 'true'
		}

	};

	_yuitest_coverline("build/imageloader/imageloader.js", 521);
var imgProto = {

		/**
		 * Initialize all private members needed for the group.
		 * @method _init
		 * @private
		 */
		_init: function() {

			/**
			 * Whether this image has already been fetched.
			 * In the case of fold-conditional groups, images won't be fetched twice.
			 * @property _fetched
			 * @private
			 * @type Boolean
			 */
			_yuitest_coverfunc("build/imageloader/imageloader.js", "_init", 528);
_yuitest_coverline("build/imageloader/imageloader.js", 537);
this._fetched = false;

			/**
			 * The Node object returned from <code>Y.one</code>, to avoid repeat calls to access the DOM.
			 * @property _imgEl
			 * @private
			 * @type Object
			 */
			_yuitest_coverline("build/imageloader/imageloader.js", 545);
this._imgEl = null;

			/**
			 * The vertical position returned from <code>getY</code>, to avoid repeat calls to access the DOM.
			 * The Y position is checked only for images registered with fold-conditional groups. The position is checked first at page load (domready)
			 *   and this caching enhancement assumes that the image's vertical position won't change after that first check.
			 * @property _yPos
			 * @private
			 * @type Int
			 */
			_yuitest_coverline("build/imageloader/imageloader.js", 555);
this._yPos = null;
		},

		/**
		 * Displays the image; puts the URL into the DOM.
		 * This method shouldn't be called externally, but is not private in the rare event that it needs to be called immediately.
		 * @method fetch
		 * @param {Int} withinY  The pixel distance from the top of the page, for which if the image lies within, it will be fetched. Undefined indicates that no check should be made, and the image should always be fetched
		 * @return {Boolean}  Whether the image has been fetched (either during this execution or previously)
		 */
		fetch: function(withinY) {
			_yuitest_coverfunc("build/imageloader/imageloader.js", "fetch", 565);
_yuitest_coverline("build/imageloader/imageloader.js", 566);
if (this._fetched) {
				_yuitest_coverline("build/imageloader/imageloader.js", 567);
return true;
			}

			_yuitest_coverline("build/imageloader/imageloader.js", 570);
var el = this._getImgEl(),
			    yPos;
			_yuitest_coverline("build/imageloader/imageloader.js", 572);
if (! el) {
				_yuitest_coverline("build/imageloader/imageloader.js", 573);
return false;
			}

			_yuitest_coverline("build/imageloader/imageloader.js", 576);
if (withinY) {
				// need a distance check
				_yuitest_coverline("build/imageloader/imageloader.js", 578);
yPos = this._getYPos();
				_yuitest_coverline("build/imageloader/imageloader.js", 579);
if (! yPos || yPos > withinY) {
					_yuitest_coverline("build/imageloader/imageloader.js", 580);
return false;
				}
			}


			// apply url
			_yuitest_coverline("build/imageloader/imageloader.js", 586);
if (this.get('bgUrl') !== null) {
				// bg url
				_yuitest_coverline("build/imageloader/imageloader.js", 588);
if (this.get('isPng') && Y.UA.ie && Y.UA.ie <= 6) {
					// png for which to apply AlphaImageLoader
					_yuitest_coverline("build/imageloader/imageloader.js", 590);
el.setStyle('filter', 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + this.get('bgUrl') + '", sizingMethod="' + this.get('sizingMethod') + '", enabled="' + this.get('enabled') + '")');
				}
				else {
					// regular bg image
					_yuitest_coverline("build/imageloader/imageloader.js", 594);
el.setStyle('backgroundImage', "url('" + this.get('bgUrl') + "')");
				}
			}
			else {_yuitest_coverline("build/imageloader/imageloader.js", 597);
if (this.get('srcUrl') !== null) {
				// regular src image
				_yuitest_coverline("build/imageloader/imageloader.js", 599);
el.setAttribute('src', this.get('srcUrl'));
			}}

			// apply attributes
			_yuitest_coverline("build/imageloader/imageloader.js", 603);
if (this.get('setVisible')) {
				_yuitest_coverline("build/imageloader/imageloader.js", 604);
el.setStyle('visibility', 'visible');
			}
			_yuitest_coverline("build/imageloader/imageloader.js", 606);
if (this.get('width')) {
				_yuitest_coverline("build/imageloader/imageloader.js", 607);
el.setAttribute('width', this.get('width'));
			}
			_yuitest_coverline("build/imageloader/imageloader.js", 609);
if (this.get('height')) {
				_yuitest_coverline("build/imageloader/imageloader.js", 610);
el.setAttribute('height', this.get('height'));
			}

			_yuitest_coverline("build/imageloader/imageloader.js", 613);
this._fetched = true;

			_yuitest_coverline("build/imageloader/imageloader.js", 615);
return true;
		},

		/**
		 * Gets the object (as a <code>Y.Node</code>) of the DOM element indicated by "<code>domId</code>".
		 * @method _getImgEl
		 * @returns {Object} DOM element of the image as a <code>Y.Node</code> object
		 * @private
		 */
		_getImgEl: function() {
			_yuitest_coverfunc("build/imageloader/imageloader.js", "_getImgEl", 624);
_yuitest_coverline("build/imageloader/imageloader.js", 625);
if (this._imgEl === null) {
				_yuitest_coverline("build/imageloader/imageloader.js", 626);
this._imgEl = Y.one('#' + this.get('domId'));
			}
			_yuitest_coverline("build/imageloader/imageloader.js", 628);
return this._imgEl;
		},

		/**
		 * Gets the Y position of the node in page coordinates.
		 * Expects that the page-coordinate position of the image won't change.
		 * @method _getYPos
		 * @returns {Object} The Y position of the image
		 * @private
		 */
		_getYPos: function() {
			_yuitest_coverfunc("build/imageloader/imageloader.js", "_getYPos", 638);
_yuitest_coverline("build/imageloader/imageloader.js", 639);
if (this._yPos === null) {
				_yuitest_coverline("build/imageloader/imageloader.js", 640);
this._yPos = this._getImgEl().getY();
			}
			_yuitest_coverline("build/imageloader/imageloader.js", 642);
return this._yPos;
		}

	};


	_yuitest_coverline("build/imageloader/imageloader.js", 648);
Y.extend(Y.ImgLoadImgObj, Y.Base, imgProto);




}, '3.7.3', {"requires": ["base-base", "node-style", "node-screen"]});
