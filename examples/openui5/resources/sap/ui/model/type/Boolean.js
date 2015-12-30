/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/model/SimpleType','sap/ui/model/FormatException','sap/ui/model/ParseException'],function(S,F,P){"use strict";var B=S.extend("sap.ui.model.type.Boolean",{constructor:function(){S.apply(this,arguments);this.sName="Boolean";}});B.prototype.formatValue=function(v,i){if(v==undefined||v==null){return null;}switch(this.getPrimitiveType(i)){case"boolean":case"any":return v;case"string":return v.toString();case"int":case"float":default:throw new F("Don't know how to format Boolean to "+i);}};B.prototype.parseValue=function(v,i){var b;switch(this.getPrimitiveType(i)){case"boolean":return v;case"string":if(v.toLowerCase()=="true"||v=="X"){return true;}if(v.toLowerCase()=="false"||v==""||v==" "){return false;}b=sap.ui.getCore().getLibraryResourceBundle();throw new P(b.getText("Boolean.Invalid"));case"int":case"float":default:throw new P("Don't know how to parse Boolean from "+i);}};B.prototype.validateValue=function(v){};return B;});
