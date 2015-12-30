/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./Element'],function(q,E){"use strict";var V={};var t=null;var e=function(){if(!t){t={};var r=sap.ui.getCore().getLibraryResourceBundle("sap.ui.core");t[sap.ui.core.ValueState.Error]=r.getText("VALUE_STATE_ERROR");t[sap.ui.core.ValueState.Warning]=r.getText("VALUE_STATE_WARNING");t[sap.ui.core.ValueState.Success]=r.getText("VALUE_STATE_SUCCESS");}};V.enrichTooltip=function(o,T){if(!T&&o.getTooltip()){return undefined;}var s=sap.ui.core.ValueStateSupport.getAdditionalText(o);if(s){return(T?T+" - ":"")+s;}return T;};V.getAdditionalText=function(v){var s=null;if(v.getValueState){s=v.getValueState();}else if(sap.ui.core.ValueState[v]){s=v;}if(s&&(s!=sap.ui.core.ValueState.None)){e();return t[s];}return null;};V.formatValueState=function(s){switch(s){case 1:return sap.ui.core.ValueState.Warning;case 2:return sap.ui.core.ValueState.Success;case 3:return sap.ui.core.ValueState.Error;default:return sap.ui.core.ValueState.None;}};return V;},true);
