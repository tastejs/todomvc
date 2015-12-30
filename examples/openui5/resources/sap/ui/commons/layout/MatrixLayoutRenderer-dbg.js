/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for control sap.ui.commons.layout.MatrixLayout
sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	/**
	 * MatrixLayout renderer.
	 *
	 * @author SAP SE
	 * @namespace
	 */
	var MatrixLayoutRenderer = {
	};
	
	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRenderManager The RenderManager that can be used for writing to the Render-Output-Buffer.
	 * @param {sap.ui.core.Control} oMatrixLayout an object representation of the control that should be rendered
	 */
	MatrixLayoutRenderer.render = function(oRenderManager, oMatrixLayout) {
		// some convenience variables.
		var rm = oRenderManager;
		var r = MatrixLayoutRenderer;
		var bRTL = sap.ui.getCore().getConfiguration().getRTL();
	
		//ARIA
		rm.write("<TABLE role=\"presentation\"");
		rm.writeControlData(oMatrixLayout);
		rm.write(" cellpadding=\"0\" cellspacing=\"0\"");
		rm.addStyle("border-collapse", "collapse");
	
		var sMatrixWidth = oMatrixLayout.getWidth();
		if (sMatrixWidth) {
			rm.addStyle("width", sMatrixWidth);
		}
	
		var sMatrixHeight = oMatrixLayout.getHeight();
		if (sMatrixHeight && sMatrixHeight != 'auto') {
			rm.addStyle("height", sMatrixHeight);
			// get value and unit of Layout height (to determine row heights if given in %)
			var oMatrixHeight = r.getValueUnit( sMatrixHeight );
		}
	
		if (oMatrixLayout.getLayoutFixed()) {
			// table layout is fixed
			rm.addStyle("table-layout", "fixed");
			if (!sMatrixWidth) {
				rm.addStyle("width", "100%");
			}
		}
	
		rm.addClass("sapUiMlt");
		rm.writeStyles();
		rm.writeClasses();
	
		if (oMatrixLayout.getTooltip_AsString()) {
			rm.writeAttributeEscaped('title', oMatrixLayout.getTooltip_AsString());
		}
	
		// close table-start-tag
		rm.write('>');
	
		var aRows = oMatrixLayout.getRows();
		var iCols = oMatrixLayout.getColumns();
		if (iCols < 1) {
			// determine number of columns
			for (var i = 0; i < aRows.length; i++) {
				var oMatrixLayoutRow = aRows[i];
				var aCells = oMatrixLayoutRow.getCells();
				if ( iCols < aCells.length) {
					iCols = aCells.length;
				}
			}
		}
	
		// create columns
		if (iCols > 0) {
			var aWidths = oMatrixLayout.getWidths();
			rm.write("<colgroup>");
			for (var j = 0; j < iCols; j++) {
				rm.write("<col");
				if (aWidths && aWidths[j] && aWidths[j] != "auto") {
					rm.addStyle('width', aWidths[j]); // use style because col width in HTML supports only be px or %
					rm.writeStyles();
				}
				rm.write("/>");
			}
			rm.write("</colgroup>");
		}
	
		// in IE9 there is a problem with column width if too much colspans are used and not
		// at least one cell per columns has colspan 1
		// to keep the check simple just check if in every row colspans are used
		var bDummyRow = true;
		var bColspanInRow = false;
	
		rm.write('<TBODY style="width: 100%; height: 100%">');
	
		// for each row
		for (var i = 0; i < aRows.length; i++) {
			var oMatrixLayoutRow = aRows[i];
	
			// get value and unit of Row height (to determine row heights if given in %)
			var sRowHeight = oMatrixLayoutRow.getHeight();
			if (sRowHeight == "auto") {
				//ignore auto because without rowHeight it's auto sized
				sRowHeight = "";
			}
			if (sRowHeight && oMatrixHeight) {
				var oRowHeight = r.getValueUnit( sRowHeight );
				if ( oRowHeight.Unit == '%' && oMatrixHeight.Unit != '%') {
					// Matrix has fix height and Row % -> calculate Row height to fix value
					sRowHeight = ( oMatrixHeight.Value * oRowHeight.Value / 100 ) + oMatrixHeight.Unit;
				}
			}
	
			rm.write("<tr");
			rm.writeElementData(oMatrixLayoutRow);
			rm.writeClasses(oMatrixLayoutRow);
			if (oMatrixLayoutRow.getTooltip_AsString()) {
				rm.writeAttributeEscaped('title', oMatrixLayoutRow.getTooltip_AsString());
			}
	
			if (sap.ui.Device.browser.internet_explorer && sap.ui.Device.browser.version >= 9 && sRowHeight) {
				// for IE9 and IE10 in some cases the height is needed on TR, so it's added here.
				// Other browsers don't need it here
				// TD must have the same height even it looks wrong
				// (e.g. TR must have 30% and TD must have 30% to show a 30% height row)
				rm.addStyle("height", sRowHeight);
				rm.writeStyles();
			}
			rm.write(">");
	
			// for each cell
			var aCells = oMatrixLayoutRow.getCells();
	
			var iColumns = iCols;
			if (iCols < 1) {
				// render only defined cells
				iColumns = aCells.length;
			}
	
			bColspanInRow = false;
			var iColSpans = 0;
			if (!oMatrixLayoutRow.RowSpanCells) {
				oMatrixLayoutRow.RowSpanCells = 0;
			} else {
				bColspanInRow = true; // not really but ok for this case
			}
	
			for (var j = 0; j < iColumns; j++) {
				if (j >= (iColumns - iColSpans - oMatrixLayoutRow.RowSpanCells)) {
				// no more cells because of Colspan
					break;
				}
	
				var oMatrixLayoutCell = aCells[j];
	
				rm.write("<td");
	
				if (sRowHeight && ( !oMatrixLayoutCell || oMatrixLayoutCell.getRowSpan() == 1 )) {
					// set height only if cell has no rowspan or is not specified
					rm.addStyle("height", sRowHeight);
				}
	
				if (oMatrixLayoutCell) {
					// if empty cell only render empty TD
					rm.writeElementData(oMatrixLayoutCell);
					if (oMatrixLayoutCell.getTooltip_AsString()) {
						rm.writeAttributeEscaped('title', oMatrixLayoutCell.getTooltip_AsString());
					}
	
					if (oMatrixLayout.getLayoutFixed() && oMatrixLayoutCell.getContent().length > 0) {
						// table layout is fixed
						rm.addStyle("overflow", "hidden");
						// as in Firefox 10 ellipsis makes problems it is removed.
						// controls inside of matrix cells should bring their own ellipsis function
						// However, ellipsis on cells can only work if included control has 100% size of cell,
						// otherwise (if control is bigger) its only cut.
						//rm.addStyle("text-overflow", "ellipsis");
					}
	
					var sHAlign = r.getHAlignClass(oMatrixLayoutCell.getHAlign(), bRTL);
					if (sHAlign) {
						rm.addClass(sHAlign);
					}
					var sVAlign = r.getVAlign(oMatrixLayoutCell.getVAlign());
					if (sVAlign) {
						rm.addStyle("vertical-align", sVAlign);
					}
					if (oMatrixLayoutCell.getColSpan() > 1) {
						rm.writeAttribute("colspan", oMatrixLayoutCell.getColSpan());
						iColSpans = iColSpans + oMatrixLayoutCell.getColSpan() - 1;
						bColspanInRow = true;
					}
					if (oMatrixLayoutCell.getRowSpan() > 1) {
						rm.writeAttribute("rowspan", oMatrixLayoutCell.getRowSpan());
	
						// summarize height of all used rows
						var fValue = 0;
						var sUnit = "";
						for (var x = 0; x < oMatrixLayoutCell.getRowSpan(); x++) {
							var oRow = aRows[i + x];
	
							if (!oRow) {
								sUnit = false;
								break;
							}
	
							if (!oRow.RowSpanCells) {
								oRow.RowSpanCells = 0;
							}
	
							if (x > 0) {
								// add number of cells with rowspan to following rows to not render additional cells
								oRow.RowSpanCells = oRow.RowSpanCells + oMatrixLayoutCell.getColSpan();
							}
							var sHeight = oRow.getHeight();
							if (!sHeight || sHeight == "auto") {
								//no height defined for one row -> no summarize possible
								sUnit = false;
								//break;
							} else {
								var oHeight = r.getValueUnit( sHeight );
								if ( oHeight.Unit == '%' && oMatrixHeight.Unit != '%') {
									// Matrix has fix height and Row % -> calculate Row height to fix value
									oHeight.Value = ( oMatrixHeight.Value * oRowHeight.Value / 100 );
									oHeight.Unit  = oMatrixHeight.Unit;
								}
								if (sUnit == "") {
									sUnit = oHeight.Unit;
								} else {
									if (sUnit != oHeight.Unit) {
										//different unit -> no summarize possible
										sUnit = false;
										//break;
									}
								}
								fValue = fValue + oHeight.Value;
							}
						}
						if (sUnit != false) {
							var sSpanHeight = fValue + sUnit;
							rm.addStyle("height", sSpanHeight);
						}
					}
	
					// set CSS class for appropriate background
					rm.addClass(r.getBackgroundClass(oMatrixLayoutCell.getBackgroundDesign()));
	
					// set CSS class for appropriate separator
					rm.addClass(r.getSeparationClass(oMatrixLayoutCell.getSeparation()));
	
					if (!oMatrixLayout.getLayoutFixed() || !sRowHeight) {
						// set CSS class for appropriate padding
						rm.addClass(r.getPaddingClass(oMatrixLayoutCell.getPadding()));
	
						rm.addClass("sapUiMltCell");
					} else {
						rm.addStyle("white-space", "nowrap");
					}
	
	
					rm.writeClasses(oMatrixLayoutCell);
				}
				rm.writeStyles();
	
				// close td-start-tag
				rm.write(">");
	
				if (oMatrixLayoutCell) {
					// if empty cell only render empty TD
	
					if (oMatrixLayout.getLayoutFixed() && sRowHeight) {
						// table layout is fixed
						// in case of defined height some DIVs are needed.
						// 1. one DIV to define height
						// 2. DIV to set vertical alignment
						// 3. DIV inside 2. DIV to set paddings for control inside.
						rm.write('<div');
	
						if ( oMatrixLayoutCell.getRowSpan() != 1 && sSpanHeight && sSpanHeight.search('%') == -1) {
							rm.addStyle("height", sSpanHeight);
						} else if (sRowHeight.search('%') != -1 || (oMatrixLayoutCell.getRowSpan() != 1 && !sSpanHeight)) {
							rm.addStyle("height", '100%');
						} else {
							rm.addStyle("height", sRowHeight);
						}
	
						rm.addStyle("display", "inline-block");
						if (sVAlign) {
							rm.addStyle("vertical-align", sVAlign);
						}
						rm.writeStyles();
						rm.writeClasses(false);
						rm.write("></div>");
						rm.write('<div');
						rm.addStyle("display", "inline-block");
						if (sVAlign) {
							rm.addStyle("vertical-align", sVAlign);
						}
						if ( oMatrixLayoutCell.getRowSpan() != 1 && sSpanHeight && sSpanHeight.search('%') == -1) {
							rm.addStyle("max-height", sSpanHeight);
						} else if (sRowHeight.search('%') != -1 || (oMatrixLayoutCell.getRowSpan() != 1 && !sSpanHeight)) {
							rm.addStyle("max-height", '100%');
						} else {
							rm.addStyle("max-height", sRowHeight);
						}
						/* determine height of content (if its a property there)
						   and set it to DIV (if possible) */
						var sDivHeight = "0";
						var sDivUnit = "";
						var sInnerDivHeight = "0";
						var aContentControls = oMatrixLayoutCell.getContent();
						for (var index = 0, length = aContentControls.length; index < length; index++) {
							if (aContentControls[index].getHeight && aContentControls[index].getHeight() != "") {
								// check unit
								var oControlHeight = r.getValueUnit( aContentControls[index].getHeight() );
								if (oControlHeight) {
									if (sDivUnit == "") {
										sDivUnit = oControlHeight.Unit;
									}
									if (sDivUnit != oControlHeight.Unit) {
										// different units in content controls not allowed -> use 100%
										sDivUnit = "%";
										sDivHeight = "100";
										break;
									}
									if (oControlHeight.Unit == "%") {
										// give %-height to outer DIV but the reverse %-height to the inner DIV
										// -> height of the content is right
										if (parseFloat(sDivHeight) < parseFloat(oControlHeight.Value)) {
											sDivHeight = oControlHeight.Value;
											if (sDivHeight != "100") {
												sInnerDivHeight = 10000 / parseFloat(sDivHeight);
											}
										}
									}// for fix units no calculation needed -DIVs get the size automatically
								}
							}
						}
						if (sDivHeight != "0") {
							rm.addStyle("height", sDivHeight + sDivUnit);
						}
						rm.addStyle("white-space", "normal");
						rm.addStyle("width", "100%");
						rm.writeStyles();
						rm.writeClasses(false);
	
						rm.write("><div");
						rm.addStyle("overflow", "hidden");
						rm.addStyle("text-overflow", "inherit");
						if (sDivHeight != "0") {
							if (sInnerDivHeight != "0") {
								rm.addStyle("height", sInnerDivHeight + "%");
							} else {
								rm.addStyle("height", "100%");
							}
						}
						rm.addClass("sapUiMltCell");
	
						// set CSS class for appropriate padding
						rm.addClass(r.getPaddingClass(oMatrixLayoutCell.getPadding()));
	
						rm.writeStyles();
						rm.writeClasses(false);
						rm.write(">"); // DIV
					}
					var aContentControls = oMatrixLayoutCell.getContent();
					for (var index = 0, length = aContentControls.length; index < length; index++) {
						oRenderManager.renderControl(aContentControls[index]);
					}
					if (oMatrixLayout.getLayoutFixed() && sRowHeight) {
						// table layout is fixed
						rm.write("</div></div>");
					}
				}
	
				// close cell
				rm.write("</td>");
			}
	
			// close row
			rm.write("</tr>");
	
			// initialize RowSpanCounter after Row is rendered
			oMatrixLayoutRow.RowSpanCells = undefined;
	
			if (!bColspanInRow) {
				bDummyRow = false;
			}
		} // end of rows-rendering
	
		if (bDummyRow && sap.ui.Device.browser.internet_explorer && sap.ui.Device.browser.version >= 9) {
			// render dummy row to help IE9 to calculate column sizes
			rm.write("<tr style='height:0;'>");
			for ( var i = 0; i < iCols; i++) {
				rm.write("<td></td>");
			}
			rm.write("</tr>");
		}
	
		// close tbody, close table
		rm.write("</TBODY></TABLE>");
	
	};
	
	/**
	 * Returns the a classname according to the given
	 * horizontal alignment and RTL mode or null if an invalid value.
	 * was given.
	 *
	 * @param {sap.ui.commons.layout.HAlign} oHAlign
	 * @param {boolean} bRTL
	 * @type string
	 */
	MatrixLayoutRenderer.getHAlignClass = function(oHAlign, bRTL) {
		var sClassPrefix = "sapUiMltCellHAlign";

		switch (oHAlign) {
		case sap.ui.commons.layout.HAlign.Begin:
			return null; // CSS default in both directions

		case sap.ui.commons.layout.HAlign.Center:
			return sClassPrefix + "Center";

		case sap.ui.commons.layout.HAlign.End:
			return sClassPrefix + (bRTL ? "Left" : "Right");

		case sap.ui.commons.layout.HAlign.Left:
			return bRTL ? sClassPrefix + "Left" : null; // CSS default in ltr

		case sap.ui.commons.layout.HAlign.Right:
			return bRTL ? null : sClassPrefix + "Right"; // CSS default in rtl

		default:
			jQuery.sap.assert(false, "MatrixLayoutRenderer.getHAlign: oHAlign must be a known value");
			return null;
		}

	};
	
	/**
	 * Returns the value for the HTML "valign" attribute according to the given
	 * vertical alignment, or NULL if the HTML default is fine.
	 *
	 * @param {sap.ui.commons.layout.VAlign} oVAlign
	 * @type string
	 */
	MatrixLayoutRenderer.getVAlign = function(oVAlign) {
	  switch (oVAlign) {
		case sap.ui.commons.layout.VAlign.Bottom:
		  return "bottom";
	
		case sap.ui.commons.layout.VAlign.Middle:
			return "middle";
		case sap.ui.commons.layout.VAlign.Top:
		  return "top";
	  }
	
	  jQuery.sap.assert(false, "MatrixLayoutRenderer.getVAlign: oVAlign must be a known value");
	  return null;
	};
	
	/**
	 * Returns the class name according to the given background design or NULL of
	 * none is needed.
	 *
	 * @param {sap.ui.commons.layout.BackgroundDesign} oBackgroundDesign
	 * @type string
	 */
	MatrixLayoutRenderer.getBackgroundClass = function(oBackgroundDesign) {
	  switch (oBackgroundDesign) {
		case sap.ui.commons.layout.BackgroundDesign.Border:
		  return "sapUiMltBgBorder";
	
		case sap.ui.commons.layout.BackgroundDesign.Fill1:
		  return "sapUiMltBgFill1";
	
		case sap.ui.commons.layout.BackgroundDesign.Fill2:
		  return "sapUiMltBgFill2";
	
		case sap.ui.commons.layout.BackgroundDesign.Fill3:
		  return "sapUiMltBgFill3";
	
		case sap.ui.commons.layout.BackgroundDesign.Header:
		  return "sapUiMltBgHeader";
	
		case sap.ui.commons.layout.BackgroundDesign.Plain:
		  return "sapUiMltBgPlain";
	
		case sap.ui.commons.layout.BackgroundDesign.Transparent:
		  return null;
	  }
	
	  jQuery.sap.assert(false, "MatrixLayoutRenderer.getBackgroundClass: oBackgroundDesign must be a known value");
	  return null;
	};
	
	/**
	 * Returns the class name according to the given padding or NULL of
	 * none is needed.
	 *
	 * @param {sap.ui.commons.layout.Padding} oPadding
	 * @type string
	 */
	MatrixLayoutRenderer.getPaddingClass = function(oPadding) {
	  switch (oPadding) {
		case sap.ui.commons.layout.Padding.None:
		  return "sapUiMltPadNone";
	
		case sap.ui.commons.layout.Padding.Begin:
		  return "sapUiMltPadLeft"; //TODO OK with RTL?
	
		case sap.ui.commons.layout.Padding.End:
		  return "sapUiMltPadRight"; //TODO OK with RTL?
	
		case sap.ui.commons.layout.Padding.Both:
		  return "sapUiMltPadBoth";
	
		case sap.ui.commons.layout.Padding.Neither:
		  return "sapUiMltPadNeither";
	  }
	
	  jQuery.sap.assert(false, "MatrixLayoutRenderer.getPaddingClass: oPadding must be a known value");
	  return null;
	};
	
	/**
	 * Returns the class name according to the given separation or NULL of
	 * none is needed.
	 *
	 * @param {sap.ui.commons.layout.Separation} oSeparation
	 * @type string
	 */
	MatrixLayoutRenderer.getSeparationClass = function(oSeparation) {
	  switch (oSeparation) {
		case sap.ui.commons.layout.Separation.None:
		  return null;
	
		case sap.ui.commons.layout.Separation.Small:
		  return "sapUiMltSepS";
	
		case sap.ui.commons.layout.Separation.SmallWithLine:
		  return "sapUiMltSepSWL";
	
		case sap.ui.commons.layout.Separation.Medium:
		  return "sapUiMltSepM";
	
		case sap.ui.commons.layout.Separation.MediumWithLine:
		  return "sapUiMltSepMWL";
	
		case sap.ui.commons.layout.Separation.Large:
		  return "sapUiMltSepL";
	
		case sap.ui.commons.layout.Separation.LargeWithLine:
		  return "sapUiMltSepLWL";
	  }
	
	  jQuery.sap.assert(false, "MatrixLayoutRenderer.getSeparationClass: oSeparation must be a known value");
	  return null;
	};
	
	/**
	 * get Value and Unit for size
	 */
	MatrixLayoutRenderer.getValueUnit = function(sSize) {
	
		var fValue = 0;
		var sUnit = "";
	
		var iPos = sSize.search('px');
		if (iPos > -1) {
			sUnit = "px";
			fValue = parseInt(sSize.slice(0,iPos), 10);
			return ({ Value: fValue, Unit: sUnit });
		}
	
		iPos = sSize.search('pt');
		if (iPos > -1) {
			sUnit = "pt";
			fValue = parseFloat(sSize.slice(0,iPos));
			return ({ Value: fValue, Unit: sUnit });
		}
	
		iPos = sSize.search('in');
		if (iPos > -1) {
			sUnit = "in";
			fValue = parseFloat(sSize.slice(0,iPos));
			return ({ Value: fValue, Unit: sUnit });
		}
	
		iPos = sSize.search('mm');
		if (iPos > -1) {
			sUnit = "mm";
			fValue = parseFloat(sSize.slice(0,iPos));
			return ({ Value: fValue, Unit: sUnit });
		}
	
		iPos = sSize.search('cm');
		if (iPos > -1) {
			sUnit = "cm";
			fValue = parseFloat(sSize.slice(0,iPos));
			return ({ Value: fValue, Unit: sUnit });
		}
	
		iPos = sSize.search('em');
		if (iPos > -1) {
			sUnit = "em";
			fValue = parseFloat(sSize.slice(0,iPos));
			return ({ Value: fValue, Unit: sUnit });
		}
	
		iPos = sSize.search('ex');
		if (iPos > -1) {
			sUnit = "ex";
			fValue = parseFloat(sSize.slice(0,iPos));
			return ({ Value: fValue, Unit: sUnit });
		}
	
		iPos = sSize.search('%');
		if (iPos > -1) {
			sUnit = "%";
			fValue = parseFloat(sSize.slice(0,iPos));
			return ({ Value: fValue, Unit: sUnit });
		}
	
	};
	

	return MatrixLayoutRenderer;

}, /* bExport= */ true);
