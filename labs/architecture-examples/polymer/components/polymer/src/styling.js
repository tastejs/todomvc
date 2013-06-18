/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

(function() {

  // imports
  var log = window.logFlags || {};

  var doc = wrap(document);

  /**
   * Install external stylesheets loaded in <element> elements into the 
   * element's template.
   * @param elementElement The <element> element to style.
   */
  function installSheets(elementElement) {
    installLocalSheets(elementElement);
    installGlobalStyles(elementElement);
  }
  
  /**
   * Takes external stylesheets loaded in an <element> element and moves
   * their content into a <style> element inside the <element>'s template.
   * The sheet is then removed from the <element>. This is done only so 
   * that if the element is loaded in the main document, the sheet does
   * not become active.
   * Note, ignores sheets with the attribute 'polymer-scope'.
   * @param elementElement The <element> element to style.
   */
  function installLocalSheets(elementElement) {
    var sheets = findInElement(elementElement, SHEET_SELECTOR, function(s) {
      return !s.hasAttribute(SCOPE_ATTR);
    });
    var content = elementTemplateContent(elementElement);
    if (content) {
      // in case we're in document, remove from element
      var cssText = '';
      sheets.forEach(function(sheet) {
        sheet.parentNode.removeChild(sheet);
        cssText += cssTextFromSheet(sheet) + '\n';
      });
      if (cssText) {
        content.insertBefore(createStyleElement(cssText), content.firstChild);
      }
    }
  }
  
  /**
   * Promotes external stylesheets and <style> elements with the attribute 
   * polymer-scope='global' into global scope.
   * This is particularly useful for defining @keyframe rules which 
   * currently do not function in scoped or shadow style elements.
   * (See wkb.ug/72462)
   * @param elementElement The <element> element to style.
  */
  // TODO(sorvell): remove when wkb.ug/72462 is addressed.
  function installGlobalStyles(elementElement) {
    applyStyleToScope(styleFromElement(elementElement, STYLE_GLOBAL_SCOPE),
      doc.head);
  }
  
  /**
   * Installs external stylesheets and <style> elements with the attribute 
   * polymer-scope='controller' into the scope of element. This is intended
   * to be a called during custom element construction. Note, this incurs a per
   * instance cost and should be used sparingly.
   * The need for this type of styling should go away when the shadowDOM spec
   * addresses these issues:
   * 
   * https://www.w3.org/Bugs/Public/show_bug.cgi?id=21391
   * https://www.w3.org/Bugs/Public/show_bug.cgi?id=21390
   * https://www.w3.org/Bugs/Public/show_bug.cgi?id=21389
   * 
   * @param element The custom element instance into whose controller (parent)
   * scope styles will be installed.
   * @param elementElement The <element> containing controller styles.
  */
  // TODO(sorvell): remove when spec issues are addressed
  function installControllerStyles(element, elementElement) {
      if (!elementElement.controllerStyle) {
        elementElement.controllerStyle = styleFromElement(elementElement,
          STYLE_CONTROLLER_SCOPE);
      }
      var styleElement = elementElement.controllerStyle;
      var scope = findStyleController(element);
      // apply controller styles only if they are not yet applied
      if (scope && !scopeHasElementStyle(scope, element, 
        STYLE_CONTROLLER_SCOPE)) {
        Polymer.shimPolyfillDirectives([styleElement], element.localName);
        applyStyleToScope(styleElement, scope);
      }
  }
  
  function scopeHasElementStyle(scope, element, descriptor) {
    return scope.querySelector('style[' + STYLE_SCOPE_ATTRIBUTE + '=' + 
      element.localName + '-' + descriptor + ']');
  }
  
  function cssTextFromElement(elementElement, descriptor) {
    var cssText = '';
    // handle stylesheets
    var selector = '[' + SCOPE_ATTR + '=' + descriptor + ']';
    var matcher = function(s) {
      return matchesSelector(s, selector);
    };
    var sheets = findInElement(elementElement, SHEET_SELECTOR, matcher);
    sheets.forEach(function(sheet) {
      // in case we're in document, remove from element
      sheet.parentNode.removeChild(sheet);
      cssText += cssTextFromSheet(sheet) + '\n\n';
    });
    // handle style elements
    var styles = findInElement(elementElement, STYLE_SELECTOR, matcher);
    styles.forEach(function(style) {
      // in case we're in document, remove from element
      style.parentNode.removeChild(style);
      cssText += style.textContent + '\n\n';
    });
    return cssText;
  }
  
  function styleFromElement(elementElement, descriptor) {
    var cssText = cssTextFromElement(elementElement, descriptor);
    if (cssText) {
      var style = createStyleElement(cssText);
      style.setAttribute(STYLE_SCOPE_ATTRIBUTE, elementElement.options.name +
      '-' + descriptor);
      return style;
    }
  }
  
  function findInElement(elementElement, selector, matcher) {
    var nodes = arrayFromNodeList(elementElement
      .querySelectorAll(selector));
    var content = elementTemplateContent(elementElement);
    if (content) {
      var templateNodes = arrayFromNodeList(content
        .querySelectorAll(selector));
      nodes = nodes.concat(templateNodes);
    }
    return nodes.filter(matcher);
  }
  function findStyleController(node) {
    // find the shadow root that contains inNode
    var n = node;
    while (n.parentNode) {
      n = n.parentNode;
    }
    return n == doc ? doc.head : n;
  };

  function createStyleElement(cssText) {
    var style = document.createElement('style');
    style.textContent = cssText;
    return style;
  }

  function cssTextFromSheet(sheet) {
    return (sheet && sheet.__resource) || '';
  }

  function applyStyleToScope(style, scope) {
    if (style) {
      var clone = style.cloneNode(true);
      // TODO(sorvell): necessary for IE
      // see https://connect.microsoft.com/IE/feedback/details/790212/
      // cloning-a-style-element-and-adding-to-document-produces
      // -unexpected-result#details
      clone.textContent = style.textContent;
      scope.appendChild(clone);
    }
  }

  var eltProto = HTMLElement.prototype;
  var matches = eltProto.matches || eltProto.matchesSelector ||
      eltProto.webkitMatchesSelector || eltProto.mozMatchesSelector;
  function matchesSelector(node, inSelector) {
    if (matches) {
      return matches.call(node, inSelector);
    }
  }
  
  function elementTemplateContent(elementElement) {
    var template = elementElement.querySelector('template');
    return template && templateContent(template);
  }
  
  var STYLE_SELECTOR = 'style';
  var SHEET_SELECTOR = '[rel=stylesheet]';
  var STYLE_SCOPE_ATTRIBUTE = 'element';
  var STYLE_GLOBAL_SCOPE = 'global';
  var STYLE_CONTROLLER_SCOPE = 'controller';
  var SCOPE_ATTR = 'polymer-scope';
  function arrayFromNodeList(nodeList) {
    return Array.prototype.slice.call(nodeList || [], 0);
  }
  
  // exports
  Polymer.installSheets = installSheets;
  Polymer.installControllerStyles = installControllerStyles;
})();