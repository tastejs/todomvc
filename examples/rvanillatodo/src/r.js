// Note: 
  // now is not the time for optimization. 
  // That comes later.
"use strict";
  const DEBUG             = true;
  const KEYMATCH          = / ?(?:<!\-\-)? ?(key\d+) ?(?:\-\->)? ?/gm;
  const KEYLEN            = 20;
  const OURPROPS          = 'code,externals,nodes,to,update,v';
  const CODE              = ''+Math.random();
  const XSS               = () => `Possible XSS / object forgery attack detected. ` +
                            `Object value could not be verified.`;
  const OBJ               = () => `Object values not allowed here.`;
  const UNSET             = () => `Unset values not allowed here.`;
  const MOVE              = new class {
                              beforeEnd   (frag,elem) { elem.appendChild(frag) }
                              beforeBegin (frag,elem) { elem.parentNode.insertBefore(frag,elem) }
                              afterEnd    (frag,elem) { elem.parentNode.insertBefore(frag,elem.nextSibling) }
                              replace     (frag,elem) { elem.parentNode.replaceChild(frag,elem) }
                              afterBegin  (frag,elem) { elem.insertBefore(frag,elem.firstChild) }
                              innerHTML   (frag,elem) { elem.innerHTML = ''; elem.appendChild(frag) }
                            };
  const INSERT            = () => `Error inserting template into DOM. ` +
                            `Position must be one of: ` +
                            `replace, beforeBegin, afterBegin, beforeEnd, innerHTML, afterEnd`;
  const isKey             = v => typeof v === "object" &&  typeof v.key == "string";
  const cache = {};

  Object.assign(R,{s});
  export {R,X};

  function X(p,...v) {
    v = v.map(parseVal);

    p = [...p]; 
    const vmap = {};
    const V = v.map(replaceVal(vmap));
    const externals = [];
    let str = '';

    while( p.length > 1 ) str += p.shift() + V.shift();
    str += p.shift();

    const frag = toDOM(str);
    const walker = document.createTreeWalker(frag, NodeFilter.SHOW_ALL);

    do {
      makeUpdaters({walker,vmap,externals});
    } while(walker.nextNode())

    const retVal = {externals,v:Object.values(vmap),to,
      update,code:CODE,nodes:[...frag.childNodes]};
    return retVal;
  }

  function R(p,...v) {
    v = v.map(parseVal);

    const {key:instanceKey} = (v.find(isKey) || {});
    const cacheKey = p.join('<link rel=join>');
    const {cached,firstCall} = isCached(cacheKey,v,instanceKey);
   
    if ( ! firstCall ) return cached;

    p = [...p]; 
    const vmap = {};
    const V = v.map(replaceVal(vmap));
    const externals = [];
    let str = '';

    while( p.length > 1 ) str += p.shift() + V.shift();
    str += p.shift();

    const frag = toDOM(str);
    const walker = document.createTreeWalker(frag, NodeFilter.SHOW_ALL);

    do {
      makeUpdaters({walker,vmap,externals});
    } while(walker.nextNode())

    const retVal = {externals,v:Object.values(vmap),to,
      update,code:CODE,nodes:[...frag.childNodes]};
    if ( !! instanceKey ) {
      cache[cacheKey].instances[instanceKey] = retVal;
    } else {
      cache[cacheKey] = retVal;
    }
    return retVal;
  }

  function makeUpdaters({walker,vmap,externals}) {
    //FIXME: If values are empty, things can fuck up.
    let node = walker.currentNode;
    switch( node.nodeType ) {
      case Node.ELEMENT_NODE:
        handleElementNode({node,vmap,externals});
      break;
      case Node.COMMENT_NODE:
      case Node.TEXT_NODE:
        handleTextNode({node,vmap,externals});
      break;
      default:
      break;
    }
  }

  function handleTextNode({node,vmap,externals}) {
    const lengths = [];
    const text = node.nodeValue; 
    let result;
    while( result = KEYMATCH.exec(text) ) {
      const {index} = result;
      const key = result[1];
      const val = vmap[key];
      const replacer = makeTextNodeUpdater({node,index,lengths,val,valIndex:val.vi});
      externals.push(() => replacer(val.val));
      val.replacers.push( replacer );
    }
  }

  function makeTextNodeUpdater({node,index,lengths,valIndex,val}) {
    let oldNodes = [node];
    let lastAnchor = node;
    //s({initial:{lastAnchor}});
    return (newVal) => {
      //s({entering:true});
      val.val = newVal;
      switch(typeof newVal) {
        case "object":
          //s({textNodeUpdater:{object:{nodes:newVal.nodes}}});
          if ( !! newVal.nodes.length ) {
            //s({someNodes:{lastAnchorIs:lastAnchor}});
            newVal.nodes.forEach(n => lastAnchor.parentNode.insertBefore(n,lastAnchor.nextSibling));
            lastAnchor = newVal.nodes[0];
            //s({update:{lastAnchor}});
          } else {
            //s({noNodes:{lastAnchor}});
            // find or create a placeholder 
            // FIXME: we might need to use comment node since perhaps
            // meta is disallowed in some places 
            const placeholderNode = lastAnchor.parentNode.querySelector('meta[name="placeholder"]') || toDOM(`<meta name=placeholder>`).firstElementChild;
            //s({placeholderNode});
            lastAnchor.parentNode.insertBefore(placeholderNode,lastAnchor.nextSibling);
            lastAnchor = placeholderNode;
            //s({update:{lastAnchor}});
          }
          const dn = diffNodes(oldNodes,newVal.nodes);
          if ( dn.size ) {
            const f = document.createDocumentFragment();
            dn.forEach(n => f.appendChild(n));
          }
          //void ( typeof newVal !== "string" && s({removing:{dn}}));
          oldNodes = newVal.nodes || [lastAnchor];
          //void ( typeof newVal !== "string" && s({updating:{oldNodes}}));
          //s({exiting:true});
          while ( newVal.externals.length ) {
            newVal.externals.shift()(); 
          } 
          break;
        default:
          //s({textNodeUpdater:{text:{newVal}}});
          const lengthBefore = lengths.slice(0,valIndex).reduce((sum,x) => sum + x, 0);
          node.nodeValue = newVal;
          lengths[valIndex] = newVal.length;
          break;
      }
    };
  }

  function handleElementNode({node,vmap,externals}) {
    const attrs = [...node.attributes]; 
    attrs.forEach(({name,value}) => {
      const lengths = [];
      let result;
      while( result = KEYMATCH.exec(name) ) {
        const {index} = result;
        const key = result[1];
        const val = vmap[key];
        const replacer = makeAttributeUpdater(
          {updateName:true,val,node,index,name,externals,lengths,valIndex:val.vi});
        externals.push(() => replacer(val.val));
        val.replacers.push( replacer );
      }
      while( result = KEYMATCH.exec(value) ) {
        const {index} = result;
        const key = result[1];
        const val = vmap[key];
        const replacer = makeAttributeUpdater({val,node,index,name,externals,lengths,valIndex:val.vi});
        externals.push(() => replacer(val.val));
        val.replacers.push( replacer );
      }
    });
  }

  function makeAttributeUpdater({
    updateName: updateName = false,node,index,name,val,externals,lengths,oldLengths,valIndex}) {
    let oldVal = {length: KEYLEN};
    let oldName = name;
    if ( updateName ) {
      return (newVal) => {
        val.val = newVal;
        switch(typeof newVal) {
          default:
            const attr = node.hasAttribute(oldName) ? oldName : ''
            if ( attr !== newVal ) {
              if ( !! attr ) {
                node.removeAttribute(oldName);
                // FIXME: IDL
                node[oldName] = undefined;
              }
              if ( !! newVal ) {
                node.setAttribute(newVal,''); 
                // FIXME: IDL
                node[newVal] = true;
              }
              oldName = newVal;
            }
        }
      };
    } else {
      return (newVal) => {
        const originalLengthBefore = Object.keys(lengths.slice(0,valIndex)).length*KEYLEN;
        val.val = newVal;
        switch(typeof newVal) {
          case "function":
            if ( name !== 'bond' ) {
              if ( !! oldVal ) {
                node.removeEventListener(name, oldVal);
              }
              node.addEventListener(name, newVal); 
            } else {
              if ( !! oldVal ) {
                const index = externals.indexOf(oldVal);
                if ( index >= 0 ) {
                  externals.splice(index,1);
                }
              }
              externals.push(() => newVal(node)); 
            }
            oldVal = newVal;
          break;
          default:
            lengths[valIndex] = newVal.length;
            const attr = node.getAttribute(name);
            if ( attr !== newVal ) {
              const lengthBefore = lengths.slice(0,valIndex).reduce((sum,x) => sum + x, 0);

              const correction = lengthBefore-originalLengthBefore;
              const before = attr.slice(0,index+correction);
              const after = attr.slice(index+correction+oldVal.length);

              //console.log(JSON.stringify({name,originalLengthBefore,lengthBefore,correction,index,attr,before,after,newVal,lengths,valIndex},null,2));
              const newAttrValue = before + newVal + after;
              node.setAttribute(name, newAttrValue);
              //FIXME: IDL (this is required for some attributes, we need a map of attr name to IDL)
              node[name] = newAttrValue;

              oldVal = newVal;
            }
        }
      };
    }
  }

  function isCached(cacheKey,v,instanceKey) {
    let firstCall;
    let cached = cache[cacheKey];
    if ( cached == undefined ) {
      cached = cache[cacheKey] = {};
      if ( !! instanceKey ) {
        cached.instances = {};
        cached = cached.instances[instanceKey] = {};
      }
      firstCall = true;
    } else {
      if ( !! instanceKey ) {
        if ( ! cached.instances ) {
          cached.instances = {};
          firstCall = true;
        } else {
          cached = cached.instances[instanceKey];
          if ( ! cached ) {
            firstCall = true;
          } else {
            firstCall = false;
          }
        }
      } else {
        firstCall = false;
      }
    }
    if ( ! firstCall ) {
      cached.update(v);
    }
    return {cached,firstCall};
  }

  function replaceVal(vmap) {
    return (val,vi) => {
      if ( !! val.key ) {
        return '';
      }
      const key = (' key'+Math.random()).replace('.','').padEnd(KEYLEN,'0').slice(0,KEYLEN);
      let k = key;
      if ( onlyOurProps(val) && verify(val) ) {
        k = (`<!--${k}-->`);
      }
      k = `${k} `;
      vmap[key.trim()] = {vi,val,replacers:[]};
      return k;
    };
  }

  function toDOM(str) {
    const f = (new DOMParser).parseFromString(
      `<template>${str}</template>`,"text/html").head.firstElementChild.content;
    f.normalize();
    return f;
  }

  function parseVal(v) {
    const isFunc          = typeof v == "function";
    const isUnset         = v == null         ||    v == undefined;
    const isObject        = !isUnset          &&    typeof v === "object";
    const isGoodArray     = Array.isArray(v)  &&    v.every(itemIsFine);
    const isVerified      = isObject          &&    verify(v);
    const isForgery       = onlyOurProps(v)   &&    !isVerified; 

    if ( isFunc )         return v;
    if ( isVerified )     return v;
    if ( isKey(v) )       return v;
    if ( isGoodArray )    return join(v); 
    if ( isUnset )        die({error: UNSET()});
    if ( isForgery )      die({error: XSS()});
    if ( isObject )       die({error: OBJ()});

    return v+'';
  }

  function itemIsFine(v) {
    return onlyOurProps(v) && verify(v);
  }

  function join(os) {
    const externals = [];
    const bigNodes = [];
    os.forEach(o => (externals.push(...o.externals),bigNodes.push(...o.nodes)));
    const retVal = {v:[],code:CODE,nodes:bigNodes,to,update,externals};
    return retVal;
  }

  function to(selector, position = 'replace') {
    const frag = document.createDocumentFragment();
    this.nodes.forEach(n => frag.appendChild(n));
    const elem = selector instanceof Node ? selector : document.querySelector(selector);
    try {
      MOVE[position](frag,elem);
    } catch(e) {
      die({error: INSERT()},e);
    }
    while(this.externals.length) {
      this.externals.shift()();
    }
  }

  function diffNodes(last,next) {
    last = new Set(last);
    next = new Set(next);
    return new Set([...last].filter(n => !next.has(n)));
  }

  function update(newVals) {
    this.v.forEach(({vi,replacers}) => replacers.forEach(f => f(newVals[vi])));
  }

  function onlyOurProps(v) {
    return OURPROPS === Object.keys(v||{}).sort().filter(p => p !== 'instances').join(',');
  }

  function verify(v) {
    return CODE === v.code;
  }

  function die(msg,err) {
    if (DEBUG && err) console.warn(err);
    msg.stack = ((DEBUG && err) || new Error()).stack.split(/\s*\n\s*/g);
    throw JSON.stringify(msg,null,2);
  }

  function s(msg) {
    if ( DEBUG ) {
      console.log(JSON.stringify(msg,showNodes,2));
      console.info('.');
    }
  }

  function showNodes(k,v) {
    let out = v;
    if ( v instanceof Node ) {
      out = `<${v.nodeName.toLowerCase()} ${
        !v.attributes ? '' : [...v.attributes].map(({name,value}) => `${name}='${value}'`).join(' ')}>${
        v.nodeValue || ''}`;
    } else if ( typeof v === "function" ) {
      return `${v.name || 'anon'}() { ... }`
    }
    return out;
  }
