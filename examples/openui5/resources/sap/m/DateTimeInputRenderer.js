/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/Renderer','./InputBaseRenderer'],function(q,R,I){"use strict";var D=R.extend(I);D.addOuterClasses=function(r,c){r.addClass("sapMDTI");};D.addCursorClass=function(r,c){if(c.getEnabled()&&c.getEditable()){r.addClass("sapMPointer");}};D.addOuterStyles=function(r,c){r.addStyle("width",c.getWidth());};return D;},true);
