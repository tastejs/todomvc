/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global', './ListItemBaseRenderer', './ListRenderer', 'sap/ui/core/Renderer'],
	function(jQuery, ListItemBaseRenderer, ListRenderer, Renderer) {
	"use strict";

	/**
	 * ColumnListItem renderer.
	 * @namespace
	 */
	var ColumnListItemRenderer = Renderer.extend(ListItemBaseRenderer);
	
	// determines whether given control is a textual control or not
	// TODO: Change with a better way (e.g. Text Marker Interface)
	ColumnListItemRenderer.isTextualControl = function(oControl) {
		var mConstructors = [sap.m.Text, sap.m.Label, sap.m.Link, sap.m.Title];
		return mConstructors.some(function(fnConstructor) {
			return fnConstructor && oControl instanceof fnConstructor;
		});
	};
	
	ColumnListItemRenderer.render = function(rm, oLI) {
		var oTable = oLI.getTable();
		if (!oTable) {
			return;
		}

		ListItemBaseRenderer.render.apply(this, arguments);

		if (oLI.getVisible() && oTable.hasPopin()) {
			this.renderPopin(rm, oLI, oTable);
		}
	};
	
	ColumnListItemRenderer.openItemTag = function(rm, oLI) {
		rm.write("<tr");
	};

	ColumnListItemRenderer.closeItemTag = function(rm, oLI) {
		rm.write("</tr>");
	};

	ColumnListItemRenderer.handleNoFlex = function(rm, oLI) {
	};

	// render type content always within a cell
	ColumnListItemRenderer.renderType = function(rm, oLI) {
		rm.write('<td role="gridcell" class="sapMListTblNavCol"');
		
		this.writeAriaSelected(rm, oLI);
		
		if (!oLI._needsTypeColumn()) {
			rm.writeAttribute("aria-hidden", "true");
		}
		
		rm.write('>');
		
		// let the list item base render the type
		ListItemBaseRenderer.renderType.apply(this, arguments);
		
		rm.write('</td>');
	};

	// wrap mode content with a cell
	ColumnListItemRenderer.renderModeContent = function(rm, oLI) {
		rm.write('<td role="gridcell" class="sapMListTblSelCol"');
		this.writeAriaSelected(rm, oLI);
		rm.write('>');
		
		// let the list item base render the mode control
		ListItemBaseRenderer.renderModeContent.apply(this, arguments);
		
		rm.write('</td>');
	};

	// ColumnListItem does not respect counter property of the LIB
	ColumnListItemRenderer.renderCounter = function(rm, oLI) {
	};
	
	// Returns aria accessibility role
	ColumnListItemRenderer.getAriaRole = function(oLI) {
		return "row";
	};
	
	// Returns the inner aria labelledby ids for the accessibility
	ColumnListItemRenderer.getAriaLabelledBy = function(oLI) {
		var oTable = oLI.getTable(),
			sAriaLabelledBy = ListItemBaseRenderer.getAriaLabelledBy.call(this, oLI) || "";

		if (!oTable || !oTable.hasPopin()) {
			return sAriaLabelledBy;
		}
		
		var sId = oLI.getId();
		if (!sAriaLabelledBy) {
			sAriaLabelledBy = sId;
		} else if (sAriaLabelledBy.indexOf(sId) == -1) {
			sAriaLabelledBy = sId + " " + sAriaLabelledBy;
		}

		// when table has pop-in let the screen readers announce it
		return sAriaLabelledBy + " " + sId + "-sub";
	};
	
	// writes aria-selected for the cells when the item is selectable
	ColumnListItemRenderer.writeAriaSelected = function(rm, oLI) {
		if (oLI.isSelectable()) {
			rm.writeAttribute("aria-selected", oLI.getProperty("selected"));
		}
	};
	
	/**
	 * Renders the HTML for the given control, using the provided
	 * {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager}
	 *            oRenderManager the RenderManager that can be used for writing to
	 *            the Render-Output-Buffer
	 * @param {sap.ui.core.Control}
	 *            oControl an object representation of the control that should be
	 *            rendered
	 */
	ColumnListItemRenderer.renderLIAttributes = function(rm, oLI) {
		rm.addClass("sapMListTblRow");
		var vAlign = oLI.getVAlign();
		if (vAlign != sap.ui.core.VerticalAlign.Inherit) {
			rm.addClass("sapMListTblRow" + vAlign);
		}
	};
	
	
	/**
	 * Overwriting hook method of ListItemBase
	 *
	 * @public
	 *
	 * @param {sap.ui.core.RenderManager} rm RenderManager
	 * @param {sap.m.ListItemBase} oLI List item
	 */
	ColumnListItemRenderer.renderLIContentWrapper = function(rm, oLI) {
		var oTable = oLI.getTable();
		if (!oTable) {
			return;
		}
	
		var aColumns = oTable.getColumns(true),
			aCells = oLI.getCells(),
			bSelectable = oLI.isSelectable(),
			bSelected = oLI.getProperty("selected");
	
		// remove cloned headers
		oLI._destroyClonedHeaders();
	
		aColumns.forEach(function(oColumn, i) {
			var cls,
				oHeader,
				bRenderCell = true,
				oCell = aCells[oColumn.getInitialOrder()];
	
			if (!oCell || !oColumn.getVisible() || oColumn.isNeverVisible(true) || oColumn.isPopin()) {
				// update the visible index of the column
				oColumn.setIndex(-1);
				return;
			}
	
			rm.write("<td");
			rm.addClass("sapMListTblCell");
			rm.writeAttribute("id", oLI.getId() + "_cell" + i);
			rm.writeAttribute("role", "gridcell");
			
			if (bSelectable) {
				// write aria-selected explicitly for the cells
				rm.writeAttribute("aria-selected", bSelected);
			}
	
			// check column properties
			if (oColumn) {
				cls = oColumn.getStyleClass(true);
				cls && rm.addClass(jQuery.sap.encodeHTML(cls));
				
				// aria for virtual keyboard mode
				oHeader = oColumn.getHeader();
				if (oHeader) {
					rm.writeAttribute("aria-describedby", oHeader.getId());
				}
				
				// merge duplicate cells
				if (!oTable.hasPopin() && oColumn.getMergeDuplicates()) {
					var sFuncWithParam = oColumn.getMergeFunctionName(),
						aFuncWithParam = sFuncWithParam.split("#"),
						sFuncParam = aFuncWithParam[1],
						sFuncName = aFuncWithParam[0];
	
					if (typeof oCell[sFuncName] != "function") {
						jQuery.sap.log.warning("mergeFunctionName property is defined on " + oColumn + " but this is not function of " + oCell);
					} else {
						var lastColumnValue = oColumn.getLastValue(),
							cellValue = oCell[sFuncName](sFuncParam);
	
						if (lastColumnValue === cellValue) {
							// it is not necessary to render cell content but
							// screen readers need content to announce it
							bRenderCell = sap.ui.getCore().getConfiguration().getAccessibility();
							oCell.addStyleClass("sapMListTblCellDupCnt");
							rm.addClass("sapMListTblCellDup");
						} else {
							oColumn.setLastValue(cellValue);
						}
					}
				}
	
				oColumn.getVAlign() != "Inherit" && rm.addStyle("vertical-align", oColumn.getVAlign().toLowerCase());
				var sAlign = oColumn.getCssAlign();
				if (sAlign) {
					rm.addStyle("text-align", sAlign);
				}
				
				rm.writeStyles();
			}
	
			rm.writeClasses();
			rm.write(">");
			if (bRenderCell) {
				
				/* add the header as a aria-labelled by association for the cells */
				if (oHeader && 
					oCell.getAriaLabelledBy && 
					this.isTextualControl(oHeader) &&
					oCell.getAriaLabelledBy().indexOf(oHeader.getId()) == -1) {
					
					// suppress the invalidation during the rendering
					oCell.addAssociation("ariaLabelledBy", oHeader, true);
				}
				
				rm.renderControl(oColumn.applyAlignTo(oCell));
			}
			rm.write("</td>");
		}, this);
	};
	
	
	/**
	 * Renders pop-ins for Table Rows
	 *
	 * @private
	 *
	 * @param {sap.ui.core.RenderManager} rm RenderManager
	 * @param {sap.m.ListItemBase} oLI List item
	 * @param {sap.m.Table} oTable Table control
	 */
	ColumnListItemRenderer.renderPopin = function(rm, oLI, oTable) {
		var bSelected = oLI.getProperty("selected"),
			bSelectable = oLI.isSelectable();
			
		rm.write("<tr");
		rm.addClass("sapMListTblSubRow");
		rm.writeElementData(oLI.getPopin());
		rm.writeAttribute("role", "row");
		rm.writeAttribute("tabindex", "-1");
		
		if (bSelectable) {
			rm.writeAttribute("aria-selected", bSelected);
		}
		
		// logical parent of the popin is the base row
		rm.writeAttribute("aria-owns", oLI.getId());
		rm.writeClasses();
		rm.write(">");
		
		// cell
		rm.write("<td");
		rm.writeAttribute("id", oLI.getId() + "-subcell");
		rm.writeAttribute("role", "gridcell");
		rm.writeAttribute("colspan", oTable.getColCount());
		if (bSelectable) {
			// write aria-selected explicitly for the cells
			rm.writeAttribute("aria-selected", bSelectable);
		}
		
		rm.write("><div class='sapMListTblSubCnt'>");
	
		var aCells = oLI.getCells(),
			aColumns = oTable.getColumns(true);
	
		aColumns.forEach(function(oColumn) {
			if (!oColumn.getVisible() || !oColumn.isPopin()) {
				return;
			}
	
			var oCell = aCells[oColumn.getInitialOrder()],
				oHeader = oColumn.getHeader();
	
			if (!oHeader && !oCell) {
				return;
			}
	
			var sStyleClass = oColumn.getStyleClass(),
				sPopinDisplay = oColumn.getPopinDisplay();
	
			/* row start */
			rm.write("<div");
			rm.addClass("sapMListTblSubCntRow");
			sStyleClass && rm.addClass(jQuery.sap.encodeHTML(sStyleClass));
			rm.writeClasses();
			rm.write(">");
	
			/* header cell */
			if (oHeader && sPopinDisplay != sap.m.PopinDisplay.WithoutHeader) {
				rm.write("<div");
				rm.addClass("sapMListTblSubCntHdr");
				rm.writeClasses();
				rm.write(">");
				oHeader = oHeader.clone();
				oColumn.addDependent(oHeader);
				oLI._addClonedHeader(oHeader);
				oColumn.applyAlignTo(oHeader, "Begin");
				rm.renderControl(oHeader);
				rm.write("</div>");
	
				/* separator cell */
				rm.write("<div class='sapMListTblSubCntSpr'>:</div>");
			}
	
			/* value cell */
			if (oCell) {
				rm.write("<div");
				rm.addClass("sapMListTblSubCntVal");
				rm.addClass("sapMListTblSubCntVal" + sPopinDisplay);
				rm.writeClasses();
				rm.write(">");
				oColumn.applyAlignTo(oCell, "Begin");
				rm.renderControl(oCell);
				rm.write("</div>");
			}
	
			/* row end */
			rm.write("</div>");
		});
	
		rm.write("</div></td></tr>");
	};

	/**
	 * Overwriting hook method of ListItemBase.
	 * Does not render the classes for legacy outlines. Instead use the normal outlines in all cases.
	 *
	 * @param {sap.ui.core.RenderManager} rm RenderManager
	 * @param {sap.m.ListItemBase} oLI List item
	 */
	ColumnListItemRenderer.addLegacyOutlineClass = function(rm, oLI) {
	};

	return ColumnListItemRenderer;

}, /* bExport= */ true);
