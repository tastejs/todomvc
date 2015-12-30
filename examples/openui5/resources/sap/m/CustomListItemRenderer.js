/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./ListItemBaseRenderer','sap/ui/core/Renderer'],function(q,L,R){"use strict";var C=R.extend(L);C.renderLIAttributes=function(r,l){r.addClass("sapMCLI");};C.renderLIContent=function(r,l){var c=l.getContent();var a=c.length;for(var i=0;i<a;i++){r.renderControl(c[i]);}};return C;},true);
