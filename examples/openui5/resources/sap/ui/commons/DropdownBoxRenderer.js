/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./ComboBoxRenderer'],function(q,C){"use strict";var D=sap.ui.core.Renderer.extend(C);D.renderOuterContentBefore=function(r,d){this.renderExpander(r,d);};D.renderOuterContent=function(r,d){this.renderSelectBox(r,d,'0');};D.renderTextFieldEnabled=function(r,d){if(d.mobile){r.writeAttribute('tabindex','-1');}else if(!d.getEnabled()){r.writeAttribute('disabled','disabled');r.writeAttribute('tabindex','-1');}else if(!d.getEditable()){r.writeAttribute('tabindex','0');}else{r.writeAttribute('tabindex','0');}};D.renderARIAInfo=function(r,d){var p=-1;if(d.getSelectedItemId()){for(var i=0;i<d.getItems().length;i++){var I=d.getItems()[i];if(I.getId()==d.getSelectedItemId()){p=i+1;break;}}}var P={autocomplete:"list",live:"polite",setsize:d.getItems().length,posinset:(p>=0)?p:undefined};if(d.getValueState()==sap.ui.core.ValueState.Error){P["invalid"]=true;}r.writeAccessibilityState(d,P);};return D;},true);
