/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/Element','./library'],function(q,E,l){"use strict";var D=E.extend("sap.ui.unified.DateRange",{metadata:{library:"sap.ui.unified",properties:{startDate:{type:"object",group:"Misc",defaultValue:null},endDate:{type:"object",group:"Misc",defaultValue:null}}}});D.prototype.setStartDate=function(d){if(d){if(!(d instanceof Date)){throw new Error("Date must be a JavaScript date object; "+this);}var y=d.getFullYear();if(y<1||y>9999){throw new Error("Date must not be in valid range (between 0001-01-01 and 9999-12-31); "+this);}}this.setProperty("startDate",d);return this;};D.prototype.setEndDate=function(d){if(d){if(!(d instanceof Date)){throw new Error("Date must be a JavaScript date object; "+this);}var y=d.getFullYear();if(y<1||y>9999){throw new Error("Date must not be in valid range (between 0001-01-01 and 9999-12-31); "+this);}}this.setProperty("endDate",d);return this;};return D;},true);
