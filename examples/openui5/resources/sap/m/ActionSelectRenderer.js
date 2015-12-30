/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/Renderer','./SelectRenderer'],function(q,R,S){"use strict";var A=R.extend(S);A.ACTION_SELECT_CSS_CLASS="sapMActionSelect";A.addStyleClass=function(r,a){r.addClass(A.ACTION_SELECT_CSS_CLASS);};return A;},true);
