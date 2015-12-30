/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/Renderer','./DatePickerRenderer'],function(q,R,D){"use strict";var a=R.extend(D);a.writeInnerValue=function(r,c){r.writeAttributeEscaped("value",c._formatValue(c.getDateValue(),c.getSecondDateValue()));};return a;},true);
