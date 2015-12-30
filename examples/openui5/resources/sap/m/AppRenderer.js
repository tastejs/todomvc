/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./NavContainerRenderer','sap/ui/core/Renderer'],function(q,N,R){"use strict";var A={};var A=R.extend(N);A.renderAttributes=function(r,c){sap.m.BackgroundHelper.addBackgroundColorStyles(r,c.getBackgroundColor(),c.getBackgroundImage());};A.renderBeforeContent=function(r,c){sap.m.BackgroundHelper.renderBackgroundImageTag(r,c,"sapMAppBG",c.getBackgroundImage(),c.getBackgroundRepeat(),c.getBackgroundOpacity());};return A;},true);
