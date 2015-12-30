/*
 * ! UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/Renderer','./DialogRenderer'],function(q,R,D){"use strict";var P=R.extend(D);P.CSS_CLASS="sapMPersoDialog";P.render=function(r,c){D.render.apply(this,arguments);var i=c._getVisiblePanelID();var p=c.getVisiblePanel();if(i&&p){r.write("<div");r.writeAttribute("id",i);r.write(">");r.renderControl(p);r.write("</div>");}};return P;},true);
