/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides the base class for all controls and UI elements.
sap.ui.define(['jquery.sap.global', '../base/Object', '../base/ManagedObject', './ElementMetadata', 'jquery.sap.strings', 'jquery.sap.trace'],
	function(jQuery, BaseObject, ManagedObject, ElementMetadata/* , jQuerySap */) {
	"use strict";

	/**
	 * Constructs and initializes an UI Element with the given <code>sId</code> and settings.
	 *
	 * If the optional <code>mSettings</code> are given, they must be a JSON-like object (object literal)
	 * that defines values for properties, aggregations, associations or events keyed by their name.
	 *
	 * <b>Valid Names:</b>
	 *
	 * The property (key) names supported in the object literal are exactly the (case sensitive)
	 * names documented in the JSDoc for the properties, aggregations, associations and events
	 * of the control and its base classes. Note that for  0..n aggregations and associations this
	 * usually is the plural name, whereas it is the singular name in case of 0..1 relations.
	 *
	 * If a key name is ambiguous for a specific control class (e.g. a property has the same
	 * name as an event), then this method prefers property, aggregation, association and
	 * event in that order. To resolve such ambiguities, the keys can be prefixed with
	 * <code>aggregation:</code>, <code>association:</code> or <code>event:</code>.
	 * In that case the keys must be quoted due to the ':'.
	 *
	 * Each subclass should document the set of supported names in its constructor documentation.
	 *
	 * <b>Valid Values:</b>
	 *
	 * <ul>
	 * <li>for normal properties, the value has to be of the correct simple type (no type conversion occurs)
	 * <li>for 0..1 aggregations, the value has to be an instance of the aggregated control or element type
	 * <li>for 0..n aggregations, the value has to be an array of instances of the aggregated type
	 * <li>for 0..1 associations, an instance of the associated type or an id (string) is accepted
	 * <li>0..n associations are not supported yet
	 * <li>for events either a function (event handler) is accepted or an array of length 2
	 *     where the first element is a function and the 2nd element is an object to invoke the method on.
	 * </ul>
	 *
	 * Special aggregation "dependents" is connected to the lifecycle management and databinding,
	 * but not rendered automatically and can be used for popups or other dependent controls. This allows
	 * definition of popup controls in declarative views and enables propagation of model and context
	 * information to them.
	 *
	 * @param {string} [sId] id for the new control; generated automatically if no non-empty id is given
	 *      Note: this can be omitted, no matter whether <code>mSettings</code> will be given or not!
	 * @param {object} [mSettings] optional map/JSON-object with initial property values, aggregated objects etc. for the new element
	 *
	 * @class Base Class for Elements.
	 * @extends sap.ui.base.ManagedObject
	 * @author SAP SE
	 * @version 1.32.9
	 * @public
	 * @alias sap.ui.core.Element
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var Element = ManagedObject.extend("sap.ui.core.Element", {

		metadata : {
			stereotype : "element",
			"abstract" : true,
			publicMethods : [ "getId", "getMetadata", "getTooltip_AsString", "getTooltip_Text", "getModel", "setModel", "hasModel", "bindElement", "unbindElement", "getElementBinding", "prop", "getLayoutData", "setLayoutData" ],
			library : "sap.ui.core",
			aggregations : {

				/**
				 * The tooltip that should be shown for this Element.
				 *
				 * Can either be an instance of a TooltipBase subclass or a simple string.
				 */
				tooltip : {name : "tooltip", type : "sap.ui.core.TooltipBase", altTypes : ["string"], multiple : false},

				/**
				 * Custom Data, a data structure like a map containing arbitrary key value pairs.
				 */
				customData : {name : "customData", type : "sap.ui.core.CustomData", multiple : true, singularName : "customData"},

				/**
				 * Defines the layout constraints for this control when it is used inside a Layout.
				 * LayoutData classes are typed classes and must match the embedding Layout.
				 * See VariantLayoutData for aggregating multiple alternative LayoutData instances to a single Element.
				 */
				layoutData : {name : "layoutData", type : "sap.ui.core.LayoutData", multiple : false, singularName : "layoutData"},

				/**
				 * Dependents are not rendered, but their databinding context and lifecycle are bound to the aggregating Element.
				 * @since 1.19
				 */
				dependents : {name : "dependents", type : "sap.ui.core.Control", multiple : true}
			}
		},

		constructor : function(sId, mSettings) {
			ManagedObject.apply(this, arguments);
		},

		renderer : null // Element has no renderer

	}, /* Metadata constructor */ ElementMetadata);

	/**
	 * Creates a new subclass of class sap.ui.core.Element with name <code>sClassName</code>
	 * and enriches it with the information contained in <code>oClassInfo</code>.
	 *
	 * <code>oClassInfo</code> might contain the following:
	 * <ul>
	 * <li><code>metadata:</code> an (optional) object literal containing meta information about the class.
	 * The information in the object literal will be wrapped by an instance of ElementMetadata
	 * and might contain the following information:
	 * <ul>
	 * <li>all values accepted for metadata as documented for the {@link sap.ui.base.Object.extend Object.extend} method</li>
	 * <li>library: {string} (optional) name of the library that contains the element/control
	 * <li>properties: a map of property info objects, mapped by the property name
	 *     Each info object should be a simple object literal and may contain the following information
	 *     <ul>
	 *     <li>type {string} optional type of the property, defaults to type "string"
	 *     <li>[defaultValue] {any} default value of the property. When omitted, defaults to the default value for the type
	 *     <li>group {string} optional semantic group of the property. Defaults to "Misc"
	 *     </ul>
	 *     If the property info object is not an object literal, it is assumed to be a string and
	 *     interpreted as the type of the property. All other informations use their default values.
	 * <li>aggregations: a map of aggregation info objects, mapped by the aggregation name
	 *     By convention, the name should be a singular name for aggregations of cardinality 0..1 and
	 *     should be a plural name for aggregations of cardinality 0..n.
	 *
	 *     The info object should contain the following information
	 *     <ul>
	 *     <li>type {string} (optional) type of the aggregated controls/elements, defaults to sap.ui.core.Control
	 *     <li>altTypes {string[]} (optional) alternative primitive types that the aggregation can have (like string etc.). Defaults to no alternative types.
	 *     <li>multiple {boolean} (optional) information about the cardinality, defaults to true (multiple aggregation)
	 *     <li>singularName {string} (optional) singular name for 0..n aggregations. If not specified, a singular name is guessed from the plural name.
	 *     </ul>
	 *     If the aggregation info object is not an object literal, it is assumed to be a string and
	 *     interpreted as the type of the aggregation. All other informations use their default values.
	 * <li>associations: a map of association info objects, mapped by the association name
	 *     By convention, the name should be a singular name for aggregations of cardinality 0..1 and
	 *     should be a plural name for aggregations of cardinality 0..n.
	 *
	 *     The info object should contain the following information
	 *     <ul>
	 *     <li>type {string} type of the associated controls/elements, defaults to sap.ui.core.Control
	 *     <li>multiple {boolean} (optional) information about the cardinality, defaults to false (single aggregation)
	 *     <li>singularName {string} (optional) singular name for 0..n aggregations. If not specified, a singular name is guessed from the plural name.
	 *     </ul>
	 *     If the association info object is not an object literal, it is assumed to be a string and
	 *     interpreted as the type of the aggregation. All other informations then use their default values.
	 * <li>events: a map of event info objects, mapped by the event name
	 *     The info object can contain the following information
	 *     <ul>
	 *     <li><code>allowPreventDefault:</code> {boolean} whether the control allows to prevent its default behavior for this event (defaults to false) </li>
	 *     </ul>
	 * </ul>
	 * For all properties, aggregations, associations and events, the usual access methods are created and added to the public facade.
	 * They don't need to be listed in the publicMethods array.
	 * </li>
	 *
	 * <li><code>constructor:</code> a function that serves as a constructor function for the new element class.
	 * If no constructor function is given, the framework creates a default implementation that delegates all
	 * its arguments to the constructor function of the base class.
	 * <b>Note:</b> most of the time, subclasses of Element don't need to specify their own constructor function.
	 * They should use the symmetric {@link #init} and {@link #exit} hooks instead.
	 * </li>
	 *
	 * <li><code>renderer:</code> definition of a renderer. This can be any of the following
	 * <ul>
	 * <li>the class name of a renderer class (a string)</li>
	 * <li>a render function with signature <code>function(oRenderManager, oControl)</code> that implements the rendering for the new class</li>
	 * <li>an object literal that contains functions/properties that should be mixed into a new render class which is
	 * created as a subclass of the renderer of the current class.</li>
	 * </ul>
	 * <b>Note:</b> usually only controls have a renderer. But to keep the control creation APIs simple and to honor future
	 * extensions of the current policy, the definition of a renderer is supported for direct subclasses of Element as well.
	 * </li>
	 *
	 * <li><i>any-other-name:</i> any other property in the <code>oClassInfo</code> is copied into the prototype
	 * object of the newly created class. Callers can thereby add methods or properties to all instances of the
	 * class. But be aware that the given values are shared between all instances of the class. Usually, it doesn't
	 * make sense to use primitive values here other than to declare public constants.
	 *
	 * All methods added this way and whose name is not 'init' nor 'exit' nor does it start with an underscore ('_')
	 * nor with the prefix 'on' are assumed to be public methods and are automatically added to the list of public facade methods.
	 * </ul>
	 *
	 * The prototype object of the newly created class uses the same prototype as instances of the base class
	 * (prototype chaining).
	 *
	 * A metadata object is always created, even if there is no <code>metadata</code> entry in the <code>oClassInfo</code>
	 * object. A getter for the metadata is always attached to the prototype and to the class (constructor function)
	 * itself.
	 *
	 * Last but not least, with the third argument <code>FNMetaImpl</code> the constructor of a metadata class
	 * can be specified. Instances of that class will be used to represent metadata for the newly created class
	 * and for any subclass created from it. Typically, only frameworks will use this parameter to enrich the
	 * metadata for a new class hierarchy they introduce (as done by  {@link sap.ui.core.Element Element}).
	 *
	 * @param {string} sClassName name of the class to be created
	 * @param {object} [oClassInfo] structured object with informations about the class
	 * @param {function} [FNMetaImpl] constructor function for the metadata object. If not given, it defaults to sap.ui.core.ElementMetadata.
	 * @return {function} the created class / constructor function
	 * @public
	 * @static
	 * @name sap.ui.core.Element.extend
	 * @function
	 * @since 1.3.1
	 */

	/**
	 * Creates metadata for an UI Element by extending the Object Metadata.
	 *
	 * In addition to the entries defined by {@link sap.ui.base.Object.defineClass}, the following
	 * entries can be specified in the static info object:
	 *
	 * <ul>
	 * <li>library: {string} name of the library that contains the element/control
	 * <li>properties: a map of property info objects, mapped by the property name
	 *     Info object should contain the following information
	 *     <ul>
	 *     <li>name {string} name of the property (redundant to map key)
	 *     <li>type {string} type of the property
	 *     <li>[defaultValue] {any} default value of the property. Can be omitted
	 *     </ul>
	 * <li>aggregations: a map of aggregation info objects, mapped by the aggregation name
	 *     Info object should contain the following information
	 *     <ul>
	 *     <li>name {string} name of the aggregation, singular for 0..1, plural for 0..n
	 *     <li>type {string} type of the aggregated controls/elements
	 *     <li>multiple {boolean}
	 *     <li>singularName {string} singular name for 0..n aggregations
	 *     </ul>
	 * <li>associations: a map of association info objects, mapped by the association name
	 *     Info object should contain the following information
	 *     <ul>
	 *     <li>name {string} name of the association, singular for 0..1, plural for 0..n
	 *     <li>type {string} type of the associated controls/elements
	 *     <li>multiple {boolean}
	 *     <li>singularName {string} singular name for 0..n associations
	 *     </ul>
	 * <li>events: map from event names to event names
	 * </ul>
	 *
	 * @see sap.ui.core.Object.defineClass
	 *
	 * @param {string} sClassName name of the class to build the metadata for
	 * @param {object} oStaticInfo static information used to build the metadata
	 * @param {function} [fnMetaImpl] constructor to be used for the metadata
	 * @return {object} the created metadata
	 * @static
	 * @public
	 * @deprecated Since 1.3.1. Use the static <code>extend</code> method of the desired base class (e.g. {@link sap.ui.core.Element.extend})
	 */
	Element.defineClass = function(sClassName, oStaticInfo, fnMetaImpl) {
		// create and attach metadata but with an Element specific implementation
		return BaseObject.defineClass(sClassName, oStaticInfo, fnMetaImpl || ElementMetadata);
	};

	/**
	 * @see sap.ui.base.Object#getInterface
	 * @public
	 */
	Element.prototype.getInterface = function() {
		return this;
	};

	/**
	 * Handles the given browser event.
	 * @private
	 */
	Element.prototype._handleEvent = function (oEvent) {
		var sHandlerName = "on" + oEvent.type;
			this._callEventHandles(this.aBeforeDelegates.slice(0), sHandlerName, oEvent, true);
			this._callEventHandles([this], sHandlerName, oEvent);
			this._callEventHandles(this.aDelegates.slice(0), sHandlerName, oEvent, true);
	};

	/**
	 * Calls event handler of the given event handles with the given browser event.
	 * @private
	 */
	Element.prototype._callEventHandles = function (aHandles, sHandlerName, oEvent, bDelegateHolder) {
		if (aHandles.length > 0) {
			for (var i = 0; i < aHandles.length; i++) {
				if (oEvent.isImmediateHandlerPropagationStopped()) {
					break;
				}
				var oHandle = bDelegateHolder ? aHandles[i].oDelegate : aHandles[i];
				var oThis = (bDelegateHolder && aHandles[i].vThis) ? aHandles[i].vThis : oHandle;
				if (oThis === true) { // special case, means the control should be the context
					oThis = this;
				}
				if (oHandle[sHandlerName]) {
					oHandle[sHandlerName].call(oThis, oEvent);
				}
			}
		}
	};


	// Element is granted "friend" access by Core for (de-)registration
	/**
	 * Registers this instance of sap.ui.core.Element with the Core.
	 *
	 * The implementation of this method is provided with "friend" access by Core.
	 * @see sap.ui.core.Core.constructor
	 *
	 * @function
	 * @name sap.ui.core.Element.prototype.register
	 * @private
	 */
	//sap.ui.core.Element.prototype.register = function() {...}

	/**
	 * Deregisters this instance of sap.ui.core.Element from the Core.
	 *
	 * The implementation of this method is provided with "friend" access by Core.
	 * @see sap.ui.core.Core.constructor
	 *
	 * @function
	 * @name sap.ui.core.Element.prototype.deregister
	 * @private
	 */
	//sap.ui.core.Element.prototype.deregister = function() {...}

	/**
	 * Initializes the element instance after creation.
	 *
	 * Applications must not call this hook method directly, it is called by the framework
	 * while the constructor of an element is executed.
	 *
	 * Subclasses of Element should override this hook to implement any necessary initialization.
	 *
	 * @function
	 * @name sap.ui.core.Element.prototype.init
	 * @protected
	 */
	//sap.ui.core.Element.prototype.init = function() {};

	/**
	 * Cleans up the element instance before destruction.
	 *
	 * Applications must not call this hook method directly, it is called by the framework
	 * when the element is {@link #destroy destroyed}.
	 *
	 * Subclasses of Element should override this hook to implement any necessary cleanup.
	 *
	 * @function
	 * @name sap.ui.core.Element.prototype.exit
	 * @protected
	 */
	//sap.ui.core.Element.prototype.exit = function() {};

	/**
	 * Creates a new Element from the given data.
	 *
	 * If vData is an Element already, that element is returned.
	 * If vData is an object (literal), then a new element is created with vData as settings.
	 * The type of the element is either determined by a "Type" entry in the vData or
	 * by a type information in the oKeyInfo object
	 * @param {sap.ui.core.Element|object} vData the data to create the element from
	 * @param {object} [oKeyInfo] an entity information (e.g. aggregation info)
	 * @param {string} [oKeyInfo.type] type info for the entity
	 * @public
	 * @static
	 */
	Element.create = function(vData, oKeyInfo) {
		if ( !vData || vData instanceof Element || typeof vData !== "object" || vData instanceof String) {
			return vData;
		}

		function getClass(vType) {
			if ( typeof vType === "function" ) {
				return vType;
			}
			if (typeof vType === "string" ) {
				return jQuery.sap.getObject(vType);
			}
		}

		var fnClass = getClass(vData.Type) || getClass(oKeyInfo && oKeyInfo.type);
		if ( typeof fnClass === "function" ) {
			return new fnClass(vData);
		}

		// we don't know how to create the Element from vData, so fail
		// extension points could be integrated here
		var message = "Don't know how to create an Element from " + vData + " (" + (typeof vData) + ")";
		jQuery.sap.log.fatal(message);
		throw new Error(message);
	};


	/**
	 * Returns a simple string representation of this element.
	 *
	 * Mainly useful for tracing purposes.
	 * @public
	 * @return {string} a string descripition of this element
	 */
	Element.prototype.toString = function() {
		if ( this.getMetadata ) {
			return "Element " + this.getMetadata().getName() + "#" + this.sId;
		} else {
			return "Element {unknown class}#" + this.sId;
		}
	};


	/**
	 * Returns the best suitable DOM Element that represents this UI5 Element.
	 * By default the DOM Element with the same ID as this Element is returned.
	 * Subclasses should override this method if the lookup via id is not sufficient.
	 *
	 * Note that such a DOM Element does not necessarily exist in all cases.
	 * Some elements or controls might not have a DOM representation at all (e.g.
	 * a naive FlowLayout) while others might not have one due to their current
	 * state (e.g. an initial, not yet rendered control).
	 *
	 * If an ID suffix is given, the ID of this Element is concatenated with the suffix
	 * (separated by a single dash) and the DOM node with that compound ID will be returned.
	 * This matches the UI5 naming convention for named inner DOM nodes of a control.
	 *
	 * @param {string} [sSuffix] ID suffix to get the DOMRef for
	 * @return {Element} The Element's DOM Element sub DOM Element or null
	 * @protected
	 */
	Element.prototype.getDomRef = function(sSuffix) {
		return jQuery.sap.domById(sSuffix ? this.getId() + "-" + sSuffix : this.getId());
	};

	/**
	 * Returns the best suitable DOM node that represents this Element wrapped as jQuery object.
	 * I.e. the element returned by {@link sap.ui.core.Element#getDomRef} is wrapped and returned.
	 *
	 * If an ID suffix is given, the ID of this Element is concatenated with the suffix
	 * (separated by a single dash) and the DOM node with that compound ID will be wrapped by jQuery.
	 * This matches the UI5 naming convention for named inner DOM nodes of a control.
	 *
	 * @param {string} [sSuffix] ID suffix to get a jQuery object for
	 * @return {jQuery} The jQuery wrapped element's DOM reference
	 * @protected
	 */

	Element.prototype.$ = function(sSuffix) {
		return jQuery(this.getDomRef(sSuffix));
	};

	/**
	 * Checks whether this element has an active parent.
	 *
	 * @type boolean
	 * @return true if this element has an active parent
	 * @private
	 */
	Element.prototype.isActive = function() {
		return this.oParent && this.oParent.isActive();
	};

	/**
	 * This function either calls set[sPropertyName] or get[sPropertyName] with the specified property name
	 * depending if an <code>oValue</code> is provided or not.
	 *
	 * @param {string}  sPropertyName name of the property to set
	 * @param {any}     [oValue] value to set the property to
	 * @return {any|sap.ui.core.Element} Returns <code>this</code> to allow method chaining in case of setter and the property value in case of getter
	 * @public
	 * @deprecated Since 1.28.0 The contract of this method is not fully defined and its write capabilities overlap with applySettings
	 */
	Element.prototype.prop = function(sPropertyName, oValue) {

		var oPropertyInfo = this.getMetadata().getAllSettings()[sPropertyName];
		if (oPropertyInfo) {
			if (arguments.length == 1) {
				// getter
				return this[oPropertyInfo._sGetter]();
			} else {
				// setter
				this[oPropertyInfo._sMutator](oValue);
				return this;
			}
		}
	};

	Element.prototype.insertDependent = function(oControl, iIndex) {
		return this.insertAggregation("dependents", oControl, iIndex, true);
	};

	Element.prototype.addDependent = function(oControl) {
		return this.addAggregation("dependents", oControl, true);
	};

	Element.prototype.removeDependent = function(vControl) {
		return this.removeAggregation("dependents", vControl, true);
	};

	Element.prototype.removeAllDependents = function() {
		return this.removeAllAggregation("dependents", true);
	};

	Element.prototype.destroyDependents = function() {
		return this.destroyAggregation("dependents", true);
	};


	/// cyclic dependency
	//jQuery.sap.require("sap.ui.core.TooltipBase"); /// cyclic dependency


	/**
	 * This triggers immediate rerendering of its parent and thus of itself and its children.<br/> As <code>sap.ui.core.Element</code> "bubbles up" the
	 * rerender, changes to child-<code>Elements</code> will also result in immediate rerendering of the whole sub tree.
	 * @protected
	 */
	Element.prototype.rerender = function() {
		if (this.oParent) {
			this.oParent.rerender();
		}
	};


	/**
	 * Returns the UI area of this element, if any.
	 *
	 * @return {sap.ui.core.UIArea} The UI area of this element or null
	 * @private
	 */
	Element.prototype.getUIArea = function() {
		return this.oParent ? this.oParent.getUIArea() : null;
	};

	/**
	 * Cleans up the resources associated with this element and all its children.
	 *
	 * After an element has been destroyed, it can no longer be used in the UI!
	 *
	 * Applications should call this method if they don't need the element any longer.
	 *
	 * @param {boolean}
	 *            [bSuppressInvalidate] if true, the UI element is not marked for redraw
	 * @public
	 */
	Element.prototype.destroy = function(bSuppressInvalidate) {

		// update the focus information (potentionally) stored by the central UI5 focus handling
		Element._updateFocusInfo(this);

		ManagedObject.prototype.destroy.call(this, bSuppressInvalidate);

		// remove this control from DOM, e.g. if there is no parent (e.g. Dialog or already removed control) or this.sParentAggregationName is not properly set
		if (bSuppressInvalidate !== "KeepDom") {
			this.$().remove();
		} else {
			jQuery.sap.log.debug("DOM is not removed on destroy of " + this);
		}
	};


	/**
	 * Fires the given event and notifies all listeners. Listeners must not change
	 * the content of the event.
	 *
	 * @param {string} sEventId the event id
	 * @param {object} mParameters the parameter map
	 * @return {sap.ui.core.Element} Returns <code>this</code> to allow method chaining
	 * @protected
	 */
	Element.prototype.fireEvent = function(sEventId, mParameters) {
		if (this.hasListeners(sEventId)) {
			jQuery.sap.interaction.notifyStepStart(this);
		}
		// clone 'arguments' and modify clone to be strict mode compatible
		var aArgs = Array.prototype.slice.apply(arguments);
		// TODO 'id' is somewhat redundant to getSource(), but it is commonly used - fade out with next major release?
		aArgs[1] = mParameters = mParameters || {};
		mParameters.id = mParameters.id || this.getId();
		// 'aArgs' is necessary, as the ManagedObject.fireEvent signature has more parameters
		return ManagedObject.prototype.fireEvent.apply(this, aArgs);
	};


	/**
	 * Adds a delegate that listens to the events of this element.
	 *
	 * Note that the default behavior (delegate attachments are not cloned when a control is cloned) is usually the desired behavior in control development
	 * where each control instance typically creates a delegate and adds it to itself. (As opposed to application development where the application may add
	 * one delegate to a template and then expects aggregation binding to add the same delegate to all cloned elements.)
	 *
	 * To avoid double registrations, all registrations of the given delegate are first removed and then the delegate is added.
	 *
	 * @param {object} oDelegate the delegate object
	 * @param {boolean} [bCallBefore=false] if true, the delegate event listeners are called before the event listeners of the element; default is "false". In order to also set bClone, this parameter must be given.
	 * @param {object} [oThis] if given, this object will be the "this" context in the listener methods; default is the delegate object itself
	 * @param {boolean} [bClone=false] if true, this delegate will also be attached to any clones of this element; default is "false"
	 * @return {sap.ui.core.Element} Returns <code>this</code> to allow method chaining
	 * @private
	 */
	Element.prototype.addDelegate = function (oDelegate, bCallBefore, oThis, bClone) {
		jQuery.sap.assert(oDelegate, "oDelegate must be not null or undefined");

		if (!oDelegate) {
			return this;
		}

		this.removeDelegate(oDelegate);

		// shift parameters
		if (typeof bCallBefore === "object") {
			bClone = oThis;
			oThis = bCallBefore;
			bCallBefore = false;
		}

		if (typeof oThis === "boolean") {
			bClone = oThis;
			oThis = undefined;
		}

		(bCallBefore ? this.aBeforeDelegates : this.aDelegates).push({oDelegate:oDelegate, bClone: !!bClone, vThis: ((oThis === this) ? true : oThis)}); // special case: if this element is the given context, set a flag, so this also works after cloning (it should be the cloned element then, not the given one)
		return this;
	};

	/**
	 * Removes the given delegate from this element.
	 *
	 * This method will remove all registrations of the given delegate, not only one.
	 * If the delegate was marked to be cloned and this element has been cloned, the delegate will not be removed from any clones.
	 *
	 * @param {object} oDelegate the delegate object
	 * @return {sap.ui.core.Element} Returns <code>this</code> to allow method chaining
	 * @private
	 */
	Element.prototype.removeDelegate = function (oDelegate) {
		for (var i = 0;i < this.aDelegates.length;i++) {
			if (this.aDelegates[i].oDelegate == oDelegate) {
				this.aDelegates.splice(i,1);
			}
		}
		for (var i = 0;i < this.aBeforeDelegates.length;i++) {
			if (this.aBeforeDelegates[i].oDelegate == oDelegate) {
				this.aBeforeDelegates.splice(i,1);
			}
		}
		return this;
	};


	/**
	 * Adds a delegate that listens to the events that are fired on this element (as opposed to events which are fired BY this element).
	 *
	 * When this element is cloned, the same delegate will be added to all clones. This behavior is well-suited for applications which want to add delegates
	 * that also work with templates in aggregation bindings.
	 * For control development the internal "addDelegate" method which does not clone delegates by default may be more suitable, as typically each control instance takes care of its own delegates.
	 *
	 * To avoid double registrations, all registrations of the given delegate are first
	 * removed and then the delegate is added.
	 *
	 * <strong>Important:</strong> If event delegates were added the delegate will still be called even if
	 * the event was processed and/or cancelled via <code>preventDefault</code> by the Element or another event delegate.
	 * <code>preventDefault</code> only prevents the event from bubbling.
	 * It should be checked e.g. in the event delegate's listener whether an Element is still enabled via <code>getEnabled</code>.
	 * Additionally there might be other things that delegates need to check depending on the event
	 * (e.g. not adding a key twice to an output string etc.).
	 *
	 * @param {object} oDelegate the delegate object
	 * @param {object} [oThis] if given, this object will be the "this" context in the listener methods; default is the delegate object itself
	 * @return {sap.ui.core.Element} Returns <code>this</code> to allow method chaining
	 * @since 1.9.0
	 * @public
	 */
	Element.prototype.addEventDelegate = function (oDelegate, oThis) {
		return this.addDelegate(oDelegate, false, oThis, true);
	};

	/**
	 * Removes the given delegate from this element.
	 *
	 * This method will remove all registrations of the given delegate, not only one.
	 *
	 * @param {object} oDelegate the delegate object
	 * @return {sap.ui.core.Element} Returns <code>this</code> to allow method chaining
	 * @since 1.9.0
	 * @public
	 */
	Element.prototype.removeEventDelegate = function (oDelegate) {
		return this.removeDelegate(oDelegate);
	};

	/**
	 * Returns the DOM Element that should get the focus.
	 *
	 * To be overwritten by the specific control method.
	 *
	 * @return {Element} Returns the DOM Element that should get the focus
	 * @protected
	 */
	Element.prototype.getFocusDomRef = function () {
		return this.getDomRef() || null;
	};

	/**
	 * Sets the focus to the stored focus DOM reference
	 * @public
	 */
	Element.prototype.focus = function () {
		jQuery.sap.focus(this.getFocusDomRef());
	};

	/**
	 * Returns an object representing the serialized focus information
	 * To be overwritten by the specific control method
	 * @type object
	 * @return an object representing the serialized focus information
	 * @protected
	 */
	Element.prototype.getFocusInfo = function () {
		return {id:this.getId()};
	};

	/**
	 * Applies the focus info.
	 *
	 * To be overwritten by the specific control method.
	 *
	 * @param {object} oFocusInfo
	 * @protected
	 */
	Element.prototype.applyFocusInfo = function (oFocusInfo) {
		this.focus();
		return this;
	};


	/**
	 * @see sap.ui.core.Element#setTooltip
	 * @private
	 */
	Element.prototype._refreshTooltipBaseDelegate = function (oTooltip) {
		var oOldTooltip = this.getTooltip();
		// if the old tooltip was a Tooltip object, remove it as a delegate
		if (oOldTooltip instanceof sap.ui.core.TooltipBase) {
			this.removeDelegate(oOldTooltip);
		}
		// if the new tooltip is a Tooltip object, add it as a delegate
		if (oTooltip instanceof sap.ui.core.TooltipBase) {
			oTooltip._currentControl = this;
			this.addDelegate(oTooltip);
		}
	};


	/**
	 * Sets a new tooltip for this object. The tooltip can either be a simple string
	 * (which in most cases will be rendered as the <code>title</code> attribute of this
	 * Element) or an instance of {@link sap.ui.core.TooltipBase}.
	 *
	 * If a new tooltip is set, any previously set tooltip is deactivated.
	 *
	 * @param {string|sap.ui.core.TooltipBase} vTooltip
	 * @public
	 */
	Element.prototype.setTooltip = function(vTooltip) {

		this._refreshTooltipBaseDelegate(vTooltip);
		this.setAggregation("tooltip", vTooltip);

		return this;
	};

	/**
	 * Returns the tooltip for this element if any or an undefined value.
	 * The tooltip can either be a simple string or a subclass of
	 * {@link sap.ui.core.TooltipBase}.
	 *
	 * Callers that are only interested in tooltips of type string (e.g. to render
	 * them as a <code>title</code> attribute), should call the convenience method
	 * {@link #getTooltip_AsString} instead. If they want to get a tooltip text no
	 * matter where it comes from (be it a string tooltip or the text from a TooltipBase
	 * instance) then they could call {@link #getTooltip_Text} instead.
	 *
	 * @return {string|sap.ui.core.TooltipBase} The tooltip for this Element.
	 * @public
	 */
	Element.prototype.getTooltip = function() {
		return this.getAggregation("tooltip");
	};

	Element.runWithPreprocessors = ManagedObject.runWithPreprocessors;

	/**
	 * Returns the tooltip for this element but only if it is a simple string.
	 * Otherwise an undefined value is returned.
	 *
	 * @return {string} string tooltip or undefined
	 * @public
	 */
	Element.prototype.getTooltip_AsString = function() {
		var oTooltip = this.getTooltip();
		if (typeof oTooltip === "string" || oTooltip instanceof String ) {
			return oTooltip;
		}
		return undefined;
	};

	/**
	 * Returns the main text for the current tooltip or undefined if there is no such text.
	 * If the tooltip is an object derived from sap.ui.core.Tooltip, then the text property
	 * of that object is returned. Otherwise the object itself is returned (either a string
	 * or undefined or null).
	 *
	 * @return {string} text of the current tooltip or undefined
	 * @public
	 */
	Element.prototype.getTooltip_Text = function() {
		var oTooltip = this.getTooltip();
		if (oTooltip && typeof oTooltip.getText === "function" ) {
			return oTooltip.getText();
		}
		return oTooltip;
	};

	/**
	 * Destroys the tooltip in the aggregation
	 * named <code>tooltip</code>.
	 * @return {sap.ui.core.Element} <code>this</code> to allow method chaining
	 * @public
	 * @name sap.ui.core.Element#destroyTooltip
	 * @function
	 */

	/**
	 * Returns the runtime metadata for this UI element.
	 *
	 * When using the defineClass method, this function is automatically created and returns
	 * a runtime representation of the design time metadata.
	 *
	 * @function
	 * @name sap.ui.core.Element.prototype.getMetadata
	 * @return {object} runtime metadata
	 * @public
	 */
	// sap.ui.core.Element.prototype.getMetadata = sap.ui.base.Object.ABSTRACT_METHOD;

	//data container

	(function(){

		/**
		 * Returns the data object with the given key
		 */
		var getDataObject = function(element, key) {
			var aData = element.getAggregation("customData");
			if (aData) {
				for (var i = 0; i < aData.length; i++) {
					if (aData[i].getKey() == key) {
						return aData[i];
					}
				}
			}
			return null;
		};

		/**
		 * Contains the data modification logic
		 */
		var setData = function(element, key, value, writeToDom) {

			// DELETE
			if (value === null) { // delete this property
				var dataObject = getDataObject(element, key);
				if (!dataObject) {
					return;
				}

				var dataCount = element.getAggregation("customData").length;
				if (dataCount == 1) {
					element.destroyAggregation("customData", true); // destroy if there is no other data
				} else {
					element.removeAggregation("customData", dataObject, true);
					dataObject.destroy();
				}

				// ADD or CHANGE
			} else {
				var dataObject = getDataObject(element, key);
				if (dataObject) {
					dataObject.setValue(value);
					dataObject.setWriteToDom(writeToDom);
				} else {
					var dataObject = new sap.ui.core.CustomData({key:key,value:value, writeToDom:writeToDom});
					element.addAggregation("customData", dataObject, true);
				}
			}
		};

		/**
		 * Attaches custom data to an Element or retrieves attached data.
		 *
		 * Usage:
		 *    data("myKey", myData)
		 * attaches myData (which can be any JS data type, e.g. a number, a string, an object, or a function) to this element, under the given key "myKey". If the key already exists,the value will be updated.
		 *
		 *    data("myKey", myData, writeToDom)
		 * attaches myData to this element, under the given key "myKey" and (if writeToDom is true) writes key and value to the HTML. If the key already exists,the value will be updated. While oValue can be any JS data type to be attached, it must be a string to be also written to DOM. The key must also be a valid HTML attribute name (it must conform to sap.ui.core.ID and may contain no colon) and may not start with "sap-ui". When written to HTML, the key is prefixed with "data-".
		 *
		 *    data("myKey")
		 * retrieves whatever data has been attached to this Element (using the key "myKey") before
		 *
		 *    data("myKey", null)
		 * removes whatever data has been attached to this Element (using the key "myKey") before
		 *
		 *    data(null)
		 * removes all data
		 *
		 *    data()
		 * returns all data, as a map
		 *
		 * @public
		 */
		Element.prototype.data = function() {
			var argLength = arguments.length;

			if (argLength == 0) {                    // return ALL data as a map
				var aData = this.getAggregation("customData"),
					result = {};
				if (aData) {
					for (var i = 0; i < aData.length; i++) {
						result[aData[i].getKey()] = aData[i].getValue();
					}
				}
				return result;

			} else if (argLength == 1) {
				var arg0 = arguments[0];

				if (arg0 === null) {                  // delete ALL data
					this.destroyAggregation("customData", true); // delete whole map
					return this;

				} else if (typeof arg0 == "string") { // return requested data element
					var dataObject = getDataObject(this, arg0);
					return dataObject ? dataObject.getValue() : null;

				} else if (typeof arg0 == "object") { // should be a map - set multiple data elements
					for (var key in arg0) { // TODO: improve performance and avoid executing setData multiple times
						setData(this, key, arg0[key]);
					}
					return this;

				} else {
					// error, illegal argument
					throw new Error("When data() is called with one argument, this argument must be a string, an object or null, but is " + (typeof arg0) + ":" + arg0 + " (on UI Element with ID '" + this.getId() + "')");
				}

			} else if (argLength == 2) {            // set or remove one data element
				setData(this, arguments[0], arguments[1]);
				return this;

			} else if (argLength == 3) {            // set or remove one data element
				setData(this, arguments[0], arguments[1], arguments[2]);
				return this;

			} else {
				// error, illegal arguments
				throw new Error("data() may only be called with 0-3 arguments (on UI Element with ID '" + this.getId() + "')");
			}
		};

	})();

	/**
	 * Clone delegates
	 * @param {string} [sIdSuffix] a suffix to be appended to the cloned element id
	 * @param {string[]} [aLocalIds] an array of local IDs within the cloned hierarchy (internally used)
	 * @return {sap.ui.base.ManagedObject} reference to the newly created clone
	 * @protected
	 */
	Element.prototype.clone = function(sIdSuffix, aLocalIds){

		var oClone = ManagedObject.prototype.clone.apply(this, arguments);
		// Clone delegates
		for ( var i = 0; i < this.aDelegates.length; i++) {
			if (this.aDelegates[i].bClone) {
				oClone.aDelegates.push(this.aDelegates[i]);
			}
		}
		for ( var i = 0; i < this.aBeforeDelegates.length; i++) {
			if (this.aBeforeDelegates[i].bClone) {
				oClone.aBeforeDelegates.push(this.aBeforeDelegates[i]);
			}
		}

		return oClone;
	};

	/**
	* Searches and returns an array of child elements and controls which are
	* referenced within an aggregation or aggregations of child elements/controls.
	* This can be either done recursive or not.
	* <br>
	* <b>Take care: this operation might be expensive.</b>
	* @param {boolean}
	*          bRecursive true, if all nested children should be returned.
	* @return {sap.ui.core.Element[]} array of child elements and controls
	* @public
	*/
	Element.prototype.findElements = function(bRecursive) {
		var aControls = ManagedObject.prototype.findAggregatedObjects.call(this, bRecursive);
		return aControls;
	};

	/**
	 * Sets the {@link sap.ui.core.LayoutData} defining the layout constraints
	 * for this control when it is used inside a layout.
	 *
	 * @param {sap.ui.core.LayoutData} oLayoutData
	 * @public
	 */
	Element.prototype.setLayoutData = function(oLayoutData) {
		this.setAggregation("layoutData", oLayoutData, true); // No invalidate because layout data changes does not affect the control / element itself
		var oLayout = this.getParent();
		if (oLayout) {
			var oEvent = jQuery.Event("LayoutDataChange");
			oEvent.srcControl = this;
			oLayout._handleEvent(oEvent);
		}
		return this;
	};

	/**
	 * Allows the parent of a control to enhance the aria information during rendering
	 *
	 * This function is called by the RenderManager's writeAccessibilityState method
	 * for the parent of the currently rendered control - if the parent implements it.
	 *
	 * @function
	 * @name sap.ui.core.Element.prototype.enhanceAccessibilityState
	 * @param {sap.ui.core.Element} oElement the Control/Element for which aria properties are rendered
	 * @param {object} mAriaProps map of aria properties keyed by there name (withour prefix "aria-")
	 * @return {object} map of enhanced aria properties
	 * @protected
	 * @abstract
	 */

	/**
	 * Bind the object to the referenced entity in the model, which is used as the binding context
	 * to resolve bound properties or aggregations of the object itself and all of its children
	 * relatively to the given path.
	 * If a relative binding path is used, this will be applied whenever the parent context changes.
	 * @param {string|object} vPath the binding path or an object with more detailed binding options
	 * @param {string} vPath.path the binding path
	 * @param {object} [vPath.parameters] map of additional parameters for this binding
	 * @param {string} [vPath.model] name of the model
	 * @param {object} [vPath.events] map of event listeners for the binding events
	 * @param {object} [mParameters] map of additional parameters for this binding (only taken into account when vPath is a string)
	 *
	 * @return {sap.ui.base.ManagedObject} reference to the instance itself
	 * @public
	 */
	Element.prototype.bindElement = function(sPath, mParameters) {
		return this.bindObject(sPath, mParameters);
	};

	/**
	 * Removes the defined binding context of this object, all bindings will now resolve
	 * relative to the parent context again.
	 *
	 * @param {string} sModelName
	 * @return {sap.ui.base.ManagedObject} reference to the instance itself
	 * @public
	 */
	Element.prototype.unbindElement = function(sModelName) {
		return this.unbindObject(sModelName);
	};

	/**
	 * Get the element binding object for a specific model
	 *
	 * @param {string} sModelName the name of the model
	 * @return {sap.ui.model.Binding} the element binding for the given model name
	 * @public
	 */
	Element.prototype.getElementBinding = function(sModelName){
		return this.getObjectBinding(sModelName);
	};

	return Element;

});
