/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/Renderer','./ListBaseRenderer'],function(q,R,L){"use strict";var a=R.extend(L);a.render=function(r,c){if(!c.getColumns().length){L.render.call(this,r,c);return;}if(c._isColumnsIncompatible()){q.sap.log.warning("Does not render sap.m.List#"+c.getId()+" with columns aggregation when compatibility version is 1.16 or higher. Instead use sap.m.Table control!");return;}q.sap.require("sap.m.TableRenderer");var o=q.extend({},this,sap.m.TableRenderer);L.render.call(o,r,c);};return a;},true);
