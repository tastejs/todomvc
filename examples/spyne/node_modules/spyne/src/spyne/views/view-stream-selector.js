import {head, compose, path, lte, defaultTo, prop} from 'ramda';


function generateSpyneSelectorId(el) {
  //const num = () => Math.floor(Math.random(10000000) * 10000000);
  const num = () => Math.random().toString(36).substring(2, 8);;
  let vsid = `${num()}`;
  if (el.dataset.vsid === undefined) {
    el.dataset.vsid = vsid;
  } else {
    vsid = el.dataset.vsid;
  }
  return `[data-vsid='${vsid}']`;
}

function isDevMode(){
  return path(['Spyne', 'config', 'debug'], window) === true;
}


function isNodeElement(el){
  const nodeCheck = compose(lte(0), defaultTo(-1), prop('nodeType'));
  return nodeCheck(el);
}

function getElOrList(cxt, str, verboseBool=false) {
  let list = getNodeListArray(cxt, str, verboseBool);
  return list.length === 1 ? head(list) : list;
};

function testSelectors(cxt, str, verboseBool) {
  let el = document.querySelector(cxt);

  const elIsDomElement = compose(lte(0), defaultTo(-1),
      prop('nodeType'));

  if (elIsDomElement(el) === false) {
    console.warn(`Spyne Warning: the el object is not a valid single element, ${el}`);
    return;
  }

  if (str !== undefined) {
    let query = el.querySelector(str);
    if (query === null) {
      if (isDevMode() === true && verboseBool===true) {
        console.warn(`Spyne Warning: the selector, ${str} does not exist in this el, ${cxt}`);
      }

    }
  }

}

function getNodeListArray(cxt, str, verboseBool=false) {
  let selector = str !== undefined ? `${cxt} ${str}` : cxt;
  if (verboseBool===true) {
    testSelectors(cxt, str, verboseBool);
  }
  return document.querySelectorAll(selector);
}

function setInlineCss(val, cxt, str) {
  let arr = getNodeListArray(cxt, str);
  const addInlineCss = item => {
    item.style.cssText = val;
  };
  arr.forEach(addInlineCss);
  return this;
}

/**
 *
 * @module ViewStreamSelector
 * @type internal
 *
 * @param {String|El} cxt The main element
 * @param {String|El} The selector as a String
 * @returns {function(*=)}
 * @constructor
 */

function ViewStreamSelector(cxt, str) {
  cxt = typeof (cxt) === 'string' ? cxt : generateSpyneSelectorId(cxt);
  testSelectors(cxt, str, false);

  function selector(str) {
    return ViewStreamSelector(cxt, str);
  }


  /**
   * Convenience method to map through a NodeList.
   *
   * @param {Function} fn
   * @returns An array of elements
   */
  selector.map = (fn)=> Array.from(getNodeListArray(cxt, str)).map(fn);

  /**
   * Convenience method to iterate through a NodeList
   *
   * @param {Function} fn
   * @returns An array of elements
   */
  selector.forEach = (fn)=> Array.from(getNodeListArray(cxt, str)).map(fn);


  selector.getNodeListArray = () => getNodeListArray(cxt, str);

  /**
   *
   * Adds the class to the Element or to the NodeList.
   * @param {String} c
   *
   *
   * @property {String} c - = undefined; The class to be added.
   *
   **/
  selector.addClass = (c) => {
    let arr = getNodeListArray(cxt, str);
    const addClass = item => item.classList.add(c);
    arr.forEach(addClass);
    return this;
  };

  /**
   *
   * @param {String} c
   * @desc Removes the class to the Element or to the NodeList.
   */
  selector.removeClass = (c) => {
    let arr = getNodeListArray(cxt, str);
    const removeClass = item => {
      item.classList.remove(c);
    };
    arr.forEach(removeClass);
    return this;
  };

  /**
   *
   * @param {String} c
   * @desc Sets the class to equal exactly the class string.
   */
  selector.setClass = (c) => {
    let arr = getNodeListArray(cxt, str);
    const removeClass = item => item.classList = c;
    arr.forEach(removeClass);
    return this;
  };

  selector.unmount = () => {
    console.log('unmounting selector ', this);
  };


  /**
   *
   * @param {String} c
   * @param {Boolean} bool Default is undefined.
   * @desc Sets the class based on the provided boolean or the toggles the class.
   *
   * @example
   * this.props.el$.toggleClass('myclass', true);
   *
   */
  selector.toggleClass = (c, bool) => {
    let arr = getNodeListArray(cxt, str);
    const toggleClass = item => {
      bool = bool !== undefined ? bool : !item.classList.contains(c);
      item.classList.toggle(c, bool);
    };
    arr.forEach(toggleClass);
    return this;
  };


  selector.toggle = (c, bool) => {
    selector.toggleClass(c, bool);
    return this;
  };





  /**
   * Attaches html to the Selector's element
   * @param htmlElement
   */
  selector.appendChild=(htmlElement)=>{
    if (selector.el.length!==0) {
      selector.el.appendChild(htmlElement);
    } else{
      console.warn(`Spyne Warning: The selector, ${str} does not appear to be valid!`);
    }

    return selector.el;
  };

  /**
   *
   * Adds class with a delay of 1ms to allow css to register a transition.
   * @param c
   */
  selector.addAnimClass = (c)=>{
    const delayAddClass = ()=>{
      let arr = getNodeListArray(cxt, str);
      const addClass = item => item.classList.add(c);
      arr.forEach(addClass);
    };
    window.setTimeout(delayAddClass, 1);
  };


  /**
   *
   * @param {String} c
   * @param {String|HTMLElement} sel The selector for the element.
   * @desc Sets the class active HTMLElement from a NodeList.
   */
  selector.setActiveItem = (c, sel) => {
    let arr = getNodeListArray(cxt, str);
    let currentEl = typeof (sel) === 'string' ? getElOrList(cxt, sel) : sel;
    const toggleBool = item => item.classList.toggle(c, item.isEqualNode(currentEl));
    if (isNodeElement(currentEl)===true) {
      arr.forEach(toggleBool);
    } else if (isDevMode()===true){
      console.log("SEL IS ",sel,c);
      console.warn(`Spyne Warning: The selector, ${sel}, does not appear to be a valid item in setActiveItem: ${c}`);
    }
    return this;
  };

  /**
   *
   * @function el
   *
   * @desc
   * getter for the selector
   *
   * @returns
   * The a single element or a NodeList from the selector
   */


  /**
   *
   * @function length
   *
   * @desc
   * Determines the length of the NodeList
   *
   * @returns
   * The length of the selector as a NodeList
   */

  /**
   *
   * @function exists
   *
   * @desc
   * Determines whether an the selected element exists
   *
   * @returns
   * Boolean
   */


  Object.defineProperty(selector, 'el', {get: () => getElOrList(cxt, str, true)});
  Object.defineProperty(selector, 'length', {get: () => getNodeListArray(cxt, str, false).length});
  Object.defineProperty(selector, 'exists', {get: () => getNodeListArray(cxt, str, false).length>=1});
  Object.defineProperty(selector, 'exist', {get: () => getNodeListArray(cxt, str, false).length>=1});
  Object.defineProperty(selector, 'nodeList', {get: () => getNodeListArray(cxt, str)});
  Object.defineProperty(selector, 'inline', {set: (val) => setInlineCss(val, cxt, str)});
  Object.defineProperty(selector, 'inlineCss', {set: (val) => setInlineCss(val, cxt, str)});

  return selector;

}

export {ViewStreamSelector};
