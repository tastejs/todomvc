/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/Renderer'],function(q,R){"use strict";var T={};T.render=function(r,c){r.write("<div tabindex=\"0\"");r.writeControlData(c);r.addClass("sapMTile");r.addClass("sapMPointer");r.writeClasses();if(c._invisible){r.addStyle("visibility","hidden");r.writeStyles();}var t=c.getTooltip_AsString();if(t){r.writeAttributeEscaped("title",t);}if(c.getParent()instanceof sap.m.TileContainer){r.writeAccessibilityState(c,{role:"option",posinset:c._getTileIndex(),setsize:c._getTilesCount()});}r.write(">");if(c.getRemovable()){r.write("<div id=\""+c.getId()+"-remove\" class=\"sapMTCRemove\"></div>");}else{r.write("<div id=\""+c.getId()+"-remove\" class=\"sapMTCNoRemove\"></div>");}r.write("<div class=\"sapMTileContent\">");this._renderContent(r,c);r.write("</div></div>");};T._renderContent=function(r,c){};return T;},true);
