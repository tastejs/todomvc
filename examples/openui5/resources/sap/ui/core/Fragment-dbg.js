/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global', '../base/ManagedObject', './Element', './DeclarativeSupport', './XMLTemplateProcessor'],
	function(jQuery, ManagedObject, Element, DeclarativeSupport, XMLTemplateProcessor) {
	"use strict";


	var mRegistry = {}, // the Fragment registry
	mTypes = {}; // the Fragment types registry, holding their implementations

	/**
	 * @classdesc Fragments support the definition of light-weight stand-alone UI control trees.
	 * This class acts as factory which returns the UI control tree defined inside the Fragments. When used within declarative Views,
	 * the Fragment content is imported and seamlessly integrated into the View.
	 *
	 * Fragments are used similar as sap.ui.core.mvc.Views, but Fragments do not have a Controller on their own (they may know one, though),
	 * they are not a Control, they are not part of the UI tree and they have no representation in HTML.
	 * By default, in contrast to declarative Views, they do not do anything to guarantee ID uniqueness.
	 *
	 * But like Views they can be defined in several Formats (XML, declarative HTML, JavaScript; support for other types can be plugged in),
	 * the declaration syntax is the same as in declarative Views and the name and location of the Fragment files is similar to Views.
	 * Controller methods can also be referenced in the declarations, but as Fragments do not have their own controllers,
	 * this requires the Fragments to be used within a View which does have a controller.
	 * That controller is used, then.
	 *
	 * Do not call the Fragment constructor directly!
	 *
	 *
	 * Use-cases for Fragments are e.g.:
	 * - Modularization of UIs without fragmenting the controller structure
	 * - Re-use of UI parts
	 * - 100%-declarative definition of Views
	 *
	 * @class
	 * @extends sap.ui.base.ManagedObject
	 * @author SAP SE
	 * @version 1.32.9
	 * @public
	 * @alias sap.ui.core.Fragment
	 */
	var Fragment = ManagedObject.extend("sap.ui.core.Fragment", {
		metadata: {
			properties: {
				type: "string"
			},
			specialSettings: {
				/*
				 * Name of the fragment to load
				 */
				fragmentName : true,
				/*
				 * Content of the fragment
				 */
				fragmentContent : true,
				/*
				 * An enclosing view that contains this instance of the fragment (optional)
				 */
				containingView : true,
				/*
				 * A controller of a containing View that should be used by this fragment (optional)
				 */
				oController : true,
				/*
				 * The ID of this fragment (optional)
				 */
				sId : true
			}
		},

		constructor: function(sId, mSettings) {
			ManagedObject.apply(this, arguments);

			// in case of only one control, return it directly
			if (this._aContent && this._aContent.length == 1) {
				return this._aContent[0];
			} else {
				return this._aContent;
			}
		}
	});


	/**
	 * Registers a new Fragment type
	 *
	 * @param {string} sType the Fragment type. Types "XML", "HTML" and JS" are built-in and always available.
	 * @param {object} oFragmentImpl an object having a property "init" of type "function" which is called on Fragment instantiation with the settings map as argument
	 * @public
	 */
	Fragment.registerType = function(sType, oFragmentImpl) {
		if (!typeof (sType) === "string") {
			jQuery.sap.log.error("Ignoring non-string Fragment type: " + sType);
			return;
		}

		if (mTypes[sType]) {
			jQuery.sap.log.warning("sap.ui.core.Fragment.registerType(): Fragment type '" + sType + "' is already defined. Overriding this type now!");
		}

		mTypes[sType] = oFragmentImpl;
	};

	Fragment.prototype._initCompositeSupport = function(mSettings) {
		if (!mSettings) {
			throw new Error("Settings must be set");
		}
		if (!(mSettings.fragmentName || mSettings.fragmentContent)) {
			throw new Error("Please provide a fragment name");
		}
		if (mSettings.oController) {
			this.oController = mSettings.oController;
		}

		// remember the ID which has been explicitly given in the factory function
		this._sExplicitId = mSettings.sId || mSettings.id;

		// remember the name of this Fragment
		this._sFragmentName = mSettings.fragmentName;

		var oFragmentImpl = mTypes[mSettings.type];
		if (oFragmentImpl) {
			oFragmentImpl.init.apply(this, [mSettings]);

		} else { // Fragment type not found
			throw new Error("No type for the fragment has been specified: " + mSettings.type);
		}
	};


	/**
	 * Returns the name of the fragment.
	 *
	 * @returns {String} the fragment name
	 * @private
	 */
	Fragment.prototype.getFragmentName = function() { // required for the parser to lookup customizing configuration
		return this._sFragmentName;
	};


	/**
	 *
	 * @returns {sap.ui.core.mvc.Controller} the Controller connected to this Fragment, or null
	 * @private
	 */
	Fragment.prototype.getController = function() { // required for the parsers to find the specified Controller methods
		return this.oController;
	};


	/**
	 * Returns an Element/Control by its ID in the context of the Fragment with the given ID
	 *
	 * @param {string} sFragmentId
	 * @param {string} sId
	 *
	 * @return Element by its ID and Fragment ID
	 * @public
	 * @static
	 */
	Fragment.byId = function(sFragmentId, sId) {
		if (!(typeof (sFragmentId) === "string" && typeof (sId) === "string")) {
			jQuery.sap.log.error("sap.ui.core.Fragment.byId: two strings must be given as parameters, but are: " + sFragmentId + " and " + sId);
			return undefined;
		}
		return sap.ui.getCore().byId(sFragmentId + "--" + sId);
	};

	/**
	 * Returns the ID which a Control with the given ID in the context of the Fragment with the given ID would have
	 *
	 * @param {string} sFragmentId
	 * @param {string} sId
	 *
	 * @return the prefixed ID
	 * @public
	 * @static
	 */
	Fragment.createId = function(sFragmentId, sId) {
		if (!(typeof (sFragmentId) === "string" && typeof (sId) === "string")) {
			jQuery.sap.log.error("sap.ui.core.Fragment.createId: two strings must be given as parameters, but are: " + sFragmentId + " and " + sId);
			return undefined;
		}
		return sFragmentId + "--" + sId;
	};


	/**
	 * Creates an id for an Element prefixed with the Fragment id.
	 * This method only adds a prefix when an ID was explicitly given when instantiating this Fragment.
	 * If the ID was generated, it returns the unmodified given ID.
	 *
	 * @param {string} sId
	 * @return {string} prefixed id
	 */
	Fragment.prototype.createId = function(sId) {
		var id = this._sExplicitId ? this._sExplicitId + "--" + sId : sId; // no ID Prefixing by Fragments! This is called by the template parsers, but only if there is not a View which defines the prefix.

		if (this._oContainingView && this._oContainingView != this) {
			// if Fragment ID is added to the control ID and Fragment ID already contains the View prefix, the View prefix does not need to be added again
			// (this will now be checked inside the createId function already!)
			id = this._oContainingView.createId(id);
		}

		return id;
	};


	/**
	 * Always return true in case of fragment
	 *
	 * @returns {boolean}
	 * @private
	 */
	Fragment.prototype.isSubView = function(){
		return true;
	};



	// ###   Factory functions   ###

	/**
	 * Instantiate a Fragment - this method loads the Fragment content, instantiates it, and returns this content.
	 * The Fragment object itself is not an entity which has further significance beyond this constructor.
	 *
	 * To instantiate an existing Fragment, call this method as:
	 *    sap.ui.fragment(sName, sType, [oController]);
	 * The sName must correspond to an XML Fragment which can be loaded
	 * via the module system (fragmentName + suffix ".fragment.[typeextension]") and which defines the Fragment content.
	 * If oController is given, the (event handler) methods referenced in the Fragment will be called on this controller.
	 * Note that Fragments may require a Controller to be given and certain methods to be available.
	 *
	 * The Fragment types "XML", "JS" and "HTML" are available by default; additional Fragment types can be implemented
	 * and added using the sap.ui.core.Fragment.registerType() function.
	 *
	 *
	 * Advanced usage:
	 * To instantiate a Fragment and give further configuration options, call this method as:
	 *     sap.ui.fragment(oFragmentConfig, [oController]);
	 * The oFragmentConfig object can have the following properties:
	 * - "fragmentName": the name of the Fragment, as above
	 * - "fragmentContent": the definition of the Fragment content itself. When this property is given, any given name is ignored.
	 *         The type of this property depends on the Fragment type, e.g. it could be a string for XML Fragments.
	 * - "type": the type of the Fragment, as above (mandatory)
	 * - "id": the ID of the Fragment (optional)
	 * Further properties may be supported by future or custom Fragment types. Any given properties
	 * will be forwarded to the Fragment implementation.
	 *
	 * If you want to give a fixed ID for the Fragment, please use the advanced version of this method call with the
	 * configuration object or use the typed factories like sap.ui.xmlfragment(...) or sap.ui.jsfragment(...).
	 * Otherwise the Fragment ID is generated. In any case, the Fragment ID will be used as prefix for the ID of
	 * all contained controls.
	 *
	 * @param {string} sName the Fragment name
	 * @param {string} sType the Fragment type, e.g. "XML", "JS", or "HTML"
	 * @param {sap.ui.core.Controller} [oController] the Controller which should be used by the controls in the Fragment. Note that some Fragments may not need a Controller and other may need one - and even rely on certain methods implemented in the Controller.
	 * @public
	 * @static
	 * @return {sap.ui.core.Control|sap.ui.core.Control[]} the root Control(s) of the Fragment content
	 */
	sap.ui.fragment = function(sName, sType, oController) {

		var mSettings = {};
		if (typeof (sName) === "string") { // normal call
			mSettings.fragmentName = sName;
			mSettings.oController = oController;
			mSettings.type = sType;

		} else if (typeof (sName) === "object") { // advanced call with config object
			mSettings = sName; // pass all config parameters to the implementation
			if (sType) { // second parameter "sType" is in this case the optional Controller
				mSettings.oController = sType;
			}
		} else {
			jQuery.sap.log.error("sap.ui.fragment() must be called with Fragment name or config object as first parameter, but is: " + sName);
		}

		return new Fragment(mSettings);
	};



	/**
	 * Instantiates an XML-based Fragment.
	 *
	 * To instantiate a Fragment, call this method as:
	 *    sap.ui.xmlfragment([sId], sFragmentName, [oController]);
	 * The Fragment instance ID is optional (generated if not given) and will be used as prefix for the ID of all
	 * contained controls. The sFragmentName must correspond to an XML Fragment which can be loaded
	 * via the module system (fragmentName + ".fragment.xml") and which defines the Fragment.
	 * If oController is given, the methods referenced in the Fragment will be called on this controller.
	 * Note that Fragments may require a Controller to be given and certain methods to be available.
	 *
	 *
	 * Advanced usage:
	 * To instantiate a Fragment and optionally directly give the XML definition instead of loading it from a file,
	 * call this method as:
	 *     sap.ui.xmlfragment(oFragmentConfig, [oController]);
	 * The oFragmentConfig object can have a either a "fragmentName" or a "fragmentContent" property.
	 * fragmentContent is optional and can hold the Fragment definition as XML string; if not
	 * given, fragmentName must be given and the Fragment content definition is loaded by the module system.
	 * Again, if oController is given, the methods referenced in the Fragment will be called on this controller.
	 *
	 * @param {string} [sId] id of the newly created Fragment
	 * @param {string | object} vFragment name of the Fragment (or Fragment configuration as described above, in this case no sId may be given. Instead give the id inside the config object, if desired)
	 * @param {sap.ui.core.mvc.Controller} [oController] a Controller to be used for event handlers in the Fragment
	 * @public
	 * @static
	 * @return {sap.ui.core.Control|sap.ui.core.Control[]} the root Control(s) of the created Fragment instance
	 */
	sap.ui.xmlfragment = function(sId, vFragment, oController) {

		if (typeof (sId) === "string") { // basic call
			if (typeof (vFragment) === "string") { // with ID
				return sap.ui.fragment({fragmentName: vFragment, sId: sId, type: "XML"}, oController);

			} else { // no ID, sId is actually the name and vFragment the optional Controller
				return sap.ui.fragment(sId, "XML", vFragment);
			}
		} else { // advanced call
			sId.type = "XML";
			return sap.ui.fragment(sId, vFragment); // second parameter "vFragment" is the optional Controller
		}
	};


	/**
	 * Defines OR instantiates an HTML-based Fragment.
	 *
	 * To define a JS Fragment, call this method as:
	 *    sap.ui.jsfragment(sName, oFragmentDefinition)
	 * Where:
	 * - "sName" is the name by which this fragment can be found and instantiated. If defined in its own file,
	 *    in order to be found by the module loading system, the file location and name must correspond to sName
	 *    (path + file name must be: fragmentName + ".fragment.js").
	 * - "oFragmentDefinition" is an object at least holding the "createContent(oController)" method which defines
	 *    the Fragment content. If given during instantiation, the createContent method receives a Controller
	 *    instance (otherwise oController is undefined) and the return value must be one sap.ui.core.Control
	 *    (which could have any number of children).
	 *
	 *
	 * To instantiate a JS Fragment, call this method as:
	 *    sap.ui.jsfragment([sId], sFragmentName, [oController]);
	 * The Fragment ID is optional (generated if not given) and the Fragment implementation CAN use it
	 * to make contained controls unique (this depends on the implementation: some JS Fragments may choose
	 * not to support multiple instances within one application and not use the ID prefixing).
	 * The sFragmentName must correspond to a JS Fragment which can be loaded
	 * via the module system (fragmentName + ".fragment.js") and which defines the Fragment.
	 * If oController is given, the methods referenced in the Fragment will be called on this controller.
	 * Note that Fragments may require a Controller to be given and certain methods to be available.
	 *
	 *
	 * @param {string} [sId] id of the newly created Fragment
	 * @param {string | object} sFragmentName name of the Fragment (or Fragment configuration as described above, in this case no sId may be given. Instead give the id inside the config object, if desired)
	 * @param {sap.ui.core.mvc.Controller} [oController] a Controller to be used for event handlers in the Fragment
	 * @public
	 * @static
	 * @return {sap.ui.core.Control|sap.ui.core.Control[]} the root Control(s) of the created Fragment instance
	 */
	sap.ui.jsfragment = function(sName, oFragmentDefinition) { // definition of a JS Fragment

		if (typeof (sName) === "string" && typeof (oFragmentDefinition) === "object") {
			if (oFragmentDefinition.createContent) {
				// Fragment DEFINITON
				mRegistry[sName] = oFragmentDefinition;
				jQuery.sap.declare({modName: sName, type:"fragment"}, false);
				// TODO: return value?

			} else {
				// plain instantiation: name[+oController]
				return sap.ui.fragment(sName, "JS", oFragmentDefinition);
			}

		} else if (typeof (sName) === "string" && oFragmentDefinition === undefined) {
			// plain instantiation: name only
			return sap.ui.fragment(sName, "JS");

		} else { // ID+name[+Controller]  or  oConfig+[oController]
			if (typeof (sName) === "object") {
				// advanced mode: oConfig+[oController]
				sName.type = "JS";
				return sap.ui.fragment(sName, oFragmentDefinition);

			} else if (arguments && arguments.length >= 3) {
				// must be plain instantiation mode: ID+Name[+Controller]
				return sap.ui.fragment({id: sName, fragmentName: oFragmentDefinition, type: "JS"}, arguments[2]);
			} else {
				jQuery.sap.log.error("sap.ui.jsfragment() was called with wrong parameter set: " + sName + " + " + oFragmentDefinition);
			}
		}
	};


	/**
	 * Instantiates an HTML-based Fragment.
	 *
	 * To instantiate a Fragment, call this method as:
	 *    sap.ui.htmlfragment([sId], sFragmentName, [oController]);
	 * The Fragment instance ID is optional (generated if not given) and will be used as prefix for the ID of all
	 * contained controls. The sFragmentName must correspond to an HTML Fragment which can be loaded
	 * via the module system (fragmentName + ".fragment.html") and which defines the Fragment.
	 * If oController is given, the methods referenced in the Fragment will be called on this controller.
	 * Note that Fragments may require a Controller to be given and certain methods to be available.
	 *
	 *
	 * Advanced usage:
	 * To instantiate a Fragment and optionally directly give the HTML definition instead of loading it from a file,
	 * call this method as:
	 *     sap.ui.htmlfragment(oFragmentConfig, [oController]);
	 * The oFragmentConfig object can have a either a "fragmentName" or a "fragmentContent" property.
	 * fragmentContent is optional and can hold the Fragment definition as XML string; if not
	 * given, fragmentName must be given and the Fragment content definition is loaded by the module system.
	 * Again, if oController is given, the methods referenced in the Fragment will be called on this controller.
	 *
	 * @param {string} [sId] id of the newly created Fragment
	 * @param {string | object} vFragment name of the Fragment (or Fragment configuration as described above, in this case no sId may be given. Instead give the id inside the config object, if desired.)
	 * @param {sap.ui.core.mvc.Controller} [oController] a Controller to be used for event handlers in the Fragment
	 * @public
	 * @static
	 * @return {sap.ui.core.Control|sap.ui.core.Control[]} the root Control(s) of the created Fragment instance
	 */
	sap.ui.htmlfragment = function(sId, vFragment, oController) {

		if (typeof (sId) === "string") { // basic call
			if (typeof (vFragment) === "string") { // with ID
				return sap.ui.fragment({fragmentName: vFragment, sId: sId, type: "HTML"}, oController);

			} else { // no ID, sId is actually the name and vFragment the optional Controller
				return sap.ui.fragment(sId, "HTML", vFragment);
			}
		} else { // advanced call
			sId.type = "HTML";
			return sap.ui.fragment(sId, vFragment); // second parameter "vFragment" is the optional Controller
		}
	};




	// ###   FRAGMENT TYPES   ###


	// ###   XML Fragments   ###

	Fragment.registerType("XML" , {
		init: function(mSettings) {
			// use specified content or load the content definition
			if (mSettings.fragmentContent) {
				if (typeof (mSettings.fragmentContent) === "string") {
					this._xContent = jQuery.parseXML(mSettings.fragmentContent).documentElement;
				} else {
					this._xContent = mSettings.fragmentContent;
				}
			} else {
				this._xContent = XMLTemplateProcessor.loadTemplate(mSettings.fragmentName, "fragment");
			}

			this._oContainingView = this._sExplicitId ? this : (mSettings.containingView || this);
			if ((this._oContainingView === this) ) {
				this._oContainingView.oController = (mSettings.containingView && mSettings.containingView.oController) || mSettings.oController;
			}

			var that = this;
			// unset any preprocessors (e.g. from an enclosing JSON view)
			ManagedObject.runWithPreprocessors(function() {
				// parse the XML tree

				//var xmlNode = that._xContent;
				// if sub ID is given, find the node and parse it
				// TODO: for sub-fragments   if () {
				//	xmlNode = jQuery(that._xContent).find("# ")
				//}
				that._aContent = XMLTemplateProcessor.parseTemplate(that._xContent, that);

				/*
				 * If content was parsed and an objectBinding at the fragment was defined
				 * the objectBinding must be forwarded to the created controls
				 */
				if (that._aContent && that._aContent.length && mSettings.objectBindings) {
					that._aContent.forEach(function(oContent, iIndex) {
						if (oContent instanceof Element) {
							for (var sModelName in mSettings.objectBindings) {
								oContent.bindObject(mSettings.objectBindings[sModelName]);
							}
						}
					});
				}
			});
		}
	});



	// ###   JS Fragments   ###

	Fragment.registerType("JS", {
		init: function(mSettings) {
			/*** require fragment definition if not yet done... ***/
			if (!mRegistry[mSettings.fragmentName]) {
				jQuery.sap.require({modName: mSettings.fragmentName, type: "fragment"});
			}
			/*** Step 2: extend() ***/
			jQuery.extend(this, mRegistry[mSettings.fragmentName]);

			this._oContainingView = mSettings.containingView || this;

			var that = this;
			// unset any preprocessors (e.g. from an enclosing JSON view)
			ManagedObject.runWithPreprocessors(function() {

				var content = that.createContent(mSettings.oController || that._oContainingView.oController);
				that._aContent = [];
				that._aContent = that._aContent.concat(content);

			});
		}
	});



	// ###   HTML Fragments   ###

	(function() {

		/**
		 * The template cache. Templates are only loaded once.
		 *
		 * @private
		 * @static
		 */
		var _mHTMLTemplates = {};

		/**
		 * Loads and returns a template for the given template name. Templates are only loaded once.
		 *
		 * @param {string} sTemplateName The name of the template
		 * @return {string} the template data
		 * @private
		 */
		var _getHTMLTemplate = function(sTemplateName) {
			var sUrl = jQuery.sap.getModulePath(sTemplateName, ".fragment.html");
			var sHTML = _mHTMLTemplates[sUrl];
			var sResourceName;

			if (!sHTML) {
				sResourceName = jQuery.sap.getResourceName(sTemplateName, ".fragment.html");
				sHTML = jQuery.sap.loadResource(sResourceName);
				// TODO discuss
				// a) why caching at all (more precise: why for HTML fragment although we refused to do it for other view/fragment types - risk of a memory leak!)
				// b) why cached via URL instead of via name? Any special scenario in mind?
				_mHTMLTemplates[sUrl] = sHTML;
			}
			return sHTML;
		};

		Fragment.registerType("HTML", {
			init: function(mSettings) {
				// DeclarativeSupport automatically uses set/getContent, but Fragment should not have such an aggregation and should not be parent of any control
				// FIXME: the other aggregation methods are not implemented. They are currently not used, but who knows...
				this._aContent = [];
				this.getContent = function() {
					return this._aContent;
				};
				this.addContent = function(oControl) {
					this._aContent.push(oControl);
				};

				this._oContainingView = mSettings.containingView || this;

				var vHTML = mSettings.fragmentContent || _getHTMLTemplate(mSettings.fragmentName);
				this._oTemplate = document.createElement("div");

				if (typeof vHTML === "string") {
					this._oTemplate.innerHTML = vHTML;
				} else {
					var oNodeList = vHTML;
					var oFragment = document.createDocumentFragment();
					for (var i = 0; i < oNodeList.length;i++) {
						oFragment.appendChild(oNodeList.item(i));
					}
					this._oTemplate.appendChild(oFragment);
				}

				var oMetaElement = this._oTemplate.getElementsByTagName("template")[0];
				var oProperties = this.getMetadata().getAllProperties();

				if (oMetaElement) {
					var that = this;
					jQuery.each(oMetaElement.attributes, function(iIndex, oAttr) {
						var sName = DeclarativeSupport.convertAttributeToSettingName(oAttr.name, that.getId());
						var sValue = oAttr.value;
						var oProperty = oProperties[sName];
						if (!mSettings[sName]) {
							if (oProperty) {
								mSettings[sName] = DeclarativeSupport.convertValueToType(DeclarativeSupport.getPropertyDataType(oProperty),sValue);
							} else if (sap.ui.core.mvc.HTMLView._mAllowedSettings[sName]) {
								mSettings[sName] = sValue;
							}
						}
					});
					this._oTemplate = oMetaElement;
				}
				// This is a fix for browsers that support web components
				if (this._oTemplate.content) {
					var oFragment = this._oTemplate.content;
					// Create a new template, as innerHTML would be empty for TemplateElements when the fragment is appended directly
					this._oTemplate = document.createElement("div");
					// Make the shadow DOM available in the DOM
					this._oTemplate.appendChild(oFragment);
				}

				// unset any preprocessors (e.g. from an enclosing HTML view)
				var that = this;
				ManagedObject.runWithPreprocessors(function() {
					DeclarativeSupport.compile(that._oTemplate, that);

					// FIXME declarative support automatically inject the content into that through "that.addContent()"
					var content = that.getContent();
					if (content && content.length === 1) {
						that._aContent = [content[0]];
					}// else {
						// TODO: error
					//}
				});
			}
		});
	}()); // end of HTML Fragment stuff

	return Fragment;

});
