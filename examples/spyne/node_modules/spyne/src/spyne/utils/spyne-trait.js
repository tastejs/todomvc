import { getAllMethodNames } from './frp-tools';
import {reject, test, curryN, __, map} from 'ramda';

export class SpyneTrait {
  /**
   * @module SpyneTrait
   * @type extendable
   * @param {this} parentContext
   * @param {String} prefix
   * @param {Boolean} autoInit
   * @constructor
   * @property {this} parentContent - = undefined; This binds all methods within SpyneTrait into the parentContext's object
   * @property {String} prefix - = undefined; SpyneTraits forces all method names to begin with the same prefix. This allows other objects to quickly understand where the original method is set.
   * @desc
   * SpyneTraits allow the ehancing of classes and other objects without having to extend classes or manipulate function prototypes
   *
   */

  constructor(parentContext, prefix = '', autoInit = true) {
    this.parentContext = parentContext;
    this.omittedMethods = [
      'autoBinder',
      'initAutoBinder',
      'getEnhancerMethods',
      'checkForMalformedMethods',
        'caller',
        'arguments',
      'bindParentViewStream'];

    this.prefix = prefix;

    if (autoInit === true) {
      this.autoBinder();
    }
    return this.allMethodsList;
  }

  initAutoBinder() {
     this.autoBinder();
  }

  getEnhancerMethods() {
    return getAllMethodNames(this, this.omittedMethods);
  }

  checkForMalformedMethods(methodsArr) {
    if (this.prefix === '') {
      console.warn(`SPYNE WARNING: The following SpyneTrait ${this.constructor.name} needs a prefix`);
      return;
    }
    //let reStr = `^(${this.prefix})(.*)$`;
    //let re = new RegExp(reStr);
    const hasPrefix = (str)=>str.indexOf(this.prefix)===0;

    let malformedMethodsArr = reject(hasPrefix, methodsArr);
    if (malformedMethodsArr.length >= 1) {
      let warningStr = `Spyne Warning: The following method(s) in ${this.constructor.name} require the prefix, "${this.prefix}": [${malformedMethodsArr.join(', ')}];`;
      console.warn(warningStr);
    }
  }

  bindParentViewStream(methodsObj, context) {
    this.checkForMalformedMethods(methodsObj.allMethods);
      let obj = {};
    const bindMethodsToParentViewStream = (str, isStatic = false) => {
      const addMethod = s =>  {
        return context[s] = constructorType[s].bind(context);
      };
      let constructorType = isStatic === true ? this.constructor : this;
      let propertyType = typeof (constructorType[str]);
      if (propertyType === 'function') {
         obj[str] = addMethod(str);
      }
    };

    const bindCurry = curryN(2, bindMethodsToParentViewStream);
    const bindStaticMethodsToParentViewStream = bindCurry(__, true);
    // MAP STATIC METHODS
    map(bindStaticMethodsToParentViewStream, methodsObj.staticMethods);
    // MAP MAIN METHODS
    map(bindMethodsToParentViewStream, methodsObj.methods);
    return obj;
  }

  autoBinder() {
    let allMethods = this.getEnhancerMethods();
    // console.log('all ',allMethods);
    this.allMethodsList = this.bindParentViewStream(allMethods, this.parentContext);
    return this.allMethodsList;
  }
}
