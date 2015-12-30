/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./ListItemBaseRenderer','sap/ui/core/Renderer'],function(q,L,R){"use strict";var A=R.extend(L);A.renderLIAttributes=function(r,l){r.addClass("sapMALI");};A.renderLIContent=function(r,l){var i=l.getText();if(i){r.write("<div class='sapMALIText'>");r.writeEscaped(i);r.write("</div>");}};A.getAriaDescribedBy=function(l){var d=this.getAriaAnnouncement("active"),b=L.getAriaDescribedBy.call(this,l)||"";return d+" "+b;};return A;},true);
