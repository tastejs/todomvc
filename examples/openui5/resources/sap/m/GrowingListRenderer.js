/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./ListRenderer','sap/ui/core/Renderer'],function(q,L,R){"use strict";var G=R.extend(L);G.render=function(r,c){if(c._isIncompatible()){q.sap.log.warning("Does not render sap.m.GrowingList#"+c.getId()+" when compatibility version is 1.16 or higher. Instead use sap.m.List/Table control with growing feature!");}else{L.render.call(this,r,c);}};return G;},true);
