/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./SplitContainerRenderer','sap/ui/core/Renderer'],function(q,S,R){"use strict";var a={};var a=R.extend(S);a.renderAttributes=function(r,c){sap.m.BackgroundHelper.addBackgroundColorStyles(r,c.getBackgroundColor(),c.getBackgroundImage());};a.renderBeforeContent=function(r,c){sap.m.BackgroundHelper.renderBackgroundImageTag(r,c,"sapMSplitContainerBG",c.getBackgroundImage(),c.getBackgroundRepeat(),c.getBackgroundOpacity());};return a;},true);
