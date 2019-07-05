// import {createElement} from '../utils/dom-methods';
import { baseCoreMixins } from '../utils/mixins/base-core-mixins';
import { DomElTemplate } from './dom-el-template';
import { deepMerge } from '../utils/deep-merge';
// import {DomElTemplate} from './template-renderer';

import {is, defaultTo, pick, mapObjIndexed, forEachObjIndexed, pipe} from 'ramda';
//import {ViewStreamElement} from './view-stream-element';
//import {getConstructorName} from '../utils/frp-tools';

export class DomEl {
  /**
   * @module DomEl
   * @type util
   *
   * @desc
   * <p>This is the ViewStream rendering engine.</p>
   * <p>This is the recommended process for creating HTMLElements that do not require the logic and overhead of a ViewStream instance.</p>
   * <button class='modal-btn btn btn-blue-ref' data-type='modal-window' data-num=800 data-value='attributes'>View Attributes</button>
   *
   * @constructor
   * @param {string} tagName the tagname for this dom element.
   * @param {object} attributes any domElement attribute (except for class )
   * @param {string|object} data string for text tags and json for templates
   * @param {template} template
   * @property {String} props.tagName - = 'div'; Default for tagName.
   * @property {Object} props.attributes - = {}; This can be any valid HTML attribute for the given tagName.
   * @property {String|Object} props.data = undefined; This is either a String for an element or JSON data object for a template.
   * @property {String|HTML} props.template = undefined; If a template is defined, the DomEl will use it.
   *
   */

  constructor(props={}) {
    //let isSimpleView = both(is(String), complement(isEmpty))(attributes);
   // if (isSimpleView === true) {
    //  data = attributes;
      // attributes = {};

   // }
    const checkDefault = (dflt, val)=>defaultTo(dflt)(val);

    props.tagName = checkDefault('div', props.tagName);


    props.attributes = props.attributes!==undefined ? props.attributes : this.getDomAttributes(props);
    props.attrs = this.updateAttrs(props.attributes);

    props.fragment =  document.createDocumentFragment()
    this.props = props;

    //this.setProp('tagName', tagName);
    //this.setProp('attrs', this.updateAttrs(attributes));
    //this.setProp('data', data);
   // this.setProp('template', template);

   // this.setProp('fragment', document.createDocumentFragment());

    this.addMixins();
  }

  setProp(key, val) {
    //this.props.set(key, val);
    this.props[key] = val;
  }

  getProp(val) {
    return this.props[val];
  }

  get el() {
    return this.props.el;
  }

  setElAttrs(el, params) {
    let addAttributes = (val, key) => {
      let addToDataset = (val, key) => { el.dataset[key] = val; };
      if (key === 'dataset') {
        forEachObjIndexed(addToDataset, val);
      } else {
        el.setAttribute(key, val);
      }
    };
    this.getProp('attrs').forEach(addAttributes);
    return el;
  }

  updateAttrs(params, m) {
    let theMap = m !== undefined ? m : new Map();
    let addAttributes = (val, key) => theMap.set(key, val);
    mapObjIndexed(addAttributes, params);
    return theMap;
  }

  addTemplate(el) {
    let template = this.getProp('template');

    let addTmpl = (template) => {
      let data = this.getProp('data');
      data = is(Object, data) ? data : {};

      let frag = new DomElTemplate(template, data).renderDocFrag();
      el.appendChild(frag);
      return el;
    };
    let doNothing = (el) => el;
    return template !== undefined ? addTmpl(template) : doNothing(el);
  }

  createElement(tagName = 'div') {
    return document.createElement(tagName);
  }

  addContent(el) {
    let text = (this.getProp('data'));
    let isText = is(String, text);
    if (isText === true) {
      let txt = document.createTextNode(text);
      el.appendChild(txt);
    }
    return el;
  }

