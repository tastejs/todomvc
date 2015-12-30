/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for control sap.ui.commons.Slider
sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	/**
	 * Slider renderer.
	 * @namespace
	 */
	var SliderRenderer = {
	};

	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.fw.RenderManager}.
	 *
	 * @param {sap.ui.fw.RenderManager} oRenderManager The RenderManager that can be used for writing to the render output buffer.
	 * @param {sap.ui.commons.Slider} oSlider An object representation of the control that should be rendered.
	 */
	SliderRenderer.render = function(oRenderManager, oSlider){
		// Convenience variable
		var rm = oRenderManager;

		// Write the HTML into the render manager
		rm.write('<DIV');
		rm.writeControlData(oSlider);
		rm.addClass('sapUiSli');
		this.controlAdditionalCode(rm,oSlider);
		if (oSlider.getTooltip_AsString()) {
			rm.writeAttributeEscaped('title', oSlider.getTooltip_AsString());
		}

		if (!oSlider.getVertical() && oSlider.getWidth()) {
			rm.writeAttribute('style', 'width:' + oSlider.getWidth() + ';');
		} else {
			rm.writeAttribute('style', 'height:' + oSlider.getHeight() + ';');
		}

		/* eslint-disable no-lonely-if */
		if (!oSlider.getEnabled()) {
			rm.addClass('sapUiSliDsbl');
		} else {
			if (!oSlider.getEditable()) {
				rm.addClass('sapUiSliRo');
			} else {
				rm.addClass('sapUiSliStd');
			}
		}
		if (oSlider.getVertical()) {
			rm.addClass('sapUiSliVert');
		} else {
			rm.addClass('sapUiSliHori');
		}

		rm.writeClasses();

		// invisible span with tooltip as text for aria on grip
		if (oSlider.getTooltip_AsString()) {
			rm.write('><SPAN id="' + oSlider.getId() + '-Descr" style="visibility: hidden; display: none;">');
			rm.writeEscaped(oSlider.getTooltip_AsString());
			rm.write('</SPAN');
		}

		// Write slide bar
		rm.write('><DIV');
		rm.writeAttribute('id', oSlider.getId() + '-right');
		rm.write('class="sapUiSliR" > <DIV');

		rm.writeAttribute('id', oSlider.getId() + '-left');
		rm.write('class="sapUiSliL" > <DIV');

		rm.writeAttribute('id', oSlider.getId() + '-bar');
		rm.write('class="sapUiSliBar" >');

		var useTextLabels = false;
		if (oSlider.getLabels() && oSlider.getLabels().length > 0) {
			useTextLabels = true;
		}

		if (oSlider.getTotalUnits() > 0 || useTextLabels) {

			var iTotalUnits = oSlider.getTotalUnits();
			if (useTextLabels) {
				iTotalUnits = oSlider.getLabels().length - 1;
			}

			var fStepSize = (oSlider.getMax() - oSlider.getMin()) / iTotalUnits;

			// Add ticks
			for (var i = 0; i <= iTotalUnits; i++) {
				rm.write('<DIV');
				rm.writeAttribute('id', oSlider.getId() + '-tick' + i);
				rm.write('class="sapUiSliTick" ');
				rm.write('></DIV>'); // tick

				if ( oSlider.getStepLabels() ) {
					// Texts
					rm.write('<DIV');
					rm.writeAttribute('id', oSlider.getId() + '-text' + i);
					switch (i) {
					case ( 0 ):
						rm.write('class="sapUiSliText sapUiSliTextLeft" >');
						break;
					case (iTotalUnits):
						rm.write('class="sapUiSliText sapUiSliTextRight" >');
						break;
					default:
						rm.write('class="sapUiSliText" >');
						break;
					}
					if (useTextLabels) {
						rm.writeEscaped(oSlider.getLabels()[i]);
					} else {
						rm.write(oSlider.getMin() + i * fStepSize);
					}
					rm.write('</DIV>'); // Text
				}
			}
		}

		// Highlight bar
		rm.write('<DIV');
		rm.writeAttribute('id', oSlider.getId() + '-hili');
		rm.write('class="sapUiSliHiLi"></DIV>');

		this.renderGrip(rm, oSlider);

		rm.write('</DIV></DIV></DIV></DIV>');
	};

	/**
	 * Renders the Grip for the slider control, using the provided {@link sap.ui.fw.RenderManager}.
	 *
	 * @param {sap.ui.fw.RenderManager} rm The RenderManager that can be used for writing to the render output buffer.
	 * @param {sap.ui.commons.Slider} oSlider An object representation of the control that should be rendered.
	 */
	SliderRenderer.renderGrip = function(rm, oSlider){

		rm.write('<DIV');

		// Icon for grip
		rm.writeAttribute('id', oSlider.getId() + '-grip');
		if (oSlider.getEnabled()) {
			rm.writeAttribute('tabIndex', '0');
		} else {
			rm.writeAttribute('tabIndex', '-1');
		}
		rm.writeAttribute('class', 'sapUiSliGrip');
		rm.writeAttribute('title', oSlider.getValue());

		var sOriantation = 'horizontal';
		if (oSlider.getVertical()) {
			sOriantation = 'vertical';
		}

		// ARIA
		rm.writeAccessibilityState(oSlider, {
			role: 'slider',
			orientation: sOriantation,
			valuemin: oSlider.getMin(),
			valuemax: oSlider.getMax(),
			disabled: !oSlider.getEditable() || !oSlider.getEnabled(),
			describedby: oSlider.getTooltip_AsString() ? (oSlider.getId() + '-Descr ' + oSlider.getAriaDescribedBy().join(" ")) : undefined
		});

		if (oSlider.getVertical()) {
			rm.write('>&#9668;</DIV>'); // Symbol for HCB Theme (Must be hidden in other themes)
		} else {
			rm.write('>&#9650;</DIV>'); // Symbol for HCB Theme (Must be hidden in other themes)
		}
	};

	/**
	 * Adds extra code to the control (i.e. in subclasses), using the provided {@link sap.ui.fw.RenderManager}.
	 *
	 * @param {sap.ui.fw.RenderManager} rm The RenderManager that can be used for writing to the render output buffer.
	 * @param {sap.ui.commons.Slider} oSlider An object representation of the control that should be rendered.
	 */
	SliderRenderer.controlAdditionalCode = function(rm, oSlider){
	};

	return SliderRenderer;

}, /* bExport= */ true);
