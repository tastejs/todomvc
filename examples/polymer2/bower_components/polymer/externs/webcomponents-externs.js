/**
 * @fileoverview Externs for webcomponents polyfills
 * @externs
 */

/**
 * @constructor
 * @extends {HTMLElement}
 */
function CustomStyle(){}
/**
 * @param {!HTMLStyleElement} style
 */
CustomStyle.prototype.processHook = function(style){};

let HTMLImports = {
  /**
   * @param {function()} callback
   */
  whenReady(callback){}
};

window.HTMLImports = HTMLImports;

let ShadyCSS = {
  /**
   * @param {!HTMLElement} element
   * @param {Object=} overrides
   */
  applyStyle(element, overrides){},
  updateStyles(){},
  /**
   * @param {!HTMLTemplateElement} template
   * @param {string} is
   * @param {string=} extendsElement
   */
  prepareTemplate(template, is, extendsElement){},
  nativeCss: false,
  nativeShadow: false
};
window.ShadyCSS = ShadyCSS;

let ShadyDOM = {
  inUse: false,
  flush(){},
  /**
   * @param {!Node} target
   * @param {function(Array<MutationRecord>, MutationObserver)} callback
   * @return {MutationObserver}
   */
  observeChildren(target, callback){},
  /**
   * @param {MutationObserver} observer
   */
  unobserveChildren(observer){},
  /**
   * @param {Node} node
   */
  patch(node){}
};

window.ShadyDOM = ShadyDOM;

let WebComponents = {};
window.WebComponents = WebComponents;

/** @type {Element} */
HTMLElement.prototype._activeElement;

/**
 * @param {HTMLTemplateElement} template
 */
HTMLTemplateElement.prototype.decorate = function(template){};
