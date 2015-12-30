/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./ButtonRenderer','sap/ui/core/Renderer'],function(q,B,R){"use strict";var M=R.extend(B);M.renderButtonAttributes=function(r,c){if(sap.ui.getCore().getConfiguration().getAccessibility()){r.writeAttribute("aria-haspopup","true");}};M.renderButtonContentAfter=function(r,c){r.write("<span class=\"sapUiMenuButtonIco\"></span>");};return M;},true);
