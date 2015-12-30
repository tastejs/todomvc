/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./ComboBoxRenderer','sap/ui/core/Renderer'],function(q,C,R){"use strict";var A=R.extend(C);A.renderExpander=function(r,c){if(!c.__sARIATXT){var a=sap.ui.getCore().getLibraryResourceBundle("sap.ui.commons");c.__sARIATXT=a.getText("AUTOCOMPLETE_ARIA_SUGGEST");}r.write("<span id=\"",c.getId(),"-ariaLbl\" style=\"display:none;\">",c.__sARIATXT,"</span>");};A.renderOuterAttributes=function(r,c){r.addClass("sapUiTfAutoComp");C.renderOuterAttributes.apply(this,arguments);};A.renderComboARIAInfo=function(r,c){var p={role:"textbox",owns:c.getId()+"-input "+c._getListBox().getId()};if(!c.getEnabled()){p["disabled"]=true;}r.writeAccessibilityState(null,p);};A.renderARIAInfo=function(r,c){var p={autocomplete:"list",live:"polite",relevant:"all",setsize:c._getListBox().getItems().length};if(c.getValueState()==sap.ui.core.ValueState.Error){p["invalid"]=true;}r.writeAccessibilityState(c,p);};return A;},true);
