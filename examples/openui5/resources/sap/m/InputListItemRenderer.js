/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./ListItemBaseRenderer','sap/ui/core/Renderer'],function(q,L,R){"use strict";var I=R.extend(L);I.renderLIAttributes=function(r,l){r.addClass("sapMILI");};I.renderLIContent=function(r,l){var s=l.getLabel();if(s){var a=l.getId()+"-label",b=l.getLabelTextDirection();r.write('<label id="'+a+'" class="sapMILILabel"');if(b!==sap.ui.core.TextDirection.Inherit){r.writeAttribute("dir",b.toLowerCase());}r.write('>');r.writeEscaped(s);r.write('</label>');}r.write('<div class="sapMILIDiv sapMILI-CTX">');l.getContent().forEach(function(c){if(a&&c.addAriaLabelledBy&&c.getAriaLabelledBy().indexOf(a)==-1){c.addAriaLabelledBy(a);}r.renderControl(c);});r.write('</div>');};return I;},true);
