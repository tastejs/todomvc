/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./ListItemBaseRenderer','sap/ui/core/Renderer'],function(q,L,R){"use strict";var D=R.extend(L);D.renderLIAttributes=function(r,l){r.addClass("sapMDLI");};D.renderLIContent=function(r,l){var i=l.getLabel();if(i){r.write("<label for='"+l.getId()+"-value' class='sapMDLILabel'>");r.writeEscaped(l.getLabel());r.write("</label>");}var a=l.getValue();var v=l.getValueTextDirection();if(a){r.write("<div id='"+l.getId()+"-value' class='sapMDLIValue'");if(v!=sap.ui.core.TextDirection.Inherit){r.writeAttribute("dir",v.toLowerCase());}r.write(">");r.writeEscaped(l.getValue());r.write("</div>");}};return D;},true);
