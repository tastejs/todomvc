/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.core.ComponentContainer.
sap.ui.define(['./Control', './Component', './Core', './library'],
	function(Control, Component, Core, library) {
	"use strict";


	/**
	 * Constructor for a new ComponentContainer.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Component Container
	 * @extends sap.ui.core.Control
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.core.ComponentContainer
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var ComponentContainer = Control.extend("sap.ui.core.ComponentContainer", /** @lends sap.ui.core.ComponentContainer.prototype */ { metadata : {
	
		library : "sap.ui.core",
		properties : {
	
			/**
			 * Component name, the package where the component is contained. The property can only be applied initially.
			 */
			name : {type : "string", defaultValue : null},
	
			/**
			 * The URL of the component. The property can only be applied initially.
			 */
			url : {type : "sap.ui.core.URI", defaultValue : null},
			
			/**
			 * Enable/disable validation handling by MessageManager for this component.
			 * The resulting Messages will be propagated to the controls.
			 */
			handleValidation : {type : "boolean", defaultValue : false},
	
			/**
			 * The settings object passed to the component when created. The property can only be applied initially.
			 */
			settings : {type : "object", defaultValue : null},
	
			/**
			 * Defines whether binding information is propagated to the component.
			 */
			propagateModel : {type : "boolean", defaultValue : false},
	
			/**
			 * Container width in CSS size
			 */
			width : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : null},
	
			/**
			 * Container height in CSS size
			 */
			height : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : null}
		},
		associations : {
	
			/**
			 * The component displayed in this ComponentContainer.
			 */
			component : {type : "sap.ui.core.UIComponent", multiple : false}
		}
	}});
	
	/**
	 * Returns the real component instance which is associated with the container.
	 * @return {sap.ui.core.UIComponent} the component instance
	 */
	ComponentContainer.prototype.getComponentInstance = function () {
		var sComponentId = this.getComponent();
		return sap.ui.getCore().getComponent(sComponentId);
	};
	
	
	/*
	 * TODO: make sure once a component is assigned to the container it cannot be 
	 * exchanged later when the container is rendered.
	 * 
	 * Exchanging the component via setComponent is still required - see existing
	 * examples in sap/ui/core/ComponentShell.html - but this opens up another
	 * question which was not answered before - what to do here when exchanging
	 * the component - destroy or not? Right now we at least unlink the container. 
	 */
	ComponentContainer.prototype.setComponent = function(oComponent, bSupressInvalidate) {
		// unlink the old component from the container
		var oOldComponent = this.getComponentInstance();
		if (oOldComponent) {
			// TODO: destroy or not destroy 
			oOldComponent.setContainer(undefined);
		}
		// set the new component
		this.setAssociation("component", oComponent, bSupressInvalidate);
		// cross link the new component and propagate the properties (models)
		oComponent = this.getComponentInstance();
		if (oComponent) {
			oComponent.setContainer(this);
			this.propagateProperties();
		}
	};
	
	
	/*
	 * delegate the onBeforeRendering to the component instance
	 */
	ComponentContainer.prototype.onBeforeRendering = function(){
	
		// check if we have already a valid component instance
		// in this case we skip the component creation via props
		// ==> not in applySettings to make sure that components are lazy instantiated,
		//     e.g. in case of invisible containers the component will not be created
		//     immediately in the constructor.
		var oComponent = this.getComponentInstance();
		if (!oComponent) {
			// create the component / link to the container (if a name is given)
			var sName = this.getName();
			if (sName) {
				oComponent = sap.ui.component({
					name: sName,
					url: this.getUrl(),
					handleValidation: this.getHandleValidation(),
					settings: this.getSettings()
				});
				this.setComponent(oComponent, true);
			}
		}
	
		// delegate the onBeforeRendering to the component instance
		if (oComponent && oComponent.onBeforeRendering) {
			oComponent.onBeforeRendering();
		}
		
	};
	
	/*
	 * delegate the onAfterRendering to the component instance
	 */
	ComponentContainer.prototype.onAfterRendering = function(){
		var oComponent = this.getComponentInstance();
		if (oComponent && oComponent.onAfterRendering) {
			oComponent.onAfterRendering();
		}
	};
	
	
	/*
	 * once the container is destroyed we also destroy the component 
	 */
	ComponentContainer.prototype.exit = function(){
		var oComponent = this.getComponentInstance();
		if (oComponent) {
			oComponent.destroy();
		}
	};
	
	
	/*
	 * overridden to support property propagation to the associated component
	 */
	ComponentContainer.prototype.propagateProperties = function (vName) {
		var oComponent = this.getComponentInstance();
		if (oComponent && this.getPropagateModel()) {
			this._propagateProperties(vName, oComponent);
			Control.prototype.propagateProperties.apply(this, arguments);
		}
	};

	/*
	 * overridden to support property propagation to the associated component 
	 * when unbinding the component container (e.g. call unbindElement)
	 */
	ComponentContainer.prototype.unbindObject = function (sModelName, /* internal use only */ _bSkipUpdateBindingContext) {
		Control.prototype.unbindObject.apply(this, arguments);
		this.propagateProperties(sModelName);
	};

	return ComponentContainer;

});
