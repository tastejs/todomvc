/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./TileRenderer'],function(q,T){"use strict";var C=sap.ui.core.Renderer.extend(T);C.render=function(r,c){r.write("<div tabindex=\"0\"");r.writeControlData(c);r.addClass("sapMCustomTile");r.writeClasses();if(c._invisible){r.addStyle("visibility","hidden");r.writeStyles();}if(c.getParent()instanceof sap.m.TileContainer){r.writeAccessibilityState({role:"option",posinset:c._getTileIndex(),setsize:c._getTilesCount()});}r.write(">");r.write("<div id=\""+c.getId()+"-remove\" class=\"sapMTCRemove\"></div>");r.write("<div class=\"sapMCustomTileContent\">");this._renderContent(r,c);r.write("</div></div>");};C._renderContent=function(r,t){r.renderControl(t.getContent());};return C;},true);
