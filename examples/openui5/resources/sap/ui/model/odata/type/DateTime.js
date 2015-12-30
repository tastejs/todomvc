/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/model/odata/type/DateTimeBase'],function(D){"use strict";function a(t,c){var A={};if(c){switch(c.displayFormat){case"Date":A.isDateOnly=true;break;case undefined:break;default:jQuery.sap.log.warning("Illegal displayFormat: "+c.displayFormat,null,t.getName());}A.nullable=c.nullable;}return A;}var b=D.extend("sap.ui.model.odata.type.DateTime",{constructor:function(f,c){D.call(this,f,a(this,c));}});b.prototype.getName=function(){return"sap.ui.model.odata.type.DateTime";};return b;});
