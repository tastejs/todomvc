/* 
 * all rights resorved by hunter.dding@gmail.com @猎人豆豆 @hunter.dding
 * please notice that the define,main are occupied as gloable variable
 * but most of time you only need to use define with CMD stand.
 * river.js by Jonathan version 13.11 
 */
var _$river = {
  // module define and run api
  sandbox: function() {
    var boxes = {};
    return {
      create: function(key, fn) {
        key = key.toLowerCase();
        boxes[key] = fn;
      },
      run: function(fn) {
        var context = {
          need: function(key) {
            key = key.toLowerCase();
            var mod = Object.create(context);
            mod.exports = {}; //reset,
            var api = boxes[key] && boxes[key].call(mod,mod.exports,mod.need,mod) || undefined;
//            api = typeof mod.exports === 'function' ? mod.exports : Object.keys(mod.exports).length ? mod.exports : api;
            api = api || mod.exports;
            return api;
          },
          exports: {}
        };
        fn.call(context,context.exports,context.need,context);
      }
    };
  }
};
_$river.module = _$river.sandbox();

Object.create = Object.create || function(source){
  var F = function () {}
  F.prototype = source;
  return new F();
}

/*jshint unused:false */

/**
 *@name define
 *@param {string} key - module name and NameSpace
 *@param {function} fn - the module implementation
 */
var define = _$river.module.create;
var main = _$river.module.run;

