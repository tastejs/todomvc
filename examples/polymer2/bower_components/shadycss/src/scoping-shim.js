/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

'use strict';

import {parse, StyleNode} from './css-parse'
import {nativeShadow, nativeCssVariables} from './style-settings'
import StyleTransformer from './style-transformer'
import * as StyleUtil from './style-util'
import StyleProperties from './style-properties'
import placeholderMap from './style-placeholder'
import StyleInfo from './style-info'
import StyleCache from './style-cache'
import {flush as watcherFlush} from './document-watcher'
import templateMap from './template-map'
import * as ApplyShimUtils from './apply-shim-utils'
import documentWait from './document-wait'
import {updateNativeProperties} from './common-utils'
import {CustomStyleInterfaceInterface} from './custom-style-interface' //eslint-disable-line no-unused-vars

/**
 * @const {StyleCache}
 */
const styleCache = new StyleCache();

export default class ScopingShim {
  constructor() {
    this._scopeCounter = {};
    this._documentOwner = document.documentElement;
    let ast = new StyleNode();
    ast['rules'] = [];
    this._documentOwnerStyleInfo = StyleInfo.set(this._documentOwner, new StyleInfo(ast));
    this._elementsHaveApplied = false;
    this._applyShim = null;
    /** @type {?CustomStyleInterfaceInterface} */
    this._customStyleInterface = null;
    documentWait(() => {
      this._ensure();
    });
  }
  flush() {
    watcherFlush();
  }
  _generateScopeSelector(name) {
    let id = this._scopeCounter[name] = (this._scopeCounter[name] || 0) + 1;
    return `${name}-${id}`;
  }
  getStyleAst(style) {
    return StyleUtil.rulesForStyle(style);
  }
  styleAstToString(ast) {
    return StyleUtil.toCssText(ast);
  }
  _gatherStyles(template) {
    let styles = template.content.querySelectorAll('style');
    let cssText = [];
    for (let i = 0; i < styles.length; i++) {
      let s = styles[i];
      cssText.push(s.textContent);
      s.parentNode.removeChild(s);
    }
    return cssText.join('').trim();
  }
  _getCssBuild(template) {
    let style = template.content.querySelector('style');
    if (!style) {
      return '';
    }
    return style.getAttribute('css-build') || '';
  }
  /**
   * Prepare the styling and template for the given element type
   *
   * @param {HTMLTemplateElement} template
   * @param {string} elementName
   * @param {string=} typeExtension
   */
  prepareTemplate(template, elementName, typeExtension) {
    if (template._prepared) {
      return;
    }
    template._prepared = true;
    template.name = elementName;
    template.extends = typeExtension;
    templateMap[elementName] = template;
    let cssBuild = this._getCssBuild(template);
    let cssText = this._gatherStyles(template);
    let info = {
      is: elementName,
      extends: typeExtension,
      __cssBuild: cssBuild,
    };
    if (!nativeShadow) {
      StyleTransformer.dom(template.content, elementName);
    }
    // check if the styling has mixin definitions or uses
    this._ensure();
    let hasMixins = this._applyShim['detectMixin'](cssText);
    let ast = parse(cssText);
    // only run the applyshim transforms if there is a mixin involved
    if (hasMixins && nativeCssVariables) {
      this._applyShim['transformRules'](ast, elementName);
    }
    template['_styleAst'] = ast;
    template._cssBuild = cssBuild;

    let ownPropertyNames = [];
    if (!nativeCssVariables) {
      ownPropertyNames = StyleProperties.decorateStyles(template['_styleAst'], info);
    }
    if (!ownPropertyNames.length || nativeCssVariables) {
      let root = nativeShadow ? template.content : null;
      let placeholder = placeholderMap[elementName];
      let style = this._generateStaticStyle(info, template['_styleAst'], root, placeholder);
      template._style = style;
    }
    template._ownPropertyNames = ownPropertyNames;
  }
  _generateStaticStyle(info, rules, shadowroot, placeholder) {
    let cssText = StyleTransformer.elementStyles(info, rules);
    if (cssText.length) {
      return StyleUtil.applyCss(cssText, info.is, shadowroot, placeholder);
    }
  }
  _prepareHost(host) {
    let {is, typeExtension} = StyleUtil.getIsExtends(host);
    let placeholder = placeholderMap[is];
    let template = templateMap[is];
    let ast;
    let ownStylePropertyNames;
    let cssBuild;
    if (template) {
      ast = template['_styleAst'];
      ownStylePropertyNames = template._ownPropertyNames;
      cssBuild = template._cssBuild;
    }
    return StyleInfo.set(host,
      new StyleInfo(
        ast,
        placeholder,
        ownStylePropertyNames,
        is,
        typeExtension,
        cssBuild
      )
    );
  }
  _ensureApplyShim() {
    if (this._applyShim) {
      return;
    } else if (window.ShadyCSS.ApplyShim) {
      this._applyShim = window.ShadyCSS.ApplyShim;
      this._applyShim['invalidCallback'] = ApplyShimUtils.invalidate;
    } else {
      this._applyShim = {
        /* eslint-disable no-unused-vars */
        ['detectMixin'](str){return false},
        ['transformRule'](ast){},
        ['transformRules'](ast, name){},
        /* eslint-enable no-unused-vars */
      }
    }
  }
  _ensureCustomStyleInterface() {
    if (this._customStyleInterface) {
      return;
    } else if (window.ShadyCSS.CustomStyleInterface) {
      this._customStyleInterface = /** @type {!CustomStyleInterfaceInterface} */(window.ShadyCSS.CustomStyleInterface);
      /** @type {function(!HTMLStyleElement)} */
      this._customStyleInterface['transformCallback'] = (style) => {this.transformCustomStyleForDocument(style)};
      this._customStyleInterface['validateCallback'] = () => {
        requestAnimationFrame(() => {
          if (this._customStyleInterface['enqueued'] || this._elementsHaveApplied) {
            this.flushCustomStyles();
          }
        })
      };
    } else {
      this._customStyleInterface = /** @type {!CustomStyleInterfaceInterface} */({
        ['processStyles']() {},
        ['enqueued']: false,
        ['getStyleForCustomStyle'](s) { return null } // eslint-disable-line no-unused-vars
      })
    }
  }
  _ensure() {
    this._ensureApplyShim();
    this._ensureCustomStyleInterface();
  }
  /**
   * Flush and apply custom styles to document
   */
  flushCustomStyles() {
    this._ensure();
    let customStyles = this._customStyleInterface['processStyles']();
    // early return if custom-styles don't need validation
    if (!this._customStyleInterface['enqueued']) {
      return;
    }
    if (!nativeCssVariables) {
      this._updateProperties(this._documentOwner, this._documentOwnerStyleInfo);
      this._applyCustomStyles(customStyles);
    } else {
      this._revalidateCustomStyleApplyShim(customStyles);
    }
    this._customStyleInterface['enqueued'] = false;
    // if custom elements have upgraded and there are no native css variables, we must recalculate the whole tree
    if (this._elementsHaveApplied && !nativeCssVariables) {
      this.styleDocument();
    }
  }
  /**
   * Apply styles for the given element
   *
   * @param {!HTMLElement} host
   * @param {Object=} overrideProps
   */
  styleElement(host, overrideProps) {
    let {is} = StyleUtil.getIsExtends(host);
    let styleInfo = StyleInfo.get(host);
    if (!styleInfo) {
      styleInfo = this._prepareHost(host);
    }
    // Only trip the `elementsHaveApplied` flag if a node other that the root document has `applyStyle` called
    if (!this._isRootOwner(host)) {
      this._elementsHaveApplied = true;
    }
    if (overrideProps) {
      styleInfo.overrideStyleProperties =
        styleInfo.overrideStyleProperties || {};
      Object.assign(styleInfo.overrideStyleProperties, overrideProps);
    }
    if (!nativeCssVariables) {
     this._updateProperties(host, styleInfo);
      if (styleInfo.ownStylePropertyNames && styleInfo.ownStylePropertyNames.length) {
        this._applyStyleProperties(host, styleInfo);
      }
    } else {
      if (styleInfo.overrideStyleProperties) {
        updateNativeProperties(host, styleInfo.overrideStyleProperties);
      }
      let template = templateMap[is];
      // bail early if there is no shadowroot for this element
      if (!template && !this._isRootOwner(host)) {
        return;
      }
      if (template && template._style && !ApplyShimUtils.templateIsValid(template)) {
        // update template
        if (!ApplyShimUtils.templateIsValidating(template)) {
          this._ensure();
          this._applyShim['transformRules'](template['_styleAst'], is);
          template._style.textContent = StyleTransformer.elementStyles(host, styleInfo.styleRules);
          ApplyShimUtils.startValidatingTemplate(template);
        }
        // update instance if native shadowdom
        if (nativeShadow) {
          let root = host.shadowRoot;
          if (root) {
            let style = root.querySelector('style');
            style.textContent = StyleTransformer.elementStyles(host, styleInfo.styleRules);
          }
        }
        styleInfo.styleRules = template['_styleAst'];
      }
    }
  }
  _styleOwnerForNode(node) {
    let root = node.getRootNode();
    let host = root.host;
    if (host) {
      if (StyleInfo.get(host)) {
        return host;
      } else {
        return this._styleOwnerForNode(host);
      }
    }
    return this._documentOwner;
  }
  _isRootOwner(node) {
    return (node === this._documentOwner);
  }
  _applyStyleProperties(host, styleInfo) {
    let is = StyleUtil.getIsExtends(host).is;
    let cacheEntry = styleCache.fetch(is, styleInfo.styleProperties, styleInfo.ownStylePropertyNames);
    let cachedScopeSelector = cacheEntry && cacheEntry.scopeSelector;
    let cachedStyle = cacheEntry ? cacheEntry.styleElement : null;
    let oldScopeSelector = styleInfo.scopeSelector;
    // only generate new scope if cached style is not found
    styleInfo.scopeSelector = cachedScopeSelector || this._generateScopeSelector(is);
    let style = StyleProperties.applyElementStyle(host, styleInfo.styleProperties, styleInfo.scopeSelector, cachedStyle);
    if (!nativeShadow) {
      StyleProperties.applyElementScopeSelector(host, styleInfo.scopeSelector, oldScopeSelector);
    }
    if (!cacheEntry) {
      styleCache.store(is, styleInfo.styleProperties, style, styleInfo.scopeSelector);
    }
    return style;
  }
  _updateProperties(host, styleInfo) {
    let owner = this._styleOwnerForNode(host);
    let ownerStyleInfo = StyleInfo.get(owner);
    let ownerProperties = ownerStyleInfo.styleProperties;
    let props = Object.create(ownerProperties || null);
    let hostAndRootProps = StyleProperties.hostAndRootPropertiesForScope(host, styleInfo.styleRules);
    let propertyData = StyleProperties.propertyDataFromStyles(ownerStyleInfo.styleRules, host);
    let propertiesMatchingHost = propertyData.properties
    Object.assign(
      props,
      hostAndRootProps.hostProps,
      propertiesMatchingHost,
      hostAndRootProps.rootProps
    );
    this._mixinOverrideStyles(props, styleInfo.overrideStyleProperties);
    StyleProperties.reify(props);
    styleInfo.styleProperties = props;
  }
  _mixinOverrideStyles(props, overrides) {
    for (let p in overrides) {
      let v = overrides[p];
      // skip override props if they are not truthy or 0
      // in order to fall back to inherited values
      if (v || v === 0) {
        props[p] = v;
      }
    }
  }
  /**
   * Update styles of the whole document
   *
   * @param {Object=} properties
   */
  styleDocument(properties) {
    this.styleSubtree(this._documentOwner, properties);
  }
  /**
   * Update styles of a subtree
   *
   * @param {!HTMLElement} host
   * @param {Object=} properties
   */
  styleSubtree(host, properties) {
    let root = host.shadowRoot;
    if (root || this._isRootOwner(host)) {
      this.styleElement(host, properties);
    }
    // process the shadowdom children of `host`
    let shadowChildren = root && (root.children || root.childNodes);
    if (shadowChildren) {
      for (let i = 0; i < shadowChildren.length; i++) {
        let c = /** @type {!HTMLElement} */(shadowChildren[i]);
        this.styleSubtree(c);
      }
    } else {
      // process the lightdom children of `host`
      let children = host.children || host.childNodes;
      if (children) {
        for (let i = 0; i < children.length; i++) {
          let c = /** @type {!HTMLElement} */(children[i]);
          this.styleSubtree(c);
        }
      }
    }
  }
  /* Custom Style operations */
  _revalidateCustomStyleApplyShim(customStyles) {
    for (let i = 0; i < customStyles.length; i++) {
      let c = customStyles[i];
      let s = this._customStyleInterface['getStyleForCustomStyle'](c);
      if (s) {
        this._revalidateApplyShim(s);
      }
    }
  }
  _applyCustomStyles(customStyles) {
    for (let i = 0; i < customStyles.length; i++) {
      let c = customStyles[i];
      let s = this._customStyleInterface['getStyleForCustomStyle'](c);
      if (s) {
        StyleProperties.applyCustomStyle(s, this._documentOwnerStyleInfo.styleProperties);
      }
    }
  }
  transformCustomStyleForDocument(style) {
    let ast = StyleUtil.rulesForStyle(style);
    StyleUtil.forEachRule(ast, (rule) => {
      if (nativeShadow) {
        StyleTransformer.normalizeRootSelector(rule);
      } else {
        StyleTransformer.documentRule(rule);
      }
      if (nativeCssVariables) {
        this._ensure();
        this._applyShim['transformRule'](rule);
      }
    });
    if (nativeCssVariables) {
      style.textContent = StyleUtil.toCssText(ast);
    } else {
      this._documentOwnerStyleInfo.styleRules.rules.push(ast);
    }
  }
  _revalidateApplyShim(style) {
    if (nativeCssVariables) {
      let ast = StyleUtil.rulesForStyle(style);
      this._ensure();
      this._applyShim['transformRules'](ast);
      style.textContent = StyleUtil.toCssText(ast);
    }
  }
  getComputedStyleValue(element, property) {
    let value;
    if (!nativeCssVariables) {
      // element is either a style host, or an ancestor of a style host
      let styleInfo = StyleInfo.get(element) || StyleInfo.get(this._styleOwnerForNode(element));
      value = styleInfo.styleProperties[property];
    }
    // fall back to the property value from the computed styling
    value = value || window.getComputedStyle(element).getPropertyValue(property);
    // trim whitespace that can come after the `:` in css
    // example: padding: 2px -> " 2px"
    return value ? value.trim() : '';
  }
  // given an element and a classString, replaces
  // the element's class with the provided classString and adds
  // any necessary ShadyCSS static and property based scoping selectors
  setElementClass(element, classString) {
    let root = element.getRootNode();
    let classes = classString ? classString.split(/\s/) : [];
    let scopeName = root.host && root.host.localName;
    // If no scope, try to discover scope name from existing class.
    // This can occur if, for example, a template stamped element that
    // has been scoped is manipulated when not in a root.
    if (!scopeName) {
      var classAttr = element.getAttribute('class');
      if (classAttr) {
        let k$ = classAttr.split(/\s/);
        for (let i=0; i < k$.length; i++) {
          if (k$[i] === StyleTransformer.SCOPE_NAME) {
            scopeName = k$[i+1];
            break;
          }
        }
      }
    }
    if (scopeName) {
      classes.push(StyleTransformer.SCOPE_NAME, scopeName);
    }
    if (!nativeCssVariables) {
      let styleInfo = StyleInfo.get(element);
      if (styleInfo && styleInfo.scopeSelector) {
        classes.push(StyleProperties.XSCOPE_NAME, styleInfo.scopeSelector);
      }
    }
    StyleUtil.setElementClassRaw(element, classes.join(' '));
  }
  _styleInfoForNode(node) {
    return StyleInfo.get(node);
  }
}

