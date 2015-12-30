/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides class sap.ui.core.CompositeSupport
sap.ui.define(['jquery.sap.global', './Control', 'sap/ui/model/control/ControlModel', 'sap/ui/base/EventProvider'],
	function(jQuery, Control, ControlModel, EventProvider) {
	"use strict";


	/**
	 * Helper for composite controls. Can be applied as a mixin to existing classes by calling
	 *
	 * <pre>
	 * sap.ui.core.CompositeSupport.mixInto(your.Class, {
	 *   createComponent1 : function() {
	 *   },
	 *   createComponent2 : function() {
	 *   },
	 *   ...
	 * });
	 * </pre>
	 *
	 * @namespace
	 * @alias sap.ui.core.CompositeSupport
	 */
	var CompositeSupport = {};
	
	/**
	 * Applies the CompositeMixin to the given control class <code>fnClass</code>. This includes the following steps:
	 *
	 * <ul>
	 * <li>Creates a new subclass of {@link sap.ui.core.ComponentFactory} and adds it to the given class
	 * <li>Merges the given methods into the prototype of the newly created class
	 * <li>Enriches the prototype of the given control class with a getComponentFactory() method
	 * <li>Hooks into init() and destroy() of the given class
	 * </ul>
	 *
	 * @param {function} fnClass the class (constructor function) of a control calls to be enriched
	 * @param {string} [sFactoryName='ComponentFactory'] name under which the newly created factory class will be added to the control class
	 * @param {object} [oMethods] default factory methods and helper methods
	 * @public
	 */
	CompositeSupport.mixInto = function(fnClass, sFactoryName, oMethods) {
	
		if ( arguments.length == 2 && typeof sFactoryName === "object" ) {
			oMethods = sFactoryName;
			sFactoryName = "ComponentFactory";
		}
		jQuery.sap.assert(typeof fnClass === "function" && fnClass.prototype instanceof Control, "CompositeSupport.mixInto: fnClass must be a subclass of Control");
		jQuery.sap.assert(typeof sFactoryName === "string" && sFactoryName, "CompositeSupport.mixInto: sFactoryName must be a non-empty string");
		jQuery.sap.assert(typeof oMethods === "object", "oMethods must be an object");
	
		function _getBaseFactory() {
			var oMetadata = fnClass.getMetadata();
			do {
				oMetadata = oMetadata.getParent();
				if ( oMetadata && oMetadata.getComponentFactoryClass ) {
					return oMetadata.getComponentFactoryClass();
				}
			} while ( oMetadata );
			return ComponentFactory;
		}
	
		// create a new component factory class
		fnClass[sFactoryName] = (_getBaseFactory()).subclass(oMethods);
	
		// add factory class info to metadata
		fnClass.getMetadata().getComponentFactoryClass = jQuery.sap.getter(fnClass[sFactoryName]);
	
		// initialization and getter for the component factory
		if ( !fnClass.prototype._initCompositeSupport ) {
			fnClass.prototype._initCompositeSupport = function(mSettings) {
	
				var oFactory = new (this.getMetadata().getComponentFactoryClass())(this);
	
				if ( mSettings.componentFactory ) {
	
					// assert a pure object literal
					jQuery.sap.assert(jQuery.isPlainObject(mSettings.componentFactory));
	
					// customize the factory with it
					oFactory.customize(mSettings.componentFactory);
	
					// cleanup settings
					delete mSettings.componentFactory;
	
				}
	
				this.getComponentFactory = jQuery.sap.getter(oFactory);
			};
		}
	
		if ( !fnClass.prototype._exitCompositeSupport ) {
			fnClass.prototype._exitCompositeSupport = function() {
	
				this.getComponentFactory().destroy();
				delete this.getComponentFactory;
			};
		}
	
	};
	
	/**
	 * @class Base class for component factories. Subclasses are created by the CompositeSupport mixin.
	 *
	 * @param {sap.ui.core.Control} oComposite Composite control that this factory is used for.
	 * @alias sap.ui.core.ComponentFactory
	 */
	var ComponentFactory = EventProvider.extend("sap.ui.core.ComponentFactory", /** @lends sap.ui.core.ComponentFactory */ {
		constructor: function(oComposite) {
			EventProvider.apply(this);
			this.oComposite = oComposite;
			return this;
		}
	});
	
	/**
	 * Attaches a change notification listener to this factory. The listener will be informed when
	 * any of the API objects of the composite API will change.
	 * @param {function} f listener function to call
	 * @param {object} [o=window] Object to call the function on
	 * @return {sap.ui.core.ComponentFactory} returns this to facilitate method chaining
	 * @public
	 */
	ComponentFactory.prototype.attachChange = function (f,o) {
		this.getModel();
		this.attachEvent("change", f,o);
		return this;
	};
	
	/**
	 * Detaches the given change notification listener from this factory.
	 * The listener must have been registered with the exact same parameters before
	 * @param {function} f listener function to remove
	 * @param {object} [o=window] Object that the listener function had to be called for
	 * @return {sap.ui.core.ComponentFactory} returns this to facilitate method chaining
	 * @public
	 */
	ComponentFactory.prototype.detachChange = function (f,o) {
		this.getModel();
		this.detachEvent("change", f,o);
		return this;
	};
	
	/**
	 * Returns a control model for the composite that this factory belongs to.
	 *
	 * The model can be used to bind properties of created components against it.
	 *
	 * @return {sap.ui.model.control.ControlModel} A model for the composite of this factory
	 * @public
	 */
	ComponentFactory.prototype.getModel = function() {
		if ( !this.oModel ) {
			var that = this;
			this.oModel = new ControlModel(this.oComposite);
			this.oModel._onchange = function(e) {
				that.fireEvent("change", e.getParameters && e.getParameters());
			};
		}
		return this.oModel;
	};
	
	/**
	 * Adds an element to the facade of the composite. To be called by the composite application.
	 * @param {sap.ui.core.Element} oElement element to be added to the facade
	 * @return {void}
	 * @public
	 */
	ComponentFactory.prototype.addFacadeComponent = function(oElement) {
		this.getModel().add(oElement);
	};
	
	/**
	 * Removes an element from the facade of the composite. To be called by the composite application.
	 * @param {sap.ui.core.Element} oElement element to be removed to the facade
	 * @return {void}
	 * @public
	 */
	ComponentFactory.prototype.removeFacadeComponent = function(oElement) {
		this.getModel().remove(oElement);
	};
	
	(function() {
	
		function _extend(o, oMethods, bDefaults) {
			jQuery.each(oMethods, function(sName, fnFunc) {
				if ( sName.indexOf("default") != 0 ) {
					o[sName] = fnFunc;
				}
				// for create functions keep a backup
				if ( bDefaults && sName.indexOf("create") == 0 ) {
					o["defaultC" + sName.substring(1)] = o[sName];
				}
			});
		}
	
		function _createExtendFunction(fnBaseClass) {
			return function(oMethods) {
	
				// create a new constructor function
				var fnCtor = function(/* anonymous arguments */) {
					// invoke base class
					fnBaseClass.apply(this, arguments);
				};
				// properly chain the prototypes
				fnCtor.prototype = jQuery.sap.newObject(fnBaseClass.prototype);
				_extend(fnCtor.prototype, oMethods, /* bDefaults */ true);
	
				fnCtor.customize = function(oMethods) {
					_extend(fnCtor.prototype, oMethods);
					return this;
				};
	
				fnCtor.subclass = _createExtendFunction(fnCtor);
	
				return fnCtor;
			};
		}
	
		/**
		 * Creates a concrete subclass of ComponentFactory with the given methods.
		 *
		 * @function
		 * @param {object} [oMethods] Map of methods that should be attached to the subclass.
		 * @return {Function} constructor for created subclass. 
		 */
		ComponentFactory.subclass = _createExtendFunction(ComponentFactory);
	
		/**
		 * Overrides factory methods with a customized implementation.
		 *
		 * The members in the <code>mMethods</code> parameter should match
		 * the documented factory methods in the concrete ComponentFactory subclass
		 * of a composite.
		 *
		 * @see Application Developers guide for component customization
		 *
		 * @param {object} mMethods
		 * @return {sap.ui.core.ComponentFactory} this to allow method chaining
		 * @public
		 */
		ComponentFactory.prototype.customize = function (mMethods) {
			_extend(this, mMethods);
			if ( this.oComposite && this.oComposite._onComponentFactoryChanged ) {
				//
				this.oComposite._onComponentFactoryChanged();
			}
			return this;
		};
	
	}());

	return CompositeSupport;

}, /* bExport= */ true);