define('river.engine',function() {

  var me = this,
    tool = me.need('river.core.tools');
  function loadGrammer(key) {
    return me.need('river.grammer.' + key);
  }

  // this reg is for math {{ **.** }} type expression
  var reg = /.*{{\s*|\s*}}.*/g;



  function checkAttributes(doc, fatherContext) {
    var state = {
      hasRepeat: false,
      context: fatherContext
    };
    var newContext = {
      scope: {},
      node: doc,
      eom: {},
      reg: reg
    };

    if (doc.attributes && doc.attributes.length) {
      for(var i = 0;i<doc.attributes.length;i++){
        var attr= doc.attributes[i];
        var key = attr.nodeName;
        var value = attr.nodeValue.replace(reg, '');
        var grammer = loadGrammer(key);

        if ('scope' === key) {
          //here we cover the current context by newContext;
          state.context = newContext;
          grammer.call(state.context, value,state.context.scope,state.context.node);
          if (fatherContext) {
            //the inherit object should be the same reference,nor a new one.And no need to inherit eom.
            tool.inherit(state.context.scope, fatherContext.scope);
          }
        } else {
          if (tool.isFunction(grammer)) {
            if (state.context) {
              state.context.node = doc;
              grammer.call(state.context, value,state.context.scope,state.context.node);
              checkText(attr, state.context);
            } else {
              state.context = newContext;
              loadGrammer('scope').call(state.context, value);
              grammer.call(state.context, value,state.context.scope,state.context.node);
            }
          }
        }
        if ('repeat' === key) {
          state.hasRepeat = true;
          break;
        }
      }
    }
    return state;
  }

  function checkText(doc, context) {
    if (reg.test(doc.nodeValue)) {
      var key = doc.nodeValue.replace(/\r|\n/g,'').replace(reg, '');
      //'a.b.c.d'
      var ns = key.split('.');
      var value = {};
      var eom = {};
      for(var i=0;i<ns.length;i++){
        if(typeof value === 'object'){
          value = value[ns[i]] || context.scope[ns[i]] 
        }
      }
      value = typeof value == 'object' ? JSON.stringify(value) : value;
      if(typeof value == 'undefined') value = '';
      tool.buildobj(key,'.',context.eom,function(obj,key){
        obj[key] = obj[key] || [];
        obj[key].push({
          element: doc,
          expression: doc.nodeValue
        });
      });
      doc.nodeValue = doc.nodeValue.replace(/\r|\n/g,'').replace(/{{.*}}/, value);
    }
  }

  function checkChildren(doc, state) {
    if (doc.childNodes && doc.childNodes.length) {
      for(var i=0;i<doc.childNodes.length;i++){
        var child = doc.childNodes[i];
        var context = state ? state.context : undefined;
        var s = scan(child, context);
        if(s.hasRepeat) break;
      }
    }
  }



  function scan(doc, context) {
    var state = checkAttributes(doc, context);
    if (state.context) {
      checkText(doc, state.context);
    }
    if ('CODE' !== doc.nodeName && 'PRE' !== doc.nodeName && !state.hasRepeat) {
      if (state.context) {
        checkChildren(doc, state);
      } else {
        checkChildren(doc);
      }
    }
    return state;
  }


  /*!
   * contentloaded.js
   *
   * Author: Diego Perini (diego.perini at gmail.com)
   * Summary: cross-browser wrapper for DOMContentLoaded
   * Updated: 20101020
   * License: MIT
   * Version: 1.2
   *
   * URL:
   * http://javascript.nwbox.com/ContentLoaded/
   * http://javascript.nwbox.com/ContentLoaded/MIT-LICENSE
   *
   */

  // @win window reference
  // @fn function reference
  function contentLoaded(win, fn) {

    var done = false, top = true,

    doc = win.document, root = doc.documentElement,

    add = doc.addEventListener ? 'addEventListener' : 'attachEvent',
    rem = doc.addEventListener ? 'removeEventListener' : 'detachEvent',
    pre = doc.addEventListener ? '' : 'on',

    init = function(e) {
      if (e.type == 'readystatechange' && doc.readyState != 'complete') return;
      (e.type == 'load' ? win : doc)[rem](pre + e.type, init, false);
      if (!done && (done = true)) fn.call(win, e.type || e);
    },

    poll = function() {
      try { root.doScroll('left'); } catch(e) { setTimeout(poll, 50); return; }
      init('poll');
    };

    if (doc.readyState == 'complete') fn.call(win, 'lazy');
    else {
      if (doc.createEventObject && root.doScroll) {
        try { top = !win.frameElement; } catch(e) { }
        if (top) poll();
      }
      doc[add](pre + 'DOMContentLoaded', init, false);
      doc[add](pre + 'readystatechange', init, false);
      win[add](pre + 'load', init, false);
    }
  }

  return {
    scan:scan,
    ready:contentLoaded
  };

});
define('river.scenario',function(){

  var tools = this.need('river.core.tools');

  /**
   * this function is for trigger browser default behavior,
   * and it will be usefule , when you do the unite test , or e2e test
   * in the future
   */
  function _trigger (type,element){
    //to-do , cross IE < 9
    var event = document.createEvent('MouseEvents');
    event.initEvent(type,true,true);
    element.dispatchEvent(event);
  }

  function _keyboard (type, keycode,charCode, element){
    //to-do , cross IE < 9
    var evt = document.createEvent('Events');
    evt.initEvent(type, true, true);
    evt.view = null;
    evt.altKey = false;
    evt.ctrlKey = false;
    evt.shiftKey = false;
    evt.metaKey = false;
    evt.keyCode = keycode;
    evt.charCode = charCode;

    element.dispatchEvent(evt);
  }

  return {
    trigger:_trigger,
    key:_keyboard
  };
});
define('river.core.Date', function() {

  var getDateByCity = function(jetleg) {
    var now = new Date();
    var local = new Date(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours() + parseInt(jetleg),
      now.getUTCMinutes(),
      now.getUTCSeconds());

    return {
      date: local,
      toString: function(f){
        local.toString = toString;
        return local.toString(f);
      }
    };
  };

  function toString(format) {
    var o = {
      "M+": this.getMonth() + 1, //month
      "d+": this.getDate(), //day
      "h+": this.getHours(), //hour
      "m+": this.getMinutes(), //minute
      "s+": this.getSeconds(), //second
      "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
      "S": this.getMilliseconds() //millisecond
    };

    if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) if (new RegExp("(" + k + ")").test(format))
        format = format.replace(RegExp.$1,
          RegExp.$1.length == 1 ? o[k] :
          ("00" + o[k]).substr(("" + o[k]).length));
    return format;
  }


  return {
    getDateByCity: getDateByCity
  };
});
define('river.core.model', function(exports,require,module) { //@sourceURL=../lib/core/model.js

  var tools = this.need('river.core.tools');

  var me = this;

  var isArray  = tools.isArray;
  var isObject = tools.isObject;
  var isString = tools.isString;
  var isNumber = tools.isNumber;
  var each     = tools.each;
  var loop     = tools.loop;

  function update(value, key, eom ,last) {
    var scope = this;
    var oldvalue = last[key];
    var isEqual = value == oldvalue;
    if(isEqual) return;
    if (isString(value) || isNumber(value)) {
      if(eom && eom[key]){
        loop(eom[key], function(ele, i) {
          ele.element.nodeValue = ele.expression.replace(/{{.*}}/, value);
          if(ele.element.nodeName == 'INPUT'){
            ele.element.value = ele.expression.replace(/{{.*}}/, value);
          }
          //ele.element.parent.innerHTML = ele.expression.replace(/{{.*}}/, value);
        });
        var fns = scope.__listeners__ && scope.__listeners__[key] ;
        if(fns){
          for (var i = 0, len = fns.length; i < len; i++) {
            fns[i](value,last[key]);
          }
        }
      }
      last[key] = value;
    } else if (isArray(value)) {
      last[key] = oldvalue ? oldvalue : [];
      diff(value,last[key],eom[key],scope,key,last);
    } else if (isObject(value)) {
      oldvalue = oldvalue ? oldvalue : {};
      each(value, function(item, index) {
        update.call(scope,item, index, eom[key], oldvalue);
      });
    }
  }

  function diff(value,oldvalue,eom,scope,key,last){
    var len = value.length >= oldvalue.length ? value.length : oldvalue.length;
    var expect = tools.expect;
    var container = eom.repeatContainer;
    var cnt = 0;
    for (var i = 0 ; i < len; i++) {
      var newvalue = value[i];
      var exists = typeof newvalue !== 'undefined';
      if(exists && !expect(newvalue).toEqual(oldvalue[i])){
        var neweom = getNewEom(eom,newvalue,scope,key,i,last);
        var refnode = container.children[i];
        //oldvalue.splice(i,1,newvalue); // sync oldvalue
        if(typeof newvalue == 'object'){
          oldvalue[i] = oldvalue[i] || {};
          cover(oldvalue[i],newvalue);
        }else{
          oldvalue[i] = newvalue;
        }
        eom.splice(i,1,neweom); //sync eom
        container.insertBefore(neweom.repeat,refnode); //sync dom
        if(refnode)container.removeChild(refnode);
      }else if(!exists){
        oldvalue.splice(i-cnt,1);
        eom.splice(i-cnt,1);
        container.removeChild(container.children[i-cnt]);
        cnt++;
      }
    }
  }

  function cover(oldvalue,newvalue){
    for(var x in newvalue){
      oldvalue[x] = newvalue[x];
    }
  }

  function getIndex(v,srcarray){
    var result = -1;
    for (var i = 0, len = srcarray.length; i < len; i++) {
      if(tools.expect(v).toEqual(srcarray[i])){
        result = i;
        break;
      }
    }
    return result;
  }

  function getNewEom(eom,d,parentscope,ns,index,last){
    var trans = eom.trans;
    var node = eom.repeatNode;
    var _r = eom.reg;
    var key = eom.key;
    var _n = node.cloneNode(true);
    var m = {};
    var F = function(f){
      this.__eom__ = {};
      this.__last__ = {};
      this.__listeners__ = {};
      this[key] = f;
      this.__eom__[key] = m;
      this.__last__[key] = last[ns] && last[ns][index] || tools.clone(d);
    };
    F.prototype = parentscope;
    var mod = new F(d);
    trans(_r, _n, mod, key, m);
    m.repeat = _n;
    return m;
  }


  function Model(ref) {
    if(typeof ref === 'object'){
     for(var x in ref){
       this[x] = ref[x];
     } 
    }else{
      this._$value = ref;
    }
    this.__listeners__ = {};
  }

  Model.prototype.apply = function() {
    var father = Object.getPrototypeOf(this);
    var me = this;
    apply.call(me);
    apply.call(father);
  };

  function apply (){
    var _eom = this.__eom__
      , last = this.__last__
      , scope = this;
    if(!_eom) return;

    each(this, function(val, index) {
      if(/__/.test(index)) return;
      if (_eom[index] && !tools.expect(last[index]).toEqual(val)) {
        update.call(scope,val, index, _eom,last);
        //last[index] = tools.clone(val);
      }
    });
  }

  Model.prototype.watch = function(eom, repeat) {};

  Model.prototype.onchange = function(id,fn) {
    var lis = this.__listeners__[id] = this.__listeners__[id] || [];
    lis.push(fn);
  };

  Model.prototype.inject = function(source) {
    var me = this;
    each(source, function(item, index) {
      me[index] = source[index];
    });
  };

  return Model;
});
define('river.core.tools', function() {
  var toString = Object.prototype.toString;
  /**
   * @namespace river.core.tools
   */

  function inherit(target,source) {
    var F = function() {
      for (var x in target) {
        if(target.hasOwnProperty && target.hasOwnProperty(x)){
          this[x] = target[x];
        }else{
          F.prototype[x] = target[x];
        }
      }
    };
    for(var y in source){
      F.prototype[y] = source[y];
    }
    //F.prototype = source;
    var f = new F();
    for(var z in f){
      target[z] = f[z];
    }
    return target;
  }

  function compile(str){
    var container = document.createElement('div');
    container.innerHTML = str;
    return container.childNodes[0];
  }

  function guid() {
    var uid = "$$";
    for (var i = 1; i <= 8; i++) {
      var n = Math.floor(Math.random() * 16).toString(16);
      uid += n;
      if ((i == 3) || (i == 5))
        uid += "-";
    }
    return uid;
  }

    /**
     * it's for array loop
     */
  function loop(array, fn) {
    var context = {};
    for (var i = 0; i < array.length; i++) {
      fn.call(context, array[i], i);
    }
  }

  /**
   * it's for object loop,but will not loop in prototype
   */
  function each(obj, fn) {
    var context = {};
    for (var x in obj) {
      if (obj.hasOwnProperty && obj.hasOwnProperty(x)) {
        fn.call(context, obj[x], x);
      }
    }
  }

  function type(name,item) {
    return window.Object.prototype.toString.call(item) === '[object '+ name +']';
  }

  /*
   * build a object from a.b.c string
   */
  function buildobj(str,symble,obj,fn){
    var arr = str.split(symble);
    var name = arr.shift();
    obj = obj || {};
    if(arr.length){
      obj[name] = obj[name] || {};
      buildobj(arr.join(symble),symble,obj[name],fn);
    }else{
      if(typeof fn == 'function'){
        fn(obj,name);
      }
    }
    return obj;
  }


  /**
   * clone in deep
   * @api:public
   * @param:{object} target
   * @param {object} source 
   */
  function clone(target,result){
    if(typeof target !== 'object'){
      return target;
    }else{
      result = result ? result : type('Object',target) ? {} :[];
      for(var x in target){
        var isObject = type('Object',target[x])
          , isArray  = type('Array', target[x])
          , hasChild = isObject || isArray;

        if(hasChild){
          result[x] = isObject ? {} : [];
          clone(target[x],result[x]);
        }else{
          result[x] = target[x];
        }
      }
      return result;
    }
  }


  /**
   * diff two object/array
   * @api:public
   * @param:{object} target
   * @param {object} source
   */
  function diff(target,source){
    this._diffFlag = true;
      for(var x in source){
        var isObject = type('Object',source[x]) || type('Array',source[x]); 
        if(!this._diffFlag){ return false}
        if(isObject && target){
          diff.call(this,target[x],source[x]);
        }else{
          if(!target){
            this._diffFlag = false;
            break;
          }
          if(target[x] != source[x]){
            this._diffFlag = false;
            break;
          }
        }
      }
      return this._diffFlag;
  }

  function expect(source){
    var isValue = typeof source == 'string' || typeof source == 'number' || typeof source == 'boolean' || typeof source == 'undefined'
      , isObject = typeof source != 'function';
    
    function equal(target) {
      if(isValue){
        return source == target;
      }else if(isObject){
        return diff.call({},target,source) && diff.call({},source,target);
      }
    }

    return {
      toEqual:equal
    }
  }


  var exports = {
    inherit    : inherit,
    compile    : compile,
    guid       : guid,
    loop       : loop,
    each       : each,
    clone      : clone,
    expect     : expect,
    isArray    : function(array) {return type('Array',array);},
    isObject   : function(obj) { return type('Object',obj);},
    isFunction : function(obj) { return type('Function',obj); },
    isString   : function(str) { return type('String',str); },
    isNumber   : function(no) { return type('Number',no); },
    buildobj   : buildobj
  };

  return exports;
});
define('river.grammer.jbind',function(exports,require,module){

  function jbind (str,scope,element){
    var value = getValue(str,scope);
    var oldValue = element.value = value || '';
    
    // todo:still have bugs
    var ns = str.split('.');
    this.eom[str] = this.eom[str] || [];
    this.eom[str].push({
      element:element,
      expression:"{{"+str+"}}"
    });
    

    var interval;

    element.onfocus = function(){
      var ele = this;
      interval = setInterval(function(){
        watch(ele.value);
      },30);
    };

    element.onblur = function(){
      clearInterval(interval);
    };

    function watch(newValue){
      if(newValue !== oldValue){
        setValue(str,scope,newValue);
        oldValue = newValue;
        scope.apply();
      }
    }
  }

  function getValue(ns,scope){
    var result = '';
    if(!scope) throw new TypeError('value not exists');
    var key = ns.replace(/\..*/,'')
    var value = scope[key];
    if(typeof value === 'object'){
      result = getValue(ns.replace(key+'.',''),value);
    }else if(typeof value !== 'undefined'){
      result = value;
    }
    return result;
  }

  function setValue(str,scope,value){
    if(!scope) throw new TypeError('value not exists');
    var key = str.replace(/\..*/,'')
    var childscope = scope[key];
    if(typeof childscope === 'object'){
      setValue(str.replace(key+'.',''),childscope,value);
    }else{
      scope[key] = value;
    }
  }

  exports = module.exports = jbind;
});
define('river.grammer.jChange', function() {
  function change (str) {
    var fn = this.scope[str];
    var scope = this.scope;

    this.node.onchange = function(){
      fn.call({},this.value);
      scope.apply();
    };
  }
  return change;
});
define('river.grammer.jclick', function(exports,require,module) {
  function click (str,scope,element) {
    var f = str.replace(/\(.*\)/,'');
    var fn = scope[f];

    var param = /\((.*)\)/;
    var target = str.match(param);
    var args = [];

    if(target && target.length){
      args = target[1].split(',');
      //Array.prototype.indexOf.call(this.node.parentNode,this.node);
    }

    var argsdata = [];
    for (var i = 0, len = args.length; i < len; i++) {
      argsdata[i] = scope[args[i]]
    }

    var eom = this.eom;
    element.onclick = function(e){
      fn.apply(element,argsdata);
      scope.apply();
    };
  }

  exports = module.exports = click;
});
define('river.grammer.jcompile',function(){
  return function(){
    //jcompile should never be used when sub tag structutor contain any other grammer tag,cause it will be totally replace by innnerHTML.

    var element = this.node;
    var scope = this.scope;
    var reg = this.reg;

    var key = element.textContent.replace(reg,'');
    //element.innerHTML = scope[key];
//    console.log(this.eom.msg);
  };
});
define('river.grammer.jon', function() {
  function on (str,scope,element) {
    var expression = str.replace(/\(.*\)/,'');

    var type = expression.replace(/\s*[\||:].*/,'');
    var key  = expression.replace(/.*[\||:]\s*/,'');
    var fn = scope[key];

    var param = /\((.*)\)/;
    var target = str.match(param);
    var args = [];

    if(target && target.length){
      args = target[1].split(',');
    }

    var event = 'on' + type;

    element[event] = function(e){
      var argsdata = [];
      for (var i = 0, len = args.length; i < len; i++) {
        var item = scope[args[i]] ? scope[args[i]] : '';//args[i];
        argsdata.push(item);
      }
      fn.apply(element,[e].concat(argsdata));
      scope.apply();
    };
  }
  return on;
});
define("river.grammer.repeat", function(exports,require,module) {
  var $tool = require('river.core.tools')
    , $scan = require('river.engine').scan
    , model = require('river.core.model')
    , me    = this;

    function loadGrammar(key) {
      return me.need('river.grammer.' + key);
    }

  /**
   * all the grammer 'this' object contains,this the base api
   * {
   *  node:,
   *  reg:,
   *  scope,
   *  eom
   *  }
   **/

  var repeatNode,repeatContainer;
  var afterIn = /.*in\s/;
  var beforeIn = /\sin.*/;

  function repeat(str,scope,element) {
    //to-do
    var ns = /.*\./;
    var pro = str.replace(afterIn, '').replace(ns, '');
    var data = scope[pro];
    var key = str.replace(beforeIn, '');
    var parentNode = element.parentNode;
    var node = parentNode.removeChild(element);
    var frg = document.createDocumentFragment();
    var _r = this.reg;
    var eom = this.eom[pro] = [];

    node.removeAttribute('repeat');
    repeatNode = node;
    repeatContainer = parentNode;

    eom.repeatNode = node; 
    eom.repeatContainer = parentNode;
    eom.trans = trans;
    eom.key = key;
    eom.reg = _r;
    scope.__children__ = scope.__children__ || [];

    if (data && data.length) {
      data.forEach(function(d,i) {
        var _n = node.cloneNode(true);
        var m = {};
        var F = function(f){
          //this._$value = f;
          this[key] = f;
        }
        F.prototype = scope;

        var mod = new F(d);//new model(d);
        mod.__eom__ = {};
        mod.__eom__[key] =  m;
        mod.__last__ = {};
        mod.__last__[key] = scope.__last__ && scope.__last__[pro][i] || $tool.clone(d);
        mod.__listeners__ = {};
        scope.__children__.push(mod);
        trans(_r, _n, mod, key, m);
        m.repeat = _n;
        eom.push(m);
        frg.appendChild(_n);
      });
      parentNode.appendChild(frg);
    }
  }

  var context = {};


  function trans(reg, doc, scope, key, eom) {
    var hasRepeat = false;
    if (doc.attributes && doc.attributes.length) {
      Array.prototype.forEach.call(doc.attributes, function(attr) {

        if (reg.test(attr.nodeValue)) {
          var k = attr.nodeValue.replace(reg, '').replace(key + '.', '');
          if (!eom[k]) {
            eom[k] = [];
          }
          eom[k].push({
            element: attr,
            expression: attr.nodeValue
          });
          var value  = typeof scope[key] == 'object' ? scope[key][k] : scope[key];
          attr.nodeValue = attr.nodeValue.replace(/{{.*}}/, value);
        }

        context.node = doc;
        context.scope = scope;//scope; waiting for refactory
        context.reg = reg;
        context.eom = eom;
        if ('repeat' === attr.nodeName) {
          hasRepeat = true;
          var ch = attr.nodeValue.replace(afterIn,'').replace(/\..*/,'');
          context.scope = scope[ch]; 
          repeat.call(context, attr.nodeValue.replace(reg, ''),scope[ch],doc);
        }else{
          var grammer = loadGrammar(attr.nodeName);
          if($tool.isFunction(grammer)){
            var str = attr.nodeValue.replace(reg, '');
            context.eom = {};
            grammer.call(context,str,scope,context.node);
          }
        }
      });
    }
    if (reg.test(doc.nodeValue)) {
      var k = doc.nodeValue.replace(reg, '').replace(key + '.', '');
      $tool.buildobj(k,'.',eom,function(obj,key){
        obj[key] = obj[key] || [];
        obj[key].push({
          element: doc,
          expression: doc.nodeValue
        });
      });
      /*
      if (!eom[k]) {
        eom[k] = [];
      }
      eom[k].push({
        element: doc,
        expression: doc.nodeValue
      });
      */
      //this change is for identify two case: 
      //  1. scope = {}
      //  2. scope = "string" or number
      var value  = typeof scope[key] == 'object' ? scope[key][k] : scope[key];
      if(typeof scope[key] === 'object'){
        $tool.buildobj(k,'.',scope[key],function(obj,key){
          value = obj[key];
        });
      }
      doc.nodeValue = doc.nodeValue.replace(/{{.*}}/, value);
    }
    if (doc.childNodes && doc.childNodes.length && !hasRepeat) {
      Array.prototype.forEach.call(doc.childNodes, function(child) {
        trans(reg, child, scope, key, eom);
      });
    }
  }

  return repeat;
});
define('river.grammer.scope', function() {

  var me = this;
  var model = me.need('river.core.model');
  var tools = me.need('river.core.tools');

  function _scope(str) {
    this.node.removeAttribute('scope');
    var source = me.need(str);
    if (tools.isObject(source)) {
      var mod = new model();
      //make source inherit from mod
      //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/proto
      source.__last__ = tools.clone(source);
      source.__eom__  = this.eom;
      for(var x in mod){
         source[x] = mod[x]
      }
      this.scope = source;
    } else if (tools.isFunction(source)) {
      var m = new model();
      this.scope = m;
      source.call(m);
      m.__last__ = tools.clone(m);
      m.__eom__  = this.eom;
    } else {
      var guid = tools.guid();
      var mo = new model();
      mo.__last__ = tools.clone(mo);
      mo.__eom__  = this.eom;
      this.scope  = mo;
    }
  }

  return _scope;
});
main(function(exports,require,module){
  var engine = require('river.engine');
  engine.ready(window,function(){
    engine.scan(document);
  });
});
