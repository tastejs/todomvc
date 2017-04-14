/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
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
	Y.ImgLoadGroup = function() {
		// call init first, because it sets up local vars for storing attribute-related info
		this._init();
		Y.ImgLoadGroup.superclass.constructor.apply(this, arguments);
	};

	Y.ImgLoadGroup.NAME = 'imgLoadGroup';

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
			setter: function(val) { this._setFoldTriggers(); return val; },
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
			setter: function(name) { this._className = name; return name; },
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
			this._triggers = [];

			/**
			 * Collection of images (<code>Y.ImgLoadImgObj</code> objects) registered with this group, keyed by DOM id.
			 * @property _imgObjs
			 * @private
			 * @type Object
			 */
			this._imgObjs = {};

			/**
			 * Timeout object to keep a handle on the time limit.
			 * @property _timeout
			 * @private
			 * @type Object
			 */
			this._timeout = null;

			/**
			 * DOM elements having the class name that is associated with this group.
			 * Elements are stored during the <code>_foldCheck</code> function and reused later during any subsequent <code>_foldCheck</code> calls - gives a slight performance improvement when the page fold is repeatedly checked.
			 * @property _classImageEls
			 * @private
			 * @type Array
			 */
			this._classImageEls = null;

			/**
			 * Keep the CSS class name in a member variable for ease and speed.
			 * @property _className
			 * @private
			 * @type String
			 */
			this._className = null;

			/**
			 * Boolean tracking whether the window scroll and window resize triggers have been set if this is a fold group.
			 * @property _areFoldTriggersSet
			 * @private
			 * @type Boolean
			 */
			this._areFoldTriggersSet = false;

			/**
			 * The maximum pixel height of the document that has been made visible.
			 * During fold checks, if the user scrolls up then there's no need to check for newly exposed images.
			 * @property _maxKnownHLimit
			 * @private
			 * @type Int
			 */
			this._maxKnownHLimit = 0;

			// add a listener to domready that will start the time limit
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
			if (! obj || ! type) {
				return this;
			}

			Y.log('adding trigger to group: ' + this.get('name'), 'info', 'imageloader');

			/* Need to wrap the fetch function. Event Util can't distinguish prototyped functions of different instantiations.
			 *   Leads to this scenario: groupA and groupZ both have window-scroll triggers. groupZ also has a 2-sec timeout (groupA has no timeout).
			 *   groupZ's timeout fires; we remove the triggers. The detach call finds the first window-scroll event with Y.ILG.p.fetch, which is groupA's. 
			 *   groupA's trigger is removed and never fires, leaving images unfetched.
			 */
			var wrappedFetch = function() {
				this.fetch();
			};
			this._triggers.push( Y.on(type, wrappedFetch, obj, this) );

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
			if (! name) {
				return this;
			}

			Y.log('adding custom trigger to group: ' + this.get('name'), 'info', 'imageloader');

			// see comment in addTrigger()
			var wrappedFetch = function() {
				this.fetch();
			};
			if (Y.Lang.isUndefined(obj)) {
				this._triggers.push( Y.on(name, wrappedFetch, this) );
			}
			else {
				this._triggers.push( obj.on(name, wrappedFetch, this) );
			}

			return this;
		},

		/**
		 * Sets the window scroll and window resize triggers for any group that is fold-conditional (i.e., has a fold distance set).
		 * @method _setFoldTriggers
		 * @private
		 */
		_setFoldTriggers: function() {
			if (this._areFoldTriggersSet) {
				return;
			}

			Y.log('setting window scroll and resize events for group: ' + this.get('name'), 'info', 'imageloader');

			var wrappedFoldCheck = function() {
				this._foldCheck();
			};
			this._triggers.push( Y.on('scroll', wrappedFoldCheck, window, this) );
			this._triggers.push( Y.on('resize', wrappedFoldCheck, window, this) );
			this._areFoldTriggersSet = true;
		},

		/**
		 * Performs necessary setup at domready time.
		 * Initiates time limit for group; executes the fold check for the images.
		 * @method _onloadTasks
		 * @private
		 */
		_onloadTasks: function() {
			var timeLim = this.get('timeLimit');
			if (timeLim && timeLim > 0) {
				Y.log('setting time limit of ' + timeLim + ' seconds for group: ' + this.get('name'), 'info', 'imageloader');
				this._timeout = setTimeout(this._getFetchTimeout(), timeLim * 1000);
			}

			if (! Y.Lang.isUndefined(this.get('foldDistance'))) {
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
			var self = this;
			return function() { self.fetch(); };
		},

		/**
		 * Registers an image with the group.
		 * Arguments are passed through to a <code>Y.ImgLoadImgObj</code> constructor; see that class' attribute documentation for detailed information. "<code>domId</code>" is a required attribute.
		 * @method registerImage
		 * @param {Object} *  A configuration object literal with attribute name/value pairs  (passed through to a <code>Y.ImgLoadImgObj</code> constructor)
		 * @return {Object}  <code>Y.ImgLoadImgObj</code> that was registered
		 */
		registerImage: function() {
			var domId = arguments[0].domId;
			if (! domId) {
				return null;
			}

			Y.log('adding image with id: ' + domId + ' to group: ' + this.get('name'), 'info', 'imageloader');

			this._imgObjs[domId] = new Y.ImgLoadImgObj(arguments[0]);
			return this._imgObjs[domId];
		},

		/**
		 * Displays the images in the group.
		 * This method is called when a trigger fires or the time limit expires; it shouldn't be called externally, but is not private in the rare event that it needs to be called immediately.
		 * @method fetch
		 */
		fetch: function() {
			Y.log('Fetching images in group: "' + this.get('name') + '".', 'info', 'imageloader');

			// done with the triggers
			this._clearTriggers();

			// fetch whatever we need to by className
			this._fetchByClass();

			// fetch registered images
			for (var id in this._imgObjs) {
				if (this._imgObjs.hasOwnProperty(id)) {
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
			clearTimeout(this._timeout);
			// detach all listeners
			for (var i=0, len = this._triggers.length; i < len; i++) {
				this._triggers[i].detach();
			}
		},

		/**
		 * Checks the position of each image in the group. If any part of the image is within the specified distance (<code>foldDistance</code>) of the client viewport, the image is fetched immediately.
		 * @method _foldCheck
		 * @private
		 */
		_foldCheck: function() {
			Y.log('Checking for images above the fold in group: "' + this.get('name') + '"', 'info', 'imageloader');

			var allFetched = true,
			    viewReg = Y.DOM.viewportRegion(),
			    hLimit = viewReg.bottom + this.get('foldDistance'),
					id, imgFetched, els, i, len;

			// unless we've uncovered new frontiers, there's no need to continue
			if (hLimit <= this._maxKnownHLimit) {
				return;
			}
			this._maxKnownHLimit = hLimit;

			for (id in this._imgObjs) {
				if (this._imgObjs.hasOwnProperty(id)) {
					imgFetched = this._imgObjs[id].fetch(hLimit);
					allFetched = allFetched && imgFetched;
				}
			}

			// and by class
			if (this._className) {
				if (this._classImageEls === null) {
					// get all the relevant elements and store them
					this._classImageEls = [];
					els = Y.all('.' + this._className);
					els.each( function(node) { this._classImageEls.push( { el: node, y: node.getY(), fetched: false } ); }, this);
				}
				els = this._classImageEls;
				for (i=0, len = els.length; i < len; i++) {
					if (els[i].fetched) {
						continue;
					}
					if (els[i].y && els[i].y <= hLimit) {
						//els[i].el.removeClass(this._className);
						this._updateNodeClassName(els[i].el);
                        els[i].fetched = true;
						Y.log('Image with id "' + els[i].el.get('id') + '" is within distance of the fold. Fetching image. (Image registered by class name with the group - may not have an id.)', 'info', 'imageloader');
					}
					else {
						allFetched = false;
					}
				}
			}
			
			// if allFetched, remove listeners
			if (allFetched) {
				Y.log('All images fetched; removing listeners for group: "' + this.get('name') + '"', 'info', 'imageloader');
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
            var url;
            
            if (this.get("classNameAction") == "enhanced"){
                
                if (node.get("tagName").toLowerCase() == "img"){
                    url = node.getStyle("backgroundImage");
                    /url\(["']?(.*?)["']?\)/.test(url);
                    url = RegExp.$1;
                    node.set("src", url);
                    node.setStyle("backgroundImage", "");
                }
            }
            
            node.removeClass(this._className);        
        },

		/**
		 * Finds all elements in the DOM with the class name specified in the group. Removes the class from the element in order to let the style definitions trigger the image fetching.
		 * @method _fetchByClass
		 * @private
		 */
		_fetchByClass: function() {
			if (! this._className) {
				return;
			}

			Y.log('Fetching all images with class "' + this._className + '" in group "' + this.get('name') + '".', 'info', 'imageloader');

			Y.all('.' + this._className).each(Y.bind(this._updateNodeClassName, this));
		}

	};


	Y.extend(Y.ImgLoadGroup, Y.Base, groupProto);


	//------------------------------------------------


	/**
	 * Image objects to be registered with the groups
	 * @class ImgLoadImgObj
	 * @extends Base
	 * @constructor
	 */
	Y.ImgLoadImgObj = function() {
		Y.ImgLoadImgObj.superclass.constructor.apply(this, arguments);
		this._init();
	};
		
	Y.ImgLoadImgObj.NAME = 'imgLoadImgObj';

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
			this._fetched = false;

			/**
			 * The Node object returned from <code>Y.one</code>, to avoid repeat calls to access the DOM.
			 * @property _imgEl
			 * @private
			 * @type Object
			 */
			this._imgEl = null;

			/**
			 * The vertical position returned from <code>getY</code>, to avoid repeat calls to access the DOM.
			 * The Y position is checked only for images registered with fold-conditional groups. The position is checked first at page load (domready)
			 *   and this caching enhancement assumes that the image's vertical position won't change after that first check.
			 * @property _yPos
			 * @private
			 * @type Int
			 */
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
			if (this._fetched) {
				return true;
			}

			var el = this._getImgEl(),
			    yPos;
			if (! el) {
				return false;
			}

			if (withinY) {
				// need a distance check
				yPos = this._getYPos();
				if (! yPos || yPos > withinY) {
					return false;
				}
				Y.log('Image with id "' + this.get('domId') + '" is within distance of the fold. Fetching image.', 'info', 'imageloader');
			}

			Y.log('Fetching image with id "' + this.get('domId') + '".', 'info', 'imageloader');

			// apply url
			if (this.get('bgUrl') !== null) {
				// bg url
				if (this.get('isPng') && Y.UA.ie && Y.UA.ie <= 6) {
					// png for which to apply AlphaImageLoader
					el.setStyle('filter', 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + this.get('bgUrl') + '", sizingMethod="' + this.get('sizingMethod') + '", enabled="' + this.get('enabled') + '")');
				}
				else {
					// regular bg image
					el.setStyle('backgroundImage', "url('" + this.get('bgUrl') + "')");
				}
			}
			else if (this.get('srcUrl') !== null) {
				// regular src image
				el.setAttribute('src', this.get('srcUrl'));
			}

			// apply attributes
			if (this.get('setVisible')) {
				el.setStyle('visibility', 'visible');
			}
			if (this.get('width')) {
				el.setAttribute('width', this.get('width'));
			}
			if (this.get('height')) {
				el.setAttribute('height', this.get('height'));
			}

			this._fetched = true;

			return true;
		},

		/**
		 * Gets the object (as a <code>Y.Node</code>) of the DOM element indicated by "<code>domId</code>".
		 * @method _getImgEl
		 * @returns {Object} DOM element of the image as a <code>Y.Node</code> object
		 * @private
		 */
		_getImgEl: function() {
			if (this._imgEl === null) {
				this._imgEl = Y.one('#' + this.get('domId'));
			}
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
			if (this._yPos === null) {
				this._yPos = this._getImgEl().getY();
			}
			return this._yPos;
		}

	};


	Y.extend(Y.ImgLoadImgObj, Y.Base, imgProto);




}, '3.7.3', {"requires": ["base-base", "node-style", "node-screen"]});
