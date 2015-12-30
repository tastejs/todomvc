/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides base class sap.ui.core.tmpl.Template for all templates
sap.ui.define(['jquery.sap.global', 'sap/ui/base/ManagedObject', 'sap/ui/core/Control'],
	function(jQuery, ManagedObject, Control) {
	"use strict";


	/**
	 * Creates and initializes a new template with the given <code>sId</code> and
	 * settings.
	 * 
	 * The set of allowed entries in the <code>mSettings</code> object depends on
	 * the concrete subclass and is described there. 
	 * 
	 * @param {string}
	 *            [sId] optional id for the new template; generated automatically if
	 *            no non-empty id is given Note: this can be omitted, no matter
	 *            whether <code>mSettings</code> will be given or not!
	 * @param {object}
	 *            [mSettings] optional map/JSON-object with initial settings for the
	 *            new component instance
	 * @public
	 * 
	 * @class Base Class for Template.
	 * @extends sap.ui.base.ManagedObject
	 * @abstract
	 * @author SAP SE
	 * @version 1.32.9
	 * @alias sap.ui.core.tmpl.Template
	 * @experimental Since 1.15.0. The Template concept is still under construction, so some implementation details can be changed in future.
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var Template = ManagedObject.extend("sap.ui.core.tmpl.Template", /** @lends sap.ui.core.tmpl.Template.prototype */
	{
		
		constructor : function(sId, mSettings) {
			ManagedObject.apply(this, arguments);
		},
	
		metadata : {
			stereotype : "template",
			"abstract" : true,
			library : "sap.ui.core",
			properties : {
				/**
				 * The Template definition as a String.
				 */
				"content" : {type : "string", group : "Data", defaultValue : null}
			},
			publicMethods : [
				// methods
				"declareControl", /* protected */
				"createControl",  /* protected */
				"placeAt",
				"createMetadata",
				"createRenderer"
			]
		}
	
	});

	var mTemplates = {};
	
	/**
	 * @private
	 */
	Template.prototype.register = function() {
		var sId = this.getId(),
			oOldTemplate = mTemplates[sId],
			sMsg;

		if ( oOldTemplate && this !== oOldTemplate ) {
			sMsg = "adding template with duplicate id '" + sId + "'";
			jQuery.sap.log.error(sMsg);
			throw new Error("Error: " + sMsg);
		}
		
		mTemplates[sId] = this;
	};
	
	/**
	 * @private
	 */
	Template.prototype.deregister = function() {
		delete mTemplates[this.getId()];
	};

	/**
	 * Returns the registered template for the given id, if any.
	 * @param {string} sId
	 * @return {sap.ui.core.tmpl.Template} the template for the given id
	 * @public
	 */
	Template.byId = function(sId) {
		return mTemplates[sId];
	};
	
	/**
	 * @see sap.ui.base.Object#getInterface
	 * @public
	 */
	Template.prototype.getInterface = function() {
		return this;
	};
	
	/**
	 * registry for supported template types
	 * @private
	 */
	Template._mSupportedTypes = {};
	
	
	/**
	 * Registers a new Template type which is used to compile the template.
	 * 
	 * @param {string} sType type of the template
	 * @param {string} sClass the class of the specifc Template element
	 * 
	 * @static
	 */
	Template.registerType = function(sType, sClass) {
		Template._mSupportedTypes[sType] = sClass;
	};
	
	/**
	 * Unregisters a Template type which is used to compile the template.
	 * 
	 * @param {string} sType type of the template
	 * 
	 * @static
	 */
	Template.unregisterType = function(sType) {
		delete Template._mSupportedTypes[sType];
	};
	
	
	/**
	 * parses the given path and extracts the model and path
	 * 
	 * @param {string} sPath the path
	 * @return {object} the model and the path 
	 *
	 * @protected
	 * @static
	 */
	Template.parsePath = function(sPath) {
	
		// TODO: wouldn't this be something central in ManagedObject?
	
		// parse the path
		var sModelName,
			iSeparatorPos = sPath.indexOf(">");
	
		// if a model name is specified in the binding path
		// we extract this binding path
		if (iSeparatorPos > 0) {
			sModelName = sPath.substr(0, iSeparatorPos);
			sPath = sPath.substr(iSeparatorPos + 1);
		}
		
		// returns the path information 
		return {
			path: sPath,
			model: sModelName
		};
			
	};
						
	/*
	 * overridden to prevent instantiation of Template
	 * @name sap.ui.core.tmpl.Template#init
	 * @function
	 */
	Template.prototype.init = function(mSettings, oScope) {
		if (this.getMetadata().getName() === "sap.ui.core.tmpl.Template") {
			throw new Error("The class 'sap.ui.core.tmpl.Template' is abstract and must not be instantiated!");
		}
		// check for complex binding syntax
		if (ManagedObject.bindingParser === sap.ui.base.BindingParser.complexParser) {
			/*
			 * we disable the complex binding parser for Templates
			 * TODO: reconsider a better solution later
			 * @name sap.ui.core.tmpl.Template#extractBindingInfo
			 * @function
			 */
			Template.prototype.extractBindingInfo = function(oValue, bIgnoreObjects, oScope) {
				ManagedObject.bindingParser = sap.ui.base.BindingParser.simpleParser;
				var oReturnValue = Control.prototype.extractBindingInfo.apply(this, arguments);
				ManagedObject.bindingParser = sap.ui.base.BindingParser.complexParser;
				return oReturnValue;
			};
		}
	};
	
	
	/**
	 * Declares a new control based on this template and returns the created 
	 * class / constructor function. The class is based on the information coming 
	 * from the abstract functions <code>createMetadata</code> and 
	 * <code>createRenderer</code>.
	 * 
	 * @param {string} sControl the fully qualified name of the control
	 * @return {function} the created class / constructor function
	 * @public
	 */
	Template.prototype.declareControl = function(sControl) {
	
		jQuery.sap.assert(!!sControl, "A fully qualified name must be specified!");
		
		if (sControl) {
			
			// create the new control type
			var oMetadata = this.createMetadata(),
				fnRenderer = this.createRenderer(),
				that = this;
			jQuery.sap.require("sap.ui.core.tmpl.TemplateControl");
			sap.ui.core.tmpl.TemplateControl.extend(sControl, {
				
				// the new control metadata
				metadata: oMetadata,
				
				// set the reference to the template
				init: function() {
					sap.ui.core.tmpl.TemplateControl.prototype.init.apply(this, arguments);
					// link to the template
					this.setTemplate(that);
				},
	
				// add the custom renderer function
				renderer: {
					renderTemplate: fnRenderer,
					hasControlData: oMetadata._hasControlData
				}
				
			});
			
			// returns the constructor function
			return jQuery.sap.getObject(sControl);
					
		}
	
	};
	
	
	/**
	 * Creates an anonymous TemplateControl for the Template.
	 * 
	 * @param {string} sId the control ID
	 * @param {object} [oContext] the context for the renderer/templating
	 * @param {sap.ui.core.mvc.View} oView
	 * @return {sap.ui.core.tmpl.TemplateControl} the created control instance
	 * @public
	 */
	Template.prototype.createControl = function(sId, oContext, oView) {
		
		// create the anonymous control instance
		jQuery.sap.require("sap.ui.core.tmpl.TemplateControl");
		var oControl = new sap.ui.core.tmpl.TemplateControl({
		  id: sId,
		  template: this,
		  context: oContext
		});
		
		// for anonymous controls the renderer functions is added to the control instance
		oControl.setTemplateRenderer(this.createRenderer(oView));
		
		// return the control
		return oControl;
			
	};
	
	
	/**
	 * Creates an anonymous TemplateControl for the Template and places the control 
	 * into the specified DOM element.
	 * 
	 * @param {string|DomRef} oRef the id or the DOM reference where to render the template
	 * @param {object} [oContext] The context to use to evaluate the Template. It will be applied as value for the context property of the created control.
	 * @param {string|int} [vPosition] Describes the position where the control should be put into the container
	 * @param {boolean} bInline
	 * @return {sap.ui.core.tmpl.TemplateControl} the created control instance
	 * @public
	 */
	Template.prototype.placeAt = function(oRef, oContext, vPosition, bInline) {
	
		// parameter fallback
		if (typeof oContext === "string" || typeof oContext === "number") {
			vPosition = oContext;
			oContext = undefined;
		}
		
		// if the oRef is an ID or DomRef and the template should be rendered
		// inline we lookup the context from DOM element and mark the template
		// as an inline template to avoid additional elements around the template.
		var sId;
		if (!(oRef instanceof Control) && bInline) {
			
			// lookup the DOM element in which to place the template
			var $this = typeof oRef === "string" ? jQuery.sap.byId(oRef) : jQuery(oRef);
	
			// the DOM element must exist
			if ($this.length > 0) {
	
				// reuse the id for the template control
				sId = $this.attr("id");
				oRef = $this.get(0);
				
				// by default the context coming from sap.ui.template method will be used   
				// but it can be also defined on the root DOM element for inline templates
				// in case of inline templates we mark them
				var sContext = $this.attr("data-context");
				oContext = oContext || sContext && jQuery.parseJSON(sContext);
	
				// mark the template as inline template (to avoid extra DOM for the TemplateControl)
				// for inline templates the UIArea and the TemplateControl are the same DOM element  
				sap.ui.core.RenderManager.markInlineTemplate($this);
				
			}
			
		}
		
		// create the control (ID will be generated if not inline)
		var oControl = this.createControl(sId, oContext);
	
		// render the control into the specified domref
		oControl.placeAt(oRef, vPosition);
		
		// return the control
		return oControl;
			
	};
	
	
	/**
	 * Returns the metadata object for the new Control class. 
	 * This function needs to be implemented by sub classes of the Template.
	 * 
	 * @return {object} the metadata object of the new control class
	 * @abstract
	 */
	Template.prototype.createMetadata = function() {
		jQuery.sap.log.error("The function createMetadata is an abstract function which needs to be implemented by subclasses.");
	};
	
	
	/**
	 * Returns the renderer function for the new Control class.
	 * This function needs to be implemented by sub classes of the Template.
	 * 
	 * @return {any} the renderer function for the new Control class.
	 * @abstract
	 */
	Template.prototype.createRenderer = function() {
		jQuery.sap.log.error("The function createRenderer is an abstract function which needs to be implemented by subclasses.");
	};
	
	
	
	/**
	 * Creates a Template for the given id, dom reference or a configuration object.
	 * If no parameter is defined this function makes a lookup of DOM elements 
	 * which are specifying a type attribute. If the value of this type attribute
	 * matches an registered type then the content of this DOM element will be 
	 * used to create a new <code>Template</code> instance.
	 * 
	 * If you want to lookup all kind of existing and known templates and parse them
	 * directly you can simply call:
	 * <pre> 
	 *   sap.ui.template();
	 * </pre>
	 * 
	 * To parse a concrete DOM element you can do so by using this function in the 
	 * following way:
	 * <pre>
	 *   sap.ui.template("theTemplateId");
	 * </pre>
	 * 
	 * Or you can pass the reference to a DOM element and use this DOM element as 
	 * a source for the template:
	 * <pre>
	 *   sap.ui.template(oDomRef);
	 * </pre>
	 * 
	 * The last option to use this function is to pass the information via a 
	 * configuration object. This configuration object can be used to pass a 
	 * context for the templating framework when compiling the template:
	 * <pre>
	 *   var oTemplateById = sap.ui.template({
	 *     id: "theTemplateId",
	 *     context: { ... }
	 *   });
	 *
	 *   var oTemplateByDomRef = sap.ui.template({
	 *     domref: oDomRef,
	 *     context: { ... }
	 *   });
	 * </pre>
	 * 
	 * It can also be used to load a template from another file:
	 * <pre>
	 *   var oTemplate = sap.ui.template({
	 *     id: "myTemplate",
	 *     src: "myTemplate.tmpl"
	 *   });
	 * 
	 *   var oTemplateWithContext = sap.ui.template({
	 *     id: "myTemplate",
	 *     src: "myTemplate.tmpl",
	 *     context: { ... }
	 *   });
	 * </pre>
	 *
	 * The properties of the configuration object are the following:
	 * <ul>
	 * <li><code>id</code> - the ID of the Template / the ID  of the DOM element containing the source of the Template</li>
	 * <li><code>domref</code> - the DOM element containing the source of the Template</li>
	 * <li><code>type</code> - the type of the Template</li>
	 * <li><code>src</code> - the URL to lookup the template</li> (<i>experimental!</i>)
	 * <li><code>control</code> - the fully qualified name of the control to declare</li> (<i>experimental!</i>)
	 * </ul>
	 * 
	 * @param {string|DomRef|object} [oTemplate] the id or the DOM reference to the template to lookup or an configuration object containing the src, type and eventually the id of the Template.
	 * @return {sap.ui.core.tmpl.Template | sap.ui.core.tmpl.Template[]} the created Template instance 
	 *         or in case of usage without parametes any array of templates is returned
	 * 
	 * @public
	 * @static
	 */
	sap.ui.template = function(oTemplate) {
	
		// when no oTemplate is defined we need to lookup the elements in the document
		// and retrieve elements which have a type attribute which contains a value
		// of the supported types: 
		if (!oTemplate) {
		
			// lookup all kind of DOM elements for having a type which is supported
			var aTemplates = [];
			jQuery.each(Template._mSupportedTypes, function(sType, sClass) {
				jQuery("script[type='" + sType + "'], [data-type='" + sType + "']").each(function(iIndex, oElement) {
					aTemplates.push(sap.ui.template({
						id: oElement.id,
						domref: oElement,
						type: sType,
						_class: sClass /* helper to save lookup time in the supported types */
					}));
				});
			});
			return aTemplates;
			
		} else {
		
			// check the settings for being a string or a DOM element
			if (typeof oTemplate === "string") {
				return sap.ui.template({
					id: oTemplate
				});
			} else if (oTemplate && oTemplate.tagName && oTemplate.nodeName && oTemplate.ownerDocument && oTemplate.nodeType === 1) {
				// instanceof HTMLElement only works for modern browsers!
				return sap.ui.template({
					id: oTemplate.id,
					domref: oTemplate
				});
			}
	
			// apply the default values
			oTemplate = jQuery.extend({
				type: Template.DEFAULT_TEMPLATE
			}, oTemplate);
	
			// in case of specifiying a src attribute for the configuration object
			// we load the template from a remote resource 
			var sId, sType, sControl, sContent, sController = false,
				bLoadTemplate = typeof oTemplate.src === "string",
				bInline = false;
			if (bLoadTemplate) {
			
				// load the template from the specified URL
				var oResponse = jQuery.sap.sjax({
					url : oTemplate.src,
					dataType: "text"
				});
				
				// apply the content as template content
				// set the id, type and control if defined in the object
				if (oResponse.success) {
					sId = oTemplate.id;
					sType = oTemplate.type;
					sControl = oTemplate.control;
					sContent = oResponse.data;
					
					//Check for inline template information
					var rTmplInfo = /^<!--\sUI5:Template\stype=([a-z\/\-]*)\s(?:controller=([A-Za-z.]*)\s)?-->/,
						aTmplInfo = sContent.match(rTmplInfo);
					if (aTmplInfo) {
						sType = aTmplInfo[1];
						if (aTmplInfo.length == 3) {
							sController = aTmplInfo[2];
						}
						sContent = sContent.substr(aTmplInfo[0].length);
					}
				} else {
					throw new Error("The template could not be loaded from " + oTemplate.src + "!");
				}
			
			} else {
				
				// retrieve the required properties
				var oElement = oTemplate.domref || jQuery.sap.domById(oTemplate.id),
					$element = jQuery(oElement);

				bInline = false;
	
				// lookup the missing properties
				sId = oTemplate.id || oElement && oElement.id;
				sType = $element.attr("type") || oTemplate.type;
				sControl = $element.attr("data-control") || oTemplate.control;
						
				// lookup if the template for the current id and check this element for
				// beeing a subclass of sap.ui.core.tmpl.Template and return the existing
				// instance if found
				if (sId) {
					var theTemplate = sap.ui.getCore().getTemplate(sId);
					if (!theTemplate instanceof Template) {
						throw new Error("Object for id \"" + sId + "\" is no sap.ui.core.tmpl.Template!");
					} else {
						if (theTemplate) {
							return theTemplate;
						}
					}
				}
				
				// the element to parse must exist
				if ($element.length === 0) {
					throw new Error("DOM element for the Template with the id \"" + sId + "\" not found!");
				}
				
				// retrieve the content 
				sContent = $element.html();

				// check the preconditions for rendering and set the render property
				// if the DOM ref is part of the documents body
				var sTagName = oElement.tagName.toLowerCase();
				if (sTagName !== "script") {
					bInline = $element.parents("body").length === 1;
				}
				
			}
			
			// if not class is given we fallback to the type attribute on the 
			// template defintion.
			var sClass = oTemplate._class;
			if (!sClass) {
				sClass = Template._mSupportedTypes[sType];
				if (!sClass) {
					//sType = sap.ui.core.tmpl.Template.DEFAULT_TEMPLATE;
					throw new Error("The type \"" + sType + "\" is not supported.");
				}
			}
	
			// require and instantiate the proper template
			jQuery.sap.require(sClass);
			var oClass = jQuery.sap.getObject(sClass);
				
			// create a new instance of the template
			var oInstance = new oClass({
				id: sId,
				content: sContent
			});
			
			// declare the control if specified
			if (sControl) {
				oInstance.declareControl(sControl);
			}
	
			// render inline templates immediately
			if (sController) {
				oInstance._sControllerName = sController;
			}
	
			// render inline templates immediately
			if (bInline) {
				oInstance.placeAt(sId, oTemplate.context, undefined, true);
			}
	
			// return the template instance
			return oInstance;
			
		}
		
	};
	
	// define and register the default template
	Template.DEFAULT_TEMPLATE = "text/x-handlebars-template";
	Template.registerType(Template.DEFAULT_TEMPLATE, "sap.ui.core.tmpl.HandlebarsTemplate");
	

	return Template;

});
