/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/base/Exception'],function(q,E){"use strict";var V=function(m,v){this.name="ValidateException";this.message=m;this.violatedConstraints=v;};V.prototype=q.sap.newObject(E.prototype);return V;},true);
