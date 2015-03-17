// HTML engine JavaScript library
// (c) Nguyen Ta An Nhan - http://nhanfu.github.io/htmljs/api/index.html
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

// Remaining:
//1. Presentation, APIs, unit tests, fix dependency loading, consider adding SizzleJs
//2. Re-write jQuery controls with the framework(low priority)
//3. Write a book about MVVM on web

(function (root, factory) {
    'use strict';
    /* CommonJS/NodeJs */
    if (typeof module === 'object' && typeof module.exports === 'object') module.exports = factory(root);
        /* AMD module */
    else if (typeof define === 'function' && define.amd) define(factory(root));
        /* Browser global */
    else root.html = factory(root);
}
(this || (0, eval)('this'), function (window) {
'use strict';
var document           = window.document,
    JSON               = window.JSON,
    isOldIE            = !document.addEventListener,
    arrayFn            = Array.prototype,
    objPro             = Object.prototype,
    isArray            = arrayFn.isArray || function(obj){ return objPro.toString.call(obj) == '[object Array]'; },
    isFunction         = function (x) { return objPro.toString.call(x) == '[object Function]'; },
    isNumber           = function (x) { return objPro.toString.call(x) == '[object Number]'; },
    isString           = function (x) { return typeof x === 'string'; },
    isNoU              = function (x) { return x === undefined || x === null; },
    isNotNull          = function (x) { return x !== undefined && x !== null; },
    isStrNumber        = function (x) { return /^-?\d+\.?\d*$/.test(x); },
    isInDOM            = function (e) { return document.body.contains(e); },
    isHtmlData         = function (f) { return f && f.isCOmputed; },
    trimNative         = String.prototype.trim,
    trimLeftNative     = String.prototype.trimLeft,
    trimRightNative    = String.prototype.trimRight;
    
//declare name-space
var html = function (selector, context) {
    //document ready implementation here
    if (isFunction(selector)) {
        //handle document onload event
        return html.ready(selector);
    }
    if (isString(selector) || selector && selector.nodeType || selector === window) {
        //handle querying on document
        return html.get(selector, context);
    }
},
isIE = function(){
    var myNav = navigator.userAgent.toLowerCase();
    return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
},
isIE9 = isIE() === 9,
isIE8 = isIE() === 8,
//check if an object has some properties
isPropertiesEnumerable = function(x) {
    return typeof x === 'object' && isNotNull(x) && !html.isDate(x);
},
//loop through properties of an object
eachProperty = function(x, fn) {
    var prop; //declare variable first for faster performance
    for (prop in x) {
        //loop through each property, call the callback function
        if(x.hasOwnProperty(prop)) fn.call(x, x[prop], prop);
    }
},
trim = function(str) {
    return trimNative && trimNative.call(str) || str.replace(/^\s+|\s+$/,'');
},
trimLeft = function(str) {
    return trimLeftNative && trimLeftNative.call(str) || str.replace(/^\s+/,'');
},
trimRight = function(str) {
    return trimRightNative && trimRightNative.call(str) || str.replace(/\s+$/,'');
},
toSearchStr = function(str) {
    return trim(str).toLowerCase().replace(/\s{2,}/g, ' ');
},
//get all properties values - for full text search
getPropValues = function(obj) {
    var result = '';
    eachProperty(obj, function(value, prop) {
        //loop trough each property
        var propVal = value;
        if(isPropertiesEnumerable(value)) {
            //if the property's value is some kind of object
            //do recursive
            propVal = getPropValues(value);
        }
        if(value.isComputed && value.isComputed()) {
            //if the property's value is kind of computed data from html.data
            //NOTE that serialize method doesn't serialize the computed property
            propVal = value();
            //do recursive in case that isn't primary type
            if(isPropertiesEnumerable(propVal)) propVal = getPropValues(propVal);
        }
        //remove all multiple spaces
        if(propVal) result += propVal.toString() + ' ';
    });
    return result;
};

// expose some useful function
html.isIE = isIE;
html.isArray = isArray;
html.isStrNumber = isStrNumber;
html.isNotNull = isNotNull;
html.isNoU = isNoU;
html.isInDOM = isInDOM;
html.trim = trim;
html.trimLeft = trimLeft;
html.trimRight = trimRight;
html.config = {lazyInput: false, historyEnabled: true};
html.version = '1.0.2';

(function () {
    var element,
        focusingInput,
        notifier,
        allEvents = {},
        expando = {};
    
    //this method doesn't create DOM element
    //this method is for extend properties from object to object
    //this method can't be used in fluent API because it doesn't return html
    //but return destination object instead
    //des (object): destination
    //src (object): source
    this.extend = function (des, src) {
        for (var fn in src) {
            if (src.hasOwnProperty(fn)) {
                des[fn] = src[fn];
            }
        }
        return des;
    };
    
    //get|set expando properties of an DOM element
    this.expando = function(key, model) {
        var uId;
        if(isNotNull(model)) {
            uId = element.uniqueId || ++uniqueId;
            element.uniqueId = uId;
            expando[uId] = expando[uId] || {};
            expando[uId][key] = model;
        } else {
            uId = element.uniqueId;
            if(!uId) return null;
            return expando[uId]? expando[uId][key]: null;
        }
    };
    
    //get element by selector
    //assign it to pointer
    this.get = function (selector, context) {
        //if it is an element then just assign to pointer
        if (selector && (selector.nodeType || selector === window)) {
            element = selector;
        } else if (isString(selector)) {
            //if selector is a string
            var result = this.query(selector, context)[0];
            element = result;
        }
        //return html to facilitate fluent API
        return this;
    };

    this.find = function (selector) {
        element = this.query(selector, element)[0];
        return this;
    };

    //use this method for querying data from array, usage is similar to Linq
    //this method is also used for query DOM, using CSS query
    //arg (Array | string)
    //  if it is an array, then apply query fluent API for array
    //  if it is a string, then apply css query selector aka querySelectorAll
    var array = this.array = function () {
        var res = Array.apply({}, arguments[0] || []);
        html.extend(res, html.array);
        return res;
    };

    //This function takes html.query object and create methods for html.query namespace
    //html.query methods will be used in any array passed through html.query
    //because that array will inherits from methods inside html.query
    //NOTE: every html.query object method can be used with fluent API
    //for example: html.query([1,2,3,4].select(function(x){return x*x}).where(function(x){return x > 4});
    (function () {
        //each is a common used word, a handful method to loop through a list
        this.each = arrayFn.forEach || function (action) {
            //create a safe loop
            var length = this.length, i = -1;
            while(++i < length) action(this[i], i);
        };

        //add item into array, simply use push - native method
        this.add = Array.prototype.push;

        //select is similar to map in modern browser
        this.select = function (mapping) {
            var result = [], length = this.length, i = -1;
            while(++i < length) result.push(mapping(this[i]));
            return html.array(result);
        };

        //where is similar to filter in modern browser
        this.where = function (predicate) {
            if (!predicate) {
                throw 'Predicate function is required';
            }
            var ret = [], length = this.length, i = -1;
            while(++i < length)
                if (predicate(this[i])) ret.push(this[i]);
            return html.array(ret);
        };

        //reduce is a famous method in any functional programming language - also can use this with fluent API
        this.reduce = arrayFn.reduce || function (iterator, init, context) {
            context = context || this;
            var result = isNotNull(init)? init : [], length = this.length, i = -1;
            while(++i < length) result = iterator.call(context, result, this[i]);
            return result;
        };

        //similar to reduce
        this.reduceRight = arrayFn.reduceRight || function (iterator, init, context) {
            var result = isNotNull(init)? init : [], length = this.length;
            while(length--) result = iterator.call(context, result, this[length]);
            return result;
        };

        //find a item that fits the comparer, the array maybe map to another array before performing searching if mapper was passed
        //NOTE: comparer takes 2 arguments and return a 'better' one, then the find method can find the 'best' one
        this.find = function (comparer, mapper) {
            var arr = mapper ? this.select(mapper) : this;
            return arr.reduce(function (best, current) {
                return best === comparer(best, current) ? best : current;
            }, arr[0]);
        };

        //find the first one that matches condition, throw exception if no item matches
        this.first = function (predicate, predicateOwner) {
            if (!predicate) {
                return this[0];
            }
            var length = this.length, i = -1;
            while(++i < length) if (predicate.call(predicateOwner, this[i])) return this[i];
            throw 'Can\'t find any element matches';
        };

        //find the first one that matches condition, if not found return null
        this.firstOrDefault = function (predicate, predicateOwner) {
            if (!predicate) {
                return this[0];
            }
            var length = this.length, i = -1;
            while(++i < length) if (predicate.call(predicateOwner, this[i])) return this[i];
            return null;
        };

        //find index of the item in a list, this method is used for old browser
        //if indexOf method is native code, then just call it
        this.indexOf = arrayFn.indexOf || function (item) {
            var length = this.length, i = -1;
            while(++i < length) if (this[i] === item) return i;
            return -1;
        };

        //remove item from a list
        this.remove = function (itemToRemove) {
            var index = this.indexOf(itemToRemove);
            if (index >= 0 && index < this.length)
                this.splice(index, 1);
        };

        //remove specified item from a list by its index
        this.removeAt = function (index) {
            if (index >= 0 && index < this.length)
                this.splice(index, 1);
        };

        //swap to elements in a list
        this.swap = function (fromIndex, toIndex) {
            if (fromIndex >= 0 && fromIndex < this.length && toIndex >= 0 && toIndex < this.length && fromIndex != toIndex) {
                var tmp = this[fromIndex];
                this[fromIndex] = this[toIndex];
                this[toIndex] = tmp;
            }
        };

        //move item to a new 
        this.move = function(from, to) {
            this.splice(to, 0, this.splice(from, 1)[0]);
        };
        
        //create a comparer from an expression tree
        //only return comparing result when expression tree ends.
        var comparer = function (expTree) {
            return function (a, b) {
                //compare two objects using condition in expression tree
                //compare till we get difference
                for (var i = 0, j = expTree.length; i < j; i++) {
                    var endOfExpression = i === j - 1,
                        first = expTree[i].expression(a),
                        second = expTree[i].expression(b);
                    if (first > second) {
                        return expTree[i].isAscendant ? 1 : -1;
                    }
                    if (first < second) {
                        return expTree[i].isAscendant ? -1 : 1;
                    }
                    if (endOfExpression) {
                        return expTree[i].isAscendant && 0;
                    }
                }
                return 0;
            };
        };

        //orderBy method, used to sort an array by ascending
        //its usage is similar to linq
        //arguments (Function | Array of Object | String | Array of String). For example:
        //  Function: function(x){return x.FullName;}
        //  Array   : {field: 'FullName', isAsc: true}, {field: 'Age', isAsc: false}
        //          : 'FullName', {field: 'Age', isAsc: false}
        //          : 'FullName', 'Age'
        //  String  : 'FullName'
        //NOTE: if arguments is an ARRAY then return result immediately
        this.orderBy = function () {
            //expression tree to build order of sorting fields
            var expTree = [];
            //get the arguments
            var expressionArgs = arguments[0] instanceof Array ? arguments[0] : arguments;

            for (var i = 0, j = expressionArgs.length; i < j; i++) {
                var isString = typeof (expressionArgs[i]) === 'string';
                //put all sort parameters into expression tree
                //firstly, build the expression based on parameter
                var exp = (function (index, isString) {
                    //return a function, this function is to get value from an object(kind of mapper)
                    return function (x) {
                        //return the value
                        //note that user can pass a string represent a field what is an observer
                        //so that we must use html.getData to get real value from that
                        if(expressionArgs[index] instanceof Function) return expressionArgs[index](x);
                        return isString ? html.getData(x[expressionArgs[index]]) : html.getData(x[expressionArgs[index].field]);
                    };
                })(i, isString);
                //push expression into expression tree
                if (isString || isFunction(expressionArgs[i])) {
                    expTree.push({
                        expression: exp,
                        isAscendant: isNotNull(expressionArgs[i].isAsc) ? expressionArgs[i].isAsc: true
                    });
                }
                else {
                    expTree.push({
                        expression: exp,
                        isAscendant: expressionArgs[i].isAsc
                    });
                }
            }
            return this.sort(comparer(expTree));
        };
    }).call(this.array);

    //use native concat method but return array still queryable (fluent API)
    this.array.addRange = function (items) {
        return html.array(Array.prototype.concat.call(this, items));
    };

    //use native concat method but return array still queryable (fluent API)
    this.array.any = function (predicate) {
        var length = this.length, i = -1;
        while(++i < length) if (predicate(this[i])) return true;
        return false;
    };
    
    //use native concat method but return array still queryable (fluent API)
    this.array.replace = function (target, obj) {
        var length = this.length, i = -1;
        while(++i < length) if (this[i] === target) this.splice(i, 1, obj);
    };

    //Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
    //These method are from UnderscoreJs
    var typeCheck = html.array(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp']);
    typeCheck.each(function(type) {
        html['is' + type] = function(obj) {
            return objPro.toString.call(obj) == '[object ' + type + ']';
        };
    });

    //get data from an observable object
    this.getData = function (data) {
        //check whether it is html.data object or not
        //if it is html.data then excute to get value or inner function aka "computed function"
        //because html.data could take a function as parameter
        var ret = data;
        while (isFunction(ret)) {
            ret = ret();
        }
        //return real value
        return ret;
    };

    //we need this variable because we need to create a reference
    //from DOM event to allEvents object
    var uniqueId = 1;

    //bind callback method to element's event
    //element: the element to bind event
    //name: event name
    //callback: event method
    //bubble (optional) (default: false): bubble event
    this.bind = function (ele, name, callback, bubble) {
        ele = ele || element;
        if (ele === undefined || ele === null) {
            throw 'Element must be specified';
        }
        if (name === undefined || name === null) {
            throw 'Event name must be specified';
        }
        if (callback === undefined || callback === null) {
            throw 'Callback must be specified';
        }

        if (ele.addEventListener) { //attach event for non IE
            ele.addEventListener(name, callback, bubble);
        } else { //addEventListener for IE browsers
            ele.attachEvent('on' + name, callback);
        }
        //get the reference of element
        var uId = ele.uniqueId || ++uniqueId;
        ele.uniqueId = uId;
        //get all events of that element
        //create if it wasn't created
        allEvents[name] = allEvents[name] || {};
        allEvents[name][uId] = allEvents[name][uId] || [];
        allEvents[name][uId].push(callback);
    };

    //use this method to trigger event bounded to element via html.bind
    //ele: element that user want to trigger event
    //name: event name
    this.trigger = function (eventName, el) {
        el = el || element;
        if (!el) {
            throw 'Element must be specified';
        }
        if (!eventName) {
            throw 'Event name must be specified';
        }

        var event;
        if (document.createEvent) {
            //create HTMLEvents, init that event - for IE >= 9
            event = document.createEvent('HTMLEvents');
            event.initEvent(eventName, true, true);
        } else if (document.createEventObject) {
            // For IE < 9
            event = document.createEventObject();
            event.eventType = eventName;
        }
        try {
            //call that event natively e.g input.click()
            //we need to put in try catch block because older browsers causes exception
            el[eventName]();
            return;
        } catch (e) { }
        try {
            //need to try catch in case IE fire change of removed input control
            event.eventName = eventName;
            if (el.dispatchEvent) {
                //dispatch the event if possible - for IE >= 9
                el.dispatchEvent(event);
            } else if (el.fireEvent) {
                //fire event - for IE < 9
                el.fireEvent('on' + event.eventType, event);// can trigger only real event (e.g. 'click')
            } else if (el['on' + eventName]) {
                el['on' + eventName]();
            }
        } catch(e) {}
    };

    //remove every events bounded to element via html.bind
    //dispose the element from document
    //however because of javascript specification allow to keep a DOM node reference inside closure
    //so that the element would be never dispose if any user's closure code keep reference to that DOM node
    //NOTE: never keep DOM node reference inside closure if not necessary, use a query to get DOM node instead
    this.dispose = function (ele) {
        this.unbindAll(ele);
        //remove the node from its parent (if its parent is not null
        if (ele && ele.parentElement) {
            ele.parentElement.removeChild(ele);
        }
    };

    //this function is to avoid memory leak
    //remove all methods bounded to element via html.bind
    this.unbindAll = function (ele) {
        ele = ele || element;
        if (ele === null || ele === undefined) {
            throw 'Element to unbind all events must be specified';
        }
        //trigger change event last time to remove any observer bounded
        var uId = ele.uniqueId;
        if (uId) {
            eachProperty(allEvents, function(events, name){
                var ref = events[uId];
                if(!isArray(ref)) return;
                while(ref.length) {
                    var event = ref.pop();
                    isFunction(event) && html.unbind(name, event, false, ele, true);
                }
                delete events[uId];
            });
        }

        //loop through element's children to unbind all events
        //this loop will run recursively
        if (ele !== null && ele.children && ele.children.length) {
            for (var child = 0; child < ele.children.length; child++) {
                this.unbindAll(ele.children[child]);
            }
        }
    };

    // unbind element's event
    // element: element to unbind
    // name: event name
    // listener: listener function to unbind
    // bubble (optional, false): bubble event
    // isInternal (optional, false): only for internal use, remove event from allEvents
    this.unbind = function (name, listener, bubble, elem, isInternal) {
        elem = elem || element;
        if (!element) {
            throw 'Element to unbind event must be specified';
        }
        if (!name) {
            throw 'Event name must be specified';
        }
        //user want to remove all events associated with the event name
        if(!listener) {
            eachProperty(allEvents, function(events, eventName) {
                if(eventName !== name) return;    //do nothing event name not matches
                var ref = events[elem.uniqueId];
                if(!isArray(ref)) return;
                while(ref.length) {
                    var event = ref.pop();
                    if (elem.removeEventListener) {
                        elem.removeEventListener(name, event, bubble);
                    } else {
                        elem.detachEvent('on' + name, event);
                    }
                }
                delete events[elem.uniqueId];
            });
        }
        try {
            if (elem.removeEventListener) {
                // remove event listener
                elem.removeEventListener(name, listener, bubble);
            } else {
                // detach event for IE
                elem.detachEvent('on' + name, listener);
            }
            if (isInternal !== undefined) {
                // remove the event from allEvents object
                array.remove.call(allEvents[name][elem.uniqueID], listener);
                if (allEvents[name][elem.uniqueID].length === 0)
                    delete events[elem.uniqueId];
            }
        } catch(e) {}
    };

    //subscribe function to observable object
    //only subscribe to html.data object
    //throws no exception whenever object nor function is null
    this.subscribe = function (observer, updateFn) {
        if (observer && observer.subscribe) {
            observer.subscribe(updateFn);
        }
    };

    //unsubscribe function from observable object
    //only unsubscribe from html.data object
    //throws no exception whenever object nor function is null
    this.unsubscribe = function (observer, updateFn) {
        if (observer && observer.subscribe) {
            observer.unsubscribe(updateFn);
        }
    };

    //dispose DOM element that's no longer used
    this.disposable = function (ele, observer, update) {
        if (ele === null || !isInDOM(ele)) {
            if (!observer || !update) {
                throw 'Observer and listener must be specified';
            }
            //unsubscribe target for observer
            html.unsubscribe(observer, update);
            //check if the element is not null but is parent is null
            //then dispose the element(unbindAll events and remove that element)
            if (ele !== null) {
                html.dispose(ele);
            }
        }
    };

    //Create an element then append to current element
    //Change the current element pointer to the created one
    //With this action, user can bind data, attribute, etc, ... with fluent API
    //e.g: say current Element is a div then user want to create an input, then code and DOM will look like
    //html.render(divTag).input()
    //<div id='divTag'><input></input></div>
    //after create input current Element pointer will change to the input not the div any more.
    //return the current element
    //name (string): tag name to create
    //type (string optional): indicate type of input
    this.createElement = function (name, type) {
        var ele = document.createElement(name);
        if (type) {
            ele.type = type;
        }
        element.appendChild(ele);
        element = ele;
        return element;
    };

    //create element without parent
    this.createEleNoParent = function (name) {
        element = document.createElement(name);
        return this;
    };
    
    //This method is used internally to remove some number of child
    //Use this method when user call remove (e.g list.remove(item))
    //
    //parent (Element): node to remove from
    //index (number): index of item in the list
    //numOfElement (number): number of element that one item can render
    //
    //We need numOfElement because we have no idea how many elements that renderer function will render,
    //by calculating start index and stop index in the list, we can remove correctly
    //the variable numOfElement will cause a redundant renderer function to be called
    //but append to a 'tmp' Node, the 'tmpNode' will be disposed after all
    //but it could lead to memory leak, the first need to handle memory leaking
    var removeChildList = function (parent, index, numOfElement) {
        //calculating start index
        index = index * numOfElement;
        //this list to save all nodes has been removed
        //we'll this list to unbind all events of removed nodes
        var ele2Unbind = [];
        //from start index, remove numOfElement times, done
        for (var i = 0; i < numOfElement && parent.children.length; i++) {
            ele2Unbind.push(parent.children[index]);
            parent.removeChild(parent.children[index]);
        }
        setTimeout(function () {
            for (var i = 0; i < numOfElement; i++) {
                //unbind all event when remove elements
                //need to unbind after removing because there are still some events need to run
                html.unbindAll(ele2Unbind[i]);
            }
            //release memory
            ele2Unbind = null;
        });
    };
    
    //this method will append all created nodes into correct position inside container
    //only use this when user want to add to any position but not the last
    //
    //parent (Element): container to insert
    //tmpNode (Element): just tmpNode containing created elements from renderer
    //  the tmpNode will be remove after all
    //index (number): index of the item user want to insert
    var appendChildList = function (parent, tmpNode, index) {
        //previous node mean the node right before previous item rendered
        //it could be br tag or whatever
        var previousNode = null;

        //check if renderer renders nothing
        if (tmpNode.children.length === 0) {
            throw 'You must add at least one element';
        }

        //calculate index of previous node
        //e.g user want to add at 1, renderer renders 4 inputs
        //then index would be 4
        index = index * tmpNode.children.length;
        previousNode = parent.children[index];

        //if previousNode not found, then append all tmpNode children to the parent (aka container)
        if (!previousNode) {
            while (tmpNode.children.length) {
                parent.appendChild(tmpNode.children[0]);
            }
        }
        //if previousNode found, then insert all children of tmpNode before that node
        while (tmpNode.children.length) {
            parent.insertBefore(tmpNode.children[0], previousNode);
        }
    };
    
    //The method to render a list of model
    //Update the DOM whenever list of model change
    //(via add, remove, push and set aka 'render' action)
    //
    //e.g list = html.data([])
    //list([1,2,3]).push(4) will trigger 2 actions: render and push
    //list.remove(4) will trigger remove action
    //list.add(5) will trigger push action (not add because add to the last position of the list)
    //list.add(5, 0) will trigger add action because user want to add at the top
    //
    //NOTE: add an item into the list in any else position but last position is the slowest action
    //
    //model (html.data | []): list of data, it could be observable or not
    //renderer (Function): function use to render DOM
    //  this function will take 2 args:
    //  1st arg: Node that it renders from
    //  2nd arg: item in the list
    this.each = function (model, renderer) {
        //return immediately if model not pass, do nothing
        if (!model)
            throw 'Invalid argument exception. You must pass an array or observerd array.';

        //save the container pointer to parent
        var parent = element;

        //empty all element inside parent node before render
        html.get(parent).empty();
        
        //the main idea to render is this loop
        //just use renderer callback, let user do whatever they want
        var unwrappedModel = html.getData(model), length = unwrappedModel.length || unwrappedModel, i = -1;
        while(++i < length) {
            element = parent;
            renderer.call(parent, isNoU(unwrappedModel[i])? i: unwrappedModel[i], i);
        }
        
        //this method is used to update UI if user call any action modify the list
        //there are currently 4 actions: push, add, remove, render
        //in the future we may add 2 more actions: sort and swap
        var update = function (items, item, index, action) {
            var numOfElement;
            //dispose the container if it doesn't belong to DOM tree
            html.disposable(parent, model, this);
            if(!isInDOM(parent)) {
                parent = null;
                return;
            }
            element = parent;
            switch (action) {
                case 'push':
                    //render immediately the item, call renderer to do thing
                    renderer.call(parent, item, index);
                    break;
                case 'add':
                    //if user want to insert at the last
                    //render immediately the item, call renderer to do thing
                    if (index === items.length - 1) {
                        renderer.call(parent, item, index);
                        return;
                    }
                    //if user wants to insert at any position
                    //create tmpNode, append all element to that node
                    //then append to the parent node again
                    //this action cost time most
                    var tmpNode = document.createElement('tmp');
                    element = tmpNode;
                    renderer.call(tmpNode, item, index);
                    appendChildList(parent, tmpNode, index);
                    //finally dispose tmpNode avoid memory leaking
                    html.dispose(tmpNode);
                    tmpNode = null;
                    break;
                case 'remove':
                    numOfElement = parent.children.length/(items.length + 1);
                    //remove all elements that renderer created
                    removeChildList(parent, index, numOfElement);
                    break;
                case 'move':
                    numOfElement = parent.children.length/items.length;
                    //move item to a new position
                    var newIndex = index,
                        oldIndex = items.indexOf(item);
                    //avoid do nonsense thing - move to the old position
                    if(newIndex === oldIndex) return;
                    //get the first element in the DOM node list
                    var firstOldElementIndex = oldIndex * numOfElement;
                    //get the first node to move upon
                    var nodeToInsert = oldIndex < newIndex? parent.children[(newIndex+1)*numOfElement]: parent.children[newIndex*numOfElement];
                    for (var j = 0; j < numOfElement; j++) {
                        parent.insertBefore(parent.children[firstOldElementIndex], nodeToInsert);
                        if(oldIndex > newIndex) firstOldElementIndex++;
                    }
                    break;
                case 'render':
                    //empty all element inside parent node before render
                    html.empty();
                    //render it, call renderer to do thing
                    var length = items.length || items, i = -1;
                    while(++i < length) {
                        element = parent;
                        renderer.call(parent, isNoU(items[i])? i: items[i], i);
                    }
                    break;
            }
        };
        //subscribe update function to observer
        this.subscribe(model, update);
        return this;
    };
    
    // use this method for quick render a list without subscribe renderer to the model
    // this action to avoid memory leak
    // this method is really useful when rendering inner list
    // e.g dynamic content with dynamic header of a table
    // actually we can use each function with "unwrapped observer" instead
    this.quickEach = function(model, renderer) {
        var list = html.getData(model);
        if(!isArray(list)) return;
        var length = list.length, i = -1, parent = element;
        while(++i < length) {
            //set the context for renderer
            element = parent;
            renderer.call(element, list[i]);
        }
    };
    
    //append some controls by callback function
    //this callback may contains some View-Logic
    this.append = function(callback) {
        if (callback.nodeName) {
            // if it has nodeName, possibly it is an HTML element
            // append to the current context
            element.appendChild(callback);
            return this;
        }
        //keep a reference to current element
        //this pointer will be changed when callback is running
        var ele = element;
        //run the callback
        callback();
        //set the pointer again
        element = ele;
        ele = null;
        return this;
    };
    
    this.enable = function(observer) {
        var ele = element; // save a reference to current element
        var updateFn = function(enabled) {
            if (enabled) {
                ele.disabled = false;
                ele.removeAttribute('disabled');
            } else {
                ele.disabled = true;
                ele.setAttribute('disabled', 'disabled');
            }
            html.disposable(ele, observer, this);
            if(!isInDOM(ele)) ele = null;
        };
        updateFn(html.getData(observer));
        this.subscribe(observer, updateFn);
        return this;
    };

    //create br tag
    //NOTE: not to use .$() after use this method, because br is an auto closing tag
    this.br = function () {
        var br = this.createElement('br');
        return this.$();
    };

    // use this method to indicate that you have nothing more to do with current element
    // the pointer will set its ancestor indicated by user
    this.$ = this.end = function (tags) {
        if (!tags) {
            // set context to parent element if no tags passed
            element = element.parentElement;
            return this;
        } else {
            if (tags.nodeName) { // possibly a node
                element = tags;
                return this;
            }
            // when user want to jump out some levels
            var tagList = tags.split(' '); // get all tag
            try {
                for (var i = 0, j = tagList.length; i < j; i++) {
                    if (tagList[i] === element.nodeName.toLowerCase()) {
                        // skip when the context has the same name to current tag
                        // only run here once
                        continue;
                    }
                    while (element.nodeName.toLowerCase() !== tagList[i]) {
                        // go to parent until an element matching current tag
                        element = element.parentElement;
                    }
                    while (tagList[i+1] === element.parentElement.nodeName.toLowerCase()) {
                        // go to parent if the parent matching the next tag
                        element = element.parentElement;
                        i++;
                    }
                }
            } catch (e) {
                throw 'The parent element ' + tagList[i] + ' does not exist';
            }
            return this;
        }
    };

    //this method is used to get current element
    //sometimes user wants to create their own 'each' method and want to intercept renderer
    //NOTE: only use this method to ensure encapsulation
    //in the future, we may hide element, declare it as private not publish anymore
    this.element = this.$$ = function () {
        return element;
    };

    //create a div element
    this.div = function () {
        var ele = this.createElement('div');
        return this;
    };

    //create i element
    this.i = function () {
        var ele = this.createElement('i');
        return this;
    };
    
    // if binding
    html.iff = function (observer, renderer) {
        var ele = element;
        renderer.call(ele, html.getData(observer));
        
        html.subscribe(observer, function(val) {
            if (val) {
                // if the value is truthy
                // run renderer if there's no element inside
                element = ele;
                ele.children.length === 0 && renderer.call(ele);
            } else {
                // if the value is truthy
                // empty the iff node
                html(ele).empty();
                // unbind all event of the container
                html.unbindAll(ele);
            }
            
            // dispose element and subscriber associated with this element
            html.disposable(ele, observer, this);
            if (!isInDOM(ele)) ele = null;
        });
        
        if (!isFunction(observer)) {
            // in case observer is not html.data
            // remove the ele reference immediately after render
            ele = null;
        }
        return html;
    };

    //create span element
    //set innerHTML to span
    //Firefox doesn't have text property for SPAN element, so we only use innerHTML
    //subscribe span to the observer
    this.span = function (observer) {
        var value = html.getData(observer);           //get value of observer
        var span = this.createElement('span');         //create span element
        span.innerHTML = value;
        var updateFn = function (val) {                //update function, only run when observer is from html.data
            span.innerHTML = val;
            html.disposable(span, observer, this);
            if(!isInDOM(span)) span = null;
        };
        this.subscribe(observer, updateFn);            //subscribe update function
        return this;
    };

    //add space for html, it only works for browser support innerHTML (IE > 7 ?)
    this.space = function (numOfSapce) {
        var text = '';
        //loop for numOfSpace
        //generate white space 
        for (var i = 0; i < numOfSapce; i++) {
            text += '&nbsp;';
        }
        //set innerHTML of current element
        var span = this.span().$$();
        span.innerHTML = text;
        this.$();
        return this;
    };

    // set default validation for an observer
    function setValidation (observer, input, errorHandler) {
        // get the error handler from observer
        errorHandler = errorHandler || observer.getValidationHandler();
        // this method is only run when all validation methods have finished running
        var validationCallback = function (validationResults) {
            // create parameters for error handler functions (default and custom)
            validationResults = array.where.call(validationResults, function  (i) {
                // only send to custom error handler invalid validation result
                return i.isValid === false;
            });
            // delegate to user to handle error
            errorHandler && errorHandler(validationResults, observer, input);
            // delegate to default display error message function
            observer.displayDefaultErrorMessage !== false && html.displayErrorMessage(validationResults, observer, input);
        };
        // set default validation handler
        // it will run anyway if the data for text control changed
        observer.setDefaultValidationHandler(validationCallback);
    }
    
    // default validation error message displaying
    // an error message will appear after a control
    // separate this function allow us to override it if necessary
    this.displayErrorMessage = function (validationResults, observer, input) {
    	// get the error span, it's next to the input
        var error = input.nextSibling;
        // if there is no error span, set the error value to be null
        error = error && error.nodeName.toLowerCase() === 'span' && error.className === 'html-error' && error || null;
        // get the first validation result that is invalid
        var firstError = html.array.firstOrDefault.call(validationResults, function (i) {
            return i.isValid === false;
        });
        if (validationResults.length && firstError !== null) {
            // check if there is any validation message
            // create error span if not exists; otherwise set the innerHTML for that span
            error? error.innerHTML = firstError.message
                : html.createEleNoParent('span').text(firstError.message).clss('html-error');
            // set the pointer of error in case we created it, no need to set in case it exists
            error = error || element;
            // insert after the input anyway regardless of it exists or not
            error && html(error).insertAfter(input);
        } else if (error) {
            // remove the error span if there are no errors but the error span exists
            error.parentElement.removeChild(error);
        }
        if (observer.displayDefaultErrorMessage === false && error) {
            // get the config for display default error message
            // if we don't want to display error, remove the error then return
            error.parentElement.removeChild(error);
        }
        // remove reference of error message
        error = null;
        // remove input reference if it isn't in DOM
        if (!isInDOM(input)) input = null;
    };

    var textControls = ['input', 'textarea'];
    //create text control elements
    array.each.call(textControls, function (controlName) {
        html[controlName] = function (observer, errorHandler) {
            //create the input
            // get the current element if current element is input/textarea
            // otherwise create input/textarea
            var input = element.nodeName.toLowerCase() === controlName ? element : this.createElement(controlName);
            var observerValue = this.getData(observer);
            if (input.value !== '' && html.isNoU(observerValue)) {
            	// in case the input has value, perhaps it's rendered from server
            	// set it as original value for observer
                notifier = input;
            	observer(input.value);
            }
            input.value = observerValue || input.value;  // get value of observer
            if (isFunction(observer)) {                  // check if observer is from html.data
                // set default validation handler for observer/control
                setValidation(observer, input, errorHandler);
                // get lazyInput from global config or from observer
                var lazyInput = isNotNull(observer.lazyInput) ? observer.lazyInput : this.config.lazyInput;
                // if observer is html.data then register change event
                // so that any change can be notified
                var change = function (e) {
                    var _newVal = this.value;
                    //observer.silentSet(_newVal);
                    //check if observer is computed
                    //if not then set observer's value
                    if (observer.isComputed && !observer.isComputed()) {
                        // in case it is is not a computed object
                        // set the value with the error handler callback method
                        // set the flag to tell observer that this change is from UI
                        // if we don't set this flag, the notifier will be set to null
                        // then we got problem when user input in the middle of the input
                        // the pointer always set to the end of input
                        observer(_newVal, true);
                    } else {
                        //if observer is a computed object, simply refresh it
                        observer.refresh();
                    }
                };
                if (isIE9 && !lazyInput) {
                    this.change(change).compositionend(change).compositionstart(change).cut(change)
                        .keydown(change).keyup(change).paste(change);
                } else if (!isOldIE && !lazyInput) {
                    //register event for change the observer value
                    //these event also notifies for subscribed objects
                    this.change(change).compositionend(change).compositionstart(change).inputting(change);
                } else if (isOldIE && !lazyInput) {
                    this.keydown(change).keyup(change).change(change).cut(change).paste(change);
                } else {
                    this.change(change);
                }
                //subscribe to observer how to update UI
                this.subscribe(observer, function (value) {
                    //just update the value of element
                    if(input !== notifier) input.value = value;
                    //dispose the element if it has no parent
                    html.disposable(input, observer, this);
                    if(!isInDOM(input)) input = null;
                });
            }
            // return html to facilitate fluent API
            return this;
        };
    });
    
    //searching box control for html
    //it acts like filter input in AngularJs
    this.searchbox = function(array, initData) {
        var filter = initData || html.data('');
        this.input(filter);
        filter.subscribe(function(searchStr) {
            array.filter(searchStr);
        });
        return this;
    };

    this.text = function (observer) {
        if(!observer) return this;
        var span = element;
        //remove all child node inside the element
        while (span.firstChild !== null)
            //remove firstChild is the fastest way
            span.removeChild(span.firstChild);
        //get the real value of observer
        var realValue = html.getData(observer);
        //set the value of parent element
        try {
            if (isNotNull(realValue)) span.innerHTML = realValue;
        } catch (e) {
            if (isNotNull(realValue)) span.innerText = realValue;
        }
        var update = function (val) {
            //set the node value when observer update its value
            try {
                span.innerHTML = val;
            } catch (e) {
                span.innerText = val;
            }
            //dispose element if it doesn't belong to DOM tree
            html.disposable(span, observer, this);
            //remove reference if span doesn't belong to document
            if(!isInDOM(span)) span = null;
        };
        //subscribe update function to observer
        html.subscribe(observer, update);
        return this;
    };

    //set inner HTML for a tag
    //this method is handle for unit test because it contains only one line of code
    //and no way to fail, so it is more trusted than html.render
    this.innerHTML = function (text) {
        element.innerHTML = text;
    };

    //bind change event to current element
    //this is shorthand for html.bind(element, 'keyup', callback)
    //this method is also used in fluent API, we can call html.bind but a lot of code
    //
    //this method is also really quirk because it needs to deal with IE < 9
    //with IE < 9, they don't fire event in expected order
    //
    //callback (Function): event to bind to element
    //srcElement (optional Element): element fires the event
    var events = [
        // mouse events
        'click', 'contextmenu', 'dblclick', 'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseover', 'mouseout', 'mouseup',
        // key events
        'keydown', 'keypress', 'keyup',
        // frame/object events
        'abort', 'beforeunload', 'error', 'hashchange', 'load', 'resize', 'scroll', 'unload',
        // form events
        'blur', 'change', 'focus', 'focusin', 'focusout', 'inputting', 'invalid', 'reset', 'search', 'select', 'submit',
        // drag events
        'drag', 'dragend', 'dragenter', 'dragleave', 'dragover', 'dragstart', 'drop',
        // clipboard events
        'copy', 'cut', 'paste',
        // print events
        'afterprint', 'beforeprint',
        // media events, NOTE we have duplicated namespace for onabort
        'canplay', 'canplaythrough', 'durationchange', 'emptied', 'ended', 'error', 'loadeddata', 'loadedmetadata', 'loadstart', 'pause', 'play', 'playing', 'progress',
        'ratechange', 'seeked', 'seeking', 'stalled', 'suspend', 'timeupdate', 'volumechange', 'waiting',
        // animation events
        'animationend', 'animationiteration', 'animationstart',
        // transition events
        'transitionend',
        // misc events
        'message', 'online', 'offline', 'popstate', 'show', 'storage', 'toggle', 'wheel',
        // others
        'compositionend', 'compositionstart'
    ];
    array.each.call(events, function (event) {
        html[event] = function (callback, model) {
            // due to namespace conflict, we must use inputting instead of input
            var eventName = event === 'inputting' ? 'input' : event;
            if (!callback) {
                // trigger all events of the element
                html.trigger(eventName);
                return this;
            }
            // bind event to current element
            this.bind(element, eventName, function (e) {
                e = e || window.event;
                notifier = e.srcElement || e.target;
                callback && callback.call(notifier, e, model);
            }, false);
            //return html to facilitate fluent API
            return this;
        };
    });

    //create radio button element
    //name (string, optional, ''): name attribute for radio
    //observer (html.data, optional, ''): observer, notifier
    this.radio = function (name, val, observer) {
        name = name || '';
        observer = observer || '';
        var radio = this.createElement('input', 'radio');
        radio.name = name;
        radio.value = val;

        //get real value from html.data or whatever
        var value = this.getData(observer);
        //then set value of checked, and also attribute checked
        if (value === radio.value) {
            radio.setAttribute('checked', 'checked');
            radio.checked = true;
        } else {
            radio.removeAttribute('checked');
            radio.checked = false;
        }

        //check if observer is html.data
        if (isFunction(observer)) {
            // set validation handler for observer/checkbox
            setValidation(observer, chkBox);
            // event for changing data
            var change = function (ele, e) {
                if (observer.isComputed()) {
                    observer.refresh();
                } else {                                //because the library has no idea about what user want if change computed
                    observer(this.value);               //if no, just notify change to other listeners
                }
            };
            this.change(change).click(change);
            //subscribe observer update function so that radio button can listen to any change from the observer
            //any changes even though from itself will trigger this function
            //gotta do it because user can change value by code
            this.subscribe(observer, function (value) {
                //dispose element if it doesn't belong to DOM tree
                html.disposable(radio, observer, this);
                //avoid update on element that is removed from DOM tree
                if(!isInDOM(radio)) {
                    //release the reference in this closure
                    radio = null;
                    return;
                }
                if (value === radio.value) {
                    radio.setAttribute('checked', 'checked');
                    radio.checked = true;
                } else {
                    radio.removeAttribute('checked');
                    radio.checked = false;
                }
            });
        }
        return this;
    };

    //checkbox control
    //observer(optional html.data): observe any change
    this.checkbox = function (observer) {
        //create checkbox element
        var chkBox = element.nodeName.toLowerCase() === 'input' && element.type === 'checkbox' ? element : this.createElement('input', 'checkbox');
        //get value for the checkbox from observer
        var value = html.getData(observer);
        //set attribute and also set property checked
        if (value === 'true' || value === true) {
            chkBox.setAttribute('checked', 'checked');
            chkBox.checked = true;
        } else {
            chkBox.removeAttribute('checked');
            chkBox.checked = false;
        }

        //check if observer is html.data
        if (isFunction(observer)) {
            // set validation handler for observer/checkbox
            setValidation(observer, chkBox);
            //bind change event so that any changes will be notified
            var change = function (ele, e) {
                if (observer.isComputed()) {
                    observer.refresh();
                } else {                                //because the library has no idea about what user want if change computed
                    observer(this.checked === true);    //if no, just notify change to other listeners
                }
            };
            this.change(change).click(change);
            //subscribe a listener to observer, so that another element can notifies if any changes
            //this listener may be fired because of the change from itself
            this.subscribe(observer, function (value) {
                //dispose element if it doesn't belong to DOM tree
                html.disposable(chkBox, observer, this);
                //avoid update on element that is removed from DOM tree
                if(!isInDOM(chkBox)) {
                    //release the reference in this closure
                    chkBox = null;
                    return;
                }
                //avoid to update the notifier
                if(chkBox === notifier) return;
                //set attribute and property for the checkbox
                if (value === 'true' || value === true) {
                    chkBox.setAttribute('checked', 'checked');
                    chkBox.checked = true;
                } else {
                    chkBox.removeAttribute('checked');
                    chkBox.checked = false;
                }
            });
        } else {
            // release the reference immediately if observer is not a function
            chkBox = null;
        }
        //return html to facilitate fluent API
        return this;
    };

    //create button
    this.button = function (text) {
        this.createElement('button');
        this.text(text);
        return this;
    };

    var addClass = this.addClass = function (el, newClassName) {
        if (isNoU(newClassName)) {
            newClassName = el;
            el = element;
        }
        if (!el) return this;
        el.className += el.className === '' ? newClassName : ' ' + newClassName;
        return this;
    };

    var removeClass = this.removeClass = function (el, removeClassName) {
        if (isNoU(removeClassName)) {
            // in case user uses the current context instead of pass 2 parameters including element and class name
            // set context to the current element
            removeClassName = el;
            el = element;
        }
        if (!el || removeClassName === '') return this;
        var elClass = el.className;
        while(elClass.indexOf(removeClassName) !== -1) {
            elClass = elClass.replace(removeClassName, '');
            elClass = trim(elClass);
        }
        el.className = elClass;
        return this;
    };
    
    var hasClass = this.hasClass = function (el, className) {
        if (isNoU(className)) {
            // in case user uses the current context instead of pass 2 parameters including element and class name
            // set context to the current element
            className = el;
            el = element;
        }
        return el.className.indexOf(className) >= 0;
    };
    
    //set class attribute for current element
    //the class may change due to observer's value
    this.clss = this.className = function (observer) {
        var ele = element,
            realClassName = html.getData(observer);
        addClass(ele, realClassName);

        this.subscribe(observer, function (newValue, oldValue) {
            removeClass(ele, oldValue);
            addClass(ele, newValue);
            
            // dispose element and subscriber associated with this element
            html.disposable(ele, observer, this);
            if (!isInDOM(ele)) ele = null;
        });
        return this;
    };

    //create common element that requires text parameter
    var commonEles = html.array(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'td', 'th', 'img', 'p', 'label', 'form']);
    commonEles.each(function (ele) {
        html[ele] = function (text) {
            html.createElement(ele);
            html.text(text);
            return html;
        };
    });

    //set id for element, this method should be used at least by html js user
    //because html js user don't need id to get element
    this.id = function (id) {
        // set id for the element
        element.id = id;
        // save id string in global resource
        html.id[id] = '#' + id;
        return this;
    };

    //set attribute for element
    //loop through parameter object's properties
    //set them to the element
    this.attr = function (attr) {
        var curr = element, realVal = html.getData(attr);
        for (var i in realVal) {
            curr.setAttribute(i, html.getData(realVal[i]));
            (function(i) {
                if(realVal[i].subscribe) {
                    realVal[i].subscribe(function(val) {
                        curr.setAttribute(i, val);
                    });
                }
            })(i);
        }
        attr.subscribe && attr.subscribe(function(newAttr) {
            for (var i in newAttr) {
                curr.setAttribute(i, newAttr[i]);
            }
        });
        return this;
    };

    //create table elements, they should have no parameter
    var tableEle = html.array(['table', 'thead', 'tbody', 'tr', 'td']);
    tableEle.each(function (ele) {
        html[ele] = function (text) {
            html.createElement(ele);
            if (text) {
                element.appendChild(document.createTextNode(html.getData(text)));
            }
            return html;
        };
    });

    // create simple a tag
    // this method has 2 usage 
    // 1. normally passing text and href
    // 2. observed text and href in one observed data
    this.a = function (text, href) {
        var a = document.createElement('a');
        if (isHtmlData(text)) {
            var realValue = html.getData(text);
            a.innerHTML = realValue.text;
            a.href = realValue.href;
            text.subscribe(function(newVal) {
                a.innerHTML = newVal.text;
                a.href = newVal.href;
            });
        } else {
            a.innerHTML = text || '';
            a.href = href || '';
        }
        element.appendChild(a);
        element = a;
        return this;
    };

    //dropdown for simple select list, no optionGroup
    //list: list of data will display
    //current: current data selected
    //displayField (string): field to display text for option
    //valueField (string): field to get value for option
    this.dropdown = function (list, current, displayField, valueField) {
        var currentValue = html.getData(current);
        var select = element.nodeName.toLowerCase() === 'select' ? element : this.createElement('select');
        //render options for the select tag
        //An option could be selected if its value equal to currentModel
        this.each(list, function (model) {
            var value = isString(valueField)? model[valueField] : model;
            var display = isString(displayField)? model[displayField] : model;
            html.option(display, value, model === currentValue).$();
        });

        if (isFunction(current)) {
            // set validation handler for observer/dropdown
            setValidation(current, select);
            //add change event to select tag
            this.change(function (event) {
                //get current value of select in the list parameter
                var selectedObj = html.getData(list)[this.selectedIndex];

                //loop through the list to remove all selected attribute
                //if any option that is selected then set attribute selected again
                //and notify change (current is notifier)
                for (var i = 0, j = html.getData(list).length; i < j; i++) {
                    if (i === this.selectedIndex) {
                        current(selectedObj);
                    }
                }
            });
            current.subscribe(function(val) {
                var realList = html.getData(list),
                    index = realList.indexOf(val);
                select.options[index].selected = true;
                select.options[index].setAttribute('selected', 'selected');
            });
        }
        //return html object to facilitate fluent API
        return this;
    };

    //create select element, this method is used in basic dropdown version
    this.select = function () {
        var select = this.createElement('select');
        return this;
    };

    //create option for select tag
    //text (string | html.data): text to display
    this.option = function (text, value, selected) {
        var option = this.createElement('option'), selectedAttr = 'selected';
        //set the value for option tag
        option.value = html.getData(value);
        //set the text for option tag
        option.text = html.getData(text);
        if (html.getData(selected) === true) {
            //if the selected is true
            //set the attribute and also the property of option tag
            option.setAttribute(selectedAttr, selectedAttr);
            option.selected = true;
        }

        //subscribe the update function for selected object
        var update = function (val) {
            if (val === true) {
                option.setAttribute(selectedAttr, selectedAttr);
                option.selected = true;
            } else {
                option.removeAttribute(selectedAttr);
                option.selected = false;
            }
        };
        html.subscribe(selected, update);
        return this;
    };

    this.ul = function () {
        var ul = this.createElement('ul');
        return this;
    };
    this.li = function (text) {
        var li = this.createElement('li');
        return this.text(text);
    };

    //use this method to empty a DOM element
    //usually, user wants to empty a div or a span or a table before rendering
    //this method will also remove all bounded event to its child
    this.empty = function (ele) {
        ele = ele || element;
        while (ele && ele.firstChild) {
            html.unbindAll(ele.firstChild);
            ele.removeChild(ele.firstChild);
        }
        return this;
    };

    var rcamelCase = /-([a-z])/g,
        fcamelCase = function (a, letter) {
            return letter.toUpperCase();
        };
    // this method is to set class for a tag
    // the element's class can be change automatically due to observer's value changed
    // observer (string | html.data): observer, notifier
    // note that getting css only work when the element is in DOM
    this.css = function (observer, cssValue) {
        var cssKey = isString(observer) && observer;
        if (isString(observer) && isString(cssValue)) {
            // when we want to set css using key/value
            element.style[cssKey] = cssValue;
            // do nothing more
            return this;
        } else if (isString(observer) && isNoU(cssValue)) {
            // when we want to get css by a key
            // get it by defaultView or in IE8
            if (!document.defaultView) {
                return element.currentStyle && element.currentStyle[cssKey.replace(rcamelCase, fcamelCase)];
            }
            return document.defaultView.getComputedStyle(element, null).getPropertyValue(cssKey);
        }
        var value = html.getData(observer);
        if (value) {
            //only accept valid css attribute
            //e.g marginRight height, etc
            //otherwise element's style won't work
            html.extend(element.style, value);
        }
        
        var ele = element;
        //subscribe a listener, listen to any change form observer
        html.subscribe(observer, function (val) {
            if (val) {
                html.extend(ele.style, val);
                html.disposable(ele, observer, this);
                if (!isInDOM(ele)) ele = null;
            }
        });
        return this;
    };

    //Visible binding
    //if observer's value is truthy, then display element otherwise hide it
    this.visible = function (observer, isDisplayProp) {
        var ele = element;
        var value = html.getData(observer);

        var oldDisplay = html.css('display');
        html.expando('display', oldDisplay === 'none'? '': oldDisplay);
        var update = function (val) {
            if (val) {
                // accept any truthy value e.g true, 1, 'some text'
                // show it
                isDisplayProp ? html(ele).css('display', html(ele).expando('display') || 'initial') : html(ele).css('visibility', 'visible');
            } else {
                // if not truthy then display element
                // hide it
                isDisplayProp ? html(ele).css('display', 'none') : html(ele).css('visibility', 'hidden');
            }
            html.disposable(ele, observer, this);
            if (!isInDOM(ele)) ele = null;
        };
        update(value);
        this.subscribe(observer, update);
        return this;
    };

    //hidden binding
    //if observer's value is truthy, then hide element otherwise display it
    //this is the opposite of visible
    //this method is needed because the visible binding only accept an function e.g model.isVisible
    //but can't accept 'negative' function like !model.isVisible
    this.hidden = function (observer, isDisplayProp) {
        var ele = element;
        var value = html.getData(observer);

        var oldDisplay = html.css('display');
        html.expando('display', oldDisplay === 'none'? '': oldDisplay);
        var update = function (val) {
            if (!val) {
                // accept any truthy value e.g true, 1, 'some text'
                // show it
                isDisplayProp ? html(ele).css('display', html(ele).expando('display')) : html(ele).css('visibility', 'visible');
            } else {
                // if not truthy then display element
                // hide it
                isDisplayProp ? html(ele).css('display', 'none') : html(ele).css('visibility', 'hidden');
            }
            html.disposable(ele, observer, this);
            if (!isInDOM(ele)) ele = null;
        };
        update(value);
        this.subscribe(observer, update);
        return this;
    };
    
    //append a DOM tree/node after a selected node
    this.insertAfter = function(node) {
        node.parentNode.insertBefore(element, node.nextSibling);
    };
    
    //append a DOM tree/node before a selected node
    this.insertBefore = function(node) {
        node.parentNode.insertBefore(element, node);
    };

    this.isDirty = function (obj) {
        return html.data().isDirty(obj);
    };
    
    function isWindow( obj ) {
        return obj !== null && obj === obj.window;
    }
    function getWindow( elem ) {
        return isWindow( elem ) ? elem : elem.nodeType === 9 && elem.defaultView;
    }
    this.offset = function offset() {

        var docElem, win,
            box = { top: 0, left: 0 },
            doc = element && element.ownerDocument;

        docElem = doc.documentElement;

        if ( typeof element.getBoundingClientRect !== typeof undefined ) {
            box = element.getBoundingClientRect();
        }
        win = getWindow( doc );
        return {
            top: box.top + win.pageYOffset - docElem.clientTop,
            left: box.left + win.pageXOffset - docElem.clientLeft
        };
    };
    
    var outerFrame = [];
    //the method for observe value that needs to be tracked
    //this method is some kind of main method for the whole framework
    //it can observe a value, an array, notify any changes to listeners
    this.data = function (data) {
        //declare private value
        var isArr               =  isArray(data),                         // check data is an array, save step for later check
            _newData            =  isArr ? html.array(data) : data,       // newest data of an observer
            _oldData            =  null,                                  // latest data that has been set
            delay               =  isArr? 0: null,                        // delay config, default is 0 for array, null for other types
            targets             =  [],                                    // targets that we need to notify after every changes
            dependencies        =  [],                                    // all computed functions that has been registered
            validators          =  [],                                    // all validation functions
            validationResults   =  [],                                    // all validation result, including message and isValid properties
            validationCallback  =  null,                                  // callback to run when finishing validation
            customErrorHandler  =  null,                                  // custom error handler
            filteredArray       =  null,                                  // filtered Array
            isDirty             =  false;                                 // a flag to check dirty

        //use to get/set value
        //
        //if user want to get, then just call it
        //e.g name = html.data('Someone')
        //name() is getting 'Someone'
        //
        //if user want to set, then pass any value different from old value
        //name('Another one')
        //name() is getting 'Another one'
        //normally, set action will trigger all listeners
        //if _newData is an array, then this action will trigger 'render' action
        var init = function (obj, isFromUI) {
            if (obj !== null && obj !== undefined) {
                //check if user wants to set
                if (_newData !== obj) {
                    isDirty = true;                              // the data is dirty anyway
                    _oldData = html.getData(_newData);          // set the latest data
                    _newData = isArr? html.array(obj) : obj;    // set the newest data
                    if (!isFromUI) {
                        // clear the notifier element when we want to set value directly
                        // if we don't clear we can't run target functions if we're focusing on the control
                        notifier = null;
                    }
                    // just notify changes
                    refresh();
                }
            } else {
                // user wants to get value
                var res;
                if (isFunction(_newData)) {
                    // evaluate dependencies if the data is a computed property
                    outerFrame.push(init);
                    // we need to register dependencies when executing the function
                    res = html.getData(_newData);
                    outerFrame.pop();
                } else {
                    res = _newData;
                }
                // register dependencies if outerFrame available
                outerFrame.length && init.setDependency(outerFrame[outerFrame.length - 1]);
                // return real value
                return res;
            }
        };
        
        // register dependencies at the first time computed data is run
        if (isFunction(_newData)) {
            // evaluate dependencies if the data is a computed property
            outerFrame.push(init);
            // we need to register dependencies when executing the function
            html.getData(_newData);
            outerFrame.pop();
        }
        
        init.delay = function (time) {
            if (time === undefined) {
                //get the delay
                return delay;
            } else if (isStrNumber(time)) {
                // set the delay time
                delay = time;
            }
            return this; 
        };

        //set a dependency
        init.setDependency = function (dependency) {
            var index = array.indexOf.call(dependencies, dependency);
            index < 0 && dependencies.push(dependency);
        };
        
        // get dependencies
        init.getDependencies = function () {
            return dependencies;
        };

        //check if value is computed
        //return true if it's computed
        //return true if it's simple data type or an array (aka non-computed)
        init.isComputed = function () {
            // set dependency if available
            outerFrame.length && init.setDependency(outerFrame[outerFrame.length - 1]);
            return isFunction(_newData);
        };
        
        // dirty checking
        // obj param is for internal use
        init.isDirty = function (obj) {
            // set dependency if available
            outerFrame.length && init.setDependency(outerFrame[outerFrame.length - 1]);
            if (isDirty) return true;
            obj = obj || _newData;
            if (!isPropertiesEnumerable(obj)) return false;
            for (var i in obj) {
                if (obj[i].isDirty && obj[i].isDirty()) return true;
                if (isPropertiesEnumerable(obj[i]) && init.isDirty(obj[i])) return true;
            }
            return false;
        };
        
        // get all targets
        init.targets = function () {
            return targets;
        };
        
        //subscribe listeners to observer
        init.subscribe = function (updateFn) {
            if ( isFunction(updateFn) && array.indexOf.call(targets, updateFn) < 0 )
                targets.push(updateFn);
            return this;
        };

        //unsubscribe listeners from observer
        init.unsubscribe = function (updateFn) {
            //we need to setTimeout here to avoid removing a target while other targets is still in processing
            //that will cause a bug that other targets won't fire correctly
            setTimeout(function () {
                var index = array.indexOf.call(targets, updateFn);
                targets.splice(index, 1);
            });
        };

        var waitForNewestData, refreshRunner = function () {
            var newData;
            // validate the data anyway
            init.validate();
            if (isFunction(_newData)) {
                // evaluate dependencies if the data is a computed property
                outerFrame.push(init);
                // we need to register dependencies when executing the function
                newData = html.getData(_newData);
                outerFrame.pop();
            }
            // only notifying changes when we have no validation rules
            // because we'll refresh all dependencies after validate data in 'setValidationResult'
            validators.length === 0 && array.each.call(dependencies, function (de) {
                de.refresh();
            });
            newData = filteredArray || newData || html.getData(_newData);
            //fire bounded targets immediately
            array.each.call(targets, function(target) {
                target.call(target, newData, _oldData, null, 'render');
            });
            // we need to save old value when the value is a function
            // this is very important for notifying change correctly
            // esp when we need oldValue for example className binding
            _oldData = newData;
        };
        //refresh change
        var refresh = init.refresh = init.f5 = function () {
            if (isNoU(delay)) {
                refreshRunner();
            } else if (isStrNumber(delay)) {
                if(waitForNewestData) clearTimeout(waitForNewestData);
                waitForNewestData = setTimeout(refreshRunner, delay);
            }
        };
        
        // serialize data
        init.serialize = function () {
            // set dependency if available
            outerFrame.length && init.setDependency(outerFrame[outerFrame.length - 1]);
            return html.serialize(_newData);
        };

        //silent set, this method is helpful for update value but not want UI to do anything
        init.silentSet = function (val) {
            _newData = val;
            return this;
        };
        
        //allow to inherit html.data from html.data.extensions
        html.extend(init, html.data.validation);
        html.extend(init, html.data.extensions);
        
        //call this method whenever you want to create custom validation rule
        init.setValidationResult = function(isValid, message) {
            //push the validation result object to the list
            validationResults.push({ isValid: isValid, message: message });
            if(validators.length === validationResults.length || !isValid) {
                // when all validation rules have been run
                // or when one of validation rules is not valid
                // call the error handler callback
                validationCallback && validationCallback(validationResults);
                // notifying dependencies, because they may depend on 'isValid' state
                array.each.call(dependencies,function (de) { de.refresh(); });
            }
        };
        
        //call this method when you want to create custom validation rules
        init.validate = function(validator) {
            if (validator) {
                //simply put the validator into the queue
                validators.push(validator);
            } else {
                // clear old validation results for running again
                while(validationResults.length) validationResults.pop();
                // run all validators
                validators && array.each.call(validators, function (rule) {
                    rule.call(init, _newData, _oldData);
                });
            }
        };
        
        init.setValidationHandler = function(callback) {
            customErrorHandler = callback;
            return this;
        };
        
        // internal use
        // set default validation
        init.setDefaultValidationHandler = function(callback) {
            validationCallback = callback;
            return this;
        };
        
        init.getValidationHandler = function() {
            return customErrorHandler;
        };
        
        init.validators = function() { return array(validators); };
        
        init.validationResults = function() { return array(validationResults); };
        
        // we should run this function in a callback if there are a rule running asynchronously (ajax)
        init.isValid = function (valid) {
            // set dependency if available
            outerFrame.length && init.setDependency(outerFrame[outerFrame.length - 1]);
            // in case valid is Boolean type
            // we want to set it to valid state
            // just in case we load invalid data from database or anywhere else
            if (valid === true || valid === false) {
                // set all validationResults to valid state that we did pass
                validationResults.length && array.each.call(validationResults, function(v) {
                    v.isValid = valid;
                });
                // run validationCallback to clear all error message
                // only run to clear error message when we want to set to valid state
                // do nothing if we want to set it as invalid
                valid && validationCallback && validationCallback(validationResults);
                // save valid state to a reference
                init.isValid.state = valid;
                // do nothing but return state
                return valid;
            }
            if (validators && validators.length !== validationResults.length) {
                // we never run any rules
                // so by default we return the last valid state or false value
                return init.isValid.state || false;
            } else {
                // if there are any invalid state return false
                // otherwise return true
                return !array.any.call(validationResults, function(v) { return v.isValid === false; });
            }
        };
        init.lazyInput = null;
        init.displayDefaultErrorMessage = null;
        
        //return init object immediately in case initial data is not array
        if (!isArr) {
            return init;
        }
        
        /* ARRAY METHODS */
        
        //this method is to add item into an array
        //and notify 'add' or 'push' action to listeners depend on the index that user wants to insert at
        //if user wants to insert at the last index, then perform 'push'
        //otherwise perform 'add'
        //obj (object): item to be added
        //index (optional number): index indicates where to add item
        init.add = function (obj, index) {
            isDirty = true;
            //by default, index would be the last index
            //it must be the last index when filtering
            index = index === undefined ? _newData.length : index;
            _newData.splice(index, 0, obj);
            if(isNotNull(filteredArray)) {
                filteredArray.push(obj);
                index = filteredArray.length;
            }
            var newData = filteredArray || _newData;
            array.each.call(targets, function(t) { t.call(t, newData, obj, index, 'add'); });
            array.each.call(dependencies, function(d) { d.refresh(); });
            return this;
        };

        //Remove item from array
        //trigger 'remove' action to update UI
        init.remove = function (item) {
            isDirty = true;
            //get index of the item
            var index = _newData.indexOf(item);
            //remove element at that index
            this.removeAt(index);
            return this;
        };

        //remove item from list by its index
        init.removeAt = function (index) {
            isDirty = true;
            //firstly, ensure that the object is array
            //otherwise user may want to test bug of the framework
            //or they really misuse this method, then it's worth throw an exception
            var deleted = _newData[index];
            _newData.splice(index, 1);
            var currentArr = _newData;
            if(filteredArray) {
                index = filteredArray.indexOf(deleted);
                if(index < 0) {
                    return;
                } else {
                    filteredArray.splice(index, 1);
                    currentArr = filteredArray;
                }
            }
            array.each.call(targets, function(t) { t.call(t, currentArr, deleted, index, 'remove'); });
            array.each.call(dependencies, function (de) { de.refresh(); });
            //dispose the object and all reference including computed, observer, targets to avoid memory leak
            //below is very simple version of that task, improve in the future
            //we must loop recursively inside deleted object to remove all targets
            deleted = null;
            return this;
        };

        //remove the first item of list
        init.pop = function () {
            isDirty = true;
            this.removeAt(_newData.length - 1);
            return this;
        };

        //push an item into the list
        init.push = function (item) {
            isDirty = true;
            var index = _newData.length;
            //push item into array immediately
            _newData.push(item);
            if(isNotNull(filteredArray)) {
                index = filteredArray.length;
                filteredArray.push(item);
            }
            var newData = filteredArray || _newData;
            array.each.call(targets, function(t) { t.call(t, newData, item, index, 'push'); });
            array.each.call(dependencies, function (de) { de.refresh(); });
        };
        
        //use to move an item to a new position
        init.move = function(oldPosition, newPosition) {
            isDirty = true;
            var currentArr = filteredArray || _newData,
                item = currentArr[oldPosition];
            array.each.call(targets, function(t) { t.call(t, currentArr, item, newPosition, 'move'); });
            array.each.call(dependencies, function (de) { de.refresh(); });
            currentArr.move(oldPosition, newPosition);
            if (filteredArray) {
                oldPosition = _newData.indexOf(currentArr[oldPosition]);
                newPosition = _newData.indexOf(currentArr[newPosition]);
                _newData.move(oldPosition, newPosition);
            }
        };
        
        //swap two element in the list
        //only swap in the current list, you can't filter and swap together
        //first (number): first index to swap
        //second (number): second index to swap
        init.swap = function (first, second) {
            isDirty = true;
            //do nothing when swap two elements at the same position
            if(first === second) return;
            //swap first index and second index if first is greater than second
            //this action make sure we will swap correct element after first move
            //because after the first move, element below will increase index 1
            if(first > second) {
                first = first+second; second = first-second; first = first-second;
            }
            var currentArr = filteredArray || _newData;
            this.move(first, second);
            first !== second - 1 && this.move(second - 1, first);
        };
        
        //support native splice method for array
        init.splice = function (index, number, newItems) {
            isDirty = true;
            for (var i = 0; i < number; i++) {
                //firstly, remove deleted items
                this.removeAt(index);
            }
            if(isArray(newItems)) {
                for (i = newItems.length - 1; i >= 0; i--) {
                    this.add(newItems[i], index);
                }
            } else if(isNotNull(newItems)) {
                this.add(newItems, index);
            }
        };
        
        //arguments are similar to orderBy in html.array.orderBy method
        init.orderBy = function () {
            var args = arguments;
            _newData.orderBy.apply(_newData, args);
            filteredArray && filteredArray.orderBy.apply(filteredArray, args);
            refresh();
            return this;
        };
        
        //arguments are similar to where in html.array.where method
        init.where = function () {
            var args = arguments;
            filteredArray = _newData.where.apply(_newData, args);
            if(!filteredArray || !filteredArray.length) {
                filteredArray = null;
                return this;
            }
            //only use temporary data to render the list
            //user can re-render original data
            refresh();
            return this;
        };
        
        //full text search on a list
        init.filter = function(searchStr) {
            if(!searchStr) {
                //when search string is null or empty
                //just remove the filtered array
                filteredArray = null;
                //re-render the list by its original data
                refresh();
                return this;
            }
            //prepare itemSerialized for later use
            var itemSerialized = null;
            //init filteredArray
            filteredArray = html.array([]);
            for (var i = 0, j = _newData.length; i < j; i++) {
                //get the data serialized from each item in the original list
                itemSerialized = html.serialize(_newData[i]);
                if(toSearchStr(getPropValues(itemSerialized)).indexOf(toSearchStr(searchStr)) >= 0) {
                    //compare to the search string
                    //push the item to the result list
                    filteredArray.push(_newData[i]);
                }
            }
            //re-render the list using filteredArray
            refresh();
            return this;
        };
                
        /* END ARRAY METHODS */
        
        //get filtered array so user can do action on that array
        init.getFilterResult = function() {
            return filteredArray;
        };
        
        //use this method to set a another filter algorithm
        //for example user can implements full text search
        init.setFilterResult = function(result) {
            if(!isArray(result)) return;
            //set filteredArray from outside world
            //developer may want to implement by himself filter feature
            //so we give them a chance to do that
            filteredArray = html.array(result);
            //using filter result to render the list
            refresh();
        };
        
        return init;
    };
    
    //prepare namespace for extending html.data
    this.data.extensions = {};
    //prepare namespace for validate html.data
    //html.data.validation namespace is use for validate the data
    this.data.validation = {};
    
    /* VALIDATION */
    //required validation
    this.data.validation.required = function(message) {
        this.validate(function(newValue, oldValue) {
            newValue = newValue && newValue.toString() || '';
            if (!isNotNull(newValue) || trim(newValue) === '') {
                this.setValidationResult(false, message);
            } else {
                this.setValidationResult(true, message);
            }
        });
        return this;
    };
    
    this.data.validation.isNumber = function(message) {
        this.validate(function(newValue, oldValue) {
            if (!isNotNull(newValue) || !isStrNumber(newValue)) {
                this.setValidationResult(false, message);
            } else {
                this.setValidationResult(true, message);
            }
        });
        return this;
    };
    
    this.data.validation.isEmail = function(message) {
        this.validate(function(newValue, oldValue) {
            if (!isNotNull(newValue) || !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(newValue)) {
                this.setValidationResult(false, message);
            } else {
                this.setValidationResult(true, message);
            }
        });
        return this;
    };
    
    this.data.validation.pattern = function(pattern, message) {
        this.validate(function(newValue, oldValue) {
            if (!isNotNull(newValue) || !pattern.test(newValue)) {
                this.setValidationResult(false, message);
            } else {
                this.setValidationResult(true, message);
            }
        });
        return this;
    };
    
    this.data.validation.maxLength = function(length, message) {
        this.validate(function(newValue, oldValue) {
            if (isString(newValue) && newValue.length <= length) {
                this.setValidationResult(true, message);
            } else {
                this.setValidationResult(false, message);
            }
        });
        return this;
    };
    
    this.data.validation.minLength = function(length, message) {
        this.validate(function(newValue, oldValue) {
            if (isString(newValue) && newValue.length < length) {
                this.setValidationResult(false, message);
            } else {
                this.setValidationResult(true, message);
            }
        });
        return this;
    };
    
    this.data.validation.stringLength = function(min, max, message) {
        this.validate(function(newValue, oldValue) {
            if (isString(newValue) && (newValue.length < min || newValue > max)) {
                this.setValidationResult(false, message);
            } else {
                this.setValidationResult(true, message);
            }
        });
        return this;
    };
    
    this.data.validation.range = function(min, max, message) {
        this.validate(function(newValue, oldValue) {
            if(!isStrNumber(newValue)) {
                this.setValidationResult(false, 'The value must be a number.');
            } else if (parseFloat(newValue) < min) {
                this.setValidationResult(false, message || 'The value can\'t be less than ' + min + '.');
            } else if (parseFloat(newValue) > max) {
                this.setValidationResult(false, message || 'The value can\'t be greater than ' + max + '.');
            } else {
                this.setValidationResult(true, message);
            }
        });
        return this;
    };
    
    this.data.validation.greaterThan = function(obj, message) {
        this.validate(function(newValue, oldValue) {
            if(newValue <= html.getData(obj)) {
                this.setValidationResult(false, message);
            } else {
                this.setValidationResult(true);
            }
            
        });
        return this;
    };
    
    this.data.validation.lessThan = function(obj, message) {
        this.validate(function(newValue, oldValue) {
            if(newValue >= html.getData(obj)) {
                this.setValidationResult(false, message);
            } else {
                this.setValidationResult(true);
            }
            
        });
        return this;
    };
    
    this.data.validation.greaterThanOrEqual = function(obj, message) {
        this.validate(function(newValue, oldValue) {
            if(newValue < html.getData(obj)) {
                this.setValidationResult(false, message);
            } else {
                this.setValidationResult(true);
            }
            
        });
        return this;
    };
    
    this.data.validation.lessThanOrEqual = function(obj, message) {
        this.validate(function(newValue, oldValue) {
            if(newValue < html.getData(obj)) {
                this.setValidationResult(false, message);
            } else {
                this.setValidationResult(true);
            }
            
        });
        return this;
    };
    
    this.data.validation.equal = function(obj, message) {
        this.validate(function(newValue, oldValue) {
            if(newValue !== html.getData(obj)) {
                this.setValidationResult(false, message);
            } else {
                this.setValidationResult(true);
            }
            
        });
        return this;
    };

    /* END OF VALIDATION */

    //this method is to refresh change by user's code
    //need to loop through the argument list then loop through each properties
    //check the property is computed, because we only want to notify computed object
    this.data.refresh = function (viewModel) {
        if (viewModel.isComputed && viewModel.isComputed()) {
            viewModel.refresh();
            return;
        }
        for (var i in viewModel) {
            if (viewModel[i].isComputed && viewModel[i].isComputed()) {
                viewModel[i].refresh();
            }
        }
    };

    // serialize on object that contains html.data
    // rootObj (object): any object that contains html.data
    this.serialize = function (rootObj) {
        //firstly, unwrap rootObj
        rootObj = rootObj && rootObj.isComputed ? rootObj() : rootObj;
        //is root object an array
        var isList = isArray(rootObj);
        //initialize result based on root obj type
        var result = isList ? [] : {};
        //check that root object should be loop through properties
        //we don't use propertyIsEnumerable because it's really risky
        //we will go through all object that is basic type like Date, String, null, undefined, Number, etc
        var hasProps = isPropertiesEnumerable(rootObj) || !isNotNull(rootObj);
        if (!hasProps) return rootObj;

        //loop through properties
        for (var i in rootObj) {
            if (rootObj[i] && rootObj[i].isComputed && !rootObj[i].add) {
                //if it is an observer but not an array
                //then get then object value then assign to result
                result[i] = rootObj[i]();
            } else {
                result[i] = html.serialize(rootObj[i]);
            }
        }

        //if root object is an array
        //loop through element
        //assign to result and then apply serialize recursively
        if (isList) {
            i = 0;
            for (var j = rootObj.length; i < j; i++) {
                result[i] = html.serialize(rootObj[i]);
            }
        }

        return result;
    };
}).call(html);

/* Document ready implementation 
 * https://github.com/addyosmani/jquery.parts/blob/master/jquery.documentReady.js
 */
(function () {
    // Define a local copy of $
    this.ready = function (callback) {
        registerOrRunCallback(callback);
        bindReady();
    };
    var readyBound = false,
    isReady = false,
    callbackQueue = [],
    registerOrRunCallback = function (callback) {
        if (isFunction(callback)) {
            callbackQueue.push(callback);
        }
    },
    documentReadyCallback = function () {
        while (callbackQueue.length) {
            (callbackQueue.shift())();
        }
        registerOrRunCallback = function (callback) {
            callback();
        };
    },

    // The ready event handler
    DOMContentLoaded = function () {
        if (document.addEventListener) {
            document.removeEventListener('DOMContentLoaded', DOMContentLoaded, false);
        } else {
            // we're here because readyState !== 'loading' in oldIE
            // which is good enough for us to call the DOM ready!
            document.detachEvent('onreadystatechange', DOMContentLoaded);
        }
        documentReady();
    },

    // Handle when the DOM is ready
    documentReady = function () {
        // Make sure that the DOM is not already loaded
        if (!isReady) {
            // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
            if (!document.body) {
                return setTimeout(documentReady, 1);
            }
            // Remember that the DOM is ready
            isReady = true;
            // If there are functions bound, to execute
            documentReadyCallback();
            // Execute all of them
        }
    }, // /ready()

    bindReady = function () {
        var toplevel = false;

        if (readyBound) {
            return;
        }
        readyBound = true;

        // Catch cases where $ is called after the
        // browser event has already occurred.
        if (document.readyState !== 'loading') {
            documentReady();
        }

        // Mozilla, Opera and webkit nightlies currently support this event
        if (document.addEventListener) {
            // Use the handy event callback
            document.addEventListener('DOMContentLoaded', DOMContentLoaded, false);
            // A fallback to window.onload, that will always work
            window.addEventListener('load', DOMContentLoaded, false);
            // If IE event model is used
        } else if (document.attachEvent) {
            // ensure firing before onload,
            // maybe late but safe also for iframes
            document.attachEvent('onreadystatechange', DOMContentLoaded);
            // A fallback to window.onload, that will always work
            window.attachEvent('onload', DOMContentLoaded);
            // If IE and not a frame
            // continually check to see if the document is ready
            try {
                toplevel = window.frameElement === null;
            } catch (e) { }
            if (document.documentElement.doScroll && toplevel) {
                doScrollCheck();
            }
        }
    },

    // The DOM ready check for Internet Explorer
    doScrollCheck = function () {
        if (isReady) {
            return;
        }
        try {
            // If IE is used, use the trick by Diego Perini
            // http://javascript.nwbox.com/IEContentLoaded/
            document.documentElement.doScroll('left');
        } catch (error) {
            setTimeout(doScrollCheck, 1);
            return;
        }
        // and execute any waiting functions
        documentReady();
    };

}).call(html);
/* End Document ready implementation */

//Method Not documented
//http://codegolf.stackexchange.com/questions/2211/smallest-javascript-css-selector-engine
(function () {
    var curCSS,
        rnotDigit = /\D+/g,
        attr = 'outline-color',
        attrOn = 'rgb(00,00,07)',
        rcamelCase = /-([a-z])/g;
    var fcamelCase = function (a, letter) {
        return letter.toUpperCase();
    };
    //From http://j.mp/FhELC
    var getElementById = function (id) {
        var elem = document.getElementById(id);
        if (elem) {
            //verify it is a valid match!
            if (elem.attributes.id && elem.attributes.id.value == id) {
                //valid match!
                return elem;
            } else {
                //not a valid match!
                //the non-standard, document.all array has keys for all name'd, and id'd elements
                //start at one, because we know the first match, is wrong!
                for (var i = 1; i < document.all[id].length; i++) {
                    if (document.all[id][i].attributes.id && document.all[id][i].attributes.id.value == id) {
                        return document.all[id][i];
                    }
                }
            }
        }
        return null;
    };
    var style = document.createElement('style');

    if (document.defaultView && document.defaultView.getComputedStyle) {
        curCSS = function (elem, name) {
            return elem.ownerDocument.defaultView.getComputedStyle(elem, null).getPropertyValue(name);
        };

    } else if (document.documentElement.currentStyle) {
        curCSS = function (elem, name) {
            return elem.currentStyle && elem.currentStyle[name.replace(rcamelCase, fcamelCase)];
        };
    }
    this.query = this.querySelectorAll = function (selector, context, extend) {
        context = context || document;
        extend = extend || [];

        var id, p = extend.length || 0;
        
        // embed style tag into document
        document.getElementsByTagName('head')[0].appendChild(style);
        try { style.innerHTML = selector + "{" + attr + ":" + attrOn + "}"; }
        //IE fix
        catch (ex) { style.styleSheet.cssText = selector + "{" + attr + ":" + attrOn + "}"; }

        if (document.defaultView && document.querySelectorAll) {
            id = "";
            var _id = context.id,
                _context = context;
            if (context != document) {
                id = '__slim__';
                context.id = id;
                id = "#" + id + " ";
            }
            context = document.querySelectorAll(id + selector);
            // remove id when it wasn't set by selector
            if (_id) _context.id = _id; else _context.removeAttribute && _context.removeAttribute('id');
            //Setting selector=1 skips checking elem
            selector = 1;
        }
        else if (!context[0] && (id = /(.*)#([\w-]+)([^\s>~]*)[\s>~]*(.*)/.exec(selector)) && id[2]) {
            //no selectors after id
            context = getElementById(id[2]);
            //If there isn't a tagName after the id we know the el just needs to be checked
            if (!id[4]) {
                context = [context];
                //Optimize for #id
                if (!id[1] && !id[3]) {
                    selector = 1;
                }
            }
        }
        //If context contains an array or nodeList of els check them otherwise retrieve new els by tagName using selector last tagName
        context = (selector == 1 || context[0] && context[0].nodeType == 1) ?
            context :
            context.getElementsByTagName(selector.replace(/\[[^\]]+\]|\.[\w-]+|\s*$/g, '').replace(/^.*[^\w]/, '') || '*');

        for (var i = 0, l = context.length; i < l; i++) {
            //IE returns comments when using *
            if (context[i].nodeType == 1 && (selector == 1 || curCSS(context[i], attr).replace(rnotDigit, '') == 7)) {
                extend[p++] = context[i];
            }
        }
        extend.length = p;
        // remove the style tag after query, we don't want it affect to user's style
        document.getElementsByTagName('head')[0].removeChild(style);
        return html.array(extend);
    };

    this.querySelector = function (selector, context, extend) {
        return this.querySelectorAll(selector, context, extend)[0];
    };
}).call(html);


/*html loader 
NOTE: this method only support load on client
usage of this function
html.scripts({
    jQuery: '/script/jquery-2.1.0.js?v=123123',
        jQueryUI: [
    '/script/jquery-dataTables.js?v=123123',
    '/script/jquery-datapicker.js?v=123123',
    '/script/jquery-tooltip.js?v=123123',
    ]
});
html.styles({
    jQuery: '/script/jquery-2.1.0.css?v=123123',
        jQueryUI: [
    '/styles/jquery-dataTables.css?v=123123',
    '/styles/jquery-datapicker.css?v=123123',
    '/styles/jquery-tooltip.css?v=123123',
    ],
    bootstrap: '/styles/bootstrap.css'
});
html.scripts.render('jQuery').then('jQueryUI');
html.styles.render('jQueryUI').then('bootstrap');*/

(function () {
    var scripts = {}, styles = {},
        urlList = html.array([]),
        dependencies = html.array([]),
        bundleQueue = html.array([]);

    //create head section if not exists
    var head = document.getElementsByTagName('head')[0] || html.querySelector('head') || html(document).createElement('head').$$();

    //run when a script has been loaded
    //event that script just loaded or loaded in previous bundle
    var dependenciesLoadedCallback = function () {
        //a flag indicating all scripts in a bundle has been loaded
        //we'll check this condition again using urlList
        var isAllLoaded = false;
        if (isString(dependencies)) {
            //if dependency is a script not a bundle
            //check whether the scripts is in loaded urls
            urlList.each(function (node) {
                if (node.url === dependencies && node.isLoaded) {
                    //whenever we cant find the dependency
                    //set the flag to be true
                    isAllLoaded = true;
                }
            });
        } else if (isArray(dependencies)) {
            //if the dependencies are in an array
            //temporarily set the flag to be true
            //set it to false whenever we get a script not loaded
            isAllLoaded = true;
            dependencies.each(function (url) {
                var isLoaded = urlList.firstOrDefault(function (x) { return x.url === url && x.isLoaded; });
                if (!isLoaded) {
                    isAllLoaded = false;
                }
            });
        }
        if (isAllLoaded) {
            //after all script of previous bundle have been loaded
            if (isFunction(bundleQueue[0])) {
                //if the next bundle is a function
                //execute it, it is from done method
                //remove that callback function from the bundle queue
                var done = bundleQueue.shift(), requiredModules = html.module(done.__requiredModules__);
                done.apply(window, requiredModules || []);
            }
            //load that bundle
            return html.scripts.render(bundleQueue.shift());
        }
    };

    html.config.allowDuplicate = false;

    //create scripts node, append them to head section of document
    //browser will know how to treat that node says load it and execute
    var createScriptNode = function (url, callback) {
        //check if the script has been loaded?
        var isLoaded = urlList.firstOrDefault(function (x) { return x.url === url; });
        //if the script has been loaded and duplication is not allowed, do nothing
        if (isLoaded && !html.config.allowDuplicate) {
            callback();
            return;
        }

        //if the script hasn't been loaded, create script node
        var node = document.createElement('script');
        //set type of that node to text/javascript
        //this is traditional type
        node.type = 'text/javascript';
        node.charset = 'utf-8';
        //set the url for the script node
        node.async = true;

        var scriptLoaded = function () {
            //remove the node after finish loading
            node.parentElement.removeChild(node);
            //set a flag for url loading tracking state
            urlList.push({ url: url, isLoaded: true });
            //call the callback, so can execute 'then' function
            callback();
        };
        if (node.onreadystatechange !== undefined) {
            node.onload = node.onreadystatechange = function () {
                if (this.readyState == 'complete' || this.readyState == 'loaded') {
                    scriptLoaded();
                }
            };
        } else {
            html.bind(node, 'load', scriptLoaded);
        }
        node.src = url;
        //append the script node to header, if not, browser doesn't load and execute
        head.appendChild(node);
        return node;
    };

    //create style node, append them to head section of document
    //browser will know how to treat that node says load it and apply the css
    var createStyleNode = function (url) {
        var isLoaded = urlList.firstOrDefault(function (x) { return x.url === url; });
        if (isLoaded && !html.config.allowDuplicate) return;

        var node = document.createElement('link');
        node.type = 'text/css';
        node.rel = 'stylesheet';
        node.href = url;
        node.async = true;
        head.appendChild(node);
        urlList.push({ url: url, isLoaded: true });
        return node;
    };

    this.scripts = function (bundles) {
        html.extend(scripts, bundles);
    };
    this.styles = function (bundles) {
        html.extend(styles, bundles);
    };

    this.scripts.render = function (bundle) {
        //get the script list in the bundle
        var scriptList = scripts[bundle];
        // if the parameter is a script, then assign to scriptList to load
        if (!scriptList) scriptList = bundle;
        if (isString(scriptList)) {
            //if the current script list is just one script
            //set dependencies
            dependencies = scriptList;
            //create script node, when the node has been loaded, run dependenciesLoadedCallback
            //that callback will load the next bundle
            createScriptNode(scriptList, dependenciesLoadedCallback);
        } else if (isArray(scriptList)) {
            //if the current script list is an array of scripts
            //set dependencies
            dependencies = html.array(scriptList);
            //create script node for each of element in scriptList
            for (var i = 0, j = scriptList.length; i < j; i++) {
                createScriptNode(scriptList[i], dependenciesLoadedCallback);
            }
        }
        return this;
    };

    this.styles.render = function (bundle) {
        var styleList = styles[bundle];
        if (!styleList) styleList = bundle;
        if (isString(styleList)) {
            createStyleNode(styleList);
        } else if (isArray(styleList)) {
            for (var i = 0, j = scriptList.length; i < j; i++) {
                createStyleNode(styleList[i]);
            }
        }
        return this;
    };

    //append more scripts into the queue to load
    this.scripts.then = function (bundle) {
        //just append the bundle queue
        bundleQueue.push(bundle);
        return this;
    };

    this.styles.then = function (bundle) {
        return html.styles.render(bundle);
    };

    //callback function - run when all scripts has been loaded
    this.scripts.done = function (callback, requiredModules) {
        bundleQueue.push(callback);
        callback.__requiredModules__ = requiredModules;
        return this;
    };
}).call(html);

/* ROUTER 
 * Dependency: html.array
*/
(function () {
    this.config.historyEnabled = true;
    var html         = this,
        context       = {},
        history       = window.history,
        location      = window.location,
        origin        = location.origin || location.protocol + "//" + location.hostname + (location.port ? ':' + location.port: ''),
        routes        = html.array([]),
        ignoredRoutes = html.array([]),
        makeRegEx     = function(pattern) {return new RegExp('^' + pattern.replace(/\//g, "\\/").replace(/\?/g, "\\?").replace(/:([0-9a-zA-Z-_]*)/g,"([0-9a-zA-Z-_]*)") + '$'); };
        
    //main function for routing
    //expose to html object
    //pattern (string): url pattern for registering
    //fn: the call back function, run when a url is matched the registered pattern
    var router = this.router = function(pattern, fn) {
        var promise, partialURL, container, scripts = [], doneActions = [fn];
        // create a promise
        // the task is not really asynchronous
        // but we need to wait for user to register done action, partialURL, scripts before register route
        // so that we don't use resolve/reject
        promise = html.Promise(function () {
            //check for pattern has been registered yet?
            var isPatternRegistered = routes.any(function(r){ return r.originalPattern === pattern; });
            if(!isPatternRegistered) {
                //register the pattern
                routes.push({
                    originalPattern: pattern,
                    pattern: makeRegEx(pattern), 
                    doneActions: doneActions, 
                    partialURL: partialURL, 
                    scripts: scripts,
                    container: container
                });
            } else {
                //throw exception when we found it has been registered
                //this action make developers easier to debug routing
                throw 'Duplicated pattern: ' + pattern + '. Please provide another pattern!';
            }
        });
        
        // partial function
        promise.partial = function (url, ele) {
            partialURL = url;
            container = ele;
            return promise;
        };
        
        // script loading function
        promise.scripts = function (bundle) {
            scripts.push(bundle);
            return promise;
        };
        
        // done actions after loading partial and/or scripts
        promise.done = function (action) {
            if (isFunction(action)) {
                doneActions.push(action);
            }
            return promise;
        };
        
        // return promise for fluent API
        return promise;
    };
    
    //navigate to an url
    //if the pattern of url is registered then run the callback
    this.navigate = function (path) {
        // push state when history and routing enabled
        if (html.config.historyEnabled && history.pushState) {
            // push new state into history
            history.pushState(null, null, path);
        } else if (!history.pushState) {
            // set the location's hash to be the current URL
            location.hash = path;
        }
        // process the url
        process.call(path);
        return this;
    };
    
    //ignore a pattern
    //usually too simple pattern like #, #:section will be ignored by user
    this.ignoreRoute = function(pattern) {
        //check for the pattern is registered or not
        //throw exception for developer - make it easier to trace bug
        var isPatternRegistered = routes.firstOrDefault(function(r){ return r.originalPattern === pattern; });
        if(isPatternRegistered) throw 'Pattern has been registered! Please check the routing configuration.';
        //push the pattern into ignored list
        ignoredRoutes.push(makeRegEx(pattern));
        return this;
    };
    
    var runRoute = function (actions, context, params) {
        html.array.each.call(actions, function (action) {
            action.apply(context, params);
        });
    };
    
    //process the route, we got some cases that routes run
    //1. Back button of browser
    //2. Click on a link
    //3. Navigate by developer
    var process = function (href) {
        var path      = isString(href) && href || location.hash || location.pathname,
            isIgnored = ignoredRoutes.any(function(r){ return r.test(path); });
        //do nothing when the path is in ignored list
        if (isIgnored) return;
        var route = routes.firstOrDefault(function(r){ return r.pattern.test(path); });
        if (route) {
            //when we found a pattern that matches the path
            //reset the context
            context = {};
            //find all variable matched the pattern
            var params = path.match(route.pattern);
            //remove the first match, it is a redundant matched item contain the whole url
            params.shift();
            //get all parameter, set to a context
            //this step is not really necessary because we pass every params found into callback
            html.array(route.originalPattern.match(/:(\w*)/g))
                .select(function(arg){ return arg.replace(':', ''); })
                .each(function(key, index) {
                    // map the param to context variable
                    // e.g context.section = 'homePage';
                    // e.g context.pageIndex = '12';
                    context[key] = params[index];
                });
            // load partial here if any
            if (route.partialURL) {
                html.partial(route.partialURL, route.container).done(function () {
                    // when finishing loading partial
                    // we then load all scripts
                    if (route.scripts) {
                        var scriptLoaded = html.scripts.render(route.scripts.shift());
                        while (route.scripts.length) scriptLoaded.then(route.scripts.shift());
                        scriptLoaded.done(function () {
                            //run the callback with its parameters
                            runRoute(route.doneActions, context, params);
                        });
                    } else  {
                        //run the callback with its parameters
                        runRoute(route.doneActions, context, params);
                    }
                });
            } else {
                //run the callback with its parameters
                runRoute(route.doneActions, context, params);
            }
        }
    };
    
    // process the current URL, usually run this function once when init the page
    this.router.process = function () {
        // we need to set time out because all route is registered via Promises pattern.
        setTimeout(function () {
            // simply run the process function
            process();
        });
    };
    
    //register click event on every a tag
    //we have no way but registering on document element, then check for A tag
    html(document).click(function(e) {
        var a = e.target || e.srcElement;
        // save element reference
        var ele = html.element();
        try {
            // try to go to the closest anchor link
            // because user really wants to click on the anchor link
            a = a.nodeName.toLowerCase() !== 'a'? html(a).$('a').$$(): a;
        } catch (ex) {
            // in case we can't find the closest anchor link
            // do nothing, just avoid throwing unexpected exception
        }
        // set the pointer to old element
        html(ele);
        ele = null;
        
        var path = a.getAttribute('href'), ignoreAttribute = a.getAttribute('ignore-route');
        //ignore that the link will be open in another tab, ignore case that element is not a tag
        if(a.target === '_blank' || a.nodeName && a.nodeName.toLowerCase() !== 'a') return;
        // Middle click, cmd click, and ctrl click should open links in a new tab as normal.
        if (e.which > 1 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        // Ignore event with default prevented
        if (e.defaultPrevented || e.getPreventDefault && e.getPreventDefault() || e.returnValue === false) return;
        // ignore all routes that user want to ignore
        var isIgnored  = ignoredRoutes.any(function(r){return r.test(path.toLowerCase());}) || ignoreAttribute;
        //do nothing when the path is in ignored list
        if(isIgnored) return;
        
        // prevent default behaviour of browser before processing
        // this trick is due to IE doesn't fire popstate event
        // but it fires hashchange event if the hash tag has been changed
        // however we want popstate event to be triggered
        e.preventDefault? e.preventDefault(): e.returnValue = false;
        
        // navigate to the path
        html.navigate(path);
    });
    
    // register event for window object, detect url change (hash change or state change)
    // only register event when historyEnabled was set to true
    // fall back to hash tag change event if window.history is not available
    if (html.config.historyEnabled && history && history.pushState) {
        window.addEventListener('popstate', process);
    } else if (html.config.historyEnabled) {
        window.addEventListener ? window.addEventListener('hashchange', process) : window.attachEvent('hashchange', process);
    }

}).call(html);
/* END OF ROUTER */

/* AJAX MODULE */
//must implement ajax using Promise pattern
//we can reuse jQuery ajax for fast release
//firstly, try to implement promise with setTimeout
(function() {
    var array = html.array;
    
    // Promise pattern for calling asynchronous code, usually ajax/setTimeout/setInterval
    this.Promise = function(task) {
        // save reference to done functions and fail function callback
        var done = [], fail = [], mockDone, mockFail;
        
        // resolve function, use to call all done functions
        var resolve = function(val) {
            //run all done methods on fulfilled
            array.each.call(done, function(f) {f && f(val);});
            promise = null;
        };
        // reject function, use to call fail function
        var reject = function(reason) {
            //run all fail methods on rejected
            array.each.call(fail, function(f) {f && f(reason);});
            promise = null;
        };
        
        // declare promise variable
        var promise = {};
        // promise done method, use to set done methods, these methods will be call when the resolve method called
        // we can call done and then as many times as we want
        promise.done = function(callback) {
            if(isFunction(callback)) {
                // only push the callback to the queue if it is a function
                done.push(callback);
            }
            return promise;
        };
        // promise fail method, use to set fail method, the method will be call when the reject method called
        // only call fail method once
        promise.fail = function(callback) {
            if (isFunction(callback)) {
                // only set the callback if it is a function
                fail.push(callback);
            }
            return promise;
        };
        
        promise.mockDone = function(data) {
            // assign mock data
            mockDone = data;
            // delete mockDone and mockFail methods in promise
            // can't use these methods any more
            delete promise.mockDone;
            delete promise.mockFail;
            return promise;
        };
        
        promise.mockFail = function(reason) {
            // assign mock reason
            mockFail = reason;
            // delete mockDone and mockFail methods in promise
            // can't use these methods any more
            delete promise.mockDone;
            delete promise.mockFail;
            return promise;
        };
        
        // need to setTimeout here for giving user a chance to set mockData/additional parameters
        setTimeout(function() {
            // try to resolve/reject using mockData
            if (mockDone || mockFail) {
                mockDone? resolve(mockDone): reject(mockFail);
            } else {
                // if there's no mockData set up, the run the task
                task(resolve, reject);
            }
        });
        
        return promise;
    };
    
    // create XHR object for ajax request
    var xhr = function() {
        if (typeof XMLHttpRequest !== 'undefined') {
            return new XMLHttpRequest();  
        }
        var versions = [ "MSXML2.XmlHttp.5.0", "MSXML2.XmlHttp.4.0", "MSXML2.XmlHttp.3.0", "MSXML2.XmlHttp.2.0", "Microsoft.XmlHttp" ];

        var xhr;
        for(var i = 0; i < versions.length; i++) {
            // try to initialize one version of Microsoft XHR
            try {
                xhr = new ActiveXObject(versions[i]);
                break; // of course break here when initializing succeeded
            } catch (e) { }
        }
        return xhr;
    };

    // declare id for jsonp callback
    var jsonpId = 0;
    
    // ajax method
    // 2 parameters are enough for ajax: url and data
    // all other parameters can be set after this method with fluent API
    var ajax = this.ajax = function(url, data, method, async) {
        method = method || 'GET';               // default value for method is "GET"
        async = isNotNull(async)? async: true;  // default value for asynchronous is true
        var jsonp,
            header = {}, parser = null, timeout = null,
            username, password,
            // the promise object to return, user can set a lot of options using this, of course with done and fail
            promise = html.Promise(function(resolve, reject) {
                // process jsonp first if there come a jsonp callback
                if(jsonp) {
                    // create script node to load resource from another server
                    var src = url + (/\?/.test(url)? "&" : "?"),
                        head = document.getElementsByTagName('head')[0],
                        newScript = document.createElement('script'),
                        params = [],
                        param_name = "";
                    jsonpId++;
                    // save the reference of jsonp callback
                    html.ajax['jsonpId' + jsonpId] = jsonp;
                    data = data || {};
                    // append callback to data
                    data.callback = "html.ajax.jsonpId" + jsonpId;
                    // append all parameters to the url
                    for(param_name in data) {
                        params.push(param_name + "=" + encodeURIComponent(data[param_name]));
                    }
                    src += params.join("&");
                    newScript.type = "text/javascript";  
                    newScript.src = src;
                    head.appendChild(newScript);
                    // save the callback id to element's expando
                    // this action for removing callback function after load script
                    html(newScript).expando('jsonpId', jsonpId);
                    
                    // the event when script loaded and execute success
                    var scriptLoaded = function () {
                        //remove the node after finish loading
                        newScript.parentElement.removeChild(newScript);
                        // remove reference of jsonp callback
                        var jsonpId = html(newScript).expando('jsonpId');
                        html.ajax['jsonpId' + jsonpId] = undefined;
                        // set the script node null, for release memory (I think this doesn't help too much)
                        newScript = null;
                    };
                    // binding load event to the jsonp script node
                    if (newScript.onreadystatechange !== undefined) {
                        newScript.onload = newScript.onreadystatechange = function () {
                            if (this.readyState == 'complete' || this.readyState == 'loaded') {
                                scriptLoaded();
                            }
                        };
                    } else {
                        html.bind(newScript, 'load', scriptLoaded);
                    }
                    return;
                }
                var x = xhr();                                      // init XHR object
                x.open(method, url, async, username, password);     // open connection to server, with username, password if possible
                x.onreadystatechange = function() {
                    if (x.readyState == 4 && x.status === 200) {
                        var res;
                        try {
                            // give parser a try
                            res = isNotNull(parser)? parser(x.responseText || x.responseXML): x.responseText || responseXML;
                        } catch (e) {
                            // reject the promise if the parser not work
                            reject('Invalid data type.');
                        }
                        // call resolve method when the ajax request success
                        resolve(res);
                    } else {
                        // call reject method when the ajax request fail
                        reject(x);
                    }
                };
                // set header for the request if possible
                // loop through the values inside header object and set to request header
                for(var h in header) {
                    x.setRequestHeader(h, header);
                }
                if (timeout && timeout > 0) {
                    // handle time out exception defined by user
                    x.timeout = timeout;
                    x.ontimeout = function() { reject('timeout'); };
                }
                // send the request
                // cross origin exception will throw if trying to get a resource in another server
                x.send(data);
            });
        
        // modified method to get/post
        promise.get = function() {
            method = 'GET';
            return this;
        };
        // modified method to get/post
        promise.post = function() {
            method = 'POST';
            return this;
        };
        // cross domain purpose
        // can't use jsonp any more, because of jsonp's nature
        // jsonp callback was padding to the result (aka hard code)
        promise.jsonp = function(callback) {
            jsonp = callback;
            delete promise.jsonp;
            return this;
        };
        // authenticate request with username and password (optional)
        promise.authenticate = function(user, pass) {
            username = user;
            password = pass;
            return this;
        };
        // set header for a request
        // note that I extend the header object instead of replace it
        // so that we can call this method so many times
        promise.header = function(key, arg) {
            if (arg !== undefined && isString(key)) {
                header[key] = arg;
            } else {
                html.extend(header, key);
            }
            return this;
        };
        // set header for a request
        // note that I extend the header object instead of replace it
        // so that we can call this method so many times
        promise.async = function(isAsync) {
            async = isAsync;
            return this;
        };
        promise.parser = function(p) {
            parser = p;
            return this;
        };
        promise.timeout = function(miliseconds) {
            timeout = miliseconds;
            return this;
        };
        promise.contentType = function(contentType) {
            html.extend(header, {'Content-type': contentType});
            return this;
        };
        
        return promise;
    };

    // parser for JSON logic borrowed from jQuery
    var parseJSON = JSON && JSON.parse || function(data) {
        if (data === null) {
            return data;
        }

        if (typeof data === 'string') {

            // Make sure leading/trailing white-space is removed (IE can't handle it)
            data = trim( data );

            if (data) {
                // Make sure the incoming data is actual JSON
                // Logic borrowed from http://json.org/json2.js
                if (/^[\],:{}\s]*$/
                    .test(data.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

                    return ( new Function( "return " + data ) )();
                }
            }
        }
        return null;
    };
    
    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }
    var stringify = JSON && JSON.stringify || function (obj) {
        var t = typeof (obj);
        if (t != 'object' || obj === null) {
            // simple data type
            if (html.isString(t)) obj = '"'+obj+'"';
            // Date type
            if (html.isDate(t)) obj = '"' +
                obj.getUTCFullYear()       + '-' +
                f(obj.getUTCMonth() + 1)   + '-' +
                f(obj.getUTCDate())        + 'T' +
                f(obj.getUTCHours())       + ':' +
                f(obj.getUTCMinutes())     + ':' +
                f(obj.getUTCSeconds())     + 'Z' +'"';
            return String(obj);
        } else {
            // recursive array or object
            // this method is similar to serialize
            var n, v, json = [], arr = (obj && isArray(obj));
            
            for (n in obj) {
                v = obj[n]; t = typeof(v);
                if (t == 'string') v = '"'+v+'"';
                else if (t == 'object' && v !== null) v = stringify(v);
                json.push((arr ? "" : '"' + n + '":') + String(v));
            }
            return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
        }
    };
    
    if(!JSON) window.JSON = JSON = { parse: parseJSON, stringify: stringify };
    
    // create shorthand for request JSON format with 'GET' method
    this.getJSON = function(url, data, async) {
        var query = [];
        for (var key in data) {
            // get all parameters and append to query url
            query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
        }
        // do ajax request, and pass JSON parser for user
        // return a promise to user
        return ajax(url + '?' + query.join('&'), null, 'GET', async)
            .parser(parseJSON);
    };

    // create shorthand for request JSON format with 'POST' method
    this.postJSON = function(url, data, async) {
        // do ajax request, and pass JSON parser for user
        // return a promise to user
        return ajax(url, stringify(data), 'POST', async)
            .header({ 'Content-type': 'application/json' })
            .parser(parseJSON);
    };
    
    // load partial view, append to container
    // we can use this function with router
    this.partial = function (url, containerSelector) {
        // execute the selector before loading partial view
        isNotNull(containerSelector) && html(containerSelector);
        var ele = html.element(), scripts = [], doneActions = [];
        
        // call the ajax for loading partial
        var promise = ajax(url);
        promise.done(function (view) {
            // empty the element before append partial
            html(ele).empty();
            // append the view to container
            ele.innerHTML = view;
            // set all element's id to html.id - avoid magic string
            html.query('[id]', ele).each(function (item) {
                html.id[item.id] = '#' + item.id;
            });
            ele = null; // remove reference for avoiding memory leak
            // execute the script loading function
            var scriptLoaded = scripts && html.scripts.render(scripts.shift());
            while (scripts.length) scriptLoaded.then(scripts.shift());
            scriptLoaded.done(function () {
                // execute all done actions callback here
                doneActions && html.array.each.call(doneActions, function(f) {f && f(view);});
            });
        });
        // load bundle/script after load partial
        // for simplicity, this action only run once
        // user needs to register bundle or just loads one script with this function
        promise.scripts = function (bundle) {
            scripts.push(bundle); // save the bundle
            return promise;
        };
        // override done action
        // we will call all done actions after loading partial view and scripts
        promise.done = function (action) {
            if (isFunction(action)) {
                // only push the callback to the queue if it is a function
                doneActions.push(action);
            }
            return promise;
        };
        return promise;
    };
    
}).call(html);

/* END OF AJAX MODULE */

/* IMPORT EXPORT */
(function () {
    var managedObjs = {};
    
    // import / export an object to outside environment
    this.module = function (key, obj) {
        if (isNoU(obj)) {
            // test if the keys is kind of Array
            // turn it into Array anyway
            var isArr = isArray(key),
                res   = [];
            key = isArr? key: [key];
            for (var i = 0, j = key.length; i < j; i++) {
                // get values by its key in managedObjs
                res.push(managedObjs[key[i]]);
            }
            return isArr? res: res[0];
        }
        // set the key and value to export
        managedObjs[key] = obj;
        return this;
    };
}).call(html);
/* END OF IMPORT EXPORT */

// call the ready function to load all id, set them to html.id
// this is for avoiding hard code for id
html.ready(function () {
    html.query('[id]').each(function (item) {
        html.id[item.id] = '#' + item.id;
    });
});

return html;
}));