/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./ComboBoxBaseRenderer','sap/ui/core/Renderer'],function(q,C,R){"use strict";var a=R.extend(sap.m.ComboBoxBaseRenderer);a.CSS_CLASS="sapMComboBox";a.addOuterClasses=function(r,c){C.addOuterClasses.apply(this,arguments);var b=a.CSS_CLASS;r.addClass(b);r.addClass(b+"Input");};a.addInnerClasses=function(r,c){C.addInnerClasses.apply(this,arguments);r.addClass(a.CSS_CLASS+"InputInner");};a.addButtonClasses=function(r,c){C.addButtonClasses.apply(this,arguments);r.addClass(a.CSS_CLASS+"Arrow");};a.addPlaceholderClasses=function(r,c){C.addPlaceholderClasses.apply(this,arguments);r.addClass(a.CSS_CLASS+"Placeholder");};return a;},true);
