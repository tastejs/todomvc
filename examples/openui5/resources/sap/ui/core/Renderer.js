/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/library'],function(q,s){"use strict";var T=s.TextAlign,a=s.TextDirection;var R={};function c(b){return function(n,r){var C=q.sap.newObject(b);C.extend=c(C);if(r){q.extend(C,r);}q.sap.setObject(n,C);return C;};}var e=c(R);R.extend=function(n,r){if(typeof n==='string'){return e(n,r);}else{var C=q.sap.newObject(n);C._super=n;C.extend=c(C);return C;}};R.getTextAlign=function(t,o){var b="",r=sap.ui.getCore().getConfiguration().getRTL();switch(t){case T.End:switch(o){case a.LTR:b="right";break;case a.RTL:b="left";break;default:b=r?"left":"right";break;}break;case T.Begin:switch(o){case a.LTR:b="left";break;case a.RTL:b="right";break;default:b=r?"right":"left";break;}break;case T.Right:if(!r||o==a.LTR){b="right";}break;case T.Center:b="center";break;case T.Left:if(r||o==a.RTL){b="left";}break;}return b;};return R;},true);