/* exports */
ScopingShim.prototype['flush'] = ScopingShim.prototype.flush;
ScopingShim.prototype['prepareTemplate'] = ScopingShim.prototype.prepareTemplate;
ScopingShim.prototype['styleElement'] = ScopingShim.prototype.styleElement;
ScopingShim.prototype['styleDocument'] = ScopingShim.prototype.styleDocument;
ScopingShim.prototype['styleSubtree'] = ScopingShim.prototype.styleSubtree;
ScopingShim.prototype['getComputedStyleValue'] = ScopingShim.prototype.getComputedStyleValue;
ScopingShim.prototype['setElementClass'] = ScopingShim.prototype.setElementClass;
ScopingShim.prototype['_styleInfoForNode'] = ScopingShim.prototype._styleInfoForNode;
ScopingShim.prototype['transformCustomStyleForDocument'] = ScopingShim.prototype.transformCustomStyleForDocument;
ScopingShim.prototype['getStyleAst'] = ScopingShim.prototype.getStyleAst;
ScopingShim.prototype['styleAstToString'] = ScopingShim.prototype.styleAstToString;
ScopingShim.prototype['flushCustomStyles'] = ScopingShim.prototype.flushCustomStyles;
Object.defineProperties(ScopingShim.prototype, {
  'nativeShadow': {
    get() {
      return nativeShadow;
    }
  },
  'nativeCss': {
    get() {
      return nativeCssVariables;
    }
  }
});