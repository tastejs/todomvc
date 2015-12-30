/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./TextFieldRenderer'],function(q,T){"use strict";var P=sap.ui.core.Renderer.extend(T);P.renderInnerAttributes=function(r,p){if(sap.ui.Device.support.input.placeholder||p.getValue()||!p.getPlaceholder()){r.writeAttribute('type','password');}};P.renderTextFieldEnabled=function(r,p){if(!p.getEnabled()&&!p.getEditable()){r.writeAttribute('readonly','readonly');r.writeAttribute('tabindex','-1');}else{r.writeAttribute('tabindex','0');}};P.setEnabled=function(p,e){var t=p.getDomRef();if(e){if(p.getEditable()){q(t).removeClass('sapUiTfDsbl').addClass('sapUiTfStd');q(t).removeAttr('readonly').attr('tabindex','0');}else{q(t).removeClass('sapUiTfDsbl').addClass('sapUiTfRo');q(t).attr('tabindex','0');}}else{if(p.getEditable()){q(t).removeClass('sapUiTfStd').addClass('sapUiTfDsbl');q(t).attr('readonly','readonly').attr('tabindex','-1');}else{q(t).removeClass('sapUiTfRo').addClass('sapUiTfDsbl');q(t).attr('tabindex','-1');}}};return P;},true);