  execute() {
    let el = pipe(
      this.createElement.bind(this),
      this.setElAttrs.bind(this),
      this.addTemplate.bind(this),
      this.addContent.bind(this)
    )(this.getProp('tagName'));
    // this.getProp('fragment').appendChild(el);
    this.props.el = el;
  }

  /**
   * This method will render the HTML Element
   * @returns {HTMLElement} HTMLElement
   */
  render() {
    this.execute();
    this.props.template = undefined;
    this.props.data = undefined;
    this.props.attributes = undefined;
    return this.getProp('el');
  }

  returnIfDefined(obj, val) {
    if (val !== undefined) {
      let isObj = typeof (val) === 'undefined';
      isObj === false ? obj[val] = val : obj[val] = deepMerge(obj[val], val);
    }
  }

  updateprops(val) {
    this.returnIfDefined(this.props, val);
    return this;
  }

  updatepropsAndRun(val) {
    this.updateprops(val);
    this.execute();
    return this.getProp('fragment');
  }

  unmount() {
    if (this.props !== undefined) {
      this.getProp('el').remove();
      this.props = undefined;
      this.gc();
    }
  }

  updateTag(tagName = 'div') { this.updateprops(tagName); }
  updateAttributes(attrs = {}) { this.updateprops(attrs); }
  updateTemplate(template) { this.updateprops(template); }
  updateData(data = {}) { this.updateprops(data); }
  addTagAndRender(tagName = 'div') { this.updatepropsAndRun(tagName); }
  addAttrsibutesAndRender(attrs = {}) { this.updatepropsAndRun(attrs); }
  addTemplateAndRender(template) { this.updatepropsAndRun(template); }
  addDataAndRender(data = {}) { this.updatepropsAndRun(data); }
  //  ==================================
  // BASE CORE MIXINS
  //  ==================================
  addMixins() {
    let coreMixins = baseCoreMixins();
    this.gc = coreMixins.gc.bind(this);
  }

  getDomAttributes(props){
    return pick(this.attributesArray, props);
  }
  get attributesArray() {
    return [
      'accept',
      'accept-charset',
      'accesskey',
      'action',
      'align',
      'allow',
      'alt',
      'async',
      'autocapitalize',
      'autocomplete',
      'autofocus',
      'autoplay',
      'bgcolor',
      'border',
      'buffered',
      'challenge',
      'charset',
      'checked',
      'cite',
      'class',
      'code',
      'codebase',
      'color',
      'cols',
      'colspan',
      'content',
      'contenteditable',
      'contextmenu',
      'controls',
      'coords',
      'crossorigin',
      'csp',
      'dataset',
      'datetime',
      'decoding',
      'default',
      'defer',
      'dir',
      'dirname',
      'disabled',
      'download',
      'draggable',
      'dropzone',
      'enctype',
      'for',
      'form',
      'formaction',
      'headers',
      'height',
      'hidden',
      'high',
      'href',
      'hreflang',
      'http-equiv',
      'icon',
      'id',
      'importance',
      'integrity',
      'ismap',
      'itemprop',
      'keytype',
      'kind',
      'label',
      'lang',
      'language',
      'lazyload',
      'list',
      'loop',
      'low',
      'manifest',
      'max',
      'maxlength',
      'minlength',
      'media',
      'method',
      'min',
      'multiple',
      'muted',
      'name',
      'novalidate',
      'open',
      'optimum',
      'pattern',
      'ping',
      'placeholder',
      'poster',
      'preload',
      'radiogroup',
      'readonly',
      'referrerpolicy',
      'rel',
      'required',
      'reversed',
      'rows',
      'rowspan',
      'sandbox',
      'scope',
      'scoped',
      'selected',
      'shape',
      'size',
      'sizes',
      'slot',
      'span',
      'spellcheck',
      'src',
      'srcdoc',
      'srclang',
      'srcset',
      'start',
      'step',
      'style',
      'summary',
      'tabindex',
      'target',
      'title',
      'translate',
      'type',
      'usemap',
      'value',
      'width',
      'wrap'
    ];
  }

}
